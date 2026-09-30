import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef tsraApprovalType
 * @property {string} text - Content for the reducer interface.
 */
export interface tsraApprovalType {
  tsraTableData: ParentObject;
  tsraApprovalListData: ParentObject;
  selectedDealer: ParentObject;
  tsraSuccessData: ParentObject;
}
