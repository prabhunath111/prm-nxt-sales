import { sliceActions } from 'store/sales/reducer/competitorDataCapture';
import uiActions from 'store/sales/actions/ui';
import { api } from 'services/apolloClient';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { modelForCompetitorDataCapture, doBalanceEnquire, competitorBoxTypeFilter, competitorServiceProviderFilter, captureCompetitorData } from './competitorDataCapture.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/competitorDataCapture', () => ({
  sliceActions: {
    setBalanceEnquireData: jest.fn(),
    competitorDataCaptureSuccess: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(),
  setModalLoader: jest.fn(),
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setMultipleDropdownOptionsData: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setDealerDetails: jest.fn(),
  setErrorMessage: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('const', () => ({
  CHILD_TYPE: { DYNAMIC_SALES_NEXT_FORM: 'DYNAMIC_SALES_NEXT_FORM' },
  FORMS: { competitorDataCapture: 'competitorDataCapture' },
  HEADER_TITLE: { COMPETITOR_DATA_CAPTURE: 'COMPETITOR_DATA_CAPTURE' },
  ICONS: { COMPETITOR_DATA_CAPTURE: 'ICONS.COMPETITOR_DATA_CAPTURE' },
  QUERY: {
    CompetitorBoxTypeFilter: 'CompetitorBoxTypeFilter',
    CompetitorServiceProviderFilter: 'CompetitorServiceProviderFilter',
  },
}));

jest.mock('store/sales/query', () => ({
  query: 'query',
}));

jest.mock('styles', () => ({
  Sizing: { x10: 10 },
}));

describe('competitorDataCapture actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      competitorDataCapture: {
        balanceEnquireData: {},
      },
    }));
  });

  test('modelForCompetitorDataCapture', () => {
    const action = modelForCompetitorDataCapture({ showCloseIcon: false });
    (action as any)(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      uiActions.showBottomModal(
        expect.objectContaining({
          isModalVisible: true,
          formName: 'competitorDataCapture',
        }),
      ),
    );
  });

  test('doBalanceEnquire success', async () => {
    const mockData = { evdId: '123', mdn: '456', childName: 'name' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doBalanceEnquire({ subscriberInfo: 'sub123' }, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.setModalLoader).toHaveBeenCalled();
    expect(sliceActions.setBalanceEnquireData).toHaveBeenCalledWith(mockData);
    expect(commonActions.setDealerDetails).toHaveBeenCalled();
    expect(callAction).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('doBalanceEnquire failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = doBalanceEnquire({ subscriberInfo: 'sub123' }, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith(error.message);
    expect(result).toEqual({ status: false, message: error.message });
  });

  test('competitorBoxTypeFilter success', async () => {
    const mockData = { competitorBoxTypeFilter: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = competitorBoxTypeFilter({}, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalledWith({ boxType: [] });
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('competitorBoxTypeFilter failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = competitorBoxTypeFilter({}, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(result).toEqual({ status: false, message: error.message });
  });

  test('competitorServiceProviderFilter success', async () => {
    const mockData = { serviceProviderFilter: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = competitorServiceProviderFilter({}, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalledWith({ serviceProvider: [] });
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('competitorServiceProviderFilter failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = competitorServiceProviderFilter({}, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(result).toEqual({ status: false, message: error.message });
  });

  test('captureCompetitorData success with valid RMN', async () => {
    getState.mockReturnValue({
      competitorDataCapture: {
        balanceEnquireData: { recipientRMN: '1234567890' }, // length 10
      },
    });
    const mockData = { status: 'success' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = captureCompetitorData({ serviceProvider: { nameNT: 'SP' }, boxType: { nameNT: 'BT' } }, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(sliceActions.competitorDataCaptureSuccess).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('captureCompetitorData success with invalid RMN', async () => {
    getState.mockReturnValue({
      competitorDataCapture: {
        balanceEnquireData: { recipientRMN: '123' }, // length not 10
      },
    });
    const mockData = { status: 'success' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = captureCompetitorData({ serviceProvider: { nameNT: 'SP' }, boxType: { nameNT: 'BT' } }, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('captureCompetitorData failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = captureCompetitorData({}, 'query', null, null);
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith(error.message);
    expect(result).toEqual({ status: false, message: error.message });
  });
});
