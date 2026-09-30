/**
 * This reducer will have package information and  FAQ
 *
 * @module store/reducer/packageInformation
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { packageInformationType } from 'store/sales/types/packageInformation';

/**
 * Initial state for the packageInformation reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: packageInformationType = {
  packageInformation: {},
};

/**
 * Slice representing the packageInformation reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/packageInformation';
 * dispatch(actions.packageInformationStart());
 * dispatch(actions.packageInformationSuccess(data));
 */
const packageInformationSlice = createSlice({
  name: 'packageInformation',
  initialState,
  reducers: {
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    packageInformationSuccess(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        packageInformation: action.payload,
      };
    },
  },
});

export const { actions } = packageInformationSlice;

export default packageInformationSlice.reducer;
