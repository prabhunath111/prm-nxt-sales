import uiActions from 'store/sales/actions/ui';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { generateOTPWithOutSubId, resetEVDPin, resetEVDPinForPartner, searchPartner } from './resetEvdPin.action';

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn(),
    showAlert: jest.fn(),
    showErrorPage: jest.fn(),
    clearLoader: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDropdownData: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    resetEVDPin: {
      resetEVDPin_ForSelf: { moduleName: 'm1', attributes: { Status: 's1' } },
      resetEVDPin_ForPartner: { moduleName: 'm2', attributes: { Status: 's1', partnerMdn: 'p1' } },
    },
  },
}));

jest.mock(
  'store/sales/query/resetEvdPin',
  () =>
    new Proxy(
      {},
      {
        get: (_, property) => property,
      },
    ),
);

jest.mock('const', () => ({
  PROPERTIES: {
    RESET_EVD: {
      SUCCESS: 'SUCCESS',
      SELF: 'SELF',
      PARTNER: 'PARTNER',
      oldPinLabel: 'old',
      RESET_SUCCESS: [],
    },
  },
  ALERT: { SUCCESS: 'SUCCESS' },
  CHILD_TYPE: { OTP_MODAL: 'OTP_MODAL', INFO_TEXT_WITH_DATA: 'INFO_TEXT_WITH_DATA' },
  MODAL: { OK: 'OK', OK_GOT_IT: 'OK_GOT_IT' },
  QUERY: { ResetEVDPin: 'ResetEVDPin' },
  ROUTE: { WEB: { CHANGE_EVD_PIN: 'CHANGE_EVD_PIN' } },
  STRINGS: { PROCEED: 'PROCEED', SENTTORMN: 'SENTTORMN' },
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn() },
}));

describe('resetEvdPin actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn().mockReturnValue({
      user: { info: { mdn: '123' } },
    });
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('generateOTPWithOutSubId success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ transStatusNT: 'SUCCESS' });

    await generateOTPWithOutSubId({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('generateOTPWithOutSubId failure status', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ transStatusNT: 'FAIL', message: 'Error' });

    await generateOTPWithOutSubId({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalledWith('Error', 'SUCCESS', expect.any(Object), {});
  });

  test('generateOTPWithOutSubId catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    await generateOTPWithOutSubId({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('resetEVDPin success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ status: true, message: 'Reset' });

    const result = await resetEVDPin({ otp: '1234' }, 'query')(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(uiActions.showAlert).toHaveBeenCalled();
    expect(result.status).toBe(true);
  });

  test('resetEVDPin failure status', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ status: false, message: 'Reset fail' });

    const result = await resetEVDPin({ otp: '1234' }, 'query')(dispatch, getState, undefined);

    expect(result.status).toBe(true);
    expect(uiActions.showAlert).not.toHaveBeenCalled();
  });

  test('resetEVDPin catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    const result = await resetEVDPin({}, 'query')(dispatch, getState, undefined);

    expect(result.status).toBe(false);
  });

  test('resetEVDPinForPartner success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ status: true, message: 'Reset' });

    await resetEVDPinForPartner({ selectPartner: { mdn: '123' } }, 'query')(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('resetEVDPinForPartner success missing partner mdn', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ status: true, message: 'Reset' });

    await resetEVDPinForPartner({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('resetEVDPinForPartner fail in data', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ status: false, message: 'Fail' });

    await resetEVDPinForPartner({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('Fail');
  });

  test('resetEVDPinForPartner catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    await resetEVDPinForPartner({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('searchPartner success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ info: [1, 2] });

    const result = await searchPartner({ searchText: 'abc' }, 'query')(dispatch, getState, undefined);

    expect(formAction.setDropdownData).toHaveBeenCalledWith({ data: [1, 2], queryName: 'query' });
    expect(result.data).toEqual([1, 2]);
  });

  test('searchPartner catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    const result = await searchPartner({}, 'query')(dispatch, getState, undefined);

    expect(formAction.setDropdownData).toHaveBeenCalledWith({ data: [], queryName: 'query' });
    expect(result.status).toBe(false);
  });
});
