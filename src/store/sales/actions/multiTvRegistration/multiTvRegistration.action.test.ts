import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/multiTvRegistration';
import { sliceActions as etskRegistration } from 'store/sales/reducer/etskRegistration';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { sliceActions as woRecreationAction } from 'store/sales/reducer/woRecreation';
import { sliceActions as boxUpgradeAction } from 'store/sales/reducer/boxUpgrade';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { api } from 'services/apolloClient';
import formActions from 'store/sales/actions/form';
import { ROUTE, STATE_KEY, STRINGS } from 'const';
import {
  clearFormMultiTv,
  handelAlertConfirmationMultiTV,
  tskPinValidateAdapterSecondaryOCS,
  multiTvRegistrationModal,
  retrieveMultiTvBoxType,
  multiTvWorkOrderConfirmation,
  doPickPackAndWorkOrderCreationSecondary,
} from './multiTvRegistration.action';

jest.mock('store/sales/reducer/multiTvRegistration', () => ({
  sliceActions: {
    setTskPinParams: jest.fn(),
    setDifferentBox: jest.fn(),
    setTskValidateRequestInput: jest.fn(),
    setTskValidateData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskMultiTv', () => ({
  sliceActions: {
    etskMultiTvSetSubscriberId: jest.fn(),
    etskMultiTvSetSubscriberData: jest.fn(),
    etskMultiTvSetBoxTypeSelected: jest.fn(),
    etskSetMultiBoxSelectedDetails: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskSetBoxTypeSelected: jest.fn(),
    etskSetCustomerDetailsData: jest.fn(),
    etskSetPaidPrice: jest.fn(),
    etskSetEvdPin: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/quotation', () => ({
  sliceActions: {
    quotationsetMultiTVRegistration: jest.fn(),
    quotationPrimarySetBoxTypeData: jest.fn(),
    quotationPrimarySetBoxTypeSelected: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskRegSchedular', () => ({
  sliceActions: {
    setCreateWoEtskSuccessData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/woRecreation', () => ({
  sliceActions: {
    setWoSuccessData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/boxUpgrade', () => ({
  sliceActions: {
    setStatus: jest.fn(),
    setTransactionID: jest.fn(),
    setSRno: jest.fn(),
    setFinalRequiredAmount: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDropdownOptionsData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn(),
    hideBottomModal: jest.fn(),
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    setModalLoader: jest.fn(),
    showAlert: jest.fn(),
    showErrorPage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setSubIdList: jest.fn(),
    setDealerDetails: jest.fn(),
    setUpdatedFormFields: jest.fn(),
    setFieldsToDisable: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: { post: jest.fn(), get: jest.fn() },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    MultiTVRegistration: {
      MultiTVRegistrationValidateTSK: {
        moduleName: 'mod',
        attributes: { Status: 'Status', SubscriberID: 'SubscriberID', boxType: 'boxType', tskPin: 'tskPin' },
      },
      MultiTVRegistrationPageVisit: {
        moduleName: 'mod2',
        attributes: { Status: 'Status' },
      },
      MultiTVRegistrationSummaryProceed: {
        moduleName: 'mod3',
        attributes: { Status: 'Status', SubscriberID: 'SubscriberID', assetNo: 'assetNo', boxType: 'boxType', packageName: 'packageName', rechargeAmount: 'rechargeAmount' },
      },
    },
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_t, p) => p }),
}));

jest.mock('i18next', () => {
  const m = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue(true),
    t: jest.fn((k) => k),
  };
  return { __esModule: true, default: m, ...m };
});

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('i18next-browser-languagedetector', () => ({
  __esModule: true,
  default: class {
    type = 'languageDetector';
  },
}));

const makeGetState =
  (overrides: Record<string, unknown> = {}) =>
  () => ({
    quotation: { multiTvBoxType: { id: '1', name: 'HD' }, multiTVregisterFromQuote: false },
    multiTvRegistration: { differentBox: false, tskPinParams: {}, tskValidateData: { subID: 's1', packToAdd: 'pack', tskSerial: 'tsk1', ocsFlag: 'Y' } },
    etskRegistration: { finalPrice: 100, boxTypeSelected: 'HD' },
    etskRegSchedular: { selectedSlot: '10:00 - 11:00', timeSlotsData: { taskId: 't1' } },
    etskMultiTv: { boxSelectedDetails: { packageNameArray: [{ packName: 'Basic' }], disableEditRechDhamakaMultiTV: 'N' } },
    form: { [STATE_KEY.FORM_STATE]: { formNavigationData: { params: { routeName: '' } } } },
    woRecreation: { workOrderDetails: { info: [{ sub_id: 's1' }] }, tskAllDetails: { tskDetails: [{ TskSno: 'T1' }] } },
    boxTypeChange: { subId: 's1', tskDetails: [{ TskSno: 'T1' }] },
    user: { info: { mdn: '123' } },
    boxUpgrade: {},
    ...overrides,
  });

describe('multiTvRegistration actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(makeGetState());
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch, getState, undefined);
      return action;
    });
  });

  // clearFormMultiTv
  test('clearFormMultiTv dispatches setTskPinParams', () => {
    clearFormMultiTv()(dispatch, getState, undefined);
    expect(sliceActions.setTskPinParams).toHaveBeenCalledWith({});
  });

  // handelAlertConfirmationMultiTV
  test('handelAlertConfirmationMultiTV dispatches setDifferentBox(true)', () => {
    handelAlertConfirmationMultiTV()(dispatch, getState, undefined);
    expect(sliceActions.setDifferentBox).toHaveBeenCalledWith(true);
  });

  // multiTvRegistrationModal
  test('multiTvRegistrationModal dispatches showBottomModal', () => {
    multiTvRegistrationModal({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // tskPinValidateAdapterSecondaryOCS
  test('tskPinValidateAdapterSecondaryOCS shows alert when box type mismatch from quote', () => {
    getState = jest.fn(
      makeGetState({
        quotation: { multiTvBoxType: { id: '1' }, multiTVregisterFromQuote: true },
        multiTvRegistration: { differentBox: false, tskPinParams: {}, tskValidateData: {} },
      }),
    );
    const result = tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { id: '2', name: 'SD' } }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('tskPinValidateAdapterSecondaryOCS skips alert when box type matches', async () => {
    getState = jest.fn(
      makeGetState({
        quotation: { multiTvBoxType: { id: '1' }, multiTVregisterFromQuote: true },
        multiTvRegistration: { differentBox: false, tskPinParams: {}, tskValidateData: {} },
      }),
    );
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: { subID: 's1', customerInformation: {}, accountInfo: null } });
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { id: '1', name: 'HD' }, subscriberID: 's1' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showAlert).not.toHaveBeenCalled();
  });

  test('tskPinValidateAdapterSecondaryOCS skips alert when differentBox is true', async () => {
    getState = jest.fn(
      makeGetState({
        quotation: { multiTvBoxType: { id: '1' }, multiTVregisterFromQuote: true },
        multiTvRegistration: { differentBox: true, tskPinParams: {}, tskValidateData: {} },
      }),
    );
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: { subID: 's1', customerInformation: {}, accountInfo: null } });
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { id: '2', name: 'SD' }, subscriberID: 's1' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showAlert).not.toHaveBeenCalled();
  });

  test('tskPinValidateAdapterSecondaryOCS uses setModalLoader when tskPinParams has secondaryBoxType', async () => {
    getState = jest.fn(
      makeGetState({
        multiTvRegistration: { differentBox: false, tskPinParams: { secondaryBoxType: { name: 'HD' } }, tskValidateData: {} },
      }),
    );
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: { subID: 's1', customerInformation: {}, accountInfo: null } });
    await tskPinValidateAdapterSecondaryOCS({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.setModalLoader).toHaveBeenCalled();
  });

  test('tskPinValidateAdapterSecondaryOCS uses setLoader when no tskPinParams secondaryBoxType', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: { subID: 's1', customerInformation: {}, accountInfo: null } });
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { name: 'HD' } }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.setLoader).toHaveBeenCalled();
  });

  test('tskPinValidateAdapterSecondaryOCS success navigates to MULTI_TV_SUMMAARY', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      status: true,
      result: {
        subID: 's1',
        customerInformation: {
          customerName: 'John',
          mobileNo: '123',
          email: 'a@b.com',
          language: 'en',
          secondaryLang: 'hi',
          pincode: '123',
          addressLine1: 'addr',
          state: 'MH',
          city: 'Pune',
          district: 'Pune',
        },
        accountInfo: null,
      },
    });
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { name: 'HD' }, subscriberID: 's1' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.MULTI_TV_SUMMAARY);
  });

  test('tskPinValidateAdapterSecondaryOCS success with emailAddress fallback (not NA)', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      status: true,
      result: {
        subID: 's1',
        customerInformation: { customerName: 'John', emailAddress: 'a@b.com', district: 'NA' },
        accountInfo: null,
      },
    });
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { name: 'HD' } }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.MULTI_TV_SUMMAARY);
  });

  test('tskPinValidateAdapterSecondaryOCS success with emailAddress NA', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      status: true,
      result: {
        subID: 's1',
        customerInformation: { customerName: 'John', emailAddress: 'NA', district: 'Pune' },
        accountInfo: null,
      },
    });
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { name: 'HD' } }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.MULTI_TV_SUMMAARY);
  });

  test('tskPinValidateAdapterSecondaryOCS isSuccess false shows error page', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err', result: { status: false } });
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { name: 'HD' } }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('tskPinValidateAdapterSecondaryOCS catch shows error page', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { name: 'HD' } }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('tskPinValidateAdapterSecondaryOCS catch with multiTVregisterFromQuote sets multiTvBoxType', async () => {
    getState = jest.fn(
      makeGetState({
        quotation: { multiTvBoxType: { id: '1', name: 'HD' }, multiTVregisterFromQuote: true },
        multiTvRegistration: { differentBox: true, tskPinParams: {}, tskValidateData: {} },
      }),
    );
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await tskPinValidateAdapterSecondaryOCS({ secondaryBoxType: { name: 'HD' } }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith(expect.objectContaining({ secondaryBoxType: { id: '1', name: 'HD' } }));
  });

  // retrieveMultiTvBoxType
  test('retrieveMultiTvBoxType success without multiTVregisterFromQuote', async () => {
    (api.post as jest.Mock).mockResolvedValue({ result: { boxType: ['HD', 'SD'] } });
    const result = await retrieveMultiTvBoxType({}, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setDifferentBox).toHaveBeenCalledWith(true);
    expect(formAction.setDropdownOptionsData).toHaveBeenCalled();
    expect(result.status).toBe(true);
  });

  test('retrieveMultiTvBoxType with multiTVregisterFromQuote disables field', async () => {
    getState = jest.fn(
      makeGetState({
        quotation: { multiTvBoxType: { id: '1', name: 'HD' }, multiTVregisterFromQuote: true },
      }),
    );
    (api.post as jest.Mock).mockResolvedValue({ result: { boxType: ['HD'] } });
    const result = await retrieveMultiTvBoxType({}, 'q')(dispatch, getState, undefined);
    expect(formActions.setFieldsToDisable).toHaveBeenCalled();
    expect(result.status).toBe(false);
  });

  test('retrieveMultiTvBoxType catch shows error page', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await retrieveMultiTvBoxType({}, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  // multiTvWorkOrderConfirmation
  test('multiTvWorkOrderConfirmation dispatches showBottomModal and returns status true', () => {
    const result = multiTvWorkOrderConfirmation({ evdPin: '1234', rechargeAmount: '100' })(dispatch, getState, undefined);
    expect(etskRegistration.etskSetPaidPrice).toHaveBeenCalled();
    expect(etskRegistration.etskSetEvdPin).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
    expect(result.status).toBe(true);
  });

  test('multiTvWorkOrderConfirmation with selectedSlot null', () => {
    getState = jest.fn(makeGetState({ etskRegSchedular: { selectedSlot: null, timeSlotsData: null } }));
    const result = multiTvWorkOrderConfirmation({ evdPin: '1234', rechargeAmount: '200' })(dispatch, getState, undefined);
    expect(result.status).toBe(true);
  });

  test('multiTvWorkOrderConfirmation with DM flag (disableEditRechDhamakaMultiTV YES)', () => {
    getState = jest.fn(
      makeGetState({
        etskMultiTv: { boxSelectedDetails: { packageNameArray: [], disableEditRechDhamakaMultiTV: STRINGS.YES } },
      }),
    );
    const result = multiTvWorkOrderConfirmation({ evdPin: '1234', rechargeAmount: '100' })(dispatch, getState, undefined);
    expect(result.status).toBe(true);
  });

  // doPickPackAndWorkOrderCreationSecondary
  test('doPickPackAndWorkOrderCreationSecondary success navigates to MULTI_TV_SUCCESS', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await doPickPackAndWorkOrderCreationSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.MULTI_TV_SUCCESS);
  });

  test('doPickPackAndWorkOrderCreationSecondary WO_MULTI_TV_SUMMARY route navigates to WO success', async () => {
    getState = jest.fn(
      makeGetState({
        form: { [STATE_KEY.FORM_STATE]: { formNavigationData: { params: { routeName: ROUTE.WEB.WO_MULTI_TV_SUMMARY, woBoxType: 'HD' } } } },
      }),
    );
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await doPickPackAndWorkOrderCreationSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.WORK_ORDER_RECREATION_SUCCEESS);
  });

  test('doPickPackAndWorkOrderCreationSecondary BOX_TYPE_MULTI_TV_SUMMARY route', async () => {
    getState = jest.fn(
      makeGetState({
        form: { [STATE_KEY.FORM_STATE]: { formNavigationData: { params: { routeName: ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY, woBoxType: 'HD' } } } },
      }),
    );
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: { transId: 't1' }, woNumber: 'w1' });
    await doPickPackAndWorkOrderCreationSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(boxUpgradeAction.setStatus).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.BOX_TYPE_SUCCESS);
  });

  test('doPickPackAndWorkOrderCreationSecondary status false shows error', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await doPickPackAndWorkOrderCreationSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('doPickPackAndWorkOrderCreationSecondary catch shows error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await doPickPackAndWorkOrderCreationSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('doPickPackAndWorkOrderCreationSecondary skips NETWORK pack in packArray', async () => {
    getState = jest.fn(
      makeGetState({
        etskMultiTv: { boxSelectedDetails: { packageNameArray: [{ packName: 'strings.network' }, { packName: 'Basic' }], disableEditRechDhamakaMultiTV: 'N' } },
      }),
    );
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await doPickPackAndWorkOrderCreationSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.MULTI_TV_SUCCESS);
  });

  test('doPickPackAndWorkOrderCreationSecondary dispatches setCreateWoEtskSuccessData and setWoSuccessData', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await doPickPackAndWorkOrderCreationSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(regActions.setCreateWoEtskSuccessData).toHaveBeenCalled();
    expect(woRecreationAction.setWoSuccessData).toHaveBeenCalled();
  });
});
