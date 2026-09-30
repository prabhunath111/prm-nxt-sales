import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.layout.x1,
    backgroundColor: Colors.neutral.white,
  },
  dashboardContainer: {
    paddingVertical: Sizing.layout.x10,
  },
  infoDateText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    lineHeight: Sizing.layout.x13,
    color: Colors.neutral.black,
  },
  primaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x700,
    lineHeight: Sizing.layout.x18,
    color: Colors.violet.v400,
  },
  infoContainer: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x12,
  },
  selectDashboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  lineSeprator: {
    width: Sizing.layoutP.xp100,
    height: Sizing.layout.x1,
    backgroundColor: Colors.neutral.g150,
    marginVertical: Sizing.layout.x12,
  },
  chartContainer: {
    marginHorizontal: Sizing.layout.x16,
    marginVertical: Sizing.layout.x4,
  },
  inputStyle: {
    height: Sizing.layout.x35,
    backgroundColor: Colors.transparent.clear,
  },
  inputContainerStyle: {
    borderWidth: Sizing.layout.x1,
    borderRadius: Sizing.layout.x4,
    borderBottomWidth: Sizing.layout.x1,
    height: Sizing.layout.x35,
    borderColor: Colors.neutral.g400,
    color: Colors.neutral.black,
    width: Sizing.layout.x140,
    backgroundColor: Colors.transparent.clear,
    alignSelf: 'flex-end',
  },
  tableWrapper: {
    margin: Sizing.layout.x16,
    ...Outlines.shadow.thick,
    backgroundColor: Colors.neutral.white,
  },
  filterContainer: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x12,
    alignItems: 'flex-start',
  },
  filterStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: Sizing.layout.x35,
    borderWidth: Sizing.layout.x1,
    borderRadius: Sizing.layout.x4,
    height: Sizing.layout.x35,
    borderColor: Colors.neutral.g400,
    paddingHorizontal: Sizing.layout.x10,
  },
  filterDropDown: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    lineHeight: Sizing.layout.x13,
    color: Colors.violet.v300,
  },
  scrollContainer: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallMedium,
    borderColor: Colors.violet.borderGrey,
    width: Sizing.layoutP.xp100,
    maxHeight: Sizing.layout.x350,
    marginVertical: Sizing.layout.x10,
  },
  radioItem: {
    borderWidth: Sizing.layout.x0,
  },
  cancelButton: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallMedium,
    borderColor: Colors.violet.borderGrey,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x16,
    alignSelf: 'flex-end',
    marginBottom: Sizing.layout.x16,
  },
});

export default styles;
