/**
 * Redux actions for the rmnUpdate module.
 *
 * @module store/actions/rmnUpdate
 */

import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, MODAL, ROUTE } from 'const';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Checks RMN eligibility and updates the form state based on the response.
 *
 * @param {ParentObject} params - The parameters for the query, including subscriberID and newRMN.
 * @param {string} queryName - The query name to be used from the queries object.
 * @returns {AppThunk} A thunk that dispatches actions based on the API response.
 *
 * @example
 * dispatch(checkRMNEligibility({ subscriberInfo: '12345'}, 'checkEligibilityQuery'));
 */
export const checkRMNEligibility =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data.accountInfo?.subIdList) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.RMNUpdate.RMNUpdateValidateIDMultiSID.moduleName, {
            Status: true,
            [MoengageMixpanelModules.RMNUpdate.RMNUpdateValidateIDMultiSID.attributes.RMN]: params?.subscriberInfo,
          });
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
          return { data, status: false };
        }
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.RMNUpdate.RMNUpdateValidateID.moduleName, {
          Status: true,
          [MoengageMixpanelModules.RMNUpdate.RMNUpdateValidateID.attributes.RMN]: data?.accountInfo?.rmn,
        });
        dispatch(formActions.setFormDependentDefault({ existingRMN: data.accountInfo?.rmn, subscriberID: data.accountInfo?.subId }));
        dispatch(formActions.setSubIdListDefault());
        return { data, status: true };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Updates the mobile number and shows a success alert.
 *
 * @param {ParentObject} params - The parameters for the query, including subscriberID and newRMN.
 * @param {string} queryName - The query name to be used from the queries object.
 * @returns {AppThunk} A thunk that dispatches actions based on the API response.
 *
 * @example
 * dispatch(updateMobileNumber({ subscriberID: '12345', newRMN: '67890' }, 'updateMobileNumberQuery'));
 */
export const updateMobileNumber =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const payload = {
      subscriberId: params.subscriberID,
      rmn: params.newRMN,
    };
    return api
      .get(queries[queryName], payload)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.RMNUpdate.RMNUpdateProceed.moduleName, {
          Status: true,
          [MoengageMixpanelModules.RMNUpdate.RMNUpdateProceed.attributes.OldRMN]: params?.existingRMN,
          [MoengageMixpanelModules.RMNUpdate.RMNUpdateProceed.attributes.newRMN]: params?.newRMN,
        });
        dispatch(uiActions.showAlert(data.updateMessage, ALERT.SUCCESS, { primaryText: MODAL.OK, routeName: ROUTE.WEB.CHECK_RMN_UPDATE }, {}));
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
