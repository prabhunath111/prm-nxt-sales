import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { getWindowWidth, getWindowHeight } from 'styles/dimentionHelper';

export const windowW = getWindowWidth();
export const windowH = getWindowHeight();

const styles = StyleSheet.create<any>({
  container: {
    ...Forms.shadowContainer.primary,
    borderColor: Colors.neutral.g250,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
    marginBottom: Sizing.layout.x16,
    flexGrow: Sizing.flexSize.x100,
    height: 'auto',
    margin: Sizing.layout.x2,
  },
  container_lg: {
    maxWidth: Sizing.layoutP.xp50,
    marginBottom: Sizing.layout.x20,
  },
  container_xl: {
    maxWidth: Sizing.layoutP.xp32,
    marginBottom: Sizing.layout.x20,
  },
  textContainerStyle: {
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x12,
  },
  itemContainerStyle: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  primaryTextStyle: {
    ...Typography.regular.x14,
    ...Typography.lineHeight.x16,
    width: Sizing.layoutP.xp40,
  },
  secondaryTextStyle: {
    ...Typography.medium.x16,
    ...Typography.lineHeight.x16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: Sizing.layout.x5,
    gap: Sizing.layout.x5,
  },
  buttonStyle: {
    paddingHorizontal: Sizing.layout.x8,
    minHeight: Sizing.layout.x30,
    minWidth: Sizing.layoutP.xp35,
    flexShrink: Sizing.flexSize.x100,
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
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
  },
  // style for table
  subColumnWrapper: {
    flexDirection: 'row', // Define that the list is made of rows
    justifyContent: 'space-between', // Space between columns
    alignItems: 'center',
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g200,
  },
  tableContainer: {
    flexDirection: 'column',
    height: Sizing.layout.x35,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: Colors.neutral.g200,
    margin: 0,
    padding: 0,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    flex: Sizing.flexSize.x100,
    width: 'auto', // Take up equal space for each column
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
    flex: Sizing.flexSize.x100,
    width: 'auto', // Take up equal space for each column
    justifyContent: 'center', // Center content vertically and horizontally
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  partnerIdH: {
    width: windowW * 0.1,
    textAlign: 'left',
  },
  partnerNameH: {
    width: windowW * 0.3,
    textAlign: 'center',
  },
  oldRmnH: {
    width: windowW * 0.13,
    textAlign: 'center',
  },
  newRmnH: {
    width: windowW * 0.13,
    textAlign: 'center',
  },
  requestDateH: {
    width: windowW * 0.13,
    textAlign: 'center',
  },
  actionsH: {
    width: windowW * 0.14,
    textAlign: 'center',
  },
  partnerId: {
    width: windowW * 0.1,
    textAlign: 'left',
  },
  partnerName: {
    width: windowW * 0.3,
    textAlign: 'center',
  },
  oldRmn: {
    width: windowW * 0.13,
    textAlign: 'center',
  },
  newRmn: {
    width: windowW * 0.13,
    textAlign: 'center',
  },
  requestDate: {
    width: windowW * 0.13,
    textAlign: 'center',
  },
  actions: {
    width: windowW * 0.14,
  },
  listHeader: {
    backgroundColor: Colors.appColors.darkViolet,
    paddingHorizontal: Sizing.layout.x10,
  },
  listData: {
    maxHeight: windowH * 0.5,
    minHeight: windowH * 0.2,
    paddingHorizontal: Sizing.layout.x10,
  },
});

export default styles;
