/**
 * Store to handle all the user related activities
 *
 * @module store/actions/user
 *
 */
import { sliceActions } from 'store/sales/reducer/redirection';
import { sliceActions as userActions } from 'store/sales/reducer/user';
import actions from 'store/sales/actions/user';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import uiActions from 'store/sales/actions/ui';
import { RedirectionResponse } from 'store/sales/types/redirection';
import { removeItem, setToken } from 'utils/sessionHelper';
import { PROPERTIES, ROUTE, STRINGS } from 'const';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { storageService } from 'services/storageService';
import { getFullLanguageName } from 'utils/languageHelper';
import { openBrowser } from 'utils/externalAppLinkHelper';

/**
 * Fetch redirection token and verify it
 * @param params - The parameters for fetching token data.
 * @returns - A thunk action.
 */
export const verifyToken =
  (params: any): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries.REDIRECTION_LOGIN_QUERY, params)
      .then((response) => {
        const processedResponse: RedirectionResponse = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        removeItem(STRINGS.REDIRECTION_TOKEN);
        if (processedResponse) {
          dispatch(sliceActions.setVerifyTokenData({ ...processedResponse.redirectionInfo, navigation: processedResponse.user?.navigation }));
          dispatch(
            userActions.loginSuccess({
              info: processedResponse?.user,
              isRedirection: true,
            }),
          );
          if (processedResponse?.user?.internalRole === PROPERTIES.ROLES.asi || processedResponse?.user?.internalRole === PROPERTIES.ROLES.csm) {
            dispatch(actions.getAsmCsmMobileName());
          }
          // set access and refresh token
          setToken({ accessToken: processedResponse?.user?.accessToken, refreshToken: processedResponse?.user?.refreshToken });

          // handling lang header change
          const langHeader = getFullLanguageName(processedResponse?.redirectionInfo?.language);
          if (langHeader === STRINGS.BANGLA) {
            storageService.setItem(STRINGS.LANG, STRINGS.BENGALI);
          } else if (langHeader === STRINGS.ODIA) {
            storageService.setItem(STRINGS.LANG, STRINGS.ORIYA);
          } else {
            storageService.setItem(STRINGS.LANG, langHeader);
          }

          // Track redirection user event
          MoengageMixpanel.registerUser(processedResponse?.user);
          MoengageMixpanel.trackEvent('Redirected User', processedResponse?.user);
        } else {
          dispatch(uiActions.showErrorPage(STRINGS.INTERNAL_SERVER_ERROR, true));
        }
        return processedResponse;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(uiActions.clearLoader());
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * api to get redirection token and redirect to url
 *
 * @function getSSORedirectionToken
 * @param {ParentObject} params - The parameters required to open the modal.
 * @returns {AppThunk} A thunk action that dispatches actions based on the API response.
 */
export const getSSORedirectionToken =
  (params: any): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      moduleName: params?.moduleName,
      subModuleName: '',
      language: 'en',
    };
    return api
      .post(queries.generateRedirectionToken, requestObject)
      .then((response) => {
        const data = refactorResponse(response);
        const ssoUrl = `${params.externalUrl}${data?.data.token}`;
        if (data?.data.token) {
          return openBrowser(ssoUrl);
        }

        return { status: true, pathName: ROUTE.WEB.SSO_WEB_VIEW, params: { source: ssoUrl } };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
