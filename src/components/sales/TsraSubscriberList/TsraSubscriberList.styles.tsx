import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
    alignItems: 'center',
  },
  cardContainer: {
    ...Forms.shadowContainer.tertiary,
    paddingHorizontal: Sizing.layout.x8,
    marginVertical: Sizing.layout.x8,
    minHeight: Sizing.layout.x48,
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    borderRadius: Outlines.borderRadius.baseMedium,
    backgroundColor: Colors.neutral.white,
  },
  textContainerStyle: {
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x12,
  },
  itemContainerStyle: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  primaryTextStyle: {
    ...Typography.regular.x14,
    width: Sizing.layoutP.xp40,
  },
  secondaryTextStyle: {
    ...Typography.medium.x16,
  },
  iconContainer: {
    width: Sizing.layout.x25,
    height: Sizing.layout.x25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIconStyle: {
    width: Sizing.layout.x24,
    height: Sizing.layout.x24,
  },
});

export default styles;
