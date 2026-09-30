import { StyleSheet } from 'react-native';
import { Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Sizing.flexSize.x10,
    flexGrow: Sizing.flexSize.x100,
    alignSelf: 'stretch',
    flexShrink: Sizing.flexSize.x100,
  },
  checkboxWrapper: {
    marginBottom: 10,
  },
  errorText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    paddingTop: Sizing.layout.x7,
  },
});

export default styles;
