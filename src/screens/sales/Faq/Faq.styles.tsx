import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { isWeb } from 'utils/platformHelper';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  safeAreaStyle: {
    flex: Sizing.layout.x1,
  },
  textStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
    alignSelf: 'center',
  },
  textContainer: {
    paddingHorizontal: Sizing.layout.x16,
    paddingBottom: Sizing.layout.x15,
    backgroundColor: Colors.neutral.g20,
    flexDirection: 'row',
  },
  accordionStyle: {
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x0,
  },
  cardStyle: {
    textAlign: 'left',
    marginVertical: Sizing.layout.x0,
    marginBottom: Sizing.layout.x5,
    borderRadius: Sizing.layout.x0,
    shadowOpacity: Sizing.layout.x0,
    backgroundColor: Colors.appColors.frenchViolet,
    margin: Sizing.layout.x0,
  },
  iconStyle: {
    marginRight: Sizing.layout.x13,
  },
  accoodianButtonStyle: {
    backgroundColor: Colors.appColors.frenchViolet,
    paddingHorizontal: Sizing.layout.x16,
  },
  separator: {
    borderTopWidth: Sizing.layout.x1,
    borderTopColor: Colors.neutral.g100,
    paddingBottom: Sizing.layout.x8,
    backgroundColor: Colors.neutral.g20,
  },
  listStyle: {
    gap: Sizing.layout.x0,
  },
  addBackground: {
    backgroundColor: Colors.violet.v300,
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x8,
    ...(isWeb && screenWidth > Sizing.layout.x660 && { padding: Sizing.layout.x16, padingHorizontal: Sizing.layoutP.xp4, gap: Sizing.layout.x16 }),
  },
  box: {
    flex: Sizing.layout.x1,
    ...(isWeb && screenWidth > Sizing.layout.x660 && { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginHorizontal: Sizing.layoutP.xp4 }),
    backgroundColor: Colors.violet.v50,
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x4,
    borderRadius: Sizing.layout.x6,
  },
  mobileNumView: {
    flex: Sizing.layout.x1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryTextManage: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x1,
    flexWrap: 'wrap',
  },
  phoneIcon: {
    tintColor: Colors.appColors.pink,
  },
  appColorPink: {
    color: Colors.appColors.pink,
  },
  helpTitle: {
    color: Colors.violet.darkViolet,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    flex: Sizing.layout.x1,
    marginBottom: Sizing.layout.x4,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: Sizing.layout.x2,
  },
  primaryCard: {
    height: Sizing.layoutP.xp90,
    maxHeight: 'auto',
  },
  primaryCard_md: {
    marginTop: Sizing.layout.x0,
  },
  primaryCard_lg: {
    marginTop: Sizing.layout.x0,
  },
  primaryCard_xl: {
    marginTop: Sizing.layout.x0,
  },
  textTopSpacing: {
    paddingTop: Sizing.layout.x13,
  },
  header: {
    display: 'flex',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  header_md: {
    display: 'flex',
  },
  header_lg: {
    display: 'flex',
  },
  header_xl: {
    display: 'flex',
  },
  tabWrapper: {
    marginTop: Sizing.layout.x12,
  },
  tabContent: {
    marginTop: Sizing.layout.x10,
  },
  cardContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Sizing.layout.x12,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g100,
    overflow: 'hidden',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: Sizing.flexSize.x100,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
  },
  tabItem: {
    flex: Sizing.flexSize.x100,
    paddingVertical: Sizing.layout.x12,
    alignItems: 'center',
  },

  activeTab: {
    borderBottomWidth: Sizing.layout.x2,
    borderBottomColor: Colors.violet.darkViolet,
  },
  tabText: {
    color: Colors.primary.brand,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
  },
  activeTabText: {
    color: Colors.violet.darkViolet,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
  },
  dynamicCardContainer_md: {
    width: Sizing.layout.x360,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer_lg: {
    width: Sizing.layout.x360,
    gap: Sizing.layout.x10,
  },
  dynamicCardContainer_xl: {
    gap: Sizing.layout.x10,
    width: Sizing.layout.x360,
  },
  dynamicCardContainer70P_md: {
    width: Sizing.layoutP.xp70,
  },
  dynamicCardContainer70P_lg: {
    width: Sizing.layoutP.xp70,
  },
  dynamicCardContainer70P_xl: {
    width: Sizing.layoutP.xp70,
  },
  dynamicCardContainer80P_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer50P_md: {
    width: Sizing.layoutP.xp50,
  },
  dynamicCardContainer50P_lg: {
    width: Sizing.layoutP.xp50,
  },
  dynamicCardContainer50P_xl: {
    width: Sizing.layoutP.xp50,
  },
});

export default styles;
