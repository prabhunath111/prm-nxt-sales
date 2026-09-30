import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef evdBalanceInfoType
 * @property {string} text - Content for the reducer interface.
 */
export interface evdBalanceInfoType {
  balanceInfo: ParentObject;
  filteredBalanceInfo: ParentObject;
  evdInfo: ParentObject;
  isFilterApplied: boolean;
  radioContainerRed: string;
  durationIdRed: string;
  filteredBalanceInfoConf: ParentObject;
  filteredConf: ParentObject;
  dealerBalanceInput: string;
  pageNumber: number;
  consolidatedParams: ParentObject;
  paginationData: ParentObject;
  isFos: boolean;
  consolidatedData: ParentObject;
}
