/* eslint-disable no-return-await */
import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/activationStatusDetails';
import { api } from 'services/apolloClient';
import commonActions from 'store/sales/actions/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import {
  getWODetailsActivationStatus,
  getActivationStatusOtherDetails,
  getUpgradeWODetailsActivationStatus,
  getActivationStatusPacInfo,
  getLastFiveRechargesDetails,
  getAccountInfo,
} from './activationStatusDetails.action';

// Mock dependencies
jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(() => ({ type: 'SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'CLEAR_LOADER' })),
}));

jest.mock('store/sales/reducer/activationStatusDetails', () => ({
  sliceActions: {
    setWoDetailsData: jest.fn(() => ({ type: 'SET_WO_DETAILS_DATA' })),
    setWoOtherDetails: jest.fn(() => ({ type: 'SET_WO_OTHER_DETAILS' })),
    setUpgradeWODetails: jest.fn(() => ({ type: 'SET_UPGRADE_WO_DETAILS' })),
    setSubscriptionDetails: jest.fn(() => ({ type: 'SET_SUBSCRIPTION_DETAILS' })),
    setTransactions: jest.fn(() => ({ type: 'SET_TRANSACTIONS' })),
    setAccountInfo: jest.fn(() => ({ type: 'SET_ACCOUNT_INFO' })),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: {
    getWODetailsActivationStatus: 'GET_WO_DETAILS',
    getActivationStatusOtherDetails: 'GET_ACT_OTHER_DETAILS',
    getUpgradeWODetailsActivationStatus: 'GET_UPGRADE_WO_DETAILS',
    getActivationStatusPacInfo: 'GET_ACT_PAC_INFO',
    getLastFiveRechargesDetails: 'GET_LAST_5_RECHARGES',
    accountInformation: 'GET_ACCOUNT_INFO',
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(() => ({ type: 'SET_ERROR_MESSAGE' })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    ActivationStatus: {
      ActivationStatusWODetails: {
        moduleName: 'wo_details_track',
        attributes: { Status: 'Status', SubscriberID: 'SubscriberID' },
      },
    },
  },
}));

describe('activationStatusDetails actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      form: { formState: { dealerDetails: { subscriberId: 'sub123' } } },
    }));
    jest.clearAllMocks();
  });

  const testThunkSuccess = async (thunk: any, actionType: any, mockData: any, expectedData: any) => {
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const result = await thunk()(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(dispatch).toHaveBeenCalledWith(actionType(expectedData));
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
    expect(result).toEqual({ status: true, data: mockData });
  };

  const testThunkError = async (thunk: any) => {
    (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));
    await thunk()(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('API Error'));
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  };

  describe('getWODetailsActivationStatus', () => {
    test('success', async () => {
      await testThunkSuccess(getWODetailsActivationStatus, sliceActions.setWoDetailsData, { woDetails: 'data' }, 'data');
    });
    test('error', async () => await testThunkError(getWODetailsActivationStatus));
  });

  describe('getActivationStatusOtherDetails', () => {
    test('success with tracking', async () => {
      (api.get as jest.Mock).mockResolvedValue({ otherDetails: 'other' });
      const result = await getActivationStatusOtherDetails()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setWoOtherDetails('other'));
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
      expect(result).toEqual({ status: true, data: { otherDetails: 'other' } });
    });
    test('error', async () => await testThunkError(getActivationStatusOtherDetails));
  });

  describe('getUpgradeWODetailsActivationStatus', () => {
    test('success', async () => {
      await testThunkSuccess(getUpgradeWODetailsActivationStatus, sliceActions.setUpgradeWODetails, { woDetails: 'upgrade' }, 'upgrade');
    });
    test('error', async () => await testThunkError(getUpgradeWODetailsActivationStatus));
  });

  describe('getActivationStatusPacInfo', () => {
    test('success', async () => {
      await testThunkSuccess(getActivationStatusPacInfo, sliceActions.setSubscriptionDetails, { packDetails: 'packs' }, 'packs');
    });
    test('error', async () => await testThunkError(getActivationStatusPacInfo));
  });

  describe('getLastFiveRechargesDetails', () => {
    test('success', async () => {
      await testThunkSuccess(getLastFiveRechargesDetails, sliceActions.setTransactions, { transactions: 'txs' }, 'txs');
    });
    test('error', async () => await testThunkError(getLastFiveRechargesDetails));
  });

  describe('getAccountInfo', () => {
    test('success', async () => {
      const mockData = { info: 'acc' };
      await testThunkSuccess(getAccountInfo, sliceActions.setAccountInfo, mockData, mockData);
    });
    test('error', async () => await testThunkError(getAccountInfo));
  });
});
