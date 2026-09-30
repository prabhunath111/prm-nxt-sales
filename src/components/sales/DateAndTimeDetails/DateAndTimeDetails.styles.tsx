import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    ...Forms.commonContainer.purpleBg,
    overflow: 'hidden',
    backgroundColor: Colors.neutral.g50,
    alignSelf: 'center',
    marginTop: Sizing.layout.x8,
    width: Sizing.layoutP.xp100,
  },
  container_md: {
    width: Sizing.layoutP.xp50,
  },
  container_lg: {
    width: Sizing.layoutP.xp50,
  },
  container_xl: {
    width: Sizing.layoutP.xp50,
  },
  dealerDetailsContainer: {
    flexDirection: 'row',
  },
  dealerDetails: {
    gap: Sizing.layout.x8,
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.neutral.g500,
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
  sectionHeader: {
    ...Typography.fontWeight.x600,
  },
  smallContainer: {
    width: Sizing.layoutP.xp30,
  },
  smallContainer_xs: {
    width: Sizing.layoutP.xp100,
  },
  smallContainer_sm: {
    width: Sizing.layoutP.xp100,
  },
  smallContainer_md: {
    width: Sizing.layoutP.xp50,
  },
  smallContainer_lg: { width: Sizing.layoutP.xp30 },
  smallContainer_xl: { width: Sizing.layoutP.xp30 },
  twoColumn: {
    justifyContent: 'flex-start',
  },

  singleRowContainer: {
    width: 'auto',
  },
});

export default styles;
