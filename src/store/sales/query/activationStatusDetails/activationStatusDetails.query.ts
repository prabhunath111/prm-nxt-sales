/**
 * @module store/sales/query/activationStatusDetails
 * @description Reducer query definitions for activationStatusDetails actions.
 */
import { gql } from '@apollo/client';

export const getWODetailsActivationStatus = gql`
  query WoDetails($input: customerInput) {
    getWODetailsActivationStatus(input: $input) {
      woDetails {
        sub_id
        wo_num
        wo_type
        wo_status
        wo_created_date
        wo_completed_date
        wo_planned_start
        wo_cancel_date
        wo_resolution_cd
        wo_reason_cd
        wo_isp_code
        wo_isp_name
        wo_isp_mobile
        asi_name
        asi_code
        asi_mobile
      }
    }
  }
`;

export const getActivationStatusOtherDetails = gql`
  query GetActivationStatusOtherDetails($input: customerInput) {
    getActivationStatusOtherDetails(input: $input) {
      otherDetails {
        sub_id
        tsk_no
        bookformno
        pref_box_type
        pref_box_typeNT
        contact_1
        contact_2
        contact_3
        contact_4
        rmn
        connectionType
      }
    }
  }
`;

export const getUpgradeWODetailsActivationStatus = gql`
  query WoDetails($input: customerInput) {
    getUpgradeWODetailsActivationStatus(input: $input) {
      woDetails {
        sub_id
        wo_num
        wo_type
        wo_status
        wo_created_date
        wo_completed_date
        wo_planned_start
        wo_cancel_date
        wo_resolution_cd
        wo_reason_cd
        wo_isp_code
        wo_isp_name
        wo_isp_mobile
        asi_name
        asi_code
        asi_mobile
      }
    }
  }
`;

export const getActivationStatusPacInfo = gql`
  query GetActivationStatusPacInfo($input: customerInput) {
    getActivationStatusPacInfo(input: $input) {
      customerStatus
      status
      subStatus
      backOfficeErrorText
      salesType
      orderNumber
      orderType
      packDetails {
        packDuration
        packageType
        packageName
        packNameNT
        parentOrderItemId
        packagePrice
        actionCode
        packFriendlyName
        ConnectionType
      }
      productType
      orderDate
    }
  }
`;

export const getLastFiveRechargesDetails = gql`
  query GetTransactionDetails($input: customerInput) {
    getTransactionDetails(input: $input) {
      transactions {
        amount
        transactionDate
        transactionId
        transactionType
        paymentType
      }
    }
  }
`;
