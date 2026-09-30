/**
 * Optimized Dropdown Component – Works on Android/Web/iOS
 */

import React, { useRef, useState, useEffect, useCallback, MutableRefObject } from 'react';
import { Keyboard, Pressable, TouchableOpacity, View, ViewStyle } from 'react-native';

import Text from 'components/sales/Text';
import List from 'components/sales/List';
import Image from 'components/sales/Image';
import TextInput from 'components/sales/TextInput';

import { Colors, Sizing } from 'styles';
import actions from 'store/sales/actions/form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';

import { DROPDOWN, ICONS, PROPERTIES, STATE_KEY } from 'const';
import { ParentObject } from 'store/sales/types/common';
import Modal, { ModalPlacement } from 'components/sales/Modal';

import { isAndroid, isiOS } from 'utils/platformHelper';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { useTranslation } from 'react-i18next';
import styles from './Dropdown.styles';

export interface DataItem {
  id?: string;
  name?: string | number;
  nameNT?: string | number;
  subName?: string;
  object?: any;
  label?: string;
  value?: string | number;
}
export interface DropdownProps {
  queryParams?: string;
  queryName?: string;
  data?: DataItem[];
  onSelect?: (value: DataItem | null) => void;
  selectedValue?: ParentObject | null;
  error?: string;
  id?: string;
  innerContainerStyle?: ViewStyle;
  placeholder?: string;
  isDisabled?: boolean;
  inputFieldStyle?: object;
  placeholderTextColor?: string;
  iconStyle?: object;
  stateKey?: string;
  required?: boolean;
  defaultSelectedValue?: string | number;
  isScroll?: boolean;
  isMultiline?: boolean;
  hasStaticValues?: boolean;
  testID?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  queryName = '',
  queryParams = '',
  data = [],
  onSelect,
  selectedValue,
  error,
  id,
  innerContainerStyle,
  placeholder = DROPDOWN.SELECT,
  isDisabled = false,
  inputFieldStyle,
  placeholderTextColor = Colors.violet.v300,
  iconStyle,
  stateKey = STATE_KEY.FORM_STATE,
  required = false,
  isScroll = true,
  defaultSelectedValue,
  isMultiline,
  hasStaticValues = false,
  testID,
}) => {
  const { t } = useTranslation();
  const dropDownRef: MutableRefObject<null> = useRef(null);
  const [visible, setVisible] = useState(false);
  const [optionData, setOptionData] = useState<DataItem[]>(data);
  const [parentWidth, setParentWidth] = useState(0);

  //  This is the only source of truth for input text
  const [displayValue, setDisplayValue] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { dropdownOptions } = useSelector((state: RootState) => state.form[stateKey]);

  /* -------------------------------------------------------------------------- */
  /*                             DATA LOADING EFFECT                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!dropdownOptions[queryName] && queryParams && queryName) {
      dispatch(actions.fetchOptionData({ [queryParams]: queryParams }, queryName));
    }
  }, [queryParams, queryName, dispatch]);

  useEffect(() => {
    if (dropdownOptions[queryName]?.length > 0) {
      setOptionData(dropdownOptions[queryName]);
    } else if (data?.length > 0 && JSON.stringify(optionData) !== JSON.stringify(data)) {
      setOptionData(data);
    }
  }, [dropdownOptions, data, queryName]);

  /* -------------------------------------------------------------------------- */
  /*                            SELECTED VALUE FORMAT                           */
  /* -------------------------------------------------------------------------- */

  const formatValue = useCallback(
    (item: ParentObject | null): string => {
      if (!item) return '';

      if (item.subName) return `${item.name} - ${item.subName}`;
      if (PROPERTIES.DROPDOWN_QUERY_NAME.includes(queryName)) return String(item.nameNT ?? item.name ?? '');
      return String(item.name ?? item.label ?? '');
    },
    [queryName],
  );

  useEffect(() => {
    setDisplayValue(formatValue(selectedValue ?? null));
  }, [selectedValue, formatValue]);

  /* -------------------------------------------------------------------------- */
  /*                            DEFAULT VALUE ON FIRST LOAD                     */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (defaultSelectedValue && optionData?.length > 0 && !displayValue) {
      const found = optionData.find((v: ParentObject) => String(v?.object?.value) === String(defaultSelectedValue));
      if (found) onSelect?.(found);
    }
  }, [defaultSelectedValue, optionData, displayValue, onSelect]);

  /* -------------------------------------------------------------------------- */
  /*                                TOGGLE DROPDOWN                             */
  /* -------------------------------------------------------------------------- */

  const toggleDropdown = () => {
    if (isDisabled) return;

    Keyboard.dismiss();

    setTimeout(
      () => {
        setVisible((prev) => !prev);
      },
      isiOS() ? 200 : 80,
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                SELECT OPTION                               */
  /* -------------------------------------------------------------------------- */

  const handleSelect = (item: DataItem) => {
    const formatted = formatValue(item);
    setDisplayValue(formatted);
    setVisible(false);
    onSelect?.(item);
  };

  /* -------------------------------------------------------------------------- */
  /*                                    UI                                      */
  /* -------------------------------------------------------------------------- */
  const DropdownOptionList = () => (
    <View style={styles.listContainer}>
      <List
        nestedScrollEnabled
        style={styles.listNewStyle}
        data={optionData}
        maxHeight={Sizing.layout.x250}
        renderItem={({ item }) => {
          let itemValue: string;
          if (item?.subName) {
            itemValue = `${item.name} - ${item.subName}`;
          } else if (hasStaticValues) {
            itemValue = t(`strings.${item.name}`);
          } else {
            itemValue = item.name;
          }
          return (
            <TouchableOpacity style={[styles.listStyle, itemValue === displayValue && styles.selectedItem]} onPress={() => handleSelect(item)}>
              <Text
                label={itemValue}
                style={[
                  styles.labelStyle,
                  {
                    color: itemValue === displayValue ? Colors.neutral.white : Colors.neutral.black,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={isScroll}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
      />
    </View>
  );

  const WebDropdownOptionList = () => (
    <Modal
      isVisible={visible}
      modalTarget={dropDownRef}
      modalStyle={styles.zIndexStyle}
      height="auto"
      width={parentWidth}
      placementType={[ModalPlacement.BOTTOM, ModalPlacement.TOP]}
      popoverStyle={{ marginTop: isAndroid() ? -(getFullScreenHeight() * 0.05) : 0 }}
      onClose={() => setVisible(false)}
    >
      <View style={styles.listContainerWeb}>
        <List
          nestedScrollEnabled
          data={optionData}
          maxHeight={Sizing.layout.x250}
          renderItem={({ item }) => {
            let itemValue: string;
            if (item?.subName) {
              itemValue = `${item.name} - ${item.subName}`;
            } else if (hasStaticValues) {
              itemValue = t(`strings.${item.name}`);
            } else {
              itemValue = item.name;
            }
            return (
              <TouchableOpacity style={[styles.listStyle, itemValue === displayValue && styles.selectedItem]} onPress={() => handleSelect(item)}>
                <Text
                  label={itemValue}
                  style={[
                    styles.labelStyle,
                    {
                      color: itemValue === displayValue ? Colors.neutral.white : Colors.neutral.black,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={isScroll}
          keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        />
      </View>
    </Modal>
  );

  const modalDropdown = () => {
    if (!visible || optionData.length === 0) return null;
    const isMobile = isiOS() || isAndroid();
    return isMobile ? <DropdownOptionList /> : <WebDropdownOptionList />;
  };

  return (
    <View style={styles.container} testID={testID ?? 'dropdown-test-container'}>
      <View style={[styles.innerContainer, innerContainerStyle]} ref={dropDownRef} onLayout={(e) => setParentWidth(e.nativeEvent.layout.width + 12)}>
        <Pressable onPress={toggleDropdown} style={styles.pressableStyle}>
          {required && <Text style={[styles.label, styles.required]}>* </Text>}

          <TextInput
            id={id}
            value={hasStaticValues && displayValue ? t(`strings.${displayValue}`) : displayValue}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            inputFieldStyle={[styles.inputStyle, inputFieldStyle]}
            editable={false}
            multiline={isMultiline}
          />

          <View style={styles.icon}>
            <Image iconName={visible ? ICONS.PINK_CHEVRON_UP : ICONS.PINK_CHEVRON_DOWN} height={Sizing.layout.x1Dot5} width={Sizing.layout.x1Dot5} style={iconStyle} />
          </View>
        </Pressable>
      </View>

      {modalDropdown()}

      {error && <Text id={`${id}error`} style={styles.errorText} color={Colors.error.primary} label={error} />}
    </View>
  );
};

export default React.memo(Dropdown);
