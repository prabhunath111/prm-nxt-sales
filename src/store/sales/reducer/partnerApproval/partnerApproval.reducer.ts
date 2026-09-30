/**
 * In this reducer we will manage all partner approval information
 *
 * @module store/sales/reducer/partnerApproval
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { partnerApprovalType } from 'store/sales/types/partnerApproval';

/**
 * Initial state for the partnerApproval reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: partnerApprovalType = {
  dropDownListAndRejectReasons: {},
  partnerList: [],
  partnerApprovalSuccessData: {},
  selectedPartner: {},
  initialData: {},
  dropDownDataList: {},
  showDynamicNoData: false,
};

/**
 * Slice representing the partnerApproval reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/partnerApproval';
 * dispatch(actions.partnerApprovalStart());
 * dispatch(actions.partnerApprovalSuccess(data));
 */
const partnerApprovalSlice = createSlice({
  name: 'partnerApproval',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    partnerApprovalStart(state) {
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
    setDropDownListAndRejectReasons(state, action: PayloadAction<any>) {
      return {
        ...state,
        dropDownListAndRejectReasons: action.payload,
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
    setPartnerList(state, action: PayloadAction<any>) {
      return {
        ...state,
        partnerList: action.payload,
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
    setPartnerApprovalSuccessData(state, action: PayloadAction<any>) {
      return {
        ...state,
        partnerApprovalSuccessData: action.payload,
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
    setSelectedPartner(state, action: PayloadAction<any>) {
      return {
        ...state,
        selectedPartner: action.payload,
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
    setInitialData(state, action: PayloadAction<any>) {
      return {
        ...state,
        initialData: action.payload,
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
    setDropDownDataList(state, action: PayloadAction<any>) {
      return {
        ...state,
        dropDownDataList: action.payload,
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
    setShowDynamicNoData(state, action: PayloadAction<any>) {
      return {
        ...state,
        showDynamicNoData: action.payload,
      };
    },
  },
});

export const { actions } = partnerApprovalSlice;

export default partnerApprovalSlice.reducer;
