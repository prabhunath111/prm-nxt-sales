/**
 * store for home page data
 *
 * @module store/sales/reducer/homePage
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { homePageType } from 'store/sales/types/homePage';

/**
 * Initial state for the homePage reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: homePageType = {
  transactionData: {
    date: 'Information last updated on 08/12/2024',
    lastUpdatedOn: '08/12/2024',
    headerText: 'OTF (₹)',
    primaryText: 'FTD',
    secondaryText: '₹',
    tertiaryText: 'MTD',
    quaternaryText: '₹',
  },
  transactionsDetails: [],
  daysFilter: [],
  paymentType: [],
  statusFilter: [],
  transactionAmount: [],
  evdBalance: 0,
  ftdData: {},
  homePageData: {},
  bannerImages: [],
  railData: [],
  isHomeRailVisible: false,
  railFilterLanguages: ["All", "English", "Tamil", "Hindi", "Telugu", "malayalam"],
};

/**
 * Slice representing the homePage reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/homePage';
 * dispatch(actions.homePageStart());
 * dispatch(actions.homePageSuccess(data));
 */
const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    homePageStart(state) {
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
    homePageSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        payloadDate: action.payload,
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
    setTransaction: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      daysFilter: action.payload.daysFilter,
      paymentType: action.payload.paymentType,
      statusFilter: action.payload.statusFilter,
      transactionAmount: action.payload.transactionAmount,
      transactionsDetails: action.payload.transactionDetails,
      transactionData: {
        ...state.transactionData,
        secondaryText: `₹${action.payload.otfDetails?.otfFtd ?? 0}`,
        quaternaryText: `₹${action.payload.otfDetails?.otfMtd ?? 0}`,
        lastUpdatedOn: action.payload.updatedDate,
      },
    }),

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTransactionWithFilter: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      transactionsDetails: action.payload.transactionDetails,
    }),

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setEvdBalance: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      evdBalance: action.payload.evdBalance,
    }),

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setFtdData: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      ftdData: action.payload,
      transactionData: {
        ...state.transactionData,
        secondaryText: `₹${action.payload.otfFTD ?? 0}`,
      },
    }),

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setHomePageData: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      homePageData: action.payload,
    }),

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBannerImages: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      bannerImages: action.payload,
    }),

    setRailData: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      railData: action.payload,
    }),

    setIsHomeRailVisible: (state, action: PayloadAction<boolean>) => {
      state.isHomeRailVisible = action.payload;
    },

    setRailFilterLanguages: (state, action: PayloadAction<string[]>) => {
      state.railFilterLanguages = action.payload;
    },
  },
});

export const { actions } = homePageSlice;

export default homePageSlice.reducer;
