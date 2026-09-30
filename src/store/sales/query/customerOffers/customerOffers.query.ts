/**
 * @module store/query/customerOffers
 * @description Reducer query definitions for customerOffers actions.
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
export const getOfferPacks = gql`
  query GetOfferPacks($subscriberInfo: String) {
    getOfferPacks(subscriberInfo: $subscriberInfo) {
      balance
      otpRequiredForTargetedOffers
      maximumMakeMyHDChannels
      accountInfo {
        subId
        subIdNT
        customerName
        customerRMN
        isDhamakaEligible
        subIdList {
          rmn
          subId
          subIdNT
          aliasName
          status
          statusNT
        }
      }
      offers
      endDateFDR
      actStatus
      actStatusNT
      rmn
      vcArray
      disclaimer
      subscriberId
      fdoStatus
    }
  }
`;
