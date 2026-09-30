import { StyleSheet, Dimensions } from 'react-native';
import { Sizing, Colors, Typography, Outlines, Forms } from 'styles';

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
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
    marginBottom: screenWidth > Sizing.layout.x1024 ? Sizing.layoutP.xp8 : Sizing.layoutP.xp20,
  },
  paddingContainer_xs: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_sm: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_md: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_lg: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_xl: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x8,
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
  titleLeftText: {
    ...Typography.fontSize.x18,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.violet.darkViolet,
    textAlign: 'left',
  },
  mediumLeftText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.violet.darkViolet,
    textAlign: 'left',
  },
  rowContainerCenter: {
    flexDirection: 'row',
    gap: screenWidth > Sizing.layout.x600 ? Sizing.layout.x12 : Sizing.layout.x8,
  },
  itemViewStyle: {
    gap: Sizing.layout.x2,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
    flex: Sizing.flexSize.x100,
  },
  borderThinFilter: {
    flexGrow: Sizing.flexSize.x0,
    borderRadius: Outlines.borderRadius.smallest,
    flexShrink: Sizing.flexSize.x0,
  },
  filter: {
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Outlines.borderRadius.smallest,
    paddingHorizontal: Sizing.layout.x6,
    paddingVertical: Sizing.layout.x6,
    margin: 'auto',
    minWidth: Sizing.layout.x43,
    minHeight: Sizing.layout.x20,
  },
  minWidthContainer: {
    minHeight: Sizing.layout.x40,
    flex: Sizing.flexSize.x100,
  },
  verticalPadding: {
    paddingVertical: Sizing.layout.x8,
    minHeight: Sizing.layout.x32,
    height: 'auto',
  },
  dropDownContainer: {
    flex: Sizing.flexSize.x100,
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
  scrollContainer: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallMedium,
    borderColor: Colors.violet.borderGrey,
    width: Sizing.layoutP.xp100,
    height: Sizing.layout.x350,
    marginVertical: Sizing.layout.x10,
    overflow: 'hidden',
  },
  cancelButton: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallMedium,
    borderColor: Colors.violet.borderGrey,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x16,
    alignSelf: 'flex-end',
    marginBottom: Sizing.layout.x16,
  },
  searchStyle: {
    marginTop: Sizing.layout.x16,
  },
  searchInnerContainer: {
    paddingVertical: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x0,
    elevation: Sizing.layout.x0,
  },
  inputFeildStyle: {
    backgroundColor: Colors.neutral.white,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.violet.borderGrey,
    borderRadius: Sizing.layout.x4,
    paddingVertical: Sizing.layout.x4,
    height: Sizing.layout.x38,
    paddingHorizontal: Sizing.layout.x12,
    elevation: Sizing.layout.x0,
    color: Colors.neutral.black,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Sizing.layout.x0,
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x12,
    gap: Sizing.layout.x5,
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_xs: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_sm: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_md: {
    width: Sizing.layoutP.xp40,
  },
  buttonInnerContainer_lg: {
    width: Sizing.layoutP.xp40,
    minWidth: Sizing.layout.x250,
  },
  buttonInnerContainer_xl: {
    width: Sizing.layoutP.xp40,
    minWidth: Sizing.layout.x250,
  },
  cartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  badge: {
    position: 'absolute',
    top: -Sizing.layout.x5,
    right: -Sizing.layout.x5,
    backgroundColor: Colors.appColors.lightPurple,
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
  button: {
    paddingVertical: screenWidth > Sizing.layout.x1024 ? Sizing.layout.x8 : Sizing.layout.x6,
  },
  iconContainer: {
    width: Sizing.layout.x32,
    height: Sizing.layout.x32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etskContainer: {
    backgroundColor: Colors.violet.v100,
    padding: Sizing.layout.x8,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
  },
  textWrapperManage: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  cartList: {
    maxHeight: Sizing.layout.x300,
  },
  scrollView: {
    overflow: 'scroll',
  },
  contentContainer: {
    flexDirection: 'row',
  },
  secondaryBookingNumber: {
    color: Colors.appColors.hotPink,
  },
});

export default styles;
