/**
 * store demo box details reducer
 *
 * @module store/actions/demoBoxDetails
 *
 */
import commonActions from 'store/sales/actions/common';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { LOG } from 'config/logger';
import { CHILD_TYPE, FORMS, STATE_KEY, STRINGS } from 'const';
import { formatFilter } from 'utils/formBuilderHelper';
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
 * dispatch(demoBoxDetailsAction({ exampleParam: 'exampleValue' }));
 */
export const demoBoxDetails =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    // Dispatch loader action
    dispatch(uiActions.setLoader());
    dispatch(formActions.setUpdatedFormFields({ accountStatus: '', boxType: '' }));
    try {
      const key = params.evdCode || params.dealerName || '';

      // Make the API request
      const response = await api.get(queries[queryName], { key, subscriberId: params.subscriberId || '' });

      // Refactor the response data
      const data = refactorResponse(response);
      if (data?.result?.length > 0) {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.demoBoxDetail.DemoBoxDetail.moduleName, {
          [MoengageMixpanelModules.demoBoxDetail.DemoBoxDetail.attributes.Status]: true,
          [MoengageMixpanelModules.demoBoxDetail.DemoBoxDetail.attributes.subscriberID]: params.subscriberId || '',
          [MoengageMixpanelModules.demoBoxDetail.DemoBoxDetail.attributes.evdCode]: params.evdCode || params.dealerName || '',
          [MoengageMixpanelModules.demoBoxDetail.DemoBoxDetail.attributes.mdn]: key,
        });
        // Dispatch the action to update Redux store with fetched data
        dispatch(commonActions.setAllTableData(data));
        return { data, status: true };
      }
      dispatch(commonActions.setErrorMessage(data?.message));
      return { data, status: false };

      // Return success response
    } catch (error: any) {
      // Handle error by dispatching the error page action
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`Error occurred while fetching Demo Box Details: ${error}`);

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
export const searchDemoBoxDetails =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { dealerDetails } = getState().common;
    const { formNavigationData } = getState().form[STATE_KEY.FORM_STATE];

    if (!dealerDetails?.dealerId) {
      return { status: false }; // Explicit return when there's no dealerId
    }
    return api
      .get(queries[queryName], {
        dealerId: dealerDetails.dealerId,
        subscriberId: formNavigationData?.params?.subscriberId,
        search: params?.searchText || params?.subscriberDetailsSearch,
        accountStatusFilter: formatFilter(params?.accountStatus),
        boxTypeFilter: formatFilter(params?.boxType),
      })
      .then((response) => {
        const data = refactorResponse(response);

        dispatch(commonActions.setTableColumnData(data));
        return { data, status: true };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        LOG.info(`Error occurred while fetching Demo Box Details: ${error}`);
        return { status: false };
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
 * dispatch(changeDealer({ exampleParam: 'exampleValue' }));
 */
export const changeDealer =
  (_params: ParentObject): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.DYNAMIC_FORM,
          headerTitle: FORMS.demoBoxDetails,
          showCloseIcon: true,
          showHeader: true,
          formName: FORMS.demoBoxDetail,
        }),
      );
      return { status: true };
    } catch (error: any) {
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA} ${error}`);
      return { status: false };
    } finally {
      dispatch(uiActions.clearLoader());
    }
  };
