/**
 * reducer query definitions
 */
import { gql } from '@apollo/client';

export const GET_LANGUAGE_QUERY = gql`
  query Get_language_by_locale($localeName: String!) {
    get_language_by_locale(locale_name: $localeName) {
      status
      message
      data
    }
  }
`;

export const USER_TABLE = gql`
  query {
    get_table_data {
      id
      name
      # Add other fields you need
    }
  }
`;

export const COUNTRY = gql`
  query query($name: String!) {
    countries(filter: { name: { regex: $name } }) {
      code
      name
      currency
    }
  }
`;

export const demoBoxDetails = gql`
  query DemoBoxDetails($key: String, $subscriberId: String) {
    demoBoxDetails(key: $key, subscriberId: $subscriberId) {
      result {
        partnerCode
        subscriberId
        subscriberName
        accountStatus
        boxSerialNo
        boxType
        tskStatus
        packageName
        activationCm
        activationLm
        partnerRole
        channelOutletName
        dealerId
        dealerRmn
        remarks
      }
      tableColumns
      dealerDetails {
        name
        evdCode
        mdn
        dealerId
      }
      status
      message
    }
  }
`;

export const searchDemoBoxDetails = gql`
  query SearchDemoBoxDetails($dealerId: String, $search: String, $accountStatusFilter: String, $boxTypeFilter: String, $subscriberId: String) {
    searchDemoBoxDetails(dealerId: $dealerId, search: $search, accountStatusFilter: $accountStatusFilter, boxTypeFilter: $boxTypeFilter, subscriberId: $subscriberId) {
      result {
        partnerCode
        subscriberId
        subscriberName
        accountStatus
        boxSerialNo
        boxType
        tskStatus
        packageName
        activationCm
        activationLm
        partnerRole
        channelOutletName
        dealerId
        dealerRmn
        remarks
      }
      status
      message
      tableColumns
    }
  }
`;

export const getHotelSubscriptionURL = gql`
  query GetHotelSubscriptionURL($moduleName: String) {
    getHotelSubscriptionURL(moduleName: $moduleName) {
      url
      status
      message
    }
  }
`;

export const connectionFilter = gql`
  query Query {
    connectionFilter
  }
`;

export const boxTypesFilter = gql`
  query Query {
    boxTypesFilter
  }
`;
