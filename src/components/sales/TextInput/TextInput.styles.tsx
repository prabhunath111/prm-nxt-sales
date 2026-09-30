import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  inputField: {
    ...Forms.formField.primary,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    minHeight: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x0,
    outlineStyle: 'none',
  },
  inputField_md: {
    minHeight: Sizing.layout.x50,
    paddingHorizontal: Sizing.layout.x16,
  },
  inputField_lg: {
    minHeight: Sizing.layout.x50,
    paddingHorizontal: Sizing.layout.x16,
  },
  inputField_xl: {
    minHeight: Sizing.layout.x50,
    paddingHorizontal: Sizing.layout.x16,
  },
  errorText: {
    ...Typography.fontSize.x16,
  },
  disabledInput: {
    ...Forms.formField.primary,
    borderWidth: Sizing.layout.x0,
    borderRadius: Outlines.borderRadius.smallest,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.g50,
  },
  remainingCharactersText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    gap: Sizing.layout.x8,
    alignSelf: 'flex-end',
  },
});

export default styles;
