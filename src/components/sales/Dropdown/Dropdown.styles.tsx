import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { borderWidth } from 'styles/outlines';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Sizing.flexSize.x10,
    flexGrow: Sizing.flexSize.x100,
    alignSelf: 'stretch',
    flexShrink: Sizing.flexSize.x100,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    overflow: 'hidden',
    padding: Sizing.layout.x4,
  },
  inputStyle: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x300,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
    borderWidth: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x0,
    minHeight: 'auto',
    alignContent: 'center',
    width: Sizing.layoutP.xp85,
  },
  button: {
    ...Forms.formField.primary,
    flex: Sizing.layout.x1,
    borderWidth: Sizing.layout.x0,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: Sizing.layout.x4,
    width: Sizing.layoutP.xp15,
  },
  listStyle: {
    ...Forms.list.primary,
    paddingVertical: Sizing.layout.x7,
  },
  listNewStyle: {
    maxHeight: Sizing.layout.x200,
  },
  selectedItem: {
    backgroundColor: Colors.secondary.brand,
  },
  labelStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    fontWeight: '300',
    color: Colors.neutral.black,
    marginLeft: Sizing.layout.x5,
  },
  separator: {
    height: Sizing.layout.x1,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.g400,
  },
  arrow: {
    width: Sizing.layout.x0,
    height: Sizing.layout.x0,
  },
  errorText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    marginTop: Sizing.layout.x8,
  },
  errorStyle: {
    ...Typography.fontSize.x16,
  },
  listContainer: {
    backgroundColor: Colors.neutral.white,
    borderColor: Colors.neutral.g150,
    borderRadius: Sizing.x3,
    borderWidth: borderWidth.hairline,
  },
  listContainerWeb: {
    width: Sizing.layoutP.xp100,
    maxHeight: Sizing.layout.x250,
  },
  modalStyle: {
    maxHeight: Sizing.layout.x300,
    width: Sizing.layoutP.xp100,
  },
  pressableStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
  },
  label: {
    ...Typography.fontSize.x10,
    color: Colors.neutral.black,
    textAlignVertical: 'center',
  },
  required: {
    ...Forms.formField.required,
    ...Typography.fontSize.x25,
  },
  zIndexStyle: { zIndex: 9999 },
});

export default styles;
