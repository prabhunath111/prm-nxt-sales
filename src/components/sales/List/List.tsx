/**
 * This component will render flat list
 *
 * @module components/List
 * @memberof - Common Component
 */
import React from 'react';
import { View, FlatList, ListRenderItem, VirtualizedListProps } from 'react-native';
import { isWeb } from 'utils/platformHelper';
import styles from './List.styles';

/**
 * @typedef {object} ListProps
 * @property {Array<any> | null | undefined} data - The data to be rendered in the list.
 * @property {ListRenderItem<any>} renderItem - The function to render each item in the list.
 */
export type ListProps = {
  data: ArrayLike<any> | null | undefined;
  renderItem: ListRenderItem<any>;
  numColumns?: number;
  maxHeight?: number;
  containerStyle?: object;
  columnWrapperStyle?: object;
  showsVerticalScrollIndicator?: boolean;
};

/**
 * Represents a List component.
 *
 * @component
 * @param {ListProps} props - React properties passed from composition.
 * @returns {JSX.Element} The List component.
 */
const List = ({ data, renderItem, numColumns, maxHeight, containerStyle, columnWrapperStyle, showsVerticalScrollIndicator, ...props }: ListProps & VirtualizedListProps<any>) => (
  <View style={[{ ...styles.container, maxHeight }, isWeb && styles.webContainer, containerStyle]}>
    <FlatList
      data={data}
      renderItem={renderItem}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      scrollEnabled={showsVerticalScrollIndicator}
      persistentScrollbar={showsVerticalScrollIndicator}
      nestedScrollEnabled
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={showsVerticalScrollIndicator ? styles.scrollContainer : {}}
      {...props}
    />
  </View>
);

export default List;
