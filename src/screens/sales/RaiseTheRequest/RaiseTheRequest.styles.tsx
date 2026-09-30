import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    ...(isWeb && {
      overflow: 'scroll',
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
    }),
    marginVertical: Sizing.layout.x10,
    marginHorizontal: Sizing.layoutP.xp2,
    maxHeight: 'auto',
  },
  header: {
    display: 'block',
  },
  header_md: {
    display: 'none',
  },
  header_lg: {
    display: 'none',
  },
  header_xl: {
    display: 'none',
  },
  container_md: {
    marginHorizontal: Sizing.layoutP.xp4,
    paddingHorizontal: Sizing.layout.x20,
    paddingTop: Sizing.layout.x10,
  },
  container_lg: {
    marginHorizontal: Sizing.layoutP.xp4,
    paddingHorizontal: Sizing.layout.x20,
    paddingTop: Sizing.layout.x10,
  },
  container_xl: {
    marginHorizontal: Sizing.layoutP.xp4,
    paddingHorizontal: Sizing.layout.x20,
    paddingTop: Sizing.layout.x10,
  },
  scrollContainer: {
    paddingHorizontal: Sizing.layout.x20,
    paddingTop: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.flexSize.x100,
  },
  content: {
    alignItems: 'center',
  },
  itemViewStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: Sizing.layout.x8,
  },
  inputLabel: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    gap: Sizing.layout.x8,
    padding: Sizing.layout.x2,
    ...(isWeb && { ...Typography.fontName.medium }),
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  input: {
    ...Forms.formField.primary,
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    marginVertical: Sizing.layout.x5,
  },
  accountInfoContainer: {
    marginBottom: Sizing.layout.x8,
    gap: Sizing.layout.x10,
    flexGrow: Sizing.flexSize.x100,
  },
  dropdownContainer: {
    gap: Sizing.layout.x10,
    flexGrow: Sizing.flexSize.x100,
  },
  dropdownContainer_md: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dropdownContainer_lg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dropdownContainer_xl: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suspenseDropdownContainer: {
    gap: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x5,
    flexGrow: Sizing.flexSize.x100,
  },
  suspenseDropdownContainer_md: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suspenseDropdownContainer_lg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suspenseDropdownContainer_xl: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avlBtnMarginTop: {},
  avlBtnMarginTop_md: {
    marginTop: Sizing.layout.x24,
  },
  avlBtnMarginTop_lg: {
    marginTop: Sizing.layout.x24,
  },
  avlBtnMarginTop_xl: {
    marginTop: Sizing.layout.x24,
  },
  dropdownContainerStyle: {
    ...Forms.formField.primary,
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    backgroundColor: Colors.neutral.white,
    marginVertical: Sizing.layout.x5,
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x0,
    height: Sizing.layout.x50,
    width: 'auto',
  },
  centerDropdownContainer: {
    ...Forms.formField.primary,
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    backgroundColor: Colors.neutral.white,
    alignSelf: 'stretch',
    width: 'auto',
  },
  textArea: {
    height: Sizing.layout.x100,
    textAlignVertical: 'top',
    paddingVertical: Sizing.layout.x10,
  },
  slotButtonContainer: {
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    gap: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainer_md: {
    flexDirection: 'row',
    paddingTop: Sizing.layout.x20,
  },
  buttonContainer_lg: {
    flexDirection: 'row',
    paddingTop: Sizing.layout.x20,
  },
  buttonContainer_xl: {
    flexDirection: 'row',
    paddingTop: Sizing.layout.x20,
  },
  button: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    borderRadius: Outlines.borderRadius.small,
  },
  button_md: {
    width: 'auto',
    minWidth: Sizing.layout.x200,
  },
  button_lg: {
    width: 'auto',
    minWidth: Sizing.layout.x200,
  },
  button_xl: {
    width: 'auto',
    minWidth: Sizing.layout.x200,
  },
  slotButton: {
    textTransform: 'none',
  },
  textWrapper: {
    flexDirection: 'row',
    paddingVertical: Sizing.layout.x5,
  },
  primaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x22,
    marginBottom: Sizing.layout.x2,
  },
  secondaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x800,
    lineHeight: Sizing.layout.x22,
  },
  icon: {
    marginTop: Sizing.layout.x5,
  },
  flexStyle: {
    flexGrow: Sizing.flexSize.x100,
  },
  chevronIconStyle: {
    tintColor: Colors.neutral.black,
  },
  inputFieldStyle: {
    minHeight: Sizing.layout.x40,
  },
});

export default styles;
