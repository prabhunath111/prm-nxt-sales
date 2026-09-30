import { PayloadAction } from '@reduxjs/toolkit';
/**
 * create and view new dealer
 *
 * @module store/sales/reducer/newDealer
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { newDealerType } from 'store/sales/types/newDealer';

/**
 * Initial state for the newDealer reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: newDealerType = {
  distributorList: [],
  distributorResponse: [],
  currentASI: [],
};

/**
 * Slice representing the newDealer reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/newDealer';
 * dispatch(actions.newDealerStart());
 * dispatch(actions.newDealerSuccess(data));
 */
const newDealerSlice = createSlice({
  name: 'newDealer',
  initialState,
  reducers: {
    setDistributorList(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        distributorList: action.payload,
      };
    },
    setDistributorResponse: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      distributorResponse: action.payload,
    }),
    setSelectedDistCode: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      selectedDistCode: action.payload,
    }),
    setSelectedRole: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      selectedDistCode: action.payload,
    }),
    setSelectedUserId: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      selectedDistCode: action.payload,
    }),
    setCurrentASI: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      selectedDistCode: action.payload,
    }),
  },
});

export const { actions } = newDealerSlice;

export default newDealerSlice.reducer;
