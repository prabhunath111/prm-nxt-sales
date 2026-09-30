import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { styles as globalStyles } from 'styles/global';

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizing.layout.x8,
    width: Sizing.layoutP.xp100,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {},
  checkboxBase: {
    width: Sizing.layout.x18,
    height: Sizing.layout.x18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Outlines.borderRadius.smallest,
    borderWidth: Outlines.borderWidth.base,
    borderColor: Colors.primary.brand,
    backgroundColor: Colors.transparent.clear,
    marginTop: Sizing.layout.x3,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary.theme,
  },
  errorText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
  },
  iconStyle: {
    tintColor: 'white',
  },
  subLabel: {
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x12,
    ...Typography.fontSize.x10,
    ...Typography.fontName.regular,
    marginTop: Sizing.layout.x5,
  },
  labelContainer: {
    gap: Sizing.layout.x4,
    flex: Sizing.flexSize.x100,
    marginTop: Sizing.layout.x3,
  },
});

export default styles;
