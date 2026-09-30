/**
 * we add reducer, action and query for evd transfer for asm
 *
 * @module store/reducer/evdTransferAsm
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { evdTransferAsmType } from 'store/sales/types/evdTransferAsm';

/**
 * Initial state for the evdTransferAsm reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: evdTransferAsmType = {
  text: 'reducer created',
};

/**
 * Slice representing the evdTransferAsm reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/evdTransferAsm';
 * dispatch(actions.evdTransferAsmStart());
 * dispatch(actions.evdTransferAsmSuccess(data));
 */
const evdTransferAsmSlice = createSlice({
  name: 'evdTransferAsm',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    evdTransferAsmStart(state) {
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
    evdTransferAsmSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        payloadDate: action.payload,
      };
    },
  },
});

export const { actions } = evdTransferAsmSlice;

export default evdTransferAsmSlice.reducer;
