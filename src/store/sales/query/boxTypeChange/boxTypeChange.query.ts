/**
 * @module store/sales/query/boxTypeChange
 * @description Reducer query definitions for boxTypeChange actions.
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
 *   query: getBoxTypesFromProps,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */

export const getBoxTypesFromProps = gql`
  query GetBoxTypesFromProps {
    getBoxTypesFromProps {
      data {
        boxTypes
        woType
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
 *   query: getAccountInfoBoxTypeChange,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getAccountInfoBoxTypeChange = gql`
  query GetSubscriberTSKDeatils($subscriberId: String!) {
    getSubscriberTSKDeatils(subscriberId: $subscriberId) {
      tskDeatils {
        connectionType
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
 *   query: getWorkOrderDetailsBoxType,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getWorkOrderDetailsBoxType = gql`
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
 *   query: tskStatusAllDetailsProcedure,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const tskStatusAllDetailsProcedure = gql`
  query GetTskAllDetails($subscriberId: String!) {
    getTskAllDetails(subscriberId: $subscriberId) {
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
      }
      dealerDetails {
        dealerCode
        connectionType
      }
      channelName
      outletType
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
 *   query: getActivationStatusOtherDetailsBoxType,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getActivationStatusOtherDetailsBoxType = gql`
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
 *   query: getTskPinDetailsBoxType,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getTskPinDetailsBoxType = gql`
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
 *   query: getAccountDetailsPrimaryAndSecondaryRepushBoxType,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getAccountDetailsPrimaryAndSecondaryRepushBoxType = gql`
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
      pricePointPrimary
      pricePointSecondary1
      pricePointSecondary2
      pricePointSecondary3
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
 *   query: getAllPacksPropBoxType,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const getAllPacksPropBoxType = gql`
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
        object {
          name
          value
        }
        id
        name
        nameNT
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

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: boxTypeChange,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const boxTypeChange = gql`
  mutation BoxTypeChange($input: BoxTypeChangeInput!) {
    boxTypeChange(input: $input) {
      referenceId
      message
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
 *   query: boxTypeChange,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const deleteWorkOrder = gql`
  mutation DeleteWorkOrder($input: DeleteWorkOrderInput!) {
    deleteWorkOrder(input: $input) {
      referenceId
      message
    }
  }
`;
