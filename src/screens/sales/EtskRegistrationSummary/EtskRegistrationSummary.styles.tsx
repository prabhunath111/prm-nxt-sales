import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Sizing, Typography, Forms } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  detailsCardContainer: {
    padding: Sizing.layout.x0,
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
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    width: Sizing.layoutP.xp80,
    padding: Sizing.layout.x14,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    width: Sizing.layoutP.xp80,
    padding: Sizing.layout.x14,
    alignSelf: 'center',
  },
  paddingContainer: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x12,
  },
  paddingContainer_xs: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x12,
  },
  paddingContainer_sm: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x12,
  },
  paddingContainer_md: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x12,
  },
  paddingContainer_lg: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_xl: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x4,
    paddingTop: Sizing.layout.x16,
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
  customerInformationETSK: {
    backgroundColor: Colors.violet.v100,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x2,
  },
  etskContainer: {
    backgroundColor: Colors.violet.v100,
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x16,
    flex: Sizing.flexSize.x100,
    borderBottomLeftRadius: Sizing.layout.x8,
    borderBottomRightRadius: Sizing.layout.x8,
  },
  etskCard: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.layout.xDot5,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
  },
  textWrapperETSK: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryTextETSK: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    width: Sizing.layout.x180,
    paddingLeft: Sizing.layout.x10,
  },
  primaryTextETSK_md: {
    width: Sizing.layout.x230,
  },
  primaryTextETSK_lg: {
    width: Sizing.layout.x230,
  },
  primaryTextETSK_xl: {
    width: Sizing.layout.x230,
  },
  secondaryTextETSK: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    width: Sizing.layout.x180,
    paddingRight: Sizing.layout.x10,
    textAlign: 'right',
  },
  cardStyle: {
    padding: Sizing.layout.x6,
  },
  tabContainer: {
    backgroundColor: Colors.neutral.white,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.layout.xDot5,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x8 : Sizing.layout.x6,
    alignItems: 'center',
  },
  buttonInnerContainer: {
    gap: Sizing.layout.x4,
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_xs: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_sm: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_md: {
    width: Sizing.layoutP.xp50,
  },
  buttonInnerContainer_lg: {
    minWidth: Sizing.layout.x250,
    paddingHorizontal: Sizing.layout.x6,
    width: Sizing.layoutP.xp50,
  },
  buttonInnerContainer_xl: {
    width: Sizing.layoutP.xp30,
    paddingHorizontal: Sizing.layout.x8,
  },
  iconWhite: {
    tintColor: Colors.neutral.white,
  },
  accordionStyle: {
    paddingVertical: 0,
  },
  accordionBox: {
    backgroundColor: Colors.violet.darkViolet,
  },
  accordionSubText: {
    color: Colors.neutral.white,
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
  etskContainerSummary: {
    backgroundColor: Colors.violet.v100,
    padding: Sizing.layout.x8,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
  },
  textWrapperManageSummary: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  textWrapperManageSummaryBox: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
    alignItems: 'center',
  },
  descriptionText: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    lineHeight: Sizing.layout.x18,
    ...Typography.fontName.regular,
  },
  primaryTextYourPack: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    paddingRight: Sizing.layout.x10,
  },
  radioContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x12,
  },
  radioCircle: {
    borderRadius: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary.brand,
    height: Sizing.layout.x18,
    width: Sizing.layout.x18,
    marginTop: Sizing.layout.x0,
  },
  selectedRb: {
    width: Sizing.layout.x10,
    height: Sizing.layout.x10,
    borderRadius: Sizing.layout.x10,
    backgroundColor: Colors.appColors.pink,
  },
  cardContainer: {
    marginBottom: Sizing.layout.x10,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.layout.xDot5,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
    gap: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x10,
  },
  mainText: {
    ...Typography.medium.x12,
    ...Typography.fontWeight.x400,
    color: Colors.neutral.black,
    lineHeight: Sizing.layout.x18,
    ...Typography.fontName.medium,
  },
  minorText: {
    ...Typography.regular.x10,
    ...Typography.fontWeight.x300,
    color: Colors.violet.darkViolet,
    ...Typography.fontName.regular,
  },
  headingText: {
    ...Typography.regular.x16,
    ...Typography.fontWeight.x300,
    color: Colors.appColors.pink,
    ...Typography.fontName.medium,
  },
  flexiContainer: {
    padding: Sizing.layout.x10,
    backgroundColor: Colors.neutral.white,
  },
  secondaryBookingNumber: {
    color: Colors.appColors.hotPink,
  },
  addPackBtn: {
    alignSelf: 'flex-end',
    maxWidth: screenWidth > Sizing.layout.x660 ? Sizing.layoutP.xp40 : Sizing.layoutP.xp50,
    minWidth: Sizing.layoutP.xp30,
    marginTop: Sizing.layout.x12,
  },
  button: {
    minWidth: Sizing.layout.x120,
    paddingVertical: Sizing.layout.x4,
  },
  buttonQuot: {
    flex: screenWidth <= Sizing.layout.x1024 ? Sizing.layout.x0 : Sizing.layout.x1,
    width: screenWidth <= Sizing.layout.x1024 ? Sizing.layoutP.xp100 : 'auto',
    minWidth: screenWidth <= Sizing.layout.x1024 ? Sizing.layoutP.xp100 : Sizing.layout.x250,
    alignSelf: 'stretch',
  },
  summaryButtonContainer: {
    flexDirection: screenWidth <= Sizing.layout.x1024 ? 'column' : 'row',
    alignItems: screenWidth <= Sizing.layout.x1024 ? 'stretch' : 'center',
    gap: screenWidth <= Sizing.layout.x1024 ? Sizing.layout.x4 : Sizing.layout.x6,
    justifyContent: screenWidth <= Sizing.layout.x1024 ? 'flex-start' : 'center',
  },
});

export default styles;
