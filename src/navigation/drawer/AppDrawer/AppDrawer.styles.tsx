import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { getFullScreenHeight, getFullScreenWidth } from 'styles/dimentionHelper';
import { borderRadius, borderWidth } from 'styles/outlines';
import { isWeb } from 'utils/platformHelper';

const styles: any = StyleSheet.create({
  drawerContainer: {
    ...(isWeb && {
      backgroundColor: Colors.neutral.white,
    }),
    ...(!isWeb && {
      width: getFullScreenWidth(),
      height: getFullScreenHeight() + Sizing.layout.x20,
      backgroundColor: Colors.neutral.white,
      borderRadius: Sizing.layout.x25,
      position: 'absolute',
      bottom: -getFullScreenHeight() + Sizing.layout.x30,
      zIndex: Sizing.layout.x2,
    }),
  },
  userContainer: {
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.appColors.darkViolet,
    ...(!isWeb && {
      height: Sizing.layoutP.xp8,
    }),
  },
  profilePicture: {
    height: Sizing.layout.x50,
    width: Sizing.layout.x50,
    borderRadius: Sizing.layout.x50,
    backgroundColor: Colors.neutral.g700,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Sizing.layout.x10,
  },

  profilePicContainer: {
    flex: 1, // column 1
    alignItems: 'center',
  },

  userDetailsContainer: {
    flex: 2, // column 2
    justifyContent: 'center',
  },

  closeButtonContainer: {
    flex: 1, // column 3
    alignItems: 'flex-end',
    paddingRight: Sizing.layout.x10,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    padding: Sizing.layout.x10,
  },

  // Balance Card
  balanceCard: {
    borderBottomWidth: 1,
    borderColor: Colors.neutral.g350,
    paddingVertical: Sizing.layout.x10,
  },
  balanceLabel: {
    color: '#6b7280',
    ...Typography.fontSize.x12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  amount: {
    fontWeight: 'bold',
    color: Colors.neutral.black,
    ...Typography.fontSize.x25,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x4,
    borderRadius: Sizing.layout.x8,
  },
  badgeText: {
    color: '#B45309',
    marginLeft: Sizing.layout.x4,
    fontWeight: '500',
    ...Typography.fontSize.x14,
  },
  buttonStyle: {
    backgroundColor: Colors.neutral.white,
    alignSelf: 'flex-start',
  },
  logoutButtonStyle: {},

  // Settings Rows
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listText: {
    marginLeft: Sizing.layout.x12,
    ...Typography.fontSize.x14,
  },

  // Dealer Info Card
  infoCard: {
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x12,
    padding: Sizing.layout.x10,
    marginVertical: Sizing.layout.x10,
  },
  infoHeader: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row', // place text + copy side-by-side
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  infoText: {
    fontWeight: '600',
  },
  normalText: {
    fontWeight: '400',
  },
  copyBtn: {
    color: Colors.violet.violetPink,
    fontWeight: '600',
    textAlign: 'center',
  },
  copyBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x5,
  },
  copyIcon: {
    verticalAlign: 'middle',
  },
  subText: {
    marginTop: Sizing.layout.x5,
    color: '#6b7280',
    ...Typography.fontSize.x12,
  },
  updateText: {
    marginTop: Sizing.layout.x8,
    color: Colors.violet.violetPink,
    fontWeight: '600',
  },
  primaryIconStyle: {
    tintColor: Colors.violet.violetPink,
  },
  marginLeft: { marginLeft: Sizing.layout.x8 },
  marginTop4: { marginTop: Sizing.layout.x4 },
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
    marginTop: Sizing.layout.x5,
    paddingHorizontal: Sizing.layout.x10,
  },

  gstActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizing.layout.x10,
  },
  gstButtonStyle: {
    height: Sizing.layout.x30,
    width: Sizing.layout.x100,
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
    height: Sizing.layout.x35,
    borderWidth: Sizing.layout.x1,
    borderColor: 'gray',
    borderRadius: Sizing.layout.x6,
    paddingHorizontal: Sizing.layout.x10,
    backgroundColor: Colors.neutral.white,
  },
  errorText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    alignSelf: 'flex-start',
    marginVertical: Sizing.layout.x4,
  },
  borderPink: {
    borderColor: Colors.appColors.pink,
    borderWidth: borderWidth.hairline,
    borderRadius: borderRadius.smallest,
    padding: Sizing.layout.x4,
  },
  regularText: {
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    ...Typography.fontName.regular,
    color: Colors.appColors.darkViolet,
  },
  mediumText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
  },
  yellowBox: {
    borderColor: Colors.appColors.paleYellow,
    borderWidth: borderWidth.thin,
    borderRadius: borderRadius.smallMedium,
    padding: Sizing.layout.x4,
    gap: Sizing.layout.x4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appColors.lightYellow,
  },
  smallMedium: {
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
  },
  infoRowContainer: {
    gap: Sizing.layout.x8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    tintColor: Colors.neutral.black,
  },
  MdnText: {
    fontWeight: '600',
    color: Colors.primary.brand,
  },
});

export default styles;
