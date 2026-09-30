/**
 * In this reducer we will manage all competitor data related information
 *
 * @module store/sales/reducer/competitorDataCapture
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { competitorDataCaptureType } from 'store/sales/types/competitorDataCapture';

/**
 * Initial state for the competitorDataCapture reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: competitorDataCaptureType = {
  text: 'reducer created',
  balanceEnquireData: {},
  competitorSuccessData: {},
};

/**
 * Slice representing the competitorDataCapture reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/competitorDataCapture';
 * dispatch(actions.competitorDataCaptureStart());
 * dispatch(actions.competitorDataCaptureSuccess(data));
 */
const competitorDataCaptureSlice = createSlice({
  name: 'competitorDataCapture',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    competitorDataCaptureStart(state) {
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
    competitorDataCaptureSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        competitorSuccessData: action.payload,
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
    setBalanceEnquireData(state, action: PayloadAction<any>) {
      return {
        ...state,
        balanceEnquireData: action.payload,
      };
    },
  },
});

export const { actions } = competitorDataCaptureSlice;

export default competitorDataCaptureSlice.reducer;
