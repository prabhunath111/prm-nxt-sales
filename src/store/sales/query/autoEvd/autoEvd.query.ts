/**
 * @module store/query/autoEvd
 * @description Reducer query definitions for autoEvd actions.
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
 *   query: dealerSearch,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const dealerSearch = gql`
  query DealerSearch {
    dealerSearch {
      info {
        userId
        mdn
        name
        nameNT
        balance
        outletType
        thresholdSet
        thresholdSetNT
        minBalance
        reqBalance
        avgDailyRecharge
      }
      status
      message
      thresHoldFilter
      priceFilter
    }
  }
`;

export const autoEvdFilter = gql`
  query AutoEvdFilter($search: String, $thresHoldValue: String, $priceValue: String) {
    autoEvdFilter(search: $search, thresHoldValue: $thresHoldValue, priceValue: $priceValue) {
      info {
        userId
        mdn
        name
        balance
        outletType
        thresholdSet
        minBalance
        reqBalance
        avgDailyRecharge
      }
      message
      status
    }
  }
`;

export const addOrUpdateDeleteEvdTransfer = gql`
  mutation AddOrUpdateDeleteEvdTransfer($input: UpdateDeleteEvdTransferInput) {
    addOrUpdateDeleteEvdTransfer(input: $input) {
      message
      dealerName
      status
    }
  }
`;
