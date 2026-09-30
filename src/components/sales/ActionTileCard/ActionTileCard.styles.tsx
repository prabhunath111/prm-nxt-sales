import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
    alignItems: 'center',
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
  cardContainer: {
    ...Forms.shadowContainer.primary,
    paddingHorizontal: Sizing.layout.x8,
    minHeight: Sizing.layout.x48,
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
  },
  textStyle: {
    ...Typography.regular.x14,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
  },
});

export default styles;
