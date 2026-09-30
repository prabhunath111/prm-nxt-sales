/**
 * Redux store for customer offers
 *
 * @module store/reducer/customerOffers
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';

/**
 * Initial state for the customerOffers reducer.
 *
 * @type {ParentObject}
 * @property {object} offersData - Stores the data for available customer offers.
 * @property {object} selectedOfferData - Stores the data for the currently selected offer.
 * @property {boolean} isOfferRemoved - removes offer.
 */

const initialState: ParentObject = {
  offersData: {},
  selectedOfferData: {},
  isOfferRemoved: false,
};

/**
 * Slice representing the customerOffers reducer.
 *
 * @constant {Slice} customerOffersSlice - The slice containing actions and reducers for customer offers.
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice} - The created slice with actions and reducer logic for customer offers.
 *
 * @example
 * import { actions } from 'store/reducer/customerOffers';
 * dispatch(actions.setOffersData(data));
 * dispatch(actions.setSelectedOfferData(offer));
 * dispatch(actions.handleRemoveOffer(isOfferRemoved));
 */
const customerOffersSlice = createSlice({
  name: 'customerOffers',
  initialState,
  reducers: {
    setOffersData: (state, action) => ({
      ...state,
      offersData: action.payload,
    }),
    setSelectedOfferData: (state, action) => ({
      ...state,
      selectedOfferData: action.payload,
    }),
    handleRemoveOffer: (state, action) => ({
      ...state,
      isOfferRemoved: action.payload,
    }),
  },
});

export const { actions } = customerOffersSlice;

export default customerOffersSlice.reducer;
