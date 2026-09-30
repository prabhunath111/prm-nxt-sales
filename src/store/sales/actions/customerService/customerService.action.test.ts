import { sliceActions } from 'store/sales/reducer/customerService';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import {
  getCustomerServiceInfo,
  getServiceSubCategories,
  resetSubCategories,
  getSuspensionReason,
  trackServiceRequest,
  getAvailableSlot,
  getSlotDateForDropdown,
  getSlotTimeForDropdown,
  createServiceRequest,
  resetRaiseRequest,
  resetTrackRequest,
} from './customerService.action';

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/customerService', () => ({
  sliceActions: {
    setSubscriberData: jest.fn(),
    setSubCategories: jest.fn(),
    resetSubCategories: jest.fn(),
    setSuspensionReason: jest.fn(),
    setTrackServiceRequest: jest.fn(),
    setAvailableSlot: jest.fn(),
    setSlotDate: jest.fn(),
    setSlotTime: jest.fn(),
    resetRaiseRequest: jest.fn(),
    resetTrackRequest: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdList: jest.fn(),
  setSubIdListDefault: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    CustomerService: {
      CustomerServiceRaiseRequestValidateID: {
        moduleName: 'CustomerServiceRaiseRequestValidateID',
        attributes: {
          SubscriberID: 'SubscriberID',
        },
      },
      CustomerServiceTrackRequestProceed: {
        moduleName: 'CustomerServiceTrackRequestProceed',
        attributes: {
          SubscriberID: 'SubscriberID',
          NatureOfRequest: 'NatureOfRequest',
          RequestType: 'RequestType',
          TicketID: 'TicketID',
        },
      },
      CustomerServiceRaiseRequestProceed: {
        moduleName: 'CustomerServiceRaiseRequestProceed',
        attributes: {
          SubscriberID: 'SubscriberID',
          NatureOfRequest: 'NatureOfRequest',
          RequestType: 'RequestType',
          TicketID: 'TicketID',
        },
      },
    },
  },
}));

jest.mock('store/sales/query', () => ({
  SAMPLE_QUERY: 'SAMPLE_QUERY',
}));

describe('customerService actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      customerService: {
        typeOfRequest: 'typeOfRequest',
        selectedType: 'selectedType',
      },
    }));
  });

  test('getCustomerServiceInfo success with subIdList', async () => {
    const mockData = { accountInfo: { subIdList: [{ subId: '1', status: 'Active', rmn: '123', aliasName: 'A' }] } };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getCustomerServiceInfo({ subscriberInfo: '123' }, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdList(mockData.accountInfo.subIdList));
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  test('getCustomerServiceInfo success without subIdList', async () => {
    const mockData = { someData: 'data' };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getCustomerServiceInfo({ subscriberInfo: '123' }, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setSubscriberData(mockData));
    expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdListDefault());
    expect(result).toEqual(mockData);
  });

  test('getCustomerServiceInfo failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getCustomerServiceInfo({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });

  test('getServiceSubCategories success', async () => {
    const mockData = [] as any;
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getServiceSubCategories({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setSubCategories(mockData));
  });

  test('getServiceSubCategories failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getServiceSubCategories({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  test('resetSubCategories', () => {
    const action = resetSubCategories();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.resetSubCategories());
  });

  test('getSuspensionReason success', async () => {
    const mockData = [{ label: 'reason', value: 'reason' }];
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getSuspensionReason({}, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setSuspensionReason(mockData));
    expect(result).toEqual(mockData);
  });

  test('getSuspensionReason failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getSuspensionReason({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  test('trackServiceRequest success with subIdList', async () => {
    const mockData = { accountInfo: { subIdList: [{ subId: '1', status: 'Active', rmn: '123', aliasName: 'A' }] } };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = trackServiceRequest({ subscriberInfo: '123' }, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdList(mockData.accountInfo.subIdList));
    expect(result).toEqual(mockData);
  });

  test('trackServiceRequest success without subIdList', async () => {
    const mockData = { someData: 'data' };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = trackServiceRequest({ subscriberInfo: '123' }, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setTrackServiceRequest(mockData));
    expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdListDefault());
    expect(result).toEqual(mockData);
  });

  test('trackServiceRequest failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = trackServiceRequest({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  test('getAvailableSlot success', async () => {
    const mockData = { slots: [] };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getAvailableSlot({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setAvailableSlot(mockData));
  });

  test('getAvailableSlot failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getAvailableSlot({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  test('getSlotDateForDropdown success', async () => {
    const mockData = [] as any;
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getSlotDateForDropdown({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setSlotDate(mockData));
  });

  test('getSlotDateForDropdown failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getSlotDateForDropdown({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  test('getSlotTimeForDropdown success', async () => {
    const mockData = [] as any;
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getSlotTimeForDropdown({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setSlotTime(mockData));
  });

  test('getSlotTimeForDropdown failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getSlotTimeForDropdown({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  test('createServiceRequest success', async () => {
    const mockData = { transactionId: '123' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = createServiceRequest({ subscriberInfo: '123' }, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(result).toEqual({ data: mockData, status: true });
  });

  test('createServiceRequest failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = createServiceRequest({}, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });

  test('resetRaiseRequest', () => {
    const action = resetRaiseRequest();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.resetRaiseRequest());
  });

  test('resetTrackRequest', () => {
    const action = resetTrackRequest();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.resetTrackRequest());
  });
});
