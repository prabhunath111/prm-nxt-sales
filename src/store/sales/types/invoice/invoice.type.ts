import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef invoiceType
 * @property {string} text - Content for the reducer interface.
 */
export interface invoiceType {
  invoiceTransactions: [];
  invoiceGSTdata: [];
  gstTransactionId: ParentObject;
  gstData: ParentObject;
  closeView: boolean;
  comingFromInvoice: boolean;
}
