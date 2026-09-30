/**
 * @module store/query/customerService
 * @description Reducer query definitions for customerService actions.
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
export const getCustomerServiceInfo = gql`
  query GetCustomerServiceInfo($subscriberInfo: String!) {
    getCustomerServiceInfo(subscriberInfo: $subscriberInfo) {
      accountInfo {
        customerName
        customerStatus
        customerStatusNT
        ocsFlag
        serviceRegionId
        subId
        subIdList {
          rmn
          subId
          subIdNT
          aliasName
          status
          statusNT
        }
      }
      categories {
        id
        name
        nameNT
      }
      allCategoryInfo {
        category
        categoryNT
        subCategory
        subCategoryNT
        subArea
        subAreaNT
        status
        woType
        woTypeNT
        woSubType
        woSubTypeNT
      }
      warnings
    }
  }
`;

export const getServiceSubCategories = gql`
  query GetServiceSubCategories($category: String!) {
    getServiceSubCategories(category: $category) {
      subCategories {
        id
        name
        nameNT
      }
    }
  }
`;

export const getSuspensionReason = gql`
  query GetSuspensionReason {
    getSuspensionReason {
      id
      name
      nameNT
    }
  }
`;

export const trackServiceRequest = gql`
  query GetServiceRequests($subscriberInfo: String!) {
    getServiceRequests(subscriberInfo: $subscriberInfo) {
      accountInfo {
        annualRecharge
        bingePlus
        eligibles
        balance
        boxDetails {
          connectionType
          connectionTypeName
          connectionTypeNT
          boxType
          boxTypeNT
          vcNumber
          connectionStatus
          secondaryPack
          secondaryPackList
        }
        customerName
        customerRMN
        customerStatus
        customerStatusNT
        endDateBasePack
        digiCardNo
        restrictionMessage
        monthlyRecharge
        recommendedMonthlyRecharge
        ocsFlag
        packageInfo
        rechargeDueDate
        secPackageInfo
        semiAnnualRecharge
        serviceRegionId
        state
        subId
        subIdNT
        source
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
        isDhamakaEligibleNT
        flexiMBRValue
        flexiDueDate
        flexiPlanInfo
        flexiPlanInfoNew
        rmn
        semiAnnualMargin
        annualMargin
        flexiRechargeAmountSemiAnnual
        flexiRechargeAmountAnnual
        flexiSemiAnnualBonus
        flexiAnnualBonus
        bingePlanInfo
        bingeRechargeValue
        bingeOffer
        flexiDealerIncentiveAnnual
        flexiDealerIncentiveSemiAnnual
        flexiRechargeAmount
        dhamakaSubId
        disclaimerWinback
        accountType
      }
      subscriberRequests {
        wo {
          requestNumber
          natureOfRequest
          requestType
          status
          description
          resolutionCode
          subArea
          source
          openedDate
          dueDate
          closeDate
          parentRequestNumber
          priority
          severity
          createdBy
          installerName
          area
          subscriberId
        }
        sr {
          requestNumber
          natureOfRequest
          requestType
          status
          description
          resolutionCode
          subArea
          source
          openedDate
          dueDate
          closeDate
          parentRequestNumber
          priority
          severity
          createdBy
          installerName
          area
          subscriberId
        }
        suspension {
          requestNumber
          natureOfRequest
          requestType
          status
          description
          resolutionCode
          subArea
          source
          openedDate
          dueDate
          closeDate
          parentRequestNumber
          priority
          severity
          createdBy
          installerName
          area
          subscriberId
        }
        status {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
      }
    }
  }
`;

export const getAvailableSlot = gql`
  query GetSlot($subscriberId: String!, $woType: String!, $woSubType: String!, $isEarliestSlot: Boolean!, $prefDate: String) {
    getSlot(subscriberId: $subscriberId, woType: $woType, woSubType: $woSubType, isEarliestSlot: $isEarliestSlot, prefDate: $prefDate) {
      taskId {
        clientId
        taskId
      }
      slotSuggestions {
        start
        end
      }
      availableSlot {
        slotTimes {
          id
          name
          nameNT
        }
        slotDate
      }
    }
  }
`;

export const getSlotDateForDropdown = gql`
  query GetSlotDateForDropdown {
    getSlotDateForDropdown {
      id
      name
      nameNT
      object
    }
  }
`;

export const getSlotTimeForDropdown = gql`
  query GetSlotTimeForDropdown($selectedDate: String!) {
    getSlotTimeForDropdown(selectedDate: $selectedDate) {
      id
      name
      nameNT
      object
    }
  }
`;

export const createFRWorkOrderOCS = gql`
  mutation CreateFRWorkOrderOCS($input: CreateFRWorkOrderOCS!) {
    createFRWorkOrderOCS(input: $input) {
      message
      transactionId
    }
  }
`;

export const createFRWorkOrder = gql`
  mutation CreateFRWorkOrder($input: CreateFRWorkOrder!) {
    createFRWorkOrder(input: $input) {
      message
      transactionId
    }
  }
`;

export const createSRWorkOrder = gql`
  mutation CreateSRWorkOrder($input: CreateSRWorkOrder!) {
    createSRWorkOrder(input: $input) {
      message
      transactionId
    }
  }
`;
