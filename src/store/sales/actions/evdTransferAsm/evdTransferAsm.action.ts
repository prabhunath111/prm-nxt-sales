/**
 * we add reducer, action and query for evd transfer for asm
 *
 * @module store/actions/evdTransferAsm
 *
 */
import { sliceActions as asmActions } from 'store/sales/reducer/evdTransfer';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as commonAction } from 'store/sales/reducer/common';
import formActions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { LOG } from 'config/logger';
import { ALERT, MODAL, PROPERTIES, QUERY, STATE_KEY, STRINGS } from 'const';

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
export const getFosDealerList =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (params?.FOS) {
      api
        .post(queries[queryName], { input: { type: PROPERTIES.ROLES.fos, search: '', rmn: params?.FOS } })
        .then((response) => {
          const data = refactorResponse(response);
          dispatch(formAction.setDropdownOptionsData({ data: data?.getFosDealerList, queryName }));
          return { status: true, data: data?.getFosDealerList };
        })
        .catch((error: any) => {
          dispatch(uiActions.showAlert(error.message?.split(`${STRINGS.APOLLO_ERROR}:`)[1], ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
          dispatch(formActions.resetOptionData(QUERY.GetFosDealerList, []));
          LOG.info(error);
          return { status: false, data: [] };
        });
    } else if (params?.Dealer) {
      api
        .post(queries[queryName], { input: { type: PROPERTIES.ROLES.dealer, search: '', rmn: String(params?.Dealer) } })
        .then((response) => {
          const data = refactorResponse(response);
          dispatch(formAction.setDropdownData({ data: data?.getFosDealerList, queryName }));
          return { status: true, data: data?.getFosDealerList };
        })
        .catch((error: any) => {
          dispatch(uiActions.showAlert(error.message?.split(`${STRINGS.APOLLO_ERROR}:`)[1], ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
          LOG.info(error);
          return { status: false, data: [] };
        });
    } else if (queryName && params?.searchKeyword) {
      const { searchSuggestions } = getState().form[STATE_KEY.FORM_STATE];
      dispatch(formAction.setDropdownData({ data: searchSuggestions[queryName], queryName, stateKey: STATE_KEY.FORM_STATE }));
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
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const asmReverseTransfer =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        childMdn: String(params?.selectDealer?.object?.mdn),
        childName: params?.selectDealer?.name,
        amount: params?.customAmount,
        mdn: String(params?.fosDropdown?.object?.mdn),
      },
    };
    return api
      .post(queries[queryName], { ...requestInput })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(asmActions.setEvdTransferSuccessData(data));
        dispatch(formActions.setNavigationData({ transferType: PROPERTIES.EVD_TRANSFER.asmTransfer }, '', '', ''));
        return { status: true, data: { ...data } };
      })
      .catch((error: any) => {
        LOG.info(error);
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, data: [] };
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
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const getBalanceFos =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    if (params?.searchLocally) {
      api
        .post(queries[queryName], { input: { mdn: String(params?.searchLocally) } })
        .then((response) => {
          const data = refactorResponse(response);

          dispatch(commonAction.setCustomAmount({ ...data }));
          return { status: true, data };
        })
        .catch((error: any) => {
          LOG.info(error);
          return { status: false, data: [] };
        });
    }
  };
