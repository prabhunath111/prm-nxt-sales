import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
  },
  formContainer: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x10,
    flexGrow: Sizing.flexSize.x100,
  },
  formContainer_xs: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x10,
  },
  formContainer_sm: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x10,
  },
  formContainer_md: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x20,
  },
  formContainer_lg: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x20,
  },
  formContainer_xl: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x20,
  },
  groupContainer: {
    gap: Sizing.layout.x10,
  },
  groupContainer_md: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizing.layout.x10,
  },
  groupContainer_lg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizing.layout.x10,
  },
  groupContainer_xl: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  itemTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v400,
    marginBottom: Sizing.layout.x6,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x8,
  },
  buttonContainer_xs: {
    paddingBottom: Sizing.layout.x0,
    paddingTop: Sizing.layout.x5,
    marginTop: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer_sm: {
    paddingVertical: Sizing.layout.x5,
    marginTop: Sizing.layout.x0,
  },
  buttonContainer_lg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x8,
    marginTop: Sizing.layout.x0,
  },
  buttonContainer_xl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x8,
    marginTop: Sizing.layout.x0,
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
    ...Typography.medium.x16,
    color: Colors.violet.darkViolet,
  },
  labelTextStyle_xs: {
    ...Typography.medium.x14,
  },
  labelTextStyle_sm: {
    ...Typography.medium.x14,
  },
  labelTextStyle_md: {
    ...Typography.medium.x12,
  },
  labelTextStyle_lg: {
    ...Typography.medium.x14,
  },
  labelTextStyle_xl: {
    ...Typography.medium.x12,
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
    minHeight: Sizing.layout.x43,
  },
  lineSeprator: {
    height: Sizing.layout.x1,
    backgroundColor: Colors.violet.v200,
    marginVertical: Sizing.layout.x0,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x14,
  },
  errorStyle: {
    ...Typography.fontSize.x13,
    marginTop: Sizing.layoutP.xp1,
  },
  buttonStyle: {
    minHeight: isWeb ? Sizing.layout.x35 : Sizing.layout.x40,
    maxHeight: isWeb ? Sizing.layout.x35 : Sizing.layout.x45,
  },
  buttonStyle_md: {
    minWidth: Sizing.layout.x300,
    alignSelf: 'center',
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x300,
    alignSelf: 'center',
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x300,
    alignSelf: 'center',
  },
  containerButtonStyle: {
    minHeight: Sizing.layout.x43,
  },
  containerButtonStyle_xs: {
    minHeight: Sizing.layout.x20,
    maxHeight: Sizing.layout.x25,
  },
  containerButtonStyle_sm: {
    minHeight: Sizing.layout.x20,
    maxHeight: Sizing.layout.x25,
  },
  containerButtonStyle_md: {
    minWidth: Sizing.layout.x150,
    alignSelf: 'center',
  },
  containerButtonStyle_lg: {
    minWidth: Sizing.layout.x150,
    alignSelf: 'center',
  },
  containerButtonStyle_xl: {
    minWidth: Sizing.layout.x150,
    alignSelf: 'center',
  },
  // table style
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
    justifyContent: 'center',
  },
  infoContainerStyle_lg: {
    justifyContent: 'center',
  },
  infoContainerStyle_xl: {
    justifyContent: 'center',
  },
  primaryInfoTextStyle: {
    ...Typography.medium.x16,
  },
  disclaimerPrimaryText: {
    ...Typography.bold.x12,
    ...Typography.lineHeight.x10,
  },
  disclaimerSecondaryText: {
    ...Typography.regular.x12,
    ...Typography.lineHeight.x10,
  },
  multiDropDownStyle: {
    height: isWeb ? Sizing.layout.x40 : Sizing.layout.x52,
  },
  leftIconStyle: { width: Sizing.layout.x16, height: Sizing.layout.x16 },
  largeContainer: {
    padding: Sizing.layout.x12,
  },
  largeButton: {
    minHeight: Sizing.layout.x43,
    maxHeight: 'auto',
  },
  removeField: { display: 'none' },
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
  buttonSmall: {
    minHeight: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x0,
  },
});

export default styles;
