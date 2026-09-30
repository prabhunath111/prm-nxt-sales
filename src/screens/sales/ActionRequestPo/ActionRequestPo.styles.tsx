import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Forms, Typography } from 'styles';
import { getWindowWidth } from 'styles/dimentionHelper';

export const windowW = getWindowWidth();

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
  subColumnWrapper: {
    flexDirection: 'row', // Define that the list is made of rows
    alignItems: 'center',
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g200,
  },
  listContainer: {
    flex: Sizing.flexSize.x100,
    marginTop: Sizing.layout.x12,
  },
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
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
    alignItems: 'flex-start', // Align content vertically
    paddingVertical: Sizing.layout.x0, // Space between rows
    alignSelf: 'center',
  },
  cell: {
    width: 'auto', // Take up equal space for each column
    justifyContent: 'center', // Center content vertically and horizontally
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tableContainerHeader: {
    flexDirection: 'column',
    paddingVertical: Sizing.layout.x12,
    alignItems: 'flex-start',
    borderRightWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
    margin: Sizing.layout.x0,
    justifyContent: 'center',
  },
  tableContainer: {
    flexDirection: 'column',
    height: Sizing.layout.x35,
    alignItems: 'flex-start',
    borderRightWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
    margin: Sizing.layout.x0,
    justifyContent: 'center',
  },
  imageStyle: {
    alignSelf: 'center',
  },
  tableButtonContainer: {
    flexDirection: 'row',
    padding: Sizing.layout.x5,
    gap: Sizing.layout.x12,
    alignSelf: 'center',
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
  secondaryIconStyle: {
    tintColor: Colors.primary.brand,
  },
  primaryIconStyle: {
    tintColor: Colors.neutral.white,
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
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainerSmall: {
    width: Sizing.layoutP.xp100,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    marginTop: Sizing.layout.x16,
  },
  buttonStyle: {
    flex: Sizing.flexSize.x100,
  },
  listHeader: {
    backgroundColor: Colors.appColors.darkViolet,
    marginTop: Sizing.layout.x10,
  },
  dealerNameH: {
    width: windowW * 0.249,
    textAlign: 'center',
  },
  evdNumberH: {
    width: windowW * 0.2499,
    textAlign: 'center',
  },
  transferredAmountH: {
    width: windowW * 0.0999,
    textAlign: 'center',
  },
  requestDateH: {
    width: windowW * 0.099,
    textAlign: 'center',
  },
  actionsH: {
    width: windowW * 0.299,
    textAlign: 'center',
  },
  dealerName: {
    width: windowW * 0.25,
    textAlign: 'center',
    minWidth: windowW * 0.1,
  },
  evdNumber: {
    width: windowW * 0.25,
    textAlign: 'center',
    minWidth: windowW * 0.25,
  },
  transferredAmount: {
    width: windowW * 0.1,
    textAlign: 'center',
    minWidth: windowW * 0.1,
  },
  requestDate: {
    width: windowW * 0.1,
    textAlign: 'center',
    minWidth: windowW * 0.1,
  },
  actions: {
    width: windowW * 0.3,
    textAlign: 'center',
    minWidth: windowW * 0.3,
  },
});

export default styles;
