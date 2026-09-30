/**
 * This is the reducer file for LiveNewsTvPage component
 *
 * @module store/sales/reducer/liveNewsTvPage
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { liveNewsTvPageType } from 'store/sales/types/liveNewsTvPage';

/**
 * Initial state for the liveNewsTvPage reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: liveNewsTvPageType = {
  metaData:{
        meta: [],
  },
  currentMetaData:{
    contentId:"",
    contentType:""
  },
  playBackData:{}
};

/**
 * Slice representing the liveNewsTvPage reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/liveNewsTvPage';
 * dispatch(actions.liveNewsTvPageStart());
 * dispatch(actions.liveNewsTvPageSuccess(data));
 */
const liveNewsTvPageSlice = createSlice({
  name: 'liveNewsTvPage',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    liveNewsTvPageStart(state) {
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
    liveNewsTvPageSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        payloadDate: action.payload,
      };
    },

    /**
     * Action to store MetaAPI Call .
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    SetMetaData(state, action: PayloadAction<any>) {
      state.metaData =action.payload
    },

    SetPlayBackData(state, action: PayloadAction<any>){
      state.playBackData =action.payload
    },

    SetCurrentMetaData(state, action: PayloadAction<any>) {
      state.currentMetaData =action.payload
    },


  },
});

export const { actions } = liveNewsTvPageSlice;

export default liveNewsTvPageSlice.reducer;
