/**
 * @module store/sales/query/woRecreation
 * @description Reducer query definitions for woRecreation actions.
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
 *   query: getSubscriberTSKDeatils,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getSubscriberTSKDeatils = gql`
  query GetSubscriberTSKDeatils($subscriberId: String!) {
    getSubscriberTSKDeatils(subscriberId: $subscriberId) {
      tskDeatils {
        connectionType
        connectionTypeNT
        bookingFormNo
      }
      subscriberList {
        subscriberId
        accountStatus
        subscriberName
        accountType
        rmn
        subId
        subIdNT
        status
        statusNT
        aliasName
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
 *   query: getTskAllDetails,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getTskAllDetails = gql`
  query GetTskAllDetails($subscriberId: String!) {
    getTskAllDetails(subscriberId: $subscriberId) {
      accountStatus
      tskDetails {
        activityUID
        DealerCode
        TskSno
        tskRegType
        subStatus
        status
        VCType
      }
      woDetails {
        activityUID
        SubType
        type
        status
        statusNT
      }
      eaiOrderDetails {
        orderType
        tskSerialNumber
        orderNumber
        EaiOrderEntryLineItems {
          purchaseCode
          product
          assetNumber
          orderNumber
          serialNumber
          actionCode
          status
        }
        productType
        status
        statusNT
      }
      dealerDetails {
        dealerCode
        connectionType
      }
      channelName
      outletType
      accountDetails {
        firstName
        lastName
        mobileNumber
        pincode
        city
        state
        dealerPrimaryCode
        connectionType
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
 *   query: getWorkOrderDetails,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getWorkOrderDetails = gql`
  query GetWorkOrderDetails($subscriberId: String!) {
    getWorkOrderDetails(subscriberId: $subscriberId) {
      info {
        sub_id
        wo_num
        wo_type
        wo_status
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

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: workOrderRecreation,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const workOrderRecreation = gql`
  query WorkOrderRecreation($input: WoRecreationInput!) {
    workOrderRecreation(input: $input) {
      statusCode
      message
      woNumber
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
 *   query: getTskPinDetails,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getTskPinDetails = gql`
  query GetTskPinDetails($input: TskPinsInput) {
    getTskPinDetails(input: $input) {
      CONNECTIONTYPE
      TSKSERIALNUMBER
      TSKPIN
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
 *   query: getAccountDetailsPrimaryAndSecondaryRepush,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getAccountDetailsPrimaryAndSecondaryRepush = gql`
  query GetAccountDetailsPrimaryAndSecondaryRepush($input: AccountInput) {
    getAccountDetailsPrimaryAndSecondaryRepush(input: $input) {
      accountDetails {
        SUBSCRIBERID
        PRODUCTNAME
        PRODUCTNAME1
        PRODUCTNAME2
        PRODUCTNAME3
        TRANSACTIONID
        SCREENCOMPLETED
        orderId
        USERNAME
        BOOKING_FORM_NO
        REQUESTTYPE
        ERRORMESSAGE
        errorCode
      }
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
      firstName
      lastName
      pricePoint
      location
      city
      pincode
      district
      languages
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
      state
      outletType
      channelName
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
 *   query: getAllPacksProp,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getAllPacksProp = gql`
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

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getWoRentalPack,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getWoRentalPack = gql`
  query GetRentalPackNew(
    $subscriberId: String
    $selectedPacksTogetRentalUniqueArray: [String]
    $tskSerialNumber: String
    $tskSerialNumber1: String
    $tskSerialNumber2: String
    $tskSerialNumber3: String
    $boxType: String
    $boxType1: String
    $boxType2: String
    $boxType3: String
    $tskPin: String
    $packPriceFe: String
  ) {
    getRentalPackNew(
      subscriberId: $subscriberId
      selectedPacksTogetRentalUniqueArray: $selectedPacksTogetRentalUniqueArray
      tskSerialNumber: $tskSerialNumber
      tskSerialNumber1: $tskSerialNumber1
      tskSerialNumber2: $tskSerialNumber2
      tskSerialNumber3: $tskSerialNumber3
      boxType: $boxType
      boxType1: $boxType1
      boxType2: $boxType2
      boxType3: $boxType3
      tskPin: $tskPin
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

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: getWoRentalPack,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
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
    ) {
      result {
        transId
        message
      }
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
 *   query: getOnlyPricePtForMultiTV,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getOnlyPricePtForMultiTV = gql`
  query Query($input: getOnlyPricePtForMultiTVInput) {
    getOnlyPricePtForMultiTV(input: $input)
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
 *   query: getSecMultiTVDtlsOrg,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getSecMultiTVDtlsOrg = gql`
  query Query($input: getSecMultiTVDtlsOrgInput) {
    getSecMultiTVDtlsOrg(input: $input)
  }
`;
