import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x15,
  },
  seperator: {
    height: Sizing.layout.x1,
    width: 'auto',
    backgroundColor: Colors.neutral.g250,
    marginHorizontal: Sizing.layout.x8,
  },
  status: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    ...Typography.lineHeight.x20,
    width: Sizing.layoutP.xp50,
    flexWrap: 'wrap',
  },
  statusWrapper: {
    flexShrink: Sizing.flexSize.x100,
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x4,
    borderRadius: Sizing.layout.x10,
  },
  activeText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    marginTop: Sizing.layout.x0,
    textTransform: 'lowercase',
    alignSelf: 'flex-end',
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral.white,
    borderRadius: Sizing.layout.x8,
    padding: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g250,
    marginVertical: Sizing.x18,
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  secondaryConView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizing.layout.x12,
  },
  viewDetailsText: {
    color: Colors.appColors.pink,
    ...Typography.fontName.medium,
    alignSelf: 'flex-end',
  },
  paddingZero: {
    padding: Sizing.layout.x0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediumTextStyle: {
    ...Typography.fontName.medium,
  },
  regularTextStyle: {
    ...Typography.fontName.regular,
  },
  listStyle: {},
  transId: {
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    ...Typography.fontName.regular,
    color: Colors.appColors.darkViolet,
    marginTop: Sizing.layout.x32,
    marginBottom: Sizing.layoutP.xp8,
  },
  sectionHeader: {
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x700,
    color: Colors.appColors.darkViolet,
    marginVertical: Sizing.layout.x10,
    marginLeft: Sizing.layout.x5,
  },
});

export default styles;
