import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { getWindowHeight, getWindowWidth } from 'styles/dimentionHelper';

export const windowW = getWindowWidth();
export const windowH = getWindowHeight();

const styles = StyleSheet.create<any>({
  partnerScreen: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x12,
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
    padding: Sizing.layout.x8,
  },

  labelDropDownContainer: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
    minWidth: Sizing.layout.x200,
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
  buttonStyle: {
    flex: Sizing.flexSize.x100,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    marginTop: Sizing.layout.x16,
  },
  listContainer: {
    flex: Sizing.flexSize.x100,
    marginTop: Sizing.layout.x12,
  },
  primaryIconStyle: {
    tintColor: Colors.neutral.white,
  },
  secondaryIconStyle: {
    tintColor: Colors.primary.brand,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageStyle: {
    alignSelf: 'center',
  },
  textContainerSmall: {
    width: Sizing.layoutP.xp90,
  },
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
  },
  // Table style
  tableButtonContainer: {
    flexDirection: 'row',
    padding: Sizing.layout.x5,
    gap: Sizing.layout.x12,
    alignSelf: 'center',
  },
  subColumnWrapper: {
    flexDirection: 'row', // Define that the list is made of rows
    alignItems: 'center',
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g200,
  },
  tableContainer: {
    flexDirection: 'column',
    height: Sizing.layout.x35,
    alignItems: 'flex-start',
    borderRightWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
    margin: Sizing.layout.x0,
    // paddingLeft: Sizing.layout.x20,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    color: Colors.neutral.white,
  },
  row: {
    flexDirection: 'row', // Layout rows horizontally
    alignItems: 'center', // Align content vertically
    paddingVertical: Sizing.layout.x0, // Space between rows
  },
  cell: {
    width: 'auto', // Take up equal space for each column
    justifyContent: 'center', // Center content vertically and horizontally
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: Sizing.layout.x20,
  },
  primaryButtonStyle: {
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x5,
    minHeight: Sizing.layout.x25,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryButtonStyle_xs: {
    minHeight: Sizing.layout.x25,
    maxHeight: Sizing.layout.x25,
  },
  primaryButtonStyle_sm: {
    minHeight: Sizing.layout.x25,
    maxHeight: Sizing.layout.x25,
  },
  primaryButtonStyle_md: {
    paddingVertical: Sizing.layout.x0,
  },
  primaryButtonStyle_lg: {
    paddingVertical: Sizing.layout.x0,
  },
  primaryButtonStyle_xl: {
    paddingVertical: Sizing.layout.x0,
  },
  listHeader: {
    backgroundColor: Colors.appColors.darkViolet,
    marginTop: Sizing.layout.x10,
  },
  listData: {
    maxHeight: windowH * 0.5,
    minHeight: windowH * 0.2,
    paddingHorizontal: Sizing.layout.x10,
  },
  partnerName: {
    width: windowW * 0.19,
    textAlign: 'center',
    minWidth: windowW * 0.19,
  },
  partnerNameH: {
    width: windowW * 0.19,
    textAlign: 'center',
  },
  'role/outletType': {
    width: windowW * 0.22,
    textAlign: 'center',
    minWidth: windowW * 0.22,
  },
  'role/outletTypeH': {
    width: windowW * 0.219,
    textAlign: 'center',
  },
  moreDetails: {
    width: windowW * 0.1,
    textAlign: 'center',
    minWidth: windowW * 0.1,
  },

  moreDetailsH: {
    width: windowW * 0.1,
    textAlign: 'center',
  },

  createdDate: {
    width: windowW * 0.12,
    textAlign: 'center',
    minWidth: windowW * 0.12,
  },
  createdDateH: {
    width: windowW * 0.119,
    textAlign: 'center',
  },
  mobileNumber: {
    width: windowW * 0.13,
    textAlign: 'center',
    minWidth: windowW * 0.13,
  },
  mobileNumberH: {
    width: windowW * 0.129,
    textAlign: 'center',
  },
  actionsH: {
    width: windowW * 0.243,
    textAlign: 'center',
  },
  actions: {
    width: windowW * 0.24,
    textAlign: 'center',
  },
  backButton: {
    ...Forms.buttonContainer.shadowContainer,
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x2,
  },
  backButtonStyle: {
    paddingVertical: Sizing.layout.x13,
    borderRadius: Outlines.borderRadius.smallest,
  },
  backButtonStyle_md: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
  backButtonStyle_lg: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
  backButtonStyle_xl: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
});

export default styles;
