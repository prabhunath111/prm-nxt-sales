/**
 * in this user can check their tsk details
 *
 * @module store/sales/reducer/tskVoucher
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { tskVoucherType } from 'store/sales/types/tskVoucher';

/**
 * Initial state for the tskVoucher reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: tskVoucherType = {
  tskDetails: {},
};

/**
 * Slice representing the tskVoucher reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/tskVoucher';
 * dispatch(actions.tskVoucherStart());
 * dispatch(actions.tskVoucherSuccess(data));
 */
const tskVoucherSlice = createSlice({
  name: 'tskVoucher',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    tskVoucherStart(state) {
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
    tskVoucherSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        payloadDate: action.payload,
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
    tskVoucherDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tskDetails: action.payload,
      };
    },
  },
});

export const { actions } = tskVoucherSlice;

export default tskVoucherSlice.reducer;
