/**
 * @module store/sales/query/homePage
 * @description Reducer query definitions for homePage actions.
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
export const getFtdData = gql`
  query GetFtdData($input: FTDInput) {
    getFtdData(input: $input) {
      rechargeFTD
      otfFTD
    }
  }
`;

export const getHomepageData = gql`
  query GetHomepageData($input: BasicInput) {
    getHomepageData(input: $input) {
      homepageData {
        vendorCode
        otfMtd
        otfFtd
        activationMtd
        activationFtd
        rechargeFtd
        rechargeMtd
        balance
        tskStock
      }
    }
  }
`;
export const getTransactionSummary = gql`
  query GetTransactionSummary($input: BasicInput) {
    getTransactionSummary(input: $input) {
      transactionDetails {
        transactionDate
        partnerId
        status
        paymentType
        amount
        transactionId
        remarks
      }
      otfDetails {
        otfMtd
        otfFtd
      }
      daysFilter
      statusFilter
      paymentType
      transactionAmount
      updatedDate
      pagination
    }
  }
`;

export const getTransactionSummaryWithFilter = gql`
  query GetTransactionSummary($input: BasicInput) {
    getTransactionSummary(input: $input) {
      transactionDetails {
        transactionDate
        partnerId
        status
        paymentType
        amount
        transactionId
        remarks
      }
      otfDetails {
        otfMtd
        otfFtd
      }
      daysFilter
      statusFilter
      paymentType
      transactionAmount
      updatedDate
      pagination
    }
  }
`;

export const getBannerImages = gql`
  query GetBannerImages {
    getBannerImages {
      getBanner
      status
      message
    }
  }
`;

export const getRailsData = gql`
  query HomeScreenRails {
  homeScreenRails {
    message
    result
    showChannelRail
    status
    language
  }
}
`;