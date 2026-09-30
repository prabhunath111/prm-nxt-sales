/**
 * Reducer for tsk refund screen.
 *
 * @module store/reducer/tskRefund
 * @memberof CommonReducer
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tskRefundType } from 'store/sales/types/tskRefund';

/**
 * Initial state for the tskRefund reducer.
 *
 * @constant
 * @type {tskRefundType}
 */
const initialState: tskRefundType = {
  data: null,
};

/**
 * Slice representing the tskRefund reducer.
 *
 * @constant
 * @type {Slice}
 * @param {tskRefundType} state - The current state of the reducer.
 * @param {PayloadAction<any>} action - The action dispatched to the reducer.
 * @returns {Slice} The slice representing the tskRefund reducer.
 *
 * @example
 * import { actions } from 'store/reducer/tskRefund';
 * dispatch(actions.setTskRefundData(data));
 * dispatch(actions.clearTskRefundData());
 */
const tskRefundSlice = createSlice({
  name: 'tskRefund',
  initialState,
  reducers: {
    /**
     * Action to set the tsk refund data.
     *
     * @function setTskRefundData
     * @memberof module:store/reducer/tskRefund
     * @param {tskRefundType} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {tskRefundType} The updated state with the payload data.
     *
     * @example
     * import { actions } from 'store/reducer/tskRefund';
     * dispatch(actions.setTskRefundData(data));
     */
    setTskRefundData(state, action: PayloadAction<any>) {
      return {
        ...state,
        data: action.payload,
      };
    },
    /**
     * Action to clear the tsk refund data.
     *
     * @function clearTskRefundData
     * @memberof module:store/reducer/tskRefund
     * @param {tskRefundType} state - The current state of the reducer.
     * @returns {tskRefundType} The updated state with the data set to null.
     *
     * @example
     * import { actions } from 'store/reducer/tskRefund';
     * dispatch(actions.clearTskRefundData());
     */
    clearTskRefundData: (state) => ({
      ...state,
      data: null,
    }),
  },
});

export const { actions } = tskRefundSlice;

export default tskRefundSlice.reducer;
