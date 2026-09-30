import { StyleSheet } from 'react-native';
import { Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
  },
  subContainer: {
    height: Sizing.layoutP.xp100,
    width: Sizing.layoutP.xp100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...Typography.fontWeight.x700,
  },
  button: {
    width: Sizing.layoutP.xp80,
    paddingVertical: Sizing.layoutP.xp3,
    marginTop: Sizing.layoutP.xp8,
  },
  subText: {
    textAlign: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  Separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizing.layoutP.xp5,
    width: Sizing.layoutP.xp60,
  },
  line: {
    flex: 1,
    borderWidth: Sizing.layout.x1,
    borderStyle: 'dashed',
  },
  text: {
    marginHorizontal: Sizing.layout.x10,
    fontSize: Typography.fontSize.x16.fontSize,
    ...Typography.fontWeight.x700,
  },
  skipText: {
    marginTop: Sizing.layoutP.xp5,
    fontSize: Typography.fontSize.x20.fontSize,
    ...Typography.fontWeight.x700,
  },
});

export default styles;
