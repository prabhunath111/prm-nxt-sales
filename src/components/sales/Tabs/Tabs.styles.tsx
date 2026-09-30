import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const baseStyles = {
  container: {
    flex: Sizing.layout.x1,
  },
  tabBar: {
    backgroundColor: Colors.neutral.white,
  },
  tabBarHorizontal_md: {
    alignSelf: 'flex-start',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tabBarHorizontal_lg: {
    alignSelf: 'flex-start',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tabBarHorizontal_xl: {
    alignSelf: 'flex-start',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tabBarVertical: {
    flexDirection: 'column',
    width: Sizing.layout.x100,
  },
  contentContainer: {
    flex: Sizing.layout.x100,
  },
  contentHorizontal: {
    flexDirection: 'row',
  },
  contentVertical: {
    flexDirection: 'column',
  },
  content: {
    flex: Sizing.layout.x1,
  },
  contentContainerStyle: {
    flexGrow: Sizing.layout.x1,
  },
  visibleContent: {
    display: 'flex',
  },
  hiddenContent: {
    display: 'none',
  },
};

const P1 = {
  tabBarHorizontal: {
    flexDirection: 'row',
    marginHorizontal: Sizing.layoutP.xp2,
  },
  tabBarHorizontal_md: {
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tabBarHorizontal_lg: {
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tabBarHorizontal_xl: {
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x20,
    margin: Sizing.layout.x5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Outlines.borderRadius.smallest,
  },
  tabHorizontal: {
    flex: Sizing.layout.x100,
  },
  tabVertical: {
    width: Sizing.layoutP.xp100,
  },
  activeTab: {
    backgroundColor: Colors.primary.brand,
    margin: Sizing.layout.x5,
  },
  tabText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x0,
  },
  activeTabText: {
    color: Colors.neutral.white,
  },
  contentContainer: {
    flex: Sizing.layout.x100,
  },
  contentHorizontal: {
    flexDirection: 'row',
  },
  contentVertical: {
    flexDirection: 'column',
  },
  content: {
    flex: Sizing.layout.x1,
  },
  contentContainerStyle: {
    flexGrow: Sizing.layout.x1,
  },
  visibleContent: {
    display: 'flex',
  },
  hiddenContent: {
    display: 'none',
  },
};

const P2 = {
  tabBarHorizontal: {
    flexDirection: 'row',
    ...Outlines.shadow.thick,
    marginBottom: Sizing.layout.x8,
  },
  tab: {
    paddingVertical: Sizing.layout.x14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabHorizontal: {
    flex: Sizing.layout.x100,
  },
  tabVertical: {
    width: Sizing.layoutP.xp100,
  },
  activeTab: {
    borderBottomWidth: Sizing.layout.x3,
    borderBottomColor: Colors.violet.darkViolet,
  },
  tabText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    flexShrink: Sizing.layout.x0,
    color: Colors.primary.brand,
  },
  activeTabText: {
    color: Colors.violet.darkViolet,
  },
};

const P3 = {
  container: {
    flex: Sizing.layout.x1,
    gap: Sizing.layout.x2,
  },
  tabBarHorizontal: {
    flexDirection: 'row',
    ...Outlines.shadow.thick,
    width: Sizing.layoutP.xp100,
  },
  tabBarHorizontal_md: {
    width: Sizing.layoutP.xp100,
  },
  tabBarHorizontal_lg: {
    width: Sizing.layoutP.xp100,
  },
  tabBarHorizontal_xl: {
    width: Sizing.layoutP.xp100,
  },
  tab: {
    paddingVertical: Sizing.layout.x2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: Sizing.layout.x10,
  },
  tabHorizontal: {
    flex: Sizing.layout.x100,
  },
  tabVertical: {
    width: Sizing.layoutP.xp100,
  },
  activeTab: {
    borderBottomWidth: Sizing.layout.x3,
    borderBottomColor: Colors.violet.darkViolet,
  },
  tabText: {
    justifyContent: 'space-between',
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.primary.brand,
    flexShrink: Sizing.layout.x0,
  },
  tabSubText: {
    textAlign: 'center',
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x0,
  },
  activeTabText: {
    color: Colors.violet.darkViolet,
  },
  contentContainer: {
    flex: Sizing.layout.x100,
  },
  contentHorizontal: {
    flexDirection: 'row',
  },
  contentVertical: {
    flexDirection: 'column',
  },
  content: {
    flex: Sizing.layout.x1,
  },
  contentContainerStyle: {
    flexGrow: Sizing.layout.x1,
  },
  visibleContent: {
    display: 'flex',
  },
  hiddenContent: {
    display: 'none',
  },
};

const P4 = {
  container: {
    flex: Sizing.layout.x1,
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  container_md: {
    width: Sizing.layoutP.xp80,
  },
  container_lg: {
    width: Sizing.layoutP.xp80,
  },
  container_xl: {
    width: Sizing.layoutP.xp80,
  },
  tabBarHorizontal: {
    flexDirection: 'row',
    ...Outlines.shadow.thick,
    width: Sizing.layoutP.xp100,
  },
  tabBarHorizontal_md: {
    width: Sizing.layoutP.xp100,
  },
  tabBarHorizontal_lg: {
    width: Sizing.layoutP.xp100,
  },
  tabBarHorizontal_xl: {
    width: Sizing.layoutP.xp100,
  },
  tab: {
    paddingVertical: Sizing.layout.x14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: Sizing.layout.x10,
    marginHorizontal: Sizing.layout.x15,
  },
  tabHorizontal: {
    flex: Sizing.layout.x100,
  },
  tabVertical: {
    width: Sizing.layoutP.xp100,
  },
  activeTab: {
    borderBottomWidth: Sizing.layout.x3,
    borderBottomColor: Colors.violet.darkViolet,
  },
  tabText: {
    justifyContent: 'space-between',
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.primary.brand,
    flexShrink: Sizing.layout.x0,
  },
  tabSubText: {
    textAlign: 'center',
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x0,
  },
  activeTabText: {
    color: Colors.violet.darkViolet,
  },
  contentContainer: {
    flex: Sizing.layout.x100,
  },
  contentHorizontal: {
    flexDirection: 'row',
  },
  contentVertical: {
    flexDirection: 'column',
  },
  content: {
    flex: Sizing.layout.x1,
  },
  contentContainerStyle: {},
  visibleContent: {
    display: 'flex',
  },
  hiddenContent: {
    display: 'none',
  },
};

// Merge the common base styles with the unique P1 and P2 styles
const styles = StyleSheet.create<any>({
  P1: { ...baseStyles, ...P1 },
  P2: { ...baseStyles, ...P2 },
  P3: { ...baseStyles, ...P3 },
  P4: { ...baseStyles, ...P4 },
});

export default styles;
