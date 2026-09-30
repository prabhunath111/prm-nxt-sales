/**
 * for activation status module details
 *
 * @module store/sales/reducer/activationStatusDetails
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { activationStatusDetailsType } from 'store/sales/types/activationStatusDetails';

/**
 * Initial state for the activationStatusDetails reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: activationStatusDetailsType = {
  woDetailsData: null,
  woOtherDetails: null,
  upgradeWoDetails: null,
  subscriptionDetails: null,
  transactions: [],
  accountInfo: null,
};

/**
 * Slice representing the activationStatusDetails reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/activationStatusDetails';
 * dispatch(actions.activationStatusDetailsStart());
 * dispatch(actions.activationStatusDetailsSuccess(data));
 */
const activationStatusDetailsSlice = createSlice({
  name: 'activationStatusDetails',
  initialState,
  reducers: {
    /**
     * Action to handle setWoDetailsData
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setWoDetailsData(state, action: PayloadAction<any>) {
      return {
        ...state,
        woDetailsData: action.payload,
      };
    },
    /**
     * Action to handle setWoOtherDetails
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setWoOtherDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        woOtherDetails: action.payload,
      };
    },
    /**
     * Action to handle setUpgradeWODetails.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setUpgradeWODetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        upgradeWoDetails: action.payload,
      };
    },
    /**
     * Action to handle setSubscriptionDetails
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSubscriptionDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        subscriptionDetails: action.payload,
      };
    },
    /**
     * Action to handle setTransactions.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTransactions(state, action: PayloadAction<any>) {
      return {
        ...state,
        transactions: action.payload,
      };
    },
    /**
     * Action to handle setAccountInfo.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setAccountInfo(state, action: PayloadAction<any>) {
      return {
        ...state,
        accountInfo: action.payload,
      };
    },
  },
});

export const { actions } = activationStatusDetailsSlice;

export default activationStatusDetailsSlice.reducer;
