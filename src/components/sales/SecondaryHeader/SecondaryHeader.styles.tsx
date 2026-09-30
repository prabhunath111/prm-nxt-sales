import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { isAndroid } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x6,
    paddingHorizontal: Sizing.layout.x16,
    backgroundColor: Colors.appColors.darkViolet,
    ...(isAndroid() && {
      paddingTop: Sizing.layout.x50,
    }),
  },
  container_lg: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x6,
    paddingHorizontal: Sizing.layoutP.xp15,
    backgroundColor: Colors.appColors.darkViolet,
  },
  container_md: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x6,
    paddingHorizontal: Sizing.layoutP.xp15,
    backgroundColor: Colors.appColors.darkViolet,
  },
  container_xl: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x6,
    paddingHorizontal: Sizing.layoutP.xp15,
    backgroundColor: Colors.appColors.darkViolet,
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x6,
    gap: Sizing.layout.x7,
  },
  leftIcon: {
    // marginLeft: Sizing.layout.x20,
    zIndex: Sizing.layout.x20,
    width: Sizing.layout.x50,
  },
  rightIcon: {
    // marginRight: Sizing.layout.x20,
    zIndex: Sizing.layout.x20,
    width: Sizing.layout.x50,
  },
  imageStyle: {
    tintColor: Colors.neutral.white,
  },
  centerContainer: {
    flexDirection: 'row', // Aligns items in a row
    alignItems: 'center', // Ensures vertical alignment
    justifyContent: 'center', // Centers content
    flex: Sizing.flexSize.x100, // Allows flexible width
    paddingHorizontal: Sizing.layout.x12, // Adds spacing on sides
  },
  imageLeftStyle: {
    resizeMode: 'contain',
    tintColor: Colors.neutral.white,
    marginRight: Sizing.layout.x8, // Space between image and text
  },
  textRightStyle: {
    ...Typography.fontSize.x20,
    ...Typography.fontName.medium,
    color: Colors.neutral.white,
    flexShrink: Sizing.flexSize.x100, // Prevents text from overflowing
    maxWidth: Sizing.layoutP.xp80, // Prevents text from taking too much space
  },
  textRightStyle_lg: {
    ...Typography.fontSize.x24,
  },
  textRightStyle_md: {
    ...Typography.fontSize.x24,
  },
  textRightStyle_xl: {
    ...Typography.fontSize.x24,
  },
  textStyle: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x24,
    color: Colors.neutral.white,
  },
  textStyle_md: {
    display: 'none',
  },
  textStyle_lg: {
    display: 'none',
  },
  textStyle_xl: {
    display: 'none',
  },
  languageSelect: {
    marginRight: Sizing.layout.x40,
  },
  titleText: {
    ...Typography.fontSize.x18,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.regular,
    ...Typography.lineHeight.x16,
    color: Colors.neutral.white,
  },
});

export default styles;
