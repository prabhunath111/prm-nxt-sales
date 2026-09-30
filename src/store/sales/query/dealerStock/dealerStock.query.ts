/**
 * @module store/sales/query/dealerStock
 * @description Reducer query definitions for dealerStock actions.
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
 *   query: getDealerStocks,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getDealerStocks = gql`
  query GetDealerStocks($input: DealerInput) {
    getDealerStocks(input: $input) {
      name
      mdn
      evdBalance
      userId
      dealerStocks {
        name
        dealerCode
        description
        dealerName
        outletType
        product
        productType
        purchaseCode
        serializedFlg
        stockInHand
        stockNorm
        xTslSugestedQty
      }
    }
  }
`;
