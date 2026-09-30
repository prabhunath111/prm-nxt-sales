import { StyleSheet } from 'react-native';
import { Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: Sizing.x30,
    width: '100%',
  },
  menuItem: {
    ...Typography.lineHeight.x50,
    width: '100%',
    textAlign: 'left',
    backgroundColor: 'none',
  },
});

export default styles;
