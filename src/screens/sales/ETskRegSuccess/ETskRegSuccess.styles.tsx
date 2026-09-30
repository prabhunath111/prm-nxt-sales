import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  detailsCardContainer: {
    padding: Sizing.layout.x14,
  },
  detailsCardContainer_xs: {
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_sm: {
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_md: {
    width: Sizing.layoutP.xp80,
    padding: Sizing.layout.x0,
    marginVertical: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    width: Sizing.layoutP.xp80,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    width: Sizing.layoutP.xp80,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  dynamicCardContainer50P_md: {
    width: Sizing.layoutP.xp80,
  },
  dynamicCardContainer50P_lg: {
    width: Sizing.layoutP.xp80,
  },
  dynamicCardContainer50P_xl: {
    width: Sizing.layoutP.xp80,
  },
  paddingContainer: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x6,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_xs: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x12,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_sm: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_md: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_lg: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_xl: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
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
  topContainer: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x24,
    paddingVertical: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x16,
  },
  topContainer_md: {
    minWidth: Sizing.layout.x450,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  topContainer_lg: {
    minWidth: Sizing.layout.x450,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  topContainer_xl: {
    minWidth: Sizing.layout.x450,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  navigationTextStyle: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
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
    width: Sizing.layout.x12,
    height: Sizing.layout.x12,
  },
  dealerContainer: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.baseMedium,
    borderColor: Colors.neutral.g250,
    backgroundColor: Colors.violet.v100,
    paddingHorizontal: Sizing.layout.x12,
    paddingTop: Sizing.layout.x5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  secondaryTextStyle: {
    ...Typography.medium.x16,
  },
  buttonStyle: {},
  buttonStyle_md: {
    minWidth: Sizing.layout.x450,
    width: Sizing.layoutP.xp50,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x450,
    width: Sizing.layoutP.xp40,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x450,
    width: Sizing.layoutP.xp30,
  },
  buttonSec: {
    flex: Sizing.layout.x1,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Sizing.layoutP.xp100,
    flexShrink: Sizing.layout.x1,
    alignSelf: 'center',
  },
  dealerSubContainer: {
    borderBottomWidth: Sizing.layout.x1,
    width: Sizing.layoutP.xp100,
    gap: Sizing.layout.x8,
    borderColor: Colors.neutral.g250,
    paddingTop: Sizing.layout.x8,
  },
  pleaseWaitText: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
  },
  primaryIconStyle: {
    tintColor: Colors.appColors.pink,
    padding: Sizing.layout.x0,
  },
  downLoadInvoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x3,
  },
  cardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g250,
  },
  cardSubView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dealerContainerCard: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.baseMedium,
    borderColor: Colors.neutral.g250,
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: Sizing.layout.x12,
    paddingTop: Sizing.layout.x5,
    justifyContent: 'center',
    ...Forms.shadowContainer.secondary,
    marginBottom: Sizing.layout.x24,
  },
  cardTitleText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x20,
    paddingVertical: Sizing.layout.x4,
    ...Typography.fontName.medium,
    color: Colors.violet.darkViolet,
  },
  viewMoreText: {
    color: Colors.appColors.pink,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
    paddingVertical: Sizing.layout.x16,
  },
  cardContentText: {
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
    paddingHorizontal: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x14,
    ...Typography.fontName.regular,
  },
  rechargeAmountView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x3,
  },
  setUpBox: {
    height: Sizing.layout.x15,
    width: Sizing.layout.x1,
    backgroundColor: Colors.violet.v200,
  },
  setupBoxView: { flexDirection: 'row', alignItems: 'center', gap: Sizing.layout.x5 },
  viewMore: {
    alignSelf: 'center',
  },

  primarySuccessText: {
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
    ...Typography.fontName.medium,
  },
  ascContainer: {
    alignItems: 'center',
  },
  ascButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizing.layout.x12,
    gap: Sizing.layout.x8,
  },
  setTopBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x3,
  },
  divider: {
    paddingRight: Sizing.layout.x3,
    borderRightWidth: Outlines.borderWidth.thin,
    borderColor: Colors.violet.v200,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizing.layout.x6,
  },
  customerInfoText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x20,
    ...Typography.fontName.regular,
  },
});

export default styles;
