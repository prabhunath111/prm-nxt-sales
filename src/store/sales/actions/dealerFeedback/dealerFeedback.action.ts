/**
 * manage dealer feedback actions and reducer
 *
 * @module store/sales/actions/dealerFeedback
 *
 */
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/dealerFeedback';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { filterByParams, normalizeArray } from 'utils/formBuilderHelper';
import { FORMS, ALERT, MODAL, PROPERTIES, STRINGS, PLATFORM } from 'const';
import { filterLastNDays } from 'utils/tableHelper';
import { Platform } from 'react-native';
import i18next from 'i18next';

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
export const dealerFeedbackFilter =
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
export const dealerFeedbackList =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    // Dispatch loader action
    dispatch(commonActions.setTableColumnData({ tableColumns: [], result: [] }));
    dispatch(uiActions.setLoader());
    try {
      // Make the API request
      const response = await api.post(queries[queryName], {
        ...params,
        formName: FORMS.trackDealerFeedback,
      });

      // Refactor the response data
      const data = refactorResponse(response);

      if (data?.dealerFeedbackList?.length > 0) {
        // Dispatch the action to update Redux store with fetched data
        dispatch(commonActions.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.dealerFeedbackList }));
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

export const searchTrackDealerFeedback =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    const reqStatus = normalizeArray(params?.statusFilter);
    let filteredData = tableData;

    if (reqStatus.length > 0) {
      filteredData = tableData?.filter((item: ParentObject) => reqStatus?.includes(item.status.toLowerCase()));
    }
    if (params?.day !== undefined) {
      const days = params.day === STRINGS.CUSTOM_DATE_RANGE ? params.requestedDate : params.day;

      if (days) {
        filteredData = filterLastNDays(filteredData, days);
      }
    }

    const requestInput = {
      feedbackCategoryNT: params?.searchText || params?.dealerSearch,
      feedbackSubCategoryNT: params?.searchText || params?.dealerSearch,
      requestId: params?.searchText || params?.dealerSearch,
    };
    if (params?.searchText || params?.dealerSearch) {
      filteredData = filterByParams(filteredData, requestInput);
    }

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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const raiseFeedback =
  (params: ParentObject): AppThunk =>
  async (dispatch) => {
    dispatch(sliceActions.setValidateSubscriber({ isSubscriberValid: false, message: '' }));
    const applyDelay = Platform.OS !== PLATFORM.WEB;
    dispatch(sliceActions.setRadioFeedbackSelected(params?.dealerFeedbackList));
    if (applyDelay) {
      setTimeout(() => {
        dispatch(formActions.setFormValues({ dealerFeedback: params?.dealerFeedbackList }));
      }, 500);
    } else {
      dispatch(formActions.setFormValues({ dealerFeedback: params?.dealerFeedbackList }));
    }
    return { data: params, status: true };
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

export const setValidateSubscriber =
  (params: ParentObject): AppThunk =>
  async (dispatch) => {
    dispatch(sliceActions.setValidateSubscriber(params));
  };

/**
 * Validates a subscriber's information.
 *
 * @param {ParentObject} params - The parameters for the validation request.
 * @param {string} queryName - The name of the query to validate the subscriber.
 * @returns {AppThunk} A thunk action for dispatching.
 */

export const validateSubscriberId =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status === PROPERTIES.DEALER_FEEDBACK.success) {
          dispatch(sliceActions.setValidateSubscriber({ isSubscriberValid: true, message: data.message }));
          dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
        } else {
          dispatch(sliceActions.setValidateSubscriber({ isSubscriberValid: false, message: data.message }));
          dispatch(uiActions.showErrorPage(data.message));
        }
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
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const submitFeedback =
  (params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    const { isSubscriberValid } = getState().dealerFeedback;
    dispatch(uiActions.setLoader());
    const selectedMonths: string[] = [];

    // Loop through each possible month and check if it's selected in params;

    PROPERTIES.DEALER_FEEDBACK.monthNames.forEach((month) => {
      if (params?.[month]) {
        selectedMonths.push(month);
      }
    });

    // Convert array to a comma-separated string
    const monthsString = selectedMonths?.join(', ');
    const feedbackSubCategory = params?.days || params?.description || params?.subscriberId || monthsString;
    const requestInput = {
      input: {
        feedbackCategory: params?.dealerFeedback,
        feedbackSubCategory,
      },
    };

    if (
      (params?.dealerFeedback === PROPERTIES.DEALER_FEEDBACK.CMSSchemeAmountNotReceived || params?.dealerFeedback === PROPERTIES.DEALER_FEEDBACK.installationPaymentNotReceived) &&
      selectedMonths.length <= 0
    ) {
      dispatch(uiActions.clearLoader());
      dispatch(uiActions.showAlert(PROPERTIES.DEALER_FEEDBACK.pleaseSelectMonth, ALERT.ERROR, { primaryText: MODAL.OK, clearForm: true }, {}));
      return { status: false };
    }

    if (params?.dealerFeedback === PROPERTIES.DEALER_FEEDBACK.installationNotHappeningOnTime && !isSubscriberValid) {
      dispatch(uiActions.clearLoader());
      dispatch(uiActions.showAlert(PROPERTIES.DEALER_FEEDBACK.pleaseValidateSubscriberId, ALERT.ERROR, { primaryText: MODAL.OK, clearForm: true }, {}));
      return { status: false };
    }

    return api
      .post(queries.submitFeedback, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setDealerSuccess(data));
        return { status: true };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, error };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const showRelevantField = (): AppThunk => (dispatch, getState) => {
  const { radioFeedbackSelected } = getState().dealerFeedback;

  const fieldMapping: Record<string, string[]> = {
    [i18next.t('raiseFeedbackList.Installation not happening on time')]: ['validate', 'subscriberId'],
    [i18next.t('raiseFeedbackList.Distributor Sales Representative (DSR) not visited')]: ['days'],
    [i18next.t('raiseFeedbackList.I am not getting distributor support')]: ['description'],
    [i18next.t('raiseFeedbackList.ASI is not able to resolve the issue')]: ['description'],
    [i18next.t('raiseFeedbackList.I am not able to get EVD or TSK stock')]: ['description'],
    [i18next.t('raiseFeedbackList.I am not getting visibility material')]: ['description'],
    [i18next.t('raiseFeedbackList.I am not getting digital leaflets')]: ['description'],
    [i18next.t('raiseFeedbackList.Only If TSRA - Installation material not available')]: ['description'],
    [i18next.t('raiseFeedbackList.Scheme (CMS) amount not received')]: [
      'February',
      'April',
      'June',
      'August',
      'October',
      'December',
      'January',
      'March',
      'May',
      'July',
      'September',
      'November',
      'selectMonth',
    ],
    [i18next.t('raiseFeedbackList.Only If TSRA - Installation payment not received')]: [
      'February',
      'April',
      'June',
      'August',
      'October',
      'December',
      'January',
      'March',
      'May',
      'July',
      'September',
      'November',
      'selectMonth',
    ],
    [i18next.t('raiseFeedbackList.Other issue')]: ['description'],
  };

  setTimeout(() => {
    const fieldsToShow = fieldMapping[radioFeedbackSelected];

    if (fieldsToShow) {
      dispatch(formActions.setFieldsToShow(fieldsToShow));
    }
  }, 200);
};
