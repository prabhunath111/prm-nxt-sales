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
  dynamicCardContainer50P_md: {
    width: Sizing.layoutP.xp80,
  },
  dynamicCardContainer50P_lg: {
    width: Sizing.layoutP.xp80,
  },
  dynamicCardContainer50P_xl: {
    width: Sizing.layoutP.xp80,
  },
  descriptionText: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    lineHeight: Sizing.layout.x18,
    ...Typography.fontName.regular,
  },
  iconWhite: {
    tintColor: Colors.neutral.white,
  },
  accordionStyle: {
    paddingVertical: Sizing.layout.x0,
  },
  accordionBox: {
    backgroundColor: Colors.violet.darkViolet,
  },
  accordionSubText: {
    color: Colors.neutral.white,
  },
  etskContainer: {
    backgroundColor: Colors.violet.v100,
    paddingHorizontal: Sizing.layout.x16,
    paddingTop: Sizing.layout.x4,
    paddingBottom: Sizing.layout.x16,
    flex: Sizing.flexSize.x100,
    borderBottomLeftRadius: Sizing.layout.x8,
    borderBottomRightRadius: Sizing.layout.x8,
  },
  cardStyle: {
    paddingHorizontal: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x4,
  },
  tabContainer: {
    backgroundColor: Colors.neutral.white,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.layout.xDot5,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
  },
  customerInformationETSK: {
    backgroundColor: Colors.violet.v100,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x2,
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
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x8 : Sizing.layout.x6,
    gap: Sizing.layout.x5,
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
    width: Sizing.layoutP.xp40,
  },
  buttonInnerContainer_xl: {
    minWidth: Sizing.layout.x250,
    paddingHorizontal: Sizing.layout.x8,
    width: Sizing.layoutP.xp30,
  },
  textWrapperETSK: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryTextYourPack: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    paddingRight: Sizing.layout.x10,
  },
  secondaryBookingNumber: {
    color: Colors.appColors.hotPink,
  },
  rowBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x12,
  },
  button: {
    flex: Sizing.layout.x1,
  },
  buttonQuot: {
    flex: screenWidth <= Sizing.layout.x1024 ? Sizing.layout.x0 : Sizing.layout.x1,
    width: screenWidth <= Sizing.layout.x1024 ? Sizing.layoutP.xp100 : 'auto',
    minWidth: screenWidth <= Sizing.layout.x1024 ? Sizing.layoutP.xp100 : Sizing.layout.x250,
    alignSelf: 'stretch',
  },
  quotationButton: {
    gap: Sizing.layout.x3,
    width: Sizing.layoutP.xp100,
    marginBottom: screenWidth <= Sizing.layout.x1024 ? Sizing.layout.x20 : Sizing.layout.x0,
  },
  summaryButtonContainer: {
    flexDirection: screenWidth <= Sizing.layout.x1024 ? 'column' : 'row',
    alignItems: 'stretch',
    gap: screenWidth <= Sizing.layout.x1024 ? Sizing.layout.x4 : Sizing.layout.x6,
    width: Sizing.layoutP.xp100,
    justifyContent: screenWidth <= Sizing.layout.x1024 ? 'flex-start' : 'center',
  },
  cancelButtonContainer: {
    width: Sizing.layoutP.xp100,
  },
});

export default styles;
