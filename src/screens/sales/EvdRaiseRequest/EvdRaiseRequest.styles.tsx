import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  flex: { flex: Sizing.layout.x1 },
  componentContainer: { gap: Sizing.layout.x8 },
  partnerScreen: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x12,
    alignItems: 'center',
  },
  partnerScreen_md: {
    alignSelf: 'center',
  },
  partnerScreen_lg: {
    alignSelf: 'center',
  },
  partnerScreenmd_xl: {
    alignSelf: 'center',
  },
  container: {
    paddingVertival: Sizing.layout.x12,
    paddingTop: Sizing.layout.x12,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x12,
  },
  container_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  container_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  container_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
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
  buttonStyle: {
    paddingVertical: Sizing.layout.x0,
    minHeight: Sizing.layout.x30,
  },
  buttonStyle_md: {
    minWidth: Sizing.layoutP.xp50,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layoutP.xp40,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layoutP.xp30,
  },
  labelTextStyle: {
    ...Typography.medium.x18,
    color: Colors.violet.darkViolet,
    marginTop: Sizing.layout.x16,
  },
  itemTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x500,
    color: Colors.violet.v400,
    marginTop: Sizing.layout.x8,
  },
  dropdownTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x500,
    color: Colors.violet.v400,
    marginTop: Sizing.layout.x8,
    marginLeft: Sizing.layout.x4,
  },
  textContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    backgroundColor: Colors.neutral.g70,
    gap: Sizing.layout.x8,
    padding: Sizing.layout.x8,
    borderRadius: Outlines.borderRadius.smallMedium,
  },
  primaryText: {
    ...Typography.regular.x14,
  },
  secondaryText: {
    ...Typography.semibold.x16,
  },
  horizontalSeprator: {
    width: Sizing.layoutP.xp100,
    borderTopWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
  },
  labelDropDownContainer: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
  },
  dropdowniconStyle: {
    width: Sizing.layout.x14,
  },
  innerDropDown: {
    minHeight: Sizing.layout.x40,
    borderRadius: Outlines.borderRadius.small,
  },
});

export default styles;
