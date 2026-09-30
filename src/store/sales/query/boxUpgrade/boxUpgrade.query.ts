/**
 * @module store/sales/query/boxUpgrade
 * @description Reducer query definitions for Box Upgrade actions.
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
 *   query: getAccountInfoBoxUpgrade,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getAccountInfoBoxUpgrade = gql`
  query GetAccountInfo($subscriberInfo: String) {
    getAccountInfo(subscriberInfo: $subscriberInfo) {
      boxDetails {
        connectionType
        connectionTypeName
        connectionTypeNT
        boxType
        boxTypeNT
        vcNumber
        connectionStatus
        secondaryPack
      }
      customerName
      customerRMN
      customerStatus
      subId
      subIdList {
        aliasName
        rmn
        status
        statusNT
        subId
        subIdNT
      }
      balance
      eligibles
      state
      isDhamakaEligible
      maskedRMN
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
 *   query: getExistingWO,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getExistingWO = gql`
  query GetWorkOrderBySubscriberAndVC($subscriberId: String!, $vcNumber: String!) {
    getWorkOrderBySubscriberAndVC(subscriberId: $subscriberId, vcNumber: $vcNumber) {
      transMessage
      subscriberId
      source
      woNumber
      workOrderDetails {
        resolutionCode
        vcNumber
        description
        woArea
        woNo
        woSalesType
        slotStart
        srvcRegion
        woStatus
        tslStartDateTime
        installerName
        reasonCode
        planEndDate
        woCreatedDate
        woType
        woSource
        woSubType
        woCompletionDate
        stbNumber
        woPriority
        installerCode
        lastUpdatedDate
        slotEnd
        createdBy
        woSubArea
        planStartDate
        preferredDate
        woInProgressDate
        installer_Mob_No
      }
      transStatus
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
 *   query: getEligibles,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getEligibles = gql`
  query Eligibilities($boxType: String!) {
    getBoxUpgradeEligibility(boxType: $boxType) {
      eligibilities {
        NEW_BOX
        AMOUNT
        SR_TYPE
        SR_AREA
        SR_SUBAREA
        DESCRIPTION
        NEW_BOXNT
        AMOUNTNT
        SR_TYPENT
        SR_AREANT
        SR_SUBAREANT
        DESCRIPTIONNT
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
 *   query: getBingePlusOffer,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getBingePlusOffer = gql`
  query GetBingeOffers($duration: String!) {
    getBingeOffers(duration: $duration) {
      packageDetails {
        SIEBELNAME
        PRICE
        FRIENDLYNAME
        FLEXI_PACK
        DURATION
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
 *   query: finalSubmissonBoxUpgrade,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const finalSubmissonBoxUpgrade = gql`
  mutation BoxUpgrade($input: BoxUpgradeInput!) {
    boxUpgrade(input: $input) {
      errorCode
      srNumber
      srNumberNT
      transId
      message
    }
  }
`;
