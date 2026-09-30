import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef manageHierarchyType
 * @property {string} text - Content for the reducer interface.
 */
export interface manageHierarchyType {
  manageHierarchyDisDetails: ParentObject;
  outletResponseAndLanguages: ParentObject;
  townCodeCCPartnerDetials: ParentObject;
  dealerDetailsCCPartner: ParentObject;
  ccPartnerSuccessData: ParentObject;
  isIspValid: boolean;
  isFormModified: boolean;
  validationAttemptCount: number;
  reportType: string;
  dateType: ParentObject;
  distributerListData: ParentObject;
  distributerIdData: ParentObject;
  successRoleTypeData: ParentObject;
}
