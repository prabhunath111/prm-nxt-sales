import { TextStyle, ViewStyle, PressableStateCallbackType } from 'react-native';

import * as Colors from './colors';
import * as Outlines from './outlines';
import * as Sizing from './sizing';

type DefaultType = 'default' | 'disabled';

export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'violet';

export const style: Record<DefaultType, ViewStyle> = {
  default: {
    paddingVertical: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x20,
    borderRadius: Outlines.borderRadius.smallest,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: Colors.neutral.g200,
    width: 'auto',
    opacity: Sizing.layout.xDot5,
  },
};

export const button: Record<ButtonType, ViewStyle> = {
  primary: {
    backgroundColor: Colors.primary.brand,
  },
  secondary: {
    backgroundColor: Colors.neutral.white,
  },
  success: {
    backgroundColor: Colors.success.primary,
  },
  danger: {
    backgroundColor: Colors.error.primary,
  },
  warning: {
    backgroundColor: Colors.warning.primary,
  },
  violet: {
    backgroundColor: Colors.violet.v250,
  },
};

type ButtonSize = 'SM' | 'MD' | 'LG' | 'FULL';

export const size: Record<ButtonSize, ViewStyle> = {
  SM: {
    width: Sizing.layoutP.xp25,
  },
  MD: {
    width: Sizing.layoutP.xp50,
  },
  LG: {
    width: Sizing.layoutP.xp75,
  },
  FULL: {
    width: Sizing.layoutP.xp100,
  },
};

type Border = 'outline';

export const border: Record<Border, TextStyle> = {
  outline: {
    backgroundColor: Colors.transparent.clear,
    borderStyle: 'solid',
    borderWidth: Outlines.borderWidth.thin,
  },
};

export const outline: Record<ButtonType, TextStyle> = {
  primary: {
    ...border.outline,
    borderColor: Colors.primary.brand,
  },
  secondary: {
    ...border.outline,
    borderColor: Colors.primary.brand,
  },
  success: {
    ...border.outline,
    borderColor: Colors.success.primary,
  },
  danger: {
    ...border.outline,
    borderColor: Colors.error.primary,
  },
  warning: {
    ...border.outline,
    borderColor: Colors.warning.primary,
  },
  violet: {
    ...border.outline,
    borderColor: Colors.violet.v250,
  },
};

export const text: Record<ButtonType, TextStyle> = {
  primary: {
    color: Colors.neutral.white,
  },
  secondary: {
    color: Colors.primary.brand,
  },
  success: {
    color: Colors.neutral.white,
  },
  danger: {
    color: Colors.neutral.white,
  },
  warning: {
    color: Colors.warning.primary,
  },
  violet: {
    color: Colors.violet.v250,
  },
};

type Circular = 'primary';

export const circular: Record<Circular, ViewStyle> = {
  primary: {
    height: Sizing.layout.x30,
    width: Sizing.layout.x30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.brand,
    borderRadius: Outlines.borderRadius.max,
  },
};

const opacity = (state: PressableStateCallbackType): ViewStyle => {
  const op = state.pressed ? 0.65 : 1;
  return { opacity: op };
};

export const applyOpacity =
  (opacityStyle: ViewStyle) =>
  (state: PressableStateCallbackType): ViewStyle => ({
    ...opacityStyle,
    ...opacity(state),
  });
