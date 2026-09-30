import { ViewStyle, StyleSheet } from 'react-native';

import * as Colors from './colors';

type BorderRadius = 'smallest' | 'small' | 'smallMedium' | 'baseMedium' | 'base' | 'large' | 'max';
export const borderRadius: Record<BorderRadius, number> = {
  smallest: 3,
  small: 5,
  smallMedium: 4,
  baseMedium: 8,
  base: 10,
  large: 20,
  max: 9999,
};

type BorderWidth = 'hairline' | 'thin' | 'base' | 'thick';
export const borderWidth: Record<BorderWidth, number> = {
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
  base: 2,
  thick: 3,
};

type Shadow = 'base' | 'thick';
export const shadow: Record<Shadow, ViewStyle> = {
  base: {
    shadowColor: Colors.neutral.g400,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  thick: {
    shadowColor: Colors.neutral.g400,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5.65,
    elevation: 6,
  },
};
