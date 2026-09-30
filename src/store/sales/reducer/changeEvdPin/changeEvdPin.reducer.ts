/**
 * reducer for ChangeEVDPin action
 *
 * @module store/reducer/changeEvdPin
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { changeEvdPinType } from 'store/sales/types/changeEvdPin';
import { ParentObject } from 'store/sales/types/common';

/**
 * Initial state for the changeEvdPin reducer.
 *
 * @type {object}
 * @property {object} data - data of the changeEvdPin response
 */

const initialState: changeEvdPinType = {
  data: {},
};

/**
 * Slice representing the changeEvdPin reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/changeEvdPin';
 * dispatch(actions.changeEvdPinStart());
 * dispatch(actions.changeEvdPinSuccess(data));
 */
const changeEvdPinSlice = createSlice({
  name: 'changeEvdPin',
  initialState,
  reducers: {
    changeEvdPinSuccess(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
});

export const { actions } = changeEvdPinSlice;

export default changeEvdPinSlice.reducer;
