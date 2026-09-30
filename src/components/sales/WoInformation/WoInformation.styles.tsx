import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    paddingHorizontal: Sizing.layout.x15,
  },
  woDetailsCard: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    padding: Sizing.layout.x8,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g250,
    marginVertical: Sizing.x10,
    width: Sizing.layoutP.xp100,
  },
  woDetailsCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  status: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
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
    textTransform: 'uppercase',
  },
  secondaryConView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizing.layout.x8,
  },
  seperator: {
    height: Sizing.layout.x1,
    width: 'auto',
    backgroundColor: Colors.neutral.g250,
    marginVertical: Sizing.layout.x15,
  },
  primaryTextManage: {
    flexBasis: Sizing.layoutP.xp50,
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
  },
  secondaryTextManage: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    textAlign: 'right',
    flexShrink: Sizing.layout.x1,
    flexWrap: 'wrap',
  },
  cardTitle: {
    ...Typography.fontWeight.x500,
  },
  phoneIcon: {
    tintColor: Colors.appColors.pink,
  },
  mobileNumView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    maxWidth: Sizing.layoutP.xp50,
  },
  noData: {
    textAlign: 'center',
    marginTop: Sizing.layout.x20,
  },
  bottomMargin: {
    marginBottom: Sizing.layout.x15,
  },
  bottomMarginSmall: {
    marginBottom: Sizing.layout.x5,
  },
  appColorPink: {
    color: Colors.appColors.pink,
  },
  pillsGroupStyle: {
    marginTop: Sizing.layout.x10,
  },
  listStyle: {},
});

export default styles;
