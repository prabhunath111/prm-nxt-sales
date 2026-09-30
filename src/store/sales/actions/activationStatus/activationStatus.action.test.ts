import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { sliceActions } from 'store/sales/reducer/activationStatus';
import { api } from 'services/apolloClient';
import { getActivationStatus, showActivationStatusModal, getActivationStatusBCP, activationStatusModal, fillInSubId } from './activationStatus.action';

// Mock dependencies
jest.mock('store/sales/actions/ui', () => ({
  setModalLoader: jest.fn(() => ({ type: 'SET_MODAL_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'CLEAR_LOADER' })),
  showBottomModal: jest.fn(() => ({ type: 'SHOW_BOTTOM_MODAL' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdList: jest.fn(() => ({ type: 'SET_SUB_ID_LIST' })),
  setDealerDetails: jest.fn(() => ({ type: 'SET_DEALER_DETAILS' })),
  setUpdatedFormFields: jest.fn(() => ({ type: 'SET_UPDATED_FORM_FIELDS' })),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(() => ({ type: 'SET_ERROR_MESSAGE' })),
}));

jest.mock('store/sales/reducer/activationStatus', () => ({
  sliceActions: {
    setActivationStatusData: jest.fn(() => ({ type: 'SET_ACTIVATION_STATUS_DATA' })),
    setBcpActivationStatusData: jest.fn(() => ({ type: 'SET_BCP_ACTIVATION_STATUS_DATA' })),
    setSubIdFromNavigation: jest.fn(() => ({ type: 'SET_SUB_ID_FROM_NAVIGATION' })),
  },
}));

jest.mock('store/sales/reducer/activationStatusDetails', () => ({
  sliceActions: {
    setSubscriptionDetails: jest.fn(() => ({ type: 'SET_SUBSCRIPTION_DETAILS' })),
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
    getAllSubscriberDetails: 'GET_ALL_SUB_DETAILS',
    getActivationStatus: 'GET_ACT_STATUS',
    getActivationStatusBCP: 'GET_ACT_STATUS_BCP',
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
}));

describe('activationStatus actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    getState = jest.fn(() => ({
      user: { info: { userId: 'user123' } },
      activationStatus: { subIdFromNavigation: 'subNav123' },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
    jest.clearAllMocks();
  });

  describe('getActivationStatus thunk', () => {
    test('success with RMN (first digit >= 6)', async () => {
      const mockResultResult = {
        subscriberId: 'sub123',
        customerName: 'John',
        customerRMN: '9876543210',
        subList: [], // Required to avoid line 97 error
      };
      (api.get as jest.Mock).mockResolvedValue(mockResultResult);

      const params = { subscriberInfo: '9876543210' };
      const result = await getActivationStatus(params)(dispatch, getState, undefined);

      expect(uiActions.setModalLoader).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledWith('GET_ALL_SUB_DETAILS', expect.anything());
      expect(sliceActions.setActivationStatusData).toHaveBeenCalled();
      expect(formActions.setDealerDetails).toHaveBeenCalled();
      expect(result).toEqual({ status: true, data: mockResultResult });
    });

    test('success with SubscriberId (first digit < 6)', async () => {
      const mockResultSub = { subscriberId: '1234567890', subList: [] };
      (api.get as jest.Mock).mockResolvedValue(mockResultSub);

      const paramsSub = { subscriberInfo: '1234567890' };
      const result = await getActivationStatus(paramsSub)(dispatch, getState, undefined);

      expect(api.get).toHaveBeenCalledWith('GET_ACT_STATUS', expect.anything());
      expect(result).toEqual({ status: true, data: mockResultSub });
    });

    test('failure case calls getActivationStatus recursively if only one subId', async () => {
      const mockResultRecursive = { subIdList: [{ subscriberId: 'onlyOne' }] };
      (api.get as jest.Mock).mockResolvedValueOnce(mockResultRecursive);
      // Second call mock
      (api.get as jest.Mock).mockResolvedValueOnce({ subscriberId: 'onlyOne', subList: [] });

      const paramsRecursive = { subscriberInfo: '9876543210' };
      await getActivationStatus(paramsRecursive)(dispatch, getState, undefined);

      expect(api.get).toHaveBeenCalledTimes(2);
    });

    test('shows bottom modal if multiple subIdList', async () => {
      const mockResultMulti = { subIdList: [{ subscriberId: 'sub1' }, { subscriberId: 'sub2' }] };
      (api.get as jest.Mock).mockResolvedValue(mockResultMulti);

      const paramsMulti = { subscriberInfo: '9876543210' };
      const result = await getActivationStatus(paramsMulti)(dispatch, getState, undefined);

      expect(formActions.setSubIdList).toHaveBeenCalled();
      expect(uiActions.showBottomModal).toHaveBeenCalled();
      expect(result).toEqual({ status: false, data: mockResultMulti });
    });

    test('shows error if isRMN and no subList/data', async () => {
      const mockResultNoSub = { subList: null };
      (api.get as jest.Mock).mockResolvedValue(mockResultNoSub);

      const paramsNoSub = { subscriberInfo: '9876543210' };
      const result = await getActivationStatus(paramsNoSub)(dispatch, getState, undefined);

      expect(commonActions.setErrorMessage).toHaveBeenCalled();
      expect(result).toEqual({ status: false, data: mockResultNoSub });
    });

    test('catch error block', async () => {
      const errorObj = new Error('API Error');
      (api.get as jest.Mock).mockRejectedValue(errorObj);

      const paramsErr = { subscriberInfo: '123' };
      await getActivationStatus(paramsErr)(dispatch, getState, undefined);

      expect(commonActions.setErrorMessage).toHaveBeenCalled();
    });
  });

  describe('showActivationStatusModal', () => {
    test('dispatches showBottomModal', () => {
      showActivationStatusModal()(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalled();
    });
  });

  describe('getActivationStatusBCP thunk', () => {
    test('success path', async () => {
      const mockResultBCPSuccess = { status: 'BCP Success' };
      (api.get as jest.Mock).mockResolvedValue(mockResultBCPSuccess);

      const paramsBCP = { bcpBookingRefNo: 'REF123', bcpTskPin: 'PIN123' };
      const result = await getActivationStatusBCP(paramsBCP)(dispatch, getState, undefined);

      expect(sliceActions.setBcpActivationStatusData).toHaveBeenCalled();
      expect(result).toEqual({ status: true, data: mockResultBCPSuccess });
    });

    test('error path', async () => {
      const errorBCPErr = new Error('BCP Error');
      (api.get as jest.Mock).mockRejectedValue(errorBCPErr);

      const paramsBCPErr = { bcpBookingRefNo: 'REF123', bcpTskPin: 'PIN123' };
      await getActivationStatusBCP(paramsBCPErr)(dispatch, getState, undefined);

      expect(commonActions.setErrorMessage).toHaveBeenCalled();
    });
  });

  describe('activationStatusModal', () => {
    test('dispatches showBottomModal', () => {
      activationStatusModal({})(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalled();
    });
  });

  describe('fillInSubId thunk', () => {
    test('sets updated form fields if subIdFromNavigation exists', async () => {
      const state = getState();
      state.activationStatus.subIdFromNavigation = 'NAV123';
      getState.mockReturnValue(state);
      await fillInSubId({})(dispatch, getState, undefined);

      expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
      expect(sliceActions.setSubIdFromNavigation).toHaveBeenCalled();
    });

    test('only resets navigation id if it does not exist', async () => {
      const state = getState();
      state.activationStatus.subIdFromNavigation = null;
      getState.mockReturnValue(state);
      await fillInSubId({})(dispatch, getState, undefined);

      expect(formActions.setUpdatedFormFields).not.toHaveBeenCalled();
      expect(sliceActions.setSubIdFromNavigation).toHaveBeenCalled();
    });
  });
});
