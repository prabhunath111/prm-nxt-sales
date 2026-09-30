/**
 * @module store/sales/query/newDealer
 * @description Reducer query definitions for newDealer actions.
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
export const viewNewDealerASI = gql`
  query ViewNewDealer($input: NewDealerDetails) {
    viewNewDealer(input: $input) {
      result {
        dealerCode
        dealerName
        outletType
        dealerMdn
        status
        createdDate
        pinCode
        distributorCode
        distributorName
        fosId
        fosMdn
        fosName
        createdBy
      }
      tableColumns
      status
      message
    }
  }
`;

export const ViewNewDealerUnderFOS = gql`
  query ViewNewDealerUnderFOS($formName: String) {
    viewNewDealerUnderFOS(formName: $formName) {
      result {
        dealerCode
        dealerName
        outletType
        dealerMdn
        status
        createdDate
        pinCode
        distributorCode
        distributorName
        fosId
        fosMdn
        fosName
        createdBy
      }
      tableColumns
      status
      message
    }
  }
`;

export const viewDistributorList = gql`
  query ViewDistributorList($userRole: String, $userIdValue: String, $createChannelPartner: Boolean) {
    viewDistributorList(userRole: $userRole, userIdValue: $userIdValue, createChannelPartner: $createChannelPartner) {
      result {
        distCodeAndName {
          id
          name
          object {
            name
            value
            valueNT
            area
            serviceDAS
            country
            townname
            salesSegment
            salesSegmentNT
            locationNT
            city
            towncode
            district
            location
            state
            pincode
          }
          distMdn
          distCode
        }
        distributorResponse {
          distCode
          distName
          distMdn
          ASIName
          ASICode
          ASIOutlookName
          ASMName
          ASMCode
          ASMOutlookName
          CSMName
          CSMCode
          CSMOutlookName
          userId
          role
        }
      }
      status
      message
    }
  }
`;
