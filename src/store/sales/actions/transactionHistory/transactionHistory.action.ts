/**
 * transaction History to manage recharge reversal
 *
 * @module store/actions/transactionHistory
 *
 */
import { sliceActions } from 'store/sales/reducer/transactionHistory';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { LOG } from 'config/logger';
import { ALERT, CHILD_TYPE, MODAL, ROUTE } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { showErrorPage } from '../ui/ui.action';

/**
 * Represents an asynchronous action to fetch and process transaction history data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 */
export const getPartnerTransactions =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.RechargeReversal.RechargeReversalLast20.moduleName, {
          Status: true,
          [MoengageMixpanelModules.RechargeReversal.RechargeReversalLast20.attributes.Status]: true,
        });
        dispatch(sliceActions.setTransactionHistory({ queryName, data }));
        return { data, status: true };
      })
      .catch((error) => {
        dispatch(showErrorPage(error.message));
        LOG.info(error);
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process transaction history data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 */
export const retrieveTransactionDetails =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const payload = {
      transactionInfo: params?.transactionID || params?.subscriberId,
    };
    dispatch(uiActions.setLoader());
    return api
      .get(queries.retrieveTransactionDetails, payload)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.RechargeReversal.RechargeReversalLast20.moduleName, {
          Status: true,
        });
        const { subscriberTrans, transDetails, isTransactionDetails } = data;
        if (data?.isTransactionDetails) {
          dispatch(sliceActions.setTransactionHistoryDetails({ data: transDetails }));
        } else {
          dispatch(sliceActions.setTransactionHistory({ data: subscriberTrans }));
        }
        dispatch(sliceActions.setIsTransactionDetails({ data: isTransactionDetails }));
        return { data, status: true };
      })
      .catch((error) => {
        dispatch(showErrorPage(error.message));
        LOG.info(error);
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const resetIsTransactionDetails = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setIsTransactionDetails({ data: false }));
};
/*
 * Represents an asynchronous action to reset transaction history.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const resetTransactionHistory = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setTransactionHistory({ data: [] }));
};

/*
 * Represents an asynchronous action to reset reversal  Information.
 * @returns {AppThunk} A thunk action.
 */

export const resetReversalInformation = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setReversalInformation({ reversalReasons: [], balance: '' }));
};

/*
 * Represents an asynchronous action to the server to fetch reversal information.
 * @param {ParentObject} params - The parameters for sending form request data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const fetchReversalInformation =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries.fetchReversalInformation, params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setReversalInformation(data));
      })
      .catch((error) => {
        dispatch(showErrorPage(error.message));
        LOG.info(error);
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/*
 * Represents an asynchronous action to the server to reverse recharge.
 * @param {ParentObject} params - The parameters for sending form request data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const doReverseRecharge =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries.reverseRecharge, { input: { ...params } })
      .then((response) => {
        const data = refactorResponse(response);
        if (response.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.RechargeReversal.RechargeReversalSuccess.moduleName, {
            Status: true,
            [MoengageMixpanelModules.RechargeReversal.RechargeReversalSuccess.attributes.ReversalAmount]: params?.transactionAmount,
            [MoengageMixpanelModules.RechargeReversal.RechargeReversalSuccess.attributes.SubscriberID]: params?.subscriberId,
          });
          dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, routeName: ROUTE.WEB.RECHARGE_REVERSAL }, { data, type: CHILD_TYPE.INFO_TEXT }));
          dispatch(resetReversalInformation());
        } else {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.RechargeReversal.RechargeReversalProcessing.moduleName, {
            Status: true,
            [MoengageMixpanelModules.RechargeReversal.RechargeReversalProcessing.attributes.ReversalAmount]: params?.transactionAmount,
            [MoengageMixpanelModules.RechargeReversal.RechargeReversalProcessing.attributes.SubscriberID]: params?.subscriberId,
          });
          dispatch(showErrorPage(response.message));
        }
      })
      .catch((error) => {
        dispatch(showErrorPage(error.message));
        LOG.info(error);
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
