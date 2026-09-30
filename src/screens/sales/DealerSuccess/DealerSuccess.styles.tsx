import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x15,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
  },
  buttonContainer_md: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainer_lg: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainer_xl: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  scrollContainer: {
    width: Sizing.layoutP.xp100,
  },
  contentContainerStyle: {
    gap: Sizing.layout.x16,
    padding: Sizing.layout.x16,
  },
  contentContainerStyle_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  contentContainerStyle_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  contentContainerStyle_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  topContainer: {
    gap: Sizing.layout.x24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceContainer: {
    ...Forms.commonContainer.purpleBg,
  },
  partnerContainer: {
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x12,
    gap: Sizing.layout.x12,
  },
  secondaryTextStyle: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x13,
    ...Typography.fontWeight.x500,
  },
  verticalSeparator: {
    borderLeftColor: Colors.neutral.g250,
    borderLeftWidth: Outlines.borderWidth.thin,
  },
  horizontalSeparator: {
    borderBottomColor: Colors.neutral.g250,
    borderBottomWidth: Outlines.borderWidth.thin,
    width: Sizing.layoutP.xp100,
  },
  smallTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  mediumTextStyle: {
    ...Typography.medium.x16,
  },
  transectionStyle: {
    ...Typography.medium.x18,
  },
  regularTextStyle: {
    ...Typography.regular.x16,
    color: Colors.violet.v400,
  },
  navigationTextStyle: {
    ...Typography.medium.x14,
    color: Colors.neutral.black,
  },
  partnerNameContainer: {
    gap: Sizing.layout.x12,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x10,
  },
  partnerDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizing.layout.x12,
    width: Sizing.layoutP.xp100,
  },
  linkStyle: {
    ...Typography.fontWeight.x500,
    textDecorationLine: 'none',
  },
  navigationContainer: {
    ...Forms.shadowContainer.primary,
    padding: Sizing.layout.x8,
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
  },
  iconContainer: {
    width: Sizing.layout.x25,
    height: Sizing.layout.x25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIconStyle: {
    width: Sizing.layout.x15,
    height: Sizing.layout.x15,
  },
  smallPrimaryText: {
    ...Typography.fontSize.x12,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
  },
  transectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  transectionContainer_xs: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  transectionContainer_sm: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonStyle: {},
  buttonStyle_md: {
    minWidth: Sizing.layout.x360,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x360,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x360,
  },
  listCountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.appColors.lightPurple,
    minHeight: Sizing.layout.x19,
    minWidth: Sizing.layout.x19,
    borderRadius: Outlines.borderRadius.large,
  },
  listCountText: {
    ...Typography.fontSize.x12,
    ...Typography.fontName.semibold,
    ...Typography.fontWeight.x600,
    color: Colors.neutral.white,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
});

export default styles;
