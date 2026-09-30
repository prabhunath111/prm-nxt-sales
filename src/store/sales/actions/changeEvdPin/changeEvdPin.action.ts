/**
 * reducer for ChangeEVDPin action
 *
 * @module store/actions/changeEvdPin
 *
 */
import { sliceActions } from 'store/sales/reducer/changeEvdPin';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { changeEvdPinType } from 'store/sales/types/changeEvdPin';
import { refactorResponse } from 'utils/responseHelper';
import { ALERT, MODAL } from 'const';
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
 * dispatch(changeEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const changeEvdPin =
  (params: changeEvdPinType): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        oldPin: params?.oldPin,
        newPin: params?.newPin,
      },
    };
    return api
      .post(queries.CHANGE_EVD_PIN_QUERY, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true, closeView: true }, {}));
        dispatch(sliceActions.changeEvdPinSuccess(data));
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ChangeEVDPin.ChangeEVDPinSubmit.moduleName, {
          Status: true,
          [MoengageMixpanelModules.ChangeEVDPin.ChangeEVDPinSubmit.attributes.Status]: true,
          [MoengageMixpanelModules.ChangeEVDPin.ChangeEVDPinSubmit.attributes.Success]: true,
        });
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };
