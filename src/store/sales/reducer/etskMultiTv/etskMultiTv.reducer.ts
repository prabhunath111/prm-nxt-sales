/**
 * This is the main reducer for the module etsk multi tv
 *
 * @module store/sales/reducer/etskMultiTv
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { EtskMultiTvType } from 'store/sales/types/etskMultiTv';

/**
 * Initial state for the etskMultiTv reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: EtskMultiTvType = {
  subscriberData: {},
  subscriberId: '',
  boxSelectedDetails: {},
  boxType: '',
  offerSelected: '',
  subscriberIdRepush: '',
};

/**
 * Slice representing the etskMultiTv reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/etskMultiTv';
 * dispatch(actions.etskMultiTvStart());
 * dispatch(actions.etskMultiTvSuccess(data));
 */
const etskMultiTvSlice = createSlice({
  name: 'etskMultiTv',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    etskMultiTvStart(state) {
      return { ...state };
    },

    /**
     * Action to add the data once subscriber id/RMN is verified
     *
     * @etskMultiTvSetSubscriberData
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskMultiTvSetSubscriberData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        subscriberData: action.payload,
      };
    },
    /**
     * Action to add subscriber id entered by user
     *
     * @etskMultiTvSetSubscriberId
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskMultiTvSetSubscriberId(state, action: PayloadAction<string>) {
      return {
        ...state,
        subscriberId: action.payload,
      };
    },
    /**
     * Action to add billing summary data
     *
     * @etskSetMultiBoxSelectedDetails
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskSetMultiBoxSelectedDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        boxSelectedDetails: action.payload,
      };
    },

    /**
     * Action to add box type selected by user
     *
     * @etskMultiTvSetBoxTypeSelected
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskMultiTvSetBoxTypeSelected(state, action: PayloadAction<string>) {
      return {
        ...state,
        boxType: action.payload,
      };
    },
    /**
     * Action to add offer selected by user
     *
     * @etskMultiTvSetOfferSelected
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskMultiTvSetOfferSelected(state, action: PayloadAction<string>) {
      return {
        ...state,
        offerSelected: action.payload,
      };
    },

    /**
     * Action to add subscriber id entered by user in multi tv repush
     *
     * @etskMultiTvRepushSetSubscriberId
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    etskMultiTvRepushSetSubscriberId(state, action: PayloadAction<string>) {
      return {
        ...state,
        subscriberIdRepush: action.payload,
      };
    },
  },
});

export const { actions } = etskMultiTvSlice;

export default etskMultiTvSlice.reducer;
