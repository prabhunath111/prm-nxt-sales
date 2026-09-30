import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: Sizing.flexSize.x100,
    borderColor: Colors.violet.borderGrey,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.smallMedium,
  },
  switchContainer: {
    width: Sizing.layoutP.xp30,
    backgroundColor: Colors.violet.v50,
  },
  listContainer: {},
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: Colors.violet.borderGrey,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.smallMedium,
    paddingVertical: Sizing.layout.x8,
    margin: Sizing.layout.x5,
    width: Sizing.layoutP.xp45,
    minHeight: Sizing.layout.x38,
    paddingRight: Sizing.layout.x5,
  },
  selectedCheckbox: {},
  primaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x12,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x1,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: Sizing.layoutP.xp100,
  },
  switchText: {
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
    ...Typography.fontSize.x14,
    color: Colors.neutral.black,
  },
  activeSwitchText: {
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
  },
  switchButton: {
    paddingVertical: Sizing.layout.x15,
    paddingLeft: Sizing.layout.x4,
  },
  activeSwitchButton: {
    backgroundColor: Colors.neutral.white,
    borderLeftWidth: Sizing.layout.x3,
    borderLeftColor: Colors.primary.brand,
  },
  checkboxBase: {
    width: Sizing.layout.x18,
    height: Sizing.layout.x18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Outlines.borderRadius.smallest,
    backgroundColor: Colors.transparent.clear,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.primary.brand,
    marginHorizontal: Sizing.layout.x8,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary.brand,
  },
  iconStyle: {
    tintColor: Colors.neutral.white,
  },
  checkBoxDetails: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'column',
    alignItems: 'center',
    gap: Sizing.layout.x4,
    flexWrap: 'wrap',
  },
});

export default styles;
