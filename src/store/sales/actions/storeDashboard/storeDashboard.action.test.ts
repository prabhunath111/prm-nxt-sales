import commonAction from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/storeDashboard';
import uiActions from 'store/sales/actions/ui';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { downloadCSV } from 'utils/formBuilderHelper';
import { isAndroid } from 'utils/platformHelper';
import {
  NoDataFound,
  storeDashboardRMNModel,
  getDealerID,
  getDealerInfoForStoreDashboard,
  getStoreOpeningData,
  getStoreClosingData,
  getStoreOperationalReport,
  DownloadCSVDataOfStoreDashboard,
  getDealerDetails,
  searchStoreOperational,
} from './storeDashboard.action';

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setDealerDetails: jest.fn(),
    setTableColumnData: jest.fn(),
    setTotalListCount: jest.fn(),
    setTableFilteredData: jest.fn(),
    setErrorMessage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setChecklistTileDetails: jest.fn(),
    setUpdatedFormFields: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/storeDashboard', () => ({
  sliceActions: {
    setDealerID: jest.fn(),
    setDateForStoreDashboard: jest.fn(),
    setEVDCode: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    showAlert: jest.fn(),
    showBottomModal: jest.fn(),
    setModalLoader: jest.fn(),
    showErrorPage: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDropdownOptionsData: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('utils/formBuilderHelper', () => ({
  downloadCSV: jest.fn(),
}));

jest.mock('utils/platformHelper', () => ({
  isAndroid: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    StoreDashboard: {
      StoreDashboardValidateRMN: { moduleName: 'm1', attributes: { Status: 's1', dealerID: 'd1' } },
      StoreDashboardStoreOpen: { moduleName: 'm2', attributes: { Status: 's1', storeOpen: 'so1', date: 'dt1', iD: 'id1', dealerId: 'did1' } },
      StoreDashboardStoreClose: { moduleName: 'm3', attributes: { Status: 's1', storeClose: 'sc1', date: 'dt1', iD: 'id1', dealerId: 'did1' } },
      StoreDashboardStoreOperationalChecklist: { moduleName: 'm4', attributes: { Status: 's1', dealerId: 'did1', year: 'y1', month: 'm1', id: 'id1' } },
    },
  },
}));

jest.mock(
  'store/sales/query',
  () =>
    new Proxy(
      {},
      {
        get: (_, property) => property,
      },
    ),
);

jest.mock('const', () => ({
  PROPERTIES: {
    EXCLUSIVE_STORE: { MONTH: { JAN: '01' } },
    TOTAL_MONTHS: ['JAN', 'FEB', 'MAR'],
  },
  ALERT: { WARNING: 'WARNING', SUCCESS: 'SUCCESS', ERROR: 'ERROR' },
  CHILD_TYPE: { DYNAMIC_SALES_NEXT_FORM: 'DYNAMIC_SALES_NEXT_FORM', INFO_TEXT: 'INFO_TEXT', INFO_TEXT_WITH_DATA: 'INFO_TEXT_WITH_DATA' },
  FORMS: { storeDashboard: 'storeDashboard', storeOperationalDetails: 'storeOperationalDetails' },
  HEADER_TITLE: { STORE_DASHBOARD: 'STORE_DASHBOARD' },
  ICONS: { STORE_DASHBOARD: 'STORE_DASHBOARD' },
  MODAL: { OK: 'OK', CANCEL: 'CANCEL' },
  QUERY: { GET_YEAR: 'GET_YEAR', GET_MONTH: 'GET_MONTH' },
  STATE_KEY: { MODAL_STATE: 'MODAL_STATE' },
  STRINGS: { COUNT_ZERO: 0, STORE_REPORT: 'report_', FILE_DOWNLOADED_SUCCESSFULLY: 'success', STORAGE_PERMISSION_DENIED: 'denied' },
  ACTION_TYPE: { STORE_OPEN: 'OPEN', STORE_CLOSE: 'CLOSE' },
  UPPER_CASE_REGEX: /([a-z])([A-Z])/g,
  UNDER_SCORE: /_/g,
}));

jest.mock('i18next', () => ({
  t: jest.fn((k) => k),
}));

describe('storeDashboard actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn().mockReturnValue({
      user: { info: { userId: 'u1', mdn: 'm1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1', dealerID: 'd1' },
      common: { tableData: [], tableColumns: [] },
    });
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('NoDataFound eligible', () => {
    NoDataFound({ eligible: true })(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.noDataForDate', 'WARNING', expect.any(Object), {});
  });

  test('NoDataFound not eligible', () => {
    NoDataFound({ eligible: false })(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.notEligible', 'WARNING', expect.any(Object), {});
  });

  test('storeDashboardRMNModel', () => {
    storeDashboardRMNModel()(dispatch, getState, undefined);
    expect(sliceActions.setDealerID).toHaveBeenCalledWith('');
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('getDealerID', () => {
    getDealerID({ dealerID: '123' })(dispatch, getState, undefined);
    expect(sliceActions.setDealerID).toHaveBeenCalledWith('123');
  });

  test('getDealerInfoForStoreDashboard success with date formatting', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ userId: 'u1', mdn: 'm1', name: 'n1' });

    await getDealerInfoForStoreDashboard({ DateOfReport: '01-JAN-2023', dealerID: 'd1' }, 'query')(dispatch, getState, undefined);

    expect(sliceActions.setDateForStoreDashboard).toHaveBeenCalledWith('2023-01-01');
    expect(sliceActions.setEVDCode).toHaveBeenCalledWith('u1');
    expect(commonAction.setDealerDetails).toHaveBeenCalled();
  });

  test('getDealerInfoForStoreDashboard catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    await getDealerInfoForStoreDashboard({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('getStoreOpeningData success and eligible', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ questions: [1, 2], isEligible: 'strings.eligible' });

    await getStoreOpeningData()(dispatch, getState, undefined);

    expect(formActions.setChecklistTileDetails).toHaveBeenCalledWith({ checklistData: [1, 2] });
  });

  test('getStoreOpeningData success but no questions', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ questions: [], isEligible: 'strings.eligible' });

    await getStoreOpeningData()(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getStoreOpeningData not eligible', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ isEligible: 'not' });

    await getStoreOpeningData()(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getStoreOpeningData error', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    await getStoreOpeningData()(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getStoreClosingData success and eligible', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ questions: [1, 2], isEligible: 'strings.eligible' });

    await getStoreClosingData()(dispatch, getState, undefined);

    expect(formActions.setChecklistTileDetails).toHaveBeenCalled();
  });

  test('getStoreClosingData success but no questions', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ questions: [], isEligible: 'strings.eligible' });

    await getStoreClosingData()(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getStoreClosingData not eligible', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ isEligible: 'not' });

    await getStoreClosingData()(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getStoreClosingData error', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1', selectedDate: 'd1' },
    });
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    await getStoreClosingData()(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getStoreOperationalReport success with results', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({
      dashBoardWalkInData: [1],
      tableColumns: [],
      isEligible: 'strings.eligible',
    });

    const params = { selectedYear: { name: '2023' }, selectedMonth: { m1: { name: 'JAN' } } };
    await getStoreOperationalReport(params, 'query')(dispatch, getState, undefined);

    expect(commonAction.setTableColumnData).toHaveBeenCalled();
    expect(uiActions.setLoader).toHaveBeenCalled();
  });

  test('getStoreOperationalReport success but no data', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({
      dashBoardWalkInData: [],
      isEligible: 'strings.eligible',
    });

    const params = { YearSelection: { name: '2023' }, monthSelection: { m1: { name: 'JAN' } } };
    await getStoreOperationalReport(params, 'query')(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getStoreOperationalReport not eligible', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1' },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ isEligible: 'not' });

    const params = { selectedYear: { name: '2023' }, selectedMonth: { m1: { name: 'JAN' } } };
    await getStoreOperationalReport(params, 'query')(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getStoreOperationalReport no year/month', async () => {
    await getStoreOperationalReport({}, 'query')(dispatch, getState, undefined);
    expect(api.post).not.toHaveBeenCalled();
  });

  test('getStoreOperationalReport error', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'u1' } },
      storeDashboard: { evdCode: 'e1' },
    });
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    const params = { selectedYear: { name: '2023' }, selectedMonth: { m1: { name: 'JAN' } } };
    await getStoreOperationalReport(params, 'query')(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('DownloadCSVDataOfStoreDashboard success android', async () => {
    getState.mockReturnValue({
      common: { tableData: [{ k: 'v' }], tableColumns: [{ accessorKey: 'k' }] },
    });
    (isAndroid as jest.Mock).mockReturnValue(true);
    (downloadCSV as jest.Mock).mockResolvedValue({ status: true });

    await DownloadCSVDataOfStoreDashboard()(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalledWith('success', 'SUCCESS', expect.any(Object), {});
  });

  test('DownloadCSVDataOfStoreDashboard failure android', async () => {
    getState.mockReturnValue({
      common: { tableData: [{ k: 'v' }], tableColumns: [{ accessorKey: 'k' }] },
    });
    (isAndroid as jest.Mock).mockReturnValue(true);
    (downloadCSV as jest.Mock).mockResolvedValue({ status: false });

    await DownloadCSVDataOfStoreDashboard()(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalledWith('denied', 'ERROR', expect.any(Object), {});
  });

  test('DownloadCSVDataOfStoreDashboard success not android', async () => {
    getState.mockReturnValue({
      common: { tableData: [{ k: 'v' }], tableColumns: [{ accessorKey: 'k' }] },
    });
    (isAndroid as jest.Mock).mockReturnValue(false);
    (downloadCSV as jest.Mock).mockResolvedValue({ status: true });

    await DownloadCSVDataOfStoreDashboard()(dispatch, getState, undefined);

    expect(uiActions.showAlert).not.toHaveBeenCalled();
  });

  test('DownloadCSVDataOfStoreDashboard no data', async () => {
    getState.mockReturnValue({ common: { tableData: [] } });

    await DownloadCSVDataOfStoreDashboard()(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getDealerDetails', () => {
    getState.mockReturnValue({ storeDashboard: { dealerID: '123' } });
    getDealerDetails()(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ dealerID: '123' }, 'MODAL_STATE');
  });

  test('searchStoreOperational', () => {
    getState.mockReturnValue({
      common: { tableData: [{ createdDate: '2023', noOfWalkIns: 5 }, { createdDate: '2022' }] },
    });

    searchStoreOperational({ searchText: '2023' })(dispatch, getState, undefined);

    expect(commonAction.setTotalListCount).toHaveBeenCalledWith(1);
    expect(commonAction.setTableFilteredData).toHaveBeenCalledWith({ result: [{ createdDate: '2023', noOfWalkIns: 5 }] });
  });

  test('searchStoreOperational alternate params', () => {
    getState.mockReturnValue({
      common: { tableData: [{ createdDate: '2023' }] },
    });

    searchStoreOperational({ viewStoreOperationalSearch: '2023' })(dispatch, getState, undefined);
    expect(commonAction.setTableFilteredData).toHaveBeenCalled();
  });

  test('searchStoreOperational empty params', () => {
    getState.mockReturnValue({
      common: { tableData: [{ createdDate: '2023' }] },
    });

    searchStoreOperational({})(dispatch, getState, undefined);
    expect(commonAction.setTableFilteredData).toHaveBeenCalled();
  });
});
