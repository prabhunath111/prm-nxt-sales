import React, { useState } from 'react';
import { Text, FlatList, TouchableOpacity, View } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import { Sizing } from 'styles';
import Image from 'components/sales/Image';
import { ICONS } from 'const';
import styles from './MultiFilters.styles';

/**
 * Component type definitions
 *
 * @typedef {object} MultiFiltersProps
 * @property {object} [data] - The data object containing filter options and their related information.
 * @property {function} [onSelectionChange] - Callback function invoked when the selection of filters changes. It receives the updated selected filters as its argument.
 * @property {array} [selectedFilter] - An array of selected filter values representing the currently applied filters.
 */

type FilterItem = {
  id: string;
  name: string;
  secondaryName?: string;
};

type FilterCategoryKey = 'languages' | 'genre' | 'boxType';

export type MultiFiltersProps = {
  data: ParentObject;
  selectedLanguages: FilterItem[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<FilterItem[]>>;
  selectedGenre: FilterItem[];
  setSelectedGenre: React.Dispatch<React.SetStateAction<FilterItem[]>>;
  selectedBoxType: FilterItem[];
  setSelectedBoxType: React.Dispatch<React.SetStateAction<FilterItem[]>>;
};

/**
 * Represents a MultiFilters component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered MultiFilters component
 *
 * @example
 * <MultiFilters text="Hello World!" />
 */

const MultiFilters = ({ data, selectedLanguages, setSelectedLanguages, selectedGenre, setSelectedGenre, selectedBoxType, setSelectedBoxType }: MultiFiltersProps) => {
  const [activeKey, setActiveKey] = useState<FilterCategoryKey>('languages');

  const selectedMap: Record<FilterCategoryKey, FilterItem[]> = {
    languages: selectedLanguages,
    genre: selectedGenre,
    boxType: selectedBoxType,
  };

  const setSelectedMap: Record<FilterCategoryKey, React.Dispatch<React.SetStateAction<FilterItem[]>>> = {
    languages: setSelectedLanguages,
    genre: setSelectedGenre,
    boxType: setSelectedBoxType,
  };

  const renderFilterButtons = () =>
    Object.keys(data).map((key) => (
      <TouchableOpacity key={key} style={[styles.switchButton, activeKey === key && styles.activeSwitchButton]} onPress={() => setActiveKey(key as FilterCategoryKey)}>
        <Text style={[styles.switchText, activeKey === key && styles.activeSwitchText]}>{data[key].title}</Text>
      </TouchableOpacity>
    ));

  const handleSelect = (item: FilterItem, setSelected: React.Dispatch<React.SetStateAction<FilterItem[]>>) => {
    setSelected((prev) => (prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]));
  };

  const renderItem = ({
    item,
    selectedList,
    setSelectedList,
  }: {
    item: FilterItem;
    selectedList: FilterItem[];
    setSelectedList: React.Dispatch<React.SetStateAction<FilterItem[]>>;
  }) => (
    <TouchableOpacity style={[styles.checkboxContainer, selectedList.some((i) => i.id === item.id) && styles.selectedCheckbox]} onPress={() => handleSelect(item, setSelectedList)}>
      <View style={[styles.checkboxBase, selectedList.some((i) => i.id === item.id) && styles.checkboxChecked]}>
        {selectedList.some((i) => i.id === item.id) && <Image iconName={ICONS.CHECKMARK} width={Sizing.layout.x1} height={Sizing.layout.x1} style={[styles.iconStyle]} />}
      </View>
      <View style={styles.checkBoxDetails}>
        <Text style={styles.primaryText}>{item.name}</Text>
        {item.secondaryName && <Text style={styles.primaryText}>{item.secondaryName}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} testID="multiFilterTest">
      <View style={styles.switchContainer}>{renderFilterButtons()}</View>
      <FlatList
        data={data?.[activeKey]?.data}
        numColumns={Sizing.layout.x2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          renderItem({
            item,
            selectedList: selectedMap[activeKey],
            setSelectedList: setSelectedMap[activeKey],
          })
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MultiFilters;
