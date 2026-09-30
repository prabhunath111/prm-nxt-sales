import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    minHeight: Sizing.layout.x70,
  },
  innerContainer: {
    padding: Sizing.layout.x10,
    borderRadius: Sizing.layout.x10,
  },
  secondaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flex: Sizing.layout.x1,
    alignItems: 'flex-start',
  },
  imageStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.white,
  },
  primaryText: {
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.white,
  },
  secondaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.white,
    flexShrink: Sizing.flexSize.x100,
    flexWrap: 'wrap',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x5,
  },
  verticalSeparator: {
    borderLeftColor: Colors.neutral.g250,
    borderLeftWidth: Outlines.borderWidth.hairline,
  },
});

export default styles;
