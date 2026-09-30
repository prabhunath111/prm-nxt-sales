/**
 * in this distributer can insert the enquery details
 *
 * @module store/sales/reducer/exclusiveStore
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { exclusiveStoreType } from 'store/sales/types/exclusiveStore';

/**
 * Initial state for the exclusiveStore reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: exclusiveStoreType = {
  storeOpenQuestion: {},
  isStoreOpen: true,
  actionType: '',
  demoFormQuestions: {},
  multiTvData: {},
  newConnectionDetails: {
    subID: '',
    pinCode: '',
    mobNo: '',
    emailAddress: '',
  },
  needValidation: false,
};

/**
 * Slice representing the exclusiveStore reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/exclusiveStore';
 * dispatch(actions.exclusiveStoreStart());
 * dispatch(actions.exclusiveStoreSuccess(data));
 */
const exclusiveStoreSlice = createSlice({
  name: 'exclusiveStore',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    exclusiveStoreStart(state) {
      return { ...state };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<string>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    exclusiveStoreOpenData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        storeOpenQuestion: action.payload,
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
    setActionType(state, action: PayloadAction<string>) {
      return {
        ...state,
        actionType: action.payload,
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
    setDemoFormQuestions(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        demoFormQuestions: action.payload,
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
    setMultiTvData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        multiTvData: action.payload,
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
    setIsStoreOpen(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isStoreOpen: action.payload,
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
    setNewConnectionDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        newConnectionDetails: {
          ...state.newConnectionDetails,
          ...action.payload,
        },
      };
    },

    setNeedValidation(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        needValidation: action.payload,
      };
    },
  },
});

export const { actions } = exclusiveStoreSlice;

export default exclusiveStoreSlice.reducer;
