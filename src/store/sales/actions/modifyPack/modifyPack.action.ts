/**
 * reducer for modify pack
 *
 * @module store/sales/actions/modifyPack
 *
 */
import { sliceActions } from 'store/sales/reducer/modifyPack';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { modifyPackType } from 'store/sales/types/modifyPack';
import { refactorResponse } from 'utils/responseHelper';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { getRedirectionLangPayload } from 'utils/languageHelper';
import { storageService } from 'services/storageService';
import { callAction } from 'utils/formBuilderHelper';
import { ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { QUERY, REDIRECTION_LANG, ROUTE, STATE_KEY } from 'const/strings';
import i18next from 'i18next';
import { LOG } from 'config/logger';
import { isAndroid, isiOS, isWeb } from 'utils/platformHelper';
import { isValidRedirectUrl } from 'utils/navigationHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(modifyPackAction({ exampleParam: 'exampleValue' }));
 */

export const modifyPackModal =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ModifyPack.ModifyPackPageVisit.moduleName, {
      [MoengageMixpanelModules.ModifyPack.ModifyPackPageVisit.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.MODIFY_PACK,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.modifyPack,
        headerIcon: ICONS.MODIFY_PACK_PINK,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

export const getPackSelectorInfo =
  (params: modifyPackType, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  async (dispatch) => {
    const lang = (await storageService.getItem(STRINGS.APP_LANGUAGE)) || REDIRECTION_LANG.en;

    const inputParam = params.subscriberId || params.multiSubId;
    const firstDigit = inputParam?.charAt(0) || '';

    // Decide logic based on first digit
    const isRMN = firstDigit >= '6';

    // Choose query
    const query = isRMN ? queries.accountInformation : queries.getPackSelectorInfo;

    const paramsRmn = {
      subscriberInfo: inputParam,
    };
    const paramsSubId = {
      subscriberId: inputParam,
      language: getRedirectionLangPayload(lang),
    };

    // Choose params
    const queryParams = isRMN ? paramsRmn : paramsSubId;

    dispatch(uiActions.setModalLoader());
    dispatch(commonActions.setErrorMessage(''));
    return api
      .get(query, queryParams)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setPackSelectorAccountInfo(data));
        if (data?.subId) {
          dispatch(callAction({ subscriberId: data?.subId, language: getRedirectionLangPayload(lang) }, QUERY.GetPackSelectorInfo, '', navigate));
          return { status: false, data };
        }
        if (data?.subIdList) {
          const subIdList = data?.subIdList ?? [
            {
              rmn: data?.customerRMN,
              subId: data?.subId,
              aliasName: '',
              status: data?.customerStatus,
              statusNT: data?.customerStatusNT,
            },
          ];

          dispatch(formActions.setSubIdList(subIdList));

          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.modifyPackSubIdList,
              buttonInfo: {
                goToHome: true,
              },
            }),
          );
          return { status: false, data };
        }
        const { subscriberId, subscriberName, rmn } = data;
        const customerName = subscriberName;
        const customerRMN = rmn;
        dispatch(uiActions.hideBottomModal());
        dispatch(formActions.setDealerDetails({ subscriberId, mdn: customerRMN, customerName }));
        navigate(ROUTE.WEB.MODIFYPACK_ACCOUNT_DETAILS);
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const getSubEntitlement =
  (subscriberId: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    dispatch(commonActions.setErrorMessage(''));

    const inputParams = {
      input: {
        subscriberId,
      },
    };

    return api
      .get(queries.getActivationStatusPacInfo, inputParams)
      .then((response) => {
        const data = refactorResponse(response);
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(modifyPackAction({ exampleParam: 'exampleValue' }));
 */

export const manageAppsModal =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.NewChangePack_PageVisit.moduleName, {
      [MoengageMixpanelModules.BingRetailer.NewChangePack_PageVisit.attributes.Status]: true,
    });
    dispatch(sliceActions.setManageAppsRMN(''));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.NEW_CHANGE_PACK,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.manageApps,
        headerIcon: ICONS.MANAGE_APP,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(modifyPackAction({ exampleParam: 'exampleValue' }));
 */

export const manageAppsModalBack =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.NEW_CHANGE_PACK,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.manageApps,
        headerIcon: ICONS.MANAGE_APP,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(modifyPackAction({ exampleParam: 'exampleValue' }));
 */
const openReturnUrlWeb = (returnUrl: string, accessToken: string) => {
  if (!isValidRedirectUrl(returnUrl)) {
    LOG.error('Security Exception: Untrusted redirect destination blocked.', returnUrl);
    return;
  }
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = returnUrl;
  form.target = '_blank';

  const tokenInput = document.createElement('input');
  tokenInput.type = 'hidden';
  tokenInput.name = 'accessToken';
  tokenInput.value = accessToken;

  form.appendChild(tokenInput);
  document.body.appendChild(form);
  form.submit();
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(modifyPackAction({ exampleParam: 'exampleValue' }));
 */
const openReturnUrl = (navigate: any, returnUrl: string, accessToken: string) => {
  if (!isValidRedirectUrl(returnUrl)) {
    LOG.error('Security Exception: Untrusted redirect destination blocked.', returnUrl);
    return;
  }
  const html = `
    <html>
      <body>
        <form id="postForm" action="${returnUrl}" method="post">
          <input type="hidden" name="accessToken" value="${accessToken}" />
        </form>
        <script>
          document.getElementById("postForm").submit();
        </script>
      </body>
    </html>
  `;

  if (isiOS() || isAndroid()) {
    navigate(ROUTE.WEB.AUTO_POST_WEB_VIEW, {
      html,
    });
  }
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(submitRequestForOtp({ exampleParam: 'exampleValue' }));
 */
export const getBposDetailsDirectFromFE =
  (_params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.Dashboard_PageVisit.moduleName, {
      [MoengageMixpanelModules.BingRetailer.Dashboard_PageVisit.attributes.Status]: true,
    });
    dispatch(uiActions.setModalLoader());
    const { info } = getState().user;
    const { manageAppsRMN } = getState().modifyPack;
    const rmn = manageAppsRMN;
    const requestInput = {
      input: {
        rmn: info?.mdn,
      },
    };
    return api
      .post(queries.getBposDetailsDirectFromFE, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        dispatch(
          formActions.setUpdatedFormFields(
            {
              manageAppMobile: rmn,
            },
            STATE_KEY.MODAL_STATE,
          ),
        );
        dispatch(sliceActions.setManageAppsUserRole(data?.newRole));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(commonActions.setErrorMessage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(modifyPackAction({ exampleParam: 'exampleValue' }));
 */
export const checkRmnInComvivaOrDth =
  (params: any, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { info } = getState().user;
    const { userRole } = getState().modifyPack;

    const requestInput = {
      input: {
        dealerId: info.userId,
        rmn: params?.manageAppMobile,
        userName: info.mdn,
        userRole,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        if (response?.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.NewChangePack_RMNValidation.moduleName, {
            [MoengageMixpanelModules.BingRetailer.NewChangePack_RMNValidation.attributes.Status]: true,
            [MoengageMixpanelModules.BingRetailer.NewChangePack_RMNValidation.attributes.rmn]: params?.manageAppMobile,
          });
          const data = refactorResponse(response);
          dispatch(sliceActions.setManageAppsRMN(params?.manageAppMobile));
          if (data?.transMessage === STRINGS.MULTIPLE_RMN && data?.subIdList) {
            dispatch(formActions.setSubIdList(data?.subIdList));
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
                headerTitle: HEADER_TITLE.SUBSCRIBER_ID,
                showCloseIcon: true,
                showHeader: true,
                formName: FORMS.manageAppsSubIdList,
                onClose: () => dispatch(callAction({}, QUERY.ManageAppsModal)),
              }),
            );
            return { status: false, data };
          }
          if (data?.returnUrl) {
            if (isWeb || window.webkit?.messageHandlers?.cordova_iab) {
              openReturnUrlWeb(data?.returnUrl, data?.accessToken);
            } else {
              openReturnUrl(navigate, data?.returnUrl, data?.accessToken);
            }
          } else if (data?.otpRequest === STRINGS.YES) {
            dispatch(uiActions.hideBottomModal());
            const alertMessage = `${i18next.t('alertMessages.otpConfirmMsgSubscriber')}`;
            dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.SendOTPToSubscriber,
                  queryParams: params,
                  secondaryQueryParams: {},
                  secondaryQueryName: QUERY.ManageAppsModalBack,
                  clearForm: false,
                },
                {},
              ),
            );
            return null;
          } else {
            dispatch(uiActions.hideBottomModal());
            dispatch(uiActions.showErrorPage(response.message));
            return { status: false, message: response.message };
          }

          return { status: true, data };
        }
        dispatch(commonActions.setErrorMessage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(submitRequestForOtp({ exampleParam: 'exampleValue' }));
 */
export const sendOTPToSubscriber =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { bottomModal } = getState().ui;
    const requestInput = {
      mobile: params?.manageAppMobile ?? params?.mobile,
    };
    return api
      .post(queries.generateOTPWithMobile, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.transStatus === STRINGS.SUCCESS) {
          dispatch(uiActions.clearLoader());
          setTimeout(() => {
            dispatch(
              uiActions.showBottomModal({
                isModalVisible: true,
                isCenterModal: true,
                type: CHILD_TYPE.OTP_MODAL,
                headerTitle: '',
                data: { mdn: params?.manageAppMobile ?? params?.mobile, ...params },
                showCloseIcon: false,
                showHeader: true,
                buttonInfo: {
                  otpButtonLabel: STRINGS.SUBMIT,
                  sentToTitle: STRINGS.SENTTO,
                  queryName: QUERY.ValidateOTPManageApps,
                  secondaryQueryParams: {},
                  secondaryQueryName: QUERY.ManageAppsModalBack,
                  hasOutline: true,
                  resendOtpQuery: QUERY.SendOTPToSubscriber,
                  resendOtpQueryParams: {
                    partnerNumber: params?.manageAppMobile ?? params?.mobile,
                    ...params,
                  },
                },
              }),
            );
          }, 500);
        }
        return { status: true, data };
      })
      .catch((error: any) => {
        if (bottomModal.isModalVisible) {
          dispatch(commonActions.setErrorMessage(error.message));
        } else {
          dispatch(uiActions.showErrorPage(error.message));
        }
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(validateOTPWithMobile({ exampleParam: 'exampleValue' }));
 */
export const validateOTPManageApps =
  (params: ParentObject, _queryName: string, _stateKey: any): AppThunk =>
  (dispatch) => {
    const requestInput = {
      input: {
        otp: params?.otp,
        rmn: params?.mdn,
        type: 'FREEMIUM',
      },
    };
    return api
      .post(queries.validateOTPWithoutSubIdWeb, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        dispatch(
          uiActions.showAlert(
            data?.linkmessage,
            ALERT.CONFIRM,
            {
              primaryText: MODAL.OK,
              queryName: QUERY.ManageAppsModal,
            },
            {},
          ),
        );
        return { status: true, data };
      })
      .catch((error: any) => ({ status: false, message: error.message }))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(validateOTPWithMobile({ exampleParam: 'exampleValue' }));
 */
export const checkDTHInfoManageApp =
  (params: ParentObject, _queryName: string, _stateKey: any): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { userRole, manageAppsRMN } = getState().modifyPack;
    const requestInput = {
      input: {
        dealerId: info.userId,
        rmn: manageAppsRMN,
        userName: info.mdn,
        userRole,
        subId: params?.multiSubId,
      },
    };
    return api
      .post(queries.checkDTHInfoManageApp, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
