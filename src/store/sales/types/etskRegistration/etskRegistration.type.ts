import { ParentObject } from 'store/sales/query/common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef etskRegistrationType
 * @property {string} text - Content for the reducer interface.
 */
export interface etskRegistrationType {
  pincode: string;
  validatePinCodeSuccessData: ParentObject;
  accountCreationSuccessData: ParentObject;
  packSelected: string;
  boxTypeSelected: string;
  categorySelectedPacksData: ParentObject[];
  selectedPacksToBuy: ParentObject[];
  validatePacksSuccessData: ParentObject;
  filtersData: ParentObject;
  boxTypeData: ParentObject;
  customerDetails: ParentObject;
  freePackSelected: string;
  primaryBoxPrice: string;
  finalPrice: string;
  paidPrice: string;
  categorySelectedRed: ParentObject | undefined;
  durationSelectedRed: ParentObject | undefined;
  selctedPillRed: string;
  categoryDropdownDataRed: ParentObject[];
  durationDropdownDataRed: ParentObject[];
  flexiPlan: number;
  evdPin: string;
  etskAlertConfirm: boolean;
}
