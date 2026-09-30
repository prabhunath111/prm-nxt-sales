import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x15,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
  },
  scrollContainer: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x16,
  },
  contentContainerStyle: {
    gap: Sizing.layout.x24,
    paddingTop: Sizing.layout.x12,
    alignItems: 'center',
  },
  topContainer: {
    gap: Sizing.layout.x16,
  },
  topContainer_md: {
    gap: Sizing.layout.x20,
    marginBottom: Sizing.layout.x15,
  },
  topContainer_lg: {
    gap: Sizing.layout.x24,
    marginBottom: Sizing.layout.x15,
  },
  topContainer_xl: {
    gap: Sizing.layout.x24,
    marginBottom: Sizing.layout.x15,
  },
  bottomContainer: {
    gap: Sizing.layout.x12,
  },
  headingTextStyle: {
    ...Typography.medium.x18,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
  },
  primaryTextStyle: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
  },
  secondaryTextStyle: {
    ...Typography.medium.x12,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
    paddingHorizontal: Sizing.layout.x4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lightTextStyle: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x16,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
  },
  lightTextStyle_md: {
    ...Typography.lineHeight.x20,
  },
  lightTextStyle_lg: {
    ...Typography.lineHeight.x20,
  },
  lightTextStyle_xl: {
    ...Typography.lineHeight.x20,
  },
  columnContainer: {
    alignItems: 'center',
    gap: Sizing.layout.x6,
    flex: Sizing.flexSize.x100,
  },
  circularIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Sizing.layout.x50,
    width: Sizing.layout.x50,
    borderRadius: Sizing.layout.x25,
    backgroundColor: Colors.violet.v450,
  },
  iconStyle: {
    height: Sizing.layout.x24,
    width: Sizing.layout.x24,
  },
  chevronIconStyle: {
    height: Sizing.layout.x24,
    width: Sizing.layout.x24,
    marginTop: Sizing.layout.x13,
  },
  textContainer: {
    backgroundColor: Colors.violet.v450,
    borderRadius: Outlines.borderRadius.baseMedium,
    paddingHorizontal: Sizing.layout.x15,
    paddingVertical: Sizing.layout.x8,
  },
  rowTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x6,
  },
  verticalSeparator: {
    borderLeftWidth: Outlines.borderWidth.thin,
    height: Sizing.layoutP.xp60,
  },
  greyTextStyle: {
    ...Typography.medium.x12,
    color: Colors.neutral.g750,
  },
  largeTextStyle: {
    ...Typography.medium.x20,
    color: Colors.neutral.g750,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizing.layout.x12,
  },
  imagesContainer_md: {
    gap: Sizing.layout.x20,
  },
  imagesContainer_lg: {
    gap: Sizing.layout.x20,
  },
  imagesContainer_xl: {
    gap: Sizing.layout.x20,
  },
  imageStyle: {
    resizeMode: 'cover',
    borderRadius: Outlines.borderRadius.smallMedium,
    height: Sizing.layout.x30,
    width: Sizing.layout.x30,
  },
  imageStyle_md: {
    height: Sizing.layout.x50,
    width: Sizing.layout.x50,
  },
  imageStyle_lg: {
    height: Sizing.layout.x60,
    width: Sizing.layout.x60,
  },
  imageStyle_xl: {
    height: Sizing.layout.x70,
    width: Sizing.layout.x70,
  },
});

export default styles;
