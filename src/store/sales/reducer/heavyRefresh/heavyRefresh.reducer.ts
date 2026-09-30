/**
 * reducer for heavy refresh action
 *
 * @module store/reducer/heavyRefresh
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { heavyRefreshType } from 'store/sales/types/heavyRefresh';

/**
 * Initial state for the heavyRefresh reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: heavyRefreshType = {
  text: 'reducer created',
};

/**
 * Slice representing the heavyRefresh reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/heavyRefresh';
 * dispatch(actions.heavyRefreshStart());
 * dispatch(actions.heavyRefreshSuccess(data));
 */
const heavyRefreshSlice = createSlice({
  name: 'heavyRefresh',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    heavyRefreshStart() {
      return initialState;
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    heavyRefreshSuccess() {
      return initialState;
    },
  },
});

export const { actions } = heavyRefreshSlice;

export default heavyRefreshSlice.reducer;
