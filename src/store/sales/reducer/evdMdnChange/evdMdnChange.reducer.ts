/**
 * In this reducer we will manage all EVD MDN change related information
 *
 * @module store/reducer/evdMdnChange
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { evdMdnChangeType } from 'store/sales/types/evdMdnChange';

/**
 * Initial state for the evdMdnChange reducer.
 *
 * @type {object}
 * @property {object} evdMdnChangeData - EVD MDN change data for success screen
 */

const initialState: evdMdnChangeType = {
  evdMdnChangeData: {},
  evdMdnPartnerList: [],
  evdMdnPartnerFilteredList: [],
  evdMdnDistSuccessData: {},
};

/**
 * Slice representing the evdMdnChange reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/evdMdnChange';
 * dispatch(actions.evdMdnChangeStart());
 * dispatch(actions.evdMdnChangeSuccess(data));
 */
const evdMdnChangeSlice = createSlice({
  name: 'evdMdnChange',
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
    evdMdnChangeSuccess(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        evdMdnChangeData: action.payload,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setEvdMdnPartnerList(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        evdMdnPartnerList: action.payload?.info,
        evdMdnPartnerFilteredList: action.payload?.info,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setEvdMdnPartnerFilteredList(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        evdMdnPartnerFilteredList: action.payload?.result,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state with the payload data.
     */
    resetEvdMdnPartnerList(state) {
      return {
        ...state,
        evdMdnPartnerList: [],
        evdMdnPartnerFilteredList: [],
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setEvdMdnDistSuccessData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        evdMdnDistSuccessData: action.payload,
      };
    },
    /**
     * resetEvdMdnDistSuccessData.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state with the payload data.
     */
    resetEvdMdnDistSuccessData(state) {
      return {
        ...state,
        evdMdnDistSuccessData: {},
      };
    },
  },
});

export const { actions } = evdMdnChangeSlice;

export default evdMdnChangeSlice.reducer;
