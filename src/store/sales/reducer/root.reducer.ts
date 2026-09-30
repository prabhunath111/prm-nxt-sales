import { persistReducer, createTransform } from 'redux-persist';
import { encryptedLocalStorage } from 'services/storageService/asyncStorageWrapper';
import { STRINGS } from 'const';
import { encryptedSessionStorage } from 'services/storageService/asyncStorageWrapper';
import evdMdnChangeReducer from './evdMdnChange/evdMdnChange.reducer';
import resetEvdPinReducer from './resetEvdPin/resetEvdPin.reducer';
import demoBoxDetailsReducer from './demoBoxDetails/demoBoxDetails.reducer';
import customerOffersReducer from './customerOffers/customerOffers.reducer';

/* REDUCER IMPORTS */
import liveNewsTvPageReducer from './liveNewsTvPage/liveNewsTvPage.reducer';
import dealerHelpReducer from './dealerHelp/dealerHelp.reducer';
import tskCancellationReducer from './tskCancellation/tskCancellation.reducer';
import purchaseOrderReducer from './purchaseOrder/purchaseOrder.reducer';
import tsraApprovalReducer from './tsraApproval/tsraApproval.reducer';
import tskVoucherReducer from './tskVoucher/tskVoucher.reducer';
import competitorDataCaptureReducer from './competitorDataCapture/competitorDataCapture.reducer';
import exclusiveStoreReducer from './exclusiveStore/exclusiveStore.reducer';
import homePageReducer from './homePage/homePage.reducer';
import notificationsReducer from './notifications/notifications.reducer';
import boxTypeChangeReducer from './boxTypeChange/boxTypeChange.reducer';
import quotationReducer from './quotation/quotation.reducer';
import demoAccountReducer from './demoAccount/demoAccount.reducer';
import modifyPackReducer from './modifyPack/modifyPack.reducer';
import partnerApprovalReducer from './partnerApproval/partnerApproval.reducer';
import evdBalanceInfoReducer from './evdBalanceInfo/evdBalanceInfo.reducer';
import multiTvRegistrationReducer from './multiTvRegistration/multiTvRegistration.reducer';
import activationStatusDetailsReducer from './activationStatusDetails/activationStatusDetails.reducer';
import activationStatusReducer from './activationStatus/activationStatus.reducer';
import etskRepushReducer from './etskRepush/etskRepush.reducer';
import storeDashboardReducer from './storeDashboard/storeDashboard.reducer';
import boxUpgradeReducer from './boxUpgrade/boxUpgrade.reducer';
import dealerStockReducer from './dealerStock/dealerStock.reducer';
import etskMultiTvReducer from './etskMultiTv/etskMultiTv.reducer';
import etskRegSchedularReducer from './etskRegSchedular/etskRegSchedular.reducer';
import woRecreationReducer from './woRecreation/woRecreation.reducer';
import primaryTvRegistrationReducer from './primaryTvRegistration/primaryTvRegistration.reducer';
import etskRegistrationReducer from './etskRegistration/etskRegistration.reducer';
import newDealerReducer from './newDealer/newDealer.reducer';
import manageHierarchyReducer from './manageHierarchy/manageHierarchy.reducer';
import fetchLanguageReducer from './fetchLanguage/fetchLanguage.reducer';
import dealerFeedbackReducer from './dealerFeedback/dealerFeedback.reducer';
import tsraInventoryReducer from './tsraInventory/tsraInventory.reducer';
import invoiceReducer from './invoice/invoice.reducer';
import tsraLifeCycleReducer from './tsraLifeCycle/tsraLifeCycle.reducer';
import evdTransferAsmReducer from './evdTransferAsm/evdTransferAsm.reducer';
import utilityReducer from './utility/utility.reducer';
import dashboardReducer from './dashboard/dashboard.reducer';
import autoEvdReducer from './autoEvd/autoEvd.reducer';
import rechargeWinbackReducer from './rechargeWinback/rechargeWinback.reducer';
import evdTransferReducer from './evdTransfer/evdTransfer.reducer';
import changeEvdPinReducer from './changeEvdPin/changeEvdPin.reducer';
import customerServiceReducer from './customerService/customerService.reducer';
import packageInformationReducer from './packageInformation/packageInformation.reducer';
import customerRechargeReducer from './customerRecharge/customerRecharge.reducer';
import transactionHistoryReducer from './transactionHistory/transactionHistory.reducer';
import tskRefundReducer from './tskRefund/tskRefund.reducer';
import formReducer from './form/form.reducer';
import userReducer from './user';
import commonReducer from './common';
import uiReducer from './ui';
import redirectionReducer from './redirection';
import accountInformationReducer from './accountInformation/accountInformation.reducer';

const userTransform = createTransform(
  // Inbound: state being saved to storage
  (inboundState: any) => {
    if (inboundState && inboundState.info) {
      return {
        ...inboundState,
        info: {
          ...inboundState.info,
          userId: '', // Clear sensitive nested fields before storing
          mdn: '',
        },
      };
    }
    return inboundState;
  },
  // Outbound: state being loaded from storage
  (outboundState) => outboundState,
);

const persistConfig = {
  key: STRINGS.PERSISTENT_KEY,
  storage: encryptedLocalStorage,
  blacklist: ['accessToken', 'refreshToken', 'refreshTokenInfo'], // Exclude top-level sensitive fields
  transforms: [userTransform], // Use transform to handle nested sensitive fields
};



const redirectionPersistConfig = {
  key: STRINGS.PERSISTENT_REDIRECTION_KEY,
  storage: encryptedSessionStorage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);
const persistedRedirectionUser = persistReducer(redirectionPersistConfig, redirectionReducer);

const accountInformationPersistConfig = {
  key: STRINGS.PERSISTENT_ACCOUNT_INFORMATION_KEY,
  storage: encryptedSessionStorage,
};
const persistedAccountInformation = persistReducer(accountInformationPersistConfig, accountInformationReducer);

const transactionHistoryPersistConfig = {
  key: STRINGS.PERSISTENT_TRANSACTION_HISTORY_KEY,
  storage: encryptedSessionStorage,
};
const persistedTransactionHistory = persistReducer(transactionHistoryPersistConfig, transactionHistoryReducer);

const formPersistConfig = {
  key: STRINGS.PERSISTENT_FORM_KEY,
  storage: encryptedSessionStorage,
};
const persistedForm = persistReducer(formPersistConfig, formReducer);

const commonPersistConfig = {
  key: STRINGS.PERSISTENT_COMMON,
  storage: encryptedSessionStorage,
};
const persistedCommon = persistReducer(commonPersistConfig, commonReducer);

const customerOfferPersistConfig = {
  key: STRINGS.PERSISTENT_CUSTOMER_OFFER_KEY,
  storage: encryptedLocalStorage,
};

const langPersistConfig = {
  key: STRINGS.PERSISTENT_LANGUAGE_KEY,
  storage: encryptedLocalStorage,
};

const peristedCustomerOffers = persistReducer(customerOfferPersistConfig, customerOffersReducer);

const rechargeWinbackPersistConfig = {
  key: STRINGS.PERSISTENT_RECHARGE_WINBACK_KEY,
  storage: encryptedLocalStorage,
};
const peristedRechargeWinback = persistReducer(rechargeWinbackPersistConfig, rechargeWinbackReducer);

const persistedLanguageReducer = persistReducer(langPersistConfig, fetchLanguageReducer);

const invoiceReducerConfig = {
  key: STRINGS.PERSISTENT_INVOICE_KEY,
  storage: encryptedLocalStorage,
};

const persistedInvoiceReducer = persistReducer(invoiceReducerConfig, invoiceReducer);

const primaryTvRegistrationPersistConfig = {
  key: STRINGS.PERSISTENT_PRIMARY_TV_KEY,
  storage: encryptedSessionStorage,
};
const persistedPrimaryTvRegistration = persistReducer(primaryTvRegistrationPersistConfig, primaryTvRegistrationReducer);

const etskRegistrationPersistConfig = {
  key: STRINGS.PERSISTENT_ETSK_REG_KEY,
  storage: encryptedSessionStorage,
};
const persistedEtskRegistration = persistReducer(etskRegistrationPersistConfig, etskRegistrationReducer);

const etskRegSchedulerPersistConfig = {
  key: STRINGS.PERSISTENT_ETSK_REG_SCHEDULER_KEY,
  storage: encryptedSessionStorage,
};
const persistedEtskRegScheduler = persistReducer(etskRegSchedulerPersistConfig, etskRegSchedularReducer);

const activationStatusPersistConfig = {
  key: STRINGS.PERSIST_ACTIVATION_STATUS_KEY,
  storage: encryptedSessionStorage,
};

const persistedActivationStatus = persistReducer(activationStatusPersistConfig, activationStatusReducer);

const partnerApprovalPersistConfig = {
  key: STRINGS.PERSISTENT_PARTNER_APPROVAL_KEY,
  storage: encryptedLocalStorage,
};
const peristedPartnerApproval = persistReducer(partnerApprovalPersistConfig, partnerApprovalReducer);

const dealerStockPersistConfig = {
  key: STRINGS.PERSISTENT_PARTNER_APPROVAL_KEY,
  storage: encryptedLocalStorage,
};
const peristedDealerStock = persistReducer(dealerStockPersistConfig, dealerStockReducer);

const modifyPackPersistConfig = {
  key: STRINGS.PERSISTENT_DEALER_STOCK_KEY,
  storage: encryptedSessionStorage,
};

const persistedModifyPack = persistReducer(modifyPackPersistConfig, modifyPackReducer);

const storeDashboardPersistConfig = {
  key: STRINGS.PERSISTENT_STORE_DASHBOARD_KEY,
  storage: encryptedSessionStorage,
};
const persistedStoreDashboard = persistReducer(storeDashboardPersistConfig, storeDashboardReducer);

const evdBalanceInfoPersistConfig = {
  key: STRINGS.PERSISTENT_EVD_BALANCE_INFO_KEY,
  storage: encryptedLocalStorage,
};
const peristedEvdBalanceInfo = persistReducer(evdBalanceInfoPersistConfig, evdBalanceInfoReducer);

const boxUpgradePersistConfig = {
  key: STRINGS.BOX_UPGRADE_KEY,
  storage: encryptedSessionStorage,
};
const persistedBoxUpgrade = persistReducer(boxUpgradePersistConfig, boxUpgradeReducer);

const boxTypeChangePersistConfig = {
  key: STRINGS.BOX_TYPE_CHANGE_KEY,
  storage: encryptedSessionStorage,
};
const persistedBoxTypeChange = persistReducer(boxTypeChangePersistConfig, boxTypeChangeReducer);

const quotationPersistConfig = {
  key: STRINGS.QUOTATION_KEY,
  storage: encryptedSessionStorage,
};
const persistedQuotation = persistReducer(quotationPersistConfig, quotationReducer);

const exclusiveStorePersistConfig = {
  key: STRINGS.PERSISTENT_EXCLUSIVE_STORE,
  storage: encryptedSessionStorage,
};
const persistedExclusiveStore = persistReducer(exclusiveStorePersistConfig, exclusiveStoreReducer);

const tskVoucherPersistConfig = {
  key: STRINGS.PERSISTENT_TSK_VOUCHER,
  storage: encryptedSessionStorage,
};
const persistedTskVoucher = persistReducer(tskVoucherPersistConfig, tskVoucherReducer);

const tsraApprovalPersistConfig = {
  key: STRINGS.PERSISTENT_TSK_VOUCHER,
  storage: encryptedSessionStorage,
};
const persistedTsraApproval = persistReducer(tsraApprovalPersistConfig, tsraApprovalReducer);

const purchaseOrderPersistConfig = {
  key: STRINGS.PERSISTENT_PURCHASE_ORDER,
  storage: encryptedSessionStorage,
};
const persistedPurchaseOrder = persistReducer(purchaseOrderPersistConfig, purchaseOrderReducer);

const salesReducer = {
  /* REDUCER EXPORTS */
     liveNewsTvPage: liveNewsTvPageReducer,
  dealerHelp: dealerHelpReducer,
  tskCancellation: tskCancellationReducer,
  purchaseOrder: persistedPurchaseOrder,
  tsraApproval: persistedTsraApproval,
  tskVoucher: persistedTskVoucher,
  competitorDataCapture: competitorDataCaptureReducer,
  exclusiveStore: persistedExclusiveStore,
  homePage: homePageReducer,
  notifications: notificationsReducer,
  boxTypeChange: persistedBoxTypeChange,
  quotation: persistedQuotation,
  demoAccount: demoAccountReducer,
  modifyPack: persistedModifyPack,
  partnerApproval: peristedPartnerApproval,
  evdBalanceInfo: peristedEvdBalanceInfo,
  multiTvRegistration: multiTvRegistrationReducer,
  activationStatusDetails: activationStatusDetailsReducer,
  activationStatus: persistedActivationStatus,
  etskRepush: etskRepushReducer,
  storeDashboard: persistedStoreDashboard,
  boxUpgrade: persistedBoxUpgrade,
  dealerStock: peristedDealerStock,
  etskMultiTv: etskMultiTvReducer,
  etskRegSchedular: persistedEtskRegScheduler,
  woRecreation: woRecreationReducer,
  primaryTvRegistration: persistedPrimaryTvRegistration,
  etskRegistration: persistedEtskRegistration,
  newDealer: newDealerReducer,
  manageHierarchy: manageHierarchyReducer,
  fetchLanguage: persistedLanguageReducer,
  dealerFeedback: dealerFeedbackReducer,
  tsraInventory: tsraInventoryReducer,
  invoice: persistedInvoiceReducer,
  tsraLifeCycle: tsraLifeCycleReducer,
  evdTransferAsm: evdTransferAsmReducer,
  utility: utilityReducer,
  evdMdnChange: evdMdnChangeReducer,
  dashboard: dashboardReducer,
  resetEvdPin: resetEvdPinReducer,
  demoBoxDetails: demoBoxDetailsReducer,
  customerOffers: peristedCustomerOffers,
  autoEvd: autoEvdReducer,
  rechargeWinback: peristedRechargeWinback,
  evdTransfer: evdTransferReducer,
  changeEvdPin: changeEvdPinReducer,
  customerService: customerServiceReducer,
  packageInformation: packageInformationReducer,
  transactionHistory: persistedTransactionHistory,
  customerRecharge: customerRechargeReducer,
  tskRefund: tskRefundReducer,
  form: persistedForm,
  redirection: persistedRedirectionUser,
  user: persistedReducer,
  common: persistedCommon,
  ui: uiReducer,
  accountInformation: persistedAccountInformation,
};

export default salesReducer;
