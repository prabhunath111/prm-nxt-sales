import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef tsraInventoryType
 * @property {string} text - Content for the reducer interface.
 */
export interface tsraInventoryType {
  stocksCount: string;
  filterCount: string;
  all: string;
  multiCheckbox: ParentObject;
  selcectedFilters: ParentObject;
  tableData: ParentObject;
  filteredTableData: ParentObject;
}
