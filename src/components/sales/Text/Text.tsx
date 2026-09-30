/**
 * we will use this as custom textbox
 *
 * @module components/Text
 * @memberof - Common Component
 */
import React, { ReactNode } from 'react';
import { ColorValue, Text as RNText, TextStyle } from 'react-native';
import { Typography } from 'styles';
import { scaleFont } from 'styles/dimentionHelper';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { ROUTE } from 'const';
import styles from './Text.styles';
/**
 * Represents the props for the Text component.
 *
 * @typedef {object} TextProps
 * @property {string} [id] - The id attribute of the Text component.
 * @property {string} label - The text content of the Text component.
 * @property {TextStyle | object} [style] - The style object or TextStyle for the Text component.
 * @property {number} [fontSize] - The font size of the text.
 * @property {string} [color] - The color of the text.
 * @property {boolean} [required] - Indicates whether the text is required.
 */
export type TextProps = {
  id?: string | undefined;
  label?: string | undefined;
  style?: TextStyle | any;
  fontSize?: number;
  maxFontSize?: number;
  minFontSize?: number;
  color?: string | ColorValue;
  required?: boolean;
  numberOfLines?: number;
  children?: ReactNode | string | undefined | null;
  onPress?: () => void;
  testID?: string;
};

/**
 * Represents a Text component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns Text
 */
const Text = ({
  id,
  label,
  style,
  fontSize = Typography.fontSize.x14.fontSize,
  color,
  maxFontSize = Typography.fontSize.x14.fontSize,
  minFontSize,
  required = false,
  children,
  onPress,
  numberOfLines,
  testID,
}: TextProps) => {
  const { routeName } = useCurrentRoute();
  const isStarAtStart = routeName === ROUTE.WEB.TSK_VOUCHER;

  const getStyleFontSize = () => {
    if (Array.isArray(style)) {
      const newStyle = style.reduce((acc, current) => ({ ...acc, ...current }), {});
      return newStyle.fontSize;
    }
    return style?.fontSize;
  };
  const scaledFontSize = scaleFont(getStyleFontSize() ?? fontSize, maxFontSize, minFontSize);

  return (
    <RNText key={`${id}label`} testID={testID} style={[styles.label, style, { fontSize: scaledFontSize }, color && { color }]} onPress={onPress} numberOfLines={numberOfLines}>
      {required && isStarAtStart && (
        <RNText key={`${id}symbol-start`} style={[styles.label, styles.requiredStart]}>
          *
        </RNText>
      )}
      {label || children}
      {required && !isStarAtStart && (
        <RNText key={`${id}symbol-end`} style={[styles.label, styles.required]}>
          {' *'}
        </RNText>
      )}
    </RNText>
  );
};

export default Text;
