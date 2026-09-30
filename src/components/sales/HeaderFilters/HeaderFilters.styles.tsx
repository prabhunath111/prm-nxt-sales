import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { getScreenHeight, getScreenWidth } from 'styles/dimentionHelper';

const styles = StyleSheet.create({
  languageListView: {
    padding: Sizing.layout.x5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  languageScrollContainer: {
    height: getScreenHeight() * 0.45,
    width: getScreenWidth() * 0.75,
  },
  checkboxContainer: {
    width: Sizing.layout.x110,
    borderWidth: Outlines.borderWidth.thin,
    padding: Sizing.layout.x5,
    margin: Sizing.layout.x5,
    borderRadius: Outlines.borderRadius.smallMedium,
    justifyContent: 'center',
    borderColor: Colors.neutral.g250,
  },
  checkBoxLabel: {
    fontSize: Typography.fontSize.x12.fontSize,
  },
  modalBackgroundStyle: {
    backgroundColor: Colors.violet.backgroundViolet,
  },
  modalContainer: {
    margin: Sizing.layout.x10,
  },
  headerView: {
    height: Sizing.layout.x40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: Typography.fontSize.x18.fontSize,
    fontWeight: Typography.fontWeight.x500.fontWeight,
  },
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Sizing.layout.x4,
    borderColor: Colors.neutral.g250,
  },
  menuContainer: {
    height: Sizing.layout.x35,
    flexDirection: 'row',
    gap: Sizing.layout.x10,
    alignItems: 'center',
    width: getScreenWidth() * 0.25,
  },
  menuSelect: {
    width: Sizing.layout.x3,
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.appColors.pink,
    borderTopLeftRadius: Sizing.layout.x4,
  },
  menuText: {
    fontSize: Typography.fontSize.x14.fontSize,
    fontWeight: Typography.fontWeight.x500.fontWeight,
    color: Colors.neutral.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    margin: Sizing.layout.x5,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x10,
  },
});

export default styles;
