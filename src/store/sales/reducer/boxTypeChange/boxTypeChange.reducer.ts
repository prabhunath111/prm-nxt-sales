/**
 * In this module user can change the box type
 *
 * @module store/sales/reducer/boxTypeChange
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { boxTypeChangeType } from 'store/sales/types/boxTypeChange';
import { ParentObject } from 'store/sales/types/common';

/**
 * Initial state for the boxTypeChange reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: boxTypeChangeType = {
  boxTypeProps: {},
  subId: '',
  pendingWo: false,
  pendingWoDetails: {},
  orderNumber: '',
  tskDetails: [],
  boxData: [],
  tskPin: [],
  accountDetailsPrimaryAndSecondaryRepushBoxType: {},
  tskSnoAndBoxTypeArr: [],
  boxTypeSuccessData: {},
  boxTypeChangeReferenceId: '',
  firstFlag: true,
  flags: {},
  pricePtForMultiTVInput: {},
  boxType: '',
  selectBoxDetails: [],
  boxDetails: [],
};

/**
 * Slice representing the boxTypeChange reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/boxTypeChange';
 * dispatch(actions.boxTypeChangeStart());
 * dispatch(actions.boxTypeChangeSuccess(data));
 */
const boxTypeChangeSlice = createSlice({
  name: 'boxTypeChange',
  initialState,
  reducers: {
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBoxTypeProps(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        boxTypeProps: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<boolean>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setPendingWo(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        pendingWo: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setPendingWoDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        pendingWoDetails: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setOderNumber(state, action: PayloadAction<string>) {
      return {
        ...state,
        orderNumber: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTskDetails(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        tskDetails: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSubID(state, action: PayloadAction<string>) {
      return {
        ...state,
        subId: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBoxData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        boxData: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTskPin(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        tskPin: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setAccountDetailsPrimaryAndSecondaryRepushBoxType(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        accountDetailsPrimaryAndSecondaryRepushBoxType: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setTskSnoAndBoxTypeArr(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        tskSnoAndBoxTypeArr: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<ParentObject>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBoxTypeSuccessData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        boxTypeSuccessData: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBoxTypeChangeReferenceId(state, action: PayloadAction<string>) {
      return {
        ...state,
        boxTypeChangeReferenceId: action.payload,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setFirstFlag(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        firstFlag: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setFlags(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        flags: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setOnlyPricePtForMultiTVInput(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        pricePtForMultiTVInput: action.payload,
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setboxType(state, action: PayloadAction<string>) {
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
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    updateSelectedBox(state, action: PayloadAction<{ index: number; boxValue: string; newType: string | null }>) {
      const { index, boxValue, newType } = action.payload;
      const updatedDetails = [...(state.selectBoxDetails || [])];
      updatedDetails[index] = { boxValue, newType };
      return {
        ...state,
        selectBoxDetails: updatedDetails,
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    resetSelectBoxDetails(state) {
      return {
        ...state,
        selectBoxDetails: [],
      };
    },
    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBoxDetails(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        boxDetails: action.payload,
      };
    },
  },
});

export const { actions } = boxTypeChangeSlice;

export default boxTypeChangeSlice.reducer;
