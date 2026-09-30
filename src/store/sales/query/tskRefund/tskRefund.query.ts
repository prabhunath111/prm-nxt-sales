/**
 * @module store/query/tskRefund
 * @description GraphQL query definitions for tskRefund actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch Tsk refund details based on subscriber ID.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getTskRefundDetails,
 *   variables: { subscriberId: 'exampleSubscriberId' },
 * });
 */
export const getTskRefundDetails = gql`
  query GetTskRefundDetails($subscriberId: String!) {
    getTskRefundDetails(subscriberId: $subscriberId) {
      TskDetails {
        activityUID
        DealerCode
        TskSno
        tskRegType
        subStatus
        status
        VCType
      }
      subscriberId
      salesOrderNum
      woNumber
    }
  }
`;

/**
 * GraphQL query to execute Tsk refund based on provided parameters.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: doTskRefund,
 *   variables: {
 *     tskSerialNumber: 'exampleSerialNumber',
 *     salesOrderNum: 'exampleSalesOrderNum',
 *     woNumber: 'exampleWoNumber',
 *     subscriberId: 'exampleSubscriberId',
 *     evdPin: 'examplePin',
 *     dealerCode: 'exampleDealerCode'
 *   },
 * });
 */
export const doTskRefund = gql`
  query DoTskRefund($tskSerialNumber: String!, $salesOrderNum: String!, $woNumber: String!, $subscriberId: String!, $evdPin: String!, $dealerCode: String!) {
    doTskRefund(tskSerialNumber: $tskSerialNumber, salesOrderNum: $salesOrderNum, woNumber: $woNumber, subscriberId: $subscriberId, evdPin: $evdPin, dealerCode: $dealerCode) {
      refundMessage
    }
  }
`;
