import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { platform } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    padding: Sizing.layout.x10,
  },
  textWrapperETSK: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: Sizing.layout.x10,
    ...(platform().OS !== 'ios' && {
      shadowColor: Colors.neutral.black,
      shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
      shadowOpacity: Sizing.layout.xDot5,
      shadowRadius: Sizing.layout.x4,
      elevation: Sizing.layout.x1Dot5,
    }),
    borderColor: Colors.neutral.g250,
    borderWidth: Outlines.borderWidth.thin,
  },
  primaryTextYourPack: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    lineHeight: Sizing.layout.x16,
  },
  secondaryTextYourPack: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    paddingLeft: Sizing.layout.x10,
    textAlign: 'right',
    lineHeight: Sizing.layout.x16,
  },
  primaryTextETSK: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    width: Sizing.layout.x180,
    paddingLeft: Sizing.layout.x10,
    lineHeight: Sizing.layout.x18,
  },
  primaryTextETSK_md: {
    width: Sizing.layout.x230,
  },
  primaryTextETSK_lg: {
    width: Sizing.layout.x230,
  },
  primaryTextETSK_xl: {
    width: Sizing.layout.x230,
  },
  primaryTextETSKPacks: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.neutral.black,
    flex: Sizing.layout.x2,
    paddingLeft: Sizing.layout.x10,
    lineHeight: Sizing.layout.x18,
  },
  secondaryTextETSK: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    width: Sizing.layout.x180,
    paddingRight: Sizing.layout.x10,
    textAlign: 'right',
    flex: Sizing.layout.x1,
  },
  bottomSeprator: {
    height: Sizing.layout.x1,
    backgroundColor: Colors.neutral.g250,
    marginVertical: Sizing.layout.x3,
  },
  viewDetails: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.primary.brand,
  },
  buttonContainerSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x8,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Sizing.layout.x30,
    minHeight: Sizing.layout.x30,
    minWidth: Sizing.layout.x75,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonStyleAndroid: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Sizing.layout.x40,
    minWidth: Sizing.layout.x75,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonStyle_md: {
    height: Sizing.layout.x30,
    minWidth: Sizing.layout.x75,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonStyle_lg: {
    height: Sizing.layout.x40,
    minWidth: Sizing.layout.x159,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonStyle_xl: {
    height: Sizing.layout.x40,
    minWidth: Sizing.layout.x159,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x500,
  },
  cardStyle: {
    paddingBottom: Sizing.layout.x4,
    color: Colors.neutral.black,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabOuterContainer: {
    paddingVertical: Sizing.layout.x6,
  },
  secondaryTextPrice: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    textAlign: 'right',
    paddingRight: Sizing.layout.x10,
  },
  topSpace: {
    paddingTop: Sizing.layout.x3,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  flexTwo: {
    flex: Sizing.layout.x2,
  },
  flexOne: {
    flex: Sizing.layout.x1,
  },
});

export default styles;
