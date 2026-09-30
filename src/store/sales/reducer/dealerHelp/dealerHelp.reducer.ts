import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { dealerHelpType } from 'store/sales/types/dealerHelp';

const initialState: dealerHelpType = {
  natureOfRequest: [],
  typeOfRequest: [],
  tableColumn: [],
  tableRowData: [],
  dealerSubArea: '',
  dealerRoleId: [],
  dealerSuccessData: {},
  bposData: {},
  dashboardBingeRetailerLatest: {},
  bingeTableData: {},
  bingTableColumn: [],
};

const dealerHelpSlice = createSlice({
  name: 'dealerHelp',
  initialState,
  reducers: {
    setNatureOfRequest(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        natureOfRequest: action.payload,
      };
    },

    setTypeOfRequest(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        typeOfRequest: action.payload,
      };
    },
    setTableColumn(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        tableColumn: action.payload,
      };
    },
    setTableRowData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        tableRowData: action.payload,
      };
    },
    setDealerSubArea(state, action: PayloadAction<string>) {
      return {
        ...state,
        dealerSubArea: action.payload,
      };
    },
    setdealerRoleandID(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        dealerRoleId: action.payload,
      };
    },
    setdealerSuccessData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        dealerSuccessData: action.payload,
      };
    },
    setBposData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        bposData: action.payload,
      };
    },
    setBingeLatestSummary(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        dashboardBingeRetailerLatest: action.payload,
      };
    },
    setBingeTableColumn(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        bingTableColumn: action.payload,
      };
    },
    setBingeTableData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        bingeTableData: action.payload,
      };
    },
    resetBingeLatestSummary(state) {
      return {
        ...state,
        dashboardBingeRetailerLatest: {},
      };
    },
    resetBingeTableData(state) {
      return {
        ...state,
        bingeTableData: {},
      };
    },
  },
});

export const { actions } = dealerHelpSlice;

export default dealerHelpSlice.reducer;
