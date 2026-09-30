/**
 * reset evd pin acrion
 *
 * @module store/actions/resetEvdPin
 *
 */
import uiActions from 'store/sales/actions/ui';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query/resetEvdPin';
import { refactorResponse } from 'utils/responseHelper';
import { ALERT, CHILD_TYPE, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS } from 'const';
import { LOG } from 'config/logger';
import { ParentObject } from 'store/sales/types/common';
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
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const generateOTPWithOutSubId =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) =>
    api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.transStatusNT === PROPERTIES.RESET_EVD.SUCCESS) {
          const state = getState();

          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.OTP_MODAL,
              headerTitle: '',
              data: { mdn: state.user.info.mdn },
              showCloseIcon: false,
              showHeader: true,
              isCenterModal: true,
              buttonInfo: {
                queryName: QUERY.ResetEVDPin,
                otpButtonLabel: STRINGS.PROCEED,
                sentToTitle: STRINGS.SENTTORMN,
              },
            }),
          );
        } else {
          dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
        }
        return data;
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        LOG.info(error);
      })
      .finally(() => dispatch(uiActions.clearLoader()));
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const resetEVDPin =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) =>
    api
      .post(queries[queryName], { input: { otp: params.otp, type: PROPERTIES.RESET_EVD.SELF, partnerMdn: '' } })
      .then((response) => {
        const data = refactorResponse(response);
        if (data.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.resetEVDPin.resetEVDPin_ForSelf.moduleName, {
            [MoengageMixpanelModules.resetEVDPin.resetEVDPin_ForSelf.attributes.Status]: true,
          });
          dispatch(
            uiActions.showAlert(
              data.message,
              ALERT.SUCCESS,
              { primaryText: MODAL.OK_GOT_IT, routeName: ROUTE.WEB.CHANGE_EVD_PIN, params: { oldPin: PROPERTIES.RESET_EVD.oldPinLabel } },
              { data: { ...data }, type: CHILD_TYPE.INFO_TEXT_WITH_DATA, listData: PROPERTIES.RESET_EVD.RESET_SUCCESS },
            ),
          );
        }
        return { status: true, data };
      })
      .catch((error: any) => {
        LOG.info(error);
        return { status: false, message: error.message };
      });
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const resetEVDPinForPartner =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) =>
    api
      .post(queries[queryName], { input: { otp: '', partnerMdn: params?.selectPartner?.mdn, type: PROPERTIES.RESET_EVD.PARTNER } })
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.resetEVDPin.resetEVDPin_ForPartner.moduleName, {
            [MoengageMixpanelModules.resetEVDPin.resetEVDPin_ForPartner.attributes.Status]: true,
            [MoengageMixpanelModules.resetEVDPin.resetEVDPin_ForPartner.attributes.partnerMdn]: params?.selectPartner?.mdn || '',
          });
          dispatch(
            uiActions.showAlert(
              data.message,
              ALERT.SUCCESS,
              { primaryText: MODAL.OK_GOT_IT, clearForm: true, closeView: true },
              { data: { ...data }, type: CHILD_TYPE.INFO_TEXT_WITH_DATA },
            ),
          );
        } else {
          dispatch(uiActions.showErrorPage(data.message));
        }
        return { status: true, message: data.message };
      })
      .catch((error: any) => {
        LOG.info(error);
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      });

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const searchPartner =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) =>
    api
      .post(queries[queryName], { input: { searchKeyword: params?.searchText } })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formAction.setDropdownData({ data: data?.info, queryName }));
        return { status: true, data: data.info };
      })
      .catch((error: any) => {
        dispatch(formAction.setDropdownData({ data: [], queryName }));
        LOG.info(error);
        return { status: false, data: [] };
      });
