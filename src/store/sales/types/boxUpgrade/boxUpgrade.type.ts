import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef boxUpgradeType
 * @property {string} text - Content for the reducer interface.
 */
export interface boxUpgradeType {
  accountInfoBoxData: ParentObject;
  formatedBoxData: ParentObject;
  SubscriberID: string;
  rechargeAmount: string;
  vcNumber: string;
  toBeUpgradeType: string;
  boxType: string;
  upgradedType: string;
  eligibles: ParentObject;
  bingeOffer: ParentObject;
  finalRequiredAmount: string;
  evdPin: string;
  status: string;
  SrNo: string;
  TransactionID: string;
  bingeFlag: boolean;
  woDetails: ParentObject[];
  paidAmount: string;
  selectedBox: string;
  rechargeFlag: boolean;
  upgradedToNT: string;
  upgradeMsg: string;
}
