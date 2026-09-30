/**
 * @module store/sales/query/dealerHelp
 * @description Reducer query definitions for dealerHelp actions.
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
export const SAMPLE_QUERY = gql`
  query sample_query_selector($sampleVariable: String!) {
    sample_query_fn(variable_name: $sampleVariable) {
      status
      message
      data
    }
  }
`;
export const getMainCategoryBR = gql`
  query GetMainCategoryBR {
    getMainCategoryBR {
      result {
        data
        mainCategory {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
        subCategory {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
        role
        bposId
      }
      message
      status
    }
  }
`;
export const getAllSRDetailsForLoginUser = gql`
  query GetAllSRDetailsForLoginUser($input: getAllSRDetailsForLoginUserInput) {
    getAllSRDetailsForLoginUser(input: $input) {
      result
      tableColumns
      message
      status
    }
  }
`;
export const createBRSSRWorkOrder = gql`
  query CreateBRSSRWorkOrder($input: createBRSSRWorkOrderInput) {
    createBRSSRWorkOrder(input: $input) {
      status
      message
      response {
        transactionID
        message
      }
    }
  }
`;
export const getDashboardBingeRetailerLatest = gql`
  query GetDashboardBingeRetailerLatest($input: GetDashboardBingeRetailerLatestInput) {
    getDashboardBingeRetailerLatest(input: $input) {
      status
      message
      response {
        dayCount
        earningForTheDay
        packSoldFortheMonth
        monthlyEarning
        previousMonthCount
        previousMonthEarning
        enableMonthDashboardBR
      }
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
export const bingeDshBoardDtlsFromService = gql`
  query BingeDshBoardDtlsFromService($input: BingeDshBoardDtlsFromServiceInput) {
    bingeDshBoardDtlsFromService(input: $input) {
      status
      message
      response {
        incentiveType
        count
        incentiveAmount
        createdDate
      }
      tableColumns
    }
  }
`;
