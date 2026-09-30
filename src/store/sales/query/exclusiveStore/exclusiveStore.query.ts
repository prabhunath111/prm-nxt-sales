/**
 * @module store/sales/query/exclusiveStore
 * @description Reducer query definitions for exclusiveStore actions.
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

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getStoreOpeningClosingQues,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getStoreOpeningClosingQues = gql`
  query GetStoreOpeningClosingQues($storeAction: String!) {
    getStoreOpeningClosingQues(storeAction: $storeAction) {
      resultStoreActionQues {
        QUESTIONSDESC
        QUESTIONID
        QUESTIONTYPE
        DEFAULTVALUES
        DISPLAYVALUES
      }
      strOpnSection
      strClsSection
      storeActFromResp
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
 *   query: walkInInsertProcedure,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const walkInInsertProcedure = gql`
  mutation WalkInInsertProcedure($input: WalkInInsertProcedureInput) {
    walkInInsertProcedure(input: $input) {
      resultstoreCheckDetails
      resultWalkInDetails
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
 *   query: getMultiTvBoxType,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getMultiTvBoxType = gql`
  query RetrieveMultiTvBoxType {
    retrieveMultiTvBoxType {
      result {
        bingepluspayablebox
        boxType {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
        BingePlus
      }
      message
      status
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
 *   query: submitStoreAns,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const submitStoreAns = gql`
  mutation StoreOpeningInsertProcedure($input: StoreOpeningInsertProcedureInput) {
    storeOpeningInsertProcedure(input: $input) {
      message
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
 *   query: submitDemoForm,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const submitDemoForm = gql`
  mutation InsertCustDemoDetails($input: insertCustDemoDetailsInput) {
    insertCustDemoDetails(input: $input) {
      message
      status
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
 *   query: submitDemoForm,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getStoreOpeningSelProcedure = gql`
  query GetStoreOpeningSelProcedure($partnerId: String!, $closeOrOpenVal: String!) {
    getStoreOpeningSelProcedure(partnerId: $partnerId, closeOrOpenVal: $closeOrOpenVal) {
      resultstoreCheckDetails
    }
  }
`;
