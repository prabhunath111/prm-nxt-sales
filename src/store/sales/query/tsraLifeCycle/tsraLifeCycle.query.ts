/**
 * @module store/sales/query/tsraLifeCycle
 * @description Reducer query definitions for tsraLifeCycle actions.
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
export const tsrafilter = gql`
  query Tsrafilter {
    tsrafilter {
      statusFilter
      daysFilter
      status
      message
    }
  }
`;

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
export const trackTsraRequest = gql`
  query TsraTrackRequest($type: String, $formName: String) {
    tsraTrackRequest(type: $type, formName: $formName) {
      status
      message
      tsraTrack {
        partnerName
        partnerCode
        requestDate
        actionDate
        status
        tsraMdn
        reason
      }
      tableColumns
    }
  }
`;

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
export const trackTsraAction = gql`
  query TsraActionTrackRequest {
    tsraActionTrackRequest {
      status
      message
      tsraTrack {
        tsraName
        partnerCode
        createdDate
        status
        tsraMdn
      }
    }
  }
`;

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
export const getTsraPartnerDetails = gql`
  query GetPartnerDetails($partnerCode: String) {
    getPartnerDetails(partnerCode: $partnerCode) {
      partnerDetails
      status
      message
    }
  }
`;

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
export const getTsraDropDowns = gql`
  query GetTsraDropDowns {
    getTsraDropDowns {
      message
      status
      qualifications
      installerType
      wheelerAvailable
    }
  }
`;

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
export const tsraActionApprovedReject = gql`
  mutation TsraActionApprovedReject($input: tsraActionApproveRejectInput) {
    tsraActionApprovedReject(input: $input) {
      status
      message
    }
  }
`;
