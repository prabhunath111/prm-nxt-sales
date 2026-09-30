/**
 * @module store/sales/query/quotation
 * @description Reducer query definitions for quotation actions.
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
export const validateEligibilityForETSK = gql`
  query ValidateEligibilityForETSK {
    validateEligibilityForETSK {
      result {
        etskOffersAndBoxtypesArray
        etskOffersDropDown
      }
      message
      status
    }
  }
`;
export const validatePinCodePartnerQuote = gql`
  query ValidatePinCodePartnerQuote($pincode: String) {
    validatePinCodePartnerQuote(pincode: $pincode) {
      result {
        id
        name
        nameNT
        object {
          name
          value
        }
        location
        salesSegment
        locationNT
        salesSegmentNT
        state
        stateNT
        city
        cityNT
        district
        districtNT
        pincode
      }
      message
      status
    }
  }
`;
export const retrieveBasePackBsStateWithoutSubId = gql`
  query RetrieveBasePackBsStateWithoutSubId($pincode: String, $boxType: String, $channelName: String, $outletType: String, $etskSelectedOffer: String) {
    retrieveBasePackBsStateWithoutSubId(pincode: $pincode, boxType: $boxType, channelName: $channelName, outletType: $outletType, etskSelectedOffer: $etskSelectedOffer) {
      message
      result {
        offerCategory {
          id
          name
          nameNT
          object {
            name
            value
          }
          offerCategory
          offerCategoryNT
        }
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
        PopularPacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        quoteOfferCategory
        TataskyPacks {
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
        bingepluspayablebox
        notapplicableboxBingeplus {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        smsUrl
        smsStartMsg
        smsEndMsg
        getQuoteFlag
        getOTPSMSFlag
        nextLineChar
        languages
        geners
        boxTypes
        durations
        offerCategories
        languagesDropdown
      }
      status
    }
  }
`;

export const doGetRentalPackNewPartnerQuoteEtsk = gql`
  query DoGetRentalPackNewPartnerQuoteEtsk(
    $noOfConnection: String
    $packPriceFe: String
    $etskSelectedOffer: String
    $pincode: String
    $boxType4: String
    $boxType3: String
    $boxType2: String
    $boxType: String
    $selectedPcaksTogetRentalUniqueArray: [String]
  ) {
    doGetRentalPackNewPartnerQuoteEtsk(
      noOfConnection: $noOfConnection
      packPriceFE: $packPriceFe
      etskSelectedOffer: $etskSelectedOffer
      pincode: $pincode
      boxType4: $boxType4
      boxType3: $boxType3
      boxType2: $boxType2
      boxType: $boxType
      selectedPcaksTogetRentalUniqueArray: $selectedPcaksTogetRentalUniqueArray
    ) {
      message
      result {
        subscriberId
        source
        action
        isAccountLevel
        accountLvlPackDtls
        transactionId
        transactionMsg
        transactionCode
        noOfConnection
        priBoxType
        secondBoxType2
        secondBoxType3
        secondBoxType4
        eaiIssueFlag
        numberOfSecondaryConnections
        multiTVAddBoxsPrice1
        multiTVAddBoxsPrice2
        multiTVAddBoxsPrice3
        eTSKMinRechargeAmount
        tskValue
        cessState
        cess_Percent
        cessText
        vcLvlPackDtls {
          packDtls {
            eligiblityMessage
            productIntigrationId
            discountCode
            action
            isElgibile
            compatibiltyMessage
            productName
            isCompatible
            discountMessage
            productPrice
            discountPrice
            numberOfChannels
          }
        }
        multiTvPackList {
          packName
          packPrice
        }
        multiTvPackList2 {
          packName
          packPrice
        }
        multiTvPackList3 {
          packName
          packPrice
        }
        priceMultitv
        priceMultitv2
        priceMultitv3
        packToAdd
        packToAdd2
        packToAdd3
        secondNCFPrice
        secondNCFPrice2
        secondNCFPrice3
        secondPackPrice
        secondPackPrice2
        secondPackPrice3
        flexiPackPrice
        flexiPackPriceAnn
        flexiPackPriceSemi
        flexiPackPriceSemiBonus
        flexiDealerIncentiveAnnual
        flexiDealerIncentiveSemiAnnual
        dhamakaETSK
        dhamakaReqRechAmtETSK
        offerTypeFromBE
      }
      status
    }
  }
`;
export const getTskTypesFromProp = gql`
  query Result {
    getTskTypesFromProp {
      result {
        tskType
        smsUrl
        smsStartMsg
        smsEndMsg
        getQuoteFlag
        getOTPSMSFlag
        nextLineChar
        response
      }
      message
      status
    }
  }
`;
export const getAllCategoryPacks = gql`
  query GetAllCategoryPacks(
    $boxType: String
    $priTskType: String
    $noOfBoxes: String
    $state: String
    $das: String
    $sec1BoxType: String
    $sec2BoxType: String
    $sec3BoxType: String
  ) {
    getAllCategoryPacks(
      boxType: $boxType
      priTskType: $priTskType
      noOfBoxes: $noOfBoxes
      state: $state
      das: $das
      sec1BoxType: $sec1BoxType
      sec2BoxType: $sec2BoxType
      sec3BoxType: $sec3BoxType
    ) {
      result {
        PopularPacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        disableLDPPacks {
          category
          rechargeAmount
          rechargeEnabled
          DhamakaFlag
        }
        bingeOfferArrRes
        removeBingeCombinationRes
        TataskyPacks {
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
        bingepluspayablebox
        notapplicableboxBingeplus {
          id
          name
          nameNT
          object {
            name
            value
          }
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
            productLine
            uom
            pricePt
            packName
            packNameNT
          }
        }
        geners
        boxTypes
        durations
        offerCategories
        languagesDropdown
        languages
      }
      message
      status
    }
  }
`;

export const doGetRentalPackNewPartnerQuote = gql`
  query DoGetRentalPackNewPartnerQuote(
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
    $pincode: String
  ) {
    doGetRentalPackNewPartnerQuote(
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
      pincode: $pincode
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
        cess_Percent
        cessText
        multiTVAddBoxsPrice1
        multiTVAddBoxsPrice2
        multiTVAddBoxsPrice3
        vcLvlPackDtls {
          packDtls {
            eligiblityMessage
            productIntigrationId
            discountCode
            action
            isElgibile
            compatibiltyMessage
            productName
            isCompatible
            discountMessage
            productPrice
            discountPrice
            numberOfChannels
          }
        }
        multiTvPackList {
          packName
          packPrice
        }
        priceMultitv
        packToAdd
        connections
        numberOfChannels
        primaryNCF
        primaryPack
        secondaryNCF
        secondaryPack
      }
      message
      status
    }
  }
`;

export const getMultiTVDetails = gql`
  query GetSecMultiTVDtls($subId: String!, $boxType: String, $bingeplusSelectedoffer: [String]) {
    getSecMultiTVDtls(subId: $subId, boxType: $boxType, bingeplusSelectedoffer: $bingeplusSelectedoffer) {
      result {
        subId
        pricePointLdp
        packageNameArray {
          packName
          packPrice
        }
        statusCode
        multiTVAddBoxsPrice
        subIdList {
          subscriberId
          rmn
          customerName
          accountStatus
          accountType
          accountSubType
          accountCategory
          email
          accountFlag
          accountSubCategory
          accountServiceType
          serviceAvailed
          subId
          subIdNT
          status
          statusNT
          aliasName
        }
        customerName
        customerInformation {
          customerName
          mobileNo
          emailAddress
          language
          secondaryLang
          pincode
          addressLine1
          state
          city
          district
        }
        secondaryPackPrice
        secondaryNCF
      }
      message
      status
    }
  }
`;

export const getTskType = gql`
  query GetTskTypesFromProp {
    getTskTypesFromProp {
      result {
        tskType
        smsUrl
        smsStartMsg
        smsEndMsg
        getQuoteFlag
        getOTPSMSFlag
        nextLineChar
        response
      }
      message
      status
    }
  }
`;

export const getMultiTvBoxType = gql`
  query RetrieveMultiTvBoxType {
    retrieveMultiTvBoxType {
      result {
        bingepluspayablebox
        boxType {
          id
          name
          object {
            name
            value
            valueNT
          }
        }
        BingePlus
      }
      message
      status
    }
  }
`;

export const sendOtpMultiTV = gql`
  query GenerateOTPWithMobile($mobile: String) {
    generateOTPWithMobile(mobile: $mobile) {
      transStatus
      status
    }
  }
`;

export const verifyOtp = gql`
  query ValidateOTPWithMobile($input: ValidateOTPInput) {
    validateOTPWithMobile(input: $input) {
      message
      status
    }
  }
`;

export const sendSmsMultiTV = gql`
  query SendSMSQuotation($msg: String!, $rmn: String!) {
    sendSMSQuotation(msg: $msg, rmn: $rmn) {
      result
      message
      status
    }
  }
`;

export const sendSMSQuotation = gql`
  query SendSMSQuotation($msg: String!, $rmn: String!) {
    sendSMSQuotation(msg: $msg, rmn: $rmn) {
      result
      message
      status
    }
  }
`;

export const insertRentalPackNewPartnerQuoteSecInsMod = gql`
  query InsertRentalPackNewPartnerQuoteSecInsMod($packageDetails: [packageDetailsArray]) {
    insertRentalPackNewPartnerQuoteSecInsMod(packageDetails: $packageDetails) {
      result {
        insertResPartnerQuote
      }
      message
      status
    }
  }
`;

export const insertRentalPackNewPartnerQuoteMod = gql`
  query InsertRentalPackNewPartnerQuoteMod($mobileNumber: String, $name: String, $email: String, $totalPrice: String) {
    insertRentalPackNewPartnerQuoteMod(mobileNumber: $mobileNumber, name: $name, email: $email, totalPrice: $totalPrice) {
      result {
        insertResPartnerQuote
        requestNumber
      }
      message
      status
    }
  }
`;
