import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef accountInformationType
 * @property {object} accountInformation - Content for the reducer interface.
 */

export interface UserRechargeInfo {
  amount: string;
  transDate: string;
  transactionId: string;
}
export interface accountInformationType {
  accountInformation: ParentObject;
  requestParams: ParentObject;
  lastFiveRecharge: UserRechargeInfo[];
  paramsRMN: ParentObject;
}
