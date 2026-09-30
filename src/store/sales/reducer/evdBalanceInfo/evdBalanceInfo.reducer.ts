/**
 * store the details for evdBalance info
 *
 * @module store/sales/reducer/evdBalanceInfo
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { evdBalanceInfoType } from 'store/sales/types/evdBalanceInfo';

/**
 * Initial state for the evdBalanceInfo reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: evdBalanceInfoType = {
  balanceInfo: {},
  filteredBalanceInfo: {},
  filteredBalanceInfoConf: {},
  evdInfo: {},
  filteredConf: {},
  isFilterApplied: false,
  radioContainerRed: 'newest',
  durationIdRed: 'all',
  dealerBalanceInput: '',
  pageNumber: 0,
  consolidatedParams: {},
  paginationData: {},
  isFos: false,
  consolidatedData: [],
};

/**
 * Slice representing the evdBalanceInfo reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/evdBalanceInfo';
 * dispatch(actions.evdBalanceInfoStart());
 * dispatch(actions.evdBalanceInfoSuccess(data));
 */
const evdBalanceInfoSlice = createSlice({
  name: 'evdBalanceInfo',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    evdBalanceInfoStart(state) {
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
    evdBalanceInfoSuccess(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        payloadDate: action.payload,
      };
    },
    setFilteredBalanceInfo: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      filteredBalanceInfo: action.payload,
      isFilterApplied: true,
    }),
    setFilteredBalanceInfoConf: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      filteredBalanceInfoConf: action.payload,
      isFilterApplied: true,
    }),
    setFilteredConf: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      filteredConf: action.payload,
    }),
    evdBalanceInfo: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      balanceInfo: action.payload,
      isFilterApplied: true,
    }),
    setEvdInfo: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      evdInfo: action.payload,
    }),
    setSelcectedFilters: (state, action: PayloadAction<string>) => ({
      ...state,
      radioContainerRed: action.payload,
    }),
    setSelcectedDurationId: (state, action: PayloadAction<string>) => ({
      ...state,
      durationIdRed: action.payload,
    }),
    setDealerBalanceInput: (state, action: PayloadAction<string>) => ({
      ...state,
      dealerBalanceInput: action.payload,
    }),
    setPageNumber: (state, action: PayloadAction<number>) => ({
      ...state,
      pageNumber: action.payload,
    }),
    setConsolidatedParams: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      consolidatedParams: action.payload,
    }),
    setPaginationData: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      paginationData: action.payload,
    }),
    setIsFos: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isFos: action.payload,
    }),
    setConsolidatedData: (state, action: PayloadAction<ParentObject[]>) => ({
      ...state,
      consolidatedData: action.payload,
    }),
  },
});

export const { actions } = evdBalanceInfoSlice;

export default evdBalanceInfoSlice.reducer;
