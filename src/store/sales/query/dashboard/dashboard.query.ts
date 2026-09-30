/**
 * @module store/query/dashboard
 * @description Reducer query definitions for dashboard actions.
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
export const SAMPLE_QUERY = gql`
  query sample_query_selcetor($sampleVariable: String!) {
    sample_query_fn(variable_name: $sampleVariable) {
      status
      message
      data
    }
  }
`;
