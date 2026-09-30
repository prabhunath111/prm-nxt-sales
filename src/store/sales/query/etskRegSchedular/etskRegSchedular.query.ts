/**
 * @module store/sales/query/etskRegSchedular
 * @description Reducer query definitions for etskRegSchedular actions.
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

export const GetETSKSlot = gql`
  mutation GetETSKSlot($bookingFormNumber: String!, $subscriberId: String!, $preferredDate: String!) {
    getETSKSlot(bookingFormNumber: $bookingFormNumber, subscriberId: $subscriberId, preferredDate: $preferredDate) {
      transStatus
      transMessage
      taskId
      slotSuggestions {
        start
        end
      }
    }
  }
`;

export const pickPackAndGetSlotPrimaryAndSecondary = gql`
  query PickPackAndGetSlotPrimaryAndSecondary($subscriberId: String!, $preferedDate: String!) {
    pickPackAndGetSlotPrimaryAndSecondary(subscriberId: $subscriberId, preferedDate: $preferedDate) {
      result {
        transStatus
        transMessage
        taskId
        orderId
        slotSuggestions {
          start
          end
        }
      }
      message
      status
    }
  }
`;

export const pickPackAndGetSlotSecondary = gql`
  query PickPackAndGetSlotSecondary($subscriberId: String!, $preferedDate: String!, $boxType: String, $packageName: String, $assetNumber: String, $salesFlag: String) {
    pickPackAndGetSlotSecondary(
      subscriberId: $subscriberId
      preferedDate: $preferedDate
      boxType: $boxType
      packageName: $packageName
      assetNumber: $assetNumber
      salesFlag: $salesFlag
    ) {
      result {
        transStatus
        transMessage
        taskId
        orderId
        slotSuggestions {
          start
          end
        }
      }
      message
      status
    }
  }
`;
