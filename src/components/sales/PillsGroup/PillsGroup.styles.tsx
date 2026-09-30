import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  pillContainerStyle: {
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.violet.violetPink,
    borderRadius: Outlines.borderRadius.large,
    paddingHorizontal: Sizing.layout.x10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: Sizing.flexSize.x100,
    height: Sizing.layout.x32,
    marginRight: Sizing.layout.x8,
    marginVertical: Sizing.layout.x5,
  },
  selectedPillContainer: {
    borderColor: Colors.violet.violetPink,
    backgroundColor: Colors.violet.v150,
  },
  containerStyle: {
    height: 'auto',
  },
  contentContainerStyle: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  pillText: {
    ...Typography.medium.x14,
  },
  selectedPillText: {
    color: Colors.violet.violetPink,
  },
});

export default styles;
