/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
// Standard Mocking Pattern - MUST BE HOISTED
import { api } from 'services/apolloClient';
import { storageService } from 'services/storageService';
import { getFullLanguageName } from 'utils/languageHelper';
import * as actions from './redirection.action';

jest.mock('store/sales/reducer/redirection', () => ({
  sliceActions: {
    setVerifyTokenData: jest.fn((v) => ({ type: 'RED_SET_TOKEN', payload: v })),
  },
}));

jest.mock('store/sales/reducer/user', () => ({
  sliceActions: {
    loginSuccess: jest.fn((v) => ({ type: 'USER_LOGIN_SUCCESS', payload: v })),
  },
}));

jest.mock('store/sales/actions/user', () => ({
  __esModule: true,
  default: {
    getAsmCsmMobileName: jest.fn(() => ({ type: 'USER_GET_ASM_CSM' })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
    clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
    showErrorPage: jest.fn((m) => ({ type: 'UI_SHOW_ERROR', payload: m })),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: { post: jest.fn() },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('utils/sessionHelper', () => ({
  removeItem: jest.fn(),
  setToken: jest.fn(),
}));

jest.mock('services/storageService', () => ({
  storageService: { setItem: jest.fn() },
}));

jest.mock('utils/languageHelper', () => ({
  getFullLanguageName: jest.fn((v) => v),
}));

jest.mock('utils/externalAppLinkHelper', () => ({
  openBrowser: jest.fn((v) => ({ type: 'OPEN_BROWSER', payload: v })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    registerUser: jest.fn(),
    trackEvent: jest.fn(),
  },
}));

jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    STRINGS: {
      ...actual.STRINGS,
      REDIRECTION_TOKEN: 'REDIRECTION_TOKEN',
      BANGLA: 'BANGLA',
      BENGALI: 'BENGALI',
      ODIA: 'ODIA',
      ORIYA: 'ORIYA',
      LANG: 'LANG',
      INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    },
    PROPERTIES: { ...actual.PROPERTIES, ROLES: { asi: 'ASI', csm: 'CSM' } },
  };
});

describe('redirection actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch, getState, undefined);
      return action;
    });
  });

  test('verifyToken success with BANGLA lang', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (getFullLanguageName as jest.Mock).mockReturnValue('BANGLA');
    const user = { internalRole: 'ASI', accessToken: 'A', refreshToken: 'R', navigation: [] };
    (require('utils/responseHelper').refactorResponse as jest.Mock).mockReturnValue({
      user,
      redirectionInfo: { language: 'BN' },
    });

    await actions.verifyToken({})(dispatch, getState, undefined);
    expect(storageService.setItem).toHaveBeenCalledWith('LANG', 'BENGALI');
  });

  test('verifyToken success with ODIA lang', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (getFullLanguageName as jest.Mock).mockReturnValue('ODIA');
    (require('utils/responseHelper').refactorResponse as jest.Mock).mockReturnValue({
      user: { internalRole: 'CSM' },
      redirectionInfo: { language: 'OD' },
    });

    await actions.verifyToken({})(dispatch, getState, undefined);
    expect(storageService.setItem).toHaveBeenCalledWith('LANG', 'ORIYA');
  });

  test('verifyToken success with default lang', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (getFullLanguageName as jest.Mock).mockReturnValue('English');
    (require('utils/responseHelper').refactorResponse as jest.Mock).mockReturnValue({
      user: { internalRole: 'OTHER' },
      redirectionInfo: { language: 'EN' },
    });

    await actions.verifyToken({})(dispatch, getState, undefined);
    expect(storageService.setItem).toHaveBeenCalledWith('LANG', 'English');
  });

  test('verifyToken fail processedResponse null', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (require('utils/responseHelper').refactorResponse as jest.Mock).mockReturnValue(null);
    await actions.verifyToken({})(dispatch, getState, undefined);
    const uiActions = require('store/sales/actions/ui').default;
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getSSORedirectionToken success with token', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (require('utils/responseHelper').refactorResponse as jest.Mock).mockReturnValue({ data: { token: 'T1' } });
    await actions.getSSORedirectionToken({ externalUrl: 'URL/', moduleName: 'M1' })(dispatch, getState, undefined);
    const { openBrowser } = require('utils/externalAppLinkHelper');
    expect(openBrowser).toHaveBeenCalledWith('URL/T1');
  });

  test('getSSORedirectionToken success without token', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    (require('utils/responseHelper').refactorResponse as jest.Mock).mockReturnValue({ data: { token: null } });
    const result = await actions.getSSORedirectionToken({ externalUrl: 'URL/', moduleName: 'M1' })(dispatch, getState, undefined);
    expect(result.status).toBe(true);
  });

  test('error paths catch blocks', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await actions.verifyToken({})(dispatch, getState, undefined);
    await actions.getSSORedirectionToken({})(dispatch, getState, undefined);
  });
});
