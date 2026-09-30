/**
 * @module store/sales/query/manageHierarchy
 * @description Reducer query definitions for manageHierarchy actions.
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
 *   query: evdViewAllChildHierarchy,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const evdViewAllChildHierarchy = gql`
  query EvdViewAllChildHierarchy($formName: String) {
    evdViewAllChildHierarchy(formName: $formName) {
      result {
        userId
        name
        nameNT
        mobile
        role
        parentMobile
        parentName
        distributorId
        registrationDate
        balance
        channelOutletType
        thresoldLimit
        tsraFlag
        status
      }
      tableColumns
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
 *   query: getReports,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getReports = gql`
  query GetReports($input: ReportsInput) {
    getReports(input: $input) {
      info {
        reportURL
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to fetch circle and user details data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getCircleUserNameEmail,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getCircleUserNameEmail = gql`
  query GetCircleUserNameEmail($mdn: String) {
    getCircleUserNameEmail(mdn: $mdn) {
      info {
        userId
        distributorMdn
        circleDesc
        cirleId
        userName
        email
        circleDescNT
        distributorUserId
        distributorName
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to fetch partner details based on user role.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getCCPartnerDetailsBasedOnRole,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getCCPartnerDetailsBasedOnRole = gql`
  query GetCCPartnerDetailsBasedOnRole($role: String, $mdn: String) {
    getCCPartnerDetailsBasedOnRole(role: $role, mdn: $mdn) {
      roleResponse {
        userId
        roleId
        nameAndMdn
        mdn
        retailerFlag
        activityStatus
        parentMdn
        parentId
      }
      outTypeResponse {
        id
        name
        object {
          name
          value
          valueNT
        }
      }
      nameAndMdnFilter {
        id
        name
        object {
          name
          value
          valueNT
        }
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to validate the dealer details CC partner.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: validateDealerDetailsCCPartner,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const validateDealerDetailsCCPartner = gql`
  query ValidateDealerDetailsCCPartner($input: DealerDetailsValidationInput) {
    validateDealerDetailsCCPartner(input: $input) {
      result {
        cityDetails {
          billPin
          billCity
          billDist
          circleDesc
          billState
        }
        townDetails {
          town
          population
          uniqueTownCode
          location
          townCodeTownLocation
        }
        townDetailsFilter {
          id
          name
          nameNT
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
        }
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to validate the town code CC partner.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: validateTownCodeCCPartner,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const validateTownCodeCCPartner = gql`
  query ValidateTownCodeCCPartner($input: TownCodeCCPartnerInput) {
    validateTownCodeCCPartner(input: $input) {
      result {
        townCode {
          billTown
          uniqueTownCodeTSl
        }
        fosOutletTypes {
          outletType
          outletId
        }
        fosOutletTypesFilter {
          id
          name
          nameNT
          object {
            name
            value
            valueNT
          }
        }
        eligibleOutletFilter {
          id
          name
          nameNT
          object {
            name
            value
            valueNT
          }
        }
        eligibleOutlet {
          outletType
          outletId
        }
        DASResponse
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to validate the outlet type and fetch all languages.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: validateOutletTypeAndFetchAllLanguages,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const validateOutletTypeAndFetchAllLanguages = gql`
  query ValidateOutletTypeAndFetchAllLanguages($input: ValidateOutletInput) {
    validateOutletTypeAndFetchAllLanguages(input: $input) {
      result {
        educationDetails {
          id
          name
          nameNT
          object {
            name
            value
            valueNT
          }
        }
        occupationDetails {
          id
          name
          nameNT
          object {
            name
            value
            valueNT
          }
        }
        backgroundDetails {
          id
          name
          nameNT
          object {
            name
            value
            valueNT
          }
        }
        languageDetails {
          id
          name
          nameNT
          object {
            name
            value
            valueNT
          }
        }
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to validate mobile number.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: validateModileNumber,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const validateModileNumber = gql`
  query ValidateModileNumber($input: ValidateModileNumberInput) {
    validateModileNumber(input: $input) {
      message
      status
    }
  }
`;

/**
 * GraphQL query to validate otp with mobile number.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: validateOTPWithMobile,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const validateOTPWithMobile = gql`
  query ValidateOTPWithMobile($input: ValidateOTPInput) {
    validateOTPWithMobile(input: $input) {
      message
      status
    }
  }
`;

/**
 * GraphQL query to create the channel partner.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: createChannelPartner,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const createChannelPartner = gql`
  query CreateChannelPartner($input: CreateChannelPartnerInput) {
    createChannelPartner(input: $input) {
      result {
        partnerUserId
        mobTransId
        partnerUserName
        approvalPosition
        approvalName
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to create the channel partner.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: createChannelPartner,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const validateISPCode = gql`
  query ValidateISPCode($input: ISPValidationInput) {
    validateISPCode(input: $input) {
      result {
        partnerCode
        name
        mobile
        status
        state
        stateSales
      }
      message
      status
    }
  }
`;

/**
 * GraphQL query to create the channel partner.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: viewDistributorList,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const viewDistributorListForASM = gql`
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
