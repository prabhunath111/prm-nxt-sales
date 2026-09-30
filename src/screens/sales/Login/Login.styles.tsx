import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { getScreenHeight } from 'styles/dimentionHelper';
import { platform } from 'utils/platformHelper';

const styles: any = StyleSheet.create({
  container: {
    ...(platform().OS !== 'web' && {
      flex: 1,
      paddingBottom: 20,
    }),
    ...(platform().OS === 'web' && {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 'auto',
      height: getScreenHeight(),
      width: Sizing.layoutP.xp100,
      backgroundColor: Colors.primary.theme,
    }),
  },
  logoContainer: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginBottom: Sizing.layout.x30,
  },
  logoContainer_lg: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginBottom: Sizing.layout.x30,
  },
  logoContainer_md: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginBottom: Sizing.layout.x30,
  },
  logoContainer_sm: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    position: 'absolute',
    top: Sizing.layoutP.xp20,
  },
  logoContainer_xs: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    position: 'absolute',
    top: Sizing.layoutP.xp20,
  },
  card: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    ...(platform().OS === 'web' && {
      paddingVertical: Sizing.layout.x40,
      width: Sizing.layoutP.xp30,
      paddingHorizontal: Sizing.layout.x20,
    }),
    ...(platform().OS !== 'web' && {
      width: Sizing.layoutP.xp100,
      paddingTop: Sizing.layout.x40,
      paddingHorizontal: Sizing.layout.x20,
      position: 'absolute',
      bottom: 0,
      paddingBottom: Sizing.layout.x40,
      borderTopLeftRadius: Sizing.layout.x10,
      borderTopRightRadius: Sizing.layout.x10,
    }),
    ...(platform().OS === 'android' && {
      paddingTop: Sizing.layout.x24,
      paddingBottom: Sizing.layout.x24,
    }),
  },
  card_lg: {
    width: Sizing.layoutP.xp30,
    paddingVertical: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x20,
  },
  card_md: {
    width: Sizing.layout.x360,
    paddingVertical: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x20,
  },
  card_sm: {
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x20,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: Sizing.layout.x10,
    borderTopRightRadius: Sizing.layout.x10,
  },
  card_xs: {
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x20,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: Sizing.layout.x10,
    borderTopRightRadius: Sizing.layout.x10,
  },
  inputContainer: {
    width: Sizing.layoutP.xp100,
  },
  heading: {
    color: Colors.appColors.darkViolet,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x24,
    padding: 0,
    marginBottom: Sizing.layout.x30,
    ...(platform().OS !== 'web' && {
      marginBottom: Sizing.layout.x24,
    }),
  },
  textInput: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.violet.v200,
    ...Typography.fontSize.x16,
    color: Colors.neutral.black,
    paddingBottom: Sizing.layout.x5,
    ...(platform().OS === 'web' && {
      outlineStyle: 'none',
    }),
  },

  labelText: {
    ...Typography.fontName.semibold,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v250,
    paddingBottom: Sizing.layout.x10,
  },

  inputText: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderColor: Colors.violet.v200,
    paddingBottom: Sizing.layout.x50,
    marginBottom: Sizing.layout.x20,
    backgroundColor: Colors.transparent.clear,
    ...(platform().OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
  inputText_lg: {
    ...Typography.fontSize.x16,
    paddingBottom: Sizing.layout.x12,
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
    width: Sizing.layoutP.xp100,
    marginTop: Sizing.layoutP.xp5,
    paddingTop: Sizing.layoutP.xp1,
  },

  loginButton: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: Sizing.layoutP.xp90,
    ...(platform().OS === 'web' && {
      width: Sizing.layoutP.xp100,
      paddingHorizontal: Sizing.layout.x10,
    }),
    ...(platform().OS !== 'web' && {
      width: Sizing.layoutP.xp100,
    }),
  },
  loginButton_xs: {
    width: Sizing.layoutP.xp90,
  },
  buttonLabel: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
  },
  errorText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    alignSelf: 'flex-start',
    marginVertical: Sizing.layout.x4,
  },
  text: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    color: Colors.violet.v300,
    marginVertical: Sizing.layout.x10,
    textTransform: 'lowercase',
  },
  image: {
    width: Sizing.layout.x300,
    height: Sizing.layout.x100,
  },

  // otp ver styles

  otpContainer: {
    width: Sizing.layoutP.xp100,
    alignItems: 'center',
  },
  otpTextStyle: {
    ...Typography.fontSize.x24,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x600,
    color: Colors.violet.darkViolet,
  },
  backButton: {
    marginTop: Sizing.layout.x8,
  },
  detailsContainer: {
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizing.layout.x24,
  },
  enterOtpText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.semibold,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v250,
  },
  sentToText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
    color: Colors.violet.v250,
  },
  sentToTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  resendText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
    color: Colors.appColors.lightPurple,
    alignSelf: 'flex-start',
  },
  otpFieldStyle: {
    width: Sizing.layout.x40,
    height: Sizing.layout.x40,
    ...Forms.input.secondary,
    borderBottomWidth: Sizing.layout.x0,
  },
  otpInputContainer: {
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Sizing.layout.x12,
  },
  otpInput: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
    width: Sizing.layout.x40,
    height: Sizing.layout.x40,
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g300,
    textAlign: 'center',
  },
  resentContainer: {
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorPink: {
    color: Colors.appColors.pink,
  },
  width100P: {
    width: Sizing.layoutP.xp100,
    marginTop: Sizing.layout.x24,
  },
  linkContainer: {
    width: Sizing.layoutP.xp100,
    marginTop: Sizing.layout.x25,
  },
  linkTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    color: Colors.appColors.lightPurple,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.appColors.lightPurple,
  },
  orText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    color: Colors.violet.darkViolet,
    alignSelf: 'center',
    marginTop: Sizing.layout.x8,
  },
});

export default styles;
