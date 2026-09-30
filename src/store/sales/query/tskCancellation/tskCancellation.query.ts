/**
 * @module store/sales/query/tskCancellation
 * @description Reducer query definitions for tskCancellation actions.
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
export const validateTskPinForCancellation = gql`
  query ValidateTskPinForCancellation($tskPin: String!) {
    validateTskPinForCancellation(tskPin: $tskPin) {
      result
      message
      status
    }
  }
`;

export const cancelTskPin = gql`
  query CancelTskPin($tskSerialNumber: String!, $tskPin: String) {
    cancelTskPin(tskSerialNumber: $tskSerialNumber, tskPin: $tskPin) {
      result {
        tskNumber
        status
        errorCode
        message
      }
      message
      status
    }
  }
`;
