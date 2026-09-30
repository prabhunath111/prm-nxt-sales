import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { getFullScreenHeight, getWindowWidth } from 'styles/dimentionHelper';
import { platform } from 'utils/platformHelper';

export const windowW = getWindowWidth();

const styles: any = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnWrapper: {
    gap: Sizing.layout.x20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subColumnWrapper: {
    flexDirection: 'row', // Define that the list is made of rows
    justifyContent: 'space-between', // Space between columns
    alignItems: 'center',
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g200,
  },
  tableContainer: {
    flexDirection: 'column',
    height: Sizing.layout.x35,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: Colors.neutral.g200,
    margin: 0,
    padding: 0,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    flex: Sizing.flexSize.x100,
    width: 'auto', // Take up equal space for each column
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    color: Colors.neutral.white,
  },
  row: {
    flexDirection: 'row', // Layout rows horizontally
    alignItems: 'center', // Align content vertically
    paddingVertical: Sizing.layout.x5, // Space between rows
  },
  cell: {
    flex: Sizing.flexSize.x100,
    width: 'auto', // Take up equal space for each column
    justifyContent: 'center', // Center content vertically and horizontally
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  userIdH: {
    width: windowW * 0.075,
    textAlign: 'left',
  },
  nameH: {
    width: windowW * 0.16,
    textAlign: 'center',
  },
  mdnH: {
    width: windowW * 0.085,
    textAlign: 'center',
  },
  outletTypeH: {
    width: windowW * 0.16,
    textAlign: 'center',
  },
  balanceH: {
    width: windowW * 0.1,
    textAlign: 'center',
  },
  avgDailyRechargeH: {
    width: windowW * 0.12,
    textAlign: 'center',
  },
  thresholdSetH: {
    width: windowW * 0.1,
    textAlign: 'center',
  },
  actionH: {
    width: windowW * 0.15,
    textAlign: 'center',
  },
  userId: {
    width: windowW * 0.075,
    textAlign: 'left',
  },
  name: {
    width: windowW * 0.16,
    textAlign: 'center',
  },
  mdn: {
    width: windowW * 0.085,
    textAlign: 'center',
  },
  outletType: {
    width: windowW * 0.16,
    textAlign: 'center',
  },
  balance: {
    width: windowW * 0.1,
    textAlign: 'center',
  },
  avgDailyRecharge: {
    width: windowW * 0.12,
    textAlign: 'center',
  },
  thresholdSet: {
    width: windowW * 0.1,
    textAlign: 'center',
  },
  actions: {
    width: windowW * 0.15,
  },
  buttonStyle: {
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x5,
    minHeight: Sizing.layout.x25,
    maxHeight: Sizing.layout.x30,
    width: Sizing.layout.x180,
  },
  buttonContainer: {
    flexDirection: 'row',
    bottom: Sizing.layout.x5,
  },
  listHeader: {
    marginBottom: Sizing.layout.x10,
    backgroundColor: Colors.appColors.darkViolet,
    paddingHorizontal: Sizing.layout.x10,
  },
  listData: {
    maxHeight: Sizing.screen.height * 0.9,
    minHeight: Sizing.screen.height * 0.2,
    paddingHorizontal: Sizing.layout.x10,
  },
  offersListData: {
    minHeight: Sizing.screen.height * 0.2,
  },
  subColumnWrapperHeader: {
    borderBottomWidth: 0,
  },
  listWrapper: {},
  listWrapper_xs: {
    marginTop: Sizing.layout.x0,
  },
  listWrapper_sm: {
    marginTop: Sizing.layout.x0,
  },
  listWrapperAutoEvd: {
    ...(platform().OS === 'web' && {
      height: getFullScreenHeight() - Sizing.layout.x360,
    }),
  },
  listWrapperInvoiceTransaction: {
    ...(platform().OS === 'web' && {
      height: getFullScreenHeight() - Sizing.layout.x305,
    }),
  },
  emptyContainer: {
    padding: Sizing.layout.x20,
    justifyContent: 'center',
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    minHeight: getFullScreenHeight() * 0.4,
  },
  subscriberIdH: {
    width: windowW * 0.15,
    textAlign: 'center',
  },
  amountH: {
    width: windowW * 0.1,
    textAlign: 'center',
  },
  transactionIdH: {
    width: windowW * 0.15,
    textAlign: 'center',
  },
  transactionDateH: {
    width: windowW * 0.12,
    textAlign: 'center',
  },
  bingeRechargeFlagH: {
    width: windowW * 0.12,
    textAlign: 'center',
  },
  subscriberId: {
    width: windowW * 0.15,
    textAlign: 'center',
  },
  amount: {
    width: windowW * 0.1,
    textAlign: 'center',
  },
  transactionId: {
    width: windowW * 0.15,
    textAlign: 'center',
  },
  transactionDate: {
    width: windowW * 0.12,
    textAlign: 'center',
  },
  bingeRechargeFlag: {
    width: windowW * 0.12,
    textAlign: 'center',
  },
  buttonLabelStyle: {
    ...Typography.lineHeight.x16,
  },
  invoiceLabel: {
    ...Typography.fontSize.x10,
    ...Typography.lineHeight.x14,
    width: Sizing.layoutP.xp80,
  },
});

export default styles;
