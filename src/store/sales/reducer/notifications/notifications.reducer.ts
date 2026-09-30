/**
 * reducer for notifications
 *
 * @module store/sales/reducer/notifications
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { notificationsType } from 'store/sales/types/notifications';

/**
 * Initial state for the notifications reducer.
 *
 * @type {object}
 * @property {string} read - Default read boolean value
 * @property {string} unRead - Default unRead boolean value
 * @property {string} notificationData - notificationData  list
 */
const initialState: notificationsType = {
  read: true,
  unRead: true,
  notificationData: [],
  carouselData: [],
};

/**
 * Slice representing the notifications reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/notifications';
 * dispatch(actions.notificationsStart());
 * dispatch(actions.notificationsSuccess(data));
 */
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    notificationsStart(state) {
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
    setNotificationData: (state, action) => ({
      ...state,
      notificationData: action.payload,
    }),
    setRead: (state, action) => ({
      ...state,
      read: action.payload,
    }),
    setUnRead: (state, action) => ({
      ...state,
      unRead: action.payload,
    }),

    /**
     * Action to handle successful completion of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setCarouselData: (state, action) => ({
      ...state,
      carouselData: action.payload,
    }),
  },
});

export const { actions } = notificationsSlice;

export default notificationsSlice.reducer;
