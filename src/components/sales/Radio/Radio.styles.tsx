import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

// Common styles that are shared between P1 and P2
const baseStyles = {
  subContainer: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizing.layout.x50,
  },
  subContainer_md: {
    justifyContent: 'flex-start',
  },
  subContainer_lg: {
    justifyContent: 'flex-start',
  },
  subContainer_xl: {
    justifyContent: 'flex-start',
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizing.layout.x3,
  },
  radioText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
  },
  smallRegularText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
  },
  smallText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
  },
  activeText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.appColors.green,
  },
  inActiveText: {
    color: Colors.appColors.red,
  },
  rightContainer: {
    flex: Sizing.flexSize.x100,
    gap: Sizing.layout.x5,
    marginLeft: Sizing.layout.x9,
  },
  rowCenterBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowAlignShrink: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: Sizing.flexSize.x100,
  },
  customImageStyle: {
    width: Sizing.layout.x40,
    height: Sizing.layout.x40,
    marginRight: Sizing.layout.x10,
    resizeMode: 'contain',
  },
  amountText: {
    textAlign: 'right',
  },
};

// Unique styles for P1
const P1 = {
  radioContainer: {
    flexDirection: 'row',
    marginHorizontal: Sizing.layout.x10,
  },
  radioCircle: {
    height: Sizing.layout.x13,
    width: Sizing.layout.x13,
    borderRadius: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.appColors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizing.layout.x3,
  },
  selectedRb: {
    width: Sizing.layout.x10,
    height: Sizing.layout.x10,
    borderRadius: Sizing.layout.x10,
    backgroundColor: Colors.appColors.green,
  },
  radioText: {
    width: Sizing.layout.x140,
  },
  imageStyle: {
    width: Sizing.layout.x15,
    height: Sizing.layout.x15,
    resizeMode: 'contain',
    marginRight: Sizing.layout.x5,
  },
};

// Unique styles for P2
const P2 = {
  radioContainer: {
    flexDirection: 'row',
    borderColor: Colors.primary.brand,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallest,
    padding: Sizing.layout.x8,
    marginHorizontal: Sizing.layout.x0,
    alignItems: 'center',
    flex: screenWidth > Sizing.layout.x600 ? Sizing.flexSize.x100 : undefined,
  },
  radioCircle: {
    borderRadius: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary.brand,
    height: Sizing.layout.x18,
    width: Sizing.layout.x18,
    marginTop: Sizing.layout.x0,
  },
  selectedRb: {
    width: Sizing.layout.x9,
    height: Sizing.layout.x9,
    borderRadius: Sizing.layout.x10,
    backgroundColor: Colors.primary.brand,
  },
  radioText: {
    ...Typography.medium.x14,
    ...Typography.lineHeight.x20,
    color: Colors.neutral.black,
  },
  imageStyle: {
    width: Sizing.layout.x35,
    height: Sizing.layout.x35,
    resizeMode: 'contain',
    marginRight: Sizing.layout.x5,
  },
};

// Merge the common base styles with the unique P1 and P2 styles
const styles = StyleSheet.create<any>({
  P1: { ...baseStyles, ...P1 },
  P2: { ...baseStyles, ...P2 },
});

export default styles;
