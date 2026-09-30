import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef purchaseOrderType
 * @property {string} text - Content for the reducer interface.
 */
export interface purchaseOrderType {
  distributorTrackRequestDetails: ParentObject;
  dealerMob: string;
  tableColumn: ParentObject[];
  detailsColumn: ParentObject[];
  posmDetails: ParentObject[];
  dealerTrackDetails: ParentObject[];
  walletDetails: ParentObject[];
  paymentTypeArray: ParentObject[];
  fullPaymentType: ParentObject[];
  isEdit: boolean;
  editableData: ParentObject;
  duration: ParentObject;
  status: ParentObject;
  actionRequestTableData: ParentObject[];
  rejectedUserData: ParentObject;
  settlementsData: ParentObject;
  orderIdDetails: ParentObject;
  balanceEnquiryData: ParentObject;
  materialDetailsData: ParentObject[];
  paymentTypesData: ParentObject;
  selectedMaterial: ParentObject[];
  selectedMaterialPill: string;
  asmTrackRequestData: ParentObject;
  successMessage: string;
}
