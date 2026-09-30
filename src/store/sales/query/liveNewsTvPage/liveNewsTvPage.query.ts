/**
 * @module store/sales/query/liveNewsTvPage
 * @description Reducer query definitions for liveNewsTvPage actions.
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
  query sample_query_selector($sampleVariable: String!) {
    sample_query_fn(variable_name: $sampleVariable) {
      status
      message
      data
    }
  }
`;

export const metaData = gql`
  query MetaDetailsContent($metaContentType: String, $metaContentId: String, $isWeb: Boolean) {
  metaDetailsContent(metaContentType: $metaContentType, metaContentId: $metaContentId, isWeb: $isWeb) {
    message
    result
    status
  }
}
`;
