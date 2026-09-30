import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Colors.transparent.clear,
    opacity: Sizing.x1,
  },
  inputContainer: {
    flexDirection: 'row',
    flexGrow: Sizing.flexSize.x100,
    paddingHorizontal: Sizing.layout.x10,
  },
  arrow: {
    width: Sizing.layout.x0,
    height: Sizing.layout.x0,
  },
  inputField: {
    ...Forms.formField.primary,
    borderWidth: Sizing.layout.x0,
    borderRadius: Sizing.layout.x0,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
  },
  iconButton: {
    justifyContent: 'center',
  },
  errorText: {
    ...Typography.fontSize.x16,
  },
});

export default styles;
