/**
 * A list of selectable items.
 *
 * @module components/SelectList
 * @memberof CommonComponent
 */

import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, ViewStyle } from 'react-native';
import Text from 'components/sales/Text';
import List from 'components/sales/List';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useTranslation } from 'react-i18next';
import { Colors } from 'styles';
import { ParentObject } from 'store/sales/types/common';
import styles from './SelectList.styles';

/**
 * Component type definitions
 *
 * @typedef {object} SelectListProps
 * @property {function} onSelect - Function to call when an item is selected
 * @property {string} [headingText] - The heading text for the component
 * @property {string} [error] - The error text for the component
 */

export type SelectListProps = {
  onSelect: (item: any) => void;
  headingText?: string;
  error?: string;
  listContainerStyle?: ViewStyle;
};

/**
 * Represents a SelectList component
 *
 * @param {SelectListProps} props - React properties passed from composition
 * @param {function} props.onSelect - Function to call when an item is selected
 * @param {string} [props.headingText] - The heading text for the component
 * @returns {JSX.Element} The rendered SelectList component
 *
 * @example
 * const data = [
 *   { TskSno: '1', VCType: 'Type A', status: 'Pending' },
 *   { TskSno: '2', VCType: 'Type B', status: 'Completed' }
 * ];
 *
 * <SelectList
 *   headingText="My Heading"
 *   onSelect={(item) => console.log(item)}
 * />
 */

const SelectList = ({ onSelect, headingText, error, listContainerStyle }: SelectListProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { data: tskData } = useSelector((state: RootState) => state.tskRefund);
  const { t } = useTranslation();
  const data = tskData?.TskDetails;

  const handleSelect = (index: number, item: ParentObject) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      onSelect(null);
    } else {
      setSelectedIndex(index);
      onSelect(item);
    }
  };

  const renderItem = ({ item, index }: { item: ParentObject; index: number }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.TskSno} - {item.VCType} - {item.status}
      </Text>
      <TouchableOpacity style={[styles.button, selectedIndex === index ? styles.selectedButton : styles.deselectedButton]} onPress={() => handleSelect(index, item)}>
        <Text style={styles.buttonText}>{selectedIndex === index ? 'X' : t('strings.select')}</Text>
      </TouchableOpacity>
    </View>
  );

  return data?.length > 0 ? (
    <View style={styles.container} testID="selectlist-test">
      {headingText && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{headingText}</Text>
        </View>
      )}
      <ScrollView style={[styles.listContainer, listContainerStyle]}>
        <List data={data} renderItem={renderItem} bounces={false} showsVerticalScrollIndicator={false} />
      </ScrollView>

      {error && <Text style={styles.errorText} label={error} color={Colors.error.primary} />}
    </View>
  ) : (
    <View testID="selectlist-test" />
  );
};

export default SelectList;
