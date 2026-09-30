/**
 * fetch list of langauges
 *
 * @module store/sales/reducer/fetchLanguage
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLanguageType } from 'store/sales/types/fetchLanguage';

/**
 * Initial state for the fetchLanguage reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: fetchLanguageType = {
  languageData: [],
};

/**
 * Slice representing the fetchLanguage reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/fetchLanguage';
 * dispatch(actions.fetchLanguageStart());
 * dispatch(actions.fetchLanguageSuccess(data));
 */
const fetchLanguageSlice = createSlice({
  name: 'fetchLanguage',
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
    setLanguageData(state, action: PayloadAction<any>) {
      return {
        ...state,
        languageData: action.payload,
      };
    },
  },
});

export const { actions } = fetchLanguageSlice;

export default fetchLanguageSlice.reducer;
