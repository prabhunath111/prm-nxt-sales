/**
 * for Tsk cancellation
 *
 * @module store/sales/reducer/tskCancellation
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tskCancellationType } from 'store/sales/types/tskCancellation';
import { ParentObject } from 'store/sales/types/common';

/**
 * Initial state for the tskCancellation reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: tskCancellationType = {
  cancelTskValidateData: {},
};

/**
 * Slice representing the tskCancellation reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/tskCancellation';
 * dispatch(actions.tskCancellationStart());
 * dispatch(actions.tskCancellationSuccess(data));
 */
const tskCancellationSlice = createSlice({
  name: 'tskCancellation',
  initialState,
  reducers: {
    setCancelTskValidateData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        cancelTskValidateData: action.payload,
      };
    },
  },
});

export const { actions } = tskCancellationSlice;

export default tskCancellationSlice.reducer;
