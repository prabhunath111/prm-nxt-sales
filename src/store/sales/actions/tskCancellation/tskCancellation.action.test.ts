import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { sliceActions as tskCancellationActions } from 'store/sales/reducer/tskCancellation';
import {
  tskCancellationModal,
  validateTskCancellationModal,
  validateTskPinForCancellation,
  getCancellationTskData,
  confirmCancelTSK,
  cancelTskPin,
} from './tskCancellation.action';

jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(),
  showBottomModal: jest.fn(),
  setModalLoader: jest.fn(),
  clearLoader: jest.fn(),
  showAlert: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setUpdatedFormFields: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('i18next', () => ({
  t: jest.fn((k) => k),
}));

jest.mock('store/sales/reducer/tskCancellation', () => ({
  sliceActions: {
    setCancelTskValidateData: jest.fn(),
  },
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

jest.mock('const', () => ({
  CHILD_TYPE: { DYNAMIC_FORM: 'DYNAMIC_FORM', REGISTRATION_SALES_NEXT_FORM: 'REGISTRATION_SALES_NEXT_FORM', LABEl: 'LABEl' },
  HEADER_TITLE: { PHYSICAL_TSK_CANCELLATION: 'PHYSICAL_TSK_CANCELLATION' },
  FORMS: { tskCancellation: 'tskCancellation', validateTskCancellation: 'validateTskCancellation' },
  ICONS: { TSK_REFUND: 'TSK_REFUND' },
  QUERY: { TskCancellationModal: 'TskCancellationModal', CancelTskPin: 'CancelTskPin' },
  ALERT: { CONFIRM: 'CONFIRM' },
  MODAL: { YES: 'YES', NO: 'NO', OK: 'OK' },
  ROUTE: { WEB: { TSK_CANCELLATION: 'TSK_CANCELLATION' } },
  STATE_KEY: { FORM_STATE: 'FORM_STATE' },
  STRINGS: { APOLLO_ERROR: 'ApolloError' },
}));

describe('tskCancellation actions', () => {
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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('tskCancellationModal', () => {
    tskCancellationModal({ showCloseIcon: true })(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        formName: 'tskCancellation',
        showCloseIcon: true,
      }),
    );
  });

  test('tskCancellationModal default showCloseIcon', () => {
    tskCancellationModal({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        showCloseIcon: true,
      }),
    );
  });

  test('tskCancellationModal with showCloseIcon: false', () => {
    tskCancellationModal({ showCloseIcon: false })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        showCloseIcon: true, // result of false || true
      }),
    );
  });

  test('validateTskCancellationModal', () => {
    validateTskCancellationModal({ showCloseIcon: true })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        formName: 'validateTskCancellation',
      }),
    );

    // Test onClose callback
    const onShowCall = (uiActions.showBottomModal as jest.Mock).mock.calls[0][0];
    onShowCall.onClose();
    expect(dispatch).toHaveBeenCalled();
  });

  test('validateTskCancellationModal with showCloseIcon: false', () => {
    validateTskCancellationModal({ showCloseIcon: false })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        showCloseIcon: true,
      }),
    );
  });

  test('validateTskPinForCancellation success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ status: true, result: { tskSerialNumber: '123' } });

    await validateTskPinForCancellation({ cancellationTskPin: '1111' })(dispatch, getState, undefined);

    expect(uiActions.setModalLoader).toHaveBeenCalled();
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(tskCancellationActions.setCancelTskValidateData).toHaveBeenCalledWith({
      tskSerialNumber: '123',
      tskPin: '1111',
    });
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('validateTskPinForCancellation failure', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false });
    (refactorResponse as jest.Mock).mockReturnValue({ status: false, message: 'Invalid PIN' });

    const result = await validateTskPinForCancellation({ cancellationTskPin: '1111' })(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('Invalid PIN');
    expect(result.status).toBe(false);
  });

  test('validateTskPinForCancellation error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await validateTskPinForCancellation({ cancellationTskPin: '1111' })(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('Network error');
    expect(result.status).toBe(false);
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('getCancellationTskData', () => {
    getState.mockReturnValue({
      tskCancellation: {
        cancelTskValidateData: {
          tskType: 'Physical',
          tskSerialNumber: '123',
          price: 100,
        },
      },
    });

    getCancellationTskData()(dispatch, getState, undefined);

    jest.advanceTimersByTime(400);

    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith(
      {
        cancellationTskType: 'Physical',
        cancellationSerialNum: '123',
        cancellationTskPrice: 100,
      },
      'FORM_STATE',
    );
  });

  test('confirmCancelTSK', () => {
    confirmCancelTSK()(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalledWith('alertMessages.disclaimerCancelTSK', 'CONFIRM', expect.any(Object), {});
  });

  test('cancelTskPin success', async () => {
    getState.mockReturnValue({
      tskCancellation: {
        cancelTskValidateData: {
          tskSerialNumber: '123',
          tskPin: '1111',
        },
      },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ status: true, message: 'Success' });

    const result = await cancelTskPin()(dispatch, getState, undefined);

    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonInfo: expect.objectContaining({
          routeName: 'TSK_CANCELLATION',
        }),
      }),
    );
    expect(result.status).toBe(true);
  });

  test('cancelTskPin API failure (status false)', async () => {
    getState.mockReturnValue({
      tskCancellation: {
        cancelTskValidateData: {
          tskSerialNumber: '123',
          tskPin: '1111',
        },
      },
    });
    (api.post as jest.Mock).mockResolvedValue({ status: false });
    (refactorResponse as jest.Mock).mockReturnValue({ status: false, message: 'Pin expired' });

    const result = await cancelTskPin()(dispatch, getState, undefined);

    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonInfo: expect.objectContaining({
          childData: 'Pin expired',
        }),
      }),
    );
    expect(result.status).toBe(false);
  });

  test('cancelTskPin catch error', async () => {
    getState.mockReturnValue({
      tskCancellation: {
        cancelTskValidateData: {
          tskSerialNumber: '123',
          tskPin: '1111',
        },
      },
    });
    (api.post as jest.Mock).mockRejectedValue({ message: 'ApolloError: Something went wrong' });

    const result = await cancelTskPin()(dispatch, getState, undefined);

    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonInfo: expect.objectContaining({
          childData: ' Something went wrong',
        }),
      }),
    );
    expect(result.status).toBe(false);
  });
});
