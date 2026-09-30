/**
 * In this reducer we will manage all account related information
 *
 * @module store/actions/accountInformation
 *
 */
import { sliceActions } from 'store/sales/reducer/accountInformation';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
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
 * dispatch(accountInformationAction({ exampleParam: 'exampleValue' }));
 */
export const accountInformation =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { paramsRMN } = getState().accountInformation;
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data.subIdList) {
          dispatch(sliceActions.setParamsRMN(params));
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerInformation.CustomerInformationMultiSID.moduleName, {
            Status: true,
            [MoengageMixpanelModules.CustomerInformation.CustomerInformationMultiSID.attributes.SubscriberID]: params?.subscriberInfo,
            [MoengageMixpanelModules.CustomerInformation.CustomerInformationMultiSID.attributes.Subscriber_RMN]: params?.subscriberInfo,
          });
          dispatch(formActions.setSubIdList(data.subIdList));
          return { data, status: false };
        }
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerInformation.CustomerInformationDetails.moduleName, {
          Status: true,
          [MoengageMixpanelModules.CustomerInformation.CustomerInformationDetails.attributes.SubscriberID]: params?.subscriberInfo,
          [MoengageMixpanelModules.CustomerInformation.CustomerInformationDetails.attributes.Subscriber_RMN]: paramsRMN?.subscriberInfo,
        });
        dispatch(sliceActions.setRequestParams({ ...params }));
        dispatch(sliceActions.setAccountInformation(data));
        dispatch(formActions.setSubIdListDefault());
        return { data, status: true };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        LOG.info(`Error occurred while fetching account info: ${error}`);
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Action to reset account information to its initial state.
 *
 * This function clears the account information and resets related fields.
 *
 * @function
 * @returns {AppThunk} A thunk action to reset account information.
 *
 * @example
 * dispatch(resetAccountInformation());
 */

export const resetAccountInformation = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setAccountInformation({}));
  dispatch(sliceActions.setLastFiveRecharge([]));
};

/**
 * Asynchronous action to fetch the last five recharge details.
 *
 * This function fetches and processes recharge details, updating the application state.
 *
 * @function
 * @param {ParentObject} params - Parameters for the query.
 * @returns {AppThunk} A thunk action to fetch and update recharge details.
 *
 * @example
 * dispatch(getLastFiveRecharge({ subscriberId: '12345' }));
 */

export const getLastFiveRecharge =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { paramsRMN } = getState().accountInformation;
    return api
      .get(queries.getLastFiveRecharge, params)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerInformation.CustomerInformationLast5.moduleName, {
          Status: true,
          [MoengageMixpanelModules.CustomerInformation.CustomerInformationLast5.attributes.Subscriber_RMN]: paramsRMN?.subscriberInfo,
          [MoengageMixpanelModules.CustomerInformation.CustomerInformationLast5.attributes.Transaction_ID]: data?.lastRechargeDetails?.[0]?.transactionId,
        });
        dispatch(sliceActions.setLastFiveRecharge(data.lastRechargeDetails));
        return { status: true };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
