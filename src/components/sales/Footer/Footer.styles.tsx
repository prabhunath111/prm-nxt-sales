import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles: any = StyleSheet.create({
  container: {
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x8,
    backgroundColor: Colors.appColors.darkViolet,
    paddingHorizontal: Sizing.layout.x20,
  },
  gradientContainer: {
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x15,
    paddingHorizontal: Sizing.layoutP.xp2,
  },
  textStyle: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x16,
  },
  textStyle_sm: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x14,
  },
  textStyle_xs: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x13,
  },
});

export default styles;
