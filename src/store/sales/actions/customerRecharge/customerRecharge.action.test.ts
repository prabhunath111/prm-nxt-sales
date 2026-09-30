import { Platform } from 'react-native';
import { sliceActions } from 'store/sales/reducer/customerRecharge';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { handleWebViewUrl, arePopupsAllowed } from 'utils/navigationHelper';
import {
  slabModel,
  doRecharge,
  CustomerRechXtraMileRech,
  CustomerRechXtraMileRechSkipOffer,
  validateSubscriber,
  doOfferRecharge,
  getOtpToAddOffer,
  searchMahaBumperOffers,
  searchWinbackOffers,
  searchDynamicOffers,
  showRechargeConfirmation,
  getOfferPackDetails,
  getInvoiceURL,
  setBingFlag,
  toggleAccordion,
  searchOffersBasisRechargeValue,
  fetchBingePlusPack,
  clearBinge,
  removeAndroidSelection,
  getBonusByOfferName,
} from './customerRecharge.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/customerRecharge', () => ({
  sliceActions: {
    setBingeFlag: jest.fn(),
    setIsBingeSelected: jest.fn(),
    setRadioSelected: jest.fn(),
    setSelectedId: jest.fn(),
    setSelectedIdRadio: jest.fn(),
    setDataPacks: jest.fn(),
    setNavigationID: jest.fn(),
    setMainFormData: jest.fn(),
    setBingeCatgeoryData: jest.fn(),
    setBingeDurationData: jest.fn(),
    setAndroidUpgradeSelected: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(),
  setModalLoader: jest.fn(),
  clearLoader: jest.fn(),
  showAlert: jest.fn(),
  hideBottomModal: jest.fn(),
  showErrorPage: jest.fn(),
  setLoader: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setSlabList: jest.fn(),
  setUpdatedFormFields: jest.fn(),
  setSubIdList: jest.fn(),
  setSubIdListDefault: jest.fn(),
  setOffersBasisRechargeObject: jest.fn(),
  clearFormData: jest.fn(),
  setFormActionDefault: jest.fn(),
  setSearchBarItems: jest.fn(),
  setNavigationData: jest.fn(),
  setOffersBasisRechargeValue: jest.fn(),
  setOffersBasisRechargeValueType: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
  isValueInRange: jest.fn(() => true),
}));

jest.mock('utils/formBuilderHelper', () => ({
  filterList: jest.fn((list) => list),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('const', () => ({
  ALERT: { SUCCESS: 'SUCCESS', INFO: 'INFO', CONFIRM: 'CONFIRM', ERROR: 'ERROR' },
  CHILD_TYPE: { DYNAMIC_SALES_NEXT_FORM: 'DYNAMIC_SALES_NEXT_FORM', LIST_DATA: 'LIST_DATA', OTP_MODAL: 'OTP_MODAL' },
  MODAL: { OK: 'OK', CANCEL: 'CANCEL', CLOSE: 'CLOSE', CONFRIM_RECHARGE: 'CONFRIM_RECHARGE' },
  PROPERTIES: {
    CUSTOMER_RECHARGE: {
      CONFIRM_RECHARGE: 'CONFIRM_RECHARGE',
      CONFIRM_OFFER_RECHARGE: 'CONFIRM_OFFER_RECHARGE',
      N: 'N',
      DURATION_DATA: 'DURATION_DATA',
      OFFER_SEARCH_KEYS: ['key'],
      DYNAMIC_OFFER_SEARCH_KEYS: ['key'],
    },
  },
  QUERY: { DoRecharge: 'DoRecharge', AddUppOffer: 'AddUppOffer', GetOtpToAddOffer: 'GetOtpToAddOffer' },
  STATE_KEY: { FORM_STATE: 'FORM_STATE' },
  STRINGS: { SUCCESS: 'SUCCESS', SENTTO: 'SENTTO', WITHOUT_RECHARGE: 'WITHOUT_RECHARGE', YES: 'YES', ANDROID: 'ANDROID', MONTHLY: 'MONTHLY' },
  HEADER_TITLE: { SPECIAL_OFFER: 'SPECIAL_OFFER' },
  FORMS: { slabList: 'slabList', securityCheck: 'securityCheck', proceedToOffer: 'proceedToOffer' },
}));

jest.mock('store/sales/query', () => ({
  DoRecharge: 'DoRecharge',
  generateOtp: 'generateOtp',
  getOfferPackDetails: 'getOfferPackDetails',
  getInvoiceURL: 'getInvoiceURL',
  fetchBingePlusPack: 'fetchBingePlusPack',
}));

jest.mock('utils/navigationHelper', () => ({
  handleWebViewUrl: jest.fn(),
  arePopupsAllowed: jest.fn(() => true),
}));

jest.mock('utils/externalAppLinkHelper', () => ({
  openInAppBrowser: jest.fn(),
}));

jest.mock('store/sales/actions', () => ({
  slabModel: jest.fn(),
  default: { slabModel: jest.fn() },
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((objs: any) => objs.ios || objs.android || objs.default),
  },
  InteractionManager: {
    runAfterInteractions: jest.fn((cb: any) => cb()),
  },
  StyleSheet: {
    hairlineWidth: 1,
    create: jest.fn((obj: any) => obj),
    flatten: jest.fn((obj: any) => obj),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
    set: jest.fn(),
  },
  NativeModules: {
    SettingsManager: { settings: { AppleLocale: 'en_US', AppleLanguages: ['en'] } },
    I18nManager: { localeIdentifier: 'en_US' },
  },
}));

describe('customerRecharge actions', () => {
  let dispatch: any;
  let getState: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
    window.open = jest.fn().mockReturnValue({ close: jest.fn() });
    (window as any).webkit = undefined;

    dispatch = jest.fn().mockImplementation((a: any) => (typeof a === 'function' ? (a as (d: any, g: any, e: any) => any)(dispatch, getState, undefined) : a));
    (dispatch as any).actions = { slabModel: jest.fn() };
    getState = jest.fn(
      () =>
        ({
          customerRecharge: {
            bingeFlag: 'N',
            bingeOfferSelected: false,
            androidUpgradeSelected: false,
            selectedOffer: {},
            mainFormData: { amount: 100 },
            bingeCategorySelected: 'cat',
            bingeDurationSelected: 'dur',
            dataPacks: [],
          },
          form: {
            FORM_STATE: {
              formActionData: {
                accountInfo: {
                  xtraMileRechargeOffers: [],
                },
              },
              slabList: [{ pin: '123', subscriberInfo: 'sub123', rmn: 'rmn', customerName: 'name', enteredAmt: 100, prevRechargeIdentifier: 'N' }],
            },
          },
        }) as any,
    );
  });

  const getBaseState = () => ({
    customerRecharge: {
      bingeFlag: 'N',
      bingeOfferSelected: false,
      androidUpgradeSelected: false,
      selectedOffer: {},
      mainFormData: { amount: 100 },
      bingeCategorySelected: 'cat',
      bingeDurationSelected: 'dur',
      dataPacks: [],
    },
    form: {
      FORM_STATE: {
        formActionData: {
          accountInfo: {
            xtraMileRechargeOffers: [],
          },
        },
        slabList: [
          { pin: '123', subscriberInfo: 'sub123', rmn: 'rmn', customerName: 'name', enteredAmt: 100, prevRechargeIdentifier: 'N', tskNumber: 'tsk1', rechargeIdentifier: 'N' },
        ],
      },
    },
  });

  test('slabModel', async () => {
    const action = slabModel({});
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('doRecharge androidUpgradeSelected failure', async () => {
    getState.mockReturnValue({
      customerRecharge: { androidUpgradeSelected: true, bingeOfferSelected: false },
      form: { FORM_STATE: { formActionData: {} } },
    } as any);
    const action = doRecharge({ amount: 100 }, 'DoRecharge');
    const result = await (action as any)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('doRecharge slab interrupt', async () => {
    getState.mockReturnValue({
      customerRecharge: { androidUpgradeSelected: false },
      form: {
        FORM_STATE: {
          formActionData: {
            accountInfo: {
              xtraMileRechargeOffers: [{ slab: '100', slabOfferDetails: [{ offerName: 'bonus', partnerMargin: '10', subscriberBonus: '5' }] }],
            },
          },
        },
      },
    } as any);
    const action = doRecharge({ amount: '100' }, 'DoRecharge');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setSlabList).toHaveBeenCalled();
  });

  test('doRecharge success with subIdList', async () => {
    (api.post as jest.Mock).mockResolvedValue({ accountInfo: { subIdList: ['sub1'] } });
    const action = doRecharge({ amount: '100' }, 'DoRecharge');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setSubIdList).toHaveBeenCalled();
  });

  test('doRecharge success with alert', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'Success' });
    const action = doRecharge({ amount: '100' }, 'DoRecharge');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('doRecharge catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'Error' });
    const action = doRecharge({ amount: '100' }, 'DoRecharge');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('Error');
  });

  test('getBonusByOfferName', () => {
    const slabs = [{ slabOfferDetails: [{ offerName: 'test', slabOfferBonus: '10' }] }] as any;
    expect(getBonusByOfferName(slabs, 'test')).toBe('10');
    expect(getBonusByOfferName(slabs, 'nonexistent')).toBeUndefined();
  });

  test('CustomerRechXtraMileRech success', async () => {
    const baseState = getBaseState();
    getState.mockReturnValue({
      ...baseState,
      form: {
        ...baseState.form,
        FORM_STATE: {
          ...baseState.form.FORM_STATE,
          formActionData: {
            ...baseState.form.FORM_STATE.formActionData,
            accountInfo: { xtraMileRechargeOffers: [{ slabOfferDetails: [{ offerName: 'bonus', slabOfferBonus: '10' }] }] },
          },
        },
      },
    } as any);
    (api.post as jest.Mock).mockResolvedValue({ message: 'Success' });
    const action = CustomerRechXtraMileRech({ slab_list: 'Rs. 100 bonus' });
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('CustomerRechXtraMileRech failure', async () => {
    const baseState = getBaseState();
    getState.mockReturnValue(baseState as any);
    (api.post as jest.Mock).mockRejectedValue({ message: 'Error' });
    const action = CustomerRechXtraMileRech({ slab_list: 'Rs. 100 bonus' });
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('CustomerRechXtraMileRechSkipOffer success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'Success' });
    const action = CustomerRechXtraMileRechSkipOffer({});
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('validateSubscriber success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ accountInfo: { subId: 'sub1' } });
    const action = validateSubscriber({ subscriberId: '123' }, 'query');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setFormActionDefault).toHaveBeenCalled();
  });

  test('doOfferRecharge fdoStatus true', async () => {
    getState.mockReturnValue({ form: { FORM_STATE: { formActionData: { fdoStatus: true } } } } as any);
    const action = doOfferRecharge({}, 'query');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('doOfferRecharge with evdPin success', async () => {
    getState.mockReturnValue({
      customerRecharge: { mainFormData: { amount: 100 } },
      form: { FORM_STATE: { formActionData: { fdoStatus: false, accountInfo: { subId: 'sub1' } } } },
    } as any);
    (api.post as jest.Mock).mockResolvedValue({ message: 'Success' });
    const action = doOfferRecharge({ evdPin: '123' }, 'query');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getOtpToAddOffer success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    const action = getOtpToAddOffer({ input: { subscriberId: 'sub1' }, mdn: 'rmn' });
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('searchMahaBumperOffers', () => {
    const action = searchMahaBumperOffers({ searchText: 'test' });
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setSearchBarItems).toHaveBeenCalled();
  });

  test('searchWinbackOffers', () => {
    const action = searchWinbackOffers({ searchText: 'test' });
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setSearchBarItems).toHaveBeenCalled();
  });

  test('searchDynamicOffers', () => {
    getState.mockReturnValue({
      form: { FORM_STATE: { formActionData: { regionOffers: { dynamicOffersList: [{ offerCategoryNT: 'cat' }] } } } },
    } as any);
    const action = searchDynamicOffers({ queryName: 'cat', searchText: 'test' });
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setSearchBarItems).toHaveBeenCalled();
  });

  test('showRechargeConfirmation', () => {
    const action = showRechargeConfirmation({ radioValue: 'WITH_RECHARGE' });
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getOfferPackDetails success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ id: 1 });
    const action = getOfferPackDetails({ isModal: true });
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.setModalLoader).toHaveBeenCalled();
  });

  test('getInvoiceURL Web Success', async () => {
    Platform.OS = 'web' as any;
    (api.post as jest.Mock).mockResolvedValue({ invoiceUrl: 'url' });
    const action = getInvoiceURL({ isDownload: false });
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(handleWebViewUrl).toHaveBeenCalled();
  });

  test('setBingFlag', () => {
    const action = setBingFlag('Y');
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(sliceActions.setBingeFlag).toHaveBeenCalledWith('Y');
  });

  test('toggleAccordion', () => {
    const action = toggleAccordion({});
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setOffersBasisRechargeObject).toHaveBeenCalled();
  });

  test('searchOffersBasisRechargeValue', () => {
    getState.mockReturnValue({ form: { FORM_STATE: { offersBasisRechargeValue: [] } } } as any);
    const action = searchOffersBasisRechargeValue({ searchText: 'test' });
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setSearchBarItems).toHaveBeenCalled();
  });

  test('fetchBingePlusPack success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, details: [{ siebelName: 'pack', price: 100 }] });
    const action = fetchBingePlusPack({}, 'fetchBingePlusPack');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(sliceActions.setBingeCatgeoryData).toHaveBeenCalled();
  });

  test('clearBinge', () => {
    const action = clearBinge();
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(sliceActions.setIsBingeSelected).toHaveBeenCalledWith(false);
  });

  test('removeAndroidSelection', () => {
    const action = removeAndroidSelection();
    (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(sliceActions.setAndroidUpgradeSelected).toHaveBeenCalledWith(false);
  });

  test('CustomerRechXtraMileRech android error', async () => {
    const baseState = getBaseState();
    getState.mockReturnValue({
      ...baseState,
      customerRecharge: { ...baseState.customerRecharge, androidUpgradeSelected: true, bingeOfferSelected: false },
    } as any);
    const action = CustomerRechXtraMileRech({});
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('CustomerRechXtraMileRech with subIdList', async () => {
    const baseState = getBaseState();
    getState.mockReturnValue(baseState);
    (api.post as jest.Mock).mockResolvedValue({ accountInfo: { subIdList: ['sub1'] } });
    const action = CustomerRechXtraMileRech({ slab_list: 'Rs. 100 bonus' });
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(formActions.setSubIdList).toHaveBeenCalled();
  });

  test('doOfferRecharge fdoStatus false', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'FDO Error' });
    const action = doOfferRecharge({ offerAmount: 100, evdPin: '123' }, 'query');
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getInvoiceURL Cordova', async () => {
    Platform.OS = 'web' as any;
    (window as any).webkit = { messageHandlers: { cordova_iab: {} } };
    (api.post as jest.Mock).mockResolvedValue({ invoiceUrl: 'https://example.com/invoice' });
    const action = getInvoiceURL({});
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(handleWebViewUrl).toHaveBeenCalled();
  });

  test('getInvoiceURL Web popup blocked', async () => {
    Platform.OS = 'web' as any;
    (window as any).webkit = undefined;
    (arePopupsAllowed as jest.Mock).mockReturnValue(false);
    (api.post as jest.Mock).mockResolvedValue({ invoiceUrl: 'https://example.com/invoice' });
    const action = getInvoiceURL({});
    await (action as (d: any, g: any, e: any) => any)(dispatch, getState, undefined);
    expect(window.open).toHaveBeenCalled();
  });

  test('fetchBingePlusPack catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = fetchBingePlusPack({}, 'fetchBingePlusPack');
    await (action as any)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });
});
