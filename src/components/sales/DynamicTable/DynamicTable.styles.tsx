import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { platform } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  scrollContainer: {
    width: Sizing.layoutP.xp100,
  },
  contentContainerStyle: {
    flexGrow: 1,
    minWidth: Sizing.layoutP.xp100,
  },
  table: {
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g250,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.appColors.darkViolet,
    borderTopLeftRadius: Sizing.layout.x4,
    borderTopRightRadius: Sizing.layout.x4,
    flexShrink: 0,
    width: Sizing.layoutP.xp100,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: Outlines.borderWidth.thin,
    borderBottomColor: Colors.neutral.g250,
    flexShrink: 0,
    width: Sizing.layoutP.xp100,
  },
  altRow: {
    backgroundColor: Colors.neutral.white,
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x8,
    flexShrink: 0,
  },
  cellText: {
    ...Typography.regular.x12,
    color: Colors.neutral.black,
    flexWrap: 'wrap',
    wordBreak: 'break-word', // works on web only
    flexShrink: Sizing.flexSize.x100,
    textAlign: 'center',
    alignSelf: 'center',
  },
  cellTextLeft: {
    ...Typography.regular.x12,
    color: Colors.neutral.black,
    flexWrap: 'wrap',
    wordBreak: 'break-word', // works on web only
    flexShrink: Sizing.flexSize.x100,
  },
  cellBorder: {
    borderRightWidth: Outlines.borderWidth.thin,
    borderRightColor: Colors.neutral.g250,
  },
  tableBorderWrap: {
    borderLeftWidth: Outlines.borderWidth.thin,
    borderRightWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g250,
    width: Sizing.layoutP.xp100,
  },
  headerText: {
    ...Typography.bold.x14,
    paddingHorizontal: Sizing.layout.x10, // match cell padding
    flexWrap: 'wrap',
    flexShrink: Sizing.flexSize.x100,
    color: Colors.neutral.white,
    textAlign: 'center',
  },
  leftAlignment: {
    textAlign: 'flex-start',
  },
  headerTextLeft: {
    ...Typography.bold.x14,
    flexWrap: 'wrap',
    flexShrink: Sizing.flexSize.x100,
    color: Colors.neutral.white,
  },
  fixHeader: {
    ...(platform().OS === 'web' && {
      maxHeight: getFullScreenHeight() * 0.7,
    }),
    ...(platform().OS !== 'web' && {
      maxHeight: Sizing.layout.x450,
    }),
    minHeight: Sizing.layout.x200,
  },
  tamilHeader: {
    ...Typography.fontSize.x12,
    ...Typography.lineHeight.x16,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    display: 'block',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainerWidth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
  },
  buttomText: {
    marginTop: Sizing.layout.x5,
    ...Typography.regular.x12,
  },
  buttonText: {
    height: Sizing.layout.x5,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default styles;
