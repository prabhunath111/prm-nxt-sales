import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { borderWidth } from 'styles/outlines';
import { isWeb } from 'utils/platformHelper';

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
    padding: Sizing.layout.x6,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.small,
    borderColor: Colors.neutral.g250,
  },
  inputStyle: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
    borderWidth: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x0,
    paddingLeft: Sizing.layout.x5,
    minHeight: isWeb ? 'auto' : null,
    width: isWeb ? Sizing.layoutP.xp85 : null,
  },
  button: {
    ...Forms.formField.primary,
    flex: Sizing.layout.x1,
    borderWidth: Sizing.layout.x0,
  },
  icon: {
    marginLeft: Sizing.layout.x2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle: {
    ...Forms.list.primary,
  },
  selectedItem: {
    backgroundColor: Colors.secondary.brand,
  },
  labelStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
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
    ...Typography.fontSize.x16,
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
    padding: Sizing.layout.x5,
    width: Sizing.layoutP.xp100,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.small,
    borderColor: Colors.neutral.g400,
  },
  modalStyle: {
    maxHeight: Sizing.layout.x300,
    width: Sizing.layoutP.xp100,
  },
  pressableStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    alignItems: 'center',
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
});

export default styles;
