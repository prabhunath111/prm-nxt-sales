import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/modifyPack';
import { api } from 'services/apolloClient';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { storageService } from 'services/storageService';
import { callAction } from 'utils/formBuilderHelper';
import { STRINGS, ROUTE } from 'const';
import {
  modifyPackModal,
  getPackSelectorInfo,
  getSubEntitlement,
  manageAppsModal,
  manageAppsModalBack,
  getBposDetailsDirectFromFE,
  checkRmnInComvivaOrDth,
  sendOTPToSubscriber,
  validateOTPManageApps,
  checkDTHInfoManageApp,
} from './modifyPack.action';

jest.mock('store/sales/reducer/modifyPack', () => ({
  sliceActions: {
    setPackSelectorAccountInfo: jest.fn(),
    setManageAppsRMN: jest.fn(),
    setManageAppsUserRole: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn(),
    hideBottomModal: jest.fn(),
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    setModalLoader: jest.fn(),
    showAlert: jest.fn(),
    showErrorPage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setErrorMessage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setSubIdList: jest.fn(),
    setDealerDetails: jest.fn(),
    setUpdatedFormFields: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('services/storageService', () => ({
  storageService: { getItem: jest.fn() },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => () => Promise.resolve({ status: true })),
}));

jest.mock('utils/navigationHelper', () => ({
  isValidRedirectUrl: jest.fn(() => true),
}));

jest.mock('utils/languageHelper', () => ({
  getRedirectionLangPayload: jest.fn((lang) => lang),
}));

jest.mock('utils/platformHelper', () => ({
  isWeb: false,
  isAndroid: jest.fn(() => false),
  isiOS: jest.fn(() => false),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    ModifyPack: {
      ModifyPackPageVisit: {
        moduleName: 'mod',
        attributes: { Status: 'Status' },
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

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn(), error: jest.fn() },
}));

describe('modifyPack actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => ({
      user: { info: { mdn: '123', userId: 'u1' } },
      modifyPack: { manageAppsRMN: '9876543210', userRole: 'dealer' },
      ui: { bottomModal: { isModalVisible: true } },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        const result = action(dispatch, getState, undefined);
        if (result && typeof result.then === 'function') return result;
        return result;
      }
      return action;
    });
  });

  // modifyPackModal
  test('modifyPackModal dispatches showBottomModal', () => {
    modifyPackModal({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // getPackSelectorInfo
  test('getPackSelectorInfo with subId calls callAction', async () => {
    (storageService.getItem as jest.Mock).mockResolvedValue('en');
    (api.get as jest.Mock).mockResolvedValue({ subId: 's1' });
    await getPackSelectorInfo({ subscriberId: '1234567890', packSelectorAccountInfo: [] }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalled();
  });

  test('getPackSelectorInfo with subIdList shows modal', async () => {
    (storageService.getItem as jest.Mock).mockResolvedValue('en');
    (api.get as jest.Mock).mockResolvedValue({ subIdList: [{ subId: 's1' }] });
    await getPackSelectorInfo({ subscriberId: '1234567890', packSelectorAccountInfo: [] }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(formActions.setSubIdList).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('getPackSelectorInfo with neither subId nor subIdList navigates', async () => {
    (storageService.getItem as jest.Mock).mockResolvedValue('en');
    (api.get as jest.Mock).mockResolvedValue({ subscriberId: 's1', subscriberName: 'name', rmn: '123' });
    await getPackSelectorInfo({ subscriberId: '1234567890', packSelectorAccountInfo: [] }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(formActions.setDealerDetails).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.MODIFYPACK_ACCOUNT_DETAILS);
  });

  test('getPackSelectorInfo with RMN (firstDigit >= 6) uses accountInformation query', async () => {
    (storageService.getItem as jest.Mock).mockResolvedValue('en');
    (api.get as jest.Mock).mockResolvedValue({ subscriberId: 's1', subscriberName: 'name', rmn: '123' });
    await getPackSelectorInfo({ subscriberId: '9876543210', packSelectorAccountInfo: [] }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(api.get).toHaveBeenCalled();
  });

  test('getPackSelectorInfo with multiSubId fallback', async () => {
    (storageService.getItem as jest.Mock).mockResolvedValue('en');
    (api.get as jest.Mock).mockResolvedValue({ subId: 's1' });
    await getPackSelectorInfo({ multiSubId: '1234567890', packSelectorAccountInfo: [] }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(api.get).toHaveBeenCalled();
  });

  test('getPackSelectorInfo catch dispatches setErrorMessage', async () => {
    (storageService.getItem as jest.Mock).mockResolvedValue('en');
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getPackSelectorInfo({ subscriberId: '1234567890', packSelectorAccountInfo: [] }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getPackSelectorInfo uses default lang when storage returns null', async () => {
    (storageService.getItem as jest.Mock).mockResolvedValue(null);
    (api.get as jest.Mock).mockResolvedValue({ subId: 's1' });
    await getPackSelectorInfo({ subscriberId: '1234567890', packSelectorAccountInfo: [] }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(api.get).toHaveBeenCalled();
  });

  // getSubEntitlement
  test('getSubEntitlement success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    const result = await getSubEntitlement('123')(dispatch, getState, undefined);
    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(result.status).toBe(true);
  });

  test('getSubEntitlement catch dispatches setErrorMessage', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getSubEntitlement('123')(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  // manageAppsModal
  test('manageAppsModal dispatches setManageAppsRMN and showBottomModal', () => {
    manageAppsModal({})(dispatch, getState, undefined);
    expect(sliceActions.setManageAppsRMN).toHaveBeenCalledWith('');
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // manageAppsModalBack
  test('manageAppsModalBack dispatches showBottomModal', () => {
    manageAppsModalBack({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // getBposDetailsDirectFromFE
  test('getBposDetailsDirectFromFE success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ newRole: 'admin' });
    const result = await getBposDetailsDirectFromFE({})(dispatch, getState, undefined);
    expect(sliceActions.setManageAppsUserRole).toHaveBeenCalled();
    expect(result.status).toBe(true);
  });

  test('getBposDetailsDirectFromFE catch dispatches setErrorMessage', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    const result = await getBposDetailsDirectFromFE({})(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
    expect(result.status).toBe(false);
  });

  // checkRmnInComvivaOrDth
  test('checkRmnInComvivaOrDth with returnUrl calls openReturnUrl', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, returnUrl: 'https://url.com', accessToken: 'token' });
    await checkRmnInComvivaOrDth({ manageAppMobile: '123' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setManageAppsRMN).toHaveBeenCalled();
  });

  test('checkRmnInComvivaOrDth with MULTIPLE_RMN shows modal', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, transMessage: STRINGS.MULTIPLE_RMN, subIdList: [{ subId: 's1' }] });
    await checkRmnInComvivaOrDth({ manageAppMobile: '123' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(formActions.setSubIdList).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('checkRmnInComvivaOrDth with otpRequest YES shows alert', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, otpRequest: STRINGS.YES });
    await checkRmnInComvivaOrDth({ manageAppMobile: '123' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('checkRmnInComvivaOrDth with no returnUrl and no otpRequest shows error', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, message: 'error' });
    await checkRmnInComvivaOrDth({ manageAppMobile: '123' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('checkRmnInComvivaOrDth with status false dispatches setErrorMessage', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'error' });
    await checkRmnInComvivaOrDth({ manageAppMobile: '123' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('checkRmnInComvivaOrDth catch dispatches setErrorMessage', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await checkRmnInComvivaOrDth({ manageAppMobile: '123' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  // sendOTPToSubscriber
  test('sendOTPToSubscriber catch with modal visible dispatches setErrorMessage', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await sendOTPToSubscriber({ mobile: '123' })(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('sendOTPToSubscriber catch with modal not visible shows error page', async () => {
    getState = jest.fn(() => ({
      user: { info: { mdn: '123', userId: 'u1' } },
      modifyPack: { manageAppsRMN: '9876543210', userRole: 'dealer' },
      ui: { bottomModal: { isModalVisible: false } },
    }));
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await sendOTPToSubscriber({ mobile: '123' })(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  // validateOTPManageApps
  test('validateOTPManageApps success shows alert', async () => {
    (api.post as jest.Mock).mockResolvedValue({ linkmessage: 'success' });
    const result = await validateOTPManageApps({ otp: '1234', mdn: '123' }, 'q', {})(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
    expect(result.status).toBe(true);
  });

  test('validateOTPManageApps catch returns status false', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    const result = await validateOTPManageApps({ otp: '1234', mdn: '123' }, 'q', {})(dispatch, getState, undefined);
    expect(result.status).toBe(false);
  });

  // checkDTHInfoManageApp
  test('checkDTHInfoManageApp success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ info: 'data' });
    const result = await checkDTHInfoManageApp({ multiSubId: 's1' }, 'q', {})(dispatch, getState, undefined);
    expect(result.status).toBe(true);
  });

  test('checkDTHInfoManageApp catch dispatches setErrorMessage', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    const result = await checkDTHInfoManageApp({ multiSubId: 's1' }, 'q', {})(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
    expect(result.status).toBe(false);
  });
});
