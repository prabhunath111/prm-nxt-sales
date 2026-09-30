import { sliceActions } from 'store/sales/reducer/accountInformation';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { LOG } from 'config/logger';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { accountInformation, resetAccountInformation, getLastFiveRecharge } from './accountInformation.action';

// Mock dependencies
jest.mock('store/sales/reducer/accountInformation', () => ({
  sliceActions: {
    setAccountInformation: jest.fn((val) => ({ type: 'SET_ACCOUNT_INFO', payload: val })),
    setLastFiveRecharge: jest.fn((val) => ({ type: 'SET_LAST_5', payload: val })),
    setRequestParams: jest.fn((val) => ({ type: 'SET_REQ_PARAMS', payload: val })),
    setParamsRMN: jest.fn((val) => ({ type: 'SET_PARAMS_RMN', payload: val })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(() => ({ type: 'SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'CLEAR_LOADER' })),
  showErrorPage: jest.fn((msg) => ({ type: 'SHOW_ERROR', payload: msg })),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdList: jest.fn((val) => ({ type: 'SET_SUB_ID_LIST', payload: val })),
  setSubIdListDefault: jest.fn(() => ({ type: 'SET_SUB_ID_DEFAULT' })),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: {
    testQuery: 'QUERY_STRING',
    getLastFiveRecharge: 'GET_LAST_5_QUERY',
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((res) => res),
}));

jest.mock('config/logger', () => ({
  LOG: {
    info: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    CustomerInformation: {
      CustomerInformationMultiSID: { moduleName: 'multi_sid', attributes: { SubscriberID: 'sid', Subscriber_RMN: 'rmn' } },
      CustomerInformationDetails: { moduleName: 'details', attributes: { SubscriberID: 'sid', Subscriber_RMN: 'rmn' } },
      CustomerInformationLast5: { moduleName: 'last5', attributes: { Subscriber_RMN: 'rmn', Transaction_ID: 'tid' } },
    },
  },
}));

describe('accountInformation actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      accountInformation: { paramsRMN: { subscriberInfo: '123' } },
    }));
    jest.clearAllMocks();
  });

  describe('accountInformation thunk', () => {
    test('success with subIdList', async () => {
      const mockResult = { subIdList: [{ subId: '1', status: 'Active', rmn: '123', aliasName: 'User1' }] };
      (api.get as jest.Mock).mockResolvedValue(mockResult);
      (refactorResponse as jest.Mock).mockReturnValue(mockResult);

      const params = { subscriberInfo: 'sub123' };
      const result = await accountInformation(params, 'testQuery')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setParamsRMN(params));
      expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdList(mockResult.subIdList));
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith('multi_sid', expect.anything());
      expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
      expect(result).toEqual({ data: mockResult, status: false });
    });

    test('success without subIdList', async () => {
      const mockResult = { accountId: 'acc123' };
      (api.get as jest.Mock).mockResolvedValue(mockResult);
      (refactorResponse as jest.Mock).mockReturnValue(mockResult);

      const params = { subscriberInfo: 'sub123' };
      const result = await accountInformation(params, 'testQuery')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setRequestParams(params));
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setAccountInformation(mockResult));
      expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdListDefault());
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith('details', expect.anything());
      expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
      expect(result).toEqual({ data: mockResult, status: true });
    });

    test('failure case', async () => {
      const error = new Error('API Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      const params = { subscriberInfo: 'sub123' };
      const result = await accountInformation(params, 'testQuery')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
      expect(LOG.info).toHaveBeenCalledWith(expect.stringContaining('API Error'));
      expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
      expect(result).toEqual({ status: false });
    });
  });

  describe('resetAccountInformation', () => {
    test('dispatches reset actions', () => {
      resetAccountInformation()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setAccountInformation({}));
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setLastFiveRecharge([]));
    });
  });

  describe('getLastFiveRecharge thunk', () => {
    test('success case', async () => {
      const mockResult = { lastRechargeDetails: [{ amount: '100', transDate: '2021-01-01', transactionId: 'tx1' }] };
      (api.get as jest.Mock).mockResolvedValue(mockResult);
      (refactorResponse as jest.Mock).mockReturnValue(mockResult);

      const params = { subscriberId: 'sub123' };
      const result = await getLastFiveRecharge(params)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setLastFiveRecharge(mockResult.lastRechargeDetails));
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith('last5', expect.anything());
      expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
      expect(result).toEqual({ status: true });
    });

    test('failure case', async () => {
      const error = new Error('Fetch Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      const params = { subscriberId: 'sub123' };
      const result = await getLastFiveRecharge(params)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
      expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
      expect(result).toEqual({ status: false });
    });
  });
});
