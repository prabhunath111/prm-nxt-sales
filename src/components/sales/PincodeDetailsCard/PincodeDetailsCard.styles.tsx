import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  purpleContainer: {
    ...Forms.commonContainer.purpleBg,
    overflow: 'hidden',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    marginRight: Sizing.layout.x8,
  },
  changeDealer: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.primary.brand,
  },
  dealerDetailsContainer: {
    flexDirection: 'row',
  },
  secondaryCount: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    maxWidth: Sizing.layout.x120,
  },
});

export default styles;
