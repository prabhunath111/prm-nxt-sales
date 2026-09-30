/**
 * manage dealer feedback actions and reducer
 *
 * @module store/sales/reducer/dealerFeedback
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dealerFeedbackType } from 'store/sales/types/dealerFeedback';

/**
 * Initial state for the dealerFeedback reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: dealerFeedbackType = {
  feedbackSuccessData: {},
  isSubscriberValid: false,
  message: '',
  radioFeedbackSelected: '',
};

/**
 * Slice representing the dealerFeedback reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/dealerFeedback';
 * dispatch(actions.dealerFeedbackStart());
 * dispatch(actions.dealerFeedbackSuccess(data));
 */
const dealerFeedbackSlice = createSlice({
  name: 'dealerFeedback',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setValidateSubscriber(state, action: PayloadAction<any>) {
      return {
        ...state,
        isSubscriberValid: action.payload.isSubscriberValid,
        message: action.payload.message,
      };
    },

    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    dealerFeedbackStart(state) {
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
    setDealerSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        feedbackSuccessData: action.payload,
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
    setRadioFeedbackSelected(state, action: PayloadAction<any>) {
      return {
        ...state,
        radioFeedbackSelected: action.payload,
      };
    },
  },
});

export const { actions } = dealerFeedbackSlice;

export default dealerFeedbackSlice.reducer;
