import { sliceActions } from 'store/sales/reducer/user';
import { realmServices, storageService } from 'services/storageService';
import { logout as adLogout } from 'Auth';

import uiActions from 'store/sales/actions/ui';
import { sliceActions as evdBalanceActions } from 'store/sales/reducer/evdBalanceInfo';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { authType, LoginInput } from 'store/sales/types/user';
import { refactorResponse } from 'utils/responseHelper';
import { setToken, resetUserSession } from 'utils/sessionHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { PROPERTIES, STRINGS } from 'const';
import { getDeviceID, isWeb } from 'utils/platformHelper';
import { ParentObject } from 'store/sales/types/common';
import { LOG } from 'config/logger';
import langActions from 'store/sales/actions/fetchLanguage';

import commonActions from 'store/sales/actions/common';
import sessionStorageService from 'services/storageService/sessionStorage';

import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Performs user-related actions.
 * @param {User} params - The parameters for the user action.
 * @returns {AppThunk} A thunk action.
 */
export const doLogin =
  (params: LoginInput): AppThunk =>
  async (dispatch) => {
    dispatch(uiActions.setLoader());
    dispatch(evdBalanceActions.setDealerBalanceInput(''));
    LOG.info('Calling doLogin with params:', params);
    return api
      .post(queries.LOGIN_QUERY, params)
      .then(async (response) => {
        LOG.info('doLogin response:', response);
        if (response?.status || response?.login?.status) {
          const data = refactorResponse(response);
          MoengageMixpanel.registerUser(data);
          dispatch(sliceActions.loginSuccess({ info: data, isRedirection: false }));
          dispatch(uiActions.clearLoader());
          await setToken({ accessToken: data?.accessToken, refreshToken: data?.refreshToken });
          return data;
        }
        dispatch(uiActions.showErrorPage(response?.message || response?.login?.message));
        return response;
      })
      .catch((error) => {
        LOG.error('doLogin caught error:', error);
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(uiActions.clearLoader());
        return { status: false, message: error?.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Performs user-logout action.
 * @returns {AppThunk} A thunk action.
 */
export const doLogout = (): AppThunk => async (dispatch) => {
  try {
    const isAD = await storageService.getItem(STRINGS.IS_AD);
    if (isAD === STRINGS.TRUE) {
      await adLogout().catch((e) => LOG.error('Azure AD logout failed', e));
    }
    const deviceId = await getDeviceID();
    // Fire and forget server-side logout to invalidate/revoke tokens
    api.post(queries.LOGOUT, { deviceId }).catch((e) => LOG.error('Server-side logout failed', e));
  } catch (error) {
    LOG.error('Error during logout:', error);
  }
  await resetUserSession();
  dispatch(sliceActions.logout());
  dispatch(uiActions.clearLoader());
  dispatch(uiActions.clearAlert());
  dispatch(uiActions.hideBottomModal());
};


/**
 * Performs generating new access token
 * @returns The new Access Token
 */
export const doRefreshToken = (): AppThunk => (dispatch) =>
  api
    .post(queries.REFRESH_TOKEN, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.refreshToken(data));
      return response;
    })
    .catch((error) => {
      dispatch(uiActions.showErrorPage(error.message));
    });

/**
 * Responsible to set route events
 *
 * @param {*} params
 * @returns {AppThunk}
 */
export const getAsmCsmMobileName = (): AppThunk => (dispatch) =>
  api
    .post(queries.getAsmCsmMobileName, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.getAsmCsmMobileName({ ...data }));
      return response;
    })
    .catch((error) => {
      dispatch(uiActions.showErrorPage(error.message));
    });
/**
 * resetExpiry action.
 * @returns {AppThunk} A thunk action.
 */
export const resetExpiry = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetExpiry());
};

export const loginWithOtp =
  (params: authType): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    dispatch(commonActions.reSetErrorMessage());
    return api
      .post(queries.loginWithOtp, params)
      .then((response) => {
        if (response?.status) {
          return response;
        }
        dispatch(uiActions.showErrorPage(response?.message));
        dispatch(commonActions.setErrorMessage(response?.message));
        return response;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(commonActions.setErrorMessage(error?.message));
        dispatch(uiActions.clearLoader());
        return { status: false, message: error?.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const loginOtpVerification =
  (params: authType): AppThunk =>
  async (dispatch) => {
    const deviceId = await getDeviceID();
    const payload = {
      ...params,
      deviceId,
    };
    dispatch(commonActions.reSetErrorMessage());
    dispatch(uiActions.setLoader());
    dispatch(evdBalanceActions.setDealerBalanceInput(''));
    console.warn('AAD Action: Calling verification...');
    LOG.error('Calling loginOtpVerification with payload:', JSON.stringify(payload));
    return api
      .post(queries.loginOtpVerification, payload)
      .then(async (response) => {
        console.warn('AAD Action: Response received', response?.status);
        LOG.error('loginOtpVerification response:', JSON.stringify(response));
        if (response?.status || response?.login?.status) {
          const data = refactorResponse(response);
          MoengageMixpanel.registerUser(data);
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.Login.LoginPage_LoginWithOtp.moduleName, {
            [MoengageMixpanelModules.Login.LoginPage_LoginWithOtp.attributes.Status]: true,
            [MoengageMixpanelModules.Login.LoginPage_LoginWithOtp.attributes.isPrmLogin]: params?.isPrmLogin,
            [MoengageMixpanelModules.Login.LoginPage_LoginWithOtp.attributes.mdn]: params?.mdn,
            [MoengageMixpanelModules.Login.LoginPage_LoginWithOtp.attributes.deviceId]: deviceId || null,
          });
          dispatch(sliceActions.loginSuccess({ info: data, isRedirection: false }));
          dispatch(uiActions.clearLoader());
          await setToken({ accessToken: data?.accessToken, refreshToken: data?.refreshToken });
          if (isWeb) {
            sessionStorageService.setItem(STRINGS.ACCESS_TOKEN, data?.accessToken);
            sessionStorageService.setItem(STRINGS.REFRESH_TOKEN, data?.refreshToken);
          }
          if (data?.internalRoleNT === PROPERTIES.ROLES.asi || data?.internalRoleNT === PROPERTIES.ROLES.csm) {
            dispatch(getAsmCsmMobileName());
          }
          dispatch(langActions.fetchLanguageAction());
          return data;
        }
        dispatch(commonActions.setErrorMessage(response?.message));
        dispatch(uiActions.showErrorPage(response?.message || response?.login?.message));
        return response;
      })
      .catch((error) => {
        LOG.error('loginOtpVerification caught error:', error);
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
        return { status: false, message: error?.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const loginWithAd =
  (params: authType): AppThunk =>
  async (dispatch) => {
    const deviceId = await getDeviceID();
    const payload = {
      ...params,
      deviceId,
    };
    dispatch(uiActions.setLoader());
    LOG.info('Calling loginWithAd with payload:', JSON.stringify(payload));
    
    // Set the MS token and IS_AD flag so the Apollo middleware can inject them into the headers
    if (params.accessToken) {
      await setToken({ accessToken: params.accessToken });
      await storageService.setItem(STRINGS.IS_AD, STRINGS.TRUE);
    }

    return api
      .post(queries.loginOtpVerification, payload) // Reusing the mutation but wrapping it in an AD-specific action
      .then(async (response) => {
        LOG.info('loginWithAd response success:', response?.status);
        if (response?.status || response?.login?.status || response?.login?.accessToken) {
          const data = refactorResponse(response);
          MoengageMixpanel.registerUser(data);
          dispatch(sliceActions.loginSuccess({ info: data, isRedirection: false }));
          dispatch(sliceActions.setLocalAuthStatus(true)); // Bypass biometrics for AD users
          await setToken({ accessToken: data?.accessToken, refreshToken: data?.refreshToken });
          if (data?.internalRoleNT === PROPERTIES.ROLES.asi || data?.internalRoleNT === PROPERTIES.ROLES.csm) {
            dispatch(getAsmCsmMobileName());
          }
          dispatch(langActions.fetchLanguageAction());
          return { status: true, ...data };
        }
        LOG.error('loginWithAd verification failed:', response?.message || response?.login?.message);
        // dispatch(uiActions.showErrorPage(response?.message || response?.login?.message));
        return { status: false, message: response?.message || response?.login?.message };
      })
      .catch((error) => {
        LOG.error('loginWithAd caught error:', error);
        // dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error?.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const handleRefreshToken = (): AppThunk => async (dispatch, getState) => {
  const { info } = getState().user;
  let userId = info?.userId;

  if (!isWeb && !userId) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rs = require('services/storageService/realmDB/realmServices').default;
    const secureData = await rs.getTokens();
    userId = secureData?.userId;
  }

  const deviceId = await getDeviceID();
  const params = {
    userId,
    deviceId: isWeb ? null : String(deviceId),
  };
  return api
    .post(queries.handleRefreshToken, params)
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.refreshToken(data));
      setToken({ accessToken: data?.accessToken, refreshToken: data?.refreshToken });
      if (isWeb) {
        sessionStorageService.setItem(STRINGS.ACCESS_TOKEN, data?.accessToken);
        sessionStorageService.setItem(STRINGS.REFRESH_TOKEN, data?.refreshToken);
      }
      return response;
    })
    .catch((error) => {
      dispatch(uiActions.showErrorPage(error.message));
    });
};


export const setUserDetails =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.handleUserDetails(params));
  };

export const checkMultipleLogins = (): AppThunk => (dispatch, getState) => {
  const { userDetails } = getState().user;
  const requestedParams = {
    userId: userDetails?.mdn || userDetails?.userName,
    deviceId: isWeb ? null : userDetails?.deviceId,
  };
  dispatch(uiActions.setLoader());
  return api
    .post(queries.checkMultipleLogins, requestedParams)
    .then((response) => {
      const data = refactorResponse(response);
      return { data, status: true };
    })
    .catch((error) => {
      dispatch(uiActions.showErrorPage(error.message));
      return { status: false, message: error?.message };
    });
};

export const loginWithLocalAuth = (): AppThunk => (dispatch, getState) => {
  const { userDetails } = getState().user;
  dispatch(uiActions.setLoader());
  return api
    .post(queries.loginWithLocalAuth, { userName: userDetails?.userName })
    .then((response) => {
      const data = refactorResponse(response);
      MoengageMixpanel.registerUser(data);
      dispatch(sliceActions.setLocalAuthentication({ info: data, isRedirection: false, isLocalAuthenticated: true }));
      return data;
    })
    .catch((error) => {
      dispatch(uiActions.showErrorPage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};

export const updateLocalAuthStatus =
  (params: boolean): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setLocalAuthStatus(params));
  };

export const addNavigation =
  (params: { menus: any[]; routes: any[]; dashboard: any[] }): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.handleNavigationDetails(params));
  };
