/**
 * to manage menus and form utility for application
 *
 * @module store/reducer/utility
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { utilityType } from 'store/sales/types/utility';

/**
 * Initial state for the utility reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: utilityType = {
  text: 'reducer created',
  isEngValidate: true,
};

/**
 * Slice representing the utility reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/utility';
 * dispatch(actions.utilityStart());
 * dispatch(actions.utilitySuccess(data));
 */
const utilitySlice = createSlice({
  name: 'utility',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    utilityStart(state) {
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
    utilitySuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        payloadDate: action.payload,
      };
    },

    /**
     * Action to handle english input validation.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    handleEngValidation(state, action: PayloadAction<any>) {
      return {
        ...state,
        isEngValidate: action.payload,
      };
    },
  },
});

export const { actions } = utilitySlice;

export default utilitySlice.reducer;
