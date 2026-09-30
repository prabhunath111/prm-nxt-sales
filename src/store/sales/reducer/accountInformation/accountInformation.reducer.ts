/**
 * In this reducer we will manage all account related information
 *
 * @module store/reducer/accountInformation
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { accountInformationType, UserRechargeInfo } from 'store/sales/types/accountInformation';
import { ParentObject } from 'store/sales/types/common';

/**
 * Initial state for the accountInformation reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: accountInformationType = {
  accountInformation: {},
  requestParams: {},
  lastFiveRecharge: [],
  paramsRMN: {},
};

/**
 * Slice representing the accountInformation reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/accountInformation';
 * dispatch(actions.accountInformationStart());
 * dispatch(actions.accountInformationSuccess(data));
 */
const accountInformationSlice = createSlice({
  name: 'accountInformation',
  initialState,
  reducers: {
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setAccountInformation(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        accountInformation: action.payload,
      };
    },
    setLastFiveRecharge(state, action: PayloadAction<UserRechargeInfo[]>) {
      return {
        ...state,
        lastFiveRecharge: action.payload,
      };
    },
    setRequestParams(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        requestParams: action.payload,
      };
    },
    setParamsRMN(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        paramsRMN: action.payload,
      };
    },
  },
});

export const { actions } = accountInformationSlice;

export default accountInformationSlice.reducer;
