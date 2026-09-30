import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    ...Forms.commonContainer.purpleBg,
    overflow: 'hidden',
  },
  dealerDetailsContainer: {
    flexDirection: 'row',
  },
  dealerDetails: {
    gap: Sizing.layout.x8,
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.neutral.g150,
    paddingHorizontal: Sizing.layout.x8,
  },
  primaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    color: Colors.neutral.black,
  },
  secondaryCount: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    maxWidth: Sizing.layout.x120,
  },
  secondaryCount_xs: {
    maxWidth: Sizing.layout.x100,
  },
  secondaryCount_md: {
    maxWidth: 'auto',
  },
  secondaryCount_lg: {
    maxWidth: 'auto',
  },
  secondaryCount_xl: {
    maxWidth: 'auto',
  },
  headingText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    marginRight: Sizing.layout.x8,
  },
  changeDealer: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.primary.brand,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withoutBorder: { borderRightWidth: Sizing.layout.x0 },
  withoutPadding: { paddingLeft: Sizing.layout.x0 },
});

export default styles;
