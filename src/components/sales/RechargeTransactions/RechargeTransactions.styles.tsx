import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { platform } from 'utils/platformHelper';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x15,
  },
  currentBalanceConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    padding: Sizing.layout.x8,
    marginVertical: Sizing.x10,
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  currentBalance: {
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    ...Typography.fontName.regular,
    color: Colors.appColors.darkViolet,
  },
  currentBalanceVal: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    marginLeft: Sizing.layout.x5,
  },
  currentBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prvTransactionContainer: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x8,
    paddingHorizontal: Sizing.layout.x12,
    marginVertical: Sizing.x10,
    width: Sizing.layoutP.xp100,
    ...(platform().OS !== 'web' && {
      paddingBottom: Sizing.layout.x12,
      paddingHorizontal: Sizing.layout.x8,
    }),
  },
  prvTransactionCard: {
    backgroundColor: Colors.neutral.white,
    padding: Sizing.layout.x8,
    width: Sizing.layoutP.xp100,
  },
  seperator: {
    borderBottomWidth: Sizing.layout.x1,
    width: Sizing.layoutP.xp100,
    borderColor: Colors.neutral.g250,
  },
  transDate: {
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.appColors.darkViolet,
  },
  transId: {
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    ...Typography.fontName.regular,
    color: Colors.appColors.darkViolet,
    marginTop: Sizing.layout.x5,
  },
  transCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    borderWidth: Sizing.layout.xDot7Dot5,
    borderColor: Colors.appColors.pink,
    borderRadius: Sizing.layout.x4,
    paddingVertical: Sizing.layout.x2,
    paddingHorizontal: Sizing.layout.x4,
    marginTop: Sizing.layout.x5,
  },
  buttonLabel: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    color: Colors.appColors.pink,
  },
  title: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    color: Colors.appColors.darkViolet,
    paddingVertical: Sizing.layout.x14,
  },
  margin: {
    marginBottom: Sizing.layout.x18,
  },
  imageStyle: {
    tintColor: Colors.appColors.midGreen,
  },
  midGreen: {
    color: Colors.appColors.midGreen,
  },
  lightRed: {
    color: Colors.appColors.lightRed,
  },
  imageStyleRed: {
    tintColor: Colors.appColors.lightRed,
  },
  prvTranscationView: {
    width: Sizing.layoutP.xp100,
  },
  marginDefault: {
    height: Sizing.layout.x10,
  },
  viewMoreButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizing.layout.x15,
  },
  iconStyle: {
    height: Sizing.layout.x14,
    width: Sizing.layout.x20,
  },
  viewMoreText: {
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.appColors.pink,
  },
});

export default styles;
