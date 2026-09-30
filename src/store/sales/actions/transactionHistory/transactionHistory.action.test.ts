import { sliceActions } from 'store/sales/reducer/transactionHistory';
import uiActions from 'store/sales/actions/ui';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import {
  getPartnerTransactions,
  retrieveTransactionDetails,
  resetIsTransactionDetails,
  resetTransactionHistory,
  resetReversalInformation,
  fetchReversalInformation,
  doReverseRecharge,
} from './transactionHistory.action';
import { showErrorPage } from '../ui/ui.action';

jest.mock('store/sales/reducer/transactionHistory', () => ({
  sliceActions: {
    setTransactionHistory: jest.fn(),
    setTransactionHistoryDetails: jest.fn(),
    setIsTransactionDetails: jest.fn(),
    setReversalInformation: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showAlert: jest.fn(),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock(
  'store/sales/query',
  () =>
    new Proxy(
      {},
      {
        get: (_, property) => property,
      },
    ),
);

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
    RechargeReversal: {
      RechargeReversalLast20: { moduleName: 'm1', attributes: { Status: 's1' } },
      RechargeReversalSuccess: { moduleName: 'm2', attributes: { ReversalAmount: 'a1', SubscriberID: 'id1' } },
      RechargeReversalProcessing: { moduleName: 'm3', attributes: { ReversalAmount: 'a1', SubscriberID: 'id1' } },
    },
  },
}));

jest.mock('../ui/ui.action', () => ({
  showErrorPage: jest.fn(),
}));

jest.mock('const', () => ({
  ALERT: { SUCCESS: 'SUCCESS' },
  CHILD_TYPE: { INFO_TEXT: 'INFO_TEXT' },
  MODAL: { OK: 'OK' },
  ROUTE: { WEB: { RECHARGE_REVERSAL: 'RECHARGE_REVERSAL' } },
}));

describe('transactionHistory actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('getPartnerTransactions success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ some: 'data' });

    await getPartnerTransactions({}, 'queryName')(dispatch, getState, undefined);

    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(sliceActions.setTransactionHistory).toHaveBeenCalledWith({ queryName: 'queryName', data: { some: 'data' } });
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('getPartnerTransactions failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    await getPartnerTransactions({}, 'queryName')(dispatch, getState, undefined);

    expect(showErrorPage).toHaveBeenCalledWith('fail');
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('retrieveTransactionDetails success with isTransactionDetails', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({
      isTransactionDetails: true,
      transDetails: { id: 1 },
    });

    await retrieveTransactionDetails({ transactionID: '123' })(dispatch, getState, undefined);

    expect(sliceActions.setTransactionHistoryDetails).toHaveBeenCalledWith({ data: { id: 1 } });
    expect(sliceActions.setIsTransactionDetails).toHaveBeenCalledWith({ data: true });
  });

  test('retrieveTransactionDetails success with subscriberTrans', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({
      isTransactionDetails: false,
      subscriberTrans: [{ id: 1 }],
    });

    await retrieveTransactionDetails({ subscriberId: '123' })(dispatch, getState, undefined);

    expect(sliceActions.setTransactionHistory).toHaveBeenCalledWith({ data: [{ id: 1 }] });
    expect(sliceActions.setIsTransactionDetails).toHaveBeenCalledWith({ data: false });
  });

  test('retrieveTransactionDetails failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    await retrieveTransactionDetails({})(dispatch, getState, undefined);

    expect(showErrorPage).toHaveBeenCalled();
  });

  test('resetIsTransactionDetails', () => {
    resetIsTransactionDetails()(dispatch, getState, undefined);
    expect(sliceActions.setIsTransactionDetails).toHaveBeenCalledWith({ data: false });
  });

  test('resetTransactionHistory', () => {
    resetTransactionHistory()(dispatch, getState, undefined);
    expect(sliceActions.setTransactionHistory).toHaveBeenCalledWith({ data: [] });
  });

  test('resetReversalInformation', () => {
    resetReversalInformation()(dispatch, getState, undefined);
    expect(sliceActions.setReversalInformation).toHaveBeenCalledWith({ reversalReasons: [], balance: '' });
  });

  test('fetchReversalInformation success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ info: 'info' });

    await fetchReversalInformation({})(dispatch, getState, undefined);

    expect(sliceActions.setReversalInformation).toHaveBeenCalledWith({ info: 'info' });
  });

  test('fetchReversalInformation failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    await fetchReversalInformation({})(dispatch, getState, undefined);

    expect(showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('doReverseRecharge success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, message: 'Success' });
    (refactorResponse as jest.Mock).mockReturnValue({ message: 'Success' });

    await doReverseRecharge({ transactionAmount: 100, subscriberId: '123' })(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith('m2', expect.any(Object));
    expect(uiActions.showAlert).toHaveBeenCalledWith('Success', 'SUCCESS', expect.any(Object), expect.any(Object));
    expect(sliceActions.setReversalInformation).toHaveBeenCalled();
  });

  test('doReverseRecharge failure (status false)', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'Processing' });
    (refactorResponse as jest.Mock).mockReturnValue({ message: 'Processing' });

    await doReverseRecharge({ transactionAmount: 100, subscriberId: '123' })(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith('m3', expect.any(Object));
    expect(showErrorPage).toHaveBeenCalledWith('Processing');
  });

  test('doReverseRecharge catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    await doReverseRecharge({})(dispatch, getState, undefined);

    expect(showErrorPage).toHaveBeenCalledWith('Network error');
  });
});
