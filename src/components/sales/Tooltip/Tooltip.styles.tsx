import { StyleSheet } from 'react-native';
import { Sizing, Colors, Typography } from 'styles';
import { transparent } from 'styles/colors';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minWidth: Sizing.layout.x250,
  },
  tooltipText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    color: Colors.neutral.white,
    textAlign: 'left',
  },
  toolTipStyle: {
    position: 'absolute',
    backgroundColor: transparent.black,
    paddingVertical: Sizing.layout.x6,
    paddingHorizontal: Sizing.layout.x10,
    borderRadius: Sizing.layout.x4,
    maxWidth: Sizing.layout.x300,
    zIndex: Sizing.layout.x1000,
    pointerEvents: 'none',
  },
});

export default styles;
