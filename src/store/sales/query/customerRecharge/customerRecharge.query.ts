/**
 * @module store/query/customerRecharge
 * @description Reducer query definitions for customerRecharge actions.
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
 *   query: doRecharge,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const doRecharge = gql`
  mutation DoRecharge($input: RechargeInput!) {
    doRecharge(input: $input) {
      transId
      mobTransId
      message
      subMessage
      balance
      subscriberBalance
      accountInfo {
        subIdList {
          rmn
          subId
          subIdNT
          aliasName
          status
          statusNT
        }
        subIdNT
      }
    }
  }
`;

export const validateSubscriber = gql`
  query ValidateRechargeInfo($subscriberInfo: String) {
    validateRechargeInfo(subscriberInfo: $subscriberInfo) {
      accountInfo {
        lastRechargeDetails {
          amount
          transDate
          transactionId
        }
        lastRecharge
        lastRechargeAmount
        lastRechargeDate
        annualRecharge
        balance
        boxDetails {
          connectionType
          connectionTypeName
          connectionTypeNT
          boxType
          vcNumber
          connectionStatus
          secondaryPack
          packDetails {
            uom
            packageFriendlyName
            packageDashboardCategory
            endDate
            packType
            packName
            packNameNT
            packPrice
            startDate
          }
        }
        customerName
        customerNameNT
        customerRMN
        customerStatus
        endDateBasePack
        digiCardNo
        flexiBonusAmount
        flexiDueDate
        flexiMBRValue
        flexiPlanFlag
        flexiPlanInfo
        flexiPlanInfoNew
        flexiRechargeAmountSemiAnnual
        flexiRechargeAmountAnnual
        flexiSemiAnnualBonus
        flexiAnnualBonus
        flexiRechargeAmount
        restrictionMessage
        message
        monthlyRecharge
        recommendedMonthlyRecharge
        ocsFlag
        rechargeDueDate
        semiAnnualRecharge
        serviceRegionId
        subId
        subIdNT
        subIdList {
          rmn
          subId
          subIdNT
          aliasName
          status
          statusNT
        }
        maskedRMN
        isDhamakaEligible
        bingeOffer
        bingePlanInfoText
        bingeRechargeValue
        flexiDealerIncentiveAnnual
        flexiDealerIncentiveSemiAnnual
        accountType
        xtraMileRechargeOffers {
          slab
          rechargeIdentifier
          slabOfferDetails {
            slabOfferBonus
            slabOfferRechargeAmount
            partnerMargin
            offerName
            subscriberBonus
          }
        }
        flexiRechargeFlag
        segmentedCashBackOffers {
          segmentedOfferRechargeIdentifier
          offerDetails {
            offerDesc
            offerKey
            rechargeAmount
            dealerMargin
            cashbackValue
            segmentedOfferDisclaimer
          }
          offerType
        }
        winbackFlexiOffers {
          winbackFlexiOfferRechargeIdentifier
          offerDetails {
            offerKey
            rechargeAmount
            offerValue
            cashbackValue
            dealerMargin
            offerDesc
            winbackOfferDisclaimer
          }
          offerType
        }
      }
      regionOffers {
        subscriberId
        withoutRechargeFlag
        withoutRechargeFlagNT
        otpConfigForWithoutRecharge
        otpConfigForWithoutRechargeNT
        wbldpPackOffersAccStatus
        wbldpPackOffersList {
          uom
          name
          nameNT
          stdPriUnit
          boxType
          type
          offerNumber
          friendlyName
          friendlyNameNT
          bonus
          margin
          offerNum
          customerBonus
        }
        dynamicOffersList {
          offerCategory
          offerCategoryNT
          offerList {
            campaignType
            campaignTypeNT
            isSubSmsReq
            displayCategory
            boxType
            priority
            isDealerSmsReq
            packPrice
            states
            isOtpReq
            isOtpReqNT
            offerType
            offerTypeNT
            offerDesc
            offerDescNT
            irdetoRef
            isDealerIncentiveApplicable
            isRechargeReq
            isRechargeReqNT
            packName
            packNameNT
            dealerIncentiveMsg
            dealerIncentiveMsgNT
            value
            category
            categoryNT
          }
        }
        endDateFDR
        endDateFDRNT
        balance
        actStatus
        actStatusNT
        rmn
        vcArray
        disclaimer
      }
      winBackOffers {
        d30WinBackPacksList {
          uom
          name
          nameNT
          stdPriUnit
          boxType
          type
          offerNumber
          friendlyName
          friendlyNameNT
          bonus
          margin
          offerNum
          customerBonus
        }
        message
        balance
        otpConfigForWithoutChange
        otpConfigForWithoutChangeNT
        withoutRechargeFlag
        withoutRechargeFlagNT
      }
      bingePlusPack
      fdoStatus
    }
  }
`;

export const doOfferRecharge = gql`
  mutation DoOfferRecharge($input: OfferInput!) {
    doOfferRecharge(input: $input) {
      message
      subMessage
      transId
      mobTransId
      balance
      accountInfo {
        subIdList {
          rmn
          subId
          subIdNT
          aliasName
          status
          statusNT
        }
        subIdNT
      }
      subscriberBalance
    }
  }
`;

export const generateOtp = gql`
  mutation GenerateOtp($input: GenOTPInput!) {
    generateOtp(input: $input) {
      transStatus
      transStatusNT
    }
  }
`;

export const getOfferPackDetails = gql`
  query GetOfferPackDetails($offerName: String!, $packPrice: String!) {
    getOfferPackDetails(offerName: $offerName, packPrice: $packPrice) {
      packageId
      bouquetType
      packName
      packFriendlyName
      hdCount
      sdCount
      genre
      packPrice
      bouquetChannels {
        id
        packName
        packItems {
          id
          title
          subChannels {
            pid
            pName
            channelName
            bid
            pmrp
            hdFlag
            epgNumber
            hdOrSd
            sdOrId
            rentalFlag
            cName
            recoGenreId
            channelId
            language
            genreName
            bcat
            packageCat
            imageName
            imageURL
          }
        }
      }
    }
  }
`;

export const getInvoiceURL = gql`
  query GetInvoiceURL($transactionId: String!) {
    getInvoiceURL(transactionId: $transactionId) {
      invoiceUrl
    }
  }
`;

export const fetchBingePlusPack = gql`
  mutation FetchBingePluspack($input: FetchBingePluspackInput!) {
    fetchBingePluspack(input: $input) {
      details
    }
  }
`;
