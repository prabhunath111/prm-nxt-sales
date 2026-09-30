import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { getFullScreenWidth, getFullScreenHeight } from 'styles/dimentionHelper';
import { platform } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  keyboardContainer: {
    flex: Sizing.flexSize.x100,
  },
  modalContainer: {
    ...(platform().OS !== 'web' && {
      height: getFullScreenHeight(),
      width: getFullScreenWidth(),
    }),
    ...(platform().OS === 'web' && {
      flex: Sizing.flexSize.x100,
    }),
    justifyContent: 'flex-end',
    backgroundColor: Colors.violet.backgroundViolet,
  },

  modalContainer_md: {
    justifyContent: 'center',
  },
  modalContainer_lg: {
    justifyContent: 'center',
  },
  modalContainer_xl: {
    justifyContent: 'center',
  },
  dateRangePickerContainer: {
    maxWidth: Sizing.layout.x450,
  },
  dateRangePickerContainer_md: {
    maxWidth: Sizing.layout.x379,
  },
  dateRangePickerContainer_lg: {
    maxWidth: Sizing.layout.x379,
  },
  dateRangePickerContainer_xl: {
    maxWidth: Sizing.layout.x379,
  },
  dateRangePicker: {
    paddingVertical: Sizing.layout.x30,
  },
  dateRangePicker_md: {
    paddingVertical: Sizing.layout.x15,
  },
  dateRangePicker_xl: {
    paddingVertical: Sizing.layout.x15,
  },
  dateRangePicker_lg: {
    paddingVertical: Sizing.layout.x15,
  },
  modalViewStyle: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    maxWidth: Sizing.layout.x480,
    ...(platform().OS === 'web' && {
      maxHeight: Sizing.layoutP.xp90,
    }),
    marginHorizontal: 'auto',
    borderTopRightRadius: Sizing.layout.x5,
    borderTopLeftRadius: Sizing.layout.x5,
  },
  modalViewStyle_md: {
    borderRadius: Outlines.borderRadius.small,
    borderTopRightRadius: Outlines.borderRadius.small,
    borderTopLeftRadius: Outlines.borderRadius.small,
  },
  modalViewStyle_lg: {
    borderRadius: Outlines.borderRadius.small,
    borderTopRightRadius: Outlines.borderRadius.small,
    borderTopLeftRadius: Outlines.borderRadius.small,
  },
  modalViewStyle_xl: {
    borderRadius: Outlines.borderRadius.small,
    borderTopRightRadius: Outlines.borderRadius.small,
    borderTopLeftRadius: Outlines.borderRadius.small,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  headerText: {
    ...Typography.fontSize.x22,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    flexShrink: Sizing.flexSize.x100,
    color: Colors.violet.darkViolet,
  },
  textMessage: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.light,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    paddingVertical: Sizing.layout.x20,
  },
  formContainer: {
    padding: Sizing.layout.x0,
    paddingTop: Sizing.layout.x5,
  },
  buttonContainer: {
    paddingHorizontal: Sizing.layout.x16,
    paddingBottom: Sizing.layout.x16,
    paddingTop: Sizing.layout.x24,
    gap: Sizing.layout.x10,
  },
  topContainer: {
    paddingHorizontal: Sizing.layout.x20,
    paddingVertical: Sizing.layout.x30,
    gap: Sizing.layout.x24,
    maxHeight: Sizing.layoutP.xp100,
  },
  labelTextStyle: {
    ...Typography.regular.x14,
    ...Typography.lineHeight.x16,
    color: Colors.violet.darkViolet,
  },
  labelTextStyle_md: {
    ...Typography.lineHeight.x20,
  },
  labelTextStyle_lg: {
    ...Typography.lineHeight.x20,
  },
  labelTextStyle_xl: {
    ...Typography.lineHeight.x20,
  },
  salesContainer: {
    height: 'auto',
  },
  centerContent: {
    justifyContent: 'center',
  },
  modalWidthStyle: {
    width: Sizing.layoutP.xp90,
  },
  rowContainer: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Sizing.layout.x8,
  },
  centerTextStyle: {
    ...Typography.fontSize.x18,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    textAlign: 'center',
    marginVertical: Sizing.layout.x14,
  },
  headerIconStyle: {
    alignSelf: 'center',
  },

  textWrapper: {
    flexDirection: 'row',
  },
  primaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    minWidth: Sizing.layout.x150,
    whiteSpace: 'nowrap',
  },
  secondaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    flexShrink: Sizing.layout.x1,
  },
  centerSubLabelTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
    textAlign: 'center',
    marginTop: Sizing.layout.x14,
  },
  secondaryTextLabel: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.black,
    flexShrink: Sizing.flexSize.x100,
    flexWrap: 'wrap',
  },
  gridContainer: {
    flex: Sizing.layout.x1,
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.black,
    borderRadius: Outlines.borderRadius.smallMedium,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.black,
  },
  cell: {
    flex: Sizing.layout.x1,
    paddingVertical: Sizing.layout.x8,
    paddingHorizontal: Sizing.layout.x12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.black,
  },
  gridText: {
    color: Colors.neutral.black,
    ...Typography.fontSize.x12,
    textAlign: 'center',
  },
  boldHeader: {
    ...Typography.fontName.semibold,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x600,
    color: Colors.neutral.black,
  },
  topSpace: {
    marginTop: Sizing.layout.x8,
  },
  buttonInlineContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x12,
  },
  inlineButton: {
    maxWidth: Sizing.layout.x550,
  },
  buttonWidth: {
    height: Sizing.layout.x56,
  },
  buttonSeconadryText: {
    ...Typography.fontSize.x16,
  },
});

export default styles;
