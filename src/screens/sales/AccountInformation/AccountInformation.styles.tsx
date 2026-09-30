import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { isAndroid } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    marginTop: Sizing.layout.x20,
  },
  header: {
    display: 'none',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  header_md: {
    display: 'block',
  },
  header_lg: {
    display: 'block',
  },
  header_xl: {
    display: 'block',
  },
  commonContainer: {
    gap: Sizing.layout.x8,
  },
  commonContainer_md: {
    gap: Sizing.layout.x0,
    flexDirection: 'row',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  commonContainer_lg: {
    gap: Sizing.layout.x0,
    flexDirection: 'row',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  commonContainer_xl: {
    gap: Sizing.layout.x0,
    flexDirection: 'row',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  bottomContainer: {
    gap: Sizing.layout.x8,
  },
  bottomContainer_md: {
    marginHorizontal: Sizing.layoutP.xp4,
  },
  bottomContainer_lg: {
    flexDirection: 'row',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  bottomContainer_xl: {
    flexDirection: 'row',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    alignItems: 'stretch',
    paddingTop: Sizing.layout.x10,
  },
  cardContainer: {
    borderRadius: Sizing.layout.x0,
    padding: Sizing.layout.x18,
    marginVertical: Sizing.layout.x0,
  },
  cardContainer_xs: {
    padding: Sizing.layout.x1,
    margin: Sizing.layout.x0,
  },
  childStyle: {
    height: Sizing.layoutP.xp100,
  },
  dhamakaCardContainer: {
    borderRadius: Sizing.layout.x0,
    marginVertical: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x18,
    marginHorizontal: Sizing.layoutP.xp4,
    justifyContent: 'center',
  },
  commonCardContainer: {
    borderRadius: Sizing.layout.x0,
    marginVertical: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x18,
    justifyContent: 'center',
  },
  commonCardContainer_md: {
    borderRadius: Sizing.layout.x0,
    marginHorizontal: Sizing.layout.x0,
    flex: Sizing.flexSize.x100,
  },
  commonCardContainer_lg: {
    borderRadius: Sizing.layout.x0,
    marginHorizontal: Sizing.layout.x0,
    flex: Sizing.flexSize.x100,
  },
  commonCardContainer_xl: {
    borderRadius: Sizing.layout.x0,
    marginHorizontal: Sizing.layout.x0,
    flex: Sizing.flexSize.x100,
  },
  customerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  dhamakaLockingInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Sizing.layoutP.xp100,
  },
  imageContainer: {
    padding: Sizing.layout.x18,
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.neutral.g200,
    borderStyle: 'dashed',
    height: Sizing.layoutP.xp100,
  },
  customerInfoLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp50,
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g200,
  },
  textContainerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryText: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.black,
    textAlign: 'left',
    flexShrink: 1,
  },
  primaryTextLarge: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.black,
    textAlign: 'left',
    flexShrink: 1,
  },
  secondaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.black,
    textAlign: 'center',
    marginTop: Sizing.layout.x5,
    flexShrink: 1,
  },
  backButton: {
    marginHorizontal: Sizing.layoutP.xp4,
    marginVertical: Sizing.layout.x15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    ...(isAndroid() && { paddingBottom: Sizing.layout.x40 }),
  },
  rechargeContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    flex: Sizing.layout.x100,
    padding: Sizing.layout.x18,
  },
  borderBottom: {
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g200,
    width: Sizing.layoutP.xp100,
    paddingBottom: Sizing.layout.x18,
    marginBottom: Sizing.layout.x15,
  },
  borderLeft: {
    borderLeftWidth: Sizing.layout.x1,
    borderLeftColor: Colors.neutral.g200,
    borderStyle: 'dashed',
  },
  borderRight: {
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.neutral.g200,
    borderStyle: 'dashed',
    paddingRight: Sizing.layout.x18,
  },
  borderRight_md: {
    borderLeftWidth: Sizing.layout.x1,
    borderLeftColor: Colors.neutral.g200,
    paddingLeft: Sizing.layout.x18,
  },
  borderRight_lg: {
    borderLeftWidth: Sizing.layout.x1,
    borderLeftColor: Colors.neutral.g200,
    paddingLeft: Sizing.layout.x18,
  },
  borderRight_xl: {
    borderLeftWidth: Sizing.layout.x1,
    borderLeftColor: Colors.neutral.g200,
    paddingLeft: Sizing.layout.x18,
  },
  buttonContainer: {
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x10,
    paddingTop: Sizing.layout.x10,
  },
  buttonStyle: {
    paddingVertical: Sizing.layout.x13,
    borderRadius: Outlines.borderRadius.smallest,
    flex: Sizing.flexSize.x100,
  },
  buttonStyle_md: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
  },
  packageText: {
    ...Typography.fontSize.x15,
    ...Typography.fontName.medium,
    textAlign: 'left',
  },
  subIdTextContainer: {
    marginTop: Sizing.layout.x8,
  },
  subIdText: {
    ...Typography.fontName.medium,
  },
  lastRechargeContainer: {
    paddingHorizontal: Sizing.layout.x18,
    gap: Sizing.layout.x16,
    alignItems: 'center',
  },
  packageInfoContainer: {
    paddingHorizontal: Sizing.layout.x18,
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfStartMargin: {
    alignSelf: 'flex-start',
    marginTop: Sizing.layout.x10,
  },
  alignItemStart: {
    alignItems: 'flex-start',
  },

  last5RechargeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x5,
  },
  last5RechargeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp60,
  },
  last5RechargeButtonStyle: {
    paddingVertical: Sizing.layout.x5,
    borderRadius: Outlines.borderRadius.smallest,
    flex: Sizing.flexSize.x100,
    marginRight: Sizing.layout.x5,
  },
  last5RechargeButtonStyle_md: {
    minWidth: Sizing.layout.x100,
    flex: Sizing.layout.x0,
  },
  last5RechargeButtonStyle_lg: {
    minWidth: Sizing.layout.x100,
    flex: Sizing.layout.x0,
  },
  last5RechargeButtonStyle_xl: {
    minWidth: Sizing.layout.x100,
    flex: Sizing.layout.x0,
  },
});

export default styles;
