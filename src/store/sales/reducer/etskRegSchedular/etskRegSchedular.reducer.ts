/**
 * e tsk schedular for ets reg
 *
 * @module store/sales/reducer/etskSchedular
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { etskRegSchedularType } from 'store/sales/types/etskRegSchedular';

/**
 * Initial state for the etskSchedular reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: etskRegSchedularType = {
  date: '',
  successData: {},
  rechargeAmount: '',
  evdPin: '',
  timeSlotsData: {},
  selectedSlot: '',
};

/**
 * Slice representing the etskSchedular reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/etskSchedular';
 * dispatch(actions.etskSchedularStart());
 * dispatch(actions.etskSchedularSuccess(data));
 */
const etskRegSchedularSlice = createSlice({
  name: 'etskSchedular',
  initialState,
  reducers: {
    /**
     * Action to handle select date for etsk schedule.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    handleEtskScheduleDate(state, action: PayloadAction<any>) {
      return {
        ...state,
        date: action.payload,
      };
    },
    /**
     * Action to handle select time slots for etsk schedule.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    handleEtskTimeSlots(state, action: PayloadAction<any>) {
      return {
        ...state,
        selectedSlot: action.payload,
      };
    },
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    etskSchedularStart(state) {
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
    etskSchedularSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        payloadDate: action.payload,
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
    setCreateWoEtskSuccessData(state, action: PayloadAction<any>) {
      return {
        ...state,
        successData: action.payload,
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
    setTimeSlotsData(state, action: PayloadAction<any>) {
      return {
        ...state,
        timeSlotsData: action.payload,
      };
    },
  },
});

export const { actions } = etskRegSchedularSlice;

export default etskRegSchedularSlice.reducer;
