/**
 * Reducer for tsk refund screen.
 *
 * @module store/actions/tskRefund
 *
 */
import { sliceActions } from 'store/sales/reducer/tskRefund';
import { AppThunk } from 'store';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { tskRefundType } from 'store/sales/types/tskRefund';
import { refactorResponse } from 'utils/responseHelper';
import { ALERT, MODAL } from 'const';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Fetches and processes TSK refund details.
 *
 * @param {tskRefundType} params - Parameters for the query.
 * @param {string} queryName - Name of the query to be executed.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 *
 * @example
 * dispatch(getTskRefundDetails({ exampleParam: 'exampleValue' }, 'queryName'));
 */
export const getTskRefundDetails =
  (params: tskRefundType, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.TskDetails.length > 0) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.TSKRefund.TSKRefundTSKEligible.moduleName, {
            Status: true,
            Eligible: true,
            [MoengageMixpanelModules.TSKRefund.TSKRefundTSKEligible.attributes.SubscriberID]: params?.subscriberId,
          });
          dispatch(sliceActions.setTskRefundData(data));
          dispatch(formActions.setFormUpdated(true));
        } else {
          dispatch(uiActions.showErrorPage(response.message));
        }
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Sets the default TSK refund data by clearing it.
 *
 * @returns {AppThunk} A thunk that dispatches the action to clear TSK refund data.
 *
 * @example
 * dispatch(setDefaultTsk());
 */

export const setDefaultTsk = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.clearTskRefundData());
};

/**
 * Performs a TSK refund operation.
 *
 * @param {tskRefundType} params - Parameters for the query.
 * @param {string} queryName - Name of the query to be executed.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 *
 * @example
 * dispatch(doTskRefund({ selectedTsk: { TskSno: '123', activityUID: 'abc', DealerCode: 'xyz' }, subscriberId: '456', pin: '789' }, 'queryName'));
 */

export const doTskRefund =
  (params: tskRefundType, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const tskValues = state.tskRefund.data;

    const payload = {
      tskSerialNumber: params.selectedTsk.TskSno,
      salesOrderNum: tskValues.salesOrderNum,
      woNumber: tskValues.woNumber,
      subscriberId: params.subscriberId,
      evdPin: params.pin,
      dealerCode: params.selectedTsk.DealerCode,
    };

    dispatch(uiActions.setLoader());
    api
      .get(queries[queryName], payload)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.TSKRefund.TSKRefundProceed.moduleName, {
          Status: true,
          [MoengageMixpanelModules.TSKRefund.TSKRefundProceed.attributes.SubscriberID]: params?.subscriberId,
        });
        dispatch(uiActions.showAlert(data.refundMessage, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(formActions.setFormUpdated(false));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
