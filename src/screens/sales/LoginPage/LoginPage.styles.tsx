import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { getScreenHeight, getScreenWidth } from 'styles/dimentionHelper';
import { platform } from 'utils/platformHelper';

const styles: any = StyleSheet.create({
  safeAreaFlex: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    height: getScreenHeight() * 0.9,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.primary.theme,
  },

  logoContainer: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: getScreenWidth() * 0.5,
    marginVertical: Sizing.layout.x50,
  },

  card: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: Sizing.layoutP.xp90,
    shadowOpacity: 0.3,
    shadowRadius: Outlines.borderRadius.base,
    elevation: Sizing.layout.x20,
    ...(platform().OS === 'web' && {
      paddingVertical: Sizing.layout.x50,
      marginVertical: Sizing.layout.x15,
      width: Sizing.layoutP.xp60,
    }),
  },

  card_lg: {
    width: Sizing.layoutP.xp50,
    paddingVertical: Sizing.layout.x60,
  },
  card_sm: {
    width: Sizing.layoutP.xp90,
    paddingVertical: Sizing.layout.x40,
  },
  card_xs: {
    width: Sizing.layoutP.xp90,
    paddingVertical: Sizing.layout.x40,
  },

  inputContainer: {
    width: Sizing.layoutP.xp100,
    alignItems: 'center',
  },

  inputText: {
    height: Sizing.layout.x50,
    width: Sizing.layoutP.xp90,
    color: Colors.neutral.white,
    ...Typography.fontSize.x20,
    borderColor: Colors.neutral.white,
    borderBottomWidth: Outlines.borderWidth.thin,
    paddingBottom: Sizing.layout.x2,
    marginBottom: Sizing.layout.x20,
    backgroundColor: Colors.transparent.clear,
    ...(platform().OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
  inputText_lg: {
    height: Sizing.layout.x70,
    ...Typography.fontSize.x30,
  },
  inputText_md: {
    height: Sizing.layout.x50,
    ...Typography.fontSize.x20,
  },
  inputText_sm: {
    height: Sizing.layout.x50,
  },

  contentCenter: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    width: Sizing.layoutP.xp80,
    ...(platform().OS === 'web' && {
      width: Sizing.layoutP.xp90,
    }),
  },

  contentStart: {
    alignItems: 'flex-start',
    width: Sizing.layoutP.xp50,
  },

  contentEnd: {
    alignItems: 'flex-end',
    width: Sizing.layoutP.xp50,
  },

  checkboxContainer: {
    marginBottom: Sizing.layoutP.xp5,
    marginLeft: Sizing.layoutP.xp5,
  },

  versionText: {
    color: Colors.neutral.g400,
    ...Typography.fontSize.x15,
    ...Typography.fontWeight.x700,
  },
  versionText_lg: {
    ...Typography.fontSize.x30,
  },
  versionText_xl: {
    ...Typography.fontSize.x30,
  },
  versionText_md: {
    ...Typography.fontSize.x20,
  },

  forgotText: {
    color: Colors.error.primary,
    ...Typography.fontSize.x15,
  },

  forgotText_md: {
    ...Typography.fontSize.x20,
  },
  forgotText_xl: {
    ...Typography.fontSize.x30,
  },

  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: Sizing.layoutP.xp90,
    marginTop: Sizing.layoutP.xp5,
  },

  loginButton: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: Sizing.layoutP.xp90,
    marginTop: Sizing.layoutP.xp5,
    ...(platform().OS === 'web' && {
      width: Sizing.layoutP.xp100,
    }),
  },
  loginButton_xs: {
    width: Sizing.layoutP.xp90,
  },
  errorText: {
    marginLeft: Sizing.layoutP.xp5,
    alignSelf: 'flex-start',
  },
});

export default styles;
