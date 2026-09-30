/**
 * @module store/sales/query/etskMultiTv
 * @description Reducer query definitions for etskMultiTv actions.
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
export const validSubIDETSKMulti = gql`
  mutation ValidSubIDETSKMulti($input: ValidSubIDETSKMultiInput) {
    validSubIDETSKMulti(input: $input) {
      status
      eTskMultiOfrType
      bingePlus
      bingepluspayablebox
      notapplicableboxBingeplus
      accountInfo {
        annualRecharge
        bingePlus
        eligibles
        balance
        boxDetails {
          connectionType
          connectionTypeName
          connectionTypeNT
          boxType
          vcNumber
          connectionStatus
          secondaryPack
        }
        customerName
        customerRMN
        customerStatus
        customerStatusNT
        endDateBasePack
        digiCardNo
        restrictionMessage
        monthlyRecharge
        recommendedMonthlyRecharge
        ocsFlag
        packageInfo
        rechargeDueDate
        secPackageInfo
        semiAnnualRecharge
        serviceRegionId
        state
        subId
        subIdNT
        source
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
        isDhamakaEligibleNT
        flexiMBRValue
        flexiDueDate
        flexiPlanInfo
        flexiPlanInfoNew
        rmn
        semiAnnualMargin
        annualMargin
        flexiRechargeAmountSemiAnnual
        flexiRechargeAmountAnnual
        flexiSemiAnnualBonus
        flexiAnnualBonus
        bingePlanInfo
        bingeRechargeValue
        bingeOffer
        flexiDealerIncentiveAnnual
        flexiDealerIncentiveSemiAnnual
        flexiRechargeAmount
        dhamakaSubId
        disclaimerWinback
      }
      eTskMultiOfrTypeDropdown
    }
  }
`;
export const getSecMultiTVDtlsETSKMul = gql`
  mutation GetSecMultiTVDtlsETSKMul($input: GetSecMultiTVDtlsETSKMulInput) {
    getSecMultiTVDtlsETSKMul(input: $input) {
      disableEditRechDhamakaMultiTV
      pricePointLdp
      packageNameArray
      multiTVAddBoxsPrice
      eTSKMinRechargeAmount
      flexiPlanInfoText
      flexiPackPrice
      flexiPackPriceAnn
      flexiPackPriceSemi
      flexiPackPriceSemiBonus
      flexiDealerIncentiveAnnual
      flexiDealerIncentiveSemiAnnual
      customerInformation
    }
  }
`;
export const doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul = gql`
  query DoRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul(
    $subscriberId: String
    $rechargeAmount: String
    $rechargeEvdPin: String
    $etskSelectedOffer: String
    $requiredRechargeAmount: String
    $boxTypeFe: String
    $dhamakaMulRechBalChk: String
    $startTime: String
    $endTime: String
    $ocsFlag: String
    $taskId: String
  ) {
    doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul(
      subscriberId: $subscriberId
      rechargeAmount: $rechargeAmount
      rechargeEvdPin: $rechargeEvdPin
      etskSelectedOffer: $etskSelectedOffer
      requiredRechargeAmount: $requiredRechargeAmount
      boxTypeFE: $boxTypeFe
      dhamakaMulRechBalChk: $dhamakaMulRechBalChk
      startTime: $startTime
      endTime: $endTime
      ocsFlag: $ocsFlag
      taskId: $taskId
    ) {
      response {
        orderId
        transId
        message
        subscriberId
        workOrderId
      }
      message
      status
    }
  }
`;
export const etskMultiTvRepush = gql`
  mutation EtskMultiTvRepush($input: EtskMultiTvRepushInput) {
    etskMultiTvRepush(input: $input) {
      status
      message
      response {
        transId
        message
        status
        woNumber
        boxType
        rechargeAmount
        subscriberId
        accountInfo {
          customerName
          customerRMN
          subId
          subIdList {
            rmn
            subId
            subIdNT
            aliasName
            status
            statusNT
          }
          boxDetails {
            boxType
          }
        }
      }
    }
  }
`;
