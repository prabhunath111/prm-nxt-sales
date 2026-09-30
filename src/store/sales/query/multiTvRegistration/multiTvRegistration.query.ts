/**
 * @module store/sales/query/multiTvRegistration
 * @description Reducer query definitions for multiTvRegistration actions.
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
export const tskPinValidateAdapterSecondaryOCS = gql`
  query TskPinValidateAdapterSecondaryOCS($tskPin: String, $subId: String, $boxType: String, $type: String, $flag: String, $bingPackDetails: [String]) {
    tskPinValidateAdapterSecondaryOCS(tskPin: $tskPin, subId: $subId, boxType: $boxType, type: $type, flag: $flag, bingPackDetails: $bingPackDetails) {
      result {
        disableEditRechDhamakaMultiTV
        multiTVAddBoxsPrice
        ocsFlag
        serviceRegionId
        pricePoint
        pricePointLdp
        packageNameArray {
          packName
          packPrice
        }
        packToAdd
        subID
        dealerCode
        offerCategory
        packageName {
          OfferCategory
          packageInfo {
            packName
            pricePt
          }
        }
        message
        tskSerial
        multiTVMinRechargeAmt
        cessState
        cess_Percent
        cessText
        flexiPackPrice
        flexiPackPriceAnn
        flexiPackPriceSemi
        flexiPackPriceSemiBonus
        flexiDealerIncentiveAnnual
        flexiDealerIncentiveSemiAnnual
        tskValue
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
        accountInfo {
          customerName
          customerRMN
          subIdList {
            rmn
            subId
            subIdNT
            aliasName
            status
            statusNT
          }
        }
      }
      message
      status
    }
  }
`;

export const retrieveMultiTvBoxType = gql`
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

export const doPickPackAndWorkOrderCreationSecondary = gql`
  query DoPickPackAndWorkOrderCreationSecondary(
    $boxType: String
    $taskId: String
    $ocsFlag: String
    $endTime: String
    $dhamakaMulRechBalChk: String
    $flexiFlag: String
    $startTime: String
    $rechargeEvdPin: String
    $requiredRechargeAmount: String
    $type: String
    $assetNumber: String
    $rechargeAmount: String
    $packageName: String
    $subscriberId: String
  ) {
    doPickPackAndWorkOrderCreationSecondary(
      boxType: $boxType
      taskId: $taskId
      ocsFlag: $ocsFlag
      endTime: $endTime
      dhamakaMulRechBalChk: $dhamakaMulRechBalChk
      flexiFlag: $flexiFlag
      startTime: $startTime
      rechargeEvdPin: $rechargeEvdPin
      requiredRechargeAmount: $requiredRechargeAmount
      type: $type
      assetNumber: $assetNumber
      rechargeAmount: $rechargeAmount
      packageName: $packageName
      subscriberId: $subscriberId
    ) {
      result {
        orderId
        transId
        message
        subscriberId
        workOrderId
      }
      woNumber
      message
      status
    }
  }
`;
