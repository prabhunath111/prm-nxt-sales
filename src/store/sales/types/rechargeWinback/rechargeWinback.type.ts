import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef rechargeWinbackType
 * @property {string} text - Content for the reducer interface.
 */
export interface rechargeWinbackType {
  subscriberDetails: ParentObject;
  winbackConfigProperties: ParentObject;
  winBackSubscriberList: ParentObject;
  winBackPacks: ParentObject;
  subscriberRmn: ParentObject;
  winBackSuccessData: ParentObject;
  winBackPack: ParentObject;
  filteredSubscriberList: ParentObject;
  campaignName: string;
  uniqueKwlrtyNumber: ParentObject;
}
