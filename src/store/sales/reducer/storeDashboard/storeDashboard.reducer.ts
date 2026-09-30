import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storeDashboardType } from 'store/sales/types/storeDashboard';

const initialState: storeDashboardType = {
  dealerID: '',
  selectedDate: '',
  evdCode: '',
};

const storeDashboardSlice = createSlice({
  name: 'storeDashboard',
  initialState,
  reducers: {
    storeDashboardStart(state) {
      return { ...state };
    },

    setDealerID(state, action: PayloadAction<string>) {
      return {
        ...state,
        dealerID: action.payload,
      };
    },

    setDateForStoreDashboard(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedDate: action.payload,
      };
    },
    resetDateForStoreDashboard(state) {
      return {
        ...state,
        selectedDate: '',
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
    setEVDCode(state, action: PayloadAction<string>) {
      return {
        ...state,
        evdCode: action.payload,
      };
    },
  },
});

export const { actions } = storeDashboardSlice;

export default storeDashboardSlice.reducer;
