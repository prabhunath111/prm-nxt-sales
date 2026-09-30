import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/tskRefund';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { getTskRefundDetails, setDefaultTsk, doTskRefund } from './tskRefund.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/tskRefund', () => ({
  sliceActions: {
    setTskRefundData: jest.fn(),
    clearTskRefundData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
  showAlert: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setFormUpdated: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('const', () => ({
  ALERT: { SUCCESS: 'SUCCESS' },
  MODAL: { OK: 'OK' },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    TSKRefund: {
      TSKRefundTSKEligible: { moduleName: 'TSKRefundTSKEligible', attributes: { SubscriberID: 'SubscriberID' } },
      TSKRefundProceed: { moduleName: 'TSKRefundProceed', attributes: { SubscriberID: 'SubscriberID' } },
    },
  },
}));

describe('tskRefund actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      tskRefund: {
        data: {
          salesOrderNum: 'SO123',
          woNumber: 'WO456',
        },
      },
    }));
  });

  test('getTskRefundDetails success', async () => {
    const mockData = { TskDetails: [{ some: 'data' }] };
    (api.post as jest.Mock).mockResolvedValue(mockData);

    const action = getTskRefundDetails({ subscriberId: '123' } as any, 'queryName');
    await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(sliceActions.setTskRefundData).toHaveBeenCalledWith(mockData);
    expect(dispatch).toHaveBeenCalledWith(formActions.setFormUpdated(true));
  });

  test('setDefaultTsk', () => {
    const action = setDefaultTsk();
    action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.clearTskRefundData());
  });

  test('doTskRefund success', async () => {
    const mockData = { refundMessage: 'Refunded' };
    (api.get as jest.Mock).mockResolvedValue(mockData);

    const action = doTskRefund(
      {
        selectedTsk: { TskSno: 'SNO123', DealerCode: 'DLR456' },
        subscriberId: 'SUB789',
        pin: 'PIN000',
      } as any,
      'queryName',
    );
    await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(dispatch).toHaveBeenCalledWith(uiActions.showAlert('Refunded', 'SUCCESS', expect.anything(), {}));
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });
});
