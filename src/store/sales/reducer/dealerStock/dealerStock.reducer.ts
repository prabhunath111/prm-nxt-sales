/**
 * Redux store for dealer stocks
 *
 * @module store/sales/reducer/dealerStock
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dealerStockType } from 'store/sales/types/dealerStock';

/**
 * Initial state for the dealerStock reducer.
 *
 * @type {object}
 * @property {string} stockList - Default stock list for the initial state.
 * @property {string} productTypeDropdownList - Default product Type Dropdown List for the initial state.
 */
const initialState: dealerStockType = {
  stockList: [],
  productTypeDropdownList: [],
  multiCheckboxStockFilter: [],
};

/**
 * Slice representing the dealerStock reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/dealerStock';
 * dispatch(actions.dealerStockStart());
 * dispatch(actions.dealerStockSuccess(data));
 */
const dealerStockSlice = createSlice({
  name: 'dealerStock',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    dealerStockStart(state) {
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
    dealerStockSuccess(state, action: PayloadAction<any>) {
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
    setProductTypeDropdown(state, action: PayloadAction<any>) {
      return {
        ...state,
        productTypeDropdownList: action.payload,
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
    setStockList(state, action: PayloadAction<any>) {
      return {
        ...state,
        stockList: action.payload,
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
    setFilteredStock(state, action: PayloadAction<any>) {
      return {
        ...state,
        multiCheckboxStockFilter: action.payload,
      };
    },
  },
});

export const { actions } = dealerStockSlice;

export default dealerStockSlice.reducer;
