/**
 * to wrap multiple information text
 *
 * @module components/TextContainer
 * @memberof CommonComponent
 */

import InformationText from 'components/sales/InformationText';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import { Sizing } from 'styles';
import styles from './TextContainer.styles';

/**
 * Component type definitions
 *
 * @typedef {object} TextContainerProps
 * @property {ParentObject} [data] - The data for the component
 * @property {string[]} [dataArray] - The dataArray for the component
 */

export type itemType = {
  key: string;
  label?: string;
  borderRight?: boolean;
  type?: string;
};

export type TextContainerProps = {
  data?: ParentObject;
  dataArray?: itemType[];
  textContainerStyle?: object;
  itemContainerStyle?: object;
  primaryStyle?: object;
  secondaryStyle?: object | ((key: string, value: ParentObject) => object);
  separator?: string;
  maxFontSize?: number;
  hasSepratorBottom?: boolean;
  hasSepratorRight?: boolean;
  bottomSepratorGap?: number;
};

/**
 * Represents a TextContainer component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered TextContainer component
 */

const TextContainer = ({
  data = {},
  dataArray,
  textContainerStyle = {},
  itemContainerStyle = {},
  primaryStyle = {},
  secondaryStyle = {},
  separator,
  maxFontSize,
  hasSepratorBottom = false,
  hasSepratorRight,
  bottomSepratorGap,
}: TextContainerProps) => {
  const textRow = useMemo(
    () => (
      <View style={textContainerStyle} testID="text-test">
        {dataArray?.map((item, index) => {
          const value = data[item.key];
          const computedSecondaryStyle = typeof secondaryStyle === 'function' ? secondaryStyle(item.key, value) : secondaryStyle;

          return (
            <React.Fragment key={item.key}>
              <InformationText
                containerStyle={[itemContainerStyle, item.borderRight && styles.rightBorderStyle]}
                primaryStyle={primaryStyle}
                secondaryStyle={computedSecondaryStyle}
                primaryText={item.label ?? item.key}
                secondaryText={value}
                type={item.type}
                separator={separator}
                maxFontSize={maxFontSize}
              />
              {hasSepratorBottom && index < dataArray.length - 1 && <View style={[styles.bottomSeprator, !!bottomSepratorGap && { marginVertical: bottomSepratorGap }]} />}
              {hasSepratorRight && index < dataArray.length - Sizing.layout.x1 && <View style={styles.rightSeparator} />}
            </React.Fragment>
          );
        })}
      </View>
    ),
    [data, dataArray, textContainerStyle, itemContainerStyle, primaryStyle, secondaryStyle],
  );

  return textRow;
};

export default TextContainer;
