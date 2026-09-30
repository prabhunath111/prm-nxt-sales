import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/woRecreation';
import { sliceActions as multiActions } from 'store/sales/reducer/etskMultiTv';
import { api } from 'services/apolloClient';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import * as responseHelper from 'utils/responseHelper';
import {
  woRecreationOfferModal,
  getSubscriberTSKDeatils,
  getWorkOrderDetails,
  getTskAllDetails,
  workOrderRecreation,
  getTskPinDetails,
  getAccountDetailsPrimaryAndSecondaryRepush,
  getAllPacksProp,
  getWoPacks,
  getWoRentalPack,
  woRechargeDetails,
  woRecreationFillAmount,
  confirmWoRechargeModal,
  clearTskPinTimeout,
  doPickPackAndWorkOrderCreationPrimaryAndSecondary,
  getOnlyPricePtForMultiTVInput,
  getSecMultiTVDtlsOrg,
} from './woRecreation.action';

jest.mock('store/sales/reducer/woRecreation', () => ({
  sliceActions: {
    setWorkOrderDetails: jest.fn(),
    setTskAllDetails: jest.fn(),
    setWoSuccessData: jest.fn(),
    setTskPinDetails: jest.fn(),
    setAccountDetailsPrimaryAndSecondaryRepush: jest.fn(),
    setOnlyPricePtForMultiTVInput: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskMultiTv', () => ({
  sliceActions: {
    etskMultiTvSetBoxTypeSelected: jest.fn(),
    etskSetMultiBoxSelectedDetails: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/primaryTvRegistration', () => ({
  sliceActions: {
    setTskValidateData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskClearSelectedPacksToBuyData: jest.fn(),
    etskSetPackSelected: jest.fn(),
    etskSetAccountCreationSuccessData: jest.fn(),
    etskSetFiltersData: jest.fn(),
    etskSetFreePackSelected: jest.fn(),
    etskSetPrimaryBoxPrice: jest.fn(),
    etskSetCategoryDropdownData: jest.fn(),
    etskSetDurationDropdownData: jest.fn(),
    etskSetCategorySelectionPacksData: jest.fn(),
    etskSetValidatePacksSuccessData: jest.fn(),
    etskSetEvdPin: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn(),
    setModalLoader: jest.fn(),
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    hideBottomModal: jest.fn(),
    showErrorPage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setErrorMessage: jest.fn(),
    reSetErrorMessage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setSubIdList: jest.fn(),
    setDealerDetails: jest.fn(),
    setFormValues: jest.fn(),
    setFieldsToDisable: jest.fn(),
    setUpdatedFormFields: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
  filterPackDetails: jest.fn((d) => d),
  getDisabledCategoryMatch: jest.fn(() => ({ rechargeEnabled: 'YES' })),
  getRechargeFlag: jest.fn(() => '1'),
  transformSelectedPacksArray: jest.fn(() => []),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('const', () => ({
  CHILD_TYPE: { DYNAMIC_SALES_NEXT_FORM: 'F1', REGISTRATION_SALES_NEXT_FORM: 'F2', LABEl: 'L1' },
  CONNECTION_TYPE: { PRIMARY: 'PRIMARY' },
  PROPERTIES: { WO_RECREATION: { WO_STATUS: ['STATUS'] } },
  ROUTE: { WEB: { WORK_ORDER_RECREATION_SUCCEESS: 'S1', WO_RECREATION_CHANNELS: 'C1', WO_MULTI_TV_SUMMARY: 'M1' } },
  WO_VALIDATION: { CANCELLED: 'CANCELLED', OPEN: 'OPEN' },
  HEADER_TITLE: { WO_RECREATION: 'HT1', SUBSCRIBER_ID: 'HT2', CONFIRMATION: 'HT3' },
  FORMS: { woRecreation: 'FOR1', woRecreationSubIdList: 'FOR2', rechargeDetails: 'FOR3', woRechargeDetails: 'FOR4' },
  ICONS: { WORK_ORDER: 'ICO1' },
  MODAL: { OK: 'OK', CONFIRM: 'CONF', MODIFY: 'MOD' },
  QUERY: {
    GetSubscriberTSKDeatils: 'Q1',
    GetWorkOrderDetails: 'Q2',
    GetTskAllDetails: 'Q3',
    WorkOrderRecreation: 'Q4',
    GetTskPinDetails: 'Q5',
    GetAccountDetailsPrimaryAndSecondaryRepush: 'Q6',
    GetAllPacksProp: 'Q7',
    DoPickPackAndWorkOrderCreationPrimaryAndSecondary: 'Q8',
    WoRechargeDetails: 'Q9',
    GetOnlyPricePtForMultiTVInput: 'Q10',
    GetSecMultiTVDtlsOrg: 'Q11',
  },
}));

jest.mock('const/strings', () => ({
  STATE_KEY: { FORM_STATE: 'form', MODAL_STATE: 'modal' },
  STRINGS: { NO: 'NO', RECHARGE_AMOUNT_FIELD: 'RAF', YES: 'YES', EVD: 'EVD', CHNAGE_TBL: 'TBL', WO_RECREATION: 'WR' },
  WO_VALIDATION: { CANCELLED: 'CANCELLED', OPEN: 'OPEN' },
}));

jest.mock('i18next', () => ({
  t: (k: string) => k,
}));

describe('woRecreation actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  let navigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (api.post as jest.Mock).mockImplementation(() => Promise.resolve({}));
    getState = jest.fn(() => ({
      user: { info: { userId: 'u1' } },
      woRecreation: {
        woTypesFromPropWO: ['', '', '', '', 'T1', '', '', '', '', '', '', '', 'T2', '', '', '', '', 'T3'],
        tskAllDetails: { eaiOrderDetails: [{ EaiOrderEntryLineItems: [{ orderNumber: '1' }] }] },
      },
      etskRegistration: { selectedPacksToBuy: [], validatePacksSuccessData: { noOfConnection: 1 } },
      etskRegSchedular: { selectedSlot: '10 - 12' },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
    navigate = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('woRecreationOfferModal', () => {
    woRecreationOfferModal({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('getSubscriberTSKDeatils list of length 1', async () => {
    (api.post as jest.Mock).mockResolvedValue({ subscriberList: [{ subscriberId: '1' }] });
    await getSubscriberTSKDeatils({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('getSubscriberTSKDeatils list multiple', async () => {
    (api.post as jest.Mock).mockResolvedValue({ subscriberList: [{ id: 1 }, { id: 2 }] });
    await getSubscriberTSKDeatils({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('getSubscriberTSKDeatils tskDeatils success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ subscriberList: null, tskDeatils: [{ connectionTypeNT: 'PRIMARY' }] });
    await getSubscriberTSKDeatils({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('getSubscriberTSKDeatils tskDeatils false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ subscriberList: null, tskDeatils: [{ connectionTypeNT: 'OTHER' }] });
    await getSubscriberTSKDeatils({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getSubscriberTSKDeatils empty', async () => {
    (api.post as jest.Mock).mockResolvedValue({ subscriberList: null, tskDeatils: [] });
    await getSubscriberTSKDeatils({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getSubscriberTSKDeatils failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getSubscriberTSKDeatils({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getWorkOrderDetails success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ info: [{ wo_status: 'OPEN' }] });
    await getWorkOrderDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setWorkOrderDetails).toHaveBeenCalled();
  });

  test('getWorkOrderDetails restricted status', async () => {
    (api.post as jest.Mock).mockResolvedValue({ info: [{ wo_status: 'STATUS' }] });
    await getWorkOrderDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getWorkOrderDetails failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getWorkOrderDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getTskAllDetails success', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      tskDetails: [{ DealerCode: 'u1' }],
      woDetails: [{ statusNT: 'CANCELLED' }],
      eaiOrderDetails: [{ statusNT: 'OPEN' }],
      dealerDetails: [],
    });
    await getTskAllDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setTskAllDetails).toHaveBeenCalled();
  });

  test('getTskAllDetails multi-TV branch', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      tskDetails: [{ DealerCode: 'u1' }],
      woDetails: [{ SubType: 'T1' }],
      dealerDetails: [],
    });
    await getTskAllDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setTskAllDetails).toHaveBeenCalled();
  });

  test('getTskAllDetails default branch', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      tskDetails: [{ DealerCode: 'u1' }],
      woDetails: [{ SubType: 'Other' }],
      dealerDetails: [],
    });
    await getTskAllDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setTskAllDetails).toHaveBeenCalled();
  });

  test('getTskAllDetails not auth', async () => {
    (api.post as jest.Mock).mockResolvedValue({ tskDetails: [{ DealerCode: 'other' }], dealerDetails: [] });
    await getTskAllDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getTskAllDetails empty', async () => {
    (api.post as jest.Mock).mockResolvedValue({ tskDetails: [] });
    await getTskAllDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getTskAllDetails failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getTskAllDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('workOrderRecreation status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false });
    await workOrderRecreation({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('workOrderRecreation failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await workOrderRecreation({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getTskPinDetails failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getTskPinDetails({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getAccountDetailsPrimaryAndSecondaryRepush failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getAccountDetailsPrimaryAndSecondaryRepush({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getAllPacksProp success', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      boxTypes: [],
      languages: [],
      geners: [],
      PopularPacks: [],
      durations: [],
      packageName: [{ PackageInfo: [] }],
      offerCategories: [],
    });
    await getAllPacksProp({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith('C1');
  });

  test('getAllPacksProp failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getAllPacksProp({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getWoPacks status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await getWoPacks({ value: { nameNT: 'v' } })(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('err');
  });

  test('getWoPacks failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getWoPacks({ value: { nameNT: 'v' } })(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getWoRentalPack status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await getWoRentalPack({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('err');
  });

  test('getWoRentalPack failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getWoRentalPack({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('woRechargeDetails', () => {
    woRechargeDetails()(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('woRecreationFillAmount disabled branch', () => {
    (responseHelper.getDisabledCategoryMatch as jest.Mock).mockReturnValue({ rechargeEnabled: 'NO' });
    woRecreationFillAmount({})(dispatch, getState, undefined);
    jest.advanceTimersByTime(200);
    expect(formActions.setFieldsToDisable).toHaveBeenCalled();
  });

  test('confirmWoRechargeModal', () => {
    confirmWoRechargeModal({ rechargeAmount: 100 }, 'q', {})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('clearTskPinTimeout', () => {
    clearTskPinTimeout()(dispatch, getState, undefined);
    // Should not throw
  });

  test('doPickPackAndWorkOrderCreationPrimaryAndSecondary status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await doPickPackAndWorkOrderCreationPrimaryAndSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('err');
  });

  test('doPickPackAndWorkOrderCreationPrimaryAndSecondary failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await doPickPackAndWorkOrderCreationPrimaryAndSecondary({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getOnlyPricePtForMultiTVInput success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, boxType: 'HD' });
    await getOnlyPricePtForMultiTVInput({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setOnlyPricePtForMultiTVInput).toHaveBeenCalled();
  });

  test('getOnlyPricePtForMultiTVInput status false', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'err' });
    await getOnlyPricePtForMultiTVInput({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('err');
  });

  test('getOnlyPricePtForMultiTVInput failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getOnlyPricePtForMultiTVInput({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('getSecMultiTVDtlsOrg', async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    await getSecMultiTVDtlsOrg({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(multiActions.etskSetMultiBoxSelectedDetails).toHaveBeenCalled();
  });

  test('getSecMultiTVDtlsOrg failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getSecMultiTVDtlsOrg({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });
});
