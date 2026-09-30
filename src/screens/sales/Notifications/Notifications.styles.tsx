import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    padding: Sizing.layout.x10,
    backgroundColor: Colors.neutral.g100,
  },
  emptyContainer: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    ...Outlines.shadow.base,
    flexDirection: 'row',
    gap: Sizing.layout.x10,
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x12,
    marginHorizontal: Sizing.layout.x2,
    borderRadius: Outlines.borderRadius.baseMedium,
    marginBottom: Sizing.layout.x10,
  },
  unReadContainer: {
    backgroundColor: Colors.violet.v450,
  },
  notificationImageStyle: {
    height: Sizing.layout.x40,
    width: Sizing.layout.x40,
    resizeMode: 'cover',
  },
  notificationMiddleContainer: {
    flex: Sizing.flexSize.x100,
  },
  timeStyle: {
    ...Typography.fontSize.x12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
  },
  dotIconStyle: {
    marginTop: Sizing.layout.x6,
    marginLeft: Sizing.layout.x5,
  },
  checkboxStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTextStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.semibold,
    ...Typography.fontWeight.x600,
    ...Typography.lineHeight.x20,
  },
  notificationSubTextStyle: {
    ...Typography.fontSize.x15,
    ...Typography.fontName.medium,
  },
  dataContainer: {
    marginTop: Sizing.layout.x10,
    gap: Sizing.layout.x5,
  },
  keyValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x5,
  },
  keyText: {
    ...Typography.fontSize.x12,
    ...Typography.fontName.regular,
    width: Sizing.layoutP.xp30,
  },
  valueText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    width: Sizing.layoutP.xp70,
  },
  prupleDot: {
    width: Sizing.layout.x10,
    height: Sizing.layout.x10,
    borderRadius: Outlines.borderRadius.max,
    backgroundColor: Colors.violet.darkViolet,
    marginLeft: Sizing.layout.x10,
  },
  filterContainer: {
    gap: Sizing.layout.x4,
    justifyContent: 'flex-start',
    marginBottom: Sizing.layout.x10,
  },
  filterText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
  },
  dropdownContainer: {
    ...Outlines.shadow.base,
    paddingHorizontal: Sizing.layout.x10,
  },
  innerDropDown: {
    height: Sizing.layout.x40,
  },
  dropDown: {
    paddingVertical: Sizing.layout.x10,
  },
  listContainer: { maxHeight: Sizing.layout.x550 },
});

export default styles;
