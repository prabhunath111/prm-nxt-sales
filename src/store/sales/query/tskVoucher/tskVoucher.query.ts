/**
 * @module store/sales/query/tskVoucher
 * @description Reducer query definitions for tskVoucher actions.
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
export const getTskVoucherDetails = gql`
  mutation GetTskVoucherDetails($input: TskVoucherInput) {
    getTskVoucherDetails(input: $input) {
      result {
        voucherSerialNo
        voucherStatus
        voucherExpiryDate
        accountNumber
        dealerCode
        dealerName
        dealerMobNo
        distributorCode
        distributorName
        inventoryLocation
        subscriberId
        subscriberName
        subscriberMobile
      }
      status
      message
    }
  }
`;
