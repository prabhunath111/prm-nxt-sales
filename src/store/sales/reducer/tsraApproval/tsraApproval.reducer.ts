/**
 * This is the reducer for tsra approcal module.
 *
 * @module store/sales/reducer/tsraApproval
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tsraApprovalType } from 'store/sales/types/tsraApproval';

/**
 * Initial state for the tsraApproval reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: tsraApprovalType = {
  tsraTableData: {},
  tsraApprovalListData: {},
  selectedDealer: {},
  tsraSuccessData: {},
};

/**
 * Slice representing the tsraApproval reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/tsraApproval';
 * dispatch(actions.tsraApprovalStart());
 * dispatch(actions.tsraApprovalSuccess(data));
 */
const tsraApprovalSlice = createSlice({
  name: 'tsraApproval',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    tsraApprovalStart(state) {
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
    setTsraTableData(state, action: PayloadAction<any>) {
      return {
        ...state,
        tsraTableData: action.payload,
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
    setTsraApprovalListData(state, action: PayloadAction<any>) {
      return {
        ...state,
        tsraApprovalListData: action.payload,
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
    setSelectedDealer(state, action: PayloadAction<any>) {
      return {
        ...state,
        selectedDealer: action.payload,
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
    setTsraSuccessData(state, action: PayloadAction<any>) {
      return {
        ...state,
        tsraSuccessData: action.payload,
      };
    },
  },
});

export const { actions } = tsraApprovalSlice;

export default tsraApprovalSlice.reducer;
