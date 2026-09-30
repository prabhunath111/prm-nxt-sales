/**
 * This component renders a group of pill buttons based on the provided array of items.
 * Each pill is clickable and triggers a callback function when pressed.
 *
 * @module components/PillsGroup
 * @memberof CommonComponent
 */

import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Text from 'components/sales/Text';
import { Sizing } from 'styles';
import List from 'components/sales/List';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { STATE_KEY } from 'const';
import styles from './PillsGroup.styles';

/**
 * Component type definitions
 *
 * @typedef {object} PillsGroupProps
 * @property {string[]} itemsArr - Array of strings to render as pills
 * @property {function} onPillPress - Callback function to be triggered when a pill is pressed
 */

export type PillsGroupProps = {
  itemsArr: string[];
  onPillPress: (text: string) => void;
  selectedPillText?: string;
  defaultSelected?: boolean;
  stateKey?: string;
  itemStyles?: object;
  showsHorizontalScrollIndicator?: boolean;
  testID?: string;
};

/**
 * PillsGroup component
 *
 * Renders a group of pills, each of which is pressable and triggers the provided callback.
 *
 * @param {PillsGroupProps} props - The properties for the PillsGroup component
 * @returns {JSX.Element} The rendered PillsGroup component
 *
 * @example
 * <PillsGroup
 *   itemsArr={['Item 1', 'Item 2', 'Item 3']}
 *   onPillPress={(item) => console.log(item)}
 * />
 */

const PillsGroup = ({
  itemsArr,
  onPillPress,
  selectedPillText,
  defaultSelected,
  stateKey = STATE_KEY.FORM_STATE,
  itemStyles,
  showsHorizontalScrollIndicator = false,
  testID = 'pillsGroupTest',
}: PillsGroupProps) => {
  const { pillGroupItemsArr } = useSelector((state: RootState) => state.form[stateKey]);
  const dataArr: any = itemsArr || pillGroupItemsArr || [];
  const hasObject = dataArr?.some((i: any) => i && typeof i === 'object' && !Array.isArray(i));

  const PillItem = ({ item, isSelected }: { item: any; isSelected: boolean }) => (
    <Pressable style={[styles.pillContainerStyle, itemStyles, isSelected && styles.selectedPillContainer]} testID={testID}>
      <Text style={[styles.pillText, isSelected && styles.selectedPillText]} minFontSize={Sizing.layout.x12} onPress={() => onPillPress(hasObject ? item.offerCategoryNT : item)}>
        {hasObject ? item.offerCategory : item}
      </Text>
    </Pressable>
  );

  useEffect(() => {
    if (defaultSelected) {
      const item = hasObject ? dataArr[0].offerCategoryNT : dataArr[0];
      setTimeout(() => {
        onPillPress(item);
      }, 10);
    }
  }, []);

  return (
    <List
      testID={testID}
      data={dataArr}
      containerStyle={styles.containerStyle}
      contentContainerStyle={styles.contentContainerStyle}
      horizontal
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      renderItem={({ item }) => {
        const isSelected = hasObject ? item.offerCategoryNT === selectedPillText : item === selectedPillText;

        return <PillItem item={item} isSelected={isSelected} />;
      }}
    />
  );
};

export default PillsGroup;
