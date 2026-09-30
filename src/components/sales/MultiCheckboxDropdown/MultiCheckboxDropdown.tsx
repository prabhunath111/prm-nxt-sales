/**
 * A MultiCheckboxDropdown component for selecting multiple items from a dropdown menu.
 *
 * @module components/MultiCheckboxDropdown
 * @memberof CommonComponent
 */

import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Pressable, ScrollView, View, ViewStyle } from 'react-native';
import Text from 'components/sales/Text';
import Modal, { ModalPlacement } from 'components/sales/Modal';
import Image from 'components/sales/Image';
import TextInput from 'components/sales/TextInput';
import { Colors, Sizing } from 'styles';
import actions from 'store/sales/actions/form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { DROPDOWN, ICONS, STATE_KEY, STRINGS } from 'const';
import Checkbox from 'components/sales/Checkbox';
import { isAndroid, isiOS } from 'utils/platformHelper';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import styles from './MultiCheckboxDropdown.styles';

export interface DataItem {
  id: string | number;
  name: string;
  nameNT?: string;
  object?: any;
}

/**
 * Type definitions for MultiCheckboxDropdown props.
 *
 * @param {Object} props - Props passed to the component.
 * @param {string} [props.queryParams] - Query parameters for fetching dropdown options dynamically.
 * @param {string} [props.queryName] - Name of the query used to fetch dropdown options from the store.
 * @param {Array.<{id: string, name: string}>} [props.data=[]] - Static data to display in the dropdown.
 * @param {function(Array.<{id: string, name: string}>): void} [props.onSelect] - Callback function triggered when items are selected.
 * @param {DimensionValue} [props.modalHeight='auto'] - Height of the dropdown modal.
 * @param {DimensionValue} [props.modalWidth] - Width of the dropdown modal. Defaults to parent container width.
 * @param {Array<DataItem>} [props.selectedValues=[]] - Preselected values for the dropdown.
 * @param {string} [props.error] - Error message to display below the dropdown.
 * @param {ViewStyle} [props.innerContainerStyle] - Additional styles for the inner container.
 * @param {string} [props.placeholder=DROPDOWN.SELECT] - Placeholder text for the input field.
 * @param {boolean} [props.isDisabled=false] - Disables the dropdown if set to `true`.
 * @param {object} [props.inputFieldStyle] - Custom styles for the input field.
 * @param {string} [props.placeholderTextColor=Colors.violet.v300] - Custom placeholder text color.
 * @param {object} [props.iconStyle] - Custom styles for the dropdown icon.
 * @param {string} [props.stateKey=STATE_KEY.FORM_STATE] - Redux state key for accessing dropdown options.
 */

interface MultiCheckboxDropdownProps {
  queryParams?: string;
  queryName?: string;
  data?: Array<{ id: string; name: string }>;
  onSelect?: (selectedValues: Array<DataItem>) => void;
  selectedValues?: Array<DataItem>;
  error?: string;
  innerContainerStyle?: ViewStyle;
  placeholder?: string;
  isDisabled?: boolean;
  inputFieldStyle?: object;
  placeholderTextColor?: string;
  iconStyle?: object;
  stateKey?: string;
}

/**
 * Represents a MultiCheckboxDropdown component.
 *
 * @param {MultiCheckboxDropdownProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered MultiCheckboxDropdown component.
 *
 * @example
 * <MultiCheckboxDropdown
 *   title="Select Fruits"
 *   options={[{ label: 'Apple', value: 'apple' }, { label: 'Orange', value: 'orange' }]}
 *   selectedOptions={['apple']}
 *   onSelectionChange={(selected) => console.log(selected)}
 * />
 */

const MultiCheckboxDropdown = ({
  queryName = '',
  queryParams = '',
  data = [],
  onSelect,
  selectedValues = [],
  error,
  innerContainerStyle,
  placeholder = DROPDOWN.SELECT,
  isDisabled = false,
  inputFieldStyle,
  placeholderTextColor = Colors.violet.v300,
  iconStyle,
  stateKey = STATE_KEY.FORM_STATE,
}: MultiCheckboxDropdownProps) => {
  const dropDownRef: MutableRefObject<null> = useRef(null);
  const [visible, setVisible] = useState(false);
  const [optionData, setOptionData] = useState(data);
  const [parentWidth, setParentWidth] = useState(0);

  const [selectedItems, setSelectedItems] = useState<Array<DataItem>>(selectedValues ?? []);

  const dispatch = useDispatch<AppDispatch>();
  const { dropdownOptions } = useSelector((state: RootState) => state.form[stateKey]);

  useEffect(() => {
    if (!dropdownOptions[queryName] && queryParams && queryName) {
      dispatch(actions.fetchOptionData({ [queryParams]: queryParams }, queryName));
    }
  }, [queryParams, queryName]);

  useEffect(() => {
    if (queryName === STRINGS.ACCOUNT_STATUS_FILTER || queryName === STRINGS.BOX_TYPE_FILTER) {
      dispatch(actions.fetchOptionData({ [queryParams]: queryParams }, queryName));
    }
  }, []);

  useEffect(() => {
    if (!Array.isArray(selectedValues)) {
      setSelectedItems([]);
    } else if (JSON.stringify(selectedItems) !== JSON.stringify(selectedValues)) {
      setSelectedItems(selectedValues);
    }
  }, [selectedValues]);

  useEffect(() => {
    if (dropdownOptions[queryName]?.length > 0) {
      setOptionData(dropdownOptions[queryName]);
    } else if (data.length > 0) {
      setOptionData(data);
    }
  }, [dropdownOptions[queryName], data]);

  const toggleDropdown = (): void => {
    setVisible((prev) => !prev);
  };

  const onItemPress = (item: DataItem): void => {
    const isSelected = selectedItems.some((selected) => selected?.id === item.id);
    let updatedSelection: DataItem[] = [];

    if (item.name === STRINGS.ALL || item.nameNT === STRINGS.ALL) {
      updatedSelection = isSelected ? [] : [...optionData];
    } else {
      updatedSelection = isSelected ? selectedItems.filter((selected) => selected?.id !== item.id) : [...selectedItems, item];

      if (selectedItems.some((selected) => selected?.name === STRINGS.ALL)) {
        updatedSelection = updatedSelection.filter((selected) => selected.name !== STRINGS.ALL);
      }
      const allItemsExceptAll = optionData.filter((opt) => opt.name !== STRINGS.ALL);
      if (updatedSelection.length === allItemsExceptAll.length) {
        updatedSelection.push(optionData.find((opt) => opt.name === STRINGS.ALL)!);
      }
    }
    setSelectedItems(updatedSelection);
    onSelect?.(updatedSelection);
  };

  const DropdownOptionList = () => (
    <ScrollView style={styles.listContainer}>
      {optionData.map((item: any) => (
        <Checkbox label={item.name} value={selectedItems?.some((selected) => selected?.id === item.id)} onValueChange={() => onItemPress(item)} key={item.id} />
      ))}
    </ScrollView>
  );

  const WebDropdownOptionList = () => (
    <Modal
      isVisible={visible}
      modalTarget={dropDownRef}
      height="auto"
      width={parentWidth}
      placementType={[ModalPlacement.BOTTOM, ModalPlacement.TOP]}
      arrowShift={0.9}
      onClose={() => setVisible(false)}
      popoverStyle={{ marginTop: isAndroid() || isiOS() ? -(getFullScreenHeight() * 0.05) : Sizing.x0 }}
    >
      <ScrollView style={styles.listContainerWeb}>
        {optionData.map((item: any) => (
          <Checkbox label={item.name} value={selectedItems?.some((selected) => selected?.id === item.id)} onValueChange={() => onItemPress(item)} key={item.id} />
        ))}
      </ScrollView>
    </Modal>
  );

  const renderModalDropdown = () => {
    if (!visible || optionData.length === 0) return null;
    const isMobile = isiOS() || isAndroid();
    return isMobile ? <DropdownOptionList /> : <WebDropdownOptionList />;
  };

  const getSelectedLabels = (): string => (selectedItems.length > 0 ? selectedItems.map((item) => item?.name)?.join(', ') : placeholder);

  return (
    <View style={styles.container} testID="MultiCheckboxDropdown-test-container">
      <View
        style={[styles.innerContainer, innerContainerStyle]}
        ref={dropDownRef}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setParentWidth(width);
        }}
      >
        <Pressable onPress={toggleDropdown} ref={dropDownRef} style={[styles.pressableStyle, isDisabled && { backgroundColor: Colors.neutral.g200 }]} disabled={isDisabled}>
          <TextInput
            inputFieldStyle={[styles.inputStyle, inputFieldStyle]}
            value={getSelectedLabels()}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            editable={false}
          />
          <View style={styles.icon}>
            <Image iconName={visible ? ICONS.PINK_CHEVRON_UP : ICONS.PINK_CHEVRON_DOWN} height={Sizing.layout.x1Dot5} width={Sizing.layout.x1Dot5} style={iconStyle} />
          </View>
        </Pressable>
      </View>
      {renderModalDropdown()}
      {error && <Text style={styles.errorStyle} label={error} color={Colors.error.primary} />}
    </View>
  );
};

export default MultiCheckboxDropdown;
