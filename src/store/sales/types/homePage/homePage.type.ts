import { ParentObject } from 'store/sales/types/common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef homePageType
 * @property {string} text - Content for the reducer interface.
 */
export interface homePageType {
  transactionData: ParentObject;
  transactionsDetails: ParentObject;
  evdBalance: number;
  ftdData: ParentObject;
  homePageData: ParentObject;
  daysFilter: ParentObject[];
  paymentType: ParentObject[];
  statusFilter: ParentObject[];
  transactionAmount: ParentObject[];
  bannerImages: ParentObject;
  railData:ParentObject;
  isHomeRailVisible:boolean;
  railFilterLanguages:string[];
}
