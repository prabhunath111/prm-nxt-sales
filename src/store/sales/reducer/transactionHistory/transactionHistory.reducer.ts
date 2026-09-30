/**
 * transaction History to manage recharge reversal
 *
 * @module store/reducer/transactionHistory
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { transactionHistoryType } from 'store/sales/types/transactionHistory';

/**
 * Initial state for the transactionHistory reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: transactionHistoryType = {
  transactionHistory: [],
  transactionDetails: {},
  reversalReasons: [],
  balance: '',
  isTransactionDetails: false,
};

/**
 * Slice representing the transactionHistory reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/transactionHistory';
 * dispatch(actions.transactionHistoryStart());
 * dispatch(actions.transactionHistorySuccess(data));
 */
const transactionHistorySlice = createSlice({
  name: 'transactionHistory',
  initialState,
  reducers: {
    /**
     * Action to get transaction history.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTransactionHistory(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        transactionHistory: action.payload.data,
      };
    },

    /**
     * Action to set Transaction Details.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTransactionHistoryDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        transactionDetails: action.payload.data,
      };
    },

    /**
     * The action is to determine whether transaction details are available or not.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setIsTransactionDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        isTransactionDetails: action.payload.data,
      };
    },
    /**
     * Action to get Account Information for confirm recharge reversal.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setReversalInformation(state, action: PayloadAction<ParentObject>) {
      const { balance, reversalReasons } = action.payload;
      return {
        ...state,
        reversalReasons,
        balance,
      };
    },
  },
});

export const { actions } = transactionHistorySlice;

export default transactionHistorySlice.reducer;
