import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { isAndroid } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
  },
  detailsCardContainer: {
    padding: Sizing.layout.x10,
    gap: Sizing.layout.x10,
  },
  detailsCardContainer_xs: {
    marginTop: Sizing.layout.x5,
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_sm: {
    marginTop: Sizing.layout.x5,
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_md: {
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp50,
    padding: Sizing.layout.x0,
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp50,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp50,
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
  dynamicCardContainer100P_md: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x20,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x10,
  },
  dynamicCardContainer100P_lg: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x20,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x10,
  },
  dynamicCardContainer100P_xl: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x20,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x10,
  },
  dynamicCardContainer50P_md: {
    width: Sizing.layoutP.xp50,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer50P_lg: {
    width: Sizing.layoutP.xp50,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer50P_xl: {
    width: Sizing.layoutP.xp50,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer50PWithPadding_md: {
    width: Sizing.layoutP.xp50,
    paddingTop: Sizing.layout.x5,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer50PWithPadding_lg: {
    width: Sizing.layoutP.xp50,
    paddingTop: Sizing.layout.x5,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer50PWithPadding_xl: {
    width: Sizing.layoutP.xp50,
    paddingTop: Sizing.layout.x5,
    gap: Sizing.layout.x10,
  },
  itemViewStyle: {
    gap: Sizing.layout.x2,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  itemViewStyle_xs: {
    gap: Sizing.layout.x1,
  },
  itemViewStyle_sm: {
    gap: Sizing.layout.x1,
  },
  itemViewStyle_md: {
    gap: Sizing.layout.x1,
  },
  itemViewStyle_lg: {
    gap: Sizing.layout.x1,
  },
  itemViewStyle_xl: {
    gap: Sizing.layout.x1,
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
  },
  formContainer_sm: {
    gap: Sizing.layout.x5,
    padding: Sizing.layout.x10,
  },
  formContainer_md: {
    gap: Sizing.layout.x5,
    paddingTop: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x5,
    width: Sizing.layoutP.xp50,
    alignSelf: 'center',
  },
  formContainer_lg: {
    gap: Sizing.layout.x5,
    paddingTop: Sizing.layout.x0,
    width: Sizing.layoutP.xp50,
    alignSelf: 'center',
  },
  formContainer_xl: {
    gap: Sizing.layout.x5,
    paddingTop: Sizing.layout.x0,
    width: Sizing.layoutP.xp50,
    alignSelf: 'center',
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
  buttonContainerGap: {
    gap: Sizing.layout.x10,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    marginTop: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x5,
    gap: Sizing.layout.x5,
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
    gap: Sizing.layout.x5,
  },
  buttonInnerContainer_lg: {
    flexDirection: 'row',
    minWidth: Sizing.layout.x250,
    alignSelf: 'center',
    gap: Sizing.layout.x10,
  },
  buttonInnerContainer_xl: {
    flexDirection: 'row',
    minWidth: Sizing.layout.x250,
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
  descriptionBoldTextStyle: {
    ...Typography.regular.x12,
    ...Typography.bold.x14,
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
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.smallMedium,
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
    ...Typography.fontName.medium,
    marginVertical: Sizing.layoutP.xp1,
  },
  buttonStyle: {
    minHeight: Sizing.layout.x43,
    maxHeight: Sizing.layout.x43,
  },
  buttonStyle_md: {
    minWidth: Sizing.layout.x328,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x328,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x328,
  },
  containerButtonStyle: {
    minHeight: Sizing.layout.x40,
    ...(!isAndroid() && { maxHeight: Sizing.layout.x45 }),
  },
  containerButtonStyle_sm: {
    minHeight: Sizing.layout.x25,
    maxHeight: Sizing.layout.x25,
  },
  containerButtonStyle_xs: {
    minHeight: Sizing.layout.x25,
    maxHeight: Sizing.layout.x25,
  },
  containerButtonStyle_md: {
    minWidth: Sizing.layout.x250,
  },
  containerButtonStyle_lg: {
    minWidth: Sizing.layout.x250,
  },
  containerButtonStyle_xl: {
    minWidth: Sizing.layout.x250,
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
    minWidth: Sizing.layout.x250,
  },
  infoContainerStyle_lg: {
    justifyContent: 'space-between',
    minWidth: Sizing.layout.x250,
  },
  infoContainerStyle_xl: {
    justifyContent: 'space-between',
    minWidth: Sizing.layout.x250,
  },
  primaryInfoTextStyle: {
    ...Typography.medium.x16,
  },
  primaryInfoTextStyleRed: {
    ...Typography.medium.x16,
    color: Colors.appColors.red,
  },
  disclaimerPrimaryText: {
    ...Typography.bold.x12,
    ...Typography.lineHeight.x14,
    alignSelf: 'flex-start',
    color: Colors.appColors.red,
    marginRight: Sizing.layout.x2,
  },
  disclaimerSecondaryText: {
    ...Typography.regular.x12,
    ...Typography.lineHeight.x14,
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
  containerInputTextStyle: {
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x8,
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
    flexDirection: 'column',
    width: Sizing.layoutP.xp100,
    minWidth: Sizing.layoutP.xp100,
  },
  removeField: { display: 'none' },
  pinkIconStyle: {
    tintColor: Colors.appColors.pink,
    padding: Sizing.layout.x0,
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  buttonSmall: {
    minHeight: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x0,
  },
});

export default styles;
