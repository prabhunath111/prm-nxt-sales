/**
 * In this reducer we will manage all multiTV registration related items
 *
 * @module store/sales/reducer/multiTvRegistration
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { multiTvRegistrationType } from 'store/sales/types/multiTvRegistration';

/**
 * Initial state for the multiTvRegistration reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: multiTvRegistrationType = {
  tskValidateData: {},
  tskPinParams: {},
  timeSlotsData: {},
  workOrderData: {},
  tskValidateRequestInput: {},
  paidPrice: '0',
  differentBox: false,
};

/**
 * Slice representing the multiTvRegistration reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/multiTvRegistration';
 * dispatch(actions.multiTvRegistrationStart());
 * dispatch(actions.multiTvRegistrationSuccess(data));
 */
const multiTvRegistrationSlice = createSlice({
  name: 'multiTvRegistration',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    multiTvRegistrationStart(state) {
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

    setTskPinParams(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tskPinParams: action.payload,
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

    setTskValidateData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tskValidateData: action.payload,
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
    etskSetPaidPrice(state, action: PayloadAction<string>) {
      return {
        ...state,
        paidPrice: action.payload,
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
    multiTvRegistrationSuccess(state, action: PayloadAction<any>) {
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

    setWorkOrderData(state, action: PayloadAction<any>) {
      return {
        ...state,
        workOrderData: action.payload,
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

    setTskValidateRequestInput(state, action: PayloadAction<any>) {
      return {
        ...state,
        tskValidateRequestInput: action.payload,
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
    setTimeSlotsData(state, action: PayloadAction<any>) {
      return {
        ...state,
        timeSlotsData: action.payload,
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
    setDifferentBox(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        differentBox: action.payload,
      };
    },
  },
});

export const { actions } = multiTvRegistrationSlice;

export default multiTvRegistrationSlice.reducer;
