import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'column',
    flexGrow: Sizing.flexSize.x100,
  },
  marginRight: {
    marginRight: Sizing.layout.x10,
    minHeight: Sizing.layout.x43,
  },
  inputField: {
    ...Forms.formField.primary,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
  },
  buttonContainer: {
    marginTop: Sizing.layout.x30,
    gap: Sizing.layout.x5,
  },
  errorText: {
    ...Typography.fontSize.x16,
  },
  title: {
    ...Typography.fontSize.x14,
    ...Typography.lineHeight.x20,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v250,
    marginBottom: Sizing.layout.x10,
  },
});

export default styles;
