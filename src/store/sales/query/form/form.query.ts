/**
 * @module store/query/form
 * @description Reducer query definitions for form actions.
 */
import { gql } from '@apollo/client';

export const FORM_BUILDER_QUERY = gql`
  query GetDynamicForm($formName: String!) {
    getDynamicForm(formName: $formName) {
      form
      title
      formQuery
    }
  }
`;

export const accountStatusFilter = gql`
  query AccountStatusFilter {
    accountStatusFilter {
      accountStatusFilter {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
    }
  }
`;

export const boxTypeFilter = gql`
  query BoxTypeFilter {
    boxTypeFilter {
      boxTypeFilter {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
    }
  }
`;

export const dealerSearch = gql`
  query DealerSearch {
    dealerSearch {
      info {
        userId
        mdn
        name
        nameNT
        balance
        outletType
        thresholdSet
        thresholdSetNT
        minBalance
        reqBalance
        avgDailyRecharge
      }
      status
      message
      thresHoldFilter
      priceFilter
    }
  }
`;

export const getDistributorList = gql`
  mutation GetDistributorList {
    getDistributorList {
      getDistributorList
      message
      status
    }
  }
`;

export const getCSMDistributorList = gql`
  query GetCSMDistributorList {
    getCSMDistributorList {
      getCSMDistributorList
      status
      message
    }
  }
`;
export const requestedDate = gql`
  query Query {
    requestedDate
  }
`;

export const fetchChildPartnerDetails = gql`
  mutation FetchChildPartnerDetails($input: fetchChildPartnerDetailsInput) {
    fetchChildPartnerDetails(input: $input) {
      result {
        roleId
        nameandmdn
        name
        nameNT
        mobile: mdnNumber
        retailerFlag
        activityStatus
        subName
        subNameNT
      }
      partnerBalance
      status
      message
    }
  }
`;
