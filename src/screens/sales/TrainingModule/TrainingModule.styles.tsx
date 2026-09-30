import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

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
  iconStyle: {
    marginRight: Sizing.layout.x13,
  },
  textTopSpacing: {
    paddingTop: Sizing.layout.x13,
  },
  textContainer: {
    paddingHorizontal: Sizing.layout.x16,
    paddingBottom: Sizing.layout.x15,
    backgroundColor: Colors.neutral.g20,
    flexDirection: 'row',
  },
  separator: {
    borderTopWidth: Sizing.layout.x1,
    borderTopColor: Colors.neutral.g100,
    paddingBottom: Sizing.layout.x8,
    backgroundColor: Colors.neutral.g20,
  },
  tabWrapper: {
    marginTop: Sizing.layout.x12,
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

  tabContent: {
    marginTop: Sizing.layout.x10,
  },
  /* ---------- Card ---------- */
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
  backButton: {
    ...Forms.buttonContainer.shadowContainer,
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x4,
  },
  backButtonStyle: {
    paddingVertical: Sizing.layout.x13,
    borderRadius: Outlines.borderRadius.smallest,
  },
  backButtonStyle_md: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
  backButtonStyle_lg: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
  backButtonStyle_xl: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
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
