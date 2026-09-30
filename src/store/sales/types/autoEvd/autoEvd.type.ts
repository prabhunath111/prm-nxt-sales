/**
 * Dealer data type definitions
 *
 * @typedef {object} DealerData
 * @property {string} dealerName - Name of the dealer
 * @property {string} mdn - Mobile number of the dealer
 * @property {string} outletType - The type of outlet the dealer operates
 * @property {string|number} presentBalance - The current balance of the dealer
 * @property {string|number} avgDailyRecharge - The average daily recharge amount of the dealer
 * @property {string} thresholdSet - Indicator if the threshold is set ('Yes' or 'No')
 */

import { ParentObject } from '../common';

export type DealerData = {
  [x: string]: string | undefined;
  name: string;
  mdn: string;
  outletType: string;
  presentBalance: string;
  avgDailyRecharge: string;
  thresholdSet: string;
  evdCode: string;
  thresholdLimitValue?: string;
  autoEvdAmount?: string;
  userId?: string;
};

export type EvdData = {
  message: string;
  dealerName: string;
  status: boolean;
};

/**
 * Reducer interface/type definitions.
 *
 * @typedef autoEvdType
 * @property {object} dealerDetails - Content for the reducer interface.
 */

export interface autoEvdType {
  dealerDetails: DealerData;
  dealersList: DealerData[];
  evdSuccessData: EvdData;
  autoEvdNavigationData: ParentObject;
  autoEvdDealerList: ParentObject;
  autoEvdCurrentValues: ParentObject;
}
