import { STRINGS } from 'const';
import { api } from 'services/apolloClient';
import {
  doBalanceEnquiryEvd,
  clearDealerTimeout,
  retrieveOTFCreditDetails,
  retrieveBalancehistoryDetails,
  retrieveConsolidatedHistoryDetails,
  retrieveTransactionsDetailsNew,
  filterDetails,
  fillRadio,
  filterSearchEvdBalance,
  filterTransaction,
  filterSearchText,
  filterTransactionConsolidated,
  filterTransactionBalance,
  filterSearchTextBalance,
  otfFilter,
  conslidateHistoryFilters,
  balanceTransferFilters,
  consolidatedOnlineReport,
  consolidateBalanceTransferReport,
  reverseTransaction,
  rechargeReport,
  filterSearchEvdRecharge,
  filterSearchOTF,
  consolidateOTFReport,
  consolidatedReport,
  rechargeTrasactions,
} from './evdBalanceInfo.action';

jest.mock('i18next', () => ({
  t: jest.fn((k) => k),
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockReturnThis(),
  changeLanguage: jest.fn().mockResolvedValue(null),
}));

jest.mock('services/apolloClient', () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('store/sales/actions/ui', () => ({
  showErrorPage: jest.fn(() => ({ type: 'UI_SHOW_ERROR' })),
  showBottomModal: jest.fn(() => ({ type: 'UI_SHOW_MODAL' })),
  hideBottomModal: jest.fn(() => ({ type: 'UI_HIDE_MODAL' })),
  setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
  exitErrorPage: jest.fn(() => ({ type: 'UI_EXIT_ERROR' })),
}));

jest.mock('store/sales/actions/common', () => ({
  setTableColumnData: jest.fn(() => ({ type: 'COMMON_SET_TABLE_COLUMNS' })),
  setTotalListCount: jest.fn(() => ({ type: 'COMMON_SET_TOTAL_COUNT' })),
  setTableFilteredData: jest.fn(() => ({ type: 'COMMON_SET_TABLE_FILTERED' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setUpdatedFormFields: jest.fn(() => ({ type: 'FORM_SET_UPDATED_FIELDS' })),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((d) => d),
}));

jest.mock('store/sales/reducer/evdBalanceInfo', () => ({
  sliceActions: {
    setDealerBalanceInput: jest.fn(() => ({ type: 'EVD_SET_DEALER_INPUT' })),
    setPageNumber: jest.fn(() => ({ type: 'EVD_SET_PAGE' })),
    setConsolidatedParams: jest.fn(() => ({ type: 'EVD_SET_CONSOL_PARAMS' })),
    setConsolidatedData: jest.fn(() => ({ type: 'EVD_SET_CONSOL_DATA' })),
    setIsFos: jest.fn(() => ({ type: 'EVD_SET_FOS' })),
    setEvdInfo: jest.fn(() => ({ type: 'EVD_SET_INFO' })),
    evdBalanceInfo: jest.fn(() => ({ type: 'EVD_SET_BAL_INFO' })),
    setSelcectedDurationId: jest.fn(() => ({ type: 'EVD_SET_DURATION' })),
    setSelcectedFilters: jest.fn(() => ({ type: 'EVD_SET_FILTERS' })),
    setFilteredBalanceInfoConf: jest.fn(() => ({ type: 'EVD_SET_FILTERED_CONF_BAL' })),
    setFilteredConf: jest.fn(() => ({ type: 'EVD_SET_FILTERED_CONF' })),
    setFilteredBalanceInfo: jest.fn(() => ({ type: 'EVD_SET_FILTERED_BAL' })),
    setPaginationData: jest.fn(() => ({ type: 'EVD_SET_PAGINATION' })),
  },
}));

jest.mock('store/sales/reducer/transactionHistory', () => ({
  sliceActions: {
    setTransactionHistoryDetails: jest.fn(() => ({ type: 'TXN_SET_DETAILS' })),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setUpdatedFormFields: jest.fn(() => ({ type: 'FORM_SET_FIELDS' })),
    setDropdownOptionsData: jest.fn(() => ({ type: 'FORM_SET_DROPDOWN_OPTIONS' })),
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'UTILS_CALL_ACTION' })),
}));

// Mock the entire actions index to break circularity
jest.mock('store/sales/actions', () => ({}));

describe('evdBalanceInfo actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  let navigate: jest.Mock;

  const getDayOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  const createTx = (props = {}) => ({
    txnDate: getDayOffset(1),
    otfDate: getDayOffset(1),
    time: '10:00',
    transactionTime: '10:00',
    subscriberID: 'S1',
    msg5: 'Activation',
    operation: 'Others',
    amount: '100',
    transactionID: 'T1',
    ...props,
  });

  const mockInitialState = {
    user: { info: { mdn: '123', userId: 'U1' } },
    evdBalanceInfo: {
      isFos: false,
      evdInfo: { recipientRMN: 'R1', userId: 'F1' },
      pageNumber: 1,
      consolidatedParams: {},
      consolidatedData: [],
      balanceInfo: {
        transactions: [
          createTx({ operation: 'Recharge', msg5: 'Activation' }),
          createTx({ operation: 'Balance Transfer', msg5: 'Others', txnDate: getDayOffset(5) }),
          createTx({ operation: 'Reversal', msg5: 'Binge bonus', txnDate: getDayOffset(10) }),
          createTx({ operation: 'Evd Wallet', msg5: 'Flexi recharge', txnDate: getDayOffset(2) }),
        ],
      },
      filteredBalanceInfo: { transactions: [] },
      radioContainerRed: STRINGS.NEWEST,
      durationIdRed: 'all',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    navigate = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
    getState = jest.fn(() => JSON.parse(JSON.stringify(mockInitialState)));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('API Thunks success and complex loops', async () => {
    (api.get as jest.Mock).mockResolvedValue({ transactions: [createTx()] });
    (api.post as jest.Mock).mockResolvedValue({ otfFilter: [{}], transactions: [createTx()] });

    await doBalanceEnquiryEvd({ dealerId: 'D1' }, 'Q')(dispatch, getState, undefined);
    await retrieveOTFCreditDetails({}, 'Q')(dispatch, getState, undefined);
    await retrieveBalancehistoryDetails({}, 'Q')(dispatch, getState, undefined);
    await retrieveConsolidatedHistoryDetails({}, 'Q')(dispatch, getState, undefined);
    await retrieveTransactionsDetailsNew({}, 'Q')(dispatch, getState, undefined);

    await otfFilter({}, 'Q')(dispatch, getState, undefined);
    await conslidateHistoryFilters({}, 'Q')(dispatch, getState, undefined);
    await balanceTransferFilters({}, 'Q')(dispatch, getState, undefined);

    await consolidatedOnlineReport({ duration: { id: 'all' } }, 'Q')(dispatch, getState, undefined);
    await consolidateBalanceTransferReport({ duration: { id: 'all' } }, 'Q')(dispatch, getState, undefined);
    await rechargeReport({ duration: { id: 'all' } }, 'Q')(dispatch, getState, undefined);
    await consolidateOTFReport({ duration: { id: 'all' } }, 'Q')(dispatch, getState, undefined);
  });

  test('Complex filtering and sorting logic with robust data', () => {
    // filterSearchEvdBalance
    filterSearchEvdBalance({ duration: { id: 'last10Days' }, searchText: 'S1', radioContainer: 'oldest' })(dispatch, getState, undefined);

    // filterTransaction
    ['Activation Margin', 'Binge Pack Addition Margin', 'UPP/ My Offer / Winback Pack Addition Margin', 'Flexi Recharge Margin', 'Others', 'All'].forEach((v) => {
      filterTransaction({ selectedVal: v })(dispatch, getState, undefined);
    });

    // filterTransactionConsolidated
    [STRINGS.RECHARGES, STRINGS.BALANCE_TRANSFER, STRINGS.REVERSALS, STRINGS.BINGE_EVD_TRANSACTION, STRINGS.OTF_CREDITS, STRINGS.OTHERS, STRINGS.ALL].forEach((v) => {
      filterTransactionConsolidated({ selectedVal: v })(dispatch, getState, undefined);
    });

    // consolidatedReport
    [STRINGS.RECHARGES, STRINGS.BALANCE_TRANSFER, STRINGS.REVERSALS, STRINGS.BINGE_EVD_TRANSACTION, STRINGS.OTF_CREDITS, STRINGS.OTHERS].forEach((v) => {
      consolidatedReport({ selectedVal: v })(dispatch, getState, undefined);
    });
  });

  test('Pagination and merges', async () => {
    getState.mockReturnValue({
      ...mockInitialState,
      evdBalanceInfo: { ...mockInitialState.evdBalanceInfo, pageNumber: 2, consolidatedData: [createTx({ txnDate: 'old' })] },
    });
    (api.post as jest.Mock).mockResolvedValue({ transactions: [createTx({ txnDate: 'new' })] });
    await consolidatedOnlineReport({ duration: { id: '20' } }, 'Q')(dispatch, getState, undefined);
    await consolidateBalanceTransferReport({ duration: { id: '20' } }, 'Q')(dispatch, getState, undefined);
  });

  test('reverseTransaction paths', () => {
    reverseTransaction({ row: createTx({ txnDate: getDayOffset(1) }) }, 'Q', {}, navigate)(dispatch, getState, undefined);
    reverseTransaction({ row: createTx({ txnDate: getDayOffset(5) }) }, 'Q', {}, navigate)(dispatch, getState, undefined);
    reverseTransaction({ row: { ...createTx(), txnDate: 'INVALID' } }, 'Q', {}, navigate)(dispatch, getState, undefined);
  });

  test('Small utilities', () => {
    filterDetails({})(dispatch, getState, undefined);
    jest.runAllTimers();
    fillRadio({})(dispatch, getState, undefined);
    rechargeTrasactions({})(dispatch, getState, undefined);
    clearDealerTimeout()(dispatch, getState, undefined);
  });

  test('Remaining filterSearchText complexity', () => {
    filterSearchText({ transactionType: 'Activation Margin', searchText: 'S1' })(dispatch, getState, undefined);
    filterSearchTextBalance({ transactionType: STRINGS.CREDIT, search: 'S1' })(dispatch, getState, undefined);
    filterSearchEvdRecharge({ search: 'S1', duration: { id: '30' } })(dispatch, getState, undefined);
    filterSearchOTF({ search: 'S1', duration: { id: '30' } })(dispatch, getState, undefined);
    filterTransactionBalance({ selectedVal: STRINGS.CREDIT })(dispatch, getState, undefined);
  });
});
