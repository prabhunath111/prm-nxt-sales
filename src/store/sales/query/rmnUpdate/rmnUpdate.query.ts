/**
 * @module store/query/rmnUpdate
 * @description Reducer query definitions for rmnUpdate actions.
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
export const checkRMNEligibility = gql`
  query CheckEligibilityForRMNUpdate($subscriberInfo: String!) {
    checkEligibilityForRMNUpdate(subscriberInfo: $subscriberInfo) {
      accountInfo {
        subIdList {
          rmn
          subId
          subIdNT
          aliasName
          status
          statusNT
        }
        rmn
        subId
      }
      eligibleForUpdate
    }
  }
`;

export const updateMobileNumber = gql`
  query UpdateMobileNumber($subscriberId: String!, $rmn: String!) {
    updateMobileNumber(subscriberId: $subscriberId, rmn: $rmn) {
      updateMessage
    }
  }
`;
