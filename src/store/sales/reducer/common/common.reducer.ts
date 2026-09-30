/**
 * Handles the common functionality store
 *
 * @module store/reducer/common
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommonStore, ParentObject } from 'store/sales/types/common';

/**
 * reducer initialState
 *
 * @type {object}
 * @property {string} text - content for the reducer initialState
 */

const initialState: CommonStore = {
  i18Lang: {},
  errorMessage: '',
  dealerDetails: {
    name: '',
    evdCode: '',
    mdn: '',
    dealerId: '',
  },
  tableColumns: [],
  tableData: [],
  tableFilteredData: [],
  webViewUrl: '',
  customAmount: '',
  customFormData: {},
  totalListCount: '',
  toggleSwitchEnabled: {},
  dropdownVisible: false,
};

/**
 * Represents a common reducer
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns common
 */
const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    getLanguageStart(state) {
      return { ...state };
    },
    getLanguageSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        i18Lang: action.payload,
      };
    },

    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setErrorMessage(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        errorMessage: action.payload.message,
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
    reSetErrorMessage(state) {
      return {
        ...state,
        errorMessage: '',
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
    setTableColumnData(state, action: PayloadAction<ParentObject>) {
      const { tableData, tableColumns } = action.payload;
      return {
        ...state,
        tableData,
        tableColumns,
        tableFilteredData: tableData,
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
    setTableFilteredData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tableFilteredData: action.payload.tableData,
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
    setDealerDetail(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        dealerDetails: action.payload.dealerDetails,
      };
    },

    setToggleSwitchEnabled(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        toggleSwitchEnabled: action.payload,
      };
    },

    setWebViewUrl(state, action: PayloadAction<ParentObject>) {
      const { url } = action.payload;
      return {
        ...state,
        webViewUrl: url,
      };
    },

    setCustomAmount(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        customAmount: action.payload?.partnerBalance,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state with the payload data.
     */
    reSetCustomAmount(state) {
      return {
        ...state,
        customAmount: '',
      };
    },

    setCustomFormData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        customFormData: action.payload,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state with the payload data.
     */
    resetCustomFormData(state) {
      return {
        ...state,
        customFormData: {},
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state with the payload data.
     */
    resetTable(state) {
      return {
        ...state,
        tableData: [],
        tableColumns: [],
        tableFilteredData: [],
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state with the payload data.
     */
    resetCommonStore(state) {
      return {
        ...state,
        initialState,
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
    totalListCount(state, action: PayloadAction<any>) {
      return {
        ...state,
        totalListCount: action.payload,
      };
    },

    setDropdownVisibility(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        dropdownVisible: action.payload,
      };
    },
  },
});

export const { actions } = commonSlice;

export default commonSlice.reducer;
