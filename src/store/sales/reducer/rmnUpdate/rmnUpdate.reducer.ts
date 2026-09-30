/**
 * Redux component for rmnUpdate module.
 *
 * @module store/reducer/rmnUpdate
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { rmnUpdateType } from 'store/sales/types/rmnUpdate';

/**
 * Initial state for the rmnUpdate reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: rmnUpdateType = {
  text: 'reducer created',
};

/**
 * Slice representing the rmnUpdate reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/rmnUpdate';
 */
const rmnUpdateSlice = createSlice({
  name: 'rmnUpdate',
  initialState,
  reducers: {},
});

export const { actions } = rmnUpdateSlice;

export default rmnUpdateSlice.reducer;
