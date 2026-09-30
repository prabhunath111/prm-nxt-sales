import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef transactionHistoryType
 * @property {ParentObject} transactionHistory - Content for the reducer interface.
 */
export interface transactionHistoryType {
  transactionHistory: ParentObject[];
  reversalReasons: Array<{ label: string; value: string }>;
  balance: string;
  isTransactionDetails: boolean;
  transactionDetails: ParentObject;
}
