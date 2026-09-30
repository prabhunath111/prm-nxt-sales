import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  primaryText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
  },
  secondaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.black,
    flexShrink: Sizing.flexSize.x100,
    flexWrap: 'wrap',
  },
});

export default styles;
