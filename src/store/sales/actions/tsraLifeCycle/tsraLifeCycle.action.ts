/**
 * tsra reducer will be responcible for tsra life cycle actions
 *
 * @module store/sales/actions/tsraLifeCycle
 *
 */
import { sliceActions } from 'store/sales/reducer/tsraLifeCycle';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { extractValues, filterByParams } from 'utils/formBuilderHelper';
import { FORMS, STATE_KEY } from 'const';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(demoBoxDetailsAction({ exampleParam: 'exampleValue' }));
 */
export const tsrafilter =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], { ...params })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formActions.setMultipleDropdownOptionsData(data));
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
 * dispatch(demoBoxDetailsAction({ exampleParam: 'exampleValue' }));
 */
export const trackTsraRequest =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    // Dispatch loader action
    dispatch(uiActions.setLoader());
    const obj = extractValues(params);
    try {
      const requestInput = {
        input: {
          days: String(obj.daysFilter),
          status: obj.statusFilter,
          formName: FORMS.trackTsraRequest,
          type: null,
        },
      };

      // Make the API request
      const response = await api.post(queries[queryName], { ...requestInput });

      // Refactor the response data
      const data = refactorResponse(response);
      if (data?.tsraTrack?.length > 0) {
        // Dispatch the action to update Redux store with fetched data
        dispatch(commonActions.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.tsraTrack }));
        return { data, status: true };
      }
      dispatch(commonActions.setErrorMessage(data?.message));
      return { data, status: false };

      // Return success response
    } catch (error: any) {
      // Handle error by dispatching the error page action
      dispatch(uiActions.showErrorPage(error.message));

      // Return failure response
      return { status: false };
    } finally {
      // Always clear the loader after the operation
      dispatch(uiActions.clearLoader());
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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const searchTrackTsraRequest =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    const requestInput = {
      partnerName: params?.searchText,
      partnerCode: params?.searchText,
    };
    const filteredData = filterByParams(tableData, requestInput);
    dispatch(commonActions.setTableFilteredData({ result: filteredData }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(tsraLifeCycleAction({ exampleParam: 'exampleValue' }));
 */
export const trackTsraAction =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTsraSubscriberList(data?.tsraTrack));
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
 * dispatch(tsraLifeCycleAction({ exampleParam: 'exampleValue' }));
 */
export const getTsraPartnerDetails =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.partnerDetails) dispatch(formActions.setFormValues({ ...data?.partnerDetails }));
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
 * dispatch(demoBoxDetailsAction({ exampleParam: 'exampleValue' }));
 */
export const getTsraDropDowns =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], { ...params })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formActions.setMultipleDropdownOptionsData(data));
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
 * dispatch(updateEvdTransfer({ exampleParam: 'exampleValue' }));
 */

export const tsraActionApprovedReject =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { formValues } = getState().form[STATE_KEY.FORM_STATE];

    const partnerDetails = formValues;
    const requestInput = {
      input: {
        partnerCode: partnerDetails.partnerCode,
        firstName: params.firstName,
        lastName: params.lastName,
        mobileNumber1: params.mobileNumber1,
        mobileNumber2: params.mobileNumber2,
        qualification: params.qualification,
        isTwoWheelerAvailable: params.isTwoWheelerAvailable,
        tsraInstallerType: params.tsraInstallerType,
        tsraStatus: params.actionType,
      },
    };
    return api
      .post(queries[queryName], extractValues(requestInput))
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTsraSuccessData(data));
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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const resetTsraSubscriberList = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetTsraSubscriberList());
};
