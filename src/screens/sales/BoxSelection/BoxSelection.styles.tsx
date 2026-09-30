import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Sizing, Typography, Forms, Outlines } from 'styles';

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
    width: Sizing.layoutP.xp50,
  },
  dynamicCardContainer50P_lg: {
    width: Sizing.layoutP.xp50,
  },
  dynamicCardContainer50P_xl: {
    width: Sizing.layoutP.xp50,
  },
  customerInformationETSK: {
    backgroundColor: Colors.violet.v100,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x2,
  },
  etskContainer: {
    backgroundColor: Colors.violet.v100,
    padding: Sizing.layout.x16,
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
    padding: Sizing.layout.x10,
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
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x25,
    gap: Sizing.layout.x5,
    alignItems: 'center',
  },
  buttonInnerContainer: {
    gap: Sizing.layout.x10,
    width: screenWidth > Sizing.layout.x660 ? Sizing.layoutP.xp50 : Sizing.layoutP.xp100,
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
  },
  buttonInnerContainer_xl: {
    minWidth: Sizing.layout.x250,
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
    justifyContent: 'space-between',
    gap: Sizing.layout.x8,
  },
  dropdownContainerStyle: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.smallMedium,
    padding: Sizing.layout.x6,
    paddingTop: Sizing.layout.x0,
    flex: Sizing.flexSize.x50,
    minHeight: Sizing.layout.x40,
    maxHeight: Sizing.layout.x40,
    marginTop: Sizing.layout.x9,
    marginBottom: Sizing.layout.x9,
  },
  innerDropDown: {
    padding: screenWidth > Sizing.layout.x660 ? undefined : Sizing.layout.x0,
  },
  centeredContainer: {
    width: Sizing.layoutP.xp90,
    alignSelf: 'center',
  },
  radioContainer: {
    marginBottom: Sizing.layout.x9,
  },
  tabPadding: {
    paddingTop: Sizing.layout.x12,
    minHeight: Sizing.layout.x200,
  },
  summaryStyle: {
    ...Typography.fontWeight.x700,
  },
  primaryTextYourPack: {
    ...Typography.medium.x16,
    ...Typography.fontWeight.x500,
  },
  radioRow: {
    flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
  },
  radioRow_xs: {
    flexDirection: 'column',
  },
  radioRow_sm: {
    flexDirection: 'column',
  },
  bingeOffer: {
    paddingBottom: Sizing.layout.x5,
  },
  summaryContainer: {
    marginTop: screenWidth > Sizing.layout.x660 ? Sizing.layout.x0 : Sizing.layout.x10,
    gap: Sizing.layout.x5,
  },
  radioContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
