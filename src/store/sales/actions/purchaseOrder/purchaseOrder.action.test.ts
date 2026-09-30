// Standard Mocking Pattern - MUST BE HOISTED
import { api } from 'services/apolloClient';
import * as actions from './purchaseOrder.action';

jest.mock('store/sales/reducer/purchaseOrder', () => ({
  sliceActions: {
    setDealerMob: jest.fn((v) => ({ type: 'PO_SET_MOB', payload: v })),
    setDuration: jest.fn((v) => ({ type: 'PO_SET_DUR', payload: v })),
    setStatus: jest.fn((v) => ({ type: 'PO_SET_STATUS', payload: v })),
    setDistributorTrackRequestDetails: jest.fn((v) => ({ type: 'PO_SET_DETAILS', payload: v })),
    setTableColumn: jest.fn((v) => ({ type: 'PO_SET_COL', payload: v })),
    setDetailsColumn: jest.fn((v) => ({ type: 'PO_SET_DET_COL', payload: v })),
    setPosmDetails: jest.fn((v) => ({ type: 'PO_SET_POSM', payload: v })),
    setFullPaymentType: jest.fn((v) => ({ type: 'PO_SET_FULL_PAY', payload: v })),
    setPaymentType: jest.fn((v) => ({ type: 'PO_SET_PAY', payload: v })),
    setWalletDetails: jest.fn((v) => ({ type: 'PO_SET_WALLET', payload: v })),
    setIsEditable: jest.fn((v) => ({ type: 'PO_SET_EDITABLE', payload: v })),
    setEditData: jest.fn((v) => ({ type: 'PO_SET_EDIT', payload: v })),
    setSettlementsData: jest.fn((v) => ({ type: 'PO_SET_SETTLE', payload: v })),
    setOrderIdDetails: jest.fn((v) => ({ type: 'PO_SET_ORDER_ID', payload: v })),
    setActionRequestTableData: jest.fn((v) => ({ type: 'PO_SET_ACTION_REQ', payload: v })),
    setRejectedUserData: jest.fn((v) => ({ type: 'PO_SET_REJECT_USER', payload: v })),
    setBalanceEnquiryData: jest.fn((v) => ({ type: 'PO_SET_BAL', payload: v })),
    setPaymentTypesData: jest.fn((v) => ({ type: 'PO_SET_PAY_TYPES', payload: v })),
    setSelectedMaterial: jest.fn((v) => ({ type: 'PO_SET_MAT', payload: v })),
    setSelectedMaterialPill: jest.fn((v) => ({ type: 'PO_SET_PILL', payload: v })),
    setAllMaterialDetailsData: jest.fn((v) => ({ type: 'PO_SET_ALL_MAT', payload: v })),
    setOrderSucessMessage: jest.fn((v) => ({ type: 'PO_SET_SUCCESS', payload: v })),
    setASMTrackRequestData: jest.fn((v) => ({ type: 'PO_SET_ASM_DATA', payload: v })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
    clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
    showErrorPage: jest.fn((m) => ({ type: 'UI_SHOW_ERROR', payload: m })),
    showAlert: jest.fn((m, t, c) => ({ type: 'UI_SHOW_ALERT', payload: { m, t, c } })),
    showBottomModal: jest.fn((c) => ({ type: 'UI_SHOW_MODAL', payload: c })),
    hideBottomModal: jest.fn(() => ({ type: 'UI_HIDE_MODAL' })),
    setModalLoader: jest.fn(() => ({ type: 'UI_SET_MODAL_LOADER' })),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setUpdatedFormFields: jest.fn((v, k) => ({ type: 'FORM_SET_UPDATED', payload: { v, k } })),
    setRadioContainerOptions: jest.fn((v, q) => ({ type: 'FORM_SET_RADIO', payload: { v, q } })),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setMultipleAutoCompleteData: jest.fn((v) => ({ type: 'FORM_SET_AUTO', payload: v })),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setErrorMessage: jest.fn((m) => ({ type: 'COMMON_SET_ERROR', payload: m })),
    setTableColumnData: jest.fn((v) => ({ type: 'COMMON_SET_TABLE_COL', payload: v })),
    setTotalListCount: jest.fn((v) => ({ type: 'COMMON_SET_COUNT', payload: v })),
    setTableFilteredData: jest.fn((v) => ({ type: 'COMMON_SET_FILTERED', payload: v })),
  },
}));

jest.mock('store/sales/reducer/storeDashboard', () => ({
  sliceActions: {
    setDateForStoreDashboard: jest.fn((v) => ({ type: 'STORE_SET_DATE', payload: v })),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: { post: jest.fn() },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('i18next', () => ({
  t: jest.fn((k) => k),
  default: { t: jest.fn((k) => k) },
}));

jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    STRINGS: { ...actual.STRINGS, ALL: 'ALL', OTHERS: 'OTHERS', SUCCESS: 'SUCCESS', BANK: 'BANK', productSuccess: 'productSuccess' },
    PROPERTIES: {
      PURCHASE_ORDER: {
        getPaymentTypes: jest.fn(() => []),
        getDurationTypes: jest.fn(() => []),
      },
    },
    QUERY: {
      ...actual.QUERY,
      FetchSettlements: 'FetchSettlements',
      GetDealerTrackDetails: 'GetDealerTrackDetails',
      Getfostrackrequest: 'Getfostrackrequest',
      GetPaymentOptionsforDealerWeb: 'GetPaymentOptionsforDealerWeb',
      FosGetRaiseRequestDetails: 'FosGetRaiseRequestDetails',
      RejectReasonsPO: 'RejectReasonsPO',
      doRaiseReqRCVTSKPOSMWeb: 'doRaiseReqRCVTSKPOSMWeb',
    },
    STATE_KEY: { FORM_STATE: 'formState' },
  };
});

describe('purchaseOrder actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  const getInitialState = () => ({
    user: { info: { userId: '1', mdn: '123', internalRole: 'R1' } },
    purchaseOrder: {
      dealerMob: '456',
      distributorTrackRequestDetails: [{ mdn: '1', status: 'Approved', paymentType: 'P_1' }],
      posmDetails: [{ DealerEVD: '1' }],
      duration: {},
      status: {},
      settlementsData: { rows: [{ settlementId: '1' }] },
      orderIdDetails: {},
      asmTrackRequestData: [{ distributor_ph_num: '1', mdn: '1' }],
      rejectedUserData: { amount: 100 },
      allMaterialDetailsData: [],
    },
    common: { tableData: [] },
    form: { formState: { formNavigationData: { params: {} } } },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => getInitialState());
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch, getState, undefined);
      return action;
    });
  });

  test('trackRequest success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await actions.trackRequest({ purchaseOrderEVDForm: '789' }, 'Q', {}, jest.fn())(dispatch, getState, undefined);
  });

  test('distributorTrackRequestDetails success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, response: { distributorTrackDetailsForFosAndDealer: [{ status: 'Approved', paymentType: 'P_1' }] } });
    await actions.distributorTrackRequestDetails({ requestedDate: { id: 1 }, requestedType: { id: 1 } }, 'Q', {}, jest.fn())(dispatch, getState, undefined);
  });

  test('doRaiseReqRCVTSKPOSMWeb success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, response: { message: 'ok' } });
    await actions.doRaiseReqRCVTSKPOSMWeb({ selectedMaterial: [{ materialType: 'TSK', totalCount: 1, productCode: 'C', productFriendlyName: 'F', productName: 'N' }] }, 'Q', {})(
      dispatch,
      getState,
      undefined,
    );
  });

  test('searchPoTrackDetails variants', () => {
    actions.searchPoTrackDetails({ searchText: '1' })(dispatch, getState, undefined);
    actions.searchPoTrackDetailsPOSM({ searchText: '1' })(dispatch, getState, undefined);
    actions.searchSettlements({ searchText: '1' })(dispatch, getState, undefined);
  });

  test('asmTrackRequestDetails success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, response: { distributorTrackDetailsForFosAndDealer: [] } });
    await actions.asmTrackRequestDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
  });

  test('walletOptions success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, response: { paymentId: [{ paymentType: 'P', paymentTypeNT: 'BANK' }], paymentType: [] } });
    await actions.walletOptions({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
  });

  test('FetchSettlements success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, response: { settlements: {} } });
    await actions.FetchSettlements({ month: 3, navigate: true }, 'Q', {}, jest.fn())(dispatch, getState, undefined);
  });

  test('fosRejectAndReasonRequest success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, response: { errorMessage: 'ok' } });
    await actions.fosRejectAndReasonRequest({ rejectReasons: 'OTHERS', remarks: 'R' }, 'Q', {})(dispatch, getState, undefined);
  });

  test('simple thunks and setters', async () => {
    actions.openEVDForm()(dispatch, getState, undefined);
    actions.openMaterialsForm()(dispatch, getState, undefined);
    actions.openEVDFormASM()(dispatch, getState, undefined);
    actions.openMaterialsFormASM()(dispatch, getState, undefined);
    actions.setAutoData()(dispatch, getState, undefined);

    (api.post as jest.Mock).mockResolvedValue({ status: true, response: {} });
    await actions.dealerBalanceRequest({}, 'Q', {})(dispatch, getState, undefined);
    await actions.getOrderId({}, 'Q', {})(dispatch, getState, undefined);
    await actions.storeStatus({ status: 'SUCCESS' }, 'Q', {})(dispatch, getState, undefined);
    await actions.doGetPOSMAssetDetails({}, 'Q', {})(dispatch, getState, undefined);
    await actions.getPOSMData({}, 'Q', {})(dispatch, getState, undefined);
    await actions.getPaymentOptionsforDealerWeb({}, 'Q', {})(dispatch, getState, undefined);
    await actions.doPosmBalanceEnquiryWeb({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.getFosRejectionReasonFromProperty({}, 'Q', {})(dispatch, getState, undefined);
    await actions.fosApproveRequest({}, 'Q', {})(dispatch, getState, undefined);
    await actions.fosGetRaiseRequestDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.getPosmDealerId1({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.distributorPaymentIdUpdate({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.navigateSettlements({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.getfostrackrequest({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.trackRequestMeterialFos({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.openMaterialsFormFos({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.fosTrackRequestDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.openMaterialsFormDealer({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.getDealerTrackDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.dealerTrackRequestDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.trackRequestMeterial({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.openMaterialsForm()(dispatch, getState, undefined);
    await actions.asmAsiTrackRequest({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.trackRequestMeterialASM({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
  });

  test('error paths catch blocks', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    const dp = { selectedMaterial: [{ materialType: 'TSK', totalCount: 1 }] };
    await actions.trackRequest({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.doRaiseReqRCVTSKPOSMWeb(dp, 'Q', {})(dispatch, getState, undefined);
    await actions.distributorTrackRequestDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.dealerTrackRequestDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.asmTrackRequestDetails({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.walletOptions({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.FetchSettlements({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
    await actions.distributorPaymentIdUpdate({}, 'Q', {}, jest.fn())(dispatch, getState, undefined);
  });
});
