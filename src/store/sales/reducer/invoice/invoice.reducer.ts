/**
 * manage invoice transaction history
 *
 * @module store/sales/reducer/invoice
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { invoiceType } from 'store/sales/types/invoice';

/**
 * Initial state for the invoice reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: invoiceType = {
  invoiceTransactions: [],
  invoiceGSTdata: [],
  gstTransactionId: {},
  gstData: {},
  closeView: false,
  comingFromInvoice: false,
};

/**
 * Slice representing the invoice reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/invoice';
 * dispatch(actions.invoiceStart());
 * dispatch(actions.invoiceSuccess(data));
 */
const invoiceSlice = createSlice({
  name: 'invoice',
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
    setInvoiceTransactions(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        invoiceTransactions: action.payload.data,
      };
    },

    /**
     * Action to get transaction history.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setInvoiceGSTdata(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        invoiceGSTdata: action.payload.data,
      };
    },

    /**
     * Action to get transaction history.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTransactionId(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        gstTransactionId: action.payload,
      };
    },
    setGSTData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        gstData: action.payload,
      };
    },
    setCloseView(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        closeView: action.payload,
      };
    },
    setComingFromInvoice(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        comingFromInvoice: action.payload,
      };
    },
  },
});

export const { actions } = invoiceSlice;

export default invoiceSlice.reducer;
