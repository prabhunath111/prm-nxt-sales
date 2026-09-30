import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  balanceContainer: {
    ...Forms.commonContainer.purpleBg,
  },
  partnerContainer: {
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x8,
    gap: Sizing.layout.x6,
  },
  partnerNameContainer: {
    gap: Sizing.layout.x6,
    width: Sizing.layoutP.xp100,
    flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
  },
  smallTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  mediumTextStyle: {
    ...Typography.medium.x14,
  },
  verticalSeparator: {
    borderLeftColor: Colors.neutral.g250,
    borderLeftWidth: Outlines.borderWidth.thin,
  },
  horizontalSeparator: {
    flex: screenWidth > Sizing.layout.x660 ? Sizing.layout.x0 : Sizing.flexSize.x100,
    borderBottomColor: Colors.neutral.g250,
    borderBottomWidth: Outlines.borderWidth.thin,
    width: screenWidth > Sizing.layout.x660 ? Sizing.layout.x0 : Sizing.layoutP.xp100,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x10,
  },
  textDetails: {
    gap: Sizing.layout.x8,
    minWidth: Sizing.layout.x90,
  },
  textDetailsName: {
    gap: Sizing.layout.x8,
    minWidth: Sizing.layout.x90,
  },
  textDetailsRow: {
    gap: Sizing.layout.x8,
    minWidth: Sizing.layout.x90,
    flexDirection: 'row',
  },
  textDetailsNameRow: {
    gap: Sizing.layout.x8,
    minWidth: Sizing.layout.x90,
    flexDirection: 'row',
  },
  partnerNameContainerEvd: {
    gap: Sizing.layout.x6,
    width: Sizing.layoutP.xp100,
    flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
  },
});

export default styles;
