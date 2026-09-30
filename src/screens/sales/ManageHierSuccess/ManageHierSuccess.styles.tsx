import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  mainContainer: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
  },
  container: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x14,
  },
  topContainer: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x15,
    paddingTop: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x16,
  },
  smallTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  regularTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.v400,
  },
  balanceContainer: {
    ...Forms.commonContainer.purpleBg,
    width: Sizing.layout.x328,
    alignSelf: 'center',
  },
  partnerContainer: {
    paddingHorizontal: Sizing.layout.x16,
    width: Sizing.layout.x328,
    alignSelf: 'center',
    gap: Sizing.layout.x12,
    margin: Sizing.layout.x0,
  },
  partnerContainer_md: {
    width: Sizing.layoutP.xp80,
  },
  partnerContainer_lg: {
    width: Sizing.layoutP.xp80,
  },
  partnerContainer_xl: {
    width: Sizing.layoutP.xp80,
  },
  mediumTextStyle: {
    ...Typography.medium.x14,
  },
  verticalSeparator: {
    borderLeftColor: Colors.violet.v200,
    borderLeftWidth: Outlines.borderWidth.thin,
  },
  partnerNameContainer: {
    gap: Sizing.layout.x6,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x10,
  },
  navigationTextStyle: {
    justifyContent: 'flex-start',
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
  },
  navigationContainer: {
    ...Forms.shadowContainer.primary,
    padding: Sizing.layout.x8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: Sizing.layout.x328,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
  },
  navigationContainer_md: {
    width: Sizing.layoutP.xp80,
  },
  navigationContainer_lg: {
    width: Sizing.layoutP.xp80,
  },
  navigationContainer_xl: {
    width: Sizing.layoutP.xp80,
  },
  rightIcon: {
    width: Sizing.layout.x25,
    height: Sizing.layout.x25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  leftIcon: {
    width: Sizing.layout.x25,
    height: Sizing.layout.x25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronImageStyle: {
    width: Sizing.layout.x20,
    height: Sizing.layout.x20,
  },

  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    width: Sizing.layoutP.xp100,
    alignItems: 'center',
  },
  buttonStyle: { width: Sizing.layout.x328 },
  borderContainer: {
    borderWidth: Sizing.x1,
    borderColor: Colors.violet.borderGrey,
    borderRadius: Sizing.x8,
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x12,
    gap: Sizing.layout.x16,
    alignSelf: 'center',
    width: Sizing.layout.x328,
  },
  borderContainer_md: {
    flex: Sizing.flexSize.x100,
    width: Sizing.layoutP.xp80,
  },
  borderContainer_lg: {
    flex: Sizing.flexSize.x100,
    width: Sizing.layoutP.xp80,
  },
  borderContainer_xl: {
    flex: Sizing.flexSize.x100,
    width: Sizing.layoutP.xp80,
  },
  moreActionText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.violet.darkViolet,
  },
  moduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  iconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  moduleText: {
    ...Typography.fontSize.x14,
    color: Colors.neutral.black,
  },
  viewMore: {
    alignSelf: 'center',
    marginBottom: Sizing.layout.x5,
    color: Colors.primary.brand,
  },
  viewNewDealerContainer: {
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.primary.brand,
    borderRadius: Outlines.borderRadius.smallMedium,
    width: Sizing.layout.x165,
    paddingVertical: Sizing.layout.x6,
    paddingHorizontal: Sizing.layout.x8,
    marginTop: Sizing.layout.x4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  pinkTint: {
    tintColor: Colors.appColors.pink,
  },
});

export default styles;
