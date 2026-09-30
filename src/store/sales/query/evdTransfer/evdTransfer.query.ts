/**
 * @module store/query/evdTransfer
 * @description Reducer query definitions for evdTransfer actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: fetchChildPartnerDetails,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const fetchChildPartnerDetails = gql`
  mutation FetchChildPartnerDetails($input: fetchChildPartnerDetailsInput) {
    fetchChildPartnerDetails(input: $input) {
      result {
        nameandmdn
        name
        nameNT
        mdnNumber
        retailerFlag
        activityStatus
        subName
      }
      partnerBalance
      status
      message
    }
  }
`;

export const doEVDTransferWeb = gql`
  mutation DoEVDTransferWeb($input: DoEVDTransferWebInput) {
    doEVDTransferWeb(input: $input) {
      subMessage
      newBalance
      amountTransfer
      transactionId
      partnerName
      partnerMdn
    }
  }
`;
