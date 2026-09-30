/**
 * Redux files for evdTransfer reducer
 *
 * @module store/reducer/evdTransfer
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { evdTransferType } from 'store/sales/types/evdTransfer';

/**
 * Initial state for the evdTransfer reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: evdTransferType = {
  evdTransferData: {},
  evdTransferSuccessData: {},
};

/**
 * Slice representing the evdTransfer reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}

 */
const evdTransferSlice = createSlice({
  name: 'evdTransfer',
  initialState,
  reducers: {
    setEvdTransferData(state, action: PayloadAction<any>) {
      return {
        ...state,
        evdTransferData: action.payload,
      };
    },
    setEvdTransferSuccessData(state, action: PayloadAction<any>) {
      return {
        ...state,
        evdTransferSuccessData: action.payload,
      };
    },
  },
});

export const { actions } = evdTransferSlice;

export default evdTransferSlice.reducer;
