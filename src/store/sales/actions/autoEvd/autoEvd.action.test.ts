import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/autoEvd';
import { api } from 'services/apolloClient';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import {
  dealerSearch,
  autoEvdFilter,
  addOrUpdateDeleteEvdTransfer,
  updateEvdTransfer,
  deleteEvdTransfer,
  deleteAutoEvdTransfer,
  setAutoEvdNavigationData,
  setAutoEvdCurrentValues,
} from './autoEvd.action';

// Mock dependencies
jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(() => ({ type: 'SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'CLEAR_LOADER' })),
  showBottomModal: jest.fn(() => ({ type: 'SHOW_BOTTOM_MODAL' })),
  showErrorPage: jest.fn(() => ({ type: 'SHOW_ERROR_PAGE' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setSearchBarItems: jest.fn(() => ({ type: 'SET_SEARCH_BAR_ITEMS' })),
  setMultipleDropdownOptionsData: jest.fn(() => ({ type: 'SET_MULTI_DROP' })),
}));

jest.mock('store/sales/reducer/autoEvd', () => ({
  sliceActions: {
    setDealerDetails: jest.fn(() => ({ type: 'SET_DEALER_DETAILS' })),
    setEvdSuccessData: jest.fn(() => ({ type: 'SET_EVD_SUCCESS_DATA' })),
    setAutoEvdDealerList: jest.fn(() => ({ type: 'SET_DEALER_LIST' })),
    setAutoEvdNavigationData: jest.fn(() => ({ type: 'SET_NAV_DATA' })),
    setAutoEvdCurrentValues: jest.fn(() => ({ type: 'SET_CURR_VALS' })),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: {
    dealerSearch: 'dealerSearchQuery',
    addOrUpdateDeleteEvdTransfer: 'addOrUpdateDeleteEvdTransferQuery',
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    autoEVDTransfer: {
      Update_Auto_EVD_Transfer: { moduleName: 'update_evd', attributes: { Status: 'Status', autoEVDTransferAmount: 'amt', thresholdLimitValue: 'thresh' } },
    },
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  autoEvdFilterData: jest.fn(() => []),
}));

describe('autoEvd actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      autoEvd: {
        dealerDetails: { thresholdLimitValue: '100', autoEvdAmount: '500' },
        autoEvdDealerList: [],
        autoEvdNavigationData: { data: { dealerId: 'd1', dealerName: 'n1', status: 's1' } },
        autoEvdCurrentValues: { data: { minBalance: '100', reqBalance: '500' } },
      },
      user: { info: { userId: 'user123' } },
    }));
    jest.clearAllMocks();
  });

  describe('dealerSearch thunk', () => {
    test('success', async () => {
      const mockResult = { info: [] };
      (api.post as jest.Mock).mockResolvedValue(mockResult);
      await dealerSearch({}, 'dealerSearch')(dispatch, getState, undefined);
      expect(uiActions.setLoader).toHaveBeenCalled();
      expect(formActions.setSearchBarItems).toHaveBeenCalled();
      expect(sliceActions.setAutoEvdDealerList).toHaveBeenCalled();
      expect(uiActions.clearLoader).toHaveBeenCalled();
    });

    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Search Error'));
      await dealerSearch({}, 'dealerSearch')(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('Search Error');
    });
  });

  test('autoEvdFilter', () => {
    autoEvdFilter({ searchText: 'test' })(dispatch, getState, undefined);
    expect(formActions.setSearchBarItems).toHaveBeenCalled();
  });

  describe('addOrUpdateDeleteEvdTransfer thunk', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      await addOrUpdateDeleteEvdTransfer({ thresholdLimitValue: '1', autoEvdAmount: '2' }, 'addOrUpdateDeleteEvdTransfer')(dispatch, getState, undefined);
      expect(sliceActions.setEvdSuccessData).toHaveBeenCalled();
    });

    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Add Error'));
      await addOrUpdateDeleteEvdTransfer({}, 'addOrUpdateDeleteEvdTransfer')(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('Add Error');
    });
  });

  describe('updateEvdTransfer thunk', () => {
    test('no change scenario', async () => {
      const params = { thresholdLimitValue: '100', autoEvdAmount: '500' };
      await updateEvdTransfer(params)(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalled();
      expect(api.post).not.toHaveBeenCalled();
    });

    test('success path labels changed', async () => {
      const params = { thresholdLimitValue: '200', autoEvdAmount: '600' };
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      await updateEvdTransfer(params)(dispatch, getState, undefined);
      expect(api.post).toHaveBeenCalled();
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    });

    test('error', async () => {
      const params = { thresholdLimitValue: '200', autoEvdAmount: '600' };
      (api.post as jest.Mock).mockRejectedValue(new Error('Update Error'));
      await updateEvdTransfer(params)(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('Update Error');
    });
  });

  describe('deleteEvdTransfer', () => {
    test('success', async () => {
      const result = await deleteEvdTransfer({})(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalled();
      expect(result.status).toBe(true);
    });

    test('error path', async () => {
      (uiActions.showBottomModal as jest.Mock).mockImplementation(() => {
        throw new Error('Modal Err');
      });
      const result = await deleteEvdTransfer({})(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('Modal Err');
      expect(result.status).toBe(false);
    });
  });

  describe('deleteAutoEvdTransfer', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      const result = await deleteAutoEvdTransfer({})(dispatch, getState, undefined);
      expect(sliceActions.setEvdSuccessData).toHaveBeenCalled();
      expect(result.status).toBe(true);
    });

    test('error path', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Del Err'));
      await deleteAutoEvdTransfer({})(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('Del Err');
    });
  });

  test('setAutoEvdNavigationData', () => {
    setAutoEvdNavigationData({ data: 'val' })(dispatch, getState, undefined);
    expect(sliceActions.setAutoEvdNavigationData).toHaveBeenCalledWith({ data: { data: 'val' } });
  });

  test('setAutoEvdCurrentValues', () => {
    setAutoEvdCurrentValues({ data: 'val' })(dispatch, getState, undefined);
    expect(sliceActions.setAutoEvdCurrentValues).toHaveBeenCalledWith({ data: { data: 'val' } });
  });
});
