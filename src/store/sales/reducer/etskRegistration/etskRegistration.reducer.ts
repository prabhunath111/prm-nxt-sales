/**
 * This is to add the actions for etsk registration module
 *
 * @module store/sales/reducer/etskRegistration
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { etskRegistrationType } from 'store/sales/types/etskRegistration';

/**
 * Initial state for the etskRegistration reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: etskRegistrationType = {
  pincode: '',
  validatePinCodeSuccessData: {},
  packSelected: '',
  freePackSelected: '',
  primaryBoxPrice: '0',
  boxTypeSelected: '',
  selectedPacksToBuy: [],
  finalPrice: '0',
  categorySelectedRed: undefined,
  durationSelectedRed: undefined,
  selctedPillRed: 'New Customer Best Offers',
  categorySelectedPacksData: [],
  accountCreationSuccessData: {},
  validatePacksSuccessData: {},
  filtersData: {},
  customerDetails: {},
  boxTypeData: {},
  paidPrice: '0',
  categoryDropdownDataRed: [],
  durationDropdownDataRed: [],
  flexiPlan: 0,
  evdPin: '',
  etskAlertConfirm: false,
};

/**
 * Slice representing the etskRegistration reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/etskRegistration';
 * dispatch(actions.etskRegistrationStart());
 * dispatch(actions.etskRegistrationSuccess(data));
 */
const etskRegistrationSlice = createSlice({
  name: 'etskRegistration',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    etskRegistrationStart(state) {
      return { ...state };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskSetValidatePinCodeSuccessData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        validatePinCodeSuccessData: action.payload,
      };
    },
    etskSetAccountCreationSuccessData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        accountCreationSuccessData: action.payload,
      };
    },
    etskSetPackSelected(state, action: PayloadAction<string>) {
      return {
        ...state,
        packSelected: action.payload,
      };
    },
    etskSetFreePackSelected(state, action: PayloadAction<string>) {
      return {
        ...state,
        freePackSelected: action.payload,
      };
    },
    etskSetPrimaryBoxPrice(state, action: PayloadAction<string>) {
      return {
        ...state,
        primaryBoxPrice: action.payload,
      };
    },
    etskSetFinalPrice(state, action: PayloadAction<string>) {
      return {
        ...state,
        finalPrice: action.payload,
      };
    },
    etskSetPaidPrice(state, action: PayloadAction<string>) {
      return {
        ...state,
        paidPrice: action.payload,
      };
    },
    etskSetBoxTypeSelected(state, action: PayloadAction<string>) {
      return {
        ...state,
        boxTypeSelected: action.payload,
      };
    },
    etskSetCategorySelectionPacksData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        categorySelectedPacksData: action.payload,
      };
    },
    etskClearSelectedPacksToBuyData(state) {
      return {
        ...state,
        selectedPacksToBuy: [],
      };
    },
    etskAddSelectedPacksToBuyData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        selectedPacksToBuy: [...state.selectedPacksToBuy, action.payload],
      };
    },
    etskRemoveSelectedPacksToBuyData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        selectedPacksToBuy: state.selectedPacksToBuy.filter((item) => item.siebelName !== action.payload.siebelName),
      };
    },
    etskSetValidatePacksSuccessData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        validatePacksSuccessData: action.payload,
      };
    },
    etskSetCustomerDetailsData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        customerDetails: action.payload,
      };
    },
    etskSetFiltersData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        filtersData: action.payload,
      };
    },
    etskSetBoxType(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        boxTypeData: action.payload,
      };
    },
    etskSetCategorySelected(state, action: PayloadAction<ParentObject | undefined>) {
      return {
        ...state,
        categorySelectedRed: action.payload,
      };
    },
    etskSetDurationSelected(state, action: PayloadAction<ParentObject | undefined>) {
      return {
        ...state,
        durationSelectedRed: action.payload,
      };
    },
    etskSetSelectedPill(state, action: PayloadAction<string>) {
      return {
        ...state,
        selctedPillRed: action.payload,
      };
    },
    etskSetCategoryDropdownData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        categoryDropdownDataRed: action.payload,
      };
    },
    etskSetDurationDropdownData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        durationDropdownDataRed: action.payload,
      };
    },
    etskSetFlexiPlan(state, action: PayloadAction<number>) {
      return {
        ...state,
        flexiPlan: action.payload,
      };
    },
    etskSetEvdPin(state, action: PayloadAction<string>) {
      return {
        ...state,
        evdPin: action.payload,
      };
    },
    setEtskAlertConfirm(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        etskAlertConfirm: action.payload,
      };
    },
  },
});

export const { actions } = etskRegistrationSlice;

export default etskRegistrationSlice.reducer;
