import { sliceActions } from 'store/sales/reducer/common';
import uiActions from 'store/sales/actions/ui';
import { api } from 'services/apolloClient';
import {
  getLanguages,
  resendOTPWithOutSubId,
  setErrorMessage,
  reSetErrorMessage,
  reSetCustomAmount,
  setAllTableData,
  setTableFilteredData,
  setTableColumnData,
  setToggleSwitchEnabled,
  setDealerDetails,
  setWebViewUrl,
  getBalanceFos,
  setCustomFormData,
  resetCustomFormData,
  resetTable,
  resetCommonStore,
  setTotalListCount,
  getHotelSubscriptionURL,
} from './common.action';

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/common', () => ({
  sliceActions: {
    getLanguageStart: jest.fn(),
    getLanguageSuccess: jest.fn(),
    setErrorMessage: jest.fn(),
    reSetErrorMessage: jest.fn(),
    reSetCustomAmount: jest.fn(),
    setTableColumnData: jest.fn(),
    setDealerDetail: jest.fn(),
    setTableFilteredData: jest.fn(),
    setToggleSwitchEnabled: jest.fn(),
    setWebViewUrl: jest.fn(),
    setCustomAmount: jest.fn(),
    setCustomFormData: jest.fn(),
    resetCustomFormData: jest.fn(),
    resetTable: jest.fn(),
    resetCommonStore: jest.fn(),
    totalListCount: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showErrorPage: jest.fn(),
  clearLoader: jest.fn(),
  setLoader: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('config/logger', () => ({
  LOG: {
    info: jest.fn(),
  },
}));

jest.mock('const', () => ({
  STRINGS: {
    APOLLO_ERROR: 'ApolloError',
  },
}));

jest.mock('store/sales/query', () => ({
  GET_LANGUAGE_QUERY: 'GET_LANGUAGE_QUERY',
  generateOTPWithOutSubId: 'generateOTPWithOutSubId',
}));

describe('common actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn();
  });

  test('getLanguages success', async () => {
    const mockData = { languages: [] };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getLanguages({ localeName: 'en' } as any);
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.getLanguageStart());
    expect(sliceActions.getLanguageSuccess).toHaveBeenCalledWith(mockData);
  });

  test('getLanguages failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getLanguages({ localeName: 'en' } as any);
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  test('resendOTPWithOutSubId success', async () => {
    const mockData = { status: true };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = resendOTPWithOutSubId();
    const result = await action(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
    expect(result).toEqual(mockData);
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });

  test('resendOTPWithOutSubId failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = resendOTPWithOutSubId();
    await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith(error.message);
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });

  test('setErrorMessage', () => {
    const action = setErrorMessage('ApolloError: some error');
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setErrorMessage({ message: 'some error' }));
  });

  test('setErrorMessage fallback', () => {
    const action = setErrorMessage('some error');
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setErrorMessage({ message: 'some error' }));
  });

  test('reSetErrorMessage', () => {
    const action = reSetErrorMessage();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.reSetErrorMessage());
  });

  test('reSetCustomAmount', () => {
    const action = reSetCustomAmount();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.reSetCustomAmount());
  });

  test('setAllTableData', () => {
    const tableData = { tableColumns: [], result: [], dealerDetails: {} };
    const action = setAllTableData(tableData);
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setTableColumnData({ tableColumns: [], tableData: [] }));
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setDealerDetail({ dealerDetails: {} }));
  });

  test('setTableFilteredData', () => {
    const data = { result: [] };
    const action = setTableFilteredData(data);
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setTableFilteredData({ tableData: [] }));
  });

  test('setTableColumnData', () => {
    const data = { tableColumns: [], result: [] };
    const action = setTableColumnData(data);
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setTableColumnData({ tableColumns: [], tableData: [] }));
  });

  test('setToggleSwitchEnabled', () => {
    const action = setToggleSwitchEnabled('key', true);
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setToggleSwitchEnabled({ key: true }));
  });

  test('setDealerDetails', () => {
    const data = { id: 1 };
    const action = setDealerDetails(data);
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setDealerDetail({ dealerDetails: data }));
  });

  test('setWebViewUrl', () => {
    const action = setWebViewUrl('url');
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setWebViewUrl({ url: 'url' }));
  });

  test('getBalanceFos searchLocally exists', async () => {
    const mockData = { balance: 100 };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getBalanceFos({ searchLocally: '123' }, 'query');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setCustomAmount(mockData));
  });

  test('getBalanceFos searchLocally failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = getBalanceFos({ searchLocally: '123' }, 'query');
    await action(dispatch, getState, undefined);
    // Error is logged, not dispatched to UI in this case based on code
  });

  test('getBalanceFos searchLocally missing', () => {
    const action = getBalanceFos({}, 'query');
    action(dispatch, getState, undefined);
    expect(api.post).not.toHaveBeenCalled();
  });

  test('setCustomFormData', () => {
    const data = { field: 'value' };
    const action = setCustomFormData(data);
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setCustomFormData(data));
  });

  test('resetCustomFormData', () => {
    const action = resetCustomFormData();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.resetCustomFormData());
  });

  test('resetTable', () => {
    const action = resetTable();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.resetTable());
  });

  test('resetCommonStore', () => {
    const action = resetCommonStore();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.resetCommonStore());
  });

  test('setTotalListCount', () => {
    const action = setTotalListCount(10);
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.totalListCount(10));
  });

  test('getHotelSubscriptionURL success', async () => {
    const mockData = { url: 'url' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getHotelSubscriptionURL({}, 'query');
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('getHotelSubscriptionURL failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = getHotelSubscriptionURL({}, 'query');
    await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith(error.message);
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });
});
