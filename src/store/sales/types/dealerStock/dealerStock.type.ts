import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef dealerStockType
 * @property {string} text - Content for the reducer interface.
 */
export interface dealerStockType {
  stockList: ParentObject;
  productTypeDropdownList: ParentObject;
  multiCheckboxStockFilter: ParentObject;
}
