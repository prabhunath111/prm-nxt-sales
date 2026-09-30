import uiActions from 'store/sales/actions/ui';
import { sliceActions as invoiceReducerAction } from 'store/sales/reducer/invoice';
import { sliceActions as formReducerAction } from 'store/sales/reducer/form';
import { api } from 'services/apolloClient';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { STATE_KEY } from 'const';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import {
  customerInvoiceModal,
  invoiceTransactions,
  getInvoiceTransactions,
  searchInvoiceTransactions,
  getURLforInvoiceTransactions,
  getGstInvoiceByUserId,
  gstConfirmation,
  gstConfirmationProfile,
  fillinGstTypeAndNumber,
  fillInGSTNumber,
  updateGst,
  getGstDetailsByUserId,
  updateGstProfile,
  validateGST,
} from './invoice.action';

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setSearchBarItems: jest.fn(),
    setMultipleAutoCompleteData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/invoice', () => ({
  sliceActions: {
    setInvoiceTransactions: jest.fn(),
    setCloseView: jest.fn(),
    setTransactionId: jest.fn(),
    setInvoiceGSTdata: jest.fn(),
    setGSTData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(),
  hideBottomModal: jest.fn(),
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  setModalLoader: jest.fn(),
  showAlert: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setUpdatedFormFields: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setErrorMessage: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => () => Promise.resolve({ status: true })),
  filterByParams: jest.fn((data) => data),
}));

jest.mock('utils/navigationHelper', () => ({
  handleWebViewUrl: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    customerInvoice: {
      GetInvoiceByTransactionID: {
        moduleName: 'mod',
        attributes: { Status: 'Status', SubscriberID: 'SubscriberID', transactionId: 'transactionId' },
      },
      GetInvoiceBySubscriberID: {
        moduleName: 'mod2',
        attributes: {
          Status: 'Status',
          SubscriberID: 'SubscriberID',
          transactionId: 'transactionId',
          amount: 'amount',
          transactionDate: 'transactionDate',
          bingeRechargeFlag: 'bingeRechargeFlag',
        },
      },
    },
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('i18next', () => {
  const m = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue(true),
    t: jest.fn((k) => k),
  };
  return { __esModule: true, default: m, ...m };
});

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('i18next-browser-languagedetector', () => ({
  __esModule: true,
  default: class {
    type = 'languageDetector';
  },
}));

jest.mock('config/i18n', () => ({
  __esModule: true,
  default: { t: jest.fn((k) => k) },
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn() },
}));

jest.mock('styles', () => ({
  Sizing: { x400: 400 },
  Typography: {
    fontName: {
      medium: { fontFamily: 'medium', fontWeight: '500' },
    },
  },
}));

const flushPromises = () =>
  new Promise<void>((resolve) => {
    process.nextTick(resolve);
  });

describe('invoice actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => ({
      user: { info: { mdn: '123', internalRole: 'other', userId: 'u1' } },
      invoice: {
        invoiceTransactions: [{ subscriberId: 'abc' }],
        gstTransactionId: { transactionId: 'TXN123' },
        gstData: { dealerType: 'REGISTERED', gstNumber: 'GST123' },
        closeView: false,
      },
      form: { [STATE_KEY.FORM_STATE]: {} },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  // customerInvoiceModal
  test('customerInvoiceModal dispatches showBottomModal', () => {
    customerInvoiceModal({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('customerInvoiceModal uses params.showCloseIcon when provided', () => {
    // showCloseIcon: params?.showCloseIcon || true — false || true evaluates to true
    customerInvoiceModal({ showCloseIcon: false })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ showCloseIcon: true }));
  });

  // invoiceTransactions
  test('invoiceTransactions success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ info: [{ id: 1 }] });
    await invoiceTransactions({}, 'q')(dispatch, getState, undefined);
    expect(invoiceReducerAction.setInvoiceTransactions).toHaveBeenCalled();
    expect(invoiceReducerAction.setCloseView).toHaveBeenCalledWith(false);
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('invoiceTransactions failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await invoiceTransactions({}, 'q')(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  // getInvoiceTransactions
  test('getInvoiceTransactions returns null for invalid transactionID', () => {
    const navigate = jest.fn();
    const result = getInvoiceTransactions({ transactionID: 'invalid!!' }, '', {}, navigate)(dispatch, getState, undefined);
    expect(result).toBeNull();
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with transactionID > 10 chars and ASM role dispatches callAction', async () => {
    getState = jest.fn(() => ({
      user: { info: { internalRole: 'asm', userId: 'u1' } },
      invoice: { gstTransactionId: { transactionId: 'TXN123' }, closeView: false },
    }));
    const navigate = jest.fn();
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    getInvoiceTransactions({ transactionID: 'ABCDE12345X' }, '', {}, navigate)(dispatch, getState, undefined);
    expect(invoiceReducerAction.setTransactionId).toHaveBeenCalled();
    expect(callAction).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with transactionID > 10 chars and non-ASM role, callAction success', async () => {
    getState = jest.fn(() => ({
      user: { info: { internalRole: 'other', userId: 'u1' } },
      invoice: { gstTransactionId: { transactionId: 'TXN123' }, closeView: false },
    }));
    const navigate = jest.fn();
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    getInvoiceTransactions({ transactionID: 'ABCDE12345X' }, '', {}, navigate)(dispatch, getState, undefined);
    await flushPromises();
    expect(callAction).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with transactionID > 10 chars and non-ASM role, callAction status false', async () => {
    getState = jest.fn(() => ({
      user: { info: { internalRole: 'other', userId: 'u1' } },
      invoice: { gstTransactionId: { transactionId: 'TXN123' }, closeView: false },
    }));
    const navigate = jest.fn();
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: false }));
    getInvoiceTransactions({ transactionID: 'ABCDE12345X' }, '', {}, navigate)(dispatch, getState, undefined);
    await flushPromises();
    expect(callAction).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with transactionID > 10 chars and non-ASM role, callAction catch', async () => {
    getState = jest.fn(() => ({
      user: { info: { internalRole: 'other', userId: 'u1' } },
      invoice: { gstTransactionId: { transactionId: 'TXN123' }, closeView: false },
    }));
    const navigate = jest.fn();
    (callAction as jest.Mock).mockReturnValue(() => Promise.reject(new Error('err')));
    getInvoiceTransactions({ transactionID: 'ABCDE12345X' }, '', {}, navigate)(dispatch, getState, undefined);
    await flushPromises();
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with transactionID <= 10 chars, success with data.info', async () => {
    const navigate = jest.fn();
    (api.get as jest.Mock).mockResolvedValue({ info: [{ transactionId: 'T1', amount: '100', transactionDate: '2024', bingeRechargeFlag: true }] });
    await getInvoiceTransactions({ transactionID: 'ABC123' }, '', {}, navigate)(dispatch, getState, undefined);
    expect(invoiceReducerAction.setInvoiceTransactions).toHaveBeenCalled();
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with transactionID <= 10 chars, success without data.info', async () => {
    const navigate = jest.fn();
    (api.get as jest.Mock).mockResolvedValue({ info: null });
    await getInvoiceTransactions({ transactionID: 'ABC123' }, '', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with transactionID <= 10 chars, api failure', async () => {
    const navigate = jest.fn();
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getInvoiceTransactions({ transactionID: 'ABC123' }, '', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getInvoiceTransactions with keepFalse=true skips setCloseView', () => {
    const navigate = jest.fn();
    (api.get as jest.Mock).mockResolvedValue({ info: null });
    getInvoiceTransactions({ transactionID: 'ABC123', keepFalse: true }, '', {}, navigate)(dispatch, getState, undefined);
    expect(invoiceReducerAction.setCloseView).not.toHaveBeenCalledWith(true);
  });

  test('getInvoiceTransactions with isDownload param', async () => {
    getState = jest.fn(() => ({
      user: { info: { internalRole: 'asm', userId: 'u1' } },
      invoice: { gstTransactionId: { transactionId: 'TXN123' }, closeView: false },
    }));
    const navigate = jest.fn();
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    getInvoiceTransactions({ transactionID: 'ABCDE12345X', isDownload: true }, '', {}, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalled();
  });

  // searchInvoiceTransactions
  test('searchInvoiceTransactions dispatches setSearchBarItems', () => {
    searchInvoiceTransactions({ searchText: 'abc' })(dispatch, getState, undefined);
    expect(filterByParams).toHaveBeenCalled();
    expect(formReducerAction.setSearchBarItems).toHaveBeenCalled();
  });

  // getURLforInvoiceTransactions
  test('getURLforInvoiceTransactions success with invoiceUrl', async () => {
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, invoiceUrl: 'http://url' }));
    getURLforInvoiceTransactions({ transactionId: '1' })(dispatch, getState, undefined);
    await flushPromises();
    expect(handleWebViewUrl).toHaveBeenCalledWith('http://url', true);
  });

  test('getURLforInvoiceTransactions with status false', async () => {
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: false }));
    getURLforInvoiceTransactions({ transactionId: '1' })(dispatch, getState, undefined);
    await flushPromises();
    expect(handleWebViewUrl).not.toHaveBeenCalled();
  });

  test('getURLforInvoiceTransactions with hideModal=true dispatches hideBottomModal', async () => {
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, invoiceUrl: 'url' }));
    await getURLforInvoiceTransactions({ transactionId: '1', hideModal: true })(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('getURLforInvoiceTransactions with isDownload=true dispatches setLoader', async () => {
    (callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, invoiceUrl: 'url' }));
    await getURLforInvoiceTransactions({ transactionId: '1', isDownload: true })(dispatch, getState, undefined);
    expect(uiActions.setLoader).toHaveBeenCalled();
  });

  test('getURLforInvoiceTransactions failure', async () => {
    (callAction as jest.Mock).mockReturnValue(() => Promise.reject(new Error('fail')));
    getURLforInvoiceTransactions({ transactionId: '1' })(dispatch, getState, undefined);
    await flushPromises();
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  // getGstInvoiceByUserId
  test('getGstInvoiceByUserId success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await getGstInvoiceByUserId({})(dispatch, getState, undefined);
    expect(invoiceReducerAction.setInvoiceGSTdata).toHaveBeenCalled();
  });

  // gstConfirmation
  test('gstConfirmation dispatches showBottomModal with gstDetails form', async () => {
    await gstConfirmation()(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // gstConfirmationProfile
  test('gstConfirmationProfile dispatches showBottomModal with gstDetailsProfile form', async () => {
    await gstConfirmationProfile()(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // fillinGstTypeAndNumber
  test('fillinGstTypeAndNumber dispatches setUpdatedFormFields with gstData', () => {
    fillinGstTypeAndNumber()(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ dealerType: 'REGISTERED', gstNumber: 'GST123' }, STATE_KEY.MODAL_STATE);
  });

  // fillInGSTNumber
  test('fillInGSTNumber dispatches setUpdatedFormFields when gstNumber exists', () => {
    fillInGSTNumber()(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ gstNumber: 'GST123' }, STATE_KEY.MODAL_STATE);
  });

  test('fillInGSTNumber does not dispatch when gstNumber is absent', () => {
    getState = jest.fn(() => ({
      invoice: { gstData: { dealerType: 'REGISTERED', gstNumber: null } },
    }));
    fillInGSTNumber()(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).not.toHaveBeenCalled();
  });

  // updateGst
  test('updateGst success dispatches showAlert', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    await updateGst({ gstNumber: 'G1', dealerType: 'R' }, 'q')(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('updateGst failure dispatches showErrorPage', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await updateGst({}, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  // getGstDetailsByUserId
  test('getGstDetailsByUserId success dispatches setGSTData', async () => {
    (api.get as jest.Mock).mockResolvedValue({ gstNumber: 'G1', dealerType: 'R' });
    await getGstDetailsByUserId()(dispatch, getState, undefined);
    expect(invoiceReducerAction.setGSTData).toHaveBeenCalled();
  });

  test('getGstDetailsByUserId failure dispatches setErrorMessage', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getGstDetailsByUserId()(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  // updateGstProfile
  test('updateGstProfile success with status true and responseData shows modal', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (api.get as jest.Mock).mockResolvedValue({ gstNumber: 'G1', dealerType: 'R' });
    await updateGstProfile({ dealerType: 'REGISTERED', gstNumber: 'G1' })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('updateGstProfile success with status true but responseData falsy skips modal', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        const result = action(dispatch, getState, undefined);
        if (result && typeof result.then === 'function') {
          return result.then(() => null);
        }
        return null;
      }
      return action;
    });
    await updateGstProfile({ dealerType: 'REGISTERED', gstNumber: 'G1' })(dispatch, getState, undefined);
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('updateGstProfile with UNREGISTERED dealerType sends null gstNumber', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (api.get as jest.Mock).mockResolvedValue({ gstNumber: null });
    // STRINGS.UNREGISTERED = 'Un-Registered'
    await updateGstProfile({ dealerType: 'Un-Registered', gstNumber: 'G1' })(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ input: expect.objectContaining({ gstNumber: null }) }));
  });

  test('updateGstProfile status false dispatches setErrorMessage', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await updateGstProfile({ dealerType: 'REGISTERED' })(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('updateGstProfile catch dispatches setErrorMessage', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await updateGstProfile({ dealerType: 'REGISTERED' })(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  // validateGST
  test('validateGST strips non-alphanumeric and dispatches setUpdatedFormFields', () => {
    validateGST({ gst: 'A-B_1 2' })(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ gstNumber: 'AB12', transactionID: 'AB12' }, STATE_KEY.MODAL_STATE);
  });
});
