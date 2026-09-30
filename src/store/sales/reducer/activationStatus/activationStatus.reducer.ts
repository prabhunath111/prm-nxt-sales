/**
 * reducer for activation status module
 *
 * @module store/sales/reducer/activationStatus
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { activationStatusType } from 'store/sales/types/activationStatus';

/**
 * Initial state for the activationStatus reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: activationStatusType = {
  activationStatusData: null,
  subscriberInfo: '',
  multiSubId: '',
  bcpActStatusInfo: '',
  bcpActivationStatusData: null,
  subIdFromNavigation: '',
};

/**
 * Slice representing the activationStatus reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/activationStatus';
 * dispatch(actions.activationStatusStart());
 * dispatch(actions.activationStatusSuccess(data));
 */
const activationStatusSlice = createSlice({
  name: 'activationStatus',
  initialState,
  reducers: {
    /**
     * Action to handle setActivationStatusData.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setActivationStatusData(state, action: PayloadAction<any>) {
      return {
        ...state,
        activationStatusData: action.payload,
      };
    },
    /**
     * Action to handle setBcpActivationStatusData.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBcpActivationStatusData(state, action: PayloadAction<any>) {
      return {
        ...state,
        bcpActivationStatusData: action.payload,
      };
    },
    /**
     * Action to handle setBcpActivationStatusData.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSubIdFromNavigation(state, action: PayloadAction<string>) {
      return {
        ...state,
        subIdFromNavigation: action.payload,
      };
    },
  },
});

export const { actions } = activationStatusSlice;

export default activationStatusSlice.reducer;
