import { STRINGS } from 'const';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import { api } from 'services/apolloClient';
import { transformSelectedPacksArray, getDhamakaRechargeAmount } from 'utils/responseHelper';
import {
  clearFormETSK,
  validatePincode,
  createAccountETSK,
  doGetPacksETSK,
  doGetRentlPackETSK,
  getPackagesURLsTrai,
  addDasValue,
  avoidZero,
  fillAmount,
  clearFinalAmountTimeout,
  eTskRegSubmissionConfirmation,
  etskSchedular,
  checkRentalPackFlag,
  doCheckRentalPackFlagPrice,
} from './etskRegistration.action';

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
  showErrorPage: jest.fn(() => ({ type: 'UI_SHOW_ERROR' })),
  showBottomModal: jest.fn(() => ({ type: 'UI_SHOW_MODAL' })),
  hideBottomModal: jest.fn(() => ({ type: 'UI_HIDE_MODAL' })),
  setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
  showAlert: jest.fn(() => ({ type: 'UI_SHOW_ALERT' })),
  setModalLoader: jest.fn(() => ({ type: 'UI_SET_MODAL_LOADER' })),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn((msg) => ({ type: 'COMMON_SET_ERROR_MESSAGE', payload: msg })),
  reSetErrorMessage: jest.fn(() => ({ type: 'COMMON_RESET_ERROR_MESSAGE' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setUpdatedFormFields: jest.fn((fields) => ({ type: 'FORM_SET_UPDATED_FIELDS', payload: fields })),
  setMultipleDropdownOptionsData: jest.fn((data) => ({ type: 'FORM_SET_MULTIPLE_DROPDOWN', payload: data })),
  setFieldsToDisable: jest.fn((data) => ({ type: 'FORM_SET_FIELDS_DISABLE', payload: data })),
  setFieldsToShow: jest.fn((data) => ({ type: 'FORM_SET_FIELDS_SHOW', payload: data })),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((d) => d),
  filterPackDetails: jest.fn((d) => d),
  transformPacksArray: jest.fn((d) => d || []),
  transformSelectedPacksArray: jest.fn((d) => d || []),
  getDhamakaRechargeAmount: jest.fn((_p) => null),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
  MoengageMixpanelModules: {
    eTSKRegistration: {
      ETSKRegistration_PageVisit: { moduleName: 'M1' },
      ValidatePin: { moduleName: 'M2', attributes: { Status: 'S', pincode: 'P', userName: 'U' } },
      ETSKRegistration_ConnectionProceed: {
        moduleName: 'M3',
        attributes: {
          Status: 'S',
          SubscriberID: 'Sub',
          bookingFormNumber: 'B',
          boxType: 'BT',
          etskSelectedOffer: 'O',
          packPriceFe: 'PF',
          secondary_One_BoxType: 'S1',
          secondary_Three_BoxType: 'S3',
          secondary_Two_BoxType: 'S2',
          selectedPcaksTogetRentalUniqueArray: 'R',
        },
      },
      ETSKRegistration_ConnectionProceedConfirmationPage_Visit: { moduleName: 'M4', attributes: { Status: 'S' } },
      ETSKRegistration_ConnectionProceedConfirmationPage: {
        moduleName: 'M5',
        attributes: {
          Status: 'S',
          SubscriberID: 'Sub',
          UserName: 'U',
          bingeSelected: 'BS',
          bookingFormNumber: 'B',
          etskSelectedOffer: 'O',
          flexiFlag: 'FF',
          multiTVArr: 'MA',
          ocsFlag: 'OF',
          rechargeAmount: 'RA',
          rechargeEvdPin: 'RP',
          requiredRechargeAmount: 'RRA',
          selectedAllPacksCategoryETSKBE: 'SA',
          selectedPacksArray: 'SPA',
          slotSelection: 'SS',
          taskId: 'TID',
          userEvdID: 'UID',
        },
      },
    },
    eTSK_Repush: {
      eTSKRepush_SummaryPageProceed: { moduleName: 'M6', attributes: { Status: 'S', SubscriberID: 'Sub', bookingFormNumber: 'B' } },
    },
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskSetCategorySelected: jest.fn(() => ({ type: 'REG_SET_CAT' })),
    etskSetDurationSelected: jest.fn(() => ({ type: 'REG_SET_DUR' })),
    etskClearSelectedPacksToBuyData: jest.fn(() => ({ type: 'REG_CLEAR_PACKS' })),
    etskSetSelectedPill: jest.fn(() => ({ type: 'REG_SET_PILL' })),
    etskSetValidatePinCodeSuccessData: jest.fn(() => ({ type: 'REG_SET_PIN_SUCCESS' })),
    setEtskAlertConfirm: jest.fn(() => ({ type: 'REG_SET_ALERT' })),
    etskSetCategoryDropdownData: jest.fn(() => ({ type: 'REG_SET_CAT_DROPDOWN' })),
    etskSetDurationDropdownData: jest.fn(() => ({ type: 'REG_SET_DUR_DROPDOWN' })),
    etskSetAccountCreationSuccessData: jest.fn(() => ({ type: 'REG_SET_ACC_SUCCESS' })),
    etskSetCustomerDetailsData: jest.fn(() => ({ type: 'REG_SET_CUST_DETAILS' })),
    etskSetFiltersData: jest.fn(() => ({ type: 'REG_SET_FILTERS' })),
    etskSetPackSelected: jest.fn(() => ({ type: 'REG_SET_PACK' })),
    etskSetBoxTypeSelected: jest.fn(() => ({ type: 'REG_SET_BOX_TYPE' })),
    etskSetFreePackSelected: jest.fn(() => ({ type: 'REG_SET_FREE_PACK' })),
    etskSetPrimaryBoxPrice: jest.fn(() => ({ type: 'REG_SET_PRI_PRICE' })),
    etskSetCategorySelectionPacksData: jest.fn(() => ({ type: 'REG_SET_CAT_PACKS' })),
    etskSetValidatePacksSuccessData: jest.fn(() => ({ type: 'REG_SET_VAL_PACKS' })),
    etskSetEvdPin: jest.fn(() => ({ type: 'REG_SET_EVD_PIN' })),
    etskSetPaidPrice: jest.fn(() => ({ type: 'REG_SET_PAID_PRICE' })),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setUpdatedFormFields: jest.fn(() => ({ type: 'FORM_SET_FIELDS' })),
    setMultipleAutoCompleteData: jest.fn(() => ({ type: 'FORM_SET_AUTOCOMPLETE' })),
    setMultipleDropdownOptionsData: jest.fn(() => ({ type: 'FORM_SET_MULTIPLE_DROPDOWN' })),
    setDealerDetails: jest.fn(() => ({ type: 'FORM_SET_DEALER' })),
    setDropdownData: jest.fn(() => ({ type: 'FORM_SET_DROPDOWN_DATA' })),
  },
}));

jest.mock('store/sales/reducer/primaryTvRegistration', () => ({
  sliceActions: {
    setTskValidateData: jest.fn(() => ({ type: 'PRI_SET_TSK_VAL' })),
  },
}));

jest.mock('store/sales/reducer/etskMultiTv', () => ({
  sliceActions: {
    etskSetMultiBoxSelectedDetails: jest.fn(() => ({ type: 'MULTI_SET_BOX_DETAILS' })),
  },
}));

jest.mock('store/sales/reducer/etskRegSchedular', () => ({
  sliceActions: {
    setCreateWoEtskSuccessData: jest.fn(() => ({ type: 'REG_SCHED_SET_WO' })),
  },
}));

// Mock the entire actions index to break circularity
jest.mock('store/sales/actions', () => ({}));

describe('etskRegistration actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  let navigate: jest.Mock;

  const mockInitialState = {
    quotation: {
      isQuotationNavigate: false,
      etskPincode: '123456',
      etskTownLocality: { locationNT: 'Town' },
      etskOfferSelected: 'Offer',
      etskboxType: 'Box',
      boxType1: 'B1',
      boxType2: 'B2',
      boxType3: 'B3',
      etskOfferType: 'Type',
      numberOfConnections: { nameNT: 1 },
    },
    etskRegistration: {
      accountCreationSuccessData: {
        languagesDropdown: [],
        PopularPacks: [],
        durations: [],
        notapplicableboxBingeplus: [],
        bingepluspayablebox: 'BingeBox',
        BingeplusPacks: [],
        subID: 'S1',
        bookingFormNumber: 'BNF1',
      },
      etskAlertConfirm: false,
      validatePinCodeSuccessData: { cityNT: 'C', districtNT: 'D', stateNT: 'S' },
      selectedPacksToBuy: [{ price: '50', siebelNameNT: 'P1' }],
      boxTypeSelected: 'BoxST',
      packSelected: 'PackS',
      freePackSelected: 'FreeP',
      primaryBoxPrice: '10',
      validatePacksSuccessData: { eTSKMinRechargeAmount: '10' },
      finalPrice: 100,
      flexiPlan: 1,
      evdPin: '1234',
      paidPrice: '0',
      customerDetails: { boxType: 'Box', secondary_One_BoxType: 'S1' },
    },
    user: { info: { userId: 'U1', mdn: '123' } },
    etskMultiTv: { boxSelectedDetails: {} },
    etskSchedular: { date: '2023-01-01' },
    etskRegSchedular: { selectedSlot: 'Slot1', timeSlotsData: { taskId: 'T1' } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    navigate = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
    getState = jest.fn(() => JSON.parse(JSON.stringify(mockInitialState)));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('clearFormETSK comprehensive', () => {
    clearFormETSK()(dispatch, getState, undefined); // false path
    [4, 3, 2, 1].forEach((c) => {
      getState.mockReturnValue({
        ...mockInitialState,
        quotation: { ...mockInitialState.quotation, isQuotationNavigate: true, numberOfConnections: { nameNT: c } },
      });
      clearFormETSK()(dispatch, getState, undefined);
      jest.runAllTimers();
    });
  });

  test('validatePincode all paths', async () => {
    validatePincode({ customerDetailsPinCode: '' }, 'Q')(dispatch, getState, undefined);
    validatePincode({ customerDetailsPinCode: '123' }, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockResolvedValue({ status: true, locations: { dropdown: [] } });
    await validatePincode({ customerDetailsPinCode: '123456' }, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'fail' });
    await validatePincode({ customerDetailsPinCode: '123456' }, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    await validatePincode({ customerDetailsPinCode: '123456' }, 'Q')(dispatch, getState, undefined);
  });

  const dummyParams = {
    customerDetailsOfferType: { nameNT: 'O1' },
    customerDetailsPrimaryBox: { object: { valueNT: 'B1' } },
    customerDetailsPrimaryLanguage: { nameNT: 'L1' },
    customerDetailsTownLocality: { locationNT: 'T1' },
  };

  test('createAccountETSK complex paths and secondary logic', async () => {
    // Secondary box failure branches
    createAccountETSK({ ...dummyParams, customerDetailsSecondaryBox3: { object: { value: 'B3' } } }, 'Q')(dispatch, getState, undefined);
    createAccountETSK({ ...dummyParams, customerDetailsSecondaryBox3: { object: { value: 'B3' } }, customerDetailsSecondaryBox1: { object: { value: 'B1' } } }, 'Q')(
      dispatch,
      getState,
      undefined,
    );
    createAccountETSK({ ...dummyParams, customerDetailsSecondaryBox2: { object: { value: 'B2' } } }, 'Q')(dispatch, getState, undefined);

    // Normal failures
    createAccountETSK({ customerDetailsBuilding: STRINGS.BUILDING }, 'Q')(dispatch, getState, undefined);

    // Box change confirm
    getState.mockReturnValue({
      ...mockInitialState,
      quotation: { ...mockInitialState.quotation, isQuotationNavigate: true, redirectParams: { quoteETSKPrimaryBox: { object: { valueNT: 'B1' } } } },
      etskRegistration: { ...mockInitialState.etskRegistration, etskAlertConfirm: false },
    });
    createAccountETSK({ ...dummyParams, customerDetailsPrimaryBox: { object: { valueNT: 'B2' } } }, 'Q')(dispatch, getState, undefined);

    // Success path
    (api.post as jest.Mock).mockResolvedValue({
      status: true,
      subID: 'S1',
      bookingFormNumber: 'B1',
      boxTypes: [],
      packageName: [{ PackageInfo: [{ uom: STRINGS.MONTHLY, pricePt: '10' }] }],
      languages: [],
      durations: [],
      PopularPacks: [],
      offerCategories: [],
    });
    await createAccountETSK({ ...dummyParams, customerDetailsFirstName: 'F', customerDetailsLastName: 'L' }, 'Q')(dispatch, getState, undefined);

    // Failure/Error paths
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'fail' });
    await createAccountETSK(dummyParams, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    await createAccountETSK(dummyParams, 'Q')(dispatch, getState, undefined);
  });

  test('Packs thunks paths', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await doGetPacksETSK({ value: { nameNT: 'C1' }, filters: {} }, 'Q')(dispatch, getState, undefined);
    await doGetRentlPackETSK({}, 'Q')(dispatch, getState, undefined);
    await getPackagesURLsTrai({}, 'Q')(dispatch, getState, undefined);

    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'fail' });
    await doGetPacksETSK({ value: { nameNT: 'C1' } }, 'Q')(dispatch, getState, undefined);
    await doGetRentlPackETSK({}, 'Q')(dispatch, getState, undefined);

    (api.post as jest.Mock).mockRejectedValue({ message: 'err' });
    await doGetPacksETSK({ value: { nameNT: 'C1' } }, 'Q')(dispatch, getState, undefined);
    await doGetRentlPackETSK({}, 'Q')(dispatch, getState, undefined);
    await getPackagesURLsTrai({}, 'Q')(dispatch, getState, undefined);
  });

  test('Utility actions', () => {
    addDasValue({ searchLocally: { salesSegment: 'S1' } })(dispatch, getState, undefined);
    addDasValue({ searchLocally: {} })(dispatch, getState, undefined);
    avoidZero({ primaryNumber: '01', secondaryNumber: '02' })(dispatch, getState, undefined);

    fillAmount({})(dispatch, getState, undefined);
    jest.runAllTimers();

    getState.mockReturnValue({
      ...mockInitialState,
      etskRegistration: { ...mockInitialState.etskRegistration, paidPrice: '100' },
    });
    (getDhamakaRechargeAmount as jest.Mock).mockReturnValue({ rechargeEnabled: STRINGS.NO });
    fillAmount({})(dispatch, getState, undefined);
    jest.runAllTimers();

    clearFinalAmountTimeout()(dispatch, getState, undefined);
  });

  test('eTskRegSubmissionConfirmation with modal onClose', () => {
    eTskRegSubmissionConfirmation({ rechargeAmount: '5' } as any)(dispatch, getState, undefined);
    eTskRegSubmissionConfirmation({ rechargeAmount: '100', evdPin: '1' } as any)(dispatch, getState, undefined);
    const modalCall = (uiActions.showBottomModal as jest.Mock).mock.calls[0][0];
    modalCall.onClose();
    expect(commonActions.reSetErrorMessage).toHaveBeenCalled();
  });

  test('etskSchedular success/fail', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await etskSchedular({ rechargeAmount: '100' }, 'Q', {}, navigate)(dispatch, getState, undefined);
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'f' });
    await etskSchedular({ rechargeAmount: '100' }, 'Q', {}, navigate)(dispatch, getState, undefined);
    (api.post as jest.Mock).mockRejectedValue({ message: 'e' });
    await etskSchedular({ rechargeAmount: '100' }, 'Q', {}, navigate)(dispatch, getState, undefined);
  });

  test('checkRentalPackFlag complex paths', async () => {
    // MISSING_BINGE_PLUS
    getState.mockReturnValue({
      ...mockInitialState,
      etskRegistration: { ...mockInitialState.etskRegistration, customerDetails: { boxType: 'BingeBox' } },
    });
    (transformSelectedPacksArray as jest.Mock).mockReturnValue(['X~P1']);
    checkRentalPackFlag({}, 'Q')(dispatch, getState, undefined);

    // BOTH_PRESENT
    getState.mockReturnValue({
      ...mockInitialState,
      etskRegistration: {
        ...mockInitialState.etskRegistration,
        customerDetails: { boxType: 'BingeBox' },
        accountCreationSuccessData: {
          ...mockInitialState.etskRegistration.accountCreationSuccessData,
          BingeplusPacks: [{ nameNT: 'P1' }],
          notapplicableboxBingeplus: [{ nameNT: 'P2' }],
        },
      },
    });
    (transformSelectedPacksArray as jest.Mock).mockReturnValue(['X~P1', 'Y~P2']);
    checkRentalPackFlag({}, 'Q')(dispatch, getState, undefined);

    // OK and API paths
    (transformSelectedPacksArray as jest.Mock).mockReturnValue(['X~P1']);
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await checkRentalPackFlag({}, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'f' });
    await checkRentalPackFlag({}, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockRejectedValue({ message: 'e' });
    await checkRentalPackFlag({}, 'Q')(dispatch, getState, undefined);
  });

  test('doCheckRentalPackFlagPrice paths', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await doCheckRentalPackFlagPrice({}, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'f' });
    await doCheckRentalPackFlagPrice({}, 'Q')(dispatch, getState, undefined);
    (api.post as jest.Mock).mockRejectedValue({ message: 'e' });
    await doCheckRentalPackFlagPrice({}, 'Q')(dispatch, getState, undefined);
  });
});
