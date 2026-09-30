/**
 * this will have all form and its related actions
 *
 * @module store/actions/form
 *
 */
import { sliceActions } from 'store/sales/reducer/form';
import { AppThunk } from 'store';
import uiActions from 'store/sales/actions/ui';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { callAction } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import { DealerDetails, subIdListType, slabListType } from 'store/sales/types/form';
/**
 * Fetches dropdown options data from the server.
 * @param {ParentObject} params - The parameters for fetching dropdown options data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const fetchOptionData =
  (params: ParentObject, queryName: string, stateKey?: string): AppThunk =>
  (dispatch) => {
    if (params) {
      api
        .post(queries[queryName], params)
        .then((response) => {
          const data = refactorResponse(response);
          dispatch(sliceActions.setMultipleDropdownOptionsData({ data, queryName, stateKey }));
          return data;
        })
        .catch(() => {
          dispatch(sliceActions.setMultipleDropdownOptionsData({ data: [], queryName, stateKey }));
        });
    } else {
      dispatch(sliceActions.setMultipleDropdownOptionsData({ data: [], queryName, stateKey }));
    }
  };

/**
 * Reset dropdown options data from the server.
 * @param {string} queryName - The name of the query.
 * @param {object[]} data - get data
 * @returns {AppThunk} A thunk action.
 */
export const resetOptionData =
  (queryName: string, data: object[], stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setDropdownOptionsData({ data, queryName, stateKey }));
  };

export const setMultipleDropdownOptionsData =
  (data: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setMultipleDropdownOptionsData({ data, stateKey }));
  };

/**
 * Fetches dependent data from the server.
 * @param {ParentObject} params - The parameters for fetching dependent data.
 * @param {string} queryName - The name of the query.
 * @param {string} dependentField - The name of the dependentField.
 * @returns {AppThunk} A thunk action.
 */
export const fetchDependentData =
  (params: ParentObject, queryName: string, dependentField: string, stateKey?: string): AppThunk =>
  (dispatch) => {
    if (params) {
      api
        .get(queries[queryName], params)
        .then((response) => {
          const data = refactorResponse(response);
          dispatch(sliceActions.setDependentData({ data, queryName, dependentField, stateKey }));
          return data;
        })
        .catch(() => {
          dispatch(
            sliceActions.setDependentData({
              data: [],
              queryName,
              dependentField,
              stateKey,
            }),
          );
        });
    } else {
      dispatch(
        sliceActions.setDependentData({
          data: [],
          queryName,
          dependentField,
          stateKey,
        }),
      );
    }
  };

/**
 * Fetches form builder json from the server.
 * @param {ParentObject} params - The parameters for fetching form.
 * @returns {AppThunk} A thunk action.
 */

export const getFormData =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    // Skip API for transactionHistory
    const skipForms = [
      'transactionHistory',
      'customerDetails',
      'confirmReversal',
      'exclusiveStoreOpening',
      'exclusiveStoreClosing',
      'demoForm',
      'myOffersViewDetails',
      'rePushOrderChannels',
      'primaryRegistrationChannels',
      'woRecreationChannels',
      'eTSKRegistrationChannels',
      'eTSKRepushChannels',
      'quotationETSKChannels',
      'quotationPrimaryChannels',
      'primaryRegistrationSummary',
      'woRecreationSummary',
      'eTSKRegistrationSummary',
      'multiTvSummary',
      'rePushOrderSummary',
      'eTSKMultiTvSummary',
      'eTSKRepushSummary',
      'quotationETSKSummary',
      'quotationPrimarySummary',
      'quotationMultiTVSummary',
      'woMultiTvSummary',
      'competitorDataSuccess',
      'quotationMultiTVSuccess',
      'quotationPrimarySuccess',
      'quotationETSKSuccess',
      'demoAccountSuccess',
      'eTskMultiTvRepushSuccess',
      'eTskRepushSuccess',
      'eTskMultiTvSuccess',
      'rePushOrderSuccess',
      'eTskRegSuccess',
      'primaryTvRegSuccess',
      'woRecreationSuccess',
      'partnerApprovalDetails',
      'partnerApprovalSuccess',
      'actionPartnerRequest',
      'manageHierSuccess',
      'createNewDealerSuccess',
      'dealerFeedbackSuccess',
      'multiTvSucess',
      'etskOfferViewDetails',
      'primaryRegOfferDetails',
      'rePushOrderOfferDetails',
      'woRecreationOfferViewDetails',
      'etskRepushOfferViewDetails',
      'quotationETSKPackDetails',
      'boxtypeChangeViewDetails',
      'rechargeWinBackViewDetails',
      'customerOfferSuccess',
      'selectBoxType',
      'activationStatusDetails',
      'autoEvdSuccess',
      'evdTransferSuccess',
      'customerService',
      'forwardTransfer',
      'reverseTransfer',
      'actionTsraRequest',
      'actionTsraSummary',
      'tsraApprovalSuccess',
      'dealerRaiseRequest',
      'dealerTrackRequest',
      'dealerSuccess',
      'bingeRetailerDashboard',
    ];

    if (skipForms.includes(params?.formName)) {
      dispatch(
        sliceActions.setFormData({
          data: { form: {}, formTitle: '', formQuery: '' },
          stateKey,
        }),
      );

      return Promise.resolve(); // prevent API call
    }

    // Normal flow for all other forms
    dispatch(
      sliceActions.setFormData({
        data: { form: {}, formTitle: '', formQuery: '' },
        stateKey,
      }),
    );

    return api
      .post(queries.FORM_BUILDER_QUERY, params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setFormData({ data, stateKey }));
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

/**
 * Reset form builder data from current screen.
 * @param {boolean} isFormResetRequired - it is used for reset form
 * @returns {AppThunk} A thunk action.
 */
export const clearFormData =
  (isFormResetRequired: boolean, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(dispatch(sliceActions.clearFormData({ isFormResetRequired, stateKey })));
  };

/**
 * submit form request data to the server.
 * @param {ParentObject} params - The parameters for sending form request data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const submitForm =
  (params: ParentObject, queryName: string, stateKey?: string, navigate?: any): AppThunk =>
  (dispatch) =>
    dispatch(callAction(params, queryName, stateKey, navigate));
/**
 * Save route name in store
 * @param params - The parameters for fetching navigation name
 * @param queryName - The name of the query
 * @returns - A thunk action.
 */
export const setNavigationData =
  (params: ParentObject, queryName: string, formName: string, routeName: string, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(
      sliceActions.setNavigationData({
        data: {
          formName,
          queryName,
          params,
          routeName,
        },
        stateKey,
      }),
    );
  };

/**
 * set form dependent default data.
 * @param {ParentObject} params - The parameters to set default data.
 * @returns {AppThunk} A thunk action.
 */
export const setFormDependentDefault =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setFormDependentDefault({ data: params, stateKey }));
  };

/**
 * Fetches table data from the server.
 * @param {ParentObject} params - The parameters for fetching table data.
 * @param {string} tableName - The name of the table.
 * @returns {AppThunk} A thunk action.
 */
export const fetchTableData =
  (params: ParentObject, queryName: string, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTableData({ data, queryName, stateKey }));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Show alert
 * @param isMarkedForDeletion - The parameters for show alert based on this props
 * @returns - A thunk action.
 */
export const processAlertConfirmation =
  (isMarkedForDeletion: boolean, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setConfirmAlertStatus({ isMarkedForDeletion, stateKey }));
  };

/**
 * Fetches autocomplete data from the server.
 * @param {ParentObject} params - The parameters for fetching autocomplete data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const fetchAutocompleteData =
  (params: ParentObject, queryName: string, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .get(queries[queryName], params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setDropdownData({ data, queryName, stateKey }));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * reset navigation data
 * @returns {AppThunk} A thunk action.
 */
export const resetNavigationData =
  (stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(
      sliceActions.setNavigationData({
        data: {
          formName: '',
          routeName: '',
          queryName: '',
          params: {},
        },
        stateKey,
      }),
    );
  };

/**
 * set form action default data.
 * @param {ParentObject} params - The parameters to set default data.
 * @returns {AppThunk} A thunk action.
 */
export const setFormActionDefault =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setFormActionData({ data: params, stateKey }));
  };

/**
 * Set update status of form
 * @param isFormUpdated - The parameters to set form update status based on this props
 * @returns - A thunk action.
 */
export const setFormUpdated =
  (isFormUpdated: boolean, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setFormUpdatedStatus({ isFormUpdated, stateKey }));
  };

/**
 * Set update status of form
 * @param {ParentObject} params - The parameters to set updated fields data.
 * @returns - A thunk action.
 */
export const setUpdatedFormFields =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setUpdatedFormFields({ data: params, stateKey }));
  };
export const setSlabList =
  (params: slabListType[], stateKey?: string): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.setSlabList({ data: params, stateKey }));
/**
 * Sets the subscriber ID list in the form state.
 *
 * @param {subIdListType[]} params - An array of subscriber IDs to be set in the form state.
 * @returns {AppThunk} A thunk action that dispatches the subscriber ID list.
 *
 * @example
 * dispatch(setSubIdList([{ id: 'subId1' }, { id: 'subId2' }]));
 */
export const setSubIdList =
  (params: subIdListType[], stateKey?: string): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.setSubIdList({ data: params, stateKey }));

/**
 * Resets the subscriber ID list to an empty array in the form state.
 *
 * @returns {AppThunk} A thunk action that dispatches an empty subscriber ID list.
 *
 * @example
 * dispatch(setSubIdListDefault());
 */
export const setSubIdListDefault =
  (stateKey?: string): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.defaultSubIdList({ stateKey }));

/**
 * Set initial state of form
 * @param {ParentObject} params - The parameters to set formValues.
 * @returns - A thunk action.
 */
export const setFormValues =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setFormValues({ data: params, stateKey }));
  };

/**
 * Set dealer details.
 * @param {ParentObject} params - The parameters to set dealer details.
 * @returns - A thunk action.
 */
export const setDealerDetails =
  (params: DealerDetails, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setDealerDetails({ data: params, stateKey }));
  };

export const setChecklistTileDetails =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setChecklistTileDetails({ data: params?.checklistData, stateKey }));
  };
/**
 * Set the filtered data for a query in reducer.
 * @param {ParentObject} params - The filtered data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const setSearchBarItems =
  (params: ParentObject, queryName: string, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setSearchBarItems({ queryName, data: params, stateKey }));
  };

export const setOffersBasisRechargeObject =
  (offerObject: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setOffersBasisRechargeObject(offerObject));
  };
export const setOffersBasisRechargeValue =
  (offerList: ParentObject[]): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setOffersBasisRechargeValue(offerList));
  };

export const setOffersBasisRechargeValueType =
  (offerType: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setOffersBasisRechargeValueType({ offerType }));
  };

export const setRadioContainerOptions =
  (params: ParentObject, queryName?: string, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setRadioContainerOptions({ data: params, queryName, stateKey }));
  };
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(setEvdMdnNavigationData({ exampleParam: 'exampleValue' }));
 */
export const setEvdMdnNavigationData =
  (data: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setEvdMdnNavigationData({ data }));
  };

/**
 * Set the pillGroupItems array data for a query in reducer.
 * @param {ParentObject} params - The filtered data.
 * @returns {AppThunk} A thunk action.
 */

export const setPillGroupItemsArr =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setPillGroupItemsArr({ data: params, stateKey }));
  };

/**
 * Reset the form data in reducer.
 * @returns {AppThunk} A thunk action.
 */

export const resetForm = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.resetForm());
};

/**
 * Set update status of form
 * @param {ParentObject} params - The parameters to set updated fields data.
 * @returns - A thunk action.
 */
export const setFieldsToDisable =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setFieldsToDisable({ data: params, stateKey }));
  };
/**
 * Set update status of form
 * @param {ParentObject} params - The parameters to set updated fields data.
 * @returns - A thunk action.
 */
export const setFieldsToShow =
  (params: string[], stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setFieldsToShow({ data: params, stateKey }));
  };

/**
 * Reset the form query in reducer.
 * @returns {AppThunk} A thunk action.
 */

export const resetFormQuery =
  (stateKey?: string): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.resetFormQuery({ stateKey }));
  };

export const setListData =
  (params: ParentObject, stateKey?: string): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.setListData({ data: params, stateKey }));
