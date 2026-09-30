/**
 * In this reducer we will manage all competitor data related information
 *
 * @module store/sales/actions/competitorDataCapture
 *
 */

import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, QUERY } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { sliceActions } from 'store/sales/reducer/competitorDataCapture';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { callAction } from 'utils/formBuilderHelper';
import { Sizing } from 'styles';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Displays the Competitor Data Capture modal.
 *
 * @function modelForCompetitorDataCapture
 * @returns {void}
 */
export const modelForCompetitorDataCapture =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCapturePageVisit.moduleName, {
      [MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCapturePageVisit.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.COMPETITOR_DATA_CAPTURE,
        showCloseIcon: params?.showCloseIcon || true,
        showHeader: true,
        formName: FORMS.competitorDataCapture,
        headerIcon: ICONS.COMPETITOR_DATA_CAPTURE,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(doBalanceEnquire({ exampleParam: 'exampleValue' }));
 */
export const doBalanceEnquire =
  (params: ParentObject, queryName: string, _stateKey: any, _navigate: any): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      input: {
        id: params?.subscriberInfo,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureValidateEVDRMN.moduleName, {
          [MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureValidateEVDRMN.attributes.Status]: true,
          [MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureValidateEVDRMN.attributes.iD]: params?.subscriberInfo,
        });
        dispatch(sliceActions.setBalanceEnquireData(data));
        dispatch(commonActions.setDealerDetails({ evdCode: data?.evdId, mdn: data?.mdn, name: data?.childName }));
        dispatch(callAction({}, QUERY.CompetitorBoxTypeFilter));
        dispatch(callAction({}, QUERY.CompetitorServiceProviderFilter));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(competitorBoxTypeFilter({ exampleParam: 'exampleValue' }));
 */
export const competitorBoxTypeFilter =
  (_params: ParentObject, queryName: string, _stateKey: any, _navigate: any): AppThunk =>
  (dispatch) =>
    api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formActions.setMultipleDropdownOptionsData({ boxType: data?.competitorBoxTypeFilter }));
        return { status: true, data };
      })
      .catch((error: any) => ({ status: false, message: error.message }))
      .finally(() => dispatch(uiActions.clearLoader()));

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(competitorServiceProviderFilter({ exampleParam: 'exampleValue' }));
 */
export const competitorServiceProviderFilter =
  (_params: ParentObject, queryName: string, _stateKey: any, _navigate: any): AppThunk =>
  (dispatch) =>
    api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formActions.setMultipleDropdownOptionsData({ serviceProvider: data?.serviceProviderFilter }));
        return { status: true, data };
      })
      .catch((error: any) => ({ status: false, message: error.message }))
      .finally(() => dispatch(uiActions.clearLoader()));

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(doBalanceEnquire({ exampleParam: 'exampleValue' }));
 */
export const captureCompetitorData =
  (params: ParentObject, queryName: string, _stateKey: any, _navigate: any): AppThunk =>
  (dispatch, getState) => {
    const { balanceEnquireData } = getState().competitorDataCapture;
    dispatch(uiActions.setLoader());
    const isValidRMN = typeof balanceEnquireData?.recipientRMN === 'string' && balanceEnquireData.recipientRMN.length === Sizing.x10;
    const requestInput = {
      input: {
        activation: params?.monthlyActivation || '',
        competitorName: params?.serviceProvider?.nameNT,
        highestSellingBoxType: params?.boxType?.nameNT,
        recharge: params?.monthlyRecharge || '',
        tskLandingRate: params?.kitLandingRate || '',
        tskStock: params?.kitStock || '',
        evdId: isValidRMN ? '' : balanceEnquireData?.recipientRMN,
        mdn: isValidRMN ? balanceEnquireData?.recipientRMN : '',
      },
    };

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureSubmit.moduleName, {
          [MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureSubmit.attributes.Status]: true,
          [MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureSubmit.attributes.details]: requestInput,
        });
        dispatch(sliceActions.competitorDataCaptureSuccess(data));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
