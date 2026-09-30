/**
 * A MultiCheckbox component for selecting multiple items
 *
 * @module components/MultiCheckbox
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from 'components/sales/Checkbox';
import Text from 'components/sales/Text';
import { STRINGS, STATE_KEY } from 'const';
import { RootState, AppDispatch } from 'store';
import actions from 'store/sales/actions/form';
import { Colors } from 'styles';
import styles from './MultiCheckbox.styles';

export interface DataItem {
  id: string | number;
  name: string;
  object?: any;
}

/**
 * Component type definitions
 *
 * @typedef {object} MultiCheckboxProps
 * @property {Array<{ id: string | number, name: string }>} [data] - Optional static items to display as checkboxes
 * @property {Array<{ id: string | number, name: string }>} [selectedValues] - Preselected values
 * @property {(selected: Array<{ id: string | number, name: string }> | null) => void} [onSelect] - Callback when selection changes
 * @property {string} [queryName] - Redux key to fetch dynamic data
 * @property {string} [queryParams] - Params used when fetching dropdown options
 * @property {string} [stateKey] - Redux state key (default: STATE_KEY.FORM_STATE)
 */

export type MultiCheckboxProps = {
  data?: Array<{ id: string | number; name: string }>;
  selectedValues?: Array<{ id: string | number; name: string }> | null;
  onSelect?: (selectedValues: Array<DataItem> | null) => void;
  queryName?: string;
  queryParams?: string;
  stateKey?: string;
  error?: string;
};

const MultiCheckbox = ({ data = [], error, selectedValues, onSelect, queryName = '', queryParams = '', stateKey = STATE_KEY.FORM_STATE }: MultiCheckboxProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { dropdownOptions } = useSelector((state: RootState) => state.form[stateKey]);

  const dynamicOptions = dropdownOptions?.[queryName] ?? [];
  const optionData = dynamicOptions.length > 0 ? dynamicOptions : data;

  const [selectedItems, setSelectedItems] = useState<Array<DataItem>>(selectedValues ?? []);

  useEffect(() => {
    if (!dropdownOptions[queryName] && queryParams && queryName) {
      dispatch(actions.fetchOptionData({ [queryParams]: queryParams }, queryName));
    }
  }, [queryParams, queryName]);

  useEffect(() => {
    if (Array.isArray(selectedValues)) {
      setSelectedItems(selectedValues);
    } else if (!selectedValues) {
      setSelectedItems([]);
    }
  }, [selectedValues]);

  const handlePress = (item: { id: string | number; name: string }) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id);

    let updatedSelection: DataItem[];

    if (item.name === STRINGS.ALL || item.id === STRINGS.ALL.toLocaleLowerCase()) {
      updatedSelection = isSelected ? [] : [...optionData];
    } else {
      updatedSelection = isSelected ? selectedItems.filter((selected) => selected.id !== item.id) : [...selectedItems, item];

      if (selectedItems.some((s) => s.name === STRINGS.ALL)) {
        updatedSelection = updatedSelection.filter((s) => s.name !== STRINGS.ALL);
      }

      const nonAllItems = optionData.filter((d: { id: string | number; name: string }) => d.name !== STRINGS.ALL);
      const allSelected = nonAllItems.every((opt: { id: string | number; name: string }) => updatedSelection.some((sel) => sel.id === opt.id));

      if (allSelected) {
        const allItem = optionData.find((d: { id: string | number; name: string }) => d.name === STRINGS.ALL);
        if (allItem) updatedSelection.push(allItem);
      }
    }

    onSelect?.(updatedSelection.length === 0 ? null : updatedSelection);
  };

  const safeData = Array.isArray(optionData) ? optionData : [];

  return (
    <View style={styles.container}>
      {safeData.map((item) => (
        <View style={styles.checkboxWrapper}>
          <Checkbox key={item.id} label={item.name} value={selectedItems.some((sel) => sel.id === item.id)} onValueChange={() => handlePress(item)} />
        </View>
      ))}
      {error && <Text style={styles.errorText} label={error} color={Colors.error.primary} />}
    </View>
  );
};

export default MultiCheckbox;
