import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
  },
  accordionStyle: {
    paddingVertical: Sizing.layout.x0,
  },
  firstAccordionStyle: {
    marginTop: Sizing.layout.x15,
    paddingVertical: Sizing.layout.x0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
    borderWidth: Outlines.borderWidth.base,
    borderColor: Colors.neutral.g100,
    padding: Sizing.layout.x10,
  },
  cardContainer_md: {
    paddingVertical: Sizing.layout.x20,
  },
  cardContainer_lg: {
    paddingVertical: Sizing.layout.x20,
  },
  cardContainer_xl: {
    paddingVertical: Sizing.layout.x20,
  },
  columnContainer: {
    flex: Sizing.flexSize.x100,
    gap: Sizing.layout.x10,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: Sizing.flexSize.x100,
    alignSelf: 'stretch',
    margin: Sizing.layout.x5,
  },
  itemContainer_md: {
    padding: Sizing.layout.x5,
  },
  itemContainer_lg: {
    padding: Sizing.layout.x10,
  },
  itemContainer_xl: {
    padding: Sizing.layout.x10,
  },
  headingText: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
    textAlign: 'left',
  },
  primaryText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    textAlign: 'center',
  },
  secondaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    textAlign: 'center',
  },
  infoText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    textAlign: 'center',
    paddingTop: Sizing.layout.x10,
  },
  borderViewStyle: {
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g100,
    marginLeft: Sizing.layout.x5,
  },
  cardStyle: {
    padding: Sizing.layout.x10,
  },
  cardChildStyle: {
    alignItems: 'flex-start',
    gap: Sizing.layout.x5,
  },
  mainHeadingText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x800,
    color: Colors.info.primary,
    textAlign: 'left',
  },
  winbackAccoodianButtonStyle: {
    backgroundColor: Colors.neutral.white,
  },
  distributerDetailsButtonStyle: {
    backgroundColor: Colors.neutral.white,
  },
  distributerDetailsStyle: {
    paddingVertical: Sizing.layout.x4,
  },
  winbackccordionStyle: {
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x0,
  },
  accordionContainer: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    ...Forms.shadowContainer.primary,
    paddingTop: Sizing.layout.x50,
  },
  accordionContainerDemoAccount: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    ...Forms.shadowContainer.primary,
  },
  accordionContainerDistributor: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    ...Forms.shadowContainer.primary,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    paddingTop: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x15,
  },
  textWrapper: {
    flexDirection: 'row',
    padding: Sizing.layout.x5,
    gap: Sizing.layout.x1,
    paddingTop: Sizing.layout.x0,
    paddingBottom: Sizing.layout.x0,
  },
  textContainer: {
    flexShrink: Sizing.layout.x1,
  },
  primaryOfferText: {
    ...Typography.fontSize.x11,
    ...Typography.fontName.regular,
    color: Colors.neutral.g600,
  },
  secondaryOfferText: {
    ...Typography.fontSize.x12,
    ...Typography.fontName.medium,
    flexShrink: Sizing.layout.x1,
    color: Colors.neutral.black,
  },
  addButton: {
    ...Typography.fontSize.x14,
    paddingVertical: Sizing.layout.x8,
    paddingHorizontal: Sizing.layout.x15,
    minHeight: Sizing.layout.x40,
    width: 'auto',
  },
  backButton: {
    margin: Sizing.layout.x15,
  },
  separator: {
    height: Sizing.layout.x1,
    backgroundColor: Colors.neutral.g150,
    marginVertical: Sizing.layout.x6,
  },
  dynamicOffersContainer: {
    gap: Sizing.layout.x10,
  },
  accordionListStyle: {
    padding: Sizing.layout.x10,
    gap: Sizing.layout.x15,
  },
  verticalSeparator: {
    borderRightWidth: Outlines.borderWidth.thin,
    alignSelf: 'stretch',
    borderRightColor: Colors.neutral.g60,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x10,
    justifyContent: 'center',
  },
  detailsContainer_xs: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Sizing.layout.x20,
    height: Sizing.layoutP.xp100,
  },
  detailsContainer_sm: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Sizing.layout.x20,
    height: Sizing.layoutP.xp100,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x10,

    gap: Sizing.layout.x12,
  },
  topBorder: {
    marginVertical: Sizing.layout.x10,
    borderTopWidth: Outlines.borderWidth.base,
    borderTopColor: Colors.neutral.g100,
  },
  winbackLable: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
    marginBottom: Sizing.layout.x12,
  },
  winbackLable_xs: {
    ...Typography.medium.x14,
  },
  winbackLable_sm: {
    ...Typography.medium.x14,
  },
  winbackLable_md: {
    ...Typography.medium.x12,
  },
  winbackLable_lg: {
    ...Typography.medium.x14,
  },
  winbackLable_xl: {
    ...Typography.medium.x12,
  },
  infoImage: {
    tintColor: Colors.neutral.black,
  },
  textWrapperManage: {
    flexDirection: 'row',
    paddingHorizontal: Sizing.layout.x8,
  },
  primaryTextManage: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    width: Sizing.layout.x180,
  },
  primaryTextManage_md: {
    width: Sizing.layout.x230,
  },
  primaryTextManage_lg: {
    width: Sizing.layout.x230,
  },
  primaryTextManage_xl: {
    width: Sizing.layout.x230,
  },
  secondaryTextManage: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    width: Sizing.layout.x180,
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignItemStart: {
    alignItems: 'flex-start',
  },
  fontMedium: {
    ...Typography.fontName.medium,
  },
  textLeft: {
    textAlign: 'left',
  },
  // new container design style
  cardMobileContainer: {
    flex: Sizing.flexSize.x100,
    ...Forms.shadowContainer.secondary,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
    borderRadius: Outlines.borderRadius.baseMedium,
    marginBottom: Sizing.layout.x16,
    margin: Sizing.layout.x2,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: Sizing.layoutP.xp100,
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.violet.borderGrey,
    borderLeftWidth: Sizing.layout.x1,
    borderLeftColor: Colors.violet.borderGrey,
  },

  headerSmall: {
    minHeight: Sizing.layout.x36,
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x6,
    backgroundColor: Colors.violet.v50,
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.violet.borderGrey,
    borderTopRightRadius: Outlines.borderRadius.baseMedium,
    borderTopLeftRadius: Outlines.borderRadius.baseMedium,
  },
  textContainerSmall: {
    paddingHorizontal: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x8,
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.violet.borderGrey,
  },
  buttonContainerSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x8,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Sizing.layout.x30,
    minHeight: Sizing.layout.x30,
    minWidth: Sizing.layout.x75,
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x0,
  },
  textMobileWrapper: {
    flexDirection: 'row',
  },
  primaryMobileText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    minWidth: Sizing.layout.x100,
    whiteSpace: 'nowrap',
  },
  secondaryMobileText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x1,
  },
  accordionContainerETSK: {
    backgroundColor: Colors.violet.darkViolet,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x2,
  },
  accordionContainerboxUpgradeBold: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    width: Sizing.layoutP.xp100,
  },
  accordionContainerboxUpgrade: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
    marginBottom: Sizing.layout.x12,
    width: Sizing.layoutP.xp100,
  },
  rowContainerCenter: {
    flexDirection: 'row',
    gap: screenWidth > Sizing.layout.x600 ? Sizing.layout.x12 : Sizing.layout.x8,
  },
  outerContainer: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
  },
  innerDropDown: {
    borderRadius: Outlines.borderRadius.small,
    paddingVertical: Sizing.layout.x8,
  },
  dropDownContainer: {
    flex: Sizing.flexSize.x100,
  },
  titleText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
  },
  cancelTskContainer: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    ...Forms.shadowContainer.primary,
    marginTop: Sizing.layout.x50,
  },
  cancelTsktextWrapper: {
    flexDirection: 'row',
    paddingHorizontal: Sizing.layout.x8,
    marginTop: Sizing.layout.x10,
  },
  paddingContainer: {
    paddingHorizontal: Sizing.layout.x12,
    paddingTop: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x8,
  },
  paddingContainer_xs: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x8,
  },
  paddingContainer_sm: {
    paddingHorizontal: Sizing.layout.x16,
    paddingTop: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x8,
  },
  paddingContainer_md: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x8,
  },
  paddingContainer_lg: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x8,
  },
  paddingContainer_xl: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x10,
    paddingBottom: Sizing.layout.x8,
  },
  textWrapperManageSummary: {
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    textAlign: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealerContainer: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
  },
  primaryBookingNumber: {
    paddingTop: Sizing.layout.x10,
    marginLeft: Sizing.layout.x12,
  },
  secondaryBookingNumber: {
    paddingTop: Sizing.layout.x8,
  },
  card: {
    backgroundColor: Colors.neutral.white,
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g100,
    elevation: Sizing.layout.x3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x11,
    paddingVertical: Sizing.layout.x6,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderBottomColor: Colors.neutral.g100,
    gap: Sizing.layout.x8,
  },

  headerTextBig: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Sizing.layout.x5,
    paddingHorizontal: Sizing.layout.x10,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderBottomColor: Colors.neutral.g100,
    gap: Sizing.layout.x10,
  },

  radioCircle: {
    height: Sizing.layout.x13,
    width: Sizing.layout.x13,
    borderRadius: Sizing.layout.x10,
    borderWidth: Outlines.borderWidth.base,
    borderColor: Colors.neutral.g500,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizing.layout.x6,
  },
  selectedRadioCircle: {
    borderColor: Colors.primary.brand,
  },
  selectedRb: {
    width: Sizing.layout.x6,
    height: Sizing.layout.x6,
    borderRadius: Sizing.layout.x10,
    backgroundColor: Colors.primary.brand,
  },
  subContainer: {
    gap: Sizing.layout.x5,
    alignItems: 'flex-start',
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
  },
  primaryTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryTextStyle_md: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryTextStyle_lg: {
    ...Typography.fontSize.x15,
    ...Typography.fontName.medium,
    flexShrink: Sizing.flexSize.x100,
  },
  subTextStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.g700,
    flexWrap: 'wrap',
  },
  gap5: {
    gap: Sizing.layout.x5,
    lineHeight: Sizing.layout.x25,
  },
  infoIcon: {
    tintColor: Colors.neutral.g500,
  },
});

export default styles;
