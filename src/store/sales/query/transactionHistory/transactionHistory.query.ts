/**
 * @module store/query/transactionHistory
 * @description Reducer query definitions for transactionHistory actions.
 */
import { gql } from '@apollo/client';

export const getPartnerTransactions = gql`
  query GetPartnerTransactions {
    getPartnerTransactions {
      subscriberId
      transactionId
      amount
      transactionDate
      bingeRechargeFlag
    }
  }
`;

export const retrieveTransactionDetails = gql`
  query RetrieveTransactionDetails($transactionInfo: String!) {
    retrieveTransactionDetails(transactionInfo: $transactionInfo) {
      subscriberTrans {
        subscriberId
        transactionId
        amount
        transactionDate
        bingeRechargeFlag
      }
      transDetails {
        accountId
        userMdn
        tskNumber
        requestDate
        requestDateNT
        invoiceNumber
        subscriberId
        chargeableAmount
        inTransId
        subscriberStatus
        reversalEligibleDaysCount
        reversalDay
      }
      isTransactionDetails
    }
  }
`;

export const fetchReversalInformation = gql`
  query GetBalance($subscriberId: String!) {
    getBalance(subscriberId: $subscriberId) {
      balance
      reversalReasons {
        id
        name
        nameNT
      }
    }
  }
`;

export const reverseRecharge = gql`
  mutation ReverseRecharge($input: ReversalInput) {
    reverseRecharge(input: $input) {
      message
      status
      subMessage
      balance
    }
  }
`;
