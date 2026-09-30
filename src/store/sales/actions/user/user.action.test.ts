/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/user';
import { api } from 'services/apolloClient';
import sessionStorageService from 'services/storageService/sessionStorage';
import { realmServices } from 'services/storageService';
import commonActions from 'store/sales/actions/common';
import {
  doLogin,
  doLogout,
  doRefreshToken,
  getAsmCsmMobileName,
  resetExpiry,
  loginWithOtp,
  loginOtpVerification,
  handleRefreshToken,
  setUserDetails,
  checkMultipleLogins,
  loginWithLocalAuth,
  updateLocalAuthStatus,
  addNavigation,
} from './user.action';

// Test constants - placeholder credentials for testing only
const TEST_USERNAME = 'testuser';
const TEST_PASSWORD = 'testpassword';

let mockIsWeb = true;

jest.mock('store/sales/reducer/user', () => ({
  sliceActions: {
    loginSuccess: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    getAsmCsmMobileName: jest.fn(),
    resetExpiry: jest.fn(),
    handleUserDetails: jest.fn(),
    setLocalAuthentication: jest.fn(),
    setLocalAuthStatus: jest.fn(),
    handleNavigationDetails: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/evdBalanceInfo', () => ({
  sliceActions: {
    setDealerBalanceInput: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    showErrorPage: jest.fn(),
    hideBottomModal: jest.fn(),
    showAlert: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    reSetErrorMessage: jest.fn(),
    setErrorMessage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/fetchLanguage', () => ({
  __esModule: true,
  default: {
    fetchLanguageAction: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    registerUser: jest.fn(),
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/storageService/sessionStorage', () => ({
  setItem: jest.fn(),
}));

jest.mock('services/storageService', () => ({
  realmServices: {
    getTokens: jest.fn(() => Promise.resolve({ userId: 'u1' })),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('utils/sessionHelper', () => ({
  setToken: jest.fn(),
}));

jest.mock('utils/platformHelper', () => ({
  getDeviceID: jest.fn(() => Promise.resolve('dev123')),
  get isWeb() {
    return mockIsWeb;
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('const', () => ({
  PROPERTIES: { ROLES: { asi: 'asi', csm: 'csm' } },
  STRINGS: { ACCESS_TOKEN: 'at', REFRESH_TOKEN: 'rt' },
  ALERT: { ERROR: 'ERROR', SUCCESS: 'SUCCESS' },
  MODAL: { OK: 'OK' },
  STATE_KEY: { FORM_STATE: 'form', MODAL_STATE: 'modal' },
  CHILD_TYPE: { DYNAMIC_FORM: 'DYNAMIC_FORM' },
  HEADER_TITLE: { CONFIGURE: 'CONFIGURE' },
  FORMS: { filterTsraInventory: 'filterTsraInventory', woRecreation: 'woRecreation' },
  ICONS: { WORK_ORDER: 'WORK_ORDER' },
  QUERY: {
    DoPickPackAndWorkOrderCreationPrimaryAndSecondary: 'DoPickPackAndWorkOrderCreationPrimaryAndSecondary',
    WoRechargeDetails: 'WoRechargeDetails',
    GET_ALL_FORMS: 'GET_ALL_FORMS',
    GET_ALL_PATH: 'GET_ALL_PATH',
    GET_ALL_ROLES: 'GET_ALL_ROLES',
  },
}));

describe('user actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsWeb = true;
    (api.post as jest.Mock).mockImplementation(() => Promise.resolve({}));
    getState = jest.fn(() => ({
      user: { info: { userId: 'u1' }, userDetails: { mdn: '123' } },
      login: { userDetails: { userName: 'u1' } },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('doLogin success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await doLogin({ userName: TEST_USERNAME, password: TEST_PASSWORD, isPrmLogin: true })(dispatch, getState, undefined);
    expect(sliceActions.loginSuccess).toHaveBeenCalled();
  });

  test('doLogin status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await doLogin({ userName: TEST_USERNAME, password: TEST_PASSWORD, isPrmLogin: true })(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('err');
  });

  test('doLogin failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await doLogin({ userName: TEST_USERNAME, password: TEST_PASSWORD, isPrmLogin: true })(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('doLogout', async () => {
    await doLogout()(dispatch, getState, undefined);
    expect(sliceActions.logout).toHaveBeenCalled();
  });

  test('doLogout catch deviceId error', async () => {
    const platformHelper = require('utils/platformHelper');
    (platformHelper.getDeviceID as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await doLogout()(dispatch, getState, undefined);
    expect(sliceActions.logout).toHaveBeenCalled();
  });

  test('doRefreshToken', async () => {
    await doRefreshToken()(dispatch, getState, undefined);
    expect(sliceActions.refreshToken).toHaveBeenCalled();
  });

  test('doRefreshToken failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await doRefreshToken()(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getAsmCsmMobileName failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getAsmCsmMobileName()(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('resetExpiry', () => {
    resetExpiry()(dispatch, getState, undefined);
    expect(sliceActions.resetExpiry).toHaveBeenCalled();
  });

  test('loginWithOtp success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await loginWithOtp({})(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('loginWithOtp status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await loginWithOtp({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('err');
  });

  test('loginWithOtp failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await loginWithOtp({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('loginOtpVerification success web and role', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, internalRoleNT: 'asi' });
    mockIsWeb = true;
    await loginOtpVerification({})(dispatch, getState, undefined);
    expect(sessionStorageService.setItem).toHaveBeenCalled();
  });

  test('loginOtpVerification status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await loginOtpVerification({})(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('err');
  });

  test('loginOtpVerification login status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, login: { status: false, message: 'login err' } });
    await loginOtpVerification({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('login err');
  });

  test('loginOtpVerification failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await loginOtpVerification({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('handleRefreshToken success mobile', async () => {
    mockIsWeb = false;
    getState.mockReturnValue({ user: { info: {} } });
    await handleRefreshToken()(dispatch, getState, undefined);
    expect(realmServices.getTokens).toHaveBeenCalled();
  });

  test('handleRefreshToken success web', async () => {
    mockIsWeb = true;
    await handleRefreshToken()(dispatch, getState, undefined);
    expect(sessionStorageService.setItem).toHaveBeenCalled();
  });

  test('handleRefreshToken failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await handleRefreshToken()(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('setUserDetails', () => {
    setUserDetails({})(dispatch, getState, undefined);
    expect(sliceActions.handleUserDetails).toHaveBeenCalled();
  });

  test('checkMultipleLogins success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    const res = await checkMultipleLogins()(dispatch, getState, undefined);
    expect(res.status).toBe(true);
  });

  test('checkMultipleLogins success mobile', async () => {
    mockIsWeb = false;
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    const res = await checkMultipleLogins()(dispatch, getState, undefined);
    expect(res.status).toBe(true);
  });

  test('checkMultipleLogins failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const res = await checkMultipleLogins()(dispatch, getState, undefined);
    expect(res.status).toBe(false);
  });

  test('loginWithLocalAuth success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await loginWithLocalAuth()(dispatch, getState, undefined);
    expect(sliceActions.setLocalAuthentication).toHaveBeenCalled();
  });

  test('loginWithLocalAuth failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await loginWithLocalAuth()(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('updateLocalAuthStatus', () => {
    updateLocalAuthStatus(true)(dispatch, getState, undefined);
    expect(sliceActions.setLocalAuthStatus).toHaveBeenCalledWith(true);
  });

  test('addNavigation', () => {
    addNavigation({ menus: [], routes: [], dashboard: [] })(dispatch, getState, undefined);
    expect(sliceActions.handleNavigationDetails).toHaveBeenCalled();
  });
});
