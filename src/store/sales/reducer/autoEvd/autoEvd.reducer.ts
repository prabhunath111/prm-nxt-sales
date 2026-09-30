/**
 * Redux components for the autoEvdTransfer module.
 *
 * This module contains the reducer logic and actions for managing the state
 * of dealer details and the dealer list in the `autoEvdTransfer` feature.
 *
 * @module store/reducer/autoEvd
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { autoEvdType, DealerData, EvdData } from 'store/sales/types/autoEvd';
import { ParentObject } from 'store/sales/types/common';

/**
 * Initial state for the autoEvd reducer.
 *
 * @type {autoEvdType}
 * @property {object} dealerDetails - Contains details of the dealer.
 * @property {Array<DealerData>} dealersList - List of all dealers.
 */

const initialState: autoEvdType = {
  dealerDetails: {
    name: '',
    mdn: '',
    outletType: '',
    presentBalance: '',
    avgDailyRecharge: '',
    thresholdSet: '',
    evdCode: '',
  },
  evdSuccessData: {
    message: '',
    dealerName: '',
    status: true,
  },
  dealersList: [],
  autoEvdNavigationData: {},
  autoEvdCurrentValues: {},
  autoEvdDealerList: [],
};

/**
 * Slice representing the autoEvd reducer.
 *
 * The slice includes actions to update dealer details and the list of dealers.
 *
 * @constant
 * @type {Slice}
 * @param {autoEvdType} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice} The autoEvd slice object, which includes actions and the reducer.
 *
 * @example
 * import { actions } from 'store/reducer/autoEvd';
 * dispatch(actions.setDealerDetails(dealerData));
 * dispatch(actions.setDealersList(dealerList));
 */
const autoEvdSlice = createSlice({
  name: 'autoEvd',
  initialState,
  reducers: {
    setDealerDetails(state, action: PayloadAction<DealerData>) {
      return {
        ...state,
        dealerDetails: action.payload,
      };
    },
    setDealersList(state, action: PayloadAction<DealerData[]>) {
      return {
        ...state,
        dealersList: action.payload,
      };
    },
    setEvdSuccessData(state, action: PayloadAction<EvdData>) {
      return {
        ...state,
        evdSuccessData: action.payload,
      };
    },
    setAutoEvdNavigationData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        autoEvdNavigationData: action.payload,
      };
    },
    setAutoEvdCurrentValues(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        autoEvdCurrentValues: action.payload,
      };
    },
    setAutoEvdDealerList(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        autoEvdDealerList: action.payload,
      };
    },
  },
});

export const { actions } = autoEvdSlice;

export default autoEvdSlice.reducer;
