import { TextStyle } from 'react-native';

type FontSize = 'x8' | 'x10' | 'x11' | 'x12' | 'x13' | 'x14' | 'x16' | 'x15' | 'x18' | 'x20' | 'x22' | 'x24' | 'x25' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70';
export const fontSize: Record<FontSize, TextStyle> = {
  x8: {
    fontSize: 8,
  },
  x10: {
    fontSize: 10,
  },
  x11: {
    fontSize: 11,
  },
  x12: {
    fontSize: 12,
  },
  x13: {
    fontSize: 13,
  },
  x14: {
    fontSize: 14,
  },
  x15: {
    fontSize: 15,
  },
  x16: {
    fontSize: 16,
  },
  x18: {
    fontSize: 18,
  },
  x20: {
    fontSize: 20,
  },
  x22: {
    fontSize: 22,
  },
  x24: {
    fontSize: 24,
  },
  x25: {
    fontSize: 25,
  },
  x30: {
    fontSize: 30,
  },
  x40: {
    fontSize: 40,
  },
  x50: {
    fontSize: 50,
  },
  x60: {
    fontSize: 60,
  },
  x70: {
    fontSize: 70,
  },
};

type FontWeight = 'x300' | 'x400' | 'x500' | 'x600' | 'x700' | 'x800';
export const fontWeight: Record<FontWeight, TextStyle> = {
  x300: {
    fontWeight: '300',
  },
  x400: {
    fontWeight: '400',
  },
  x500: {
    fontWeight: '500',
  },
  x600: {
    fontWeight: '600',
  },
  x700: {
    fontWeight: '700',
  },
  x800: {
    fontWeight: '800',
  },
};

type FontName = 'regular' | 'medium' | 'light' | 'semibold';
export const fontName: Record<FontName, TextStyle> = {
  regular: {
    fontFamily: 'VoltePlay-Regular',
  },
  medium: {
    fontFamily: 'VoltePlay-Medium',
  },
  light: {
    fontFamily: 'VoltePlay-Light',
  },
  semibold: {
    fontFamily: 'VoltePlay-SemiBold',
  },
};

type LetterSpacing = 'x30' | 'x40';
export const letterSpacing: Record<LetterSpacing, number> = {
  x30: 2,
  x40: 3,
};

type LineHeight = 'x10' | 'x12' | 'x14' | 'x16' | 'x18' | 'x20' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70';
export const lineHeight: Record<LineHeight, TextStyle> = {
  x10: {
    lineHeight: 10,
  },
  x12: {
    lineHeight: 12,
  },
  x14: {
    lineHeight: 14,
  },
  x16: {
    lineHeight: 16,
  },
  x18: {
    lineHeight: 18,
  },
  x20: {
    lineHeight: 20,
  },
  x30: {
    lineHeight: 30,
  },
  x40: {
    lineHeight: 40,
  },
  x50: {
    lineHeight: 50,
  },
  x60: {
    lineHeight: 60,
  },
  x70: {
    lineHeight: 70,
  },
};

type Bold = 'x10' | 'x12' | 'x14' | 'x16' | 'x18' | 'x20' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70';
export const bold: Record<Bold, TextStyle> = {
  x10: {
    ...fontSize.x10,
    ...lineHeight.x10,
    ...fontWeight.x600,
  },
  x12: {
    ...fontSize.x12,
    ...fontName.medium,
    ...fontWeight.x600,
  },

  x14: {
    ...fontSize.x14,
    ...fontName.medium,
    ...fontWeight.x600,
  },
  x16: {
    ...fontSize.x16,
    ...fontName.medium,
    ...fontWeight.x600,
  },
  x18: {
    ...fontSize.x18,
    ...fontName.medium,
    ...fontWeight.x600,
  },
  x20: {
    ...fontSize.x20,
    ...lineHeight.x20,
    ...fontWeight.x600,
  },
  x30: {
    ...fontSize.x30,
    ...lineHeight.x30,
    ...fontWeight.x600,
  },
  x40: {
    ...fontSize.x40,
    ...lineHeight.x40,
    ...fontWeight.x600,
  },
  x50: {
    ...fontSize.x50,
    ...lineHeight.x50,
    ...fontWeight.x600,
  },
  x60: {
    ...fontSize.x60,
    ...lineHeight.x60,
    ...fontWeight.x600,
  },
  x70: {
    ...fontSize.x70,
    ...lineHeight.x70,
    ...fontWeight.x600,
  },
};

type Semibold = 'x10' | 'x13' | 'x14' | 'x16' | 'x18' | 'x20' | 'x30' | 'x40' | 'x50';
export const semibold: Record<Semibold, TextStyle> = {
  x10: {
    ...fontSize.x10,
    ...lineHeight.x10,
    ...fontWeight.x500,
  },
  x13: {
    ...fontSize.x13,
    ...fontName.medium,
    ...fontWeight.x500,
  },
  x14: {
    ...fontSize.x14,
    ...fontName.semibold,
    ...fontWeight.x500,
  },
  x16: {
    ...fontSize.x16,
    ...fontName.semibold,
    ...fontWeight.x500,
  },
  x18: {
    ...fontSize.x18,
    ...fontName.semibold,
    ...fontWeight.x500,
  },
  x20: {
    ...fontSize.x20,
    ...lineHeight.x20,
    ...fontWeight.x500,
  },
  x30: {
    ...fontSize.x30,
    ...lineHeight.x30,
    ...fontWeight.x500,
  },
  x40: {
    ...fontSize.x40,
    ...lineHeight.x40,
    ...fontWeight.x500,
  },
  x50: {
    ...fontSize.x50,
    ...lineHeight.x50,
    ...fontWeight.x500,
  },
};

type Medium = 'x12' | 'x14' | 'x16' | 'x18' | 'x20';
export const medium: Record<Medium, TextStyle> = {
  x12: {
    ...fontSize.x12,
    ...fontName.medium,
    ...fontWeight.x500,
  },
  x14: {
    ...fontSize.x14,
    ...fontName.medium,
    ...fontWeight.x500,
  },
  x16: {
    ...fontSize.x16,
    ...fontName.medium,
    ...fontWeight.x500,
  },
  x18: {
    ...fontSize.x18,
    ...fontName.medium,
    ...fontWeight.x500,
  },
  x20: {
    ...fontSize.x20,
    ...fontName.medium,
    ...fontWeight.x500,
  },
};

type Regular = 'x10' | 'x12' | 'x14' | 'x16' | 'x18' | 'x20' | 'x30' | 'x40' | 'x50';
export const regular: Record<Regular, TextStyle> = {
  x10: {
    ...fontSize.x10,
    ...fontName.regular,
    ...fontWeight.x400,
  },
  x12: {
    ...fontSize.x12,
    ...fontName.regular,
    ...fontWeight.x400,
  },
  x14: {
    ...fontSize.x14,
    ...fontName.regular,
    ...fontWeight.x400,
  },
  x16: {
    ...fontSize.x16,
    ...fontName.regular,
    ...fontWeight.x400,
  },
  x18: {
    ...fontSize.x18,
    ...fontName.regular,
    ...fontWeight.x400,
  },
  x20: {
    ...fontSize.x20,
    ...lineHeight.x20,
    ...fontWeight.x400,
  },
  x30: {
    ...fontSize.x30,
    ...lineHeight.x30,
    ...fontWeight.x400,
  },
  x40: {
    ...fontSize.x40,
    ...lineHeight.x40,
    ...fontWeight.x400,
  },
  x50: {
    ...fontSize.x50,
    ...lineHeight.x50,
    ...fontWeight.x400,
  },
};
