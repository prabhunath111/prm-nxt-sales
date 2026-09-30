import { StyleSheet } from 'react-native';
import { Colors, Sizing, Outlines, Typography } from 'styles';

const styles: any = StyleSheet.create({
  buttonStyle: {
    // gap: Sizing.layout.x10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizing.layout.x10,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    borderStyle: 'solid',
    flexGrow: Sizing.layout.x1,
    margin: Sizing.layout.x5,
  },
  buttonStyle_xs: {
    width: Sizing.layoutP.xp100,
  },
  buttonStyle_sm: {
    width: Sizing.layoutP.xp100,
  },
  iconText: {
    flex: 1,
    ...Typography.regular.x14,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
    marginLeft: Sizing.layout.x10,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: Sizing.layout.x12,
    flex: 1,
  },
  chevronIconStyle: {
    width: Sizing.layout.x24,
    height: Sizing.layout.x24,
    tintColor: Colors.violet.violetPink,
  },
});

export default styles;
