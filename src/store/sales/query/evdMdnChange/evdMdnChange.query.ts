/**
 * @module store/query/evdMdnChange
 * @description Reducer query definitions for evdMdnChange actions.
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
 *   query: generateOTP,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const generateOTP = gql`
  mutation GenerateOTPWithOutSubId {
    generateOTPWithOutSubId {
      transStatus
      transStatusNT
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
 *   query: generateOTPWithMobile,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const generateOTPWithMobile = gql`
  query GenerateOTPWithMobile($mobile: String) {
    generateOTPWithMobile(mobile: $mobile) {
      transStatus
      status
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
 *   query: generateOTP,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const updateEvdMdn = gql`
  mutation UpdateMDN($input: UpdateEvdMDNInput) {
    updateMDN(input: $input) {
      message
      subMessage
      newMDN
      status
      requestId
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
 *   query: generateOTP,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const evdMdnfilter = gql`
  query EvdMdnfilter {
    evdMdnfilter {
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
 *   query: generateOTP,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const mdnChangeAppOrRejList = gql`
  mutation MdnChangeAppOrRejList($input: MdnChangeAppOrRejListInput) {
    mdnChangeAppOrRejList(input: $input) {
      info {
        requestId
        partnerId
        partnerName
        partnerNameNT
        oldRmn
        newRmn
        requestDate
        actionDate
        status
        statusNT
        reason
      }
      tableColumns
      status
      message
    }
  }
`;

export const evdMdnChangeStatus = gql`
  mutation EvdMdnChangeStatus($input: EvdMdnChangeStatus) {
    evdMdnChangeStatus(input: $input) {
      partnerName
      partnerId
      newRmn
      reason
      message
      status
    }
  }
`;
