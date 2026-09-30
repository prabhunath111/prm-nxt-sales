/**
 * This component will be used to show icons with list count if any.
 *
 * @module components/IconWithCount
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Sizing } from 'styles';
import { callAction } from 'utils/formBuilderHelper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import Image from 'components/sales/Image';
import Text from 'components/sales/Text';
import { ParentObject } from 'store/sales/types/common';
import styles from './IconWithCount.styles';

/**
 * Component type definitions
 *
 * @typedef {object} IconWithCountProps
 * @property {string} [count] - The list count of icon
 * @property {string} [queryName] - Query name to perform any actions
 * @property {string} [iconName] - Icon Name for the icon
 */

export type IconWithCountProps = {
  count?: string;
  queryName?: string;
  iconName?: string;
  showCount?: boolean;
  externalStyle?: ParentObject;
};

/**
 * Represents a IconWithCount component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered IconWithCount component
 *
 * @example
 * <IconWithCount text="Hello World!" />
 */

const IconWithCount = ({ count = '0', queryName, iconName, showCount, externalStyle = {} }: IconWithCountProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filterCount } = useSelector((state: RootState) => state.tsraInventory);
  const handleClick = () => {
    if (queryName) {
      dispatch(callAction({}, queryName));
    }
  };
  return (
    <Pressable
      testID="iconWithCountTest"
      style={styles.container}
      onPress={() => {
        handleClick();
      }}
    >
      <Image iconName={iconName} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} style={externalStyle} />
      {!showCount && (
        <View style={styles.count}>
          <Text style={styles.text}>{filterCount || count}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default IconWithCount;
