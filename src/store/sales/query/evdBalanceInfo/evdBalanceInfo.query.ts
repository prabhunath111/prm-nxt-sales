/**
 * @module store/sales/query/evdBalanceInfo
 * @description Reducer query definitions for evdBalanceInfo actions.
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
export const doBalanceEnquiryEvd = gql`
  query DoBalanceEnquiryEvd($input: DoBalanceEnquiryEvdInput!) {
    doBalanceEnquiryEvd(input: $input) {
      currentBalance
      donarRMN
      recipientRMN
      childName
      userId
    }
  }
`;

export const retrieveOTFCreditDetails = gql`
  query RetrieveOTFCreditDetails($input: RetrieveOTFCreditDetailsInput!) {
    retrieveOTFCreditDetails(input: $input) {
      transactions {
        subId
        transId
        otfDate
        bonusAmount
        msg5
        transactionTime
      }
      tableColumns
    }
  }
`;

export const retrieveBalancehistoryDetails = gql`
  query RetrieveBalancehistoryDetails($input: BalanceHistoryInput!) {
    retrieveBalancehistoryDetails(input: $input) {
      transactions {
        transactionID
        txnDate
        amount
        recipientName
        recipientMdn
        donorName
        donorMdn
        donorRole
        recipientRole
        transactionDate
      }
      tableColumns
    }
  }
`;

export const retrieveTransactionsDetailsNew = gql`
  query RetrieveTransactionsDetailsNew($input: RetrieveTransactionsInput!) {
    retrieveTransactionsDetailsNew(input: $input) {
      transactions {
        subscriberID
        transactionID
        txnDate
        creditAmount
        time
        bingeRechargeFlag
      }
      tableColumns
    }
  }
`;

export const otfFilter = gql`
  query Query {
    otfFilter
  }
`;

export const conslidateHistoryFilters = gql`
  query Query {
    conslidateHistoryFilters
  }
`;

export const balanceTransferFilters = gql`
  query Query {
    balanceTransferFilters
  }
`;

export const retrieveConsolidatedHistoryDetails = gql`
  query RetrieveConsolidatedHistoryDetails($input: ConsolidatedHistoryInput!) {
    retrieveConsolidatedHistoryDetails(input: $input) {
      transactions {
        txnId
        otfDate
        bingeFlag
        amount
        subId
        acctId
        designation
        txnDate
        time
        source
        remarks
        type
        transateeRole
        operation
      }
      tableColumns
    }
  }
`;

export const consolidatedOnlineReport = gql`
  query ConsolidatedOnlineReport($input: ConsolidatedOnlineReportInput) {
    consolidatedOnlineReport(input: $input) {
      transactions {
        accountId
        txnId
        otfDate
        operation
        amount
        remarks
        type
        recipientDesignation
        donorDesignation
        source
      }
      pagination {
        page
        limit
        total
        totalPages
      }
      status
      message
    }
  }
`;

export const balanceTransferReport = gql`
  query BalanceTransferReport($input: ConsolidatedOnlineReportInput) {
    balanceTransferReport(input: $input) {
      transactions {
        transactionID
        txnDate
        amount
        recipientName
        recipientMdn
        recipientRole
        donorName
        donorMdn
        donorRole
        transactionDate
      }
      pagination {
        page
        limit
        total
        totalPages
      }
      status
      message
    }
  }
`;

export const rechargeReport = gql`
  query RechargeReport($input: ConsolidatedOnlineReportInput) {
    rechargeReport(input: $input) {
      transactions {
        transactionID
        txnDate
        bingeRechargeFlag
        creditAmount
        subscriberID
        time
      }
      pagination {
        page
        limit
        total
        totalPages
      }
      status
      message
    }
  }
`;

export const otfReport = gql`
  query OtfCreditReport($input: ConsolidatedOnlineReportInput) {
    otfCreditReport(input: $input) {
      transactions {
        transId
        otfDate
        bonusAmount
        msg5
        subId
        transactionTime
      }
      pagination {
        page
        limit
        total
        totalPages
      }
      status
      message
    }
  }
`;
