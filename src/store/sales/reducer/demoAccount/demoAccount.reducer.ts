/**
 * In this reducer we will manage all demo account creation related information
 *
 * @module store/sales/reducer/demoAccount
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { demoAccountType } from 'store/sales/types/demoAccount';

/**
 * Initial state for the demoAccount reducer.
 *
 * @type {object}
 */
const initialState: demoAccountType = {
  demoAccountDealerDetails: {},
  tskValidationDetails: {},
  tskRegistrationDetails: {},
  packDetails: {},
  demoAccountSuccessData: {},
  evdCode: '',
  isETSK: false,
  selectedBox: '',
};

/**
 * Slice representing the demoAccount reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/demoAccount';
 * dispatch(actions.demoAccountStart());
 * dispatch(actions.demoAccountSuccess(data));
 */
const demoAccountSlice = createSlice({
  name: 'demoAccount',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    demoAccountStart(state) {
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
    setDemoAccountDealerDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        demoAccountDealerDetails: action.payload,
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
    setTskValidationDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        tskValidationDetails: action.payload,
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
    setTskRegistrationDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        tskRegistrationDetails: action.payload,
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
    setPackDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        packDetails: action.payload,
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
    setDemoAccountSuccessData(state, action: PayloadAction<any>) {
      return {
        ...state,
        demoAccountSuccessData: action.payload,
      };
    },
    /**
     * Action to store the EVD code entered by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setDemoAccountEVDCode(state, action: PayloadAction<string>) {
      return {
        ...state,
        evdCode: action.payload,
      };
    },
    /**
     * Action to store the EVD code entered by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setIsETSK(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isETSK: action.payload,
      };
    },
    /**
     * Action to store the EVD code entered by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSetUpBox(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedBox: action.payload,
      };
    },
  },
});

export const { actions } = demoAccountSlice;

export default demoAccountSlice.reducer;
