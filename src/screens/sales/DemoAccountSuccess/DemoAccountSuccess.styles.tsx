import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  mainContainer: {
    flex: Sizing.layout.x1,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'center',
  },

  container: {
    width: Sizing.layoutP.xp100,
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x20,
  },

  borderContainer: {
    borderWidth: Sizing.x1,
    borderColor: Colors.violet.borderGrey,
    borderRadius: Sizing.x8,
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x12,
    gap: Sizing.layout.x16,
    alignSelf: 'center',
    width: Sizing.layout.x328,
    marginTop: Sizing.layout.x20,
  },
  borderContainer_md: {
    width: Sizing.layoutP.xp80,
  },
  borderContainer_lg: {
    width: Sizing.layoutP.xp80,
  },
  borderContainer_xl: {
    width: Sizing.layoutP.xp80,
  },
  refreshContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heavyRefresh: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x5,
    borderWidth: Sizing.x1,
    borderColor: Colors.appColors.lightPink,
    borderRadius: Sizing.x4,
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x8,
  },
  heavyRefreshText: {
    ...Typography.semibold.x14,
    color: Colors.primary.brand,
  },
  packChangesText: {
    ...Typography.fontSize.x14,
    color: Colors.neutral.black,
  },
  moreActionText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.violet.darkViolet,
  },
  subIdText: {
    ...Typography.fontName.semibold,
    ...Typography.fontWeight.x600,
  },
  moduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x10,
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
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    width: Sizing.layoutP.xp100,
  },
  buttonContainer_md: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer_lg: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer_xl: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  cardsContainer: {
    width: Sizing.layoutP.xp100,
    marginTop: Sizing.layout.x20,
  },
  cardsContainer_md: {
    width: Sizing.layoutP.xp80,
  },
  cardsContainer_lg: {
    width: Sizing.layoutP.xp80,
  },
  cardsContainer_xl: {
    width: Sizing.layoutP.xp80,
  },
  buttonStyle: {},
  buttonStyle_md: {
    minWidth: Sizing.layout.x328,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x328,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x328,
  },
  cardDetailsContainer: {
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
  },
  cardDetailsContainer_md: {
    paddingHorizontal: Sizing.layout.x10,
    paddingTop: Sizing.layout.x20,
    paddingbottom: Sizing.layout.x10,
    width: Sizing.layoutP.xp80,
  },
  cardDetailsContainer_lg: {
    paddingHorizontal: Sizing.layout.x10,
    paddingTop: Sizing.layout.x20,
    paddingbottom: Sizing.layout.x10,
    width: Sizing.layoutP.xp80,
  },
  cardDetailsContainer_xl: {
    paddingHorizontal: Sizing.layout.x10,
    paddingTop: Sizing.layout.x20,
    paddingbottom: Sizing.layout.x10,
    width: Sizing.layoutP.xp80,
  },
  invoiceContainer: {
    backgroundColor: Colors.violet.lightViolet,
    borderWidth: Sizing.layout.x1,
    width: Sizing.layoutP.xp100,
    gap: Sizing.layout.x8,
    borderColor: Colors.neutral.g250,
    padding: Sizing.layout.x8,
    borderRadius: Outlines.borderRadius.smallMedium,
    marginTop: Sizing.layout.x16,
  },
  invoiceContainer_md: {
    width: Sizing.layoutP.xp80,
  },
  invoiceContainer_lg: {
    width: Sizing.layoutP.xp80,
  },
  invoiceContainer_xl: {
    width: Sizing.layoutP.xp80,
  },
  primaryTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  downLoadInvoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x3,
  },
  secondaryTextStyle: {
    ...Typography.medium.x16,
  },
  primaryIconStyle: {
    tintColor: Colors.appColors.pink,
    padding: Sizing.layout.x0,
  },
  messageText: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
    marginVertical: Sizing.layout.x10,
    textAlign: 'center',
  },
  mediumTextStyle: {
    ...Typography.medium.x14,
  },
  partnerNameContainer: {
    gap: Sizing.layout.x6,
    borderBottomWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g450,
    paddingBottom: Sizing.layout.x10,
  },
  boxPriceContainer: {
    gap: Sizing.layout.x6,
    paddingBottom: Sizing.layout.x10,
  },
  imageStyle: {
    tintColor: Colors.primary.brand,
  },
});

export default styles;
