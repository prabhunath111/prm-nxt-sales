/**
 * this is the reducer for the etsk repush module
 *
 * @module store/sales/reducer/etskRepush
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { etskRepushType } from 'store/sales/types/etskRepush';

/**
 * Initial state for the etskRepush reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: etskRepushType = {
  repushStatusData: {},
};

/**
 * Slice representing the etskRepush reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/etskRepush';
 * dispatch(actions.etskRepushStart());
 * dispatch(actions.etskRepushSuccess(data));
 */
const etskRepushSlice = createSlice({
  name: 'etskRepush',
  initialState,
  reducers: {
    /**
     * Action to add repush status api data
     *
     * @etskRepushSetRepushStatusData
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskRepushSetRepushStatusData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        repushStatusData: action.payload,
      };
    },
  },
});

export const { actions } = etskRepushSlice;

export default etskRepushSlice.reducer;
