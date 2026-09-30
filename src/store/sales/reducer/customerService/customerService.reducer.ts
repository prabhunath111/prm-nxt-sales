/**
 * reducer to raise and track customer services
 *
 * @module store/reducer/customerService
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { customerServiceType } from 'store/sales/types/customerService';
import { DropdownType } from '../../types/customerService/customerService.type';

/**
 * Initial state for the customerService reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: customerServiceType = {
  accountInfo: {},
  messages: {},
  categories: [],
  allCategoryInfo: [],
  subCategories: [],
  suspensionReason: [],
  subscriberRequests: [],
  availableSlot: {},
  slotSuggestions: [],
  taskId: {},
  slotDate: [],
  slotTime: [],
  selectedType: '',
  typeOfRequest: '',
};

/**
 * Slice representing the customerService reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/customerService';
 * dispatch(actions.customerServiceStart());
 * dispatch(actions.customerServiceSuccess(data));
 */
const customerServiceSlice = createSlice({
  name: 'customerService',
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
    setSubscriberData(state, action: PayloadAction<ParentObject>) {
      const { accountInfo, categories, allCategoryInfo, warnings } = action.payload;
      return {
        ...state,
        accountInfo,
        messages: warnings,
        categories: categories || [],
        allCategoryInfo: allCategoryInfo || [],
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
    setSubCategories(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        subCategories: action.payload.subCategories,
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
    resetSubCategories(state) {
      return {
        ...state,
        subCategories: [],
      };
    },

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<DropdownType>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSuspensionReason(state, action: PayloadAction<Array<DropdownType>>) {
      return {
        ...state,
        suspensionReason: action.payload,
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
    setTrackServiceRequest(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        subscriberRequests: action.payload.subscriberRequests,
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
    setAvailableSlot(state, action: PayloadAction<ParentObject>) {
      const { slotSuggestions, availableSlot, taskId } = action.payload;
      return {
        ...state,
        slotSuggestions,
        availableSlot,
        taskId,
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
    setSlotDate(state, action: PayloadAction<Array<DropdownType>>) {
      return {
        ...state,
        slotDate: action.payload,
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
    setSelectedType(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedType: action.payload,
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
    setTypeOfRequest(state, action: PayloadAction<string>) {
      return {
        ...state,
        typeOfRequest: action.payload,
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
    setSlotTime(state, action: PayloadAction<Array<DropdownType>>) {
      return {
        ...state,
        slotTime: action.payload,
      };
    },

    /**
     * Action to reset customer service store value
     *
     * @function
     * @param {object} state - The current state of the reducer.
     */
    resetRaiseRequest(state) {
      return {
        ...state,
        accountInfo: {},
        messages: {},
        categories: [],
        allCategoryInfo: [],
        subCategories: [],
        suspensionReason: [],
        availableSlot: {},
        slotSuggestions: [],
        taskId: {},
        slotDate: [],
        slotTime: [],
      };
    },

    /**
     * Action to reset customer service store value
     *
     * @function
     * @param {object} state - The current state of the reducer.
     */
    resetTrackRequest(state) {
      return {
        ...state,
        subscriberRequests: [],
      };
    },
  },
});

export const { actions } = customerServiceSlice;

export default customerServiceSlice.reducer;
