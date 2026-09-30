/**
 * This is the Reducer for work order recreation
 *
 * @module store/sales/reducer/woRecreation
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { woRecreationType } from 'store/sales/types/woRecreation';

/**
 * Initial state for the woRecreation reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: woRecreationType = {
  tskAllDetails: {},
  woSuccessData: {},
  workOrderDetails: {},
  tskPinDetails: {},
  accountDetailsPrimaryAndSecondaryRepush: {},
  allPackPropsSuccessData: {},
  woFilterdData: {},
  woTypesFromPropWO: [],
  onlyPricePtForMultiTVInput: {},
};

/**
 * Slice representing the woRecreation reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/woRecreation';
 * dispatch(actions.woRecreationStart());
 * dispatch(actions.woRecreationSuccess(data));
 */
const woRecreationSlice = createSlice({
  name: 'woRecreation',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    woRecreationStart(state) {
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
    setTskAllDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        tskAllDetails: action.payload,
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
    setWorkOrderDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        workOrderDetails: action.payload,
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
    setWoSuccessData(state, action: PayloadAction<any>) {
      return {
        ...state,
        woSuccessData: action.payload,
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
    setTskPinDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        tskPinDetails: action.payload,
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
    setAccountDetailsPrimaryAndSecondaryRepush(state, action: PayloadAction<any>) {
      return {
        ...state,
        accountDetailsPrimaryAndSecondaryRepush: action.payload,
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
    setAllPackPropsSuccessData(state, action: PayloadAction<any>) {
      return {
        ...state,
        allPackPropsSuccessData: action.payload,
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
    woSetFiltersData(state, action: PayloadAction<any>) {
      return {
        ...state,
        woFilterdData: action.payload,
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
    setWoTypesFromPropWO(state, action: PayloadAction<any>) {
      return {
        ...state,
        woTypesFromPropWO: action.payload,
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
    setOnlyPricePtForMultiTVInput(state, action: PayloadAction<any>) {
      return {
        ...state,
        onlyPricePtForMultiTVInput: action.payload,
      };
    },
  },
});

export const { actions } = woRecreationSlice;

export default woRecreationSlice.reducer;
