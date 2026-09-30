/**
 * here the dealeer can track and raise any purches order
 *
 * @module store/sales/reducer/purchaseOrder
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { purchaseOrderType } from 'store/sales/types/purchaseOrder';

/**
 * Initial state for the purchaseOrder reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: purchaseOrderType = {
  distributorTrackRequestDetails: {},
  dealerMob: '',
  tableColumn: [],
  detailsColumn: [],
  posmDetails: [],
  dealerTrackDetails: [],
  walletDetails: [],
  paymentTypeArray: [],
  fullPaymentType: [],
  isEdit: false,
  editableData: {},
  duration: {},
  status: {},
  actionRequestTableData: [],
  rejectedUserData: {},
  settlementsData: {},
  orderIdDetails: {},
  balanceEnquiryData: {},
  materialDetailsData: [],
  paymentTypesData: {},
  selectedMaterial: [],
  selectedMaterialPill: '',
  asmTrackRequestData: {},
  successMessage: '',
};

/**
 * Slice representing the purchaseOrder reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/purchaseOrder';
 * dispatch(actions.purchaseOrderStart());
 * dispatch(actions.purchaseOrderSuccess(data));
 */
const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
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
    setDistributorTrackRequestDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        distributorTrackRequestDetails: action.payload,
      };
    },
    setDealerMob(state, action: PayloadAction<string>) {
      return {
        ...state,
        dealerMob: action.payload,
      };
    },
    setTableColumn(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        tableColumn: action.payload,
      };
    },
    setDetailsColumn(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        detailsColumn: action.payload,
      };
    },
    setPosmDetails(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        posmDetails: action.payload,
      };
    },
    setDealerTrackDetails(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        dealerTrackDetails: action.payload,
      };
    },
    setWalletDetails(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        walletDetails: action.payload,
      };
    },
    setPaymentType(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        paymentTypeArray: action.payload,
      };
    },
    setFullPaymentType(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        fullPaymentType: action.payload,
      };
    },
    setIsEditable(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    setEditData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        editableData: action.payload,
      };
    },
    setDuration(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        duration: action.payload,
      };
    },
    setStatus(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        status: action.payload,
      };
    },
    setActionRequestTableData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        actionRequestTableData: action.payload,
      };
    },
    setRejectedUserData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        rejectedUserData: action.payload,
      };
    },
    setSettlementsData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        settlementsData: action.payload,
      };
    },
    setOrderIdDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        orderIdDetails: action.payload,
      };
    },
    setBalanceEnquiryData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        balanceEnquiryData: action.payload,
      };
    },
    setAllMaterialDetailsData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        materialDetailsData: action.payload,
      };
    },
    setPaymentTypesData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        paymentTypesData: action.payload,
      };
    },
    setSelectedMaterial(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        selectedMaterial: action.payload,
      };
    },
    setSelectedMaterialPill(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedMaterialPill: action.payload,
      };
    },
    setASMTrackRequestData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        asmTrackRequestData: action.payload,
      };
    },
    setOrderSucessMessage(state, action: PayloadAction<string>) {
      return {
        ...state,
        successMessage: action.payload,
      };
    },
  },
});

export const { actions } = purchaseOrderSlice;

export default purchaseOrderSlice.reducer;
