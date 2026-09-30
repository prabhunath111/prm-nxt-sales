import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef partnerApprovalType
 * @property {string} text - Content for the reducer interface.
 */
export interface partnerApprovalType {
  dropDownListAndRejectReasons: ParentObject;
  partnerList: ParentObject;
  partnerApprovalSuccessData: ParentObject;
  selectedPartner: ParentObject;
  initialData: ParentObject;
  dropDownDataList: ParentObject;
  showDynamicNoData: boolean;
}
