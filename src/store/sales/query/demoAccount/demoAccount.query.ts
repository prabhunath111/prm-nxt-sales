/**
 * @module store/sales/query/demoAccount
 * @description Reducer query definitions for demoAccount actions.
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
 *   query: checkDealerEligibilityForDemo,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const checkDealerEligibilityForDemo = gql`
  mutation CheckDealerEligibilityForDemo($input: CheckDealerEligibilityForDemoInput) {
    checkDealerEligibilityForDemo(input: $input) {
      status
      message
      response {
        eligibility {
          DLR_ID
          ELIGIBILE_COUNT
        }
        dealerDetails {
          name
          nameNT
          mobileNo
          email
          emailNT
          addressLine1
          addressLine1NT
          addressLine2
          addressLine2NT
          pincode
          pincodeNT
          town
          townNT
          state
          stateNT
          city
          cityNT
          roleId
          roleIdNT
          district
          districtNT
          country
          countryNT
          partnerCircle
          partnerCircleNT
        }
      }
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
 *   query: tskPinValidateForDemo,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const tskPinValidateForDemo = gql`
  mutation TskPinValidateForDemo($input: TskPinValidateForDemoInput) {
    tskPinValidateForDemo(input: $input) {
      status
      message
      response {
        location
        boxType
        pricePoint
        tskPin
      }
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
 *   query: doDemoAccountCreationAndTSKRegistration,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const doDemoAccountCreationAndTSKRegistration = gql`
  mutation DoDemoAccountCreationAndTSKRegistration($input: doDemoAccountCreationAndTSKRegistrationInput) {
    doDemoAccountCreationAndTSKRegistration(input: $input) {
      status
      message
      response {
        bookingFormNumber
        message
        subID
        dealerCode
        tskSerialNumber
        offerCategory {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        packageName {
          OfferCategory
          OfferCategoryNT
          PackageInfo {
            id
            name
            nameNT
            object {
              name
              value
            }
            pricePt
          }
        }
      }
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
 *   query: getAddOnPackagesForDemoBox,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getAddOnPackagesForDemoBox = gql`
  mutation GetAddOnPackages($input: GetAddOnPackagesInput) {
    getAddOnPackages(input: $input) {
      status
      message
      response {
        addOnPackageNameMonthly {
          SIEBELNAME
          PRICE
          FRIENDLYNAME
          FLEXI_PACK
          DURATION
        }
        addOnPackageNameSemiAnnual {
          SIEBELNAME
          PRICE
          FRIENDLYNAME
          FLEXI_PACK
          DURATION
        }
        addOnPackageNameAnnual {
          SIEBELNAME
          PRICE
          FRIENDLYNAME
          FLEXI_PACK
          DURATION
        }
        addOnPackageNameAnnualRegional {
          SIEBELNAME
          PRICE
          FRIENDLYNAME
          FLEXI_PACK
          DURATION
        }
        offerCategory
      }
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
 *   query: doPickPackAndWorkOrderCreationPrimary,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const doPickPackAndWorkOrderCreationPrimary = gql`
  mutation DoPickPackAndWorkOrderCreationPrimary($input: DoPickPackAndWorkOrderCreationPrimaryInput) {
    doPickPackAndWorkOrderCreationPrimary(input: $input) {
      response {
        message
        woNumber
      }
      status
      message
    }
  }
`;

export const validateDemoAcEtsk = gql`
  query EtskRepushStatusDemo($bookingFormNumber: String) {
    etskRepushStatusDemo(bookingFormNumber: $bookingFormNumber) {
      message
      status
      response {
        subID
        dealerCode
        serviceRegionId
        ocsFlag
        bookingFormNumber
        rechargeSuccess
        boxType {
          boxType
          boxTypeNT
        }
        boxType2 {
          boxType
          boxTypeNT
        }
        boxType3 {
          boxType
          boxTypeNT
        }
        boxType4 {
          boxType
          boxTypeNT
        }
        offerCategory {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        packageName {
          OfferCategory
          PackageInfo {
            id
            name
            nameNT
            object {
              name
              value
            }
            pricePt
          }
        }
        dealerDetails {
          name
          primaryMobile
          email
          primaryLanguage
          secondaryLanguage
          pinCode
          address
          state
          city
          district
        }
      }
    }
  }
`;
