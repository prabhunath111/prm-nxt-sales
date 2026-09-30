/**
 * @module store/sales/query/etskRegistration
 * @description Reducer query definitions for etskRegistration actions.
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
export const validatePincode = gql`
  mutation ValidatePinCode($pincode: String!, $userName: String!) {
    validatePinCode(pincode: $pincode, userName: $userName) {
      boxType
      city
      district
      etskOffersAndBoxtypesArray
      etskOffersDropDown
      languages
      locations
      pincode
      state
      districtNT
      cityNT
      stateNT
    }
  }
`;

export const createAccountETSK = gql`
  mutation DoAccountCreationETSK($input: ETskRegistrationInput!) {
    doAccountCreationETSK(input: $input) {
      subID
      dealerCode
      serviceRegionId
      ocsFlag
      bookingFormNumber
      offerCategory
      packageName {
        OfferCategory
        PackageInfo {
          productLine
          uom
          pricePt
          packName
          packNameNT
        }
      }
      bingeEligible
      PopularPacks
      TataskyPacks
      BroadCastPacks
      AlacartePacks
      BingePacks
      BingeplusPacks
      bingepluspayablebox
      notapplicableboxBingeplus
      tskValue
      boxTypes
      geners
      languages
      durations
      offerCategories
    }
  }
`;

export const doGetPacksETSK = gql`
  mutation DogetPacksETSK($category: String!, $boxType: String!, $etskSelectedOffer: String!) {
    dogetPacksETSK(category: $category, boxType: $boxType, etskSelectedOffer: $etskSelectedOffer) {
      packDetails
      errorCode
      errorMessage
    }
  }
`;
export const dogetBingeplusPacksETSK = gql`
  mutation DogetBingeplusPacksETSK($category: String!, $boxType: String!) {
    dogetBingeplusPacksETSK(category: $category, boxType: $boxType) {
      packDetails
      errorCode
      errorMessage
    }
  }
`;

export const doGetRentlPackETSK = gql`
  mutation DoGetRentlPackETSK(
    $subscriberId: String!
    $selectedPcaksTogetRentalUniqueArray: [String!]!
    $boxType: String!
    $bookingFormNumber: String
    $etskSelectedOffer: String
    $packPriceFe: Float
  ) {
    doGetRentlPackETSK(
      subscriberId: $subscriberId
      selectedPcaksTogetRentalUniqueArray: $selectedPcaksTogetRentalUniqueArray
      boxType: $boxType
      bookingFormNumber: $bookingFormNumber
      etskSelectedOffer: $etskSelectedOffer
      packPriceFE: $packPriceFe
    ) {
      subscriberId
      source
      action
      isAccountLevel
      transactionId
      transactionMsg
      transactionCode
      eaiIssueFlag
      tskValue
      cessState
      cessPercent
      cessText
      eTSKMinRechargeAmount
      multiTVAddBoxsPrice1
      multiTVAddBoxsPrice2
      multiTVAddBoxsPrice3
      noOfConnection
      numberOfSecondaryConnections
      flexiPackPrice
      flexiPackPriceAnn
      flexiPackPriceSemi
      flexiPackPriceSemiBonus
      vcLvlPackDtls
      accountLvlPackDtls
      packToAdd
      packToAdd2
      packToAdd3
      priBoxType
      priceMultitv
      priceMultitv2
      priceMultitv3
      secondBoxType2
      secondBoxType3
      secondBoxType4
      secondNCFPrice
      secondNCFPrice2
      secondNCFPrice3
      secondPackPrice
      secondPackPrice2
      secondPackPrice3
      multiTvPackList
      multiTvPackList2
      multiTvPackList3
      dhamakaETSK
      dhamakaReqRechAmtETSK
      offerTypeFromBE
    }
  }
`;
export const getPackagesURLsTrai = gql`
  mutation GetPackagesURLsTrai {
    getPackagesURLsTrai {
      urls
    }
  }
`;

export const etskShedular = gql`
  mutation Mutation($input: EtskShedularInput) {
    etskShedular(input: $input) {
      message
      status
      response {
        transId
        message
        woNumber
      }
    }
  }
`;

export const checkRentalPackFlag = gql`
  query CheckRentalPackFlag {
    checkRentalPackFlag {
      rentalFlag
    }
  }
`;
export const doCheckRentalPackFlagPrice = gql`
  mutation DoCheckRentalPackFlagPrice {
    doCheckRentalPackFlagPrice {
      checkRentalFlagPrice
    }
  }
`;
