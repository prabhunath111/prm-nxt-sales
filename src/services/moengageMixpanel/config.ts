const CommonAttributes = {
  Status: 'Status',
};
const SubscriberAttributes = {
  ...CommonAttributes,
  SubscriberID: 'Subscriber_Id',
};
const SubscriberAttributesRMN = {
  ...SubscriberAttributes,
  Subscriber_RMN: 'Subscriber_RMN',
};
const SubscriberRMN = {
  ...CommonAttributes,
  RMN: 'RMN',
};
const formAttributes = {
  ...CommonAttributes,
  FormName: 'Form_Name',
};
const TSRAProceedAttributes = {
  InstallerType: 'installerType',
  PartnerCode: 'partnerCode',
  PartnerStatus: 'partnerStatus',
  Status: 'status',
  TsraFlag: 'tsraFlag',
};

export const MoengageMixpanelModules = {
  HeavyRefresh: {
    pageVisit: {
      moduleName: 'Heavy-Refresh-PageVisit',
      attributes: { Status: 'Status' },
    },
    multiSid: {
      moduleName: 'Heavy-Refresh-MultiSID',
      attributes: { Status: 'Status' },
    },
    proceed: {
      moduleName: 'Heavy-Refresh-Proceed',
      attributes: { Status: 'Status', Subscriber_SID: 'Subscriber_SID' },
    },
  },
  CustomerInformation: {
    CustomerInformationPageVisit: {
      moduleName: 'Customer_Information_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    CustomerInformationMultiSID: {
      moduleName: 'Customer_Information_MultiSID',
      attributes: { ...SubscriberAttributesRMN },
    },
    CustomerInformationDetails: {
      moduleName: 'Customer_Information_Details',
      attributes: { ...SubscriberAttributesRMN },
    },
    CustomerInformationLast5: {
      moduleName: 'Customer_Information_Last5',
      attributes: { ...SubscriberAttributesRMN, Transaction_ID: 'TransactionID' },
    },
    CustomerInformationRecharge: {
      moduleName: 'Customer_Information_Recharge',
      attributes: { ...CommonAttributes },
    },
  },
  FAQ: {
    FAQPageVisit: {
      moduleName: 'FAQ_PageVisit',
      attributes: { ...CommonAttributes },
    },
    FAQClick: {
      moduleName: 'FAQ_Click',
      attributes: { ...CommonAttributes, Link: 'Link' },
    },
  },
  PackageInformation: {
    pageVisit: {
      moduleName: 'Package-Information-PageVisit',
      attributes: { ...CommonAttributes },
    },
    PackageInformationClick: {
      moduleName: 'Package-Information-Click',
      attributes: { ...CommonAttributes, LinkName: 'Link_Name' },
    },
  },
  ChangeEVDPin: {
    pageVisit: {
      moduleName: 'Change-EVD-Pin-PageVisit',
      attributes: { Status: 'Status' },
    },
    ChangeEVDPinSubmit: {
      moduleName: 'Change-EVD-Pin-Submit',
      attributes: { Status: 'Status', Success: 'Success' },
    },
  },
  RMNUpdate: {
    RMNUpdatePageVisit: {
      moduleName: 'RMN_Update_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    RMNUpdateValidateIDMultiSID: {
      moduleName: 'RMN_Update_Multi_SID',
      attributes: { ...SubscriberRMN },
    },
    RMNUpdateValidateID: {
      moduleName: 'RMN_Update_Validate_ID',
      attributes: { ...SubscriberRMN },
    },
    RMNUpdateProceed: {
      moduleName: 'RMN_Update_Proceed',
      attributes: { Status: 'Status', OldRMN: 'OldRMN', newRMN: 'NewRMN' },
    },
  },
  TSKRefund: {
    TSKRefundPageVisit: {
      moduleName: 'TSK-Refund-PageVisit',
      attributes: { ...CommonAttributes },
    },
    TSKRefundTSKEligible: {
      moduleName: 'TSK-Refund-TSKEligible',
      attributes: {
        ...SubscriberAttributes,
        Eligible: 'Eligible',
      },
    },
    TSKRefundProceed: {
      moduleName: 'TSK-Refund-Proceed',
      attributes: { ...SubscriberAttributes },
    },
  },
  CustomerService: {
    CustomerServicePageVisit: {
      moduleName: 'Customer-Service-PageVisit',
      attributes: { ...CommonAttributes },
    },
    CustomerServiceRaiseRequestValidateID: {
      moduleName: 'Customer-Service-Raise-Request-ValidateID',
      attributes: { ...SubscriberAttributes },
    },
    CustomerServiceRaiseRequestGetSlot: {
      moduleName: 'Customer-Service-Raise-Request-Get-Slot',
      attributes: { ...SubscriberAttributes, NatureOfRequest: 'Nature_Of_Request', RequestType: 'Request_Type' },
    },
    CustomerServiceRaiseRequestProceed: {
      moduleName: 'Customer-Service-Raise-Request-Proceed',
      attributes: { ...SubscriberAttributes, NatureOfRequest: 'Nature_Of_Request', RequestType: 'Request_Type', TicketID: 'Ticket_ID ' },
    },
    CustomerServiceTrackRequest: {
      moduleName: 'Customer-Service-Track-Request',
      attributes: { ...CommonAttributes },
    },
    CustomerServiceTrackRequestProceed: {
      moduleName: 'Customer-Service-Track-Request-Proceed',
      attributes: { ...SubscriberAttributes },
    },
  },
  RechargeReversal: {
    RechargeReversalPageVisit: {
      moduleName: 'Recharge_Reversal_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    RechargeReversalLast20: {
      moduleName: 'Recharge_Reversal_Last20',
      attributes: { ...CommonAttributes },
    },
    RechargeReversalDetails: {
      moduleName: 'Recharge-Reversal-Details',
      attributes: { TransactionID: 'Transaction_ID ', ...SubscriberAttributes, ReversalReason: 'Reversal_Reason' },
    },
    RechargeReversalProceed: {
      moduleName: 'Recharge_Reversal_Proceed',
      attributes: { ...CommonAttributes },
    },
    RechargeReversalProcessing: {
      moduleName: 'Recharge-Reversal-Processing',
      attributes: { ReversalAmount: 'Reversal_Amount', SubscriberID: 'Subscriber_ID' },
    },
    RechargeReversalSuccess: {
      moduleName: 'RechargeReversalSuccess',
      attributes: { ReversalAmount: 'Reversal_Amount', SubscriberID: 'Subscriber_ID' },
    },
  },
  customerRecharge: {
    CustomerRechargePageVisit: {
      moduleName: 'customer_Recharge_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    CustomerRechargeMultiSID: {
      moduleName: 'Customer-Recharge-MultiSID',
      attributes: { ...SubscriberAttributesRMN },
    },
    CustomerRechargeProceed: {
      moduleName: 'Customer-Recharge-Proceed',
      attributes: {
        ...SubscriberAttributesRMN,
        Amount: 'Amount',
        Pack: 'Pack',
        Recommended_Monthly_Recharge: 'Recommended-Monthly-Recharge',
      },
    },
    CustomerRechargeValidate: {
      moduleName: 'Customer-Recharge-Validate',
      attributes: { ...SubscriberAttributesRMN, Recommended_Monthly_Recharge: 'Recommended-Monthly-Recharge' },
    },
  },
  eTSKRegistration: {
    ETSKRegistration_PageVisit: {
      moduleName: 'ETSKRegistration_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ValidatePin: {
      moduleName: 'validatePin',
      attributes: { ...CommonAttributes, pincode: 'pincode', userName: 'userName' },
    },
    ETSKRegistration_ConnectionProceed: {
      moduleName: 'ETSKRegistration_ConnectionProceed',
      attributes: {
        ...SubscriberAttributes,
        boxType: 'boxType',
        secondary_One_BoxType: 'secondary_One_BoxType',
        secondary_Three_BoxType: 'secondary_Three_BoxType',
        secondary_Two_BoxType: 'secondary_Two_BoxType',
        bookingFormNumber: 'bookingFormNumber',
        etskSelectedOffer: 'etskSelectedOffer',
        packPriceFe: 'packPriceFe',
        selectedPcaksTogetRentalUniqueArray: 'selectedPcaksTogetRentalUniqueArray',
      },
    },
    ETSKRegistration_ConnectionProceedConfirmationPage_Visit: { moduleName: 'ETSKRegistration_ConnectionProceedConfirmationPage_Visit', attributes: { ...CommonAttributes } },
    ETSKRegistration_ConnectionProceedConfirmationPage: {
      moduleName: 'ETSKRegistration_ConnectionProceedConfirmationPage',
      attributes: {
        ...SubscriberAttributes,
        UserName: 'UserName',
        bingeSelected: 'bingeSelected',
        bookingFormNumber: 'bookingFormNumber',
        etskSelectedOffer: 'etskSelectedOffer',
        flexiFlag: 'flexiFlag',
        multiTVArr: 'multiTVArr',
        ocsFlag: 'ocsFlag',
        rechargeAmount: 'rechargeAmount',
        rechargeEvdPin: 'rechargeEvdPin',
        requiredRechargeAmount: 'requiredRechargeAmount',
        selectedAllPacksCategoryETSKBE: 'selectedAllPacksCategoryETSKBE',
        selectedPacksArray: 'selectedPacksArray',
        slotSelection: 'slotSelection',
        taskId: 'taskId',
        userEvdID: 'userEvdID',
      },
    },
  },

  PrimaryRegistration: {
    PrimaryRegistrationPageVisit: {
      moduleName: 'Primary_Registration_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    PrimaryRegistrationValidateTSK: {
      moduleName: 'PrimaryRegistration_ValidateTSK',
      attributes: { pincode: 'pincode', parimaryTSKPin: 'parimaryTSKPin', ...CommonAttributes },
    },
    PrimaryRegistrationConnectionProceed: {
      moduleName: 'PrimaryRegistration_ConnectionProceed',
      attributes: { pincode: 'pincode', parimaryTSKPin: 'parimaryTSKPin', primaryBoxType: 'primaryBoxType', ...CommonAttributes },
    },
    PrimaryRegistrationCustomerdetailsProceed: {
      moduleName: 'PrimaryRegistration_CustomerdetailsProceed',
      attributes: { ...SubscriberAttributesRMN, Recommended_Monthly_Recharge: 'Recommended-Monthly-Recharge', input: 'input' },
    },
    PrimaryRegistrationPickPackProceed: {
      moduleName: 'PrimaryRegistration_PickPackProceed',
      attributes: { ...SubscriberAttributesRMN, Recommended_Monthly_Recharge: 'Recommended-Monthly-Recharge', variables: 'variables' },
    },
    PrimaryRegistrationSummaryProceed: {
      moduleName: 'PrimaryRegistration_SummaryProceed',
      attributes: {
        ...SubscriberAttributesRMN,
        Recommended_Monthly_Recharge: 'Recommended-Monthly-Recharge',
        packageName: 'packageName',
        rechargeAmount: 'rechargeAmount',
        requiredRechargeAmount: 'requiredRechargeAmount',
      },
    },
    PrimaryRegistrationDownloadInvoice: {
      moduleName: 'PrimaryRegistration_DownloadInvoice',
      attributes: { ...SubscriberAttributesRMN, Recommended_Monthly_Recharge: 'Recommended-Monthly-Recharge', transactionId: 'transactionId' },
    },
  },
  customerInvoice: {
    customerInvoice_PageVisit: {
      moduleName: 'customerInvoice_PageVisit',
      attributes: { ...CommonAttributes },
    },
    GetInvoiceByTransactionID: {
      moduleName: 'GetInvoiceByTransactionID',
      attributes: { ...SubscriberAttributes, transactionId: 'transactionId' },
    },
    GetInvoiceBySubscriberID: {
      moduleName: 'GetInvoiceBySubscriberID',
      attributes: {
        ...SubscriberAttributes,
        transactionId: 'transactionId',
        amount: 'amount',
        transactionDate: 'transactionDate',
        bingeRechargeFlag: 'bingeRechargeFlag',
      },
    },
  },
  resetEVDPin: {
    resetEVDPin_PageVisit: {
      moduleName: 'resetEVDPin_PageVisit',
      attributes: { ...CommonAttributes },
    },
    resetEVDPin_ForSelf: {
      moduleName: 'resetEVDPin_ForSelf',
      attributes: { ...CommonAttributes },
    },
    resetEVDPin_ForPartner: {
      moduleName: 'resetEVDPin_ForPartner',
      attributes: {
        ...CommonAttributes,
        partnerMdn: 'partnerMdn',
      },
    },
  },
  demoBoxDetail: {
    DemoBoxDetail_PageVisit: {
      moduleName: 'DemoBoxDetail_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DemoBoxDetail: {
      moduleName: 'DemoBoxDetail',
      attributes: {
        ...CommonAttributes,
        subscriberID: 'Subscriber ID',
        evdCode: 'EVD Code',
        mdn: 'MDN',
      },
    },
  },
  evdTransfer: {
    EVD_Transfer_PageVisit: {
      moduleName: 'EVD_Transfer_PageVisit',
      attributes: { ...CommonAttributes },
    },
    EVD_Transfer: {
      moduleName: 'EVD_Transfer',
      attributes: {
        ...CommonAttributes,
        amount: 'amount',
        childMdn: 'childMdn',
        childName: 'childName',
        typeOfTransfer: 'type of tranfer',
      },
    },
  },
  rechargeWinback: {
    Winback_PageVisit: {
      moduleName: 'Winback_PageVisit',
      attributes: { ...CommonAttributes },
    },
    Winback_SelectCampaign: {
      moduleName: 'Winback_SelectCampaign',
      attributes: {
        ...CommonAttributes,
        winBackCategory: 'winBackCategory',
      },
    },
    Winback_SelectSubid: {
      moduleName: 'Winback_SelectSubid',
      attributes: {
        ...CommonAttributes,
        subscriberId: 'subscriberId',
      },
    },
    Winback_CallSubscriber: {
      moduleName: 'Winback_CallSubscriber',
      attributes: {
        ...CommonAttributes,
        mobileNumber: 'mobileNumber',
        subscriberId: 'subscriberId',
      },
    },
    Winback_Update: {
      moduleName: 'Winback_Update',
      attributes: {
        ...CommonAttributes,
        subscriberId: 'subscriberId',
        campaignCode: 'campaignCode',
        offerCode: 'offerCode',
        rmn: 'rmn',
        treatmentCode: 'treatmentCode',
        comment: 'comment',
      },
    },
    Winback_Recharge: {
      moduleName: 'Winback_Recharge',
      attributes: {
        ...CommonAttributes,
        amount: 'amount',
        pin: 'pin',
        subscriberInfo: 'subscriberInfo',
        tskNumber: 'tskNumber',
      },
    },
    Winback_DownloadInvoice: {
      moduleName: 'Winback_DownloadInvoice',
      attributes: {
        ...CommonAttributes,
        transactionId: 'transactionId',
      },
    },
  },
  tsraInventory: {
    TSRAInventory_PageVisit: {
      moduleName: 'TSRAInventory_PageVisit',
      attributes: { ...CommonAttributes },
    },
    TSRAInventory_Configure: {
      moduleName: 'TSRAInventory_Configure',
      attributes: {
        ...CommonAttributes,
        formName: 'formName',
      },
    },
  },
  autoEVDTransfer: {
    AutoEVDTransfer_Page_Visit: {
      moduleName: 'AutoEVDTransfer_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    Update_Auto_EVD_Transfer_Page_Visit: {
      moduleName: 'Update_Auto_EVD_Transfer_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    Update_Auto_EVD_Transfer: {
      moduleName: 'Update_Auto_EVD_Transfer',
      attributes: {
        ...CommonAttributes,
        thresholdLimitValue: 'Threshold limit value',
        autoEVDTransferAmount: 'Auto EVD transfer amount',
      },
    },
  },
  RepushOrder: {
    RepushOrderPageVisit: {
      moduleName: 'RepushOrder_PageVisit',
      attributes: { ...CommonAttributes },
    },
    RepushOrderValidateTSK: {
      moduleName: 'RepushOrder_ValidateTSK',
      attributes: {
        userName: 'userName',
        TSKPin: 'TSKPin',
        TSKPin1: 'TSKPin1',
        TSKPin2: 'TSKPin2',
        TSKPin3: 'TSKPin3',
      },
    },
    RepushOrderPickPackProceed: {
      moduleName: 'RepushOrder_PickPackProceed',
      attributes: { variables: 'variables', ...CommonAttributes },
    },
    RepushOrderSummaryProceed: {
      moduleName: 'RepushOrder_SummaryProceed',
      attributes: {
        ...CommonAttributes,
        subscriberId: 'subscriberId',
        packageName: 'packagename',
        rechargeAmount: 'rechargeAmount',
        requiredRechargeAmount: 'requiredRechargeAmount',
      },
    },
    RepushOrderDownloadInvoice: {
      moduleName: 'RepushOrder_DownloadInvoice',
      attributes: { ...CommonAttributes, transactionId: 'transactionId' },
    },
  },
  ActivationStatus: {
    ActivationStatusPageVisit: {
      moduleName: 'ActivationStatus_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ActivationStatusSubIDRMNProceed: {
      moduleName: 'ActivationStatus_SubID/RMN_Proceed',
      attributes: {
        evdId: 'evdId',
        rmn: 'rmn',
        subscriberId: 'subscriberId',
      },
    },
    ActivationStatusPackageInformation: {
      moduleName: 'ActivationStatus_PackageInformation',
      attributes: { ...SubscriberAttributes },
    },
    ActivationStatusWODetails: {
      moduleName: 'ActivationStatus_WODetails',
      attributes: { ...SubscriberAttributes },
    },
    ActivationStatusUpgradeWoDetails: {
      moduleName: 'ActivationStatus_UpgradeWoDetails',
      attributes: { ...SubscriberAttributes },
    },
    ActivationStatusOtherDetails: {
      moduleName: 'ActivationStatus_OtherDetails',
      attributes: { ...SubscriberAttributes },
    },
    ActivationStatusRechargeTransactions: {
      moduleName: 'ActivationStatus_RechargeTransactions',
      attributes: { ...SubscriberAttributes },
    },
    ActivationStatusRechargeReversal: {
      moduleName: 'ActivationStatus_RechargeReversal',
      attributes: { transactionInfo: 'transactionInfo', ...SubscriberAttributes },
    },
  },
  DealerStock: {
    DealerStockPageVisit: {
      moduleName: 'DealerStock_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DealerStockEVDDealerIDMDNProceed: {
      moduleName: 'DealerStock_EVDDealerID/MDN_Proceed',
      attributes: { ...CommonAttributes, iD: 'iD' },
    },
    DealerStockChangeDealer: {
      moduleName: 'DealerStock_ChangeDealer',
      attributes: { ...CommonAttributes, formName: 'formName' },
    },
    DealerStockConfigureApply: {
      moduleName: 'DealerStock_ConfigureApply',
      attributes: { ...CommonAttributes, formName: 'formName' },
    },
  },
  TSKVoucher: {
    TSKVoucherPageVisit: {
      moduleName: 'TSKVoucher_PageVisit',
      attributes: { ...CommonAttributes },
    },
    TSKVoucherTSKNoProceed: {
      moduleName: 'TSKVoucher_TSKNo_Proceed',
      attributes: { ...CommonAttributes, iD: 'iD' },
    },
  },
  MultiTVRegistration: {
    MultiTVRegistrationPageVisit: {
      moduleName: 'MultiRegistration_PageVisit',
      attributes: { ...CommonAttributes },
    },
    MultiTVRegistrationValidateTSK: {
      moduleName: 'MultiRegistration_ValidateTSK',
      attributes: { ...SubscriberAttributes, tskPin: 'tskPin', boxType: 'boxType' },
    },
    MultiTVRegistrationSummaryProceed: {
      moduleName: 'MultiTVRegistration_SummaryProceed',
      attributes: {
        ...SubscriberAttributes,
        packageName: 'packageName',
        rechargeAmount: 'rechargeAmount',
        assetNo: 'assetNo',
        requiredRechargeAmount: 'requiredRechargeAmount',
        boxType: 'boxType',
      },
    },
    MultiTVRegistrationDownloadInvoice: {
      moduleName: 'MultiTVRegistration_DownloadInvoice',
      attributes: {
        transactionId: 'transactionId',
        ...CommonAttributes,
      },
    },
  },
  BoxUpgrade: {
    BoxUpgrade_PageVisit: {
      moduleName: 'BoxUpgrade_PageVisit',
      attributes: { ...CommonAttributes },
    },
    BoxUpgradeBoxselectionProceed: {
      moduleName: 'BoxUpgrade_BoxselectionProceed',
      attributes: { ...SubscriberAttributes, vcNumber: 'vcNumber' },
    },
    BoxUpgradeChangeBoxType: {
      moduleName: 'BoxUpgrade_ChangeBoxType',
      attributes: { ...CommonAttributes },
    },
    BoxUpgradeRechargeConfirm: {
      moduleName: 'BoxUpgrade_RechargeConfirm',
      attributes: { ...CommonAttributes, details: 'details' },
    },
    BoxUpgradeDownloadInvoice: {
      moduleName: 'BoxUpgrade_DownloadInvoice',
      attributes: { ...CommonAttributes, transactionId: 'transactionId' },
    },
  },
  ModifyPack: {
    ModifyPackPageVisit: {
      moduleName: 'ModifyPack_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ModifyPack_Proceed: {
      moduleName: 'ModifyPack_Proceed',
      attributes: { ...SubscriberAttributes },
    },
  },
  CompetitorDataCapture: {
    CompetitorDataCapturePageVisit: {
      moduleName: 'CompetitorDataCapture_PageVisit',
      attributes: { ...CommonAttributes },
    },
    CompetitorDataCaptureValidateEVDRMN: {
      moduleName: 'CompetitorDataCapture_ValidateEVDRMN',
      attributes: { ...CommonAttributes, iD: 'iD' },
    },
    CompetitorDataCaptureChangeDealer: {
      moduleName: 'CompetitorDataCapture_ChangeDealer',
      attributes: { ...CommonAttributes, iD: 'iD' },
    },
    CompetitorDataCaptureSubmit: {
      moduleName: 'CompetitorDataCapture_Submit',
      attributes: { ...CommonAttributes, details: 'details' },
    },
  },
  ExclusiveStore: {
    ExclusiveStorePageVisit: {
      moduleName: 'ExclusiveStore_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ExclusiveStoreStoreOpen: {
      moduleName: 'ExclusiveStore_StoreOpen',
      attributes: { ...CommonAttributes, storeOpen: 'storeOpen' },
    },
    ExclusiveStoreStoreClose: {
      moduleName: 'ExclusiveStore_StoreClose',
      attributes: { ...CommonAttributes, storeClose: 'storeClose' },
    },
    ExclusiveStoreWalkInDetailsPageVisit: {
      moduleName: 'ExclusiveStore_WalkInDetailsPageVisit',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreWalkInDetailsPageProceed: {
      moduleName: 'ExclusiveStore_Walk-InDetailsPageProceed',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreOverThePhoneDetailsPageVisit: {
      moduleName: 'ExclusiveStore_OverThePhoneDetailsPageVisit',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreOverThePhoneDetailsPageProceed: {
      moduleName: 'ExclusiveStore_OverThePhoneDetailsPageProceed',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreTeleCallingDetailsPageVisit: {
      moduleName: 'ExclusiveStore_TeleCallingDetailsPageVisit',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreTeleCallingDetailsPageProceed: {
      moduleName: 'ExclusiveStore_TeleCallingDetailsPageProceed',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreOutBoundDetailsPageVisit: {
      moduleName: 'ExclusiveStore_OutBoundDetailsPageVisit',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreOutBoundDetailsProceed: {
      moduleName: 'ExclusiveStore_OutBoundDetailsProceed',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreSpecialCommentsPageVisit: {
      moduleName: 'ExclusiveStore_SpecialCommentsPageVisit',
      attributes: { ...formAttributes },
    },
    ExclusiveStoreSpecialCommentsProceed: {
      moduleName: 'ExclusiveStore_SpecialCommentsProceed',
      attributes: { ...CommonAttributes, modName: 'modName', partnerId: 'partnerId', reason: 'reason', remarks: 'remarks' },
    },
  },
  StoreDashboard: {
    StoreDashboardPageVisit: {
      moduleName: 'StoreDashboard_PageVisit',
      attributes: { ...CommonAttributes },
    },
    StoreDashboardValidateRMN: {
      moduleName: 'StoreDashboard_ValidateRMN',
      attributes: { ...CommonAttributes, dealerID: 'dealerID' },
    },
    StoreDashboardChangeDistributor: {
      moduleName: 'StoreDashboard_ChangeDistributor',
      attributes: { ...CommonAttributes, dealerID: 'dealerID' },
    },
    StoreDashboardStoreOpen: {
      moduleName: 'StoreDashboard_StoreOpen',
      attributes: { ...CommonAttributes, storeOpen: 'storeOpen', date: 'date', iD: 'iD', dealerId: 'dealerId' },
    },
    StoreDashboardStoreClose: {
      moduleName: 'StoreDashboard_StoreClose',
      attributes: { ...CommonAttributes, storeClose: 'storeClose', date: 'date', iD: 'iD', dealerId: 'dealerId' },
    },
    StoreDashboardStoreOperationalChecklist: {
      moduleName: 'StoreDashboard_StoreOperationalChecklist',
      attributes: { ...CommonAttributes, year: 'year', month: 'month', id: 'id', dealerId: 'dealerId' },
    },
  },
  Quotation: {
    QuotePageVisit: {
      moduleName: 'Quote_PageVisit',
      attributes: { ...CommonAttributes },
    },
    QuoteTypeofRegistrationProceed: {
      moduleName: 'Quote_TypeofRegistrationProceed',
      attributes: { ...CommonAttributes, formName: 'formName' },
    },
    QuoteValidatePincode: {
      moduleName: 'Quote_ValidatePincode',
      attributes: { ...CommonAttributes, pincode: 'pincode' },
    },
    QuoteConnectionProceed: {
      moduleName: 'Quote_ConnectionProceed',
      attributes: { ...CommonAttributes, boxType: 'boxType', priTSKType: 'priTSKType', noOfBoxes: 'noOfBoxes', state: 'state', das: 'das' },
    },
    QuotePickPackProceed: {
      moduleName: 'Quote_PickPackProceed',
      attributes: { ...SubscriberAttributes, boxType: 'boxType', tskPin: 'tskPin', pincode: 'pincode', tskSerialNumber: 'tskSerialNumber' },
    },
    QuoteProceedRegistration: {
      moduleName: 'Quote_ProceedRegistration',
      attributes: { ...CommonAttributes },
    },
    QuoteSendQuotation: {
      moduleName: 'Quote_SendQuotation',
      attributes: { ...CommonAttributes, mobileNumber: 'mobileNumber' },
    },
    QuoteSubmitOTP: {
      moduleName: 'Quote_SubmitOTP',
      attributes: { ...CommonAttributes, partnerMDN: 'partnerMDN', otp: 'otp' },
    },
  },
  ETSMultiTV: {
    ETSKMultiPageVisit: {
      moduleName: 'ETSKMulti_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ETSKMultiTVPageVisit: {
      moduleName: 'ETSKMultiTV_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ETSKMultiRepushPageVisit: {
      moduleName: 'ETSKMultiRepush_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ETSKMultiRepushSUBIDRMNProceed: {
      moduleName: 'ETSKMultiRepush_SUBIDRMNProceed',
      attributes: { ...SubscriberAttributes, userName: 'userName' },
    },
    ETSKMultiSUBIDRMNProceed: {
      moduleName: 'ETSKMulti_SUBIDRMNProceed',
      attributes: { ...SubscriberAttributes, userName: 'userName' },
    },
    ETSKMultiBoxtypeSelectionProceed: {
      moduleName: 'ETSKMulti_BoxtypeSelection_Proceed',
      attributes: { ...SubscriberAttributes, boxType: 'boxType', etskMulSelOfr: 'etskMulSelOfr', bingeplusSelectedpacks: 'bingeplusSelectedpacks' },
    },
    ETSKMultiSummaryProceed: {
      moduleName: 'ETSKMulti_SummaryProceed',
      attributes: { ...CommonAttributes },
    },
    ETSKMultiRechargeConfirm: {
      moduleName: 'ETSKMulti_RechargeConfirm',
      attributes: {
        ...SubscriberAttributes,
        boxType: 'boxType',
        dhamakaMulRechBalChk: 'dhamakaMulRechBalChk',
        etskSelectedOffer: 'etskSelectedOffer',
        ocsFlag: 'ocsFlag',
        rechargeAmount: 'rechargeAmount',
        rechargeEvdPin: 'rechargeEvdPin',
        requiredRechargeAmount: 'requiredRechargeAmount',
      },
    },
  },
  WorkOrderRecreation: {
    WorkOrderRecreationPageVisit: {
      moduleName: 'WorkOrderRecreation_PageVisit',
      attributes: { ...CommonAttributes },
    },
    WorkorderRecreationRecreateWO: {
      moduleName: 'WorkorderRecreation_RecreateWO',
      attributes: {
        ...SubscriberAttributes,
        tskPin: 'tskPin',
        type: 'type',
        channel: 'channel',
        outlet: 'outlet',
      },
    },
    WorkorderRecreationPickPackProceed: {
      moduleName: 'WorkorderRecreation_PickPackProceed',
      attributes: {
        ...SubscriberAttributes,
        boxType: 'boxTypebox',
        packPriceFe: 'packPriceFe',
        selectedPacksTogetRentalUniqueArray: 'selectedPacksTogetRentalUniqueArray',
        tskPin: 'tskPin',
        tskSerialNumber: 'tskSerialNumber',
      },
    },
    WorkorderRecreationSummaryProceed: {
      moduleName: 'WorkorderRecreation_SummaryProceed',
      attributes: { ...CommonAttributes },
    },
    WorkorderRecreationRechargeConfirm: {
      moduleName: 'WorkorderRecreation_RechargeConfirm',
      attributes: {
        ...SubscriberAttributes,
        taskId: 'taskId',
        tskSerialNumber: 'tskSerialNumber',
        finalValidatedPacksArray: 'finalValidatedPacksArray',
        selectedPackAndCategoriesArray: 'selectedPackAndCategoriesArray',
        rechargeAmount: 'rechargeAmount',
        requiredRechargeAmount: 'requiredRechargeAmount',
        rechargeEvdPin: 'rechargeEvdPin',
      },
    },
  },
  TsraApproval: {
    TSRA_ApprovalPageVisit: {
      moduleName: 'TSRA_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ActionTSRARequest_PageVisit: {
      moduleName: 'ActionTSRARequest_PageVisit',
      attributes: { ...CommonAttributes, Role: 'role', UserId: 'userId' },
    },
    ActionTSRARequest_Reject: {
      moduleName: 'ActionTSRARequest_Reject',
      attributes: { ...CommonAttributes },
    },
    ActionTSRARequest_RejectProceed: {
      moduleName: 'ActionTSRARequest_RejectProceed',
      attributes: { ...TSRAProceedAttributes },
    },
    ActionTSRARequest_Approve: {
      moduleName: 'ActionTSRARequest_Approve',
      attributes: { ...CommonAttributes },
    },
    ActionTSRARequest_ApproveProceed: {
      moduleName: 'ActionTSRARequest_ApproveProceed',
      attributes: { ...TSRAProceedAttributes },
    },
    TSRA_ApprovalSuccess_PageVisit: {
      moduleName: 'TSRA_ApprovalSuccess_PageVisit',
      attributes: { ...CommonAttributes },
    },
    TrackTSRARequest_PageVisit: {
      moduleName: 'TrackTSRARequest_PageVisit',
      attributes: { ...CommonAttributes, Role: 'role', UserId: 'userId', Days: 'days' },
    },
  },
  PartnerApproval: {
    PartnerApproval_PageVisit: {
      moduleName: 'PartnerApproval_PageVisit',
      attributes: { ...CommonAttributes },
    },
    ActionPartnerRequest_PageVisit: {
      moduleName: 'ActionPartnerRequest_PageVisit',
      attributes: {
        ...CommonAttributes,
        Role: 'role',
        UserId: 'userId',
        AsiCode: 'asiCode',
        DirectDis: 'directDis',
        FetchAllData: 'fetchAllData',
        NoFosRequestunderDirectAsi: 'noFosRequestunderDirectAsi',
      },
    },
    PartnerApproval_Reject: {
      moduleName: 'PartnerApproval_Reject',
      attributes: { ...CommonAttributes },
    },
    PartnerApproval_Reject_SubmitReason: {
      moduleName: 'PartnerApproval_Reject_SubmitReason',
      attributes: { ...CommonAttributes, Remarks: 'remarks', UserId: 'userId', PartnerStatus: 'partnerStatus' },
    },
    PartnerApproval_Approve: {
      moduleName: 'PartnerApproval_Approve',
      attributes: { ...CommonAttributes, Remarks: 'remarks', UserId: 'userId', PartnerStatus: 'partnerStatus' },
    },
    TrackPartnerRequest_PageVisit: {
      moduleName: 'TrackPartnerRequest_PageVisit',
      attributes: { ...CommonAttributes, Role: 'role', UserId: 'userId', AsiCode: 'asiCode', DirectDis: 'directDis', FetchAllData: 'fetchAllData' },
    },
  },
  BoxTypeChange: {
    BoxTypeChange_PageVisit: {
      moduleName: 'BoxTypeChange_PageVisit',
      attributes: { ...CommonAttributes },
    },
    BoxTypeChange_ValidateSubID: {
      moduleName: 'BoxTypeChange_ValidateSubID',
      attributes: { ...SubscriberAttributes, tskPin1: 'tskPin1' },
    },
    BoxTypeChange_WOcancellationConfirm: {
      moduleName: 'BoxTypeChange_WOcancellationConfirm',
      attributes: { ...SubscriberAttributes, woSalesType: 'woSalesType', woSubType: 'woSubType', woType: 'woType', workOrderNo: 'workOrderNo' },
    },
    BoxTypeChange_CheckWOStatus: {
      moduleName: 'BoxTypeChange_CheckWOStatus',
      attributes: { ...SubscriberAttributes, vcNumber: 'vcNumber', tskPin1: 'tskPin1' },
    },
    BoxTypeChange_ChangeBox: {
      moduleName: 'BoxTypeChange_ChangeBox',
      attributes: { ...SubscriberAttributes, newTSKType: 'newTSKType', salesOrderNum: 'salesOrderNum', tskSerialNumber: 'tskSerialNumber' },
    },
    BoxTypeChange_PickPack: {
      moduleName: 'BoxTypeChange_PickPack',
      attributes: {
        ...SubscriberAttributes,
        tskPin: 'tskPin',
        userName: 'userName',
        roleId: 'roleId',
      },
    },
    BoxTypeChange_SelectPackCategory: {
      moduleName: 'BoxTypeChange_SelectPackCategory',
      attributes: { ...CommonAttributes, boxType: 'boxType', category: 'category' },
    },
    BoxTypeChange_PickPackProceed: {
      moduleName: 'BoxTypeChange_PickPackProceed',
      attributes: {
        ...SubscriberAttributes,
        boxType: 'boxType',
        packPriceFe: 'packPriceFe',
        selectedPacksTogetRentalUniqueArray: 'selectedPacksTogetRentalUniqueArray',
        tskSerialNumber: 'tskSerialNumber',
        tskPin: 'tskPin',
      },
    },
    BoxTypeChange_ViewDetails: {
      moduleName: 'BoxTypeChange_ViewDetails',
      attributes: { ...CommonAttributes, offerName: 'offerName', packPrice: 'packPrice' },
    },
    BoxTypeChange_SummaryProceed: {
      moduleName: 'BoxTypeChange_SummaryProceed',
      attributes: {
        ...SubscriberAttributes,
        boxType: 'boxType',
        packPriceFe: 'packPriceFe',
        selectedPacksTogetRentalUniqueArray: 'selectedPacksTogetRentalUniqueArray',
        tskSerialNumber: 'tskSerialNumber',
        tskPin: 'tskPin',
      },
    },
    BoxTypeChange_RechargeConfirm: {
      moduleName: 'BoxTypeChange_RechargeConfirm',
      attributes: {
        ...SubscriberAttributes,
        orderId: 'orderId',
        rechargeAmount: 'rechargeAmount',
        rechargeEvdPin: 'rechargeEvdPin',
        requiredRechargeAmount: 'requiredRechargeAmount',
        selectedPackAndCategoriesArray: 'selectedPackAndCategoriesArray',
        tskSerialNumber: 'tskSerialNumber',
      },
    },
  },
  DemoAccountCreation: {
    DemoAccountRegistartion_PageVisit: {
      moduleName: 'DemoAccountRegistartion_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DemoAccountCreation_PageVisit: {
      moduleName: 'DemoAccountCreation_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DemoAccountCreation_ValidateDistributor_DealerCode: {
      moduleName: 'DemoAccountCreation_ValidateDistributor_DealerCode',
      attributes: { ...CommonAttributes, dealerId: 'dealerId' },
    },
    DemoAccountCreation_Tsk_Validation: {
      moduleName: 'DemoAccountCreation_Tsk_Validation',
      attributes: { ...CommonAttributes, TSKPin: 'TSKPin', dealerId: 'dealerId' },
    },
    DemoAccountCreation_Pickpack_PageVisit: {
      moduleName: 'DemoAccountCreation_Pickpack_PageVisit',
      attributes: { ...CommonAttributes, TSKPin: 'TSKPin', boxType: 'boxType' },
    },
    DemoAccountCreation_Pickpack_Proceed: {
      moduleName: 'DemoAccountCreation_Pickpack_Proceed',
      attributes: { ...SubscriberAttributes, dealerCodePrimary: 'dealerCodePrimary', tskSerialNumber: 'tskSerialNumber' },
    },
    DemoAccountCreation_Success_PageVisit: {
      moduleName: 'DemoAccountCreation_Success_PageVisit',
      attributes: { ...SubscriberAttributes, dealerCodePrimary: 'dealerCodePrimary', tskSerialNumber: 'tskSerialNumber' },
    },
    DemoAccountETSKRepush_PageVisit: {
      moduleName: 'DemoAccountETSKRepush_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DemoAccountETSKRepush_Validate: {
      moduleName: 'DemoAccountETSKRepush_Validate',
      attributes: { ...CommonAttributes, bookingFormNumber: 'bookingFormNumber' },
    },
    DemoAccountETSKRepushPickPack_PageVisit: {
      moduleName: 'DemoAccountETSKRepushPickPack_PageVisit',
      attributes: { ...CommonAttributes, bookingFormNumber: 'bookingFormNumber' },
    },
  },
  Login: {
    Login_PageVisit: {
      moduleName: 'Login_PageVisit',
      attributes: { ...CommonAttributes },
    },
    LoginPage_GetOTP: {
      moduleName: 'LoginPage_GetOTP',
      attributes: {
        ...CommonAttributes,
        mdn: 'mdn',
        isPrmLogin: 'isPrmLogin',
        deviceId: 'deviceId',
      },
    },
    LoginPage_ResendOtp: {
      moduleName: 'LoginPage_ResendOtp',
      attributes: { ...CommonAttributes, mdn: 'mdn', isPrmLogin: 'isPrmLogin' },
    },
    LoginPage_LoginWithOtp: {
      moduleName: 'LoginPage_LoginWithOtp',
      attributes: {
        ...CommonAttributes,
        mdn: 'mdn',
        isPrmLogin: 'isPrmLogin',
        deviceId: 'deviceId',
      },
    },
  },
  eTSK_Repush: {
    eTSKRepush_PageVisit: {
      moduleName: 'eTSKRepush_PageVisit',
      attributes: { ...CommonAttributes },
    },
    eTSKRepush_BookingFormNumberValidation: {
      moduleName: 'eTSKRepush_BookingFormNumberValidation',
      attributes: {
        ...CommonAttributes,
        bookingFormNumber: 'bookingFormNumber',
        userName: 'userName',
      },
    },
    eTSKRepush_PickPackPage: {
      moduleName: 'eTSKRepush_PickPackPage',
      attributes: {
        ...SubscriberAttributes,
        bookingFormNumber: 'bookingFormNumber',
        boxType: 'boxType',
        etskSelectedOffer: 'etskSelectedOffer',
      },
    },
    eTSKRepush_SummaryPageProceed: {
      moduleName: 'eTSKRepush_SummaryPageProceed',
      attributes: {
        ...SubscriberAttributes,
        bookingFormNumber: 'bookingFormNumber',
      },
    },
    eTSKRepush_RechargeConfirm: {
      moduleName: 'eTSKRepush_RechargeConfirm',
      attributes: {
        ...SubscriberAttributes,
        bingeSelected: 'bingeSelected',
        bookingFormNumber: 'bookingFormNumber',
        etskSelectedOffer: 'etskSelectedOffer',
        rechargeAmount: 'rechargeAmount',
        requiredRechargeAmount: 'requiredRechargeAmount',
      },
    },
    eTSKRepush_SuccessPage: {
      moduleName: 'eTSKRepush_SuccessPage',
      attributes: {
        ...CommonAttributes,
      },
    },
  },
  LiveNews: {
    LiveNewsCardClick: {
      moduleName: 'LiveNews-PlayContent',
      attributes: { ...CommonAttributes, contentId: 'contentId', contentType: 'contentType', contentTitle: 'contentTitle', genre: 'genre', language: 'language' },
    },
    LiveNewsFilterClick: {
      moduleName: 'News-Channel-Filter',
      attributes: { ...CommonAttributes, selectedFilter: 'Language-Name' },
    },
  },
  Manage_Hierarchy: {
    ViewNewDealer_PageVisit: {
      moduleName: 'ViewNewDealer_PageVisit',
      attributes: {
        ...CommonAttributes,
      },
    },
    CreateNewDealer_PageVisit: {
      moduleName: 'CreateNewDealer_PageVisit',
      attributes: {
        ...CommonAttributes,
      },
    },

    CreateChannelPartner_PageVisit: {
      moduleName: 'CreateChannelPartner_PageVisit',
      attributes: {
        ...CommonAttributes,
      },
    },
    CreateChannelPartner_Role: {
      moduleName: 'CreateChannelPartner_Role',
      attributes: {
        ...CommonAttributes,
        role: 'role',
      },
    },
    CreateChannelPartner_ValidatePincode: {
      moduleName: 'CreateChannelPartner_ValidatePincode',
      attributes: {
        ...CommonAttributes,
        pincode: 'pincode',
        distCircle: 'distCircle',
        partnerMdn: 'partnerMdn',
        mdn: 'mdn',
        partnerEmail: 'partnerEmail',
      },
    },
    CreateChannelPartner_Town_Locality: {
      moduleName: 'CreateChannelPartner_Town/Locality',
      attributes: {
        ...CommonAttributes,
        pincode: 'pincode',
        role: 'role',
        fosMdn: 'fosMdn',
        location: 'location',
      },
    },
    CreateChannelPartner_OutletType: {
      moduleName: 'CreateChannelPartner_OutletType',
      attributes: {
        ...CommonAttributes,
        pincode: 'pincode',
        distCircle: 'distCircle',
        townLocality: 'townLocality',
        outletType: 'outletType',
      },
    },
    CreateChannelPartner_OtpConfirmation: {
      moduleName: 'CreateChannelPartner_OtpConfirmation',
      attributes: {
        ...CommonAttributes,
        mobile: 'mobile',
      },
    },
    CreateChannelPartner_SubmitOtp: {
      moduleName: 'CreateChannelPartner_SubmitOtp',
      attributes: {
        ...CommonAttributes,
        otp: 'otp',
        partnerMdn: 'partnerMdn',
      },
    },
    CreateChannelPartner_SuccessPage: {
      moduleName: 'CreateChannelPartner_SuccessPage',
      attributes: {
        ...CommonAttributes,
        outletId: 'outletId',
        partnerRole: 'partnerRole',
        parentMdn: 'parentMdn',
        partnerName: 'partnerName',
        partnerMobileNumber: 'partnerMobileNumber',
      },
    },
    Manage_Hierarchy_ReportPartner_PageVisit: {
      moduleName: 'Manage_Hierarchy_ReportPartner_PageVisit',
      attributes: {
        ...CommonAttributes,
      },
    },
    Manage_Hierarchy_ReportPartner_Selection: {
      moduleName: 'Manage_Hierarchy_ReportPartner_Selection',
      attributes: {
        ...CommonAttributes,
        roleId: 'roleId',
      },
    },
    Manage_Hierarchy_ReportPartner_Download: {
      moduleName: 'Manage_Hierarchy_ReportPartner_Download',
      attributes: {
        ...CommonAttributes,
      },
    },
    Manage_Hierarchy_ViewAll_PageVisit: {
      moduleName: 'Manage_Hierarchy_ViewAll_PageVisit',
      attributes: {
        ...CommonAttributes,
      },
    },
    Manage_Hierarchy_ViewAll_ExportToExcel: {
      moduleName: 'Manage_Hierarchy_ViewAll_ExportToExcel',
      attributes: {
        ...CommonAttributes,
      },
    },
  },
  My_Offer: {
    MyOffer_PageVisit: {
      moduleName: 'MyOffer_PageVisit',
      attributes: { ...CommonAttributes },
    },
    MyOffer_Proceed: {
      moduleName: 'MyOffer_Proceed',
      attributes: { ...SubscriberAttributes, subId: 'subId' },
    },
  },
  EvdBalanceInfo: {
    Recharge_Trasnaction_page_Visit: {
      moduleName: 'Recharge_Trasnaction_page_Visit',
      attributes: { ...CommonAttributes },
    },
    otfCreditDetails_page_Visit: {
      moduleName: 'otfCreditDetails_page_Visit',
      attributes: { ...CommonAttributes },
    },
    balanceTransferDetails_Page_Visit: {
      moduleName: 'balanceTransferDetails_Page_Visit',
      attributes: { ...CommonAttributes },
    },
    ConsolidatedTransferDetails_Page_Visit: {
      moduleName: 'ConsolidatedTransferDetails_Page_Visit',
      attributes: { ...CommonAttributes },
    },
  },
  PurchaseOrder: {
    PurchaseOrder_PageVisit: {
      moduleName: 'PurchaseOrder_PageVisit',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_RaiseEVDRequest: {
      moduleName: 'PurchaseOrder_RaiseEVDRequest',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_TrackEVDRequest: {
      moduleName: 'PurchaseOrder_TrackEVDRequest',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_RaisePOSM: {
      moduleName: 'PurchaseOrder_RaisePOSM',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_TrackPOSM: {
      moduleName: 'PurchaseOrder_TrackPOSM',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_Actionaccept: {
      moduleName: 'PurchaseOrder_Actionaccept',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_Actionreject: {
      moduleName: 'PurchaseOrder_Actionreject',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_Settlements: {
      moduleName: 'PurchaseOrder_Settlements',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_Walletoptions: {
      moduleName: 'PurchaseOrder_Walletoptions',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_Addwallet: {
      moduleName: 'PurchaseOrder_Addwallet',
      attributes: { ...CommonAttributes },
    },
    PurchaseOrder_Deletewallet: {
      moduleName: 'PurchaseOrder_Deletewallet',
      attributes: { ...CommonAttributes },
    },
  },
  BingRetailer: {
    NewChangePack_PageVisit: {
      moduleName: 'NewChangePack_PageVisit',
      attributes: { ...SubscriberAttributes },
    },
    NewChangePack_RMNValidation: {
      moduleName: 'NewChangePack_RMNValidation',
      attributes: { ...CommonAttributes, rmn: 'rmn' },
    },
    Dashboard_PageVisit: {
      moduleName: 'Dashboard_PageVisit',
      attributes: { ...CommonAttributes },
    },
    Dashboard_DateSelectionSubmit: {
      moduleName: 'Dashboard_DateSelectionSubmit',
      attributes: { ...CommonAttributes },
    },
    TrainingModule_PageVisit: {
      moduleName: 'TrainingModule_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DealerHelp_PageVisit: {
      moduleName: 'DealerHelp_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DealerHelpRaiseRequest_PageVisit: {
      moduleName: 'DealerHelpRaiseRequest_PageVisit',
      attributes: { ...CommonAttributes },
    },
    DealerHelpRaiseRequest_Submit: {
      moduleName: 'DealerHelpRaiseRequest_Submit',
      attributes: { ...CommonAttributes },
    },
    DealerHelpTrackRequest_PageVisit: {
      moduleName: 'DealerHelpTrackRequest_PageVisit',
      attributes: { ...CommonAttributes },
    },
  },
};
