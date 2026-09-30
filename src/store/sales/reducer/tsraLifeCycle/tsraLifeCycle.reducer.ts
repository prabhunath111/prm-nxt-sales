/**
 * this reducer will be responcible for tsra actions
 *
 * @module store/reducer/tsraLifecycle
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { tsraLifeCycleType } from 'store/sales/types/tsraLifeCycle';

/**
 * Initial state for the tsraLifecycle reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: tsraLifeCycleType = {
  tsraSubscriberList: [],
  tsraSuccessData: {},
};

export type TsraData = {
  message: string;
  partnerCode: string;
  status: boolean;
};

/**
 * Slice representing the tsraLifecycle reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/tsraLifecycle';
 * dispatch(actions.tsraLifecycleStart());
 * dispatch(actions.tsraLifecycleSuccess(data));
 */
const tsraLifecycleSlice = createSlice({
  name: 'tsraLifecycle',
  initialState,
  reducers: {
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTsraSubscriberList(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        tsraSubscriberList: action.payload,
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
    resetTsraSubscriberList(state) {
      return {
        ...state,
        tsraSubscriberList: [],
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
    setTsraSuccessData(state, action: PayloadAction<TsraData>) {
      return {
        ...state,
        tsraSuccessData: action.payload,
      };
    },
  },
});

export const { actions } = tsraLifecycleSlice;

export default tsraLifecycleSlice.reducer;
