import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x10,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
  },
  topContainer: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x15,
    paddingTop: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x16,
  },
  navigationTextStyle: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
  },
  navigationContainer: {
    ...Forms.shadowContainer.primary,
    padding: Sizing.layout.x8,
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
  },
  rightIcon: {
    width: Sizing.layout.x25,
    height: Sizing.layout.x25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronImageStyle: {
    width: Sizing.layout.x12,
    height: Sizing.layout.x12,
  },
  dealerContainer: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.baseMedium,
    borderColor: Colors.neutral.g250,
    backgroundColor: Colors.violet.v100,
    padding: Sizing.layout.x12,
    gap: Sizing.layout.x6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  secondaryTextStyle: {
    ...Typography.medium.x14,
  },
  smallPrimaryText: {
    ...Typography.fontSize.x12,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
  },
  mediumTextStyle: {
    ...Typography.medium.x14,
  },
  verticalSeparator: {
    borderLeftColor: Colors.neutral.g250,
    borderLeftWidth: Outlines.borderWidth.thin,
  },
  partnerNameContainer: {
    gap: Sizing.layout.x6,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x10,
  },
  partnerDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizing.layout.x12,
    width: Sizing.layoutP.xp100,
  },
  smallTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  regularTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.v400,
  },
  balanceContainer: {
    ...Forms.commonContainer.purpleBg,
  },
  partnerContainer: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x12,
  },
  horizontalSeparator: {
    borderBottomColor: Colors.neutral.g250,
    borderBottomWidth: Outlines.borderWidth.thin,
    width: Sizing.layoutP.xp100,
  },
});

export default styles;
