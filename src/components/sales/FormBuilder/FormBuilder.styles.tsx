import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  groupContainer: {
    gap: Sizing.layout.x10,
  },
  groupContainer_md: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  groupContainer_lg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  groupContainer_xl: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formContainer: {
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x100,
  },
  formSubContainer: {
    padding: Sizing.layout.x20,
    gap: Sizing.layout.x10,
  },
  formSubContainer_xs: {
    padding: Sizing.layout.x10,
  },
  formSubContainer_sm: {
    padding: Sizing.layout.x10,
  },
  title: {
    ...Typography.fontSize.x30,
    color: Colors.neutral.black,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'column',
    gap: Sizing.layout.x10,
  },
  button: {
    gap: Sizing.layout.x20,
  },
  inputField: {
    ...Forms.formField.primary,
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
  },
  checkboxLabelStyle: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x16,
    color: Colors.neutral.black,
  },
  itemViewStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: Sizing.layout.x8,
  },
  itemViewStyle_md: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'flex-start',
  },
  itemViewStyle_lg: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'flex-start',
  },
  itemViewStyle_xl: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'flex-start',
  },
  itemTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    ...Typography.lineHeight.x20,
    color: Colors.neutral.black,
    ...(isWeb && { ...Typography.fontName.medium }),
  },
  dropdownContainerStyle: {
    ...Forms.formField.primary,
    borderWidth: Outlines.borderWidth.base,
    borderRadius: Outlines.borderRadius.base,
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x0,
    width: Sizing.layoutP.xp100,
  },
  sectionTitle: {
    fontSize: Sizing.x20,
    height: Sizing.x30,
    marginLeft: Sizing.x15,
    marginTop: Sizing.x10,
  },
  sectionDescription: {
    ...Typography.fontSize.x10,
    height: Sizing.x30,
    marginLeft: Sizing.x15,
  },
  textStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
    textAlign: 'center',
  },
  primaryButtonContainer: {
    borderRadius: Outlines.borderRadius.smallest,
    paddingTop: Sizing.layout.x10,
  },
  primaryButtonContainer_md: {
    paddingTop: Sizing.layout.x20,
  },
  primaryButtonContainer_lg: {
    paddingTop: Sizing.layout.x20,
  },
  primaryButtonContainer_xl: {
    paddingTop: Sizing.layout.x20,
  },
  buttonContainer: {
    ...Forms.buttonContainer.primary,
    minWidth: Sizing.layout.x200,
  },
  buttonContainer_md: {
    paddingTop: Sizing.layout.x20,
  },
  buttonContainer_lg: {
    paddingTop: Sizing.layout.x20,
  },
  buttonContainer_xl: {
    paddingTop: Sizing.layout.x20,
  },
  chevronIconStyle: {
    tintColor: Colors.neutral.black,
  },
  buttonStyle: {
    backgroundColor: Colors.primary.theme,
    flex: Sizing.flexSize.x100,
  },
  inputFieldStyle: {
    minHeight: Sizing.layout.x40,
  },
});

export default styles;
