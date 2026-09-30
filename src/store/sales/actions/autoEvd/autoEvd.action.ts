/**
 * Redux components for autoEvdTransfer module
 *
 * @module store/actions/autoEvd
 *
 */
import { sliceActions } from 'store/sales/reducer/autoEvd';
import formActions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { CHILD_TYPE, HEADER_TITLE, MODAL, QUERY, ROUTE, STRINGS } from 'const';
import { autoEvdFilterData } from 'utils/formBuilderHelper';
import { LOG } from 'config/logger';
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
 * dispatch(dealerSearch({ exampleParam: 'exampleValue' }));
 */
export const dealerSearch =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formActions.setSearchBarItems(data?.info, queryName));
        dispatch(sliceActions.setAutoEvdDealerList(data?.info));
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
 * dispatch(autoEvdFilter({ exampleParam: 'exampleValue' }));
 */

export const autoEvdFilter =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { autoEvdDealerList } = getState().autoEvd;
    const requestInput = {
      search: params?.searchText || params?.dealerSearchBar,
      thresHoldValue: params?.thresholdDropdown,
      priceValue: params?.balanceRangeDropdown,
    };

    const filteredData = autoEvdFilterData(autoEvdDealerList, requestInput);
    dispatch(formActions.setSearchBarItems(filteredData, QUERY.dealerSearch));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(addOrUpdateDeleteEvdTransfer({ exampleParam: 'exampleValue' }));
 */

export const addOrUpdateDeleteEvdTransfer =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { autoEvdNavigationData } = getState().autoEvd;
    const userDetails = autoEvdNavigationData?.data;
    const requestInput = {
      input: {
        dealerId: userDetails.dealerId,
        dealerName: userDetails.dealerName,
        status: userDetails.status,
        thresholdAmount: params.thresholdLimitValue,
        reqBalance: params.autoEvdAmount,
        type: STRINGS.ADD,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setEvdSuccessData(data));
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

export const updateEvdTransfer =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { autoEvdNavigationData, autoEvdCurrentValues } = getState().autoEvd;
    const userDetails = autoEvdNavigationData?.data;
    const currentValues = autoEvdCurrentValues?.data;
    if (params?.thresholdLimitValue === currentValues?.minBalance && params?.autoEvdAmount === currentValues?.reqBalance) {
      dispatch(uiActions.clearLoader());
      return dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.CONFIRMATION,
          showCloseIcon: true,
          showHeader: false,
          buttonInfo: {
            primaryButtonLabel: MODAL.OK,
            childData: HEADER_TITLE.NO_CHANGE_FOR_AUTO_EVD_UPDATE,
            centerLabel: true,
          },
        }),
      );
    }
    const requestInput = {
      input: {
        dealerId: userDetails.dealerId,
        dealerName: userDetails.dealerName,
        status: userDetails.status,
        thresholdAmount: params.thresholdLimitValue,
        reqBalance: params.autoEvdAmount,
        type: STRINGS.UPDATE,
      },
    };
    return api
      .post(queries.addOrUpdateDeleteEvdTransfer, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setEvdSuccessData(data));
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.autoEVDTransfer.Update_Auto_EVD_Transfer.moduleName, {
          [MoengageMixpanelModules.autoEVDTransfer.Update_Auto_EVD_Transfer.attributes.Status]: true,
          [MoengageMixpanelModules.autoEVDTransfer.Update_Auto_EVD_Transfer.attributes.autoEVDTransferAmount]: params.autoEvdAmount,
          [MoengageMixpanelModules.autoEVDTransfer.Update_Auto_EVD_Transfer.attributes.thresholdLimitValue]: params.thresholdLimitValue,
        });
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
 * dispatch(deleteEvdTransfer({ exampleParam: 'exampleValue' }));
 */

export const deleteEvdTransfer =
  (params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    const { autoEvdNavigationData } = getState().autoEvd;
    const userDetails = autoEvdNavigationData?.data;
    const requestInput = {
      input: {
        dealerId: userDetails?.dealerId,
        dealerName: userDetails?.dealerName,
        status: userDetails?.status,
        thresholdAmount: params?.thresholdLimitValue,
        reqBalance: params?.autoEvdAmount,
        type: STRINGS.DELETE,
      },
    };
    try {
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.CONFIRMATION,
          showCloseIcon: true,
          showHeader: true,
          buttonInfo: {
            primaryButtonLabel: MODAL.YES_PROCEED,
            secondaryButtonLabel: MODAL.CANCEL,
            queryName: STRINGS.DELETE_AUTO_EVD_TRANSFER,
            queryParams: { ...requestInput },
            childData: STRINGS.DELETE_AUTO_EVD_TRANSFER,
          },
        }),
      );
      return { params, status: true };
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
 * dispatch(deleteAutoEvdTransfer({ exampleParam: 'exampleValue' }));
 */

export const deleteAutoEvdTransfer =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries.addOrUpdateDeleteEvdTransfer, params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setEvdSuccessData(data));
        return { status: true, routeName: ROUTE.WEB.AUTO_EVD_SUCCESS };
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
 * dispatch(setAutoEvdNavigationData({ exampleParam: 'exampleValue' }));
 */

export const setAutoEvdNavigationData =
  (data: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setAutoEvdNavigationData({ data }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setAutoEvdNavigationData({ exampleParam: 'exampleValue' }));
 */

export const setAutoEvdCurrentValues =
  (data: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setAutoEvdCurrentValues({ data }));
  };
