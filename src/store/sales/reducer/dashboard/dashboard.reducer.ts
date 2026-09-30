/**
 * Reducer for dashboard data
 *
 * @module store/reducer/dashboard
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dashboardType } from 'store/sales/types/dashboard';

/**
 * Initial state for the dashboard reducer.
 *
 * @type {object}
 * @property {ParentObject} cumulativeFilterData - Stores the cumulative filter data used for filtering the dashboard results.
 * @property {ParentObject} cumulativeTableData - Contains the cumulative table data displayed on the dashboard.
 * @property {ParentObject} monthWiseFilterData - Stores the month-wise filter data used to filter results on a monthly basis.
 * @property {SetStateAction<TableRow[]> | undefined} monthWiseTableData - Represents the table data displayed for month-wise results. Can be undefined if no data is available.
 * @property {string} infoLastUpdatedDate - Stores the last date when the information on the dashboard was updated.
 */

const initialState: dashboardType = {
  cumulativeFilterData: {},
  cumulativeTableData: [],
  monthWiseFilterData: [],
  monthWiseTableData: [],
  infoLastUpdatedDate: '',
};

/**
 * Slice representing the dashboard reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/dashboard';
 * dispatch(actions.dashboardStart());
 * dispatch(actions.dashboardSuccess(data));
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    dashboardStart(state) {
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
    dashboardSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        payloadDate: action.payload,
      };
    },
  },
});

export const { actions } = dashboardSlice;

export default dashboardSlice.reducer;
