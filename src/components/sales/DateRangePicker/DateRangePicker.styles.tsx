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
    maxWidth: Sizing.layoutP.xp100,
    flexShrink: 1,
  },
  inputField: {
    ...Forms.formField.primary,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Sizing.layout.x5,
  },
  buttonLabelStyle: {
    flexWrap: 'wrap',
    width: Sizing.layoutP.xp100,
  },
  errorText: {
    ...Typography.fontSize.x16,
  },
});

export default styles;
