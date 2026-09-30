import { lazy, FC, ReactElement, JSX, ReactNode } from 'react';
import Login from 'screens/sales/LoginPage';
import HomePage from 'screens/sales/HomePage';
import CustomerActions from 'screens/sales/CustomerActions';
import RegisterNewCustomer from 'screens/sales/RegisterNewCustomer';
import MyActions from 'screens/sales/MyActions';

type registryType = {
  [key: string]: FC | ReactElement | JSX.Element | ReactNode;
};

export const LoginPage = Login;
export const Home = HomePage;

export const ChildLayout = lazy(() => import('./layout/ChildLayout'));

export const MainLayout = lazy(() => import('./layout/MainLayout'));

export const AuthLayout = lazy(() => import('./layout/AuthLayout'));

export const RedirectionLayout = lazy(() => import('./layout/RedirectionLayout'));

export const ErrorPage = lazy(() => import('screens/sales/ErrorPage'));

export const Redirection = lazy(() => import('screens/sales/Redirection'));

export const Sales = lazy(() => import('screens/sales/Sales'));

export const TransactionHistory = lazy(() => import('screens/sales/TransactionHistory'));

export const ConfirmReversal = lazy(() => import('screens/sales/ConfirmReversal'));

export const CustomerService = lazy(() => import('screens/sales/CustomerService'));

export const PackageInformation = lazy(() => import('screens/sales/PackageInformation'));

export const Faq = lazy(() => import('screens/sales/Faq'));

export const AccountInformation = lazy(() => import('screens/sales/AccountInformation'));

export const SalesNext = lazy(() => import('screens/sales/SalesNext'));

export const EvdMdnChangeSuccess = lazy(() => import('screens/sales/EvdMdnChangeSuccess'));

export const WinBackViewDetails = lazy(() => import('screens/sales/WinBackViewDetails'));

export const PackageOffersSuccess = lazy(() => import('screens/sales/PackageOffersSuccess'));

export const EvdTransferSuccess = lazy(() => import('screens/sales/EvdTransferSuccess'));

export const Dashboard = lazy(() => import('screens/sales/Dashboard'));

export const AutoEvdSuccess = lazy(() => import('screens/sales/AutoEvdSuccess'));

export const BingeViewDetails = lazy(() => import('screens/sales/BingeViewDetails'));

export const PackViewDetails = lazy(() => import('screens/sales/PackViewDetails'));

export const ManageModalRedirection = lazy(() => import('screens/sales/ManageModalRedirection'));

export const EvdMdnDistSuccess = lazy(() => import('screens/sales/EvdMdnDistSuccess'));
export const TsraLifeSuccess = lazy(() => import('screens/sales/TsraLifeSuccess'));
export const DealerFeedbackSuccess = lazy(() => import('screens/sales/DealerFeedbackSuccess'));
export const HotelSubscription = lazy(() => import('screens/sales/HotelSubscription'));

export const DynamicSalesNext = lazy(() => import('screens/sales/DynamicSalesNext'));

export const ETskRegSuccess = lazy(() => import('screens/sales/ETskRegSuccess'));

export const CreateChannelPartner = lazy(() => import('screens/sales/CreateChannelPartner'));

export const ManageHierarchySuccess = lazy(() => import('screens/sales/ManageHierSuccess'));

export const RegistrationSalesNext = lazy(() => import('screens/sales/RegistrationSalesNext'));

export const WoRecreationSuccess = lazy(() => import('screens/sales/WoRecreationSuccess'));
export const ETSKRegistrationChannels = lazy(() => import('screens/sales/EtskRegistration'));
export const ETSKRegistrationSummary = lazy(() => import('screens/sales/EtskRegistrationSummary'));

export const ActionPartnerRequest = lazy(() => import('screens/sales/ActionPartnerRequest'));
export const PartnerApprovalDetails = lazy(() => import('screens/sales/PartnerApprovalDetails'));
export const PartnerApprovalSuccess = lazy(() => import('screens/sales/PartnerApprovalSuccess'));
export const EtskMultiTvSummary = lazy(() => import('screens/sales/EtskMultiTvSummary'));

export const ActivationStatus = lazy(() => import('screens/sales/ActivationStatus'));
export const DealerStockList = lazy(() => import('screens/sales/DealerStock'));
export const ModifyPack = lazy(() => import('screens/sales/ModifyPack'));

export const EvdBalanceInfo = lazy(() => import('screens/sales/EvdBalanceInfo'));
export const WebViewScreen = lazy(() => import('screens/sales/WebViewScreen'));

export const DemoAccountSuccess = lazy(() => import('screens/sales/DemoAccountSuccess'));
export const SelectNewBox = lazy(() => import('screens/sales/SelectBox'));
export const boxConfirmation = lazy(() => import('screens/sales/BoxSelection'));
export const BoxUpgradeSuccess = lazy(() => import('screens/sales/BoxUpgradeSuccess'));
export const Notifications = lazy(() => import('screens/sales/Notifications'));
export const CompetitorDataSuccess = lazy(() => import('screens/sales/CompetitorDataSuccess'));
export const RedirectToManagePack = lazy(() => import('screens/sales/RedirectToManagePack'));
export const AutoPostWebView = lazy(() => import('screens/sales/AutoPostWebView'));

export const Transaction = lazy(() => import('screens/sales/Transaction'));
export const MyCommissions = lazy(() => import('screens/sales/MyCommissions'));

export const LocalAuthentication = lazy(() => import('screens/sales/LocalAuthentication'));
export const ExclusiveStoreQuestions = lazy(() => import('screens/sales/ExclusiveStoreQuestion'));
export const DemoForm = lazy(() => import('screens/sales/DemoForm'));
export const TskVoucherDetails = lazy(() => import('screens/sales/TskVoucherDetails'));
export const BoxTypeSelection = lazy(() => import('screens/sales/BoxTypeSelection'));
export const ActionTsraRequest = lazy(() => import('screens/sales/ActionTsraRequest'));
export const TsraApprovalSuccess = lazy(() => import('screens/sales/TsraApprovalSuccess'));
export const TsraApprovalSummary = lazy(() => import('screens/sales/TsraApprovalSummary'));
export const PurchaseOrderDetails = lazy(() => import('screens/sales/PurchaseOrderDetails'));
export const RegisterNewPayment = lazy(() => import('screens/sales/RegisterNewPaymentId'));
export const RegisterPaymentOptions = lazy(() => import('screens/sales/RegisterPaymentOptions'));
export const PurchaseOrderHome = lazy(() => import('screens/sales/PurchaseOrderHome'));
export const EvdRaiseRequest = lazy(() => import('screens/sales/EvdRaiseRequest'));
export const MaterialsRaiseRequest = lazy(() => import('screens/sales/MaterialsRaiseRequest'));
export const MaterialsSummary = lazy(() => import('screens/sales/MaterialsSummary'));
export const EvdRaiseRequestSuccess = lazy(() => import('screens/sales/EvdRaiseRequestSuccess'));
export const ActionRequestPo = lazy(() => import('screens/sales/ActionRequestPo'));
export const PurchaseOrderSettlements = lazy(() => import('screens/sales/PurchaseOrderSettlements'));
export const QuotationPrimaryOffer = lazy(() => import('screens/sales/QuotationPrimaryOffer'));
export const BingeRetailer = lazy(() => import('screens/sales/BingeRetailer'));
export const TrainingModule = lazy(() => import('screens/sales/TrainingModule'));
export const DealerSuccess = lazy(() => import('screens/sales/DealerSuccess'));
export const DealerTrackRequest = lazy(() => import('screens/sales/DealerTrackRequest'));
export const DealerRaiseRequest = lazy(() => import('screens/sales/DealerRaiseRequest'));
export const BingeRetailerDashboard = lazy(() => import('screens/sales/BingeRetailerDashboard'));
export const LiveNewsTvPage = lazy(()=> import('screens/sales/LiveNewsTvPage') );
//  PRM NEXT
export const PrmNext = lazy(() => import('screens/prm/PrmNext'));

export const componentRegistry: registryType = {
  home: Home,
  error: ErrorPage,
  login: LoginPage,
  sales: Sales,
  transactionHistory: TransactionHistory,
  confirmReversal: ConfirmReversal,
  customerService: CustomerService,
  faq: Faq,
  packageInformation: PackageInformation,
  accountInformation: AccountInformation,
  salesNext: SalesNext,
  evdMdnChangeSuccess: EvdMdnChangeSuccess,
  rechargeWinbackViewDetails: WinBackViewDetails,
  customerOfferSuccess: PackageOffersSuccess,
  evdTransferSuccess: EvdTransferSuccess,
  dashboard: Dashboard,
  autoEvdSuccess: AutoEvdSuccess,
  bingeViewDetails: BingeViewDetails,
  packViewDetails: PackViewDetails,
  myOffersViewDetails: PackViewDetails,
  customerRechargeViewDetails: PackViewDetails,
  rechargeWinBackViewDetails: PackViewDetails,
  etskOfferViewDetails: PackViewDetails,
  boxtypeChangeViewDetails: PackViewDetails,
  demoBoxDetail: ManageModalRedirection,
  evdMdnDistSuccess: EvdMdnDistSuccess,
  customerOffers: ManageModalRedirection,
  winbackSuccess: PackageOffersSuccess,
  tsraLifeCycleSuccess: TsraLifeSuccess,
  customerInvoice: ManageModalRedirection,
  dealerFeedbackSuccess: DealerFeedbackSuccess,
  hotelSubscription: HotelSubscription,
  evdTransfer: ManageModalRedirection,
  evdTransferEmployee: ManageModalRedirection,
  dynamicSalesNext: DynamicSalesNext,
  eTskRegSuccess: ETskRegSuccess,
  createPartner: CreateChannelPartner,
  manageHierSuccess: ManageHierarchySuccess,
  registrationSalesNext: RegistrationSalesNext,
  woRecreation: ManageModalRedirection,
  woRecreationSuccess: WoRecreationSuccess,
  eTSKRegistrationChannels: ETSKRegistrationChannels,
  woRecreationChannels: ETSKRegistrationChannels,
  eTSKRegistrationSummary: ETSKRegistrationSummary,
  woRecreationSummary: ETSKRegistrationSummary,
  primaryTvRegistration: ManageModalRedirection,
  primaryRegistrationChannels: ETSKRegistrationChannels,
  primaryRegOfferDetails: PackViewDetails,
  primaryRegistrationSummary: ETSKRegistrationSummary,
  primaryTvRegSuccess: ETskRegSuccess,
  actionPartnerRequest: ActionPartnerRequest,
  partnerApprovalDetails: PartnerApprovalDetails,
  partnerApprovalSuccess: PartnerApprovalSuccess,
  activationStatusDetails: ActivationStatus,
  eTskMultiTvSuccess: ETskRegSuccess,
  eTskMultiTvRepushSuccess: ETskRegSuccess,
  rePushOrderChannels: ETSKRegistrationChannels,
  rePushOrderOfferDetails: PackViewDetails,
  rePushOrderSummary: ETSKRegistrationSummary,
  rePushOrderSuccess: ETskRegSuccess,
  multiTvRegistration: ManageModalRedirection,
  dealerStock: ManageModalRedirection,
  eTSKRepush: ManageModalRedirection,
  dealerStockList: DealerStockList,
  createNewDealerSuccess: ManageHierarchySuccess,
  woRecreationOfferViewDetails: PackViewDetails,
  eTSKMultiTv: ManageModalRedirection,
  eTSKMultiTvSummary: EtskMultiTvSummary,
  eTskRepushSuccess: ETskRegSuccess,
  eTSKRepushChannels: ETSKRegistrationChannels,
  eTSKRepushSummary: ETSKRegistrationSummary,
  etskRepushOfferViewDetails: PackViewDetails,

  multiTvSummary: EtskMultiTvSummary,
  multiTvSucess: ETskRegSuccess,

  modifyPack: ManageModalRedirection,
  modifyPackAccountDetails: ModifyPack,
  activationStatus: ManageModalRedirection,
  evdBalanceInfo: EvdBalanceInfo,
  demoAccount: RegistrationSalesNext,
  demoAccountSuccess: DemoAccountSuccess,
  confirmReversalInfo: ConfirmReversal,
  confirmReversalInfoFos: ConfirmReversal,
  quotation: ManageModalRedirection,

  storeDashboard: ManageModalRedirection,
  boxUpgrade: ManageModalRedirection,
  boxConfirmation,
  boxUpgradeSuccess: BoxUpgradeSuccess,
  selectNewBox: SelectNewBox,
  customerActions: CustomerActions,
  notifications: Notifications,
  boxTypeChange: ManageModalRedirection,
  boxTypeChannels: ETSKRegistrationChannels,
  selectBoxType: BoxTypeSelection,
  boxTypeSummary: ETSKRegistrationSummary,
  boxTypeSuccess: BoxUpgradeSuccess,
  competitorDataCapture: ManageModalRedirection,
  competitorDataSuccess: CompetitorDataSuccess,
  redirectToManagePack: RedirectToManagePack,
  autoPostWebView: AutoPostWebView,
  registerNewCustomer: RegisterNewCustomer,
  myActions: MyActions,
  transaction: Transaction,
  myCommissions: MyCommissions,
  activationStatusPackDetails: PackViewDetails,
  localAuthentication: LocalAuthentication,
  quotationETSKChannels: ETSKRegistrationChannels,
  quotationPrimaryChannels: ETSKRegistrationChannels,
  quotationETSKSummary: ETSKRegistrationSummary,
  quotationPrimarySummary: ETSKRegistrationSummary,
  quotationETSKSuccess: ETskRegSuccess,
  quotationPrimarySuccess: ETskRegSuccess,
  quotationETSKPackDetails: PackViewDetails,
  exclusiveStoreQuestions: ExclusiveStoreQuestions,
  ssoWebView: WebViewScreen,
  woMultiTvSummary: EtskMultiTvSummary,
  boxTypeMultiTVSummary: EtskMultiTvSummary,
  demoForm: DemoForm,
  tskVoucher: ManageModalRedirection,
  tskVoucherDetails: TskVoucherDetails,
  manageApps: ManageModalRedirection,
  actionTsraRequest: ActionTsraRequest,
  tsraApprovalSuccess: TsraApprovalSuccess,
  actionTsraSummary: TsraApprovalSummary,
  purchaseOrderTrackDetails: PurchaseOrderDetails,
  registerNewPayment: RegisterNewPayment,
  registerPaymentOptions: RegisterPaymentOptions,
  purchaseOrderHome: PurchaseOrderHome,
  evdRaiseRequest: EvdRaiseRequest,
  materialsRaiseRequest: MaterialsRaiseRequest,
  materialsSummary: MaterialsSummary,
  evdRaiseRequestSuccess: EvdRaiseRequestSuccess,
  actionRequestPo: ActionRequestPo,
  purchaseOrderSettlements: PurchaseOrderSettlements,
  tskCancellation: ManageModalRedirection,
  quotationPrimaryOffer: QuotationPrimaryOffer,
  bingeRetailer: BingeRetailer,
  trainingModule: TrainingModule,
  dealerSuccess: DealerSuccess,
  dealerTrackRequest: DealerTrackRequest,
  dealerRaiseRequest: DealerRaiseRequest,
  bingeRetailerDashboard: BingeRetailerDashboard,
  liveNewsTvPage: LiveNewsTvPage,
  // PRM NEXT
  prmNext: PrmNext,
};

export const routeComponent: any = (componentKey: string) => componentRegistry[componentKey] || componentRegistry.error;
