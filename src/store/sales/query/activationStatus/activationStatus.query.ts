/**
 * @module store/sales/query/activationStatus
 * @description Reducer query definitions for activationStatus actions.
 */
import { gql } from '@apollo/client';

export const getActivationStatus = gql`
  query GetActivationStatus($input: getActivationStatusInput) {
    getActivationStatus(input: $input) {
      customerName
      customerRmn
      customerStatus
      message
      subscriberId
      secStatusArray {
        secStatus
        vCnumber
      }
      reason
      resolution
    }
  }
`;

export const getAllSubscriberDetails = gql`
  query GetAllSubscriberDetails($input: getAllSubscriberDetailsInput) {
    getAllSubscriberDetails(input: $input) {
      subIdList {
        subscriberId
        accountStatus
        subscriberName
        accountType
        rmn
        subId
        subIdNT
        status
        statusNT
        aliasName
      }
    }
  }
`;

export const getActivationStatusBCP = gql`
  query GetActivationStatusBCP($input: getActivationStatusBCPInput) {
    getActivationStatusBCP(input: $input) {
      subscriberId
      workOrderNo
    }
  }
`;
