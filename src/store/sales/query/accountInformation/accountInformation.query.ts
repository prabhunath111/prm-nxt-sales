/**
 * @module store/query/accountInformation
 * @description Reducer query definitions for accountInformation actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch accountInformation data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: accountInformation,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */

export const accountInformation = gql`
  query GetAccountInfo($subscriberInfo: String) {
    getAccountInfo(subscriberInfo: $subscriberInfo) {
      customerName
      customerStatus
      customerStatusNT
      customerRMN
      monthlyRecharge
      balance
      rechargeDueDate
      endDateBasePack
      packageInfo
      packageInfoBinge
      secPackageInfo
      boxDetails {
        connectionTypeName
        boxType
        boxTypeNT
        connectionStatus
        connectionType
        vcNumber
        secondaryPack
        secondaryPackList
        connectionTypeNT
      }
      subId
      subIdList {
        rmn
        subId
        subIdNT
        aliasName
        status
        statusNT
      }
      maskedRMN
      isDhamakaEligible
    }
  }
`;

export const getLastFiveRecharge = gql`
  query GetLastFiveRecharges($subscriberId: String) {
    getLastFiveRecharges(subscriberId: $subscriberId) {
      lastRechargeDetails {
        amount
        transDate
        transactionId
      }
      lastRecharge
      lastRechargeAmount
      lastRechargeDate
    }
  }
`;
