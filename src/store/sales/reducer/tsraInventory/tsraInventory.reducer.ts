/**
 * tsra inventory reducer will be responcible for tsra inventory actions
 *
 * @module store/sales/reducer/tsraInventory
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { tsraInventoryType } from 'store/sales/types/tsraInventory';

/**
 * Initial state for the tsraInventory reducer.
 *
 * @type {object}
 * @property {string} stocksCount - total stocks counts.
 */
const initialState: tsraInventoryType = {
  stocksCount: '',
  all: '',
  filterCount: '',
  multiCheckbox: [],
  selcectedFilters: {},
  filteredTableData: [],
  tableData: [],
};

/**
 * Slice representing the tsraInventory reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/tsraInventory';
 * dispatch(actions.tsraInventoryStart());
 * dispatch(actions.tsraInventorySuccess(data));
 */
const tsraInventorySlice = createSlice({
  name: 'tsraInventory',
  initialState,
  reducers: {
    /**
     * Action to handle the start of a process.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    tsraInventoryStart(state) {
      return { ...state };
    },

    setSelcectedFilters(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        selcectedFilters: action.payload,
      };
    },

    setFilteredTableData: (state, action: PayloadAction<ParentObject>) => ({
      ...state,
      filteredTableData: action.payload.result,
    }),

    tsraFilterCount(state, action: PayloadAction<any>) {
      return {
        ...state,
        filterCount: action.payload,
      };
    },
  },
});

export const { actions } = tsraInventorySlice;

export default tsraInventorySlice.reducer;
