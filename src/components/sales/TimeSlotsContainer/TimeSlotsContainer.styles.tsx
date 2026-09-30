import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { modifiedScreenHeight } from 'styles/dimentionHelper';

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Colors.transparent.clear,
    opacity: Sizing.x1,
  },
  inputContainer: {
    flexDirection: 'row',
    flexGrow: Sizing.flexSize.x100,
    paddingHorizontal: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    borderRadius: Sizing.layout.x4,
    borderColor: Colors.neutral.g250,
  },
  arrow: {
    width: Sizing.layout.x0,
    height: Sizing.layout.x0,
  },
  inputField: {
    ...Forms.formField.primary,
    borderWidth: Sizing.layout.x0,
    borderRadius: Sizing.layout.x0,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
    borderColor: 'black',
  },
  iconButton: {
    justifyContent: 'center',
  },
  errorText: {
    ...Typography.fontSize.x16,
  },
  title: {
    ...Typography.fontSize.x14,
    ...Typography.lineHeight.x20,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v250,
    marginBottom: Sizing.layout.x10,
  },
  timeSlotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Sizing.layout.x1,
    borderRadius: Sizing.layout.x8,
    borderColor: Colors.neutral.g250,
    paddingHorizontal: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x10,
    margin: Sizing.layout.x5,
  },
  timeSlotText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x20,
    paddingHorizontal: Sizing.layout.x10,
  },
  buttonContainer: {
    marginTop: Sizing.layout.x30,
    gap: Sizing.layout.x5,
  },
  marginRight: {
    marginRight: Sizing.layout.x10,
    minHeight: Sizing.layout.x43,
  },
  buttonLabel: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
  },
  timeSlotView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
    color: Colors.neutral.black,
    padding: Sizing.layout.x10,
  },
  contentContainer: {
    alignSelf: 'center',
    height: modifiedScreenHeight() * 0.3,
  },
  error: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.regular,
    color: Colors.appColors.red,
    paddingVertical: Sizing.layout.x8,
  },
});

export default styles;
