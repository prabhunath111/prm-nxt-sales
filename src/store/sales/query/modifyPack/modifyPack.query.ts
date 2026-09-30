/**
 * @module store/sales/query/modifyPack
 * @description Reducer query definitions for modifyPack actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch sample data.
 */

export const getPackSelectorInfo = gql`
  query GetPackSelectorAccountInformation($subscriberId: String!, $language: String) {
    getPackSelectorAccountInformation(subscriberId: $subscriberId, language: $language) {
      source
      subscriberId
      rmn
      subscriberName
      subscriberNameNT
      agentUserId
      checksum
      redirectionUrl
    }
  }
`;
export const checkRmnInComvivaOrDth = gql`
  query CheckRmnInComvivaOrDth($input: CheckRmnInComvivaOrDthInput) {
    checkRmnInComvivaOrDth(input: $input) {
      returnUrl
      accessToken
      transMessage
      subIdList
      otpRequest
    }
  }
`;
export const getBposDetailsDirectFromFE = gql`
  query GetBposDetailsDirectFromFE($input: GetBposDetailsDirectFromFEInput) {
    getBposDetailsDirectFromFE(input: $input) {
      newRole
      bposId
    }
  }
`;

export const validateOTPWithoutSubIdWeb = gql`
  query ValidateOTPWithoutSubIdWeb($input: ValidateOTPWithoutSubIdWebInput) {
    validateOTPWithoutSubIdWeb(input: $input) {
      linkmessage
      errorCode
      errorMessage
      statusCode
    }
  }
`;

export const checkDTHInfoManageApp = gql`
  query CheckDTHInfoManageApp($input: CheckDTHInfoManageAppInput) {
    checkDTHInfoManageApp(input: $input) {
      returnUrl
      accessToken
      transMessage
      subIdList
      otpRequest
    }
  }
`;
