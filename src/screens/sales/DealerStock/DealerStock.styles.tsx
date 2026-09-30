import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  flex: { flex: Sizing.layout.x1 },
  partnerScreen: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x12,
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
  cardContainer: {
    flex: Sizing.flexSize.x100,
    ...Forms.shadowContainer.secondary,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
    borderRadius: Outlines.borderRadius.baseMedium,
    marginBottom: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.violet.borderGrey,
  },

  labelDropDownContainer: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
    width: Sizing.layoutP.xp45,
  },
  innerDropDown: {
    minHeight: Sizing.layout.x40,
    borderRadius: Outlines.borderRadius.small,
  },
  dropdowniconStyle: {
    width: Sizing.layout.x14,
  },
  primaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x20,
    color: Colors.violet.darkViolet,
    minWidth: Sizing.layout.x120,
  },
  secondaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x1,
  },
  textWrapper: {
    flexDirection: 'row',
  },
  listContainer: {
    marginVertical: Sizing.layout.x12,
  },
  listContainer_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    marginVertical: Sizing.layout.x12,
  },
  listContainer_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    marginVertical: Sizing.layout.x12,
  },
  listContainer_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    marginVertical: Sizing.layout.x12,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Sizing.layout.x8,
  },
  balanceContainer: {
    ...Forms.commonContainer.purpleBg,
  },
  partnerContainer: {
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x8,
    gap: Sizing.layout.x6,
  },
  partnerNameContainer: {
    gap: Sizing.layout.x6,
    width: Sizing.layoutP.xp100,
  },
  partnerNameContainer_md: {
    flexDirection: 'row',
  },
  partnerNameContainer_lg: {
    flexDirection: 'row',
  },
  partnerNameContainer_xl: {
    flexDirection: 'row',
  },
  smallTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  mediumTextStyle: {
    ...Typography.medium.x16,
  },
  verticalSeparator: {
    borderLeftColor: Colors.neutral.g250,
    borderLeftWidth: Outlines.borderWidth.thin,
  },
  horizontalSeparator: {
    flex: Sizing.flexSize.x100,
    borderBottomColor: Colors.neutral.g250,
    borderBottomWidth: Outlines.borderWidth.thin,
    width: Sizing.layoutP.xp100,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x10,
  },
  textDetails: {
    gap: Sizing.layout.x8,
    minWidth: Sizing.layout.x90,
  },
  productContainer: {
    backgroundColor: Colors.appColors.lightViolet,
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.violet.borderGrey,
    padding: Sizing.layout.x8,
  },
  productText: {
    ...Typography.medium.x16,
    color: Colors.violet.darkViolet,
  },
  iconContainer: {
    width: Sizing.layout.x32,
    height: Sizing.layout.x32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizing.layout.x6,
  },
  badge: {
    position: 'absolute',
    top: -Sizing.layout.x5,
    right: -Sizing.layout.x5,
    backgroundColor: Colors.primary.brand,
    borderRadius: Sizing.layout.x9,
    width: Sizing.layout.x18,
    height: Sizing.layout.x18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x600,
    ...Typography.fontName.medium,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x8,
  },
  minWidthContainer: {
    flex: Sizing.flexSize.x100,
  },
  errorStyle: {
    ...Typography.fontSize.x13,
    marginTop: Sizing.layoutP.xp1,
    textAlign: 'center',
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
  centeredHeader: {
    alignItems: 'center',
  },
  flexRow: { flexDirection: 'row', gap: Sizing.layout.x4 },
  changeDealer: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.primary.brand,
  },
  editIconStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x0,
  },
});

export default styles;
