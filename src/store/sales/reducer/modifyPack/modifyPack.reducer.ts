/**
 * reducer for modify pack
 *
 * @module store/sales/reducer/modifyPack
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { modifyPackType } from 'store/sales/types/modifyPack';

/**
 * Initial state for the modifyPack reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: modifyPackType = {
  packSelectorAccountInfo: [],
  userRole: '',
  manageAppsRMN: '',
};

/**
 * Slice representing the modifyPack reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/modifyPack';
 * dispatch(actions.modifyPackStart());
 * dispatch(actions.modifyPackSuccess(data));
 */
const modifyPackSlice = createSlice({
  name: 'modifyPack',
  initialState,
  reducers: {
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<[]>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setPackSelectorAccountInfo(state, action: PayloadAction<[]>) {
      return {
        ...state,
        packSelectorAccountInfo: action.payload,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<[]>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setManageAppsUserRole(state, action: PayloadAction<string>) {
      return {
        ...state,
        userRole: action.payload,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<[]>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setManageAppsRMN(state, action: PayloadAction<string>) {
      return {
        ...state,
        manageAppsRMN: action.payload,
      };
    },
  },
});

export const { actions } = modifyPackSlice;

export default modifyPackSlice.reducer;
