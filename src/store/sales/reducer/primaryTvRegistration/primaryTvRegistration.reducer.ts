/**
 * it manage all primary tv related actions
 *
 * @module store/sales/reducer/primaryTvRegistration
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { primaryTvRegistrationType } from 'store/sales/types/primaryTvRegistration';

/**
 * Initial state for the primaryTvRegistration reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: primaryTvRegistrationType = {
  tskValidateData: {},
  isBoxMismatchConfirmed: false,
};

/**
 * Slice representing the primaryTvRegistration reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/primaryTvRegistration';
 * dispatch(actions.primaryTvRegistrationStart());
 * dispatch(actions.primaryTvRegistrationSuccess(data));
 */
const primaryTvRegistrationSlice = createSlice({
  name: 'primaryTvRegistration',
  initialState,
  reducers: {
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTskValidateData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tskValidateData: action.payload,
      };
    },
    setIsBoxMismatchConfirmed(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isBoxMismatchConfirmed: action.payload,
      };
    },
  },
});

export const { actions } = primaryTvRegistrationSlice;

export default primaryTvRegistrationSlice.reducer;
