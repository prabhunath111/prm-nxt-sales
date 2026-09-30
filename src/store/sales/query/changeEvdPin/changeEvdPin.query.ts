/**
 * @module store/query/changeEvdPin
 * @description Reducer query definitions for changeEvdPin actions.
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
 *   query: CHANGE_EVD_PIN_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const CHANGE_EVD_PIN_QUERY = gql`
  mutation ChangeEVDPin($input: ChangeEvdPinInput!) {
    changeEVDPin(input: $input) {
      message
      status
    }
  }
`;
