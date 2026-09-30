/**
 * @module store/query/evdTransferAsm
 * @description Reducer query definitions for evdTransferAsm actions.
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
 *   query: SAMPLE_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getFosDealerList = gql`
  mutation GetFosDealerList($input: AsmFodDealerInput) {
    getFosDealerList(input: $input) {
      message
      status
      getFosDealerList
    }
  }
`;

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: SAMPLE_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getBalanceFos = gql`
  mutation GetBalanceFos($input: BalanceInput) {
    getBalanceFos(input: $input) {
      parentMdn
      partnerBalance
      status
      message
    }
  }
`;

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: SAMPLE_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const asmReverseTransfer = gql`
  mutation AsmReverseTransfer($input: AsmReverseTransfer) {
    asmReverseTransfer(input: $input) {
      subMessage
      newBalance
      amountTransfer
      transactionId
      partnerName
      partnerMdn
    }
  }
`;
