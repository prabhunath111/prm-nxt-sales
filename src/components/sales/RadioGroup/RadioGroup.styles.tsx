import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    gap: Sizing.layout.x10,
  },
  container_lg: {
    flexDirection: 'row',
  },
  container_xl: {
    flexDirection: 'row',
  },
  groupContainer: {
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g100,
    flexGrow: Sizing.flexSize.x100,
  },
  headingText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    padding: Sizing.layout.x10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Sizing.layout.x5,
    paddingHorizontal: Sizing.layout.x10,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderBottomColor: Colors.neutral.g100,
    gap: Sizing.layout.x10,
  },
  radioCircle: {
    height: Sizing.layout.x13,
    width: Sizing.layout.x13,
    borderRadius: Sizing.layout.x10,
    borderWidth: Outlines.borderWidth.base,
    borderColor: Colors.neutral.g500,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizing.layout.x6,
  },
  selectedRadioCircle: {
    borderColor: Colors.primary.brand,
  },
  selectedRb: {
    width: Sizing.layout.x6,
    height: Sizing.layout.x6,
    borderRadius: Sizing.layout.x10,
    backgroundColor: Colors.primary.brand,
  },
  subContainer: {
    gap: Sizing.layout.x5,
    alignItems: 'flex-start',
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x5,
    alignItems: 'center',
  },
  primaryTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryTextStyle_md: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryTextStyle_lg: {
    ...Typography.fontSize.x15,
    ...Typography.fontName.medium,
    flexShrink: Sizing.flexSize.x100,
  },
  secondaryTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
  },
  subTextStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.g700,
    flexWrap: 'wrap',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Sizing.layout.x11,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderBottomColor: Colors.neutral.g100,
  },
  gap5: {
    gap: Sizing.layout.x5,
    lineHeight: Sizing.layout.x25,
  },
});

export default styles;
