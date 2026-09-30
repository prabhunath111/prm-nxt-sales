import { StyleSheet } from 'react-native';
import { Colors, Typography, Sizing, Outlines } from 'styles';
import { isAndroid, isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    position: 'absolute',
    backgroundColor: Colors.neutral.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizing.x5,
    paddingVertical: Sizing.x10,
    paddingHorizontal: Sizing.x40,
    marginHorizontal: Sizing.x20,
    left: Sizing.x0,
    right: Sizing.x0,
    bottom: Sizing.x70,
    zIndex: Sizing.x5,
  },
  toastAlertContainer: {
    position: 'absolute',
    ...(isWeb && { position: 'fixed' }),
    top: Sizing.layout.x0,
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.transparent.darkGray,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: Sizing.x5,
    ...(isAndroid() && { alignItems: 'center' }),
  },
  toastAlertContainer_md: {
    alignItems: 'center',
  },
  toastAlertContainer_lg: {
    alignItems: 'center',
  },
  toastAlertContainer_xl: {
    alignItems: 'center',
  },
  toastAlertViewStyle: {
    backgroundColor: Colors.neutral.white,
    paddingVertical: Sizing.layout.x30,
    paddingHorizontal: Sizing.layout.x20,
    borderRadius: Sizing.x5,
    justifyContent: 'center',
    alignItems: 'center',
    width: Sizing.layoutP.xp90,
    maxWidth: Sizing.layout.x450,
    marginHorizontal: 'auto',
    borderTopRightRadius: Outlines.borderRadius.large,
    borderTopLeftRadius: Outlines.borderRadius.large,
  },
  toastAlertViewStyle_md: {
    borderRadius: Outlines.borderRadius.small,
    borderTopRightRadius: Outlines.borderRadius.small,
    borderTopLeftRadius: Outlines.borderRadius.small,
    paddingHorizontal: Sizing.layout.x30,
  },
  toastAlertViewStyle_lg: {
    borderRadius: Outlines.borderRadius.small,
    borderTopRightRadius: Outlines.borderRadius.small,
    borderTopLeftRadius: Outlines.borderRadius.small,
    paddingHorizontal: Sizing.layout.x30,
  },
  toastAlertViewStyle_xl: {
    borderRadius: Outlines.borderRadius.small,
    borderTopRightRadius: Outlines.borderRadius.small,
    borderTopLeftRadius: Outlines.borderRadius.small,
    paddingHorizontal: Sizing.layout.x30,
  },
  alertTitleContainer: {
    width: Sizing.layoutP.xp100,
    paddingTop: Sizing.layout.x20,
  },
  toastAlertTitle: {
    ...Typography.fontName.medium,
    ...Typography.lineHeight.x20,
    ...Typography.fontSize.x18,
    paddingVertical: Sizing.layout.x15,
  },
  toastAlertTitleWin: {
    ...Typography.fontName.medium,
    ...Typography.lineHeight.x20,
    ...Typography.fontSize.x18,
    paddingVertical: Sizing.layout.x3,
  },
  textCenterStyle: {
    textAlign: 'center',
  },
  textLeftStyle: {
    textAlign: 'left',
  },
  toastAlertBtnContainer: {
    marginTop: Sizing.layout.x15,
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  toastAlertBtnContainer_md: {
    flexDirection: 'row-reverse',
  },
  toastAlertBtnContainer_lg: {
    flexDirection: 'row-reverse',
  },
  toastAlertBtnContainer_xl: {
    flexDirection: 'row-reverse',
  },
  toastAlertConfirmButton: {
    flexGrow: Sizing.flexSize.x100,
  },
  multiAlertButton: {
    width: Sizing.layoutP.xp40,
  },
  toastAlertCancelButton: {
    flexGrow: Sizing.flexSize.x100,
  },
  toastAlertInfo: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    marginTop: Sizing.x20,
  },
  icon: {
    width: Sizing.x40,
    height: Sizing.x40,
    marginRight: Sizing.x10,
    alignSelf: 'center',
    flexGrow: Sizing.x1,
    resizeMode: 'contain',
  },
  text: {
    ...Typography.fontSize.x40,
    flexGrow: Sizing.x15,
    overflow: 'hidden',
  },
  warningText: {
    color: Colors.neutral.black,
  },
  errorText: {
    color: Colors.neutral.white,
  },
  infoText: {
    color: Colors.neutral.white,
  },
  successText: {
    color: Colors.neutral.white,
  },
  error: {
    backgroundColor: Colors.error.primary,
  },
  warning: {
    backgroundColor: Colors.warning.primary,
  },
  info: {
    backgroundColor: Colors.info.primary,
  },
  success: {
    backgroundColor: Colors.success.primary,
  },
  previewTitle: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    textAlign: 'center',
    marginBottom: Sizing.x18,
  },
  previewSummary: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x10,
    textAlign: 'right',
    marginTop: Sizing.x15,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x10,
    gap: Sizing.layout.x1,
  },
  firstFormItem: {
    borderTopWidth: Sizing.layout.x1,
    borderBottomWidth: Sizing.layout.x1,
    borderStyle: 'dashed',
    borderColor: Colors.neutral.g200,
    padding: Sizing.layout.x10,
    marginVertical: Sizing.layout.x5,
  },
  formKey: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
  },
  formValue: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
  },
  topText: {
    textAlign: 'center',
  },
  listContainer: {
    width: Sizing.layoutP.xp100,
  },
  messageContainer: {
    borderTopWidth: Outlines.borderWidth.thin,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderStyle: 'dashed',
    padding: Sizing.layout.x20,
    borderColor: Colors.neutral.g400,
    marginVertical: Sizing.layout.x10,
  },
  messageText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    textAlign: 'center',
  },
  childTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    textAlign: 'center',
    paddingBottom: Sizing.layout.x20,
  },
  primaryTextStyle: {
    ...Typography.fontSize.x18,
    ...Typography.fontName.regular,
  },
  secondaryTextStyle: {
    ...Typography.fontSize.x18,
    ...Typography.fontName.medium,
  },
  balanceContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x1,
    borderTopWidth: Sizing.layout.x1,
    borderStyle: 'dashed',
    borderColor: Colors.neutral.g200,
    paddingTop: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x15,
    alignSelf: 'center',
  },
  subTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    textAlign: 'center',
    padding: Sizing.layout.x10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x10,
    gap: Sizing.layout.x1,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizing.layout.x5,
    marginTop: Sizing.layout.x20,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.violet.v550,
    borderRadius: Outlines.borderRadius.small,
    padding: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  linkTextStyle: {
    ...Typography.medium.x18,
    color: Colors.violet.v550,
  },
});

export default styles;
