/**
 * Handles the common functionality store
 *
 * @module store/actions/common
 *
 */

import { sliceActions } from 'store/sales/reducer/common';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { LangVariable, ParentObject } from 'store/sales/types/common';
import { refactorResponse } from 'utils/responseHelper';
import { LOG } from 'config/logger';
import { STRINGS } from 'const';

/**
 * Fetches languages from the server.
 * @param {LangVariable} params - The parameters for fetching languages.
 * @returns {AppThunk} A thunk action.
 */
export const getLanguages =
  (params: LangVariable): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.getLanguageStart());
    return api
      .get(queries.GET_LANGUAGE_QUERY, params)
      .then((response) => {
        const data = refactorResponse(response);
        sliceActions.getLanguageSuccess(data);
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)));
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
export const resendOTPWithOutSubId = (): AppThunk => (dispatch) =>
  api
    .post(queries.generateOTPWithOutSubId, {})
    .then((response) => {
      const data = refactorResponse(response);
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
export const setErrorMessage =
  (message: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setErrorMessage({ message: message?.split(`${STRINGS.APOLLO_ERROR}: `)[1] ?? message }));
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
export const reSetErrorMessage = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.reSetErrorMessage());
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const reSetCustomAmount = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.reSetCustomAmount());
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
export const setAllTableData =
  (tableData: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setTableColumnData({ tableColumns: tableData?.tableColumns, tableData: tableData?.result }));
    dispatch(sliceActions.setDealerDetail({ dealerDetails: tableData?.dealerDetails }));
  };
/**
 * Updates the table state with filtered data.
 *
 * This action is used to set the table's filtered data based on the provided input.
 * It extracts the `result` property from the input `data` and updates the state with it.
 *
 * @function setTableFilteredData
 * @param {object} data - The data object containing the filtered table results.
 * @param {Array} data.result - The filtered data to be set in the table state.
 * @returns {AppThunk} A thunk action that dispatches the `setTableFilteredData` action to update the state.
 *
 * @example
 * // Usage example in a React component
 * const filteredData = { result: [{ id: 1, name: 'Example' }, { id: 2, name: 'Sample' }] };
 * dispatch(setTableFilteredData(filteredData));
 */
export const setTableFilteredData =
  (data: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setTableFilteredData({ tableData: data?.result }));
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
export const setTableColumnData =
  (data: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setTableColumnData({ tableColumns: data?.tableColumns, tableData: data?.result }));
  };

export const setToggleSwitchEnabled =
  (key: string, value: boolean): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setToggleSwitchEnabled({ [key]: value }));
  };

export const setDealerDetails =
  (data: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setDealerDetail({ dealerDetails: data }));
  };

export const setWebViewUrl =
  (url: string | null): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setWebViewUrl({ url }));
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

          dispatch(sliceActions.setCustomAmount({ ...data }));
          return { status: true, data };
        })
        .catch((error: any) => {
          LOG.info(error);
          return { status: false, data: [] };
        });
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
export const setCustomFormData =
  (formData: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setCustomFormData(formData));
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
export const resetCustomFormData = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetCustomFormData());
};

/**
 * Resets the table state by dispatching the reset action from the slice.
 *
 * This action is used to clear any existing data or filters associated with the table,
 * ensuring that the state is restored to its initial state.
 *
 * @function resetTable
 * @returns {AppThunk} A thunk action that dispatches the `resetTable` action from the slice.
 *
 * @example
 * // Usage example in a React component
 * dispatch(resetTable());
 */
export const resetTable = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetTable());
};

/**
 * Resets the table state by dispatching the reset action from the slice.
 *
 * This action is used to clear any existing data or filters associated with the table,
 * ensuring that the state is restored to its initial state.
 *
 * @function resetTable
 * @returns {AppThunk} A thunk action that dispatches the `resetTable` action from the slice.
 *
 * @example
 * // Usage example in a React component
 * dispatch(resetTable());
 */
export const resetCommonStore = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetCommonStore());
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setTotalListCount({ exampleParam: 'exampleValue' }));
 */

export const setTotalListCount =
  (data: number): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.totalListCount(data));
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
export const getHotelSubscriptionURL =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], { ...params })
      .then((response) => {
        const data = refactorResponse(response);
        return { status: true, data };
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };
