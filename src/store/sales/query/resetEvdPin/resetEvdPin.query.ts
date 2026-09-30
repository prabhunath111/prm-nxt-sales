/**
 * @module store/query/resetEvdPin
 * @description Reducer query definitions for resetEvdPin actions.
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
export const generateOTPWithOutSubId = gql`
  mutation GenerateOTPWithOutSubId {
    generateOTPWithOutSubId {
      transStatus
      transStatusNT
    }
  }
`;

export const resetEVDPin = gql`
  mutation ResetEVDPin($input: ResetEvdPinInput!) {
    resetEVDPin(input: $input) {
      message
      status
      subMessage
      username
    }
  }
`;

export const searchPartner = gql`
  mutation SearchPartner($roleId: String) {
    searchPartner(roleId: $roleId) {
      info {
        userId
        mdn
        name
        nameNT
        nameandmdn
        subName
        subNameNT
        mobile
        roleId
      }
      status
      message
    }
  }
`;

export const resetEVDPinForPartner = gql`
  mutation ResetEVDPin($input: ResetEvdPinInput!) {
    resetEVDPin(input: $input) {
      message
      status
      subMessage
      username
    }
  }
`;
