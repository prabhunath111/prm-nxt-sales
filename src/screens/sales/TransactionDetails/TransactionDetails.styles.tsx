import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x8,
    padding: Sizing.layout.x8,
    marginTop: Sizing.layout.x5,
  },
  verticalSeparator: {
    borderLeftColor: Colors.neutral.g250,
    borderLeftWidth: Outlines.borderWidth.thin,
  },
  innerContainer: {
    gap: Sizing.layout.x5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  informationStyle: {
    maxWidth: Sizing.layout.x300,
    backgroundColor: Colors.violet.v100,
    paddingHorizontal: Sizing.layout.x5,
  },
  primaryText: {
    ...Typography.fontWeight.x400,
    ...Typography.fontSize.x12,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.black,
  },
  transactionId: {
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
  },
  status: {
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x12,
    ...Typography.fontName.medium,
    color: Colors.appColors.red,
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x12,
    ...Typography.fontName.medium,
    color: Colors.appColors.red,
  },
  successAmount: {
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x12,
    ...Typography.fontName.medium,
    color: Colors.appColors.green,
  },
});

export default styles;
