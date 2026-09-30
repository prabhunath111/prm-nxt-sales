/**
 * reducer to raise and track customer services
 *
 * @module store/actions/customerService
 *
 */
import { sliceActions } from 'store/sales/reducer/customerService';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const getCustomerServiceInfo =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.accountInfo?.subIdList) {
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
        } else {
          dispatch(sliceActions.setSubscriberData(data));
          dispatch(formActions.setSubIdListDefault());
        }
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestValidateID.moduleName, {
          Status: true,
          [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestValidateID.attributes.SubscriberID]: params?.subscriberInfo,
        });
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const getServiceSubCategories =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setSubCategories(data));
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
/**
 * Represents an asynchronous action to reset data
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 */
export const resetSubCategories = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetSubCategories());
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const getSuspensionReason =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setSuspensionReason(data));
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const trackServiceRequest =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.accountInfo?.subIdList) {
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
        } else {
          dispatch(sliceActions.setTrackServiceRequest(data));
          dispatch(formActions.setSubIdListDefault());
        }
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServiceTrackRequestProceed.moduleName, {
          Status: true,
          [MoengageMixpanelModules.CustomerService.CustomerServiceTrackRequestProceed.attributes.SubscriberID]: params?.subscriberInfo,
        });
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const getAvailableSlot =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setAvailableSlot(data));
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const getSlotDateForDropdown =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setSlotDate(data));
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const getSlotTimeForDropdown =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setSlotTime(data));
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 *  @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(customerServiceAction({ exampleParam: 'exampleValue' }));
 */

export const createServiceRequest =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { typeOfRequest, selectedType } = getState().customerService;
    return api
      .post(queries[queryName], { input: { ...params } })
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestProceed.moduleName, {
          Status: true,
          [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestProceed.attributes.SubscriberID]: params?.subscriberInfo,
          [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestProceed.attributes.NatureOfRequest]: selectedType,
          [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestProceed.attributes.RequestType]: typeOfRequest,
          [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestProceed.attributes.TicketID]: data?.transactionId,
        });
        return { data, status: true };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to reset data
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 */
export const resetRaiseRequest = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetRaiseRequest());
};

/**
 * Represents an asynchronous action to reset data
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 */
export const resetTrackRequest = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetTrackRequest());
};
