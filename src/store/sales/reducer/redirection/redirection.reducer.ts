/**
 * Store to handle all the redirection related activities
 *
 * @module store/reducer/redirection
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RedirectionStore } from 'store/sales/types/redirection';

/**
 * reducer initialState
 *
 * @type {object}
 * @property {string} text - content for the reducer initialState
 */

const initialState: RedirectionStore = {
  sourceName: '',
  moduleName: '',
  subModuleName: '',
  language: '',
  moduleWiseParams: {},
  data: {},
  navigation: {
    menus: [],
    routes: [],
    dashboard: [],
  },
};

/**
 * Represents a redirection reducer
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns redirection
 */
const redirectionSlice = createSlice({
  name: 'redirection',
  initialState,
  reducers: {
    setVerifyTokenData(state, action: PayloadAction<any>) {
      const { sourceName, moduleName, subModuleName, language, moduleWiseParams, navigation } = action.payload;
      return {
        ...state,
        sourceName,
        moduleName,
        subModuleName,
        language,
        moduleWiseParams,
        navigation,
      };
    },
    clearTokenData(state, _) {
      return {
        ...state,
        moduleName: '',
        isAuthenticatedRedirection: false,
        sourceName: '',
        userId: '',
        navigation: {
          menus: [],
          routes: [],
          dashboard: [],
        },
      };
    },
  },
});

export const { actions } = redirectionSlice;

export default redirectionSlice.reducer;
