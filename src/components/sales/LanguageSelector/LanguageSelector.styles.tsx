import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageItem: {
    ...Forms.list.primary,
    flexDirection: 'row',
    marginBottom: Sizing.x10,
  },
  languageText: {
    ...Typography.fontWeight.x400,
    fontSize: Typography.fontSize.x18.fontSize,
    fontFamily: Typography.fontName.medium.fontFamily,
    color: Colors.neutral.black,
    marginLeft: Sizing.layout.x5,
    paddingLeft: Sizing.layoutP.xp3,
  },
  checkIcon: {
    position: 'absolute',
    right: Sizing.layoutP.xp5,
  },
  iconStyle: {
    tintColor: Colors.neutral.white,
    ...(isWeb
      ? {
          marginLeft: Sizing.layout.x20,
        }
      : { marginRight: Sizing.layout.x10 }),
  },
  optionContainer: {
    height: Sizing.layoutP.xp100,
  },
  gradientContainer: {
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    padding: 10,
  },
  listContainer: {
    maxHeight: Sizing.x379,
  },
});

export default styles;
