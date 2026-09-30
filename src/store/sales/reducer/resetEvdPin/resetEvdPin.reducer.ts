/**
 * reset evd pin acrion
 *
 * @module store/reducer/resetEvdPin
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { resetEvdPinType } from 'store/sales/types/resetEvdPin';

/**
 * Initial state for the resetEvdPin reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: resetEvdPinType = {};

/**
 * Slice representing the resetEvdPin reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/resetEvdPin';
 * dispatch(actions.resetEvdPinStart());
 * dispatch(actions.resetEvdPinSuccess(data));
 */
const resetEvdPinSlice = createSlice({
  name: 'resetEvdPin',
  initialState,
  reducers: {},
});

export const { actions } = resetEvdPinSlice;

export default resetEvdPinSlice.reducer;
