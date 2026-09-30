/**
 * In this reducer we will manage all Manage Hierarchy related items
 *
 * @module store/sales/reducer/manageHierarchy
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { manageHierarchyType } from 'store/sales/types/manageHierarchy';

/**
 * Initial state for the manageHierarchy reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: manageHierarchyType = {
  manageHierarchyDisDetails: [],
  outletResponseAndLanguages: {},
  townCodeCCPartnerDetials: {},
  dealerDetailsCCPartner: {},
  ccPartnerSuccessData: {},
  isIspValid: false,
  isFormModified: false,
  validationAttemptCount: 0,
  reportType: 'Recharge',
  dateType: {},
  distributerListData: {},
  distributerIdData: {},
  successRoleTypeData: {},
};

/**
 * Slice representing the manageHierarchy reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/manageHierarchy';
 * dispatch(actions.manageHierarchyStart());
 * dispatch(actions.manageHierarchySuccess(data));
 */
const manageHierarchySlice = createSlice({
  name: 'manageHierarchy',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    manageHierarchyStart(state) {
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
    manageHierarchySuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        ccPartnerSuccessData: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setManageHierarchyDisDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        manageHierarchyDisDetails: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setOutletResponseAndLanguages(state, action: PayloadAction<any>) {
      return {
        ...state,
        outletResponseAndLanguages: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTownCodeCCPartnerDetials(state, action: PayloadAction<any>) {
      return {
        ...state,
        townCodeCCPartnerDetials: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setDealerDetailsCCPartner(state, action: PayloadAction<any>) {
      return {
        ...state,
        dealerDetailsCCPartner: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setIspCodeValidation(state, action: PayloadAction<any>) {
      return {
        ...state,
        isIspValid: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setIsFormModified(state, action: PayloadAction<any>) {
      return {
        ...state,
        isFormModified: action.payload,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setReportType(state, action: PayloadAction<string>) {
      return {
        ...state,
        reportType: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setDateType(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        dateType: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    incrementValidationAttempt(state) {
      return {
        ...state,
        validationAttemptCount: state.validationAttemptCount + 1,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setDistributerListData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        distributerListData: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setDistributerIdData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        distributerIdData: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSuccessRoleTypeData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        successRoleTypeData: action.payload,
      };
    },
  },
});

export const { actions } = manageHierarchySlice;

export default manageHierarchySlice.reducer;
