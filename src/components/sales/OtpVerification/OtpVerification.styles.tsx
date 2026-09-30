import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
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
    marginTop: Sizing.layout.x30,
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
    width: Sizing.layout.x40,
    height: Sizing.layout.x40,
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g300,
    textAlign: 'center',
    color: Colors.neutral.black,
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
    marginTop: Sizing.layout.x35,
  },
  errorText: {
    ...Typography.fontSize.x14,
    alignSelf: 'flex-start',
    paddingTop: Sizing.layout.x15,
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
