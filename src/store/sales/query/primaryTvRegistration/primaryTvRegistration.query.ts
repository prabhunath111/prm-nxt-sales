/**
 * @module store/sales/query/primaryTvRegistration
 * @description Reducer query definitions for primaryTvRegistration actions.
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
export const validatePrimaryTSK = gql`
  mutation ValidateTskPin($input: validateTskPinInput) {
    validateTskPin(input: $input) {
      pinCodeError
      primaryTskPinError
      status
      message
      response {
        primaryTskPin
        pinCode
      }
    }
  }
`;

export const validateSecondaryTSK = gql`
  mutation ValidateTskPin($input: validateTskPinInput) {
    validateTskPin(input: $input) {
      status
      message
      response {
        location
        primaryTskPin
        secondaryTskPin1
        secondaryTskPin2
        secondaryTskPin3
        primaryBoxType
        primaryBoxTypeNT
        secondaryBoxType1
        secondaryBoxType2
        secondaryBoxType3
        secondaryBoxType1NT
        secondaryBoxType2NT
        secondaryBoxType3NT
        pricePointPrimary
        pricePointSecondary1
        pricePointSecondary2
        pricePointSecondary3
        pinCode
        city
        state
        district
      }
    }
  }
`;

export const registrationDetailsSubmit = gql`
  mutation AccountCreationAndTSKRegistration($input: accountCreationInput) {
    accountCreationAndTSKRegistration(input: $input) {
      tskSerialNumber
      tskSerialNumber1
      tskSerialNumber2
      tskSerialNumber3
      offerCategory
      packageName
      bingeEligible
      tskPin
      secondaryTskPin1
      secondaryTskPin2
      secondaryTskPin3
      boxType
      secondaryBoxType1
      secondaryBoxType2
      secondaryBoxType3
      boxTypeNT
      secondaryBoxType1NT
      secondaryBoxType2NT
      secondaryBoxType3NT
      subId
      outletType
      channelName
      ocsFlag
      serviceRegionId
      dealerCodePrimary
      tskValue
      tskValue1
      tskValue2
      tskValue3
      TataskyPacks
      AlacartePacks
      BingePacks
      BingeplusPacks
      notapplicableboxBingeplus
      BroadCastPacks
      bingepluspayablebox
      offerCategories
      geners
      durations
      boxTypes
      languages
      PopularPacks
      bingeOfferArrRes
      removeBingeCombinationRes
      disableLDPPacks {
        category
        rechargeAmount
        rechargeEnabled
        DhamakaFlag
      }
      status
      message
    }
  }
`;

export const languageList = gql`
  query Query {
    languageList
  }
`;

export const getPacks = gql`
  query GetPacks($boxType: String, $category: String) {
    getPacks(boxType: $boxType, category: $category) {
      result {
        packsDetails {
          siebelName
          price
          friendlyName
          boxType
          duration
          genreName
          languageName
          flexiPack
          category
          durationNT
          siebelNameNT
          boxTypeNT
        }
      }
      status
      message
    }
  }
`;

export const getRentalPackNew = gql`
  query GetRentalPackNew(
    $subscriberId: String
    $selectedPacksTogetRentalUniqueArray: [String]
    $boxType: String
    $tskPin: String
    $tskSerialNumber: String
    $tskSerialNumber1: String
    $tskSerialNumber2: String
    $tskSerialNumber3: String
    $boxType1: String
    $boxType2: String
    $boxType3: String
    $packPriceFe: String
  ) {
    getRentalPackNew(
      subscriberId: $subscriberId
      selectedPacksTogetRentalUniqueArray: $selectedPacksTogetRentalUniqueArray
      boxType: $boxType
      tskPin: $tskPin
      tskSerialNumber: $tskSerialNumber
      tskSerialNumber1: $tskSerialNumber1
      tskSerialNumber2: $tskSerialNumber2
      tskSerialNumber3: $tskSerialNumber3
      boxType1: $boxType1
      boxType2: $boxType2
      boxType3: $boxType3
      packPriceFE: $packPriceFe
    ) {
      result {
        subscriberId
        source
        action
        isAccountLevel
        accountLvlPackDtls
        transactionId
        transactionMsg
        transactionCode
        eaiIssueFlag
        tskValue
        installationMinRechargeAmount
        cessState
        cessPercent
        cessText
        multiTVAddBoxsPrice1
        multiTVAddBoxsPrice2
        multiTVAddBoxsPrice3
        vcLvlPackDtls {
          packDtls {
            eligiblityMessage
            isEligibile
            discountMessage
            compatibiltyMessage
            isCompatible
            action
            productPrice
            productName
            discountCode
            numberOfChannels
          }
        }
        multiTvPackList {
          packName
          packPrice
        }
        priceMultitv
        packToAdd
        flexiPackPrice
        flexiPackPriceAnn
        flexiPackPriceSemi
        flexiPackPriceSemiBonus
        flexiDealerIncentiveAnnual
        flexiDealerIncentiveSemiAnnual
        priBoxType
        secondBoxType1
        secondBoxType2
        secondBoxType3
        connections
        primaryPack
        secondaryNCF
        secondaryPack
        primaryNCF
        numberOfChannels
      }
      message
      status
    }
  }
`;

export const doPickPackAndWorkOrderCreationPrimaryAndSecondary = gql`
  query DoPickPackAndWorkOrderCreationPrimaryAndSecondary(
    $subscriberId: String
    $packageName: String
    $finalValidatedPacksArray: [String]
    $rechargeAmount: String
    $tskSerialNumber: String
    $orderId: String
    $package1: String
    $package2: String
    $package3: String
    $tskSerialNumber1: String
    $tskSerialNumber2: String
    $tskSerialNumber3: String
    $requiredRechargeAmount: String
    $selectedPackAndCategoriesArray: [String]
    $rechargeEvdPin: String
    $rechargeFlag: String
    $flexiFlag: String
    $bingeSelected: String
    $typeUser: String
    $startTime: String
    $endTime: String
    $ocsFlag: String
    $taskId: String
    $moduleName: String
    $isDhamakaoffer: Boolean
  ) {
    doPickPackAndWorkOrderCreationPrimaryAndSecondary(
      subscriberId: $subscriberId
      packageName: $packageName
      finalValidatedPacksArray: $finalValidatedPacksArray
      rechargeAmount: $rechargeAmount
      tskSerialNumber: $tskSerialNumber
      orderId: $orderId
      package1: $package1
      package2: $package2
      package3: $package3
      tskSerialNumber1: $tskSerialNumber1
      tskSerialNumber2: $tskSerialNumber2
      tskSerialNumber3: $tskSerialNumber3
      requiredRechargeAmount: $requiredRechargeAmount
      selectedPackAndCategoriesArray: $selectedPackAndCategoriesArray
      rechargeEvdPin: $rechargeEvdPin
      rechargeFlag: $rechargeFlag
      flexiFlag: $flexiFlag
      bingeSelected: $bingeSelected
      typeUser: $typeUser
      startTime: $startTime
      endTime: $endTime
      ocsFlag: $ocsFlag
      taskId: $taskId
      moduleName: $moduleName
      isDhamakaoffer: $isDhamakaoffer
    ) {
      subscriberId
      result {
        transId
        message
      }
      woNumber
      message
      status
    }
  }
`;

export const getDetailsRepush = gql`
  query GetAccountDetailsPrimaryAndSecondaryRepush($input: AccountInput) {
    getAccountDetailsPrimaryAndSecondaryRepush(input: $input) {
      firstName
      lastName
      subscriberId
      tskSerialNumber
      tskPin
      tskType
      message
      orderId
      boxType
      boxTypeNT
      serviceRegionId
      ocsFlag
      requestType
      bcpFlag
      bingeEligibility
      userName
      pricePoint
      location
      state
      city
      pincode
      district
      languages
      outletType
      channelName
      offerCategory
      packageName {
        OfferCategory
        PackageInfo {
          packName
          packNameNT
          pricePt
          uom
          uomNT
          productLine
        }
      }
      screen
      code
      secondary_1 {
        subscriberId
        tskSerialNumber
        boxType
        boxTypeNT
        userName
        tskType
        connectionType
        pricePoint
      }
      secondary_2 {
        subscriberId
        tskSerialNumber
        boxType
        boxTypeNT
        userName
        tskType
        connectionType
        pricePoint
      }
      secondary_3 {
        subscriberId
        tskSerialNumber
        boxType
        boxTypeNT
        userName
        tskType
        connectionType
        pricePoint
      }
      accInfo
    }
  }
`;

export const getAllRePushPacksProp = gql`
  query GetAllPacksProp($input: AllPacksPropInput) {
    getAllPacksProp(input: $input) {
      TataskyPacks {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      AlacartePacks {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      BingePacks {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      BingeplusPacks {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      notapplicableboxBingeplus {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      BroadCastPacks {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      bingepluspayablebox
      offerCategories {
        offerCategory
        offerCategoryNT
      }
      geners {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      durations {
        name
        value
      }
      boxTypes {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      languages {
        id
        name
        nameNT
        object {
          name
          value
        }
        secondaryName
      }
      PopularPacks {
        id
        name
        nameNT
        object {
          name
          value
        }
      }
      bingeOfferArrRes
      removeBingeCombinationRes
      disableLDPPacks {
        category
        rechargeAmount
        rechargeEnabled
        DhamakaFlag
      }
    }
  }
`;
