/**
 * @module store/sales/query/tsraApproval
 * @description Reducer query definitions for tsraApproval actions.
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
 *   query: getTSRATrackList,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getTSRATrackList = gql`
  query GetTSRATrackList($role: String, $userId: String, $days: String, $formName: String) {
    getTSRATrackList(role: $role, userId: $userId, days: $days, formName: $formName) {
      result {
        dataList
      }
      tableColumns
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
 *   query: getTSRAApprovalList,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getTSRAApprovalList = gql`
  query GetTSRAApprovalList($role: String, $userId: String) {
    getTSRAApprovalList(role: $role, userId: $userId) {
      result {
        rejectReasons {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
        qualification {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
        installerType {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
        dataList
      }
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
 *   query: approveOrRejectTsraDealer,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const approveOrRejectTsraDealer = gql`
  query ApproveOrRejectTsraDealer(
    $firstName: String
    $lastName: String
    $arn1: String
    $arn2: String
    $qualification: String
    $twoWheelerAvailable: String
    $partnerCode: String
    $parentCode: String
    $partnerSubStatus: String
    $partnerStatus: String
    $comments: String
    $tsraFlag: String
    $installerType: String
    $status: String
  ) {
    approveOrRejectTsraDealer(
      firstName: $firstName
      lastName: $lastName
      arn1: $arn1
      arn2: $arn2
      qualification: $qualification
      twoWheelerAvailable: $twoWheelerAvailable
      partnerCode: $partnerCode
      parentCode: $parentCode
      partnerSubStatus: $partnerSubStatus
      partnerStatus: $partnerStatus
      comments: $comments
      tsraFlag: $tsraFlag
      installerType: $installerType
      status: $status
    ) {
      status
      message
    }
  }
`;
