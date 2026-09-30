/**
 * Use color to make gradient effect
 *
 * @module components/Gradient
 * @memberof Common Component
 */
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { isWeb } from 'utils/platformHelper';
import LinearGradient from 'react-native-linear-gradient';
import { STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import styles from './Gradient.styles';

/**
 * @typedef {object} GradientProps
 * @property {string[]} colors - An array of colors for the gradient.
 * @property {object} [start] - An object specifying the starting point of the gradient.
 * @property {number} [start.x] - The x-coordinate of the starting point.
 * @property {number} [start.y] - The y-coordinate of the starting point.
 * @property {object} [end] - An object specifying the ending point of the gradient.
 * @property {number} [end.x] - The x-coordinate of the ending point.
 * @property {number} [end.y] - The y-coordinate of the ending point.
 * @property {ViewStyle} [style] - Custom styles to be applied to the gradient component.
 * @property {ReactNode} [children] - Children components or elements to be rendered within the gradient component.
 */

export type GradientProps = {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ParentObject;
  children?: ReactNode;
  locations?: number[];
  direction?: string;
};

/**
 * Represents a Gradient component.
 * @component
 * @param {GradientProps} props - React properties passed from composition.
 * @returns {JSX.Element} The Gradient component.
 */
const Gradient = ({ colors, style, children, start, end, direction, locations, ...props }: GradientProps) => {
  // Check the platform to decide which gradient implementation to use
  if (isWeb) {
    // For web, use CSS gradient
    const webDirection = direction || STRINGS.TO_BOTTOM;
    const webStyle: any = {
      backgroundImage: `linear-gradient(${webDirection}, ${colors.join(',')})`,
      ...style,
    };
    return <View style={webStyle}>{children}</View>;
  }
  // For mobile, use react-native-linear-gradient
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={start || { x: 0, y: 0 }}
      end={end || { x: 1, y: 1 }}
      style={[styles.gradient, style]}
      {...props}
      testID="gradient-test"
    >
      {children}
    </LinearGradient>
  );
};

export default Gradient;
