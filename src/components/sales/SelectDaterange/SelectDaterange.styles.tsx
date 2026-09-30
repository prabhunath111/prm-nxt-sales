import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    paddingTop: Sizing.layout.x7,
  },
  inputFieldContainer: {
    ...Forms.formField.primary,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
    borderColor: Colors.neutral.g250,
    borderBottomWidth: Sizing.layout.x1,
    height: Sizing.layout.x40,
  },
});

export default styles;
