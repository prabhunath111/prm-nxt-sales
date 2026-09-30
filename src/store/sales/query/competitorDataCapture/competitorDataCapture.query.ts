/**
 * @module store/sales/query/competitorDataCapture
 * @description Reducer query definitions for competitorDataCapture actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: DoBalanceEnquire,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const doBalanceEnquire = gql`
  query Query($input: DoBalanceEnquireInput) {
    doBalanceEnquire(input: $input)
  }
`;

/**
 * GraphQL query to fetch data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: competitorBoxTypeFilter,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const competitorBoxTypeFilter = gql`
  query Query {
    competitorBoxTypeFilter
  }
`;

/**
 * GraphQL query to fetch data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: competitorServiceProviderFilter,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const competitorServiceProviderFilter = gql`
  query Query {
    competitorServiceProviderFilter
  }
`;

/**
 * GraphQL query to fetch data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: competitorServiceProviderFilter,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const captureCompetitorData = gql`
  query Query($input: CaptureCompetitorDataInput) {
    captureCompetitorData(input: $input)
  }
`;
