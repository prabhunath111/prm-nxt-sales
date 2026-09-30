import { StyleSheet } from 'react-native';
import { Colors, Typography } from 'styles';

const styles = StyleSheet.create({
  link: {
    alignItems: 'center',
  },
  label: {
    textDecorationLine: 'none',
    color: Colors.primary.brand,
    ...Typography.fontSize.x13,
  },
});

export default styles;
