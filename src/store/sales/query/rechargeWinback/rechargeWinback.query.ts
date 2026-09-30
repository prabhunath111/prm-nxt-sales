/**
 * @module store/query/rechargeWinback
 * @description Reducer query definitions for rechargeWinback actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch winback config properties list
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getWinBackConfigProperties,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getWinBackConfigProperties = gql`
  query GetWinBackConfigProperties {
    getWinBackConfigProperties {
      winBackSubCategoryNewDrop {
        id
        name
        nameNT
        object
      }
      winBackSubCategoryNewRadio {
        text
        value
      }
      winBackStatusDrop {
        id
        name
        nameNT
        object
      }
      campaignStatusDrop {
        id
        name
        nameNT
        object
      }
    }
  }
`;

/**
 * GraphQL query to fetch winback subscriber list
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getWinBackSubscriberList,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getWinBackSubscriberList = gql`
  query GetWinBackSubscriberList($winBackCategory: String!, $campaignStatus: String!) {
    getWinBackSubscriberList(winBackCategory: $winBackCategory, campaignStatus: $campaignStatus) {
      winBackSubIdList {
        subscriberId
        status
        created
        offerCode
        campCode
        campName
        campType
        treatmentCode
        contactDuration
        validity
        comments
        subscriberName
        responseStatus
      }
      campaignCode
      identifier
      rcReq
      otpReq
    }
  }
`;

/**
 * GraphQL query to fetch winback pack offers
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: fetchWinBackPacks,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const fetchWinBackPacks = gql`
  query FetchWinBackPacks($subscriberId: String!, $offerCode: String!) {
    fetchWinBackPacks(subscriberId: $subscriberId, offerCode: $offerCode) {
      accountInfo {
        boxDetails {
          connectionType
          connectionTypeName
          connectionTypeNT
          boxType
          vcNumber
          connectionStatus
          secondaryPack
        }
      }
      winbackOffers {
        packs {
          uom
          name
          nameNT
          stdPriUnit
          boxType
          type
          offerNumber
          friendlyName
          bonus
          margin
          offerNum
          detailsType
        }
        balance
      }
    }
  }
`;

/**
 * GraphQL query to update the winback subscriber status
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: updateWinBackSubscriberStatus,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const updateWinBackSubscriberStatus = gql`
  query UpdateWinBackSubscriberStatus($subscriberId: String!, $campaignCode: String!, $offerCode: String!, $rmn: String!, $treatmentCode: String!, $comment: String!) {
    updateWinBackSubscriberStatus(subscriberId: $subscriberId, campaignCode: $campaignCode, offerCode: $offerCode, rmn: $rmn, treatmentCode: $treatmentCode, comment: $comment) {
      transactionId
      message
    }
  }
`;

/**
 * GraphQL query to update the winback subscriber status
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getUniqueKwlrtyToken,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getUniqueKwlrtyToken = gql`
  query GetUniqueKwlrtyToken($mobileNumber: String, $subscriberId: String) {
    getUniqueKwlrtyToken(mobileNumber: $mobileNumber, subscriberId: $subscriberId) {
      result {
        dialingNo
      }
      message
      status
    }
  }
`;
