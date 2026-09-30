import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/tsraApproval';
import { api } from 'services/apolloClient';
import commonActions from 'store/sales/actions/common';
import { getTSRAApprovalList, getTSRATrackList, filterSearchTrackTsra, approveOrRejectTsraDealer, setSelectedDealer } from './tsraApproval.action';

jest.mock('store/sales/reducer/tsraApproval', () => ({
  sliceActions: {
    setTsraApprovalListData: jest.fn(),
    setTsraSuccessData: jest.fn(),
    setSelectedDealer: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    showErrorPage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setErrorMessage: jest.fn(),
    setTableColumnData: jest.fn(),
    setTableFilteredData: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('utils/formBuilderHelper', () => ({
  filterByParams: jest.fn((d) => d),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('const', () => ({
  FORMS: { trackTsraRequest: 'trackTsraRequest' },
  STRINGS: { ALL: 'ALL', REJECTED: 'REJECTED', APPROVE: 'APPROVE', REJECT: 'REJECT' },
}));

jest.mock('i18next', () => ({
  t: (k: string) => k,
}));

describe('tsraApproval actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockImplementation(() => Promise.resolve({}));
    getState = jest.fn(() => ({
      common: { tableData: [{ subStatusNT: 'Rejected', requestedDateTime: Date.now() }] },
      tsraApproval: { selectedDealer: { tsraCode: 'd1', parentCode: 'p1' } },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('getTSRAApprovalList success with sorting', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      result: { dataList: [{ createdDateNT: '2023-01-01' }, { createdDateNT: '2023-01-02' }] },
    });
    await getTSRAApprovalList({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setTsraApprovalListData).toHaveBeenCalled();
  });

  test('getTSRAApprovalList empty', async () => {
    (api.post as jest.Mock).mockResolvedValue({ result: { dataList: [] } });
    await getTSRAApprovalList({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setTsraApprovalListData).toHaveBeenCalled();
  });

  test('getTSRAApprovalList failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getTSRAApprovalList({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getTSRATrackList success with date parsing', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      result: { dataList: [{ requestedDateNT: '01 January 2023' }] },
      tableColumns: [],
    });
    await getTSRATrackList({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setTableColumnData).toHaveBeenCalled();
  });

  test('getTSRATrackList failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getTSRATrackList({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('filterSearchTrackTsra search and status', () => {
    filterSearchTrackTsra({ searchText: 'test', status: { id: 'REJECTED' } }, 'q')(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('filterSearchTrackTsra days filter', () => {
    filterSearchTrackTsra({ createdDateDropdown: { id: '3days' } }, 'q')(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('approveOrRejectTsraDealer approve success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await approveOrRejectTsraDealer({ firstName: 'User' }, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setTsraSuccessData).toHaveBeenCalled();
  });

  test('approveOrRejectTsraDealer reject success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await approveOrRejectTsraDealer({ qualification: { object: { valueNT: 'v' } }, rejectReason: { name: 'r' } }, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setTsraSuccessData).toHaveBeenCalled();
  });

  test('approveOrRejectTsraDealer failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await approveOrRejectTsraDealer({}, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('setSelectedDealer', () => {
    setSelectedDealer({})(dispatch, getState, undefined);
    expect(sliceActions.setSelectedDealer).toHaveBeenCalled();
  });
});
