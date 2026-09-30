import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { borderRadius } from 'styles/outlines';
import { isWeb } from 'utils/platformHelper';

const styles: any = StyleSheet.create({
  container: {
    paddingTop: Sizing.layout.x45,
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    minHeight: Sizing.layout.x70,
  },
  gradientContainer: {
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x15,
    backgroundColor: Colors.violet.darkViolet,
  },
  userDetails: {
    flex: Sizing.flexSize.x50,
    marginLeft: Sizing.layoutP.xp2,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  iconsContainer: {
    flex: Sizing.flexSize.x50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: Sizing.layoutP.xp2,
    alignItems: 'center',
  },
  userDetailsText: {
    color: Colors.neutral.white,
    ...(isWeb
      ? {
          ...Typography.fontSize.x16,
        }
      : { ...Typography.fontSize.x13 }),
  },
  userDetailsText_sm: {
    ...Typography.fontSize.x14,
  },
  userDetailsText_xs: {
    ...Typography.fontSize.x13,
  },
  headerText_sm: {
    ...Typography.semibold.x20,
  },
  headerText_xs: {
    ...Typography.semibold.x16,
  },
  notificationIcon: {
    tintColor: Colors.neutral.white,
    ...(isWeb
      ? {
          marginLeft: Sizing.layout.x20,
        }
      : { marginRight: Sizing.layout.x10 }),
  },
  homeIcon: {
    tintColor: Colors.neutral.white,
  },
  modalView: {
    flex: Sizing.layout.x1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent.lightGray,
    width: Sizing.layoutP.xp100,
    height: Sizing.layout.x500,
  },
  modalText: {
    color: Colors.neutral.white,
    fontSize: Sizing.layout.x20,
  },
  closeText: {
    color: Colors.primary.brand,
    fontSize: Sizing.layout.x20,
    marginTop: Sizing.layout.x20,
  },
  // mobile

  // Left
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Center
  centerContainer: {
    flex: 1, // take remaining space
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: Colors.neutral.white,
    ...(isWeb
      ? {
          ...Typography.semibold.x30,
        }
      : { ...Typography.semibold.x18, marginTop: 2 }),
  },

  // Right
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    tintColor: Colors.neutral.white,
    marginLeft: Sizing.layout.x15,
  },
  badgeDot: {
    position: 'absolute',
    top: Sizing.layout.x0,
    right: Sizing.layout.x10,
    height: Sizing.layout.x8,
    width: Sizing.layout.x8,
    borderRadius: Sizing.layout.x4,
    backgroundColor: Colors.primary.brand,
  },

  // new web style
  containerWeb: {
    height: 64,
    backgroundColor: '#2b003e', // change to your exact dark violet
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative', // needed for absolute center
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },

  /* Left area */
  left: {
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 84,
    height: 26,
  },
  appName: {
    color: Colors.neutral.white,
    fontSize: 18,
    fontWeight: '700',
  },

  /* Center (absolutely centered so it stays centered across screen) */
  centerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    pointerEvents: 'box-none',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // so underlines align at bottom
    backgroundColor: 'transparent',
  },
  menuItemWrapper: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  menuSeparator: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.08)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: '#F2C8F7',
    marginLeft: 8,
    fontSize: 15,
  },
  menuTextActive: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },

  /* underline indicator (small rounded bar) */
  underline: {
    height: 2,
    width: 60,
    borderRadius: 3,
    backgroundColor: 'transparent',
    marginTop: 6,
  },
  underlineActive: {
    backgroundColor: Colors.neutral.white,
  },

  /* Right area */
  right: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  bellWrap: {
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff2d95',
    borderWidth: 1,
    borderColor: '#2b003e',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  // new mobile style
  containerMobile: {
    height: 56,
    backgroundColor: '#2b003e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  iconBtn: {
    padding: 6,
  },
  logoMobile: {
    width: 90,
    height: 28,
  },
  rightMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarMobile: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // Drawer Styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
  },
  drawer: {
    backgroundColor: '#2b003e',
    width: '70%',
    height: '100%',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  drawerText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  listContainer: {
    width: Sizing.layoutP.xp100,
    maxHeight: Sizing.layout.x250,
  },
  listStyle: {
    ...Forms.list.primary,
    paddingVertical: Sizing.layout.x7,
  },
  selectedItem: {
    backgroundColor: Colors.secondary.brand,
  },
  labelStyle: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    fontWeight: '300',
    color: Colors.neutral.black,
    marginLeft: Sizing.layout.x5,
  },
  separator: {
    height: Sizing.layout.x1,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.g400,
  },

  profilePicContainer: {
    flex: 1, // column 1
    alignItems: 'center',
  },
  profilePicture: {
    height: Sizing.layout.x50,
    width: Sizing.layout.x50,
    borderRadius: Sizing.layout.x50,
    backgroundColor: Colors.neutral.g700,
  },
  verticalLine: {
    width: 1, // Adjust thickness
    height: Sizing.layoutP.xp60, // Adjust height as needed
    backgroundColor: '#F2C8F7', // Line color
    marginHorizontal: 10, // Space between items
  },
  editGST: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    color: Colors.primary.brand,
  },
  gstEditContainer: {
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x8,
    marginTop: Sizing.layout.x8,
    borderRadius: borderRadius.smallMedium,
    width: Sizing.layoutP.xp100,
    gap: Sizing.layout.x6,
  },

  gstOption: {
    paddingVertical: Sizing.layout.x8,
    paddingHorizontal: Sizing.layout.x10,
  },

  selectedGstOption: {
    backgroundColor: Colors.appColors.v200,
    borderRadius: Sizing.layout.x6,
    marginTop: Sizing.layout.x8,
    paddingHorizontal: Sizing.layout.x10,
  },

  gstActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizing.layout.x10,
  },
  gstButtonStyle: {
    height: Sizing.layout.x30,
    width: Sizing.layout.x80,
    padding: Sizing.layout.x10,
  },
  gstInputWrapper: {
    marginTop: Sizing.layout.x12,
  },

  gstLabel: {
    marginBottom: Sizing.layout.x6,
    color: 'gray',
    fontSize: Sizing.layout.x14,
  },

  gstInput: {
    height: Sizing.layout.x30,
    borderWidth: Sizing.layout.x1,
    borderColor: 'gray',
    borderRadius: Sizing.layout.x6,
    paddingHorizontal: Sizing.layout.x10,
    backgroundColor: Colors.neutral.white,
  },
  infoIcon: {
    tintColor: Colors.neutral.black,
  },
});

export default styles;
