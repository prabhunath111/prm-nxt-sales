/**
 * In this reducer we will manage all recharge winback related information
 *
 * @module store/reducer/rechargeWinback
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { rechargeWinbackType } from 'store/sales/types/rechargeWinback';

/**
 * Initial state for the rechargeWinback reducer.
 *
 * @type {object}
 * @property {object} winbackPackageOffersDetails - this object will contain information about the package offers
 */

const initialState: rechargeWinbackType = {
  winBackPacks: [],
  winBackSubscriberList: {},
  winbackConfigProperties: {},
  subscriberDetails: {},
  subscriberRmn: {},
  winBackSuccessData: {},
  winBackPack: {},
  filteredSubscriberList: {},
  campaignName: '',
  uniqueKwlrtyNumber: {},
};

/**
 * Slice representing the rechargeWinback reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/rechargeWinback';
 * dispatch(actions.rechargeWinbackStart());
 * dispatch(actions.rechargeWinbackSuccess(data));
 */
const rechargeWinbackSlice = createSlice({
  name: 'rechargeWinback',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    rechargeWinbackStart(state) {
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
    winbackConfigProperties(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        winbackConfigProperties: action.payload,
      };
    },

    /**
     * Action to handle subscriber list successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    winBackSubscriberList(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        winBackSubscriberList: action.payload,
      };
    },

    /**
     * Action to handle winback packs successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    winBackPacks(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        winBackPacks: action.payload,
      };
    },

    /**
     * Action to handle subscriber details successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSubscriberDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        subscriberDetails: action.payload,
      };
    },

    /**
     * Action to store rmn of the subscriber
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSubscriberRmn(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        subscriberRmn: action.payload,
      };
    },

    /**
     * Action to handle subscriber duccess details successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    winBackSuccessData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        winBackSuccessData: action.payload,
      };
    },

    /**
     * Action to handle winback packs successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setWinBackPack(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        winBackPack: action.payload,
      };
    },

    /**
     * Action to handle filtered subscriber list successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setFilteredSubscriberList(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        filteredSubscriberList: action.payload,
      };
    },

    /**
     * Action to set campaign name successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setCampaignName(state, action: PayloadAction<string>) {
      return {
        ...state,
        campaignName: action.payload,
      };
    },
    /**
     * Action to set campaign name successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setUniqueKwlrtyNumber(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        uniqueKwlrtyNumber: action.payload,
      };
    },
  },
});

export const { actions } = rechargeWinbackSlice;

export default rechargeWinbackSlice.reducer;
