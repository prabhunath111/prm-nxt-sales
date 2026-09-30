import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { ROUTE, STRINGS } from 'const';
import { etskRepushModal, removeSpecialChar, etskRepushStatus, fillInSelectedOffers, etskRepush, eTskRepushSubmissionConfirmation, etskRepushSchedular } from './etskRepush.action';

jest.mock('i18next', () => ({
  t: jest.fn((k, _opts) => k),
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockReturnThis(),
  changeLanguage: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({ t: (k: string) => k, i18n: {} }),
}));

jest.mock('services/apolloClient', () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
  showBottomModal: jest.fn(),
  hideBottomModal: jest.fn(),
  showToast: jest.fn(),
  setModalLoader: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn((msg) => ({ type: 'COMMON_SET_ERROR_MESSAGE', payload: msg })),
  reSetErrorMessage: jest.fn(() => ({ type: 'COMMON_RESET_ERROR_MESSAGE' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setUpdatedFormFields: jest.fn((fields) => ({ type: 'FORM_SET_UPDATED_FIELDS', payload: fields })),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((d) => d),
  transformPacksArray: jest.fn((d) => d || []),
  transformSelectedPacksArray: jest.fn((d) => d || []),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
  MoengageMixpanelModules: {
    eTSK_Repush: {
      eTSKRepush_PageVisit: { moduleName: 'M1', attributes: { Status: 'S' } },
      eTSKRepush_BookingFormNumberValidation: { moduleName: 'M2', attributes: { Status: 'S', bookingFormNumber: 'B', userName: 'U' } },
      eTSKRepush_PickPackPage: { moduleName: 'M3', attributes: { Status: 'S', bookingFormNumber: 'B', SubscriberID: 'Sub', boxType: 'BT', etskSelectedOffer: 'O' } },
      eTSKRepush_SummaryPageProceed: { moduleName: 'M4', attributes: { Status: 'S', SubscriberID: 'Sub', bookingFormNumber: 'B' } },
      eTSKRepush_RechargeConfirm: {
        moduleName: 'M5',
        attributes: { Status: 'S', bookingFormNumber: 'B', SubscriberID: 'Sub', etskSelectedOffer: 'O', bingeSelected: 'BS', rechargeAmount: 'RA', requiredRechargeAmount: 'RRA' },
      },
      eTSKRepush_SuccessPage: { moduleName: 'M6', attributes: { Status: 'S' } },
    },
  },
}));

jest.mock('store/sales/reducer/etskRepush', () => ({
  sliceActions: {
    etskRepushSetRepushStatusData: jest.fn((data) => ({ type: 'REPUSH_SET_STATUS_DATA', payload: data })),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDealerDetails: jest.fn((data) => ({ type: 'FORM_SET_DEALER_DETAILS', payload: data })),
    setDropdownData: jest.fn((data) => ({ type: 'FORM_SET_DROPDOWN_DATA', payload: data })),
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskSetCategorySelected: jest.fn(() => ({ type: 'REG_SET_CATEGORY' })),
    etskSetDurationSelected: jest.fn(() => ({ type: 'REG_SET_DURATION' })),
    etskClearSelectedPacksToBuyData: jest.fn(() => ({ type: 'REG_CLEAR_PACKS' })),
    etskSetSelectedPill: jest.fn(() => ({ type: 'REG_SET_PILL' })),
    etskSetBoxTypeSelected: jest.fn(() => ({ type: 'REG_SET_BOX_TYPE' })),
    etskSetCustomerDetailsData: jest.fn(() => ({ type: 'REG_SET_CUST_DETAILS' })),
    etskSetAccountCreationSuccessData: jest.fn(() => ({ type: 'REG_SET_ACC_SUCCESS' })),
    etskSetFiltersData: jest.fn(() => ({ type: 'REG_SET_FILTERS' })),
    etskSetPackSelected: jest.fn(() => ({ type: 'REG_SET_PACK' })),
    etskSetFreePackSelected: jest.fn(() => ({ type: 'REG_SET_FREE_PACK' })),
    etskSetPrimaryBoxPrice: jest.fn(() => ({ type: 'REG_SET_PRI_BOX_PRICE' })),
    etskSetCategoryDropdownData: jest.fn(() => ({ type: 'REG_SET_CAT_DROPDOWN' })),
    etskSetDurationDropdownData: jest.fn(() => ({ type: 'REG_SET_DUR_DROPDOWN' })),
    etskSetEvdPin: jest.fn(() => ({ type: 'REG_SET_EVD_PIN' })),
    etskSetPaidPrice: jest.fn(() => ({ type: 'REG_SET_PAID_PRICE' })),
  },
}));

jest.mock('store/sales/reducer/etskRegSchedular', () => ({
  sliceActions: {
    setCreateWoEtskSuccessData: jest.fn(() => ({ type: 'SCHED_SET_WO_SUCCESS' })),
  },
}));

jest.mock('store/sales/reducer/primaryTvRegistration', () => ({
  sliceActions: {
    setTskValidateData: jest.fn(() => ({ type: 'PRI_SET_TSK_VALIDATE' })),
  },
}));

// Mock the entire actions index to break circularity
jest.mock('store/sales/actions', () => ({}));

describe('etskRepush actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  let navigate: jest.Mock;

  const mockInitialState = {
    user: { info: { userId: 'U1', mdn: '123' } },
    etskRepush: {
      repushStatusData: {
        selectedPacks: [{ nameNT: 'P1' }],
        bookingFormNumber: 'B1',
        subID: 'S1',
      },
    },
    etskRegistration: {
      validatePacksSuccessData: { eTSKMinRechargeAmount: '10', multiTvPackList: [] },
      accountCreationSuccessData: { bookingFormNumber: 'B1', subID: 'S1', ocsFlag: 'F' },
      selectedPacksToBuy: [],
      freePackSelected: 'F1',
      primaryBoxPrice: 100,
      packSelected: 'O1',
      finalPrice: 105,
    },
    etskSchedular: { date: '2023-01-01' },
    etskRegSchedular: { selectedSlot: 'S1', timeSlotsData: { taskId: 'T1' } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    navigate = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
    getState = jest.fn(() => JSON.parse(JSON.stringify(mockInitialState)));
  });

  test('etskRepushModal', () => {
    etskRepushModal({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('removeSpecialChar', () => {
    removeSpecialChar({ char: 'B@1!' })(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ bookingFormNumberRepush: 'B1' }, expect.anything());
  });

  test('etskRepushStatus success (rechargeSuccess NO with metadata fallbacks)', async () => {
    const mockRes = {
      status: true,
      response: {
        rechargeSuccess: STRINGS.NO,
        boxTypes: [{ name: 'Box', nameNT: 'BoxNT' }],
        languages: [],
        geners: [],
        packageName: [{ PackageInfo: [{ uom: STRINGS.MONTHLY, packNameNT: 'PNT', pricePt: '10' }] }],
        PopularPacks: [],
        durations: [],
        etskSelectedOffer: { etskSelectedOfferNT: 'O1' },
        customerInformation: { email: 'NA', district: 'NA' },
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepushStatus({ bookingFormNumberRepush: 'B1' }, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.ETSK_REPUSH_CHANNELS);
  });

  test('etskRepushStatus success (rechargeSuccess NO with valid email and district)', async () => {
    const mockRes = {
      status: true,
      response: {
        rechargeSuccess: STRINGS.NO,
        boxTypes: [{ name: 'Box', nameNT: 'BoxNT' }],
        languages: [],
        geners: [],
        packageName: [{ PackageInfo: [{ uom: STRINGS.MONTHLY, packNameNT: 'PNT', pricePt: '10' }] }],
        PopularPacks: [],
        durations: [],
        etskSelectedOffer: { etskSelectedOfferNT: 'O1' },
        customerInformation: { email: 'valid@mail.com', district: 'ValidDist' },
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepushStatus({ bookingFormNumberRepush: 'B1' }, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.ETSK_REPUSH_CHANNELS);
  });

  test('etskRepushStatus success (rechargeSuccess YES)', async () => {
    const mockRes = {
      status: true,
      response: { rechargeSuccess: STRINGS.YES },
    };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepushStatus({ bookingFormNumberRepush: 'B1' }, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.ETSK_REPUSH_SEL_PACKS);
  });

  test('etskRepushStatus failure status', async () => {
    const mockRes = { status: false, message: 'fail' };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepushStatus({ bookingFormNumberRepush: 'B1' }, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('etskRepushStatus catch error', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    await etskRepushStatus({ bookingFormNumberRepush: 'B1' }, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
  });

  test('fillInSelectedOffers', () => {
    fillInSelectedOffers({})(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ customerBookingFormNumber: 'B1' });
  });

  test('etskRepush success with fallback packs', async () => {
    const customState = {
      ...mockInitialState,
      etskRepush: { repushStatusData: { bookingFormNumber: 'B1', subID: 'S1', selectedPacks: undefined } },
    };
    getState.mockReturnValue(customState);
    const mockRes = { status: true, response: { rechargeAmount: '100' } };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepush({}, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.ETSK_REPUSH_SUCCESS);
  });

  test('etskRepush failure', async () => {
    const mockRes = { status: false, message: 'fail' };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepush({}, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('etskRepush catch error', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    await etskRepush({}, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
  });

  test('eTskRepushSubmissionConfirmation validation fail', () => {
    eTskRepushSubmissionConfirmation({ rechargeAmount: '5' })(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('eTskRepushSubmissionConfirmation validation fail with undefined min amount', () => {
    const customState = {
      ...mockInitialState,
      etskRegistration: { ...mockInitialState.etskRegistration, validatePacksSuccessData: undefined },
    };
    getState.mockReturnValue(customState);
    eTskRepushSubmissionConfirmation({ rechargeAmount: '-5' })(dispatch, getState, undefined);
    // Even if validatePacksSuccessData is undefined, it defaults to '0'. -5 < 0.
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('eTskRepushSubmissionConfirmation success with fallbacks', () => {
    const customState = {
      ...mockInitialState,
      etskSchedular: undefined,
      etskRegSchedular: undefined,
    };
    getState.mockReturnValue(customState);
    eTskRepushSubmissionConfirmation({ rechargeAmount: '100', evdPin: '1' })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('etskRepushSchedular success', async () => {
    const mockRes = { status: true };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepushSchedular({}, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.ETSK_REPUSH_SUCCESS);
  });

  test('etskRepushSchedular failure status', async () => {
    const mockRes = { status: false, message: 'fail' };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await etskRepushSchedular({}, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('etskRepushSchedular catch error', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    await etskRepushSchedular({}, 'QUERY', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
  });
});
