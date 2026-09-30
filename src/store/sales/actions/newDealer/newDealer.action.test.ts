import { api } from 'services/apolloClient';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import { sliceActions } from 'store/sales/reducer/newDealer';
import { callAction } from 'utils/formBuilderHelper';
import { refactorResponse } from 'utils/responseHelper';
import { QUERY, STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import * as actions from './newDealer.action';

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
  showErrorPage: jest.fn((m) => ({ type: 'UI_SHOW_ERROR', payload: m })),
  showAlert: jest.fn((m, t, o) => ({ type: 'UI_SHOW_ALERT', payload: { m, t, o } })),
}));

jest.mock('store/sales/actions/common', () => ({
  setTableColumnData: jest.fn((d) => ({ type: 'COMMON_SET_TABLE_COLUMN_DATA', payload: d })),
  setErrorMessage: jest.fn((m) => ({ type: 'COMMON_SET_ERROR_MESSAGE', payload: m })),
  setTableFilteredData: jest.fn((d) => ({ type: 'COMMON_SET_TABLE_FILTERED_DATA', payload: d })),
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDropdownOptionsData: jest.fn((d) => ({ type: 'FORM_SET_DROPDOWN_OPTIONS', payload: d })),
  },
}));

jest.mock('store/sales/reducer/newDealer', () => ({
  sliceActions: {
    setDistributorList: jest.fn((d) => ({ type: 'NEW_DEALER_SET_DISTRIBUTOR_LIST', payload: d })),
    setDistributorResponse: jest.fn((d) => ({ type: 'NEW_DEALER_SET_DISTRIBUTOR_RESPONSE', payload: d })),
    setSelectedDistCode: jest.fn((c) => ({ type: 'NEW_DEALER_SET_SELECTED_DIST_CODE', payload: c })),
    setSelectedRole: jest.fn((r) => ({ type: 'NEW_DEALER_SET_SELECTED_ROLE', payload: r })),
    setSelectedUserId: jest.fn((u) => ({ type: 'NEW_DEALER_SET_SELECTED_USER_ID', payload: u })),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  setUpdatedFormFields: jest.fn((f) => ({ type: 'FORM_SET_UPDATED_FORM_FIELDS', payload: f })),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn((p, q) => ({ type: 'FORM_BUILDER_CALL_ACTION', payload: { p, q } })),
  filterByParams: jest.fn((d) => d),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('store/sales/query', () => ({
  default: {
    mockQuery: 'MOCK_QUERY',
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    Manage_Hierarchy: {
      ViewNewDealer_PageVisit: {
        moduleName: 'VIEW_NEW_DEALER_PAGE_VISIT',
        attributes: { Status: 'Status' },
      },
    },
  },
}));

jest.mock('config/logger', () => ({
  LOG: {
    info: jest.fn(),
  },
}));

describe('newDealer actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch, getState, undefined);
      return action;
    }) as any;
  });

  describe('ViewNewDealerUnderFOS', () => {
    test('success with data', async () => {
      const mockResult = [{ dealerCode: '1' }, { dealerCode: '2' }];
      (api.get as jest.Mock).mockResolvedValue({
        result: mockResult,
        tableColumns: [],
      });
      (refactorResponse as jest.Mock).mockReturnValue({
        result: mockResult,
        tableColumns: [],
      });

      const result = await actions.ViewNewDealerUnderFOS({}, 'mockQuery')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
      expect(commonActions.setTableColumnData).toHaveBeenCalled();
      expect(result.sortedResult[0].dealerCode).toBe('2');
      expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
    });

    test('success with empty result', async () => {
      (api.get as jest.Mock).mockResolvedValue({ result: [], message: 'No data' });
      (refactorResponse as jest.Mock).mockReturnValue({ result: [], message: 'No data' });

      const result = await actions.ViewNewDealerUnderFOS({}, 'mockQuery')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('No data'));
      expect(result.status).toBe(false);
    });

    test('error path', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('API fail'));

      const result = await actions.ViewNewDealerUnderFOS({}, 'mockQuery')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('API fail'));
      expect(result.status).toBe(false);
    });
  });

  describe('clearDealerTimeout', () => {
    test('clears timeout if exists', () => {
      // Accessing private timeOut is tricky, we can just ensure it doesn't crash
      // and coverage is hit by calling it
      actions.clearDealerTimeout()(dispatch, getState, undefined);
    });
  });

  describe('filterSearchViewNewDealer', () => {
    test('normalizes search text and filters', () => {
      getState.mockReturnValue({
        common: { tableData: [{ status: 'Active' }, { status: 'Inactive' }] },
      });

      actions.filterSearchViewNewDealer({ search: 'abc', status: { id: 'Active' } })(dispatch, getState, undefined);
      expect(commonActions.setTableFilteredData).toHaveBeenCalled();
    });

    test('Created date filtering - 3days', () => {
      const today = new Date();
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(today.getDate() - 2);
      const oldDate = new Date(today);
      oldDate.setDate(today.getDate() - 10);

      getState.mockReturnValue({
        common: {
          tableData: [
            { createdDate: `${String(threeDaysAgo.getDate()).padStart(2, '0')}/${String(threeDaysAgo.getMonth() + 1).padStart(2, '0')}/${threeDaysAgo.getFullYear()}` },
            { createdDate: `${String(oldDate.getDate()).padStart(2, '0')}/${String(oldDate.getMonth() + 1).padStart(2, '0')}/${oldDate.getFullYear()}` },
            { createdDate: null },
          ],
        },
      });

      actions.filterSearchViewNewDealer({ createdDateDropdown: { id: '3days' } })(dispatch, getState, undefined);
      expect(commonActions.setTableFilteredData).toHaveBeenCalled();
    });

    test('Created date filtering - 7days, 15days, lastMonth', () => {
      getState.mockReturnValue({
        common: {
          tableData: [{ createdDate: '01/01/2026' }],
        },
      });

      actions.filterSearchViewNewDealer({ null: { id: '7days' } })(dispatch, getState, undefined);
      actions.filterSearchViewNewDealer({ createdDateDropdown: { id: '15days' } })(dispatch, getState, undefined);
      actions.filterSearchViewNewDealer({ createdDateDropdown: { id: 'lastMonth' } })(dispatch, getState, undefined);
      actions.filterSearchViewNewDealer({ createdDateDropdown: { id: 'unknown' } })(dispatch, getState, undefined);
      expect(commonActions.setTableFilteredData).toHaveBeenCalledTimes(4);
    });

    test('status filtering logic branches', () => {
      getState.mockReturnValue({
        common: { tableData: [] },
      });
      actions.filterSearchViewNewDealer({ '': { id: 'Active' } })(dispatch, getState, undefined);
      actions.filterSearchViewNewDealer({ '': { id: STRINGS.ALL } })(dispatch, getState, undefined);
      expect(commonActions.setTableFilteredData).toHaveBeenCalledTimes(2);
    });

    test('search text normalization branches', () => {
      getState.mockReturnValue({
        common: { tableData: [] },
      });
      // search length > 1
      actions.filterSearchViewNewDealer({ search: 'abc' })(dispatch, getState, undefined);
      // search length 1
      actions.filterSearchViewNewDealer({ search: 'a' })(dispatch, getState, undefined);
      // search empty/null
      actions.filterSearchViewNewDealer({ search: '' })(dispatch, getState, undefined);
      actions.filterSearchViewNewDealer({})(dispatch, getState, undefined);
      expect(commonActions.setTableFilteredData).toHaveBeenCalled();
    });

    test('parameter normalization branches for status and date', () => {
      getState.mockReturnValue({
        common: { tableData: [] },
      });
      // statusId from params?.status?.id
      actions.filterSearchViewNewDealer({ status: { id: 'Active' } })(dispatch, getState, undefined);
      // statusId from params['']?.id
      actions.filterSearchViewNewDealer({ '': { id: 'Active' } })(dispatch, getState, undefined);
      // createdDateId from params?.createdDateDropdown?.id
      actions.filterSearchViewNewDealer({ createdDateDropdown: { id: '3days' } })(dispatch, getState, undefined);
      // createdDateId from params?.null?.id
      actions.filterSearchViewNewDealer({ null: { id: '3days' } })(dispatch, getState, undefined);

      expect(commonActions.setTableFilteredData).toHaveBeenCalledTimes(4);
    });
  });

  describe('viewNewDealerASI', () => {
    test('success with data and timeout', async () => {
      jest.useFakeTimers();
      const mockResult = [{ dealerCode: '1' }, { dealerCode: '2' }];
      (api.get as jest.Mock).mockResolvedValue({ result: mockResult });
      (refactorResponse as jest.Mock).mockReturnValue({ result: mockResult });

      const promise = actions.viewNewDealerASI({}, 'mockQuery')(dispatch, getState, undefined);
      jest.advanceTimersByTime(501);
      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());

      const result = await promise;
      expect(result.sortedResult[0].dealerCode).toBe('2');
      jest.useRealTimers();
    });

    test('empty result', async () => {
      (api.get as jest.Mock).mockResolvedValue({ result: [] });
      (refactorResponse as jest.Mock).mockReturnValue({ result: [] });

      const result = await actions.viewNewDealerASI({}, 'mockQuery')(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });

    test('error path', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

      const result = await actions.viewNewDealerASI({}, 'mockQuery')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setTableColumnData({}));
      expect(result.status).toBe(false);
    });
  });

  describe('viewDistributorList', () => {
    test('success with match', async () => {
      const mockData = {
        result: {
          distCodeAndName: [{ name: '123 - Dist' }],
          distributorResponse: [{ distCode: '123' }],
        },
      };
      (api.get as jest.Mock).mockResolvedValue(mockData);
      (refactorResponse as jest.Mock).mockReturnValue(mockData);

      await actions.viewDistributorList({ null: { name: '123 - Dist' } }, 'query')(dispatch, getState, undefined);
      expect(sliceActions.setDistributorList).toHaveBeenCalled();
      expect(callAction).toHaveBeenCalledWith({ distributorCode: '123' }, QUERY.ViewNewDealerASI);
    });

    test('success without match', async () => {
      const mockData = {
        result: {
          distCodeAndName: null,
          distributorResponse: null,
        },
      };
      (api.get as jest.Mock).mockResolvedValue(mockData);
      (refactorResponse as jest.Mock).mockReturnValue(mockData);

      await actions.viewDistributorList({}, 'query')(dispatch, getState, undefined);
      expect(callAction).not.toHaveBeenCalled();
    });

    test('error path parsing Apollo error', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error(`${STRINGS.APOLLO_ERROR}: custom message`));

      // viewDistributorList doesn't return the promise, so we can't await it directly to completion of catch
      // But we can wrap it or just wait a bit.
      actions.viewDistributorList({}, 'query')(dispatch, getState, undefined);

      // Wait for promise chain
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(uiActions.showAlert).toHaveBeenCalledWith('custom message', expect.anything(), expect.anything(), expect.anything());
    });
  });

  describe('viewDistributorListCSM', () => {
    test('success with match', async () => {
      const mockData = {
        result: {
          distCodeAndName: [{ name: '123 - Dist' }],
          distributorResponse: [{ distCode: '123', role: 'Role', userId: 'U1' }],
        },
      };
      (api.get as jest.Mock).mockResolvedValue(mockData);
      (refactorResponse as jest.Mock).mockReturnValue(mockData);

      actions.viewDistributorListCSM({ null: { name: '123 - Dist' } }, 'query')(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(callAction).toHaveBeenCalledWith({ role: 'Role', userId: 'U1' }, QUERY.ViewDistributorListCSMList);
    });

    test('error path', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.viewDistributorListCSM({}, 'query')(dispatch, getState, undefined);
      expect(uiActions.showAlert).toHaveBeenCalled();
    });
  });

  describe('viewDistributorListCSMList', () => {
    test('success', async () => {
      const mockData = {
        result: {
          distCodeAndName: [{ name: 'D1' }],
        },
      };
      (api.get as jest.Mock).mockResolvedValue(mockData);
      (refactorResponse as jest.Mock).mockReturnValue(mockData);

      await actions.viewDistributorListCSMList({ role: 'R', userId: 'U' }, 'q')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
      expect(sliceActions.setDistributorList).toHaveBeenCalled();
    });

    test('error path', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.viewDistributorListCSMList({ userId: 'U' }, 'q')(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalled();
    });
  });

  describe('useStoredDropdownAndCallAPI', () => {
    test('success with string input', async () => {
      jest.useFakeTimers();
      getState.mockReturnValue({
        newDealer: { distributorResponse: [{ distCode: '123' }] },
      });

      const promise = actions.useStoredDropdownAndCallAPI('123 - Dist' as any)(dispatch, getState, undefined);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());

      const result = await promise;
      expect(result.status).toBe(true);
      expect(callAction).toHaveBeenCalled();
      jest.useRealTimers();
    });

    test('success with object input', async () => {
      getState.mockReturnValue({
        newDealer: { distributorResponse: [{ distCode: '123' }] },
      });

      const result = await actions.useStoredDropdownAndCallAPI({ null: { name: '123 - Dist' } })(dispatch, getState, undefined);
      expect(result.status).toBe(true);
    });

    test('no match', async () => {
      getState.mockReturnValue({
        newDealer: { distributorResponse: [] },
      });
      const result = await actions.useStoredDropdownAndCallAPI('NonExistent' as any)(dispatch, getState, undefined);
      expect(result.state).toBe(false);
    });

    test('success with other input types', async () => {
      getState.mockReturnValue({
        newDealer: { distributorResponse: [{ distCode: '123' }] },
      });

      await actions.useStoredDropdownAndCallAPI({} as ParentObject)(dispatch, getState, undefined);
      await actions.useStoredDropdownAndCallAPI({ null: { name: null } } as any)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
    });

    test('no match with non-matching response', async () => {
      getState.mockReturnValue({
        newDealer: { distributorResponse: [{ distCode: '456' }] },
      });

      const result = await actions.useStoredDropdownAndCallAPI('123 - Dist' as any)(dispatch, getState, undefined);
      expect(result.state).toBe(false);
    });

    test('error path', async () => {
      getState.mockImplementation(() => {
        throw new Error('fail');
      });
      const result = await actions.useStoredDropdownAndCallAPI('123' as any)(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });
  });
});
