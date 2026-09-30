/**
 * @module store/sales/query/invoice
 * @description Reducer query definitions for invoice actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch invoiceTransactions data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: invoiceTransactions,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const invoiceTransactions = gql`
  query GetInvoiceByUserSubId($type: String, $subscriberId: String) {
    getInvoiceByUserSubId(type: $type, subscriberId: $subscriberId) {
      info {
        subscriberId
        transactionId
        amount
        transactionDate
        bingeRechargeFlag
      }
      status
      message
    }
  }
`;

/**
 * GraphQL query to fetch getGstInvoiceByUserId data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getGstInvoiceByUserId,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */

export const getGstInvoiceByUserId = gql`
  query GetGstInvoiceByUserId {
    getGstInvoiceByUserId {
      gstNumber
      status
      message
    }
  }
`;

/**
 * GraphQL query to updateGst data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: updateGst,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */

export const updateGst = gql`
  mutation UpdateGst($input: gstNumberInput) {
    updateGst(input: $input) {
      status
      message
    }
  }
`;
export const getGstDetailsByUserId = gql`
  query GetGstDetailsByUserId {
    getGstDetailsByUserId {
      gstNumber
      dealerType
      status
      message
    }
  }
`;
