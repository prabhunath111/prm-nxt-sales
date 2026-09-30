import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: Outlines.borderWidth.base,
    borderBottomColor: Colors.neutral.g300,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizing.layout.x12,
    padding: Sizing.layout.x8,
  },
  inputStyle: {
    borderWidth: Sizing.layout.x0,
    flex: Sizing.flexSize.x100,
    paddingHorizontal: Sizing.layout.x0,
    minHeight: 'auto',
    width: Sizing.layoutP.xp100,
  },
  button: {
    ...Forms.formField.primary,
    flex: Sizing.layout.x1,
    borderWidth: Sizing.layout.x0,
  },
  dropdownIcon: {
    justifyContent: 'center',
  },
  buttonStyle: {
    ...Forms.list.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Sizing.layout.x10,
  },
  listStyle: {
    maxHeight: Sizing.layout.x200,
  },
  selectedItem: {
    backgroundColor: Colors.secondary.brand,
    paddingBottom: Sizing.layout.x6,
    paddingTop: Sizing.layout.x8,
    borderRadius: Outlines.borderRadius.small,
  },
  labelStyle: {
    ...Typography.medium.x14,
    color: Colors.neutral.black,
    marginLeft: Sizing.layout.x5,
  },
  labelStyle_sm: {
    maxWidth: Sizing.layout.x150,
  },
  labelStyle_xs: {
    maxWidth: Sizing.layout.x140,
  },
  subLabelStyle: {
    ...Typography.medium.x14,
    color: Colors.violet.v400,
  },
  errorStyle: {
    ...Typography.fontSize.x13,
    marginTop: Sizing.layoutP.xp1,
  },
  listViewStyle: {
    width: Sizing.layoutP.xp100,
    maxHeight: Sizing.layout.x250,
    backgroundColor: Colors.neutral.white,
    borderBottomColor: Colors.neutral.white,
    borderRadius: Sizing.x3,
    top: Sizing.x7,
  },
  closeIconStyle: {
    justifyContent: 'center',
    position: 'absolute',
    right: Sizing.layout.x30,
    top: Sizing.layoutP.xp40,
  },
  arrowContainer: {
    position: 'absolute',
    width: Sizing.x18,
    height: Sizing.x10,
    right: Sizing.x30,
    top: Sizing.x0,
  },
  arrowHead: {
    position: 'absolute',
    borderBottomColor: Colors.neutral.white,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomWidth: Sizing.x10,
    borderRightWidth: Sizing.x10,
    borderLeftWidth: Sizing.x10,
    bottom: Sizing.x0,
  },
  modalBackground: {
    flex: Sizing.x1,
  },
  modalContent: {
    alignSelf: 'center',
    width: Sizing.layoutP.xp100,
    position: 'relative',
    paddingBottom: Sizing.layout.x10,
  },
  selectedTextStyle: {
    ...Typography.medium.x16,
    color: Colors.neutral.white,
  },
  unselectedTextStyle: {
    color: Colors.neutral.black,
  },
});

export default styles;
