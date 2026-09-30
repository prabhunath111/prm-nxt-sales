/**
 * @module store/sales/query/purchaseOrder
 * @description Reducer query definitions for purchaseOrder actions.
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
export const SAMPLE_QUERY = gql`
  query sample_query_selector($sampleVariable: String!) {
    sample_query_fn(variable_name: $sampleVariable) {
      status
      message
      data
    }
  }
`;

export const dealerBalanceRequest = gql`
  mutation DealerBalanceRequest($input: DealerBalanceRequestInput) {
    dealerBalanceRequest(input: $input) {
      status
      message
      response {
        DlrBalReqID
        DlrBalReqStatus
        Source
        ErrorCode
        ErrorMessage
      }
    }
  }
`;

export const DistributorTrackRequestDetails = gql`
  mutation DistributorTrackRequestDetails($input: distributorTrackRequestDetailsInput) {
    distributorTrackRequestDetails(input: $input) {
      status
      message
      tableColumns
      response {
        distributorTrackDetailsProduct
        distributorTrackDetailsForFosAndDealer {
          mdn
          parent_mdn
          transactor_account_id
          transactee_account_id
          name
          nameNT
          distributor_mdn
          amount
          status
          statusNT
          request_date
          last_updated_date
          paymentType
          paymentTypeNT
          paymentId
          paymentIdNT
          remarks
          remarksNT
          source
          sourceNT
          transfer_amount
        }
      }
    }
  }
`;

export const DistributorTrackRequestWeb = gql`
  mutation DistributorTrackRequestWeb($input: distributorTrackRequestWebInput) {
    distributorTrackRequestWeb(input: $input) {
      status
      message
      response {
        distributorCheckEitherFosOrDealerValid {
          user_id
          parent_id
          parent_mdn
          distributor_id
          distributor_mdn
          NAME
          MDN
          ADDRESS
          LOCALITY
          CITY
          PIN_CODE
        }
      }
    }
  }
`;

export const DoGetPOSMOrderDetailsWeb = gql`
  mutation DoGetPOSMOrderDetailsWeb($input: doGetPOSMOrderDetailsWebInput) {
    doGetPOSMOrderDetailsWeb(input: $input) {
      status
      message
      tableColumns
      tableColumns2
      response {
        errorCode
        message
        orderDetails {
          lastUpdDate
          dealerName
          dealerNameNT
          salesType
          salesTypeNT
          orderType
          orderTypeNT
          productType
          productTypeNT
          distributorRMN
          rejectReasonCode
          distributorName
          distributorNameNT
          status
          statusNT
          distributorCode
          accountNumber
          orderNumber
          DealerEVD
          tslOrderSource
          tslOrderSourceNT
          orderDate
          productDetails {
            parentOrderItemId
            status
            suggestedQty
            confirmedQty
            requestedQty
            stockInHand
            productName
            id
            purchaseCode
          }
        }
      }
    }
  }
`;

export const GetDealerTrackRequest = gql`
  mutation GetDealerTrackRequest($input: GetDealerTrackRequestInput) {
    getDealerTrackRequest(input: $input) {
      status
      message
      response {
        dealerId
        errorMessage
      }
    }
  }
`;

export const FetchDealerIdTrackRequest = gql`
  mutation FetchDealerIdTrackRequest($input: FetchDealerIdTrackRequestInput) {
    fetchDealerIdTrackRequest(input: $input) {
      status
      message
      response {
        userName
        dealerTrackDetailsProduct
        dealerTrackDetails {
          amount
          status
          statusNT
          request_date
          last_updated_date
          paymentType
          paymentTypeNT
          paymentId
          paymentIdNT
          remarks
          remarksNT
          source
          sourceNT
          transfer_amount
        }
      }
      tableColumns
    }
  }
`;

export const GetPaymentOptionsWeb = gql`
  mutation GetPaymentOptionsWeb($input: getPaymentOptionsWebInput) {
    getPaymentOptionsWeb(input: $input) {
      status
      message
      response {
        paymentId {
          user_id
          paymentType
          paymentTypeNT
          paymentId
          paymentIdNT
          bankName
          bankNameNT
          ifscNo
          ifscNoNT
          userName
          userNameNT
        }
        paymentType {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
      }
    }
  }
`;

export const DistributorPaymentIdUpdate = gql`
  mutation DistributorPaymentIdUpdate($input: distributorPaymentIdUpdateInput) {
    distributorPaymentIdUpdate(input: $input) {
      status
      message
      response {
        errorCode
        errorMessage
        paymentId {
          user_id
          userName
          userNameNT
          paymentType
          paymentTypeNT
          paymentId
          paymentIdNT
          bankName
          bankNameNT
          ifscNo
          ifscNoNT
        }
      }
    }
  }
`;

export const FosGetDealerIdForTrackRequest = gql`
  mutation FosGetDealerIdForTrackRequest($input: FosGetDealerIdForTrackRequestInput) {
    fosGetDealerIdForTrackRequest(input: $input) {
      status
      message
      response {
        dealerId
        errorMessage
      }
    }
  }
`;

export const GetFosTrackRequest = gql`
  mutation GetFosTrackRequest($input: GetFosTrackRequestInput) {
    getFosTrackRequest(input: $input) {
      status
      message
      response {
        userName
        fosTrackDetailsProduct
        dealerTrackDetailsForFos {
          amount
          status
          statusNT
          request_date
          last_updated_date
          paymentType
          paymentTypeNT
          paymentId
          paymentIdNT
          remarks
          remarksNT
          mdn
          parent_mdn
          transactor_account_id
          transactee_account_id
          name
          nameNT
          distributor_mdn
        }
      }
      tableColumns
    }
  }
`;

export const FetchSettlements = gql`
  mutation FetchSettlements($input: fetchSettlementsInput) {
    fetchSettlements(input: $input) {
      response {
        settlements
        dealerIds
      }
      message
      status
      tableColumns
    }
  }
`;

export const getPosmDealerId1 = gql`
  mutation GetPosmDealerId1($input: GetPosmDealerId1Input) {
    getPosmDealerId1(input: $input) {
      status
      message
      response {
        dealerId
        errorMessage
      }
    }
  }
`;

export const fosGetRaiseRequestDetails = gql`
  mutation FosGetRaiseRequestDetails($input: FosGetRaiseRequestDetailsInput) {
    fosGetRaiseRequestDetails(input: $input) {
      status
      message
      response {
        userName
        fosRaiseDetails {
          id
          transactor_account_id
          transactee_account_id
          name
          nameNT
          mdn
          mdnNT
          amount
          amountNT
          status
          statusNT
          payment_type
          payment_id
          request_date
        }
      }
    }
  }
`;
export const fosApproveRequest = gql`
  mutation FosApproveRequest($input: FosApproveRequestInput) {
    fosApproveRequest(input: $input) {
      status
      message
      response {
        BalTraReqID
        TransactorAccountID
        TransacteeAccountID
        Amount
        BalTraReqAction
        errorCode
        errorMessage
      }
    }
  }
`;

export const getFosRejectionReasonFromProperty = gql`
  mutation GetFosRejectionReasonFromProperty($input: GetFosRejectionReasonFromPropertyInput) {
    getFosRejectionReasonFromProperty(input: $input) {
      status
      message
      response {
        FosRejectionReason
      }
    }
  }
`;
export const fosRejectAndReasonRequest = gql`
  mutation FosRejectAndReasonRequest($input: FosRejectAndReasonRequestInput) {
    fosRejectAndReasonRequest(input: $input) {
      status
      message
      response {
        BalTraReqID
        TransactorAccountID
        TransacteeAccountID
        Amount
        BalTraReqAction
        Remarks
        errorCode
        errorMessage
      }
    }
  }
`;

export const getOrderId = gql`
  mutation GetOrderId($input: GetOrderIdInput) {
    getOrderId(input: $input) {
      status
      message
      response {
        apiKey
        amount
        comAmount
        orderId
        transferId
        dealerId
        distId
        transId
        evdTransId
      }
    }
  }
`;

export const doPosmBalanceEnquiryWeb = gql`
  mutation DoPosmBalanceEnquiryWeb($input: DoPosmBalanceEnquiryWebInput) {
    doPosmBalanceEnquiryWeb(input: $input) {
      status
      message
      response {
        currentBalance
        donarRMN
        recipientRMN
        threshold_val
        errorCode
        errorMessage
        type
        instantThreshold
      }
    }
  }
`;

export const getPaymentOptionsforDealerWeb = gql`
  mutation GetPaymentOptionsforDealerWeb($input: GetPaymentOptionsforDealerWebInput) {
    getPaymentOptionsforDealerWeb(input: $input) {
      status
      message
      response {
        disId
        default
        paymentId {
          user_id
          paymentType
          paymentTypeNT
          paymentId
          paymentIdNT
          bankName
          bankNameNT
          ifscNo
          ifscNoNT
          userName
          userNameNT
        }
      }
    }
  }
`;

export const getPOSMData = gql`
  mutation GetPOSMData($input: GetPOSMDataInput) {
    getPOSMData(input: $input) {
      status
      message
      response {
        productType
        posmMaximumQuantity
        posmMinimumQuantity
        posmProductsArray {
          productCode
          productName
          productFriendlyName
          materialType
          productCodeNT
          productNameNT
          productFriendlyNameNT
          materialTypeNT
        }
      }
    }
  }
`;

export const doRaiseReqRCVTSKPOSMWeb = gql`
  mutation DoRaiseReqRCVTSKPOSMWeb($input: DoRaiseReqRCVTSKPOSMWebInput) {
    doRaiseReqRCVTSKPOSMWeb(input: $input) {
      status
      message
      response {
        errorCode
        message
      }
    }
  }
`;

export const storeStatus = gql`
  mutation StoreStatus($input: StoreStatusInput) {
    storeStatus(input: $input) {
      status
      message
      response {
        message
        razorpay_payment_id
      }
    }
  }
`;

export const doGetPOSMAssetDetails = gql`
  mutation DoGetPOSMAssetDetails($input: doGetPOSMAssetDetailsInput) {
    doGetPOSMAssetDetails(input: $input) {
      status
      message
      response {
        message
        errorCode
        dealerName
        dealerCode
        orderType
        rejectReasonCode
        orderCreatedBy
        status
        distributorCode
        orderNumber
        dealerEVD
        transStatus
        tslOrderSource
        orderDate
        transMessage
        orderDetails
      }
    }
  }
`;

export const asmAsiTrackRequest = gql`
  mutation AsmAsiTrackRequest($input: asmAsiTrackRequestInput) {
    asmAsiTrackRequest(input: $input) {
      status
      message
      response {
        dealer_name
        dealer_evd
        dealer_ph_num
        dsr_name
        dsr_evd
        dsr_ph_num
        assoc_dist_name
        assoc_dist_evd
        assoc_dist_ph_num
        distributor_sap
        distributor_name
        distributor_ph_num
        asi_name
        asi_ph_num
        asm_name
        asm_ph_num
      }
    }
  }
`;
