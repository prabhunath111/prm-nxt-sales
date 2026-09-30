/**
 * Redux files for evdTransfer reducer
 *
 * @module store/actions/evdTransfer
 *
 */
import { sliceActions } from 'store/sales/reducer/evdTransfer';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { PROPERTIES } from 'const';
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
 * dispatch(evdTransferAction({ exampleParam: 'exampleValue' }));
 */
export const fetchChildPartnerDetails =
  (params: any, queryName: string): AppThunk =>
  (dispatch) => {
    const requestInput = {
      input: {
        search: params?.searchText,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setEvdTransferData(data));
        dispatch(formAction.setDropdownData({ data: data?.result, queryName }));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
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
 * dispatch(doEVDTransferWeb({ exampleParam: 'exampleValue' }));
 */
export const doEVDTransferWeb =
  (params: any, queryName: string): AppThunk =>
  (dispatch) => {
    const requestInput = {
      input: {
        pin: params?.pin,
        childMdn: params?.selectPartner?.mobile,
        amount: params?.transferType === PROPERTIES.EVD_TRANSFER.forwardTransfer ? params?.amount : params?.reverseAmount,
        type: params?.transferType,
        childName: params?.selectPartner?.name,
      },
    };
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status || response?.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.evdTransfer.EVD_Transfer.moduleName, {
            [MoengageMixpanelModules.evdTransfer.EVD_Transfer.attributes.Status]: true,
            [MoengageMixpanelModules.evdTransfer.EVD_Transfer.attributes.amount]:
              params?.transferType === PROPERTIES.EVD_TRANSFER.forwardTransfer ? params?.amount : params?.reverseAmount,
            [MoengageMixpanelModules.evdTransfer.EVD_Transfer.attributes.childMdn]: params?.selectPartner?.mobile,
            [MoengageMixpanelModules.evdTransfer.EVD_Transfer.attributes.childName]: params?.selectPartner?.name,
            [MoengageMixpanelModules.evdTransfer.EVD_Transfer.attributes.typeOfTransfer]: params?.transferType,
          });
        }
        dispatch(sliceActions.setEvdTransferSuccessData(data));
        return { status: true, data, route: params?.transferType };
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };
