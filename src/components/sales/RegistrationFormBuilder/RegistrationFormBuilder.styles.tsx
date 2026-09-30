import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
  },
  detailsCardContainer: {
    gap: Sizing.layout.x8,
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_xs: {
    gap: Sizing.layout.x16,
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_sm: {
    gap: Sizing.layout.x16,
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_md: {
    gap: Sizing.layout.x16,
    padding: Sizing.layout.x0,
    marginVertical: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    gap: Sizing.layout.x5,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    gap: Sizing.layout.x16,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
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
  },
  dynamicCardContainer80P_lg: {
    width: Sizing.layoutP.xp80,
  },
  dynamicCardContainer80P_xl: {
    width: Sizing.layoutP.xp80,
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
  itemViewStyle: {
    gap: Sizing.layout.x0,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  largeContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    gap: Sizing.layout.x5,
    padding: Sizing.layout.x10,
    flexGrow: Sizing.flexSize.x100,
  },
  modalContainer: {
    width: Sizing.layoutP.xp100,
  },
  formContainer_xs: {
    gap: Sizing.layout.x5,
    padding: Sizing.layout.x10,
    paddingTop: Sizing.layout.x18,
  },
  formContainer_sm: {
    gap: Sizing.layout.x5,
    padding: Sizing.layout.x10,
    paddingTop: Sizing.layout.x18,
  },
  formContainer_md: {
    gap: Sizing.layout.x10,
    paddingTop: Sizing.layout.x18,
    paddingHorizontal: Sizing.layout.x5,
    width: Sizing.layoutP.xp50,
    alignSelf: 'center',
  },
  formContainer_lg: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x0,
    width: Sizing.layoutP.xp50,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x12,
  },
  formContainer_xl: {
    gap: Sizing.layout.x5,
    padding: Sizing.layout.x0,
    width: Sizing.layoutP.xp50,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x12,
  },
  groupContainer: {
    gap: Sizing.layout.x16,
  },
  groupContainer_md: {
    gap: Sizing.layout.x10,
  },
  groupContainer_lg: {
    gap: Sizing.layout.x10,
  },
  groupContainer_xl: {
    gap: Sizing.layout.x10,
  },
  itemTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x500,
    color: Colors.violet.v400,
  },
  itemTextBoldStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v400,
  },
  flatDropDownInnerContainer: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    borderWidth: Sizing.layout.x0,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.violet.v200,
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x4,
  },
  flatDropDownInputField: {
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.layout.x100,
    borderWidth: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x0,
    minHeight: 'auto',
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
  },
  buttonContainerGap: {
    gap: Sizing.layout.x10,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    marginTop: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x5,
    gap: Sizing.layout.x10,
  },
  buttonContainer_xs: {
    paddingVertical: Sizing.layout.x10,
    marginTop: Sizing.layout.x0,
  },
  buttonContainer_sm: {
    paddingVertical: Sizing.layout.x10,
    marginTop: Sizing.layout.x0,
  },
  buttonContainer_lg: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContainer_xl: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInnerContainer: {
    justifyContent: 'center',
    gap: Sizing.layout.x10,
  },
  buttonInnerContainer_lg: {
    flexDirection: 'row',
    minWidth: Sizing.layout.x328,
    alignSelf: 'center',
    gap: Sizing.layout.x10,
  },
  buttonInnerContainer_xl: {
    flexDirection: 'row',
    minWidth: Sizing.layout.x328,
    alignSelf: 'center',
    gap: Sizing.layout.x10,
  },
  autoCompleteContainer: {
    ...Forms.shadowContainer.primary,
    flexGrow: Sizing.flexSize.x100,
    padding: Sizing.layout.x10,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
  },

  autoCompleteModalContent: {
    position: 'relative',
    paddingBottom: Sizing.layout.x10,
  },
  selectPartnerLabel: {
    ...Typography.bold.x14,
    color: Colors.violet.v400,
  },
  chevronIconStyle: {
    tintColor: Colors.primary.brand,
  },
  labelTextStyle: {
    ...Typography.regular.x12,
    color: Colors.violet.darkViolet,
  },
  amountIconStyle: {
    height: Sizing.layout.x25,
    width: Sizing.layout.x100,
  },
  iconRightStyle: {},
  iconRightStyle_xs: {
    marginLeft: -Sizing.layout.x56,
  },
  dropdownContainerStyle: {
    // borderColor: Colors.neutral.g250,
    // borderWidth: Sizing.layout.x1,
    // borderRadius: Outlines.borderRadius.smallMedium,
    padding: Sizing.layout.x6,
    flex: Sizing.flexSize.x100,
    minHeight: Sizing.layout.x40,
    maxHeight: Sizing.layout.x40,
  },
  lineSeprator: {
    height: Sizing.layout.x1,
    backgroundColor: Colors.violet.v200,
    marginVertical: Sizing.layout.x8,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x14,
  },
  errorStyle: {
    ...Typography.fontSize.x13,
    marginTop: Sizing.layoutP.xp1,
  },
  buttonStyle: {
    minHeight: Sizing.layout.x43,
    maxHeight: Sizing.layout.x43,
  },
  buttonStyle_md: {
    minWidth: Sizing.layout.x300,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x300,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x300,
  },
  containerButtonStyle: {
    minHeight: Sizing.layout.x30,
    maxHeight: Sizing.layout.x40,
  },
  containerButtonStyle_md: {
    minWidth: Sizing.layout.x328,
  },
  containerButtonStyle_lg: {
    minWidth: Sizing.layout.x328,
  },
  containerButtonStyle_xl: {
    minWidth: Sizing.layout.x328,
  },
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
  },
  infoContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  infoContainerStyle_md: {
    justifyContent: 'space-between',
    minWidth: Sizing.layout.x328,
  },
  infoContainerStyle_lg: {
    justifyContent: 'space-between',
    minWidth: Sizing.layout.x328,
  },
  infoContainerStyle_xl: {
    justifyContent: 'space-between',
    minWidth: Sizing.layout.x328,
  },
  primaryInfoTextStyle: {
    ...Typography.medium.x16,
  },
  disclaimerPrimaryText: {
    ...Typography.bold.x12,
    ...Typography.lineHeight.x16,
    alignSelf: 'flex-start',
    color: Colors.appColors.red,
    marginRight: Sizing.layout.x2,
  },
  disclaimerSecondaryText: {
    ...Typography.regular.x12,
    ...Typography.lineHeight.x16,
    color: Colors.violet.darkViolet,
  },
  multiDropDownStyle: {
    height: Sizing.layout.x40,
  },
  leftIconStyle: {
    width: Sizing.layout.x16,
    height: Sizing.layout.x16,
  },

  textInputFieldStyle: {
    paddingHorizontal: Sizing.layout.x0,
    paddingRight: Sizing.layout.x16,
  },
  containerInputTextStyle: {
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x6,
    paddingRight: Sizing.layout.x8,
  },
  disclaimerContainerStyle: {
    flexDirection: 'row',
  },
  radioContainerStyle: {
    padding: Sizing.layout.x12,
  },
  selectedContainerStyle: {
    backgroundColor: Colors.violet.v150,
  },
  alignItemCenter: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: Sizing.layoutP.xp100, // ⚠️ important for React Native Web
    minWidth: Sizing.layoutP.xp100,
  },
  alignItemCenter_md: {
    alignItems: 'center',
  },
  alignItemCenter_lg: {
    alignItems: 'center',
  },
  alignItemCenter_xl: {
    alignItems: 'center',
  },
  marginTop10: {
    marginTop: Sizing.layout.x10,
  },
  removeField: {
    display: 'none',
  },
  secondaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    width: Sizing.layout.x180,
    paddingRight: Sizing.layout.x10,
  },
  primaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    width: Sizing.layout.x180,
    paddingLeft: Sizing.layout.x10,
  },
  charCount: {
    position: 'absolute',
    bottom: Sizing.layout.x8,
    right: Sizing.layout.x12,
    ...Typography.fontSize.x12,
    color: Colors.neutral.g500,
  },
  mobRadioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
