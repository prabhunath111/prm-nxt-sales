/**
 * In this reducer we will manage all EVD MDN change related information
 *
 * @module store/actions/evdMdnChange
 *
 */
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, MODAL, QUERY, ROUTE, STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { LOG } from 'config/logger';
import { sliceActions } from 'store/sales/reducer/evdMdnChange';
import { extractValues, filterByParams } from 'utils/formBuilderHelper';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(generateOTP({ exampleParam: 'exampleValue' }));
 */
export const generateOTP =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    api
      .post(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.transStatusNT === STRINGS.SUCCESS) {
          dispatch(uiActions.clearLoader());
          const state = getState();
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.OTP_MODAL,
              headerTitle: '',
              data: { mdn: state.user.info.mdn, ...params },
              showCloseIcon: false,
              showHeader: true,
              isCenterModal: true,
              formName: FORMS.evdMdnChange,
              buttonInfo: {
                otpButtonLabel: STRINGS.PROCEED_TO_CHANGE,
                sentToTitle: STRINGS.SENTTO,
                queryName: QUERY.updateEvdMdn,
                hasEvdLink: true,
              },
            }),
          );
        } else {
          dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
        }
        return { status: false, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        LOG.info(error);
        return { status: false, message: error.message };
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
 * dispatch(updateEvdMdn({ exampleParam: 'exampleValue' }));
 */
export const updateEvdMdn =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    const requestInput = {
      input: {
        newMdn: params?.newMobileNumber,
        otp: params?.otp,
        type: params?.type,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data.status) {
          dispatch(sliceActions.evdMdnChangeSuccess(data));
        }
        if (params?.type === STRINGS.DISTRIBUTOR) {
          dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
        }
        return { status: true, data };
      })
      .catch((error: any) => {
        if (params?.type === STRINGS.DISTRIBUTOR) {
          dispatch(uiActions.showErrorPage(error.message));
        }
        LOG.info(error);
        return { status: false, message: error.message };
      });
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(mdnChangePartnerList({ exampleParam: 'exampleValue' }));
 */
export const mdnChangePartnerList =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        status: null,
        days: null,
        type: STRINGS.ACTION_MDN,
        formName: STRINGS.TRACK_EVD_MDN_CHANGE,
      },
    };
    return api
      .post(queries.mdnChangeAppOrRejList, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.info?.length > 0) {
          dispatch(sliceActions.setEvdMdnPartnerList(data));
          return { status: true, data };
        }
        dispatch(sliceActions.resetEvdMdnPartnerList());
        return { data, status: false };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        LOG.info(error);
        return { status: false, message: error.message };
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
 * dispatch(mdnChangePartnerList({ exampleParam: 'exampleValue' }));
 */
export const searchEvdMdnChangePartnerList =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { evdMdnPartnerList } = getState().evdMdnChange;
    const requestInput = {
      partnerId: params?.searchText,
      partnerName: params?.searchText,
    };
    const filteredData = filterByParams(evdMdnPartnerList, requestInput);
    dispatch(sliceActions.setEvdMdnPartnerFilteredList({ result: filteredData }));
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
export const mdnChangeAppOrRejList =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch, getState) => {
    // Dispatch loader action
    dispatch(uiActions.setLoader());
    const obj = extractValues(params);
    try {
      const commonData = getState().common;
      const customFormData = commonData?.customFormData;
      const customDateRange = customFormData?.evdMdnChangeFilter?.customDateRange;

      let { daysFilter } = obj;
      if (daysFilter === STRINGS.CUSTOM_DATE_RANGE) {
        if (customDateRange) {
          daysFilter = customDateRange;
        }
      }

      const requestInput = {
        input: {
          days: String(daysFilter),
          status: obj.statusFilter,
          formName: STRINGS.TRACK_EVD_MDN_CHANGE,
          type: STRINGS.TRACK_MDN,
        },
      };

      // Make the API request
      const response = await api.post(queries[queryName], { ...requestInput });

      // Refactor the response data
      const data = refactorResponse(response);
      if (data?.info?.length > 0) {
        // Dispatch the action to update Redux store with fetched data
        dispatch(commonActions.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.info }));
        return { data, status: true };
      }
      dispatch(commonActions.setErrorMessage(data?.message));
      return { data, status: false };

      // Return success response
    } catch (error: any) {
      // Handle error by dispatching the error page action
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA} ${error}`);

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
 * dispatch(demoBoxDetailsAction({ exampleParam: 'exampleValue' }));
 */
export const evdMdnfilter =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    // Dispatch loader action
    dispatch(uiActions.setLoader());
    try {
      // Make the API request
      const response = await api.get(queries[queryName], { ...params });

      // Refactor the response data
      const data = refactorResponse(response);

      // Dispatch the action to update Redux store with fetched data
      dispatch(formActions.setMultipleDropdownOptionsData(data));
      return { data, status: true };

      // Return success response
    } catch (error: any) {
      // Handle error by dispatching the error page action
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA} ${error}`);

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
 * dispatch(partnerConfirmation({ exampleParam: 'exampleValue' }));
 */
export const partnerConfirmation =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    try {
      if (params?.actionType === STRINGS.MDN_CHANGE_APPROVE) {
        api
          .post(queries.generateOTPWithMobile, {
            mobile: params?.input?.newRmn,
          })
          .then((response) => {
            const data = refactorResponse(response);
            if (data?.transStatus === STRINGS.SUCCESS) {
              dispatch(uiActions.clearLoader());
              dispatch(
                uiActions.showBottomModal({
                  isModalVisible: true,
                  type: CHILD_TYPE.OTP_MODAL,
                  headerTitle: '',
                  data: { mdn: params?.input?.newRmn, ...params },
                  showCloseIcon: false,
                  showHeader: true,
                  isCenterModal: true,
                  buttonInfo: {
                    otpButtonLabel: STRINGS.PROCEED_TO_CHANGE,
                    sentToTitle: STRINGS.SENTTO,
                    queryName: QUERY.ApproveOTPforEVDChange,
                  },
                }),
              );
            }
          });
      } else if (params?.actionType === STRINGS.MDN_CHNAGE_REJECT) {
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            type: CHILD_TYPE.DYNAMIC_FORM,
            headerTitle: HEADER_TITLE.REASON_FOR_REJECTION,
            showCloseIcon: true,
            showHeader: true,
            formName: FORMS.evdMdnChangeReason,
          }),
        );
      }
      return { params, status: true, queryName };
    } catch (error: any) {
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA} ${error}`);
      return { status: false };
    } finally {
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
 * dispatch(evdMdnChangeStatus({ exampleParam: 'exampleValue' }));
 */
export const evdMdnChangeStatus =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { evdMdnNavigationData } = getState().form;
    const userData = evdMdnNavigationData?.data;
    const requestInput = {
      input: {
        partnerName: userData.partnerName,
        partnerId: userData.partnerId,
        oldRmn: userData.oldRmn,
        newRmn: userData.newRmn,
        type: STRINGS.REJECTED,
        reason: params?.reasonForRejection,
        mdnStatus: userData?.mdnStatus,
        requestId: userData?.requestId,
      },
    };
    return api
      .post(queries.evdMdnChangeStatus, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setEvdMdnDistSuccessData(data));
        return { status: true };
      })
      .catch((error: any) => {
        LOG.info(error);
        return { status: false };
      });
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

export const searchTrackEvdMdnChange =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    const requestInput = {
      partnerNameNT: params?.searchText,
      statusNT: params?.searchText,
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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const resetEvdMdnDistSuccessData = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetEvdMdnDistSuccessData());
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

export const resetEvdMdnPartnerList = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetEvdMdnPartnerList());
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(approveOTPforEVDChange({ exampleParam: 'exampleValue' }));
 */
export const approveOTPforEVDChange =
  (params: ParentObject): AppThunk =>
  async (dispatch) => {
    const payload = {
      ...params?.input,
      otp: params?.otp,
    };
    try {
      if (params?.actionType === STRINGS.MDN_CHANGE_APPROVE) {
        const response = await api.post(queries.evdMdnChangeStatus, { input: payload });
        const data = refactorResponse(response);
        dispatch(sliceActions.setEvdMdnDistSuccessData(data));
        dispatch(uiActions.hideBottomModal());
        if (response?.status) {
          return { status: true, routeName: ROUTE.WEB.EVD_MDN_DISTRIBUTER_SUCCESS };
        }
      }
      return { params, status: true };
    } catch (error: any) {
      dispatch(uiActions.hideBottomModal());
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA} ${error}`);
      return { status: false };
    } finally {
      dispatch(uiActions.clearLoader());
    }
  };
