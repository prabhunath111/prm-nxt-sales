import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.appColors.darkViolet,
    borderRadius: Sizing.layout.x8,
    overflow: 'hidden',
  },
  container: {
    marginHorizontal: Sizing.layout.x20,
    marginVertical: Sizing.layout.x16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.white,
  },
  chartContainer: {
    backgroundColor: Colors.appColors.indigo,
    width: Sizing.layoutP.xp100,
    justifyContent: 'center',
    paddingLeft: Sizing.layout.x15,
  },
  ftdMtdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ftdMtd: {
    backgroundColor: Colors.appColors.indogo500,
    borderRadius: Sizing.layout.x8,
    padding: Sizing.layout.x8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x6,
    marginRight: Sizing.layout.x16,
    marginLeft: Sizing.layout.x5,
  },
  ftdMtdText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    color: Colors.neutral.white,
  },
  ftdMtdValue: {
    ...Typography.fontSize.x18,
    ...Typography.fontName.medium,
  },

  dropDownBorder: {
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.appColors.dullLavender,
  },
  inputStyle: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    height: Sizing.layout.x35,
    backgroundColor: Colors.transparent.clear,
  },
  inputContainerStyle: {
    borderRadius: Sizing.layout.x2,
    borderBottomWidth: Sizing.layout.x1,
    height: Sizing.layout.x32,
    borderBottomColor: Colors.appColors.dullLavender,
    paddingLeft: Sizing.layout.x10,
    paddingRight: Sizing.layout.x10,
    width: Sizing.layout.x130,
    backgroundColor: Colors.transparent.clear,
  },
  historyDropDown: {
    borderWidth: Sizing.layout.x0,
    borderRadius: Sizing.layout.x0,
    borderBottomWidth: Sizing.layout.x1,
  },
});

export default styles;
