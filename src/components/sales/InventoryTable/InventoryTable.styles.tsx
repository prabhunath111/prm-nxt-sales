import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { platform } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  tableContainer: {
    borderRadius: Sizing.x4,
    backgroundColor: Colors.neutral.white,
    alignSelf: 'flex-start',
    paddingLeft: Sizing.layout.x0,
  },
  tableContainer_sm: {
    width: Sizing.layoutP.xp100,
    paddingLeft: Sizing.layout.x0,
  },
  tableContainer_xs: {
    width: Sizing.layoutP.xp100,
    paddingLeft: Sizing.layout.x0,
  },
  tableContainer_md: {
    paddingLeft: Sizing.layoutP.xp15,
  },
  tableContainer_lg: {
    paddingLeft: Sizing.layoutP.xp15,
  },
  tableContainer_xl: {
    paddingLeft: Sizing.layoutP.xp15,
  },

  tableRowHeaderStyle: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableRowStyle: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableColumnStyle: {
    ...Typography.fontSize.x12,
    backgroundColor: Colors.appColors.blueViolet,
    padding: Sizing.x6,
    shadowColor: Colors.neutral.g200,
    borderRightWidth: Sizing.layout.x1,
    borderBottomWidth: 0.2,
    borderTopWidth: 0.2,
    borderColor: Colors.neutral.g400,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardTableColumnStyle: {
    alignItems: 'flex-start',
    backgroundColor: Colors.appColors.darkViolet,
  },
  headerNameStyle: {
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x700,
    fontFamily: Typography.fontName.medium.fontFamily,
    color: Colors.neutral.white,
    textAlign: 'center',
    marginVertical: Sizing.x5,
  },
  dashboardHeaderNameStyle: {
    color: Colors.neutral.white,
    ...Typography.fontWeight.x400,
  },
  headerNameStyle_lg: {
    ...Typography.fontSize.x14,
  },
  headerNameStyle_md: {
    ...Typography.fontSize.x14,
  },
  headerNameStyle_xl: {
    ...Typography.fontSize.x14,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: Sizing.layout.x1,
  },
  tableBody: {
    flexDirection: 'column',
    paddingRight: Sizing.layout.x10,
  },
  tableBodyScroll: {
    ...(platform().OS === 'web' && {
      maxHeight: getFullScreenHeight() * 0.6,
    }),
  },
  tableBodyScroll_xl: { maxHeight: getFullScreenHeight() * 0.54 },
  tableBodyScroll_lg: { maxHeight: getFullScreenHeight() * 0.49 },
  tableBodyScroll_md: { maxHeight: getFullScreenHeight() * 0.49 },
  tableCellStyle: {
    ...Typography.fontSize.x16,
    color: Colors.neutral.black,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: Sizing.x6,
    borderRightWidth: Sizing.layout.x1,
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g400,
    borderStyle: 'solid',
    flexWrap: 'nowrap',
    position: 'relative',
  },
  borderRightStyle: {
    borderRightWidth: 0.2,
  },
  borderLeftStyle: {
    borderLeftWidth: 0.2,
  },
  tableCellStyle_lg: {
    padding: Sizing.x10,
  },
  tableCellStyle_xl: {
    padding: Sizing.x10,
  },
  tableCellStyle_md: {
    padding: Sizing.x10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Sizing.x15,
  },
  textStyle: {
    ...Typography.fontSize.x40,
  },
  buttonStyle: {
    marginHorizontal: Sizing.x10,
    backgroundColor: Colors.neutral.white,
  },
  noRecordFoundContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.2,
    borderLeftWidth: 0.2,
    borderBottomWidth: 0.2,
    shadowColor: Colors.neutral.g200,
    borderColor: Colors.neutral.g400,
  },
  noRecordFoundStyle: {
    ...Typography.fontSize.x15,
    padding: Sizing.x5,
  },
  horizontalHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizing.x10,
    paddingVertical: Sizing.x5,
  },
  primarytableColumnStyle: {
    ...Typography.fontSize.x14,
    backgroundColor: Colors.appColors.darkViolet,
    padding: Sizing.x6,
    shadowColor: Colors.neutral.g200,
    borderRightWidth: Sizing.layout.x1,
    borderBottomWidth: 0.2,
    borderTopWidth: 0.2,
    borderColor: Colors.neutral.g400,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  primaryHeaderStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x600,
    fontFamily: Typography.fontName.medium.fontFamily,
    color: Colors.neutral.white,
  },
  countText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x400,
    fontFamily: Typography.fontName.regular.fontFamily,
    color: Colors.neutral.white,
    marginLeft: Sizing.layout.x5,
  },
  cellTextStyle: {
    ...Typography.fontWeight.x300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flexShrink: 1,
    padding: Sizing.layout.x5,
  },
  centeredData: { justifyContent: 'center' },
});

export default styles;
