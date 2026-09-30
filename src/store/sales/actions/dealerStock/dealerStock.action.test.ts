import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/dealerStock';
import { api } from 'services/apolloClient';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { callAction } from 'utils/formBuilderHelper';
import { dealerStockModal, getProductTypes, getDealerStocks, filterDealerStock, filterStocks } from './dealerStock.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/dealerStock', () => ({
  sliceActions: {
    setProductTypeDropdown: jest.fn(),
    setFilteredStock: jest.fn(),
    setStockList: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(),
  hideBottomModal: jest.fn(),
  setModalLoader: jest.fn(),
  clearLoader: jest.fn(),
  setLoader: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setFormValues: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    DealerStock: {
      DealerStockEVDDealerIDMDNProceed: { moduleName: 'mod1', attributes: { Status: 'Status', iD: 'iD' } },
      DealerStockConfigureApply: { moduleName: 'mod2', attributes: { Status: 'Status', formName: 'formName' } },
    },
  },
}));

describe('dealerStock actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  let navigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      dealerStock: {
        multiCheckboxStockFilter: 'test-filter',
      },
    }));
    navigate = jest.fn();
  });

  test('dealerStockModal', () => {
    const action = dealerStockModal({ showCloseIcon: false });
    action(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ showCloseIcon: false }));
  });

  test('dealerStockModal with default close icon', () => {
    const action = dealerStockModal({});
    action(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ showCloseIcon: true }));
  });

  test('getProductTypes', () => {
    const action = getProductTypes({ test: 'test' }, 'query', 'state', navigate);
    action(dispatch, getState, undefined);
    expect(uiActions.setModalLoader).toHaveBeenCalled();
    expect(sliceActions.setProductTypeDropdown).toHaveBeenCalled();
    expect(sliceActions.setFilteredStock).toHaveBeenCalledWith({});
    expect(callAction).toHaveBeenCalled();
  });

  test('getDealerStocks success', async () => {
    const mockData = { some: 'data' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getDealerStocks({ subscriberInfo: '123' }, 'query', 'state', navigate);
    const result = await action(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(sliceActions.setStockList).toHaveBeenCalledWith(mockData);
    expect(navigate).toHaveBeenCalled();
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('getDealerStocks success without navigate', async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    const action = getDealerStocks({}, 'query', 'state', undefined);
    await action(dispatch, getState, undefined);
    expect(navigate).not.toHaveBeenCalled();
  });

  test('getDealerStocks failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = getDealerStocks({}, 'query', 'state', navigate);
    const result = await action(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalledWith(error.message);
    expect(result).toEqual({ status: false, message: error.message });
  });

  test('filterDealerStock', async () => {
    const action = filterDealerStock({});
    await action(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(formActions.setFormValues).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('filterStocks', () => {
    const action = filterStocks({ test: 'test' });
    action(dispatch, getState, undefined);
    expect(sliceActions.setFilteredStock).toHaveBeenCalledWith({ test: 'test' });
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });
});
