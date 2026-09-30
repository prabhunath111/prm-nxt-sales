/**
 * store demo box details reducer
 *
 * @module store/reducer/demoBoxDetails
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { demoBoxDetailsType } from 'store/sales/types/demoBoxDetails';

/**
 * Initial state for the demoBoxDetails reducer.
 *
 * @type {object}
 * @property {array} demoBoxDetails - Default text for the initial state.
 */

const initialState: demoBoxDetailsType = {};

/**
 * Slice representing the demoBoxDetails reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/demoBoxDetails';
 * dispatch(actions.demoBoxDetailsStart());
 * dispatch(actions.demoBoxDetailsSuccess(data));
 */
const demoBoxDetailsSlice = createSlice({
  name: 'demoBoxDetails',
  initialState,
  reducers: {},
});

export const { actions } = demoBoxDetailsSlice;

export default demoBoxDetailsSlice.reducer;
