/**
 * this will have all form and its related actions
 *
 * @module store/reducer/form
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_KEY } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { formType } from 'store/sales/types/form';

/**
 * Initial state for the form reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialObject: formType = {
  dropdownOptions: {},
  formDependentData: {},
  formDependentDefault: {},
  formData: {},
  formActionData: {},
  formNavigationData: {
    formName: '',
    routeName: '',
    queryName: '',
    params: {},
  },
  formTitle: '',
  formQuery: '',
  tables: {},
  searchSuggestions: {},
  updatedFormFields: {},
  subIdList: [],
  slabList: [],
  isMarkedForDeletion: false,
  isFormResetRequired: false,
  isFormUpdated: false,
  formValues: {}, // set the initial values for the form if any
  dealerDetails: {
    name: '',
    mdn: '',
    evdCode: '',
    subscriberId: '',
    customerName: '',
  },
  searchBarItems: {},
  offersBasisRechargeObject: {},
  offersBasisRechargeValue: [],
  offersBasisRechargeValueType: '',
  radioContainerOptions: {},
  evdMdnNavigationData: {},
  pillGroupItemsArr: null,
  fieldsToDisable: {},
  fieldsToShow: [],
  listData: [],
  setChecklistTileDetails: [],
};

const initialState = {
  formState: {
    ...initialObject,
  },
  modalState: {
    ...initialObject,
  },
};

/**
 * Slice representing the form reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/form';
 * dispatch(actions.formStart());
 * dispatch(actions.formSuccess(data));
 */
const selectState = (state: ParentObject, stateKey: string = STATE_KEY.FORM_STATE) => (stateKey === STATE_KEY.MODAL_STATE ? state.modalState : state.formState);

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setDropdownOptionsData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.dropdownOptions = {
        ...stateToUpdate.dropdownOptions,
        [action.payload.queryName]: action.payload.data,
      };
    },
    setMultipleDropdownOptionsData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.dropdownOptions = {
        ...stateToUpdate.dropdownOptions,
        ...action.payload.data,
      };
    },
    setDependentData(state, action: PayloadAction<ParentObject>) {
      const { data, dependentField, stateKey } = action.payload;
      const stateToUpdate = selectState(state, stateKey);
      stateToUpdate.formDependentData[dependentField] = {
        value: data[0]?.[dependentField],
        id: data[0]?.id,
      };
    },
    setFormData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.formData = action.payload.data.form;
      stateToUpdate.formTitle = action.payload.data.title;
      stateToUpdate.formQuery = action.payload.data.formQuery;
    },
    setFormDependentDefault(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.formDependentDefault = action.payload.data;
    },
    setNavigationData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.formNavigationData = action.payload.data;
    },
    setTableData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.tables[action.payload.queryName] = action.payload.data;
    },
    setDropdownData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.searchSuggestions[action.payload.queryName] = action.payload.data;
    },
    setMultipleAutoCompleteData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.searchSuggestions = {
        ...stateToUpdate.searchSuggestions,
        ...action.payload.data,
      };
    },
    resetDropdownData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.searchSuggestions = {};
    },
    setConfirmAlertStatus(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.isMarkedForDeletion = action.payload.isMarkedForDeletion;
    },
    clearFormData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.isFormResetRequired = action.payload.isFormResetRequired;
    },
    setFormActionData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.formActionData = action.payload.data;
    },
    setFormUpdatedStatus(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.isFormUpdated = action.payload.isFormUpdated;
    },
    setUpdatedFormFields(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.updatedFormFields = {
        ...action.payload.data,
      };
    },
    setSubIdList(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.subIdList = action.payload.data;
    },
    setSlabList(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.slabList = action.payload.data;
    },
    setFormValues(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.formValues = action.payload.data;
    },
    setDealerDetails(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.dealerDetails = action.payload.data;
    },
    setSearchBarItems(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.searchBarItems[action.payload.queryName] = action.payload.data;
    },
    setOffersBasisRechargeObject(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.offersBasisRechargeObject = action.payload;
    },
    setOffersBasisRechargeValue(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.offersBasisRechargeValue = action.payload;
    },
    setOffersBasisRechargeValueType(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.offersBasisRechargeValueType = action.payload.offerType;
    },
    defaultSubIdList(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.subIdList = [];
    },
    setRadioContainerOptions(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.radioContainerOptions[action.payload.queryName] = action.payload.data;
    },
    setEvdMdnNavigationData(state, action: PayloadAction<any>) {
      return {
        ...state,
        evdMdnNavigationData: action.payload,
      };
    },
    setPillGroupItemsArr(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.pillGroupItemsArr = action.payload.data;
    },
    resetFormQuery(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.formQuery = '';
    },
    setChecklistTileDetails(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.setChecklistTileDetails = action.payload.data;
    },
    resetForm(state) {
      return {
        ...state,
        ...initialState,
      };
    },
    setFieldsToDisable(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.fieldsToDisable = {
        ...action.payload.data,
      };
    },
    setFieldsToShow(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.fieldsToShow = action.payload.data;
    },
    setListData(state, action: PayloadAction<ParentObject>) {
      const stateToUpdate = selectState(state, action.payload.stateKey);
      stateToUpdate.listData = action.payload.data;
    },
  },
});

export const { actions } = formSlice;

export default formSlice.reducer;
