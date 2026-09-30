import React, { useRef, useState, useEffect, useMemo, useCallback, MutableRefObject } from 'react';
import { Pressable, TouchableOpacity, View, ViewStyle, ListRenderItemInfo } from 'react-native';

import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import List from 'components/sales/List';
import TextInput from 'components/sales/TextInput';
import { Colors, Sizing } from 'styles';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { DROPDOWN, ICONS, PROPERTIES, STATE_KEY, STRINGS } from 'const';
import { useTranslation } from 'react-i18next';
import { Option, ParentObject } from 'store/sales/types/common';
import { useClickOutside } from 'hooks/useClickOutside';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { sliceActions as commonActions } from 'store/sales/reducer/common';
import { isAndroid, isiOS } from 'utils/platformHelper';
import styles from './Autocomplete.styles';

export interface AutocompleteProps {
  queryParams?: string;
  queryName?: string;
  data?: ParentObject[];
  onSelect?: (item: ParentObject | null) => void;
  selectedValue?: ParentObject | null;
  error?: string;
  id?: string;
  innerContainerStyle?: ViewStyle;
  placeholder?: string;
  isDisabled?: boolean;
  noOptionsText?: string;
  onChangeText?: (value: string) => void;
  containerStyle?: ViewStyle;
  isCloseIconRequired?: boolean;
  stateKey?: string;
  formValues?: ParentObject;
  actionNeeded?: boolean | string;
  isReadOnly?: boolean;
  debounceMs?: number;
  testID?: string;
}

const DEFAULT_DEBOUNCE_MS = 350;

const Autocomplete: React.FC<AutocompleteProps> = ({
  queryName = '',
  queryParams = '',
  data = [],
  onSelect,
  selectedValue = null,
  placeholder = DROPDOWN.SELECT,
  noOptionsText = '',
  error,
  id,
  innerContainerStyle,
  containerStyle,
  isDisabled = false,
  onChangeText,
  isCloseIconRequired = true,
  stateKey = STATE_KEY.FORM_STATE,
  formValues = {},
  actionNeeded = true,
  isReadOnly = false,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  testID,
}) => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();

  const rootRef = useRef<View>(null);
  const debounceTimer = useRef<any>(null);
  const activeQueryId = useRef(0);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState(false);

  const searchSuggestions = useSelector((s: RootState) => s.form[stateKey]?.searchSuggestions ?? {}, shallowEqual);
  const globalDropVisible = useSelector((s: RootState) => s.common.dropdownVisible, shallowEqual);

  const showNoDataText = noOptionsText || t('errors.searchResultText');
  const loadingText = `${t('strings.loading')}...`;

  useClickOutside(rootRef as MutableRefObject<any>, () => setDropdownOpen(false));

  useEffect(() => {
    if (!globalDropVisible) setDropdownOpen(false);
  }, [globalDropVisible]);

  useEffect(() => {
    if (selectedValue?.name) {
      const label = selectedValue.subName ? `${selectedValue.name} - ${selectedValue.subName}` : selectedValue.name;
      setSearchTerm(label);
      setIsTyping(false);
    } else if (!selectedValue) {
      setSearchTerm('');
    }
  }, [selectedValue]);

  const baseList = useMemo(() => {
    const suggestions = searchSuggestions[queryName] ?? [];
    if (queryParams === STRINGS.SEARCH_LOCALLY && suggestions.length > 0) {
      return suggestions;
    }
    return Array.isArray(data) ? data : [];
  }, [searchSuggestions, data, queryParams, queryName]);

  const filteredList = useMemo(() => {
    const suggestions = searchSuggestions[queryName] ?? [];
    if (!isTyping) {
      return baseList;
    }
    // Fix: show suggestions after first remote call when searchTerm is empty
    if (!searchTerm) {
      return suggestions.length ? suggestions : baseList;
    }

    const key = PROPERTIES.PARTNER_QUERY.includes(queryName) ? STRINGS.NAME_NT : STRINGS.NAME;

    return filterByParams(baseList, {
      [key]: searchTerm,
      mobile: searchTerm,
    }) as Option[];
  }, [searchTerm, baseList, queryName, searchSuggestions]);

  const optionsToRender: Option[] = useMemo(() => {
    if (isLoading) return [{ id: 'loading', name: loadingText, disabled: true }];
    if (!filteredList.length) return [{ id: 'nodata', name: showNoDataText, disabled: true }];
    return filteredList;
  }, [filteredList, isLoading, loadingText, showNoDataText]);

  const callRemote = useCallback(
    async (value: string) => {
      if (!queryParams) {
        onChangeText?.(value);
        setIsLoading(false);
        return;
      }

      const localSuggestions = searchSuggestions[queryName] ?? [];
      const isLocalSearch = queryParams === STRINGS.SEARCH_LOCALLY;

      if (isLocalSearch && localSuggestions.length > 0) {
        setIsLoading(false);
        return;
      }

      if (actionNeeded !== true && actionNeeded !== '1') {
        onChangeText?.(value);
        return;
      }

      setIsLoading(true);
      activeQueryId.current += 1;
      const currentId = activeQueryId.current;

      try {
        await dispatch(callAction({ searchText: value, searchKeyword: queryParams, ...formValues }, queryName));
      } catch {
        // ignore errors
      }

      // Prevent stale updates
      if (currentId !== activeQueryId.current) return;

      setIsLoading(false);
    },
    [dispatch, queryParams, onChangeText, actionNeeded, formValues, queryName, searchSuggestions],
  );

  const scheduleQuery = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      setDropdownOpen(true);

      debounceTimer.current = setTimeout(() => {
        callRemote(value);
      }, debounceMs);
    },
    [callRemote, debounceMs],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setIsTyping(true);
      setSearchTerm(value);
      onSelect?.(null);
      scheduleQuery(value);
    },
    [scheduleQuery, onSelect],
  );

  const toggleDropdown = useCallback(() => {
    const nextState = !dropdownOpen;
    setDropdownOpen(nextState);
    dispatch(commonActions.setDropdownVisibility(nextState));

    if (nextState) {
      scheduleQuery('');
    } else {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      activeQueryId.current += 1;
      setIsLoading(false);
    }
  }, [dropdownOpen, dispatch, scheduleQuery]);

  const handleItemPress = useCallback(
    (item: Option) => {
      const label = item.subName ? `${item.name} - ${item.subName}` : item.name;
      setIsTyping(false);
      setSearchTerm(label);
      setDropdownOpen(false);
      onSelect?.(item);
    },
    [onSelect],
  );

  const resetInput = useCallback(() => {
    setSearchTerm('');
    setDropdownOpen(false);
    onSelect?.(null);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    activeQueryId.current += 1;
    setIsLoading(false);
  }, [onSelect]);

  const renderOption = useCallback(
    ({ item, index }: ListRenderItemInfo<Option>) => {
      const label = item.subName ? `${item.name} - ${item.subName}` : item.name;
      const isSelected = searchTerm === label;

      return (
        <TouchableOpacity
          onPress={() => handleItemPress(item)}
          disabled={item.disabled}
          style={[styles.buttonStyle, isSelected && styles.selectedItem]}
          testID={`auto-item-${item.id || item.value || index}`}
        >
          <Text style={[styles.labelStyle, styles[gcs('labelStyle', inflection, true, ['sm', 'xs'])], isSelected && styles.selectedTextStyle]}>{item.name}</Text>

          {item.subName && <Text style={styles.subLabelStyle}>{item.subName}</Text>}
        </TouchableOpacity>
      );
    },
    [handleItemPress, searchTerm, inflection],
  );

  const keyExtractor = useCallback((item: Option, index: number) => `${item?.id ?? item?.name ?? 'no-id'}-${index}`, []);

  return (
    <View ref={rootRef} style={[styles.container, containerStyle]} testID={testID || 'autocomplete-test'}>
      <Pressable style={[styles.innerContainer, innerContainerStyle]} onPress={isDisabled ? undefined : toggleDropdown}>
        <TextInput
          value={searchTerm}
          onInputChange={handleInputChange}
          placeholder={placeholder}
          editable={!isDisabled && !isReadOnly}
          id={id}
          inputFieldStyle={styles.inputStyle}
          autoComplete="off"
          onFocus={() => {
            if ((isAndroid() || isiOS()) && !isDisabled && !dropdownOpen) {
              toggleDropdown();
            }
          }}
        />

        {searchTerm && isCloseIconRequired && !isDisabled && (
          <Pressable onPress={resetInput} style={styles.closeIconStyle}>
            <Image iconName={ICONS.CLOSE} height={Sizing.layout.x1} width={Sizing.layout.x1} />
          </Pressable>
        )}

        <View style={styles.dropdownIcon}>
          <Image iconName={dropdownOpen ? ICONS.PINK_CHEVRON_UP : ICONS.PINK_CHEVRON_DOWN} height={Sizing.layout.x1} width={Sizing.layout.x1} />
        </View>
      </Pressable>

      {dropdownOpen && (
        <View style={styles.listViewStyle}>
          <List data={optionsToRender} renderItem={renderOption} keyExtractor={keyExtractor} style={styles.listStyle} nestedScrollEnabled showsVerticalScrollIndicator />
        </View>
      )}

      {error && <Text id={`${id}error`} style={styles.errorStyle} label={error} color={Colors.error.primary} />}
    </View>
  );
};

export default React.memo(Autocomplete);
