import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { isAndroid } from 'utils/platformHelper';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbBorder: {
    position: 'absolute',
    width: Sizing.layout.x20,
    height: Sizing.layout.x20,
    borderRadius: Sizing.layout.x50,
    borderWidth: Sizing.layout.xDot5,
    top: Sizing.layout.x0,
  },
  label: {
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
    marginRight: Sizing.layout.x5,
  },
  switchStyle: {
    height: Sizing.layout.x20,
  },
  thumbEnable: {
    backgroundColor: Colors.neutral.white,
    borderColor: Colors.violet.violetPink,
    right: isAndroid() ? Sizing.layout.x3 : Sizing.layout.x0,
  },
  thumbDisable: {
    borderColor: Colors.violet.violetPink,
    left: isAndroid() ? Sizing.layout.x3 : Sizing.layout.x0,
  },
});

export default styles;
