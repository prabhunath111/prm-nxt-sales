/**
 * @module store/sales/query/dealerFeedback
 * @description Reducer query definitions for dealerFeedback actions.
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
export const dealerFeedbackFilter = gql`
  query DealerFeedbackFilter {
    dealerFeedbackFilter
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
 *   query: SAMPLE_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const dealerFeedbackList = gql`
  query DealerFeedbackList($formName: String) {
    dealerFeedbackList(formName: $formName) {
      dealerFeedbackList {
        createdDate
        requestId
        date
        feedbackCategory
        feedbackCategoryNT
        feedbackSubCategory
        feedbackSubCategoryNT
        comment
        status
      }
      tableColumns
      status
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
 *   query: SAMPLE_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const submitFeedback = gql`
  mutation CreateDealerFeedback($input: DealerFeedBack) {
    createDealerFeedback(input: $input) {
      feedbackId
      status
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
 *   query: SAMPLE_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const validateSubscriberId = gql`
  query ValidateSubscriberId($subscriberId: String) {
    validateSubscriberId(subscriberId: $subscriberId) {
      status
      message
    }
  }
`;
