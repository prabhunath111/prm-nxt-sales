/**
 * @module store/sales/query/partnerApproval
 * @description Reducer query definitions for partnerApproval actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch partner list data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: partnerapprovalDetails,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const partnerapprovalDetails = gql`
  query PartnerapprovalDetails($userId: String, $role: String, $noFosRequestunderDirectAsi: String, $directDis: String, $asiCode: String, $fetchAllData: Boolean) {
    partnerapprovalDetails(
      userId: $userId
      role: $role
      noFosRequestunderDirectASI: $noFosRequestunderDirectAsi
      directDis: $directDis
      asiCode: $asiCode
      fetchAllData: $fetchAllData
    ) {
      result {
        SiebeldetailsforAD
        role
        partnerApprovalList
        datafromCSM {
          roleId
          nameandmdn
          name
          nameNT
          mdnNumber
          retailerFlag
          activityStatus
          subName
          subNameNT
          DIST_CODE
          DIST_NAME
          ASI_NAME
          AS_CODE
          ASIADID
          ASI_POSTN
        }
        datafromRH {
          asiName
          asiCode
          asiPositionName
          userId
        }
        datafromDistributor {
          DISTRIBUTOR_CODE
          DISTRIBUTOR_NAME
          DISTRIBUTOR_ADID
          DISTRIBUTOR_POSTN
        }
        newVersion
        DropdownList
        asiDetails {
          asiName
          asiCode
          role
          asiPositionName
          userId
          fullName
        }
        partnerRejectReasons
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to fetch table data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: partnerapprovaltracklistDetails,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const partnerapprovaltracklistDetails = gql`
  query PartnerapprovaltracklistDetails($formName: String, $userId: String, $role: String, $directDis: String, $asiCode: String, $fetchAllData: Boolean) {
    partnerapprovaltracklistDetails(formName: $formName, userId: $userId, role: $role, directDis: $directDis, asiCode: $asiCode, fetchAllData: $fetchAllData) {
      result {
        SiebeldetailsforAD
        role
        tableColumns {
          id
          field_id
          name
          accessorKey
          label
          type
          isDisabled
          isEditable
          isRowFormatter
          placeholder
          operation
          size
          icon
          dependentId
          dependencyValue
          parentId
          color
          isBorder
          alignment
          isAddRemoveRequired
          parentHeading
        }
        partnerApprovaltrackList
        datafromCSM {
          roleId
          nameandmdn
          name
          nameNT
          mdnNumber
          retailerFlag
          activityStatus
          subName
          subNameNT
          DIST_CODE
          DIST_NAME
          ASI_NAME
          AS_CODE
          ASIADID
          ASI_POSTN
        }
        datafromRH {
          roleId
          nameandmdn
          name
          nameNT
          mdnNumber
          retailerFlag
          activityStatus
          subName
          subNameNT
          DIST_CODE
          DIST_NAME
          ASI_NAME
          AS_CODE
          ASIADID
          ASI_POSTN
        }
        datafromDistributor {
          DISTRIBUTOR_CODE
          DISTRIBUTOR_NAME
          DISTRIBUTOR_ADID
          DISTRIBUTOR_POSTN
        }
        newVersion
        DropdownList
        asiDetails {
          asiName
          asiCode
          role
          asiPositionName
          userId
          fullName
        }
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to fetch table data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: partnerApprovalRejectAndApprove,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const partnerApprovalRejectAndApprove = gql`
  query PartnerApprovalRejectAndApprove($input: partnerApprovalRejectAndApproveInput) {
    partnerApprovalRejectAndApprove(input: $input) {
      result {
        source
        mobTransId
        code
        message
      }
      message
      status
      isRejected
    }
  }
`;
