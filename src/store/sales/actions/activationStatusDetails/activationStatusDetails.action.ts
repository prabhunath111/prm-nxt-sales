/**
 * for activation status module details
 *
 * @module store/sales/actions/activationStatusDetails
 *
 */
import { sliceActions } from 'store/sales/reducer/activationStatusDetails';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import commonActions from 'store/sales/actions/common';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { MoengageMixpanel } from 'services/moengageMixpanel';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(activationStatusDetailsAction({ exampleParam: 'exampleValue' }));
 */
export const getWODetailsActivationStatus = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  dispatch(commonActions.setErrorMessage(''));
  const { formState } = getState().form;

  const inputParams = {
    input: {
      subscriberId: formState?.dealerDetails?.subscriberId,
    },
  };

  return api
    .get(queries.getWODetailsActivationStatus, inputParams)
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.setWoDetailsData(data?.woDetails));
      return { status: true, data };
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};

export const getActivationStatusOtherDetails = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  dispatch(commonActions.setErrorMessage(''));
  const { formState } = getState().form;

  const inputParams = {
    input: {
      subscriberId: formState?.dealerDetails?.subscriberId,
    },
  };

  return api
    .get(queries.getActivationStatusOtherDetails, inputParams)
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.setWoOtherDetails(data?.otherDetails));
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusWODetails.moduleName, {
        [MoengageMixpanelModules.ActivationStatus.ActivationStatusWODetails.attributes.Status]: true,
        [MoengageMixpanelModules.ActivationStatus.ActivationStatusWODetails.attributes.SubscriberID]: formState?.dealerDetails?.subscriberId,
      });
      return { status: true, data };
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};

export const getUpgradeWODetailsActivationStatus = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  dispatch(commonActions.setErrorMessage(''));
  const { formState } = getState().form;

  const inputParams = {
    input: {
      subscriberId: formState?.dealerDetails?.subscriberId,
    },
  };

  return api
    .get(queries.getUpgradeWODetailsActivationStatus, inputParams)
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.setUpgradeWODetails(data?.woDetails));
      return { status: true, data };
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};

export const getActivationStatusPacInfo = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  dispatch(commonActions.setErrorMessage(''));
  const { formState } = getState().form;

  const inputParams = {
    input: {
      subscriberId: formState?.dealerDetails?.subscriberId,
    },
  };

  return api
    .get(queries.getActivationStatusPacInfo, inputParams)
    .then((response) => {
      const data = refactorResponse(response);
      const subDetails = data?.packDetails;

      dispatch(sliceActions.setSubscriptionDetails(subDetails));
      return { status: true, data };
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};

export const getLastFiveRechargesDetails = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  dispatch(commonActions.setErrorMessage(''));
  const { formState } = getState().form;

  const inputParams = {
    input: {
      subscriberId: formState?.dealerDetails?.subscriberId,
    },
  };

  return api
    .get(queries.getLastFiveRechargesDetails, inputParams)
    .then((response) => {
      const data = refactorResponse(response);

      dispatch(sliceActions.setTransactions(data?.transactions));
      return { status: true, data };
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};

export const getAccountInfo = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  dispatch(commonActions.setErrorMessage(''));
  const { formState } = getState().form;

  const inputParams = {
    subscriberInfo: formState?.dealerDetails?.subscriberId,
  };

  return api
    .get(queries.accountInformation, inputParams)
    .then((response) => {
      const data = refactorResponse(response);

      dispatch(sliceActions.setAccountInfo(data));
      return { status: true, data };
    })
    .catch((error) => {
      dispatch(commonActions.setErrorMessage(error.message));
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};
