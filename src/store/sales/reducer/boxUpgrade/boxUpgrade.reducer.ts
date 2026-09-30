/**
 * This is the Reducer for work order recreation
 *
 * @module store/sales/reducer/boxUpgrade
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { boxUpgradeType } from 'store/sales/types/boxUpgrade';
import { ParentObject } from 'store/sales/types/common';

/**
 * Initial state for the boxUpgrade reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: boxUpgradeType = {
  accountInfoBoxData: {},
  SubscriberID: '',
  vcNumber: '',
  toBeUpgradeType: '',
  boxType: '',
  rechargeAmount: '',
  formatedBoxData: [],
  upgradedType: '',
  eligibles: [],
  bingeOffer: [],
  finalRequiredAmount: '',
  evdPin: '',
  status: '',
  SrNo: '',
  TransactionID: '',
  bingeFlag: false,
  woDetails: [],
  paidAmount: '',
  selectedBox: '',
  rechargeFlag: true,
  upgradedToNT: '',
  upgradeMsg: '',
};

/**
 * Slice representing the boxUpgrade reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/boxUpgrade';
 * dispatch(actions.boxUpgradeStart());
 * dispatch(actions.boxUpgradeSuccess(data));
 */
const boxUpgradeSlice = createSlice({
  name: 'boxUpgrade',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    boxUpgradeStart(state) {
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
    setBoxUpgradeACInfoBoxData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        accountInfoBoxData: action.payload,
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
    setSubscriberID(state, action: PayloadAction<string>) {
      return {
        ...state,
        SubscriberID: action.payload,
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
    setRechargeAmount(state, action: PayloadAction<string>) {
      return {
        ...state,
        rechargeAmount: action.payload,
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
    setSelectedBoxVcNumber(state, action: PayloadAction<string>) {
      return {
        ...state,
        vcNumber: action.payload,
      };
    },

    setSelectedBoxType(state, action: PayloadAction<string>) {
      return {
        ...state,
        boxType: action.payload,
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
    setSelectedBoxConnectionType(state, action: PayloadAction<string>) {
      return {
        ...state,
        toBeUpgradeType: action.payload,
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
    setBoxData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        formatedBoxData: action.payload,
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
    setUpgradeBoxType(state, action: PayloadAction<string>) {
      return {
        ...state,
        upgradedType: action.payload,
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
    setElegibles(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        eligibles: action.payload,
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
    setBingeOfferData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        bingeOffer: action.payload,
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
    setFinalRequiredAmount(state, action: PayloadAction<string>) {
      return {
        ...state,
        finalRequiredAmount: action.payload,
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
    setEVDPin(state, action: PayloadAction<string>) {
      return {
        ...state,
        evdPin: action.payload,
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
    setStatus(state, action: PayloadAction<string>) {
      return {
        ...state,
        status: action.payload,
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
    setTransactionID(state, action: PayloadAction<string>) {
      return {
        ...state,
        TransactionID: action.payload,
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
    setSRno(state, action: PayloadAction<string>) {
      return {
        ...state,
        SrNo: action.payload,
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
    setbingeFlag(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        bingeFlag: action.payload,
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
    setWoDetails(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        woDetails: action.payload,
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
    setPaidAmount(state, action: PayloadAction<string>) {
      return {
        ...state,
        paidAmount: action.payload,
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
    setSelectedBox(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedBox: action.payload,
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
    setRechargeFlag(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        rechargeFlag: action.payload,
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
    setUpgradeToNT(state, action: PayloadAction<string>) {
      return {
        ...state,
        upgradedToNT: action.payload,
      };
    },
    setSucessMsg(state, action: PayloadAction<string>) {
      return {
        ...state,
        upgradeMsg: action.payload,
      };
    },
  },
});

export const { actions } = boxUpgradeSlice;

export default boxUpgradeSlice.reducer;
