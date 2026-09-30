import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  paddingContainer: {
    paddingHorizontal: Sizing.layout.x10,
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
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
  },
  dealerContainer_xs: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
  },
  dealerContainer_sm: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
  },
  dealerContainer_md: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dealerContainer_lg: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dealerContainer_xl: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  primaryBookingNumber: {
    paddingTop: Sizing.layout.x10,
    marginLeft: Sizing.layout.x12,
  },
  secondaryBookingNumber: {
    paddingTop: Sizing.layout.x8,
  },
  dropDownContainer: {
    position: 'relative',
    zIndex: Sizing.layout.x1,
    paddingTop: Sizing.layout.x5,
  },
  AccoContainer: {
    paddingVertical: Sizing.x15,
    textAlign: 'center',
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
  largeContainer: {
    padding: Sizing.layout.x12,
  },
  rowContainerCenter: {
    borderRadius: Sizing.layout.x15,
    // ...Forms.buttonContainer.shadowContainer,
    gap: Sizing.layout.x20,
    marginTop: Sizing.layout.x15,
    padding: Sizing.layout.x12,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
    backgroundColor: Colors.neutral.white,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g150,
  },
  descriptionTextInput: {
    padding: Sizing.layout.x0,
    margin: Sizing.layout.x0,
    borderWidth: Sizing.layout.x0,
    backgroundColor: 'transparent',
    minHeight: Sizing.layout.x100,
    textAlignVertical: 'top',
    borderColor: 'transparent',
    outlineStyle: 'none',
  },
  charCount: {
    position: 'absolute',
    right: Sizing.layout.x12,
    bottom: Sizing.layout.x8,
    fontSize: Sizing.layout.x12,
    color: Colors.neutral.g400,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    // paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x12,
    paddingVertical: Sizing.layout.x15,
    gap: Sizing.layout.x5,
    alignItems: 'center',
  },
  innerButtonContainer: {
    gap: Sizing.layout.x10,
    minWidth: Sizing.layout.x180,
    // flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
    flexDirection: 'column',
  },
  button: {
    minWidth: Sizing.layout.x300,
  },
  description: {
    position: 'relative',
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
    borderRadius: Sizing.layout.x8,
    paddingHorizontal: Sizing.layout.x12,
    paddingTop: Sizing.layout.x12,
    paddingBottom: Sizing.layout.x26,
  },
  dynamicCardContainer_md: {
    width: Sizing.layout.x360,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer_lg: {
    width: Sizing.layout.x360,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer_xl: {
    gap: Sizing.layout.x10,
    width: Sizing.layout.x360,
  },
  dynamicCardContainer70P_md: {
    width: Sizing.layoutP.xp70,
  },
  dynamicCardContainer70P_lg: {
    width: Sizing.layoutP.xp70,
  },
  dynamicCardContainer70P_xl: {
    width: Sizing.layoutP.xp70,
  },
  dynamicCardContainer80P_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
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
    width: Sizing.layout.x100,
  },
  paddingText: {
    paddingBottom: Sizing.layout.x10,
  },
  textWrapperETSK: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x500,
    color: Colors.violet.v400,
  },
  errorText: {
    ...Typography.fontSize.x14,
    alignSelf: 'flex-start',
    paddingTop: Sizing.layout.x15,
    color: Colors.appColors.lightRed,
  },
});

export default styles;
