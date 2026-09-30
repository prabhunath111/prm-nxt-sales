import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    height: Sizing.layout.x40,
  },
  count: {
    width: Sizing.layout.x16,
    height: Sizing.layout.x16,
    backgroundColor: Colors.violet.violetPink,
    left: -Sizing.layout.x10,
    top: -Sizing.layout.x8,
    borderRadius: Sizing.layout.x16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
  },
});

export default styles;
