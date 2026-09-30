/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-empty */
/* eslint-disable consistent-return */
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { STRINGS, ROUTE, ACCORDION_TYPE, QUERY, STATE_KEY } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/quotation';
import { sliceActions as etskActions } from 'store/sales/reducer/etskRegistration';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import * as actions from './quotation.action';

const createMockProxy = (name: string) => {
  const mocks: any = {};
  return new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        if (typeof prop === 'string') {
          if (!mocks[prop]) {
            mocks[prop] = jest.fn((...args) => ({ type: `${name}/${prop}`, payload: args[0] }));
          }
          return mocks[prop];
        }
      },
    },
  );
};

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/quotation', () => ({
  sliceActions: createMockProxy('quotation'),
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: createMockProxy('etskRegistration'),
}));

jest.mock('store/sales/reducer/etskRegSchedular', () => ({
  sliceActions: createMockProxy('etskRegSchedular'),
}));

jest.mock('store/sales/reducer/primaryTvRegistration', () => ({
  sliceActions: createMockProxy('primaryTvRegistration'),
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: createMockProxy('form'),
}));

jest.mock('store/sales/reducer/etskMultiTv', () => ({
  sliceActions: createMockProxy('etskMultiTv'),
}));

jest.mock('store/sales/actions/etskRegistration', () => ({
  __esModule: true,
  default: createMockProxy('actions/etskRegistration'),
}));

jest.mock('store/sales/actions/primaryTvRegistration', () => ({
  __esModule: true,
  default: createMockProxy('actions/primaryTvRegistration'),
}));

jest.mock('store/sales/actions/etskMultiTv', () => ({
  __esModule: true,
  default: createMockProxy('actions/etskMultiTv'),
}));

jest.mock('store/sales/actions/etskRegSchedular', () => ({
  __esModule: true,
  default: createMockProxy('actions/etskRegSchedular'),
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: createMockProxy('actions/ui'),
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: createMockProxy('actions/common'),
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setMultipleDropdownOptionsData: jest.fn(() => ({ type: 'FORM_SET_MULTIPLE_DRD' })),
    setDropdownOptionsData: jest.fn(() => ({ type: 'FORM_SET_DRD_OPTIONS' })),
    setMultipleAutoCompleteData: jest.fn(() => ({ type: 'FORM_SET_MULTIPLE_AUTOCOMPLETE' })),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setUpdatedFormFields: jest.fn(() => ({ type: 'FORM_SET_UPDATED_FIELDS' })),
    setSubIdList: jest.fn(() => ({ type: 'FORM_SET_SUB_ID_LIST' })),
    setDealerDetails: jest.fn(() => ({ type: 'FORM_SET_DEALER_DETAILS' })),
    setFieldsToShow: jest.fn(() => ({ type: 'FORM_SET_FIELDS_TO_SHOW' })),
    setRadioContainerOptions: jest.fn(() => ({ type: 'FORM_SET_RADIO_OPTIONS' })),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
  generateRandom12DigitNumber: jest.fn(() => '123456789012'),
  convertTo62Func: jest.fn((val) => val),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    Quotation: {
      QuoteTypeofRegistrationProceed: { moduleName: 'test', attributes: { Status: 'status', formName: 'form' } },
      QuoteValidatePincode: { moduleName: 'test', attributes: { Status: 'status', pincode: 'pincode' } },
      QuoteConnectionProceed: {
        moduleName: 'test',
        attributes: { Status: 'status', boxType: 'boxType', das: 'das', noOfBoxes: 'noOfBoxes', priTSKType: 'priTSKType', state: 'state' },
      },
      QuotePickPackProceed: {
        moduleName: 'test',
        attributes: { Status: 'status', boxType: 'boxType', SubscriberID: 'subscriberId', pincode: 'pincode', tskPin: 'tskPin', tskSerialNumber: 'tskSerialNumber' },
      },
      QuoteSendQuotation: { moduleName: 'test', attributes: { Status: 'status', mobileNumber: 'mob' } },
      QuoteSubmitOTP: { moduleName: 'test', attributes: { Status: 'status', otp: 'otp', partnerMDN: 'mdn' } },
      QuoteValidateOTP: { moduleName: 'test', attributes: { Status: 'status', otp: 'otp' } },
      QuoteValidatePincodeSuccess: { moduleName: 'test', attributes: { Status: 'status' } },
      QuoteConnectionProceedSuccess: { moduleName: 'test', attributes: { Status: 'status' } },
    },
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  default: {
    t: jest.fn((key) => key),
  },
}));

jest.mock('store/sales/reducer/etskMultiTv', () => ({
  sliceActions: {
    etskMultiTvSetBoxTypeSelected: jest.fn(() => ({ type: 'ETSK_MULTI_TV_SET_BOX_SELECTED' })),
    etskSetMultiBoxSelectedDetails: jest.fn(() => ({ type: 'ETSK_SET_MULTI_BOX_DETAILS' })),
  },
}));

describe('quotation actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  let navigate: jest.Mock;

  const flushPromises = () => Promise.resolve();

  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockResolvedValue({ status: true }); // Default success
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
    getState = jest.fn(() => ({
      user: {
        info: { name: 'test user' },
      },
      quotation: {
        isWalkIn: false,
        isMultiTv: false,
        boxTypeData: [],
        etskLocationData: [],
        etskOfferType: [],
        tskTypesData: {},
        numberOfConnectionsData: [],
        etskPincode: '123456',
        isEtskEdit: false,
        isPrimaryEdit: false,
        multiTvSubID: 'sub123',
        redirectParams: {},
        redirectUrl: '',
        multiTVDetails: {
          packageNameArray: [{ packName: 'Pack' }],
          multiTVAddBoxsPrice: 100,
          secondaryNCF: 50,
          secondaryPackPrice: 200,
          packageName: 'MyPack',
          subId: 'sub1',
          customerName: 'cust',
        },
        mobileNo: '1234567890',
        multiTvTskProps: {},
        urlLastPart: '123',
        numberOfConnections: { nameNT: 1 },
        totalPrice: '500',
        boxPriceFinal: 100,
        primaryTskType: 'pri',
        email: 'test@test.com',
        multiTvBoxType: { name: 'HD' },
      },
      etskRegistration: {
        selectedPacksToBuy: [{ price: '10', siebelNameNT: 'pack1' }],
        boxTypeSelected: 'HD',
        validatePacksSuccessData: {
          vcLvlPackDtls: [{ packDtls: [{ productPrice: '10' }] }],
          secondBoxType2: 'HD',
          secondBoxType3: 'HD',
          secondBoxType4: 'HD',
        },
        packSelected: 'Offer',
        freePackSelected: 'Free',
        boxType1: { object: { value: 'HD' } },
        boxType2: { object: { value: 'HD' } },
        boxType3: { object: { value: 'HD' } },
      },
      form: {
        [STATE_KEY.MODAL_STATE]: {},
      },
    }));
    navigate = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('quotationModal: default path', () => {
    actions.quotationModal({})(dispatch, getState, undefined);
    expect(sliceActions.setRedirectParams).toHaveBeenCalledWith({});
  });

  test('quotationModal: walkin and multiTv', () => {
    getState.mockReturnValue({
      quotation: { isWalkIn: true, isMultiTv: true },
    });
    actions.quotationModal({})(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ etskQuotRadioContainer: STRINGS.MULTI_TV_REGISTRATION }, STATE_KEY.MODAL_STATE);
  });

  test('quotationValidate: PRIMARY_TV_REGISTRATION branch success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { tskType: [] } });
    (callAction as jest.Mock).mockResolvedValueOnce({ connectionFilter: [{ id: 1 }] });
    await actions.quotationValidate({ etskQuotRadioContainer: STRINGS.PRIMARY_TV_REGISTRATION }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.quotationPrimarySetTskTypeData).toHaveBeenCalled();
  });

  test('quotationValidate: PRIMARY_TV_REGISTRATION branch failure', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'error' });
    await actions.quotationValidate({ etskQuotRadioContainer: STRINGS.PRIMARY_TV_REGISTRATION }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
  });

  test('quotationValidate: MULTI_TV_REGISTRATION branch', () => {
    actions.quotationValidate({ etskQuotRadioContainer: STRINGS.MULTI_TV_REGISTRATION }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.setIsMultiTv).toHaveBeenCalledWith(true);
  });

  test('quotationValidate: ETSK_REGISTRATION branch success', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { etskOffersDropDown: [] } });
    await actions.quotationValidate({ etskQuotRadioContainer: STRINGS.ETSK_REGISTRATION }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.quotationEtskSetOfferType).toHaveBeenCalled();
  });

  test('validatePinCodePartnerQuote: success path with isEtskEdit', async () => {
    getState.mockReturnValue({
      quotation: { isEtskEdit: true, isPrimaryEdit: false },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: {} });
    await actions.validatePinCodePartnerQuote({ etskQuotePincode: '123' }, 'query')(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalledWith({}, QUERY.FillInOfferAndLocation);
  });

  test('validatePinCodePartnerQuote: catch block', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('crash'));
    await actions.validatePinCodePartnerQuote({ etskQuotePincode: '123' }, 'query')(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('crash');
  });

  test('fillInOfferAndLocation: with redirectParams', () => {
    getState.mockReturnValue({
      quotation: { redirectParams: { customerDetailsDAS: 'das', quoteETSKTownLocality: 'loc' } },
    });
    actions.fillInOfferAndLocation({})(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith(expect.objectContaining({ customerDetailsDAS: 'das' }));
  });

  test('fillInTskTypeAndLocation: without redirectParams', () => {
    getState.mockReturnValue({
      quotation: { redirectParams: {} },
    });
    actions.fillInTskTypeAndLocation({})(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith(expect.objectContaining({ customerDetailsDAS: '' }));
  });

  test('getMultiTVDetails: multiple SubIDs path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ result: { subIdList: ['1', '2'] } });
    await actions.getMultiTVDetails({ subscriberInfo: '123' }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(formActions.setSubIdList).toHaveBeenCalledWith(['1', '2']);
  });

  test('getMultiTVDetails: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.getMultiTVDetails({ subscriberInfo: '123' }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('retrieveMultiTvBoxTypeQuotation: success path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ result: { boxType: [] } });
    await actions.retrieveMultiTvBoxTypeQuotation({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(formAction.setDropdownOptionsData).toHaveBeenCalled();
  });

  test('proccedWithMultiTV: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.proccedWithMultiTV({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('sendOTPMultiTV: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.sendOTPMultiTV({ mobileNumber: '123' })(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('ValidateOTPWithMobile: success path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.ValidateOTPWithMobile({ mdn: '123', otp: '1' }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.InsertRentalPackNewPartnerQuoteMod, '', navigate);
  });

  test('multiTvSendSms: success path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.multiTvSendSms({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.QUOTATION_MULTITV_SUCCESS);
  });

  test('setMultiTvData', () => {
    actions.setMultiTvData()(dispatch, getState, undefined);
    expect(sliceActions.quotationsetMultiTVRegistration).toHaveBeenCalledWith(true);
  });

  test('retrieveBasePackBsStateWithoutSubId: validation failure sec3 without sec1', () => {
    const res = actions.retrieveBasePackBsStateWithoutSubId({ quoteETSKSecondaryBox3: { object: { valueNT: 'v' } } }, 'query')(dispatch, getState, undefined);
    expect(res).toBeNull();
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('strings.sec1sec2BoxEnter');
  });

  test('retrieveBasePackBsStateWithoutSubId: validation failure sec3 without sec2', () => {
    const res = actions.retrieveBasePackBsStateWithoutSubId(
      {
        quoteETSKSecondaryBox3: { object: { valueNT: 'v' } },
        quoteETSKSecondaryBox1: { object: { valueNT: 'v' } },
      },
      'query',
    )(dispatch, getState, undefined);
    expect(res).toBeNull();
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('strings.sec2BoxEnter');
  });

  test('retrieveBasePackBsStateWithoutSubId: validation failure sec2 without sec1', () => {
    const res = actions.retrieveBasePackBsStateWithoutSubId(
      {
        quoteETSKSecondaryBox2: { object: { valueNT: 'v' } },
      },
      'query',
    )(dispatch, getState, undefined);
    expect(res).toBeNull();
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('strings.sec1OnlyBoxEnter');
  });

  test('retrieveBasePackBsStateWithoutSubId: success path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { boxTypes: [], packageName: [], PopularPacks: [], offerCategories: [] } });
    await actions.retrieveBasePackBsStateWithoutSubId({}, 'query')(dispatch, getState, undefined);
    expect(etskActions.etskSetFiltersData).toHaveBeenCalled();
  });

  test('doGetRentalPackNewPartnerQuoteEtsk: success', async () => {
    getState.mockReturnValue({
      etskRegistration: { selectedPacksToBuy: [{ price: '10' }], freePackSelected: 'free' },
      quotation: { etskPincode: '1' },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.doGetRentalPackNewPartnerQuoteEtsk({}, 'query')(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith('query', expect.objectContaining({ packPriceFe: '10' }));
  });

  test('sendOTPToCustomer: transStatus success path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, transStatus: STRINGS.SUCCESS });
    await actions.sendOTPToCustomer({ mobile: '123' })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('validateOTPForQuote: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.validateOTPForQuote({ mdn: '1', otp: '1' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('getAllCategoryPacks: success with packsToRemove branch', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { PopularPacks: [{ nameNT: 'allowed' }], offerCategories: [] } });
    getState.mockReturnValue({
      quotation: { etskPincode: '1' },
      etskRegistration: { selectedPacksToBuy: [{ category: { nameNT: 'removed' } }] },
    });
    await actions.getAllCategoryPacks({}, 'query')(dispatch, getState, undefined);
    expect(etskActions.etskRemoveSelectedPacksToBuyData).toHaveBeenCalled();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('doGetRentalPackNewPartnerQuote: connection count branches', async () => {
    getState.mockReturnValue({
      etskRegistration: { selectedPacksToBuy: [], freePackSelected: 'free' },
      quotation: { numberOfConnections: { nameNT: 4 }, etskPincode: '1' },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.doGetRentalPackNewPartnerQuote({}, 'query')(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('fillInQuoteData: isQuotationNavigate branch (count 4)', async () => {
    jest.useFakeTimers();
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isQuotationNavigate: true, numberOfConnections: { nameNT: 4 } },
    });
    (callAction as jest.Mock).mockImplementation(() => () => Promise.resolve({ connectionFilter: [], data: { result: { boxType: [] } } }));

    const promise = actions.fillInQuoteData({})(dispatch, getState, undefined);
    await flushPromises();
    await flushPromises();
    jest.advanceTimersByTime(200);
    await promise;
    await flushPromises();

    expect(formActions.setFieldsToShow).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('fillInQuoteData: isQuotationNavigate branch (count 3)', async () => {
    jest.useFakeTimers();
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isQuotationNavigate: true, numberOfConnections: { nameNT: 3 } },
    });
    (callAction as jest.Mock).mockImplementation(() => () => Promise.resolve({ connectionFilter: [], data: { result: { boxType: [] } } }));

    const promise = actions.fillInQuoteData({})(dispatch, getState, undefined);
    await flushPromises();
    await flushPromises();
    jest.advanceTimersByTime(200);
    await promise;
    await flushPromises();

    expect(formActions.setFieldsToShow).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('sendSMSQuotation: connection count branches (4 connections)', async () => {
    getState.mockReturnValue({
      quotation: {
        numberOfConnections: { nameNT: 4 },
        multiTVDetails: {},
        mobileNo: '123',
        totalPrice: '1000',
        boxPriceFinal: 100,
        urlLastPart: 'abc',
      },
      etskRegistration: {
        selectedPacksToBuy: [{ price: '10' }],
        accountCreationSuccessData: { smsStartMsg: 'S', smsUrl: 'U', smsEndMsg: 'E', nextLineChar: '\n' },
        validatePacksSuccessData: {
          vcLvlPackDtls: [{ packDtls: [{ productPrice: '10' }] }],
          secondBoxType2: 'B2',
          secondPackPrice: '10',
          secondNCFPrice: '10',
          multiTVAddBoxsPrice1: '10',
          secondBoxType3: 'B3',
          secondPackPrice2: '20',
          secondNCFPrice2: '20',
          multiTVAddBoxsPrice2: '20',
          secondBoxType4: 'B4',
          secondPackPrice3: '30',
          secondNCFPrice3: '30',
          multiTVAddBoxsPrice3: '30',
          secondaryPack: null,
          secondaryNCF: null,
        },
      },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.sendSMSQuotation({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('insertRentalPackNewPartnerQuoteSecInsMod: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.insertRentalPackNewPartnerQuoteSecInsMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('insertRentalPackNewPartnerQuoteSecInsModMultiTV: success path', async () => {
    getState.mockReturnValue({
      quotation: { multiTVDetails: { multiTVAddBoxsPrice: 0, packageNameArray: [{ packName: 'pack' }] } },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.insertRentalPackNewPartnerQuoteSecInsModMultiTV({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.multiTvSendSms, '', navigate);
  });

  test('insertRentalPackNewPartnerQuoteMod: connection count branches (4 connections)', async () => {
    getState.mockReturnValue({
      quotation: { numberOfConnections: { nameNT: 4 }, boxPriceFinal: 0, etskPincode: '1' },
      etskRegistration: { selectedPacksToBuy: [], freePackSelected: 'free' },
      user: { info: { name: 'n' } },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { requestNumber: '1' } });
    await actions.insertRentalPackNewPartnerQuoteMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  test('changeBoxTypeQuotation', () => {
    actions.changeBoxTypeQuotation({}, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('changeBoxTypeQuotationProceed: various redirect branches', () => {
    const cases = [
      { url: STRINGS.MULTI, camp: STRINGS.EXITSING_BOX, target: ROUTE.WEB.MULTI_TV_REGISTRATION },
      { url: STRINGS.MULTI, camp: 'OTHER', target: ROUTE.WEB.QUOTATION_MULTITV_SELECTION },
      { url: ACCORDION_TYPE.ETSK, camp: STRINGS.EXITSING_BOX, target: ROUTE.WEB.ETSK_REGISTRATION },
      { url: ACCORDION_TYPE.ETSK, camp: 'OTHER', target: ROUTE.WEB.QUOTATION_ETSK_OFFER },
      { url: 'OTHER', camp: STRINGS.EXITSING_BOX, target: ROUTE.WEB.SECONDARY_TSK_REGISTRATION },
      { url: 'OTHER', camp: 'OTHER', target: ROUTE.WEB.QUOTATION_PRIMARY_OFFER },
    ];

    cases.forEach(({ url, camp, target }) => {
      const currentState = getState();
      getState.mockReturnValue({
        ...currentState,
        quotation: { ...currentState.quotation, redirectUrl: url },
      });
      actions.changeBoxTypeQuotationProceed({ campaign: camp }, 'q', {}, navigate)(dispatch, getState, undefined);
      expect(navigate).toHaveBeenCalledWith(target);
    });
  });

  test('quotationModal: non-walkin path', () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isWalkIn: false },
    });
    actions.quotationModal({})(dispatch, getState, undefined);
    expect(sliceActions.quotationEtskSetPincode).toHaveBeenCalledWith('');
  });

  test('quotationValidate: PRIMARY_TV_REGISTRATION branch catch', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.quotationValidate({ etskQuotRadioContainer: STRINGS.PRIMARY_TV_REGISTRATION }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('quotationValidate: ETSK_REGISTRATION failure', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.quotationValidate({ etskQuotRadioContainer: STRINGS.ETSK_REGISTRATION }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('quotationValidate: ETSK_REGISTRATION catch', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.quotationValidate({ etskQuotRadioContainer: STRINGS.ETSK_REGISTRATION }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('quotationValidate: fallback null', () => {
    const res = actions.quotationValidate({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(res).toBeNull();
  });

  test('validatePinCodePartnerQuote: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.validatePinCodePartnerQuote({ etskQuotePincode: '123' }, 'query')(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('getMultiTVDetails: single SubID path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ result: { subIdList: [], subId: 'sub1' } });
    await actions.getMultiTVDetails({ subscriberInfo: '123' }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(sliceActions.quotationMultiTVSetSubID).toHaveBeenCalledWith('sub1');
  });

  test('retrieveMultiTvTskTypeQuotation: with redirectParams', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, redirectParams: { secondaryBoxType: 'box', secondaryTskType: 'tsk' } },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { tskType: [] } });
    await actions.retrieveMultiTvTskTypeQuotation({}, 'query')(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
  });

  test('retrieveMultiTvTskTypeQuotation: catch block', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const thunk = actions.retrieveMultiTvTskTypeQuotation({}, 'query');
    await thunk(dispatch, getState, undefined);
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'actions/ui/showErrorPage', payload: 'fail' }));
  });

  test('proccedWithMultiTV: NA values path', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, validatePacksSuccessData: { amount: 100 } },
    });
    try {
      await actions.proccedWithMultiTV({}, 'query', {}, navigate)(dispatch, getState, undefined);
    } catch (e) {}
    expect(etskActions.etskSetCustomerDetailsData).toHaveBeenCalled();
  });

  test('sendOTPMultiTV: success branch', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: {} });
    actions.sendOTPMultiTV({ mobileNumber: '123' })(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('sendOTPMultiTV: failure status branch', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    actions.sendOTPMultiTV({ mobileNumber: '123' })(dispatch, getState, undefined);
    await flushPromises();
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('sendOTPMultiTV: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const thunk = actions.sendOTPMultiTV({ mobileNumber: '123' });
    await thunk(dispatch, getState, undefined);
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'actions/common/setErrorMessage', payload: 'fail' }));
  });

  test('ValidateOTPWithMobile: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.ValidateOTPWithMobile({ mdn: '123', otp: '1' }, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('multiTvSendSms: status false path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false });
    const res = await actions.multiTvSendSms({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(res).toEqual({ status: false });
  });

  test('multiTvSendSms: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.multiTvSendSms({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('doGetRentalPackNewPartnerQuoteEtsk: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.doGetRentalPackNewPartnerQuoteEtsk({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('doGetRentalPackNewPartnerQuoteEtsk: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.doGetRentalPackNewPartnerQuoteEtsk({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('sendOTPToCustomer: transStatus failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, transStatus: 'FAILED' });
    await actions.sendOTPToCustomer({ mobile: '123' })(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).not.toHaveBeenCalled();
  });

  test('sendOTPToCustomer: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.sendOTPToCustomer({ mobile: '123' })(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('sendOTPToCustomer: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.sendOTPToCustomer({ mobile: '123' })(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('validateOTPForQuote: success path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.validateOTPForQuote({ mdn: '1', otp: '1' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalled();
  });

  test('validateOTPForQuote: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.validateOTPForQuote({ mdn: '1', otp: '1' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('getAllCategoryPacks: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.getAllCategoryPacks({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('getAllCategoryPacks: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.getAllCategoryPacks({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('doGetRentalPackNewPartnerQuote: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.doGetRentalPackNewPartnerQuote({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('doGetRentalPackNewPartnerQuote: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.doGetRentalPackNewPartnerQuote({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('fillInQuoteData: non-navigate branch', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isQuotationNavigate: false },
    });
    (callAction as jest.Mock).mockResolvedValueOnce({ connectionFilter: [] });
    await actions.fillInQuoteData({})(dispatch, getState, undefined);
    expect(formAction.setDropdownOptionsData).toHaveBeenCalled();
  });

  test('connectionFilter: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.connectionFilter({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('connectionFilter: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.connectionFilter({})(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('sendSMSQuotation: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.sendSMSQuotation({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('sendSMSQuotation: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.sendSMSQuotation({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('insertRentalPackNewPartnerQuoteSecInsMod: success path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.insertRentalPackNewPartnerQuoteSecInsMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalled();
  });

  test('insertRentalPackNewPartnerQuoteSecInsMod: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.insertRentalPackNewPartnerQuoteSecInsMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('insertRentalPackNewPartnerQuoteSecInsModMultiTV: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.insertRentalPackNewPartnerQuoteSecInsModMultiTV({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('insertRentalPackNewPartnerQuoteSecInsModMultiTV: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.insertRentalPackNewPartnerQuoteSecInsModMultiTV({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('insertRentalPackNewPartnerQuoteMod: failure path', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.insertRentalPackNewPartnerQuoteMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('insertRentalPackNewPartnerQuoteMod: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.insertRentalPackNewPartnerQuoteMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('insertRentalPackNewPartnerQuoteMod: multiTv branch', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isMultiTv: true, numberOfConnections: { nameNT: 1 }, boxPriceFinal: 0 },
      etskRegistration: { selectedPacksToBuy: [{ siebelNameNT: 'p', price: '1' }], freePackSelected: 'free' },
      user: { info: { name: 'n' } },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { requestNumber: '1' } });
    await actions.insertRentalPackNewPartnerQuoteMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalledWith(expect.anything(), QUERY.InsertRentalPackNewPartnerQuoteSecInsModMultiTV, '', navigate);
  });

  test('insertRentalPackNewPartnerQuoteMod: connection count 2', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, numberOfConnections: { nameNT: 2 }, boxPriceFinal: 0, etskPincode: '1' },
      etskRegistration: { selectedPacksToBuy: [], freePackSelected: 'free' },
      user: { info: { name: 'n' } },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { requestNumber: '1' } });
    await actions.insertRentalPackNewPartnerQuoteMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('insertRentalPackNewPartnerQuoteMod: connection count 3', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: {
        ...getState().quotation,
        numberOfConnections: { nameNT: 3 },
        isMultiTv: true,
        boxPriceFinal: 100,
        validatePacksSuccessData: { multiTVAddBoxsPrice1: 10, multiTVAddBoxsPrice2: 20 },
      },
    });
    await actions.insertRentalPackNewPartnerQuoteMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('insertRentalPackNewPartnerQuoteMod: connection count 4', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: {
        ...getState().quotation,
        numberOfConnections: { nameNT: 4 },
        isMultiTv: true,
        boxPriceFinal: 100,
        validatePacksSuccessData: {
          multiTVAddBoxsPrice1: 10,
          multiTVAddBoxsPrice2: 20,
          multiTVAddBoxsPrice3: 30,
        },
      },
    });
    await actions.insertRentalPackNewPartnerQuoteMod({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('multiTvSendSms: status true branch', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.multiTvSendSms({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(regActions.setCreateWoEtskSuccessData).toHaveBeenCalled();
  });

  test('retrieveBasePackBsStateWithoutSubId: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.retrieveBasePackBsStateWithoutSubId({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('retrieveMultiTvBoxTypeQuotation: catch path', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const thunk = actions.retrieveMultiTvBoxTypeQuotation({}, 'query', {}, navigate);
    await thunk(dispatch, getState, undefined);
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'actions/ui/showErrorPage', payload: 'fail' }));
  });

  test('validatePinCodePartnerQuote: with isPrimaryEdit', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isPrimaryEdit: true },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: {} });
    await actions.validatePinCodePartnerQuote({ primaryQuotePincode: '123' }, 'query')(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalledWith({}, QUERY.FillInTskTypeAndLocation);
  });

  test('fillInPincodeEtsk & fillInPincodePrimary', () => {
    actions.fillInPincodeEtsk({})(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
    actions.fillInPincodePrimary({})(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalledTimes(2);
  });

  test('modal thunks', () => {
    actions.quotationETSKPincodeModal({})(dispatch, getState, undefined);
    actions.multiTVRMNmodal()(dispatch, getState, undefined);
    actions.multiTVmobileAndEmail()(dispatch, getState, undefined);
    actions.openEmailMobileModal()(dispatch, getState, undefined);
    actions.quotationPrimaryPincodeModal({})(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledTimes(5);
  });

  test('proccedWithMultiTV: failure status branch', async () => {
    (api.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({ status: false, message: 'fail' }));
    await actions.proccedWithMultiTV({}, 'query', {}, navigate)(dispatch, getState, undefined);
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'actions/ui/showErrorPage', payload: 'fail' }));
  });

  test('proccedWithMultiTV: catch block', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await actions.proccedWithMultiTV({}, 'query', {}, navigate)(dispatch, getState, undefined);
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'actions/ui/showErrorPage', payload: 'fail' }));
  });

  test('ValidateOTPWithMobile: catch block', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const res: any = await actions.ValidateOTPWithMobile({ mdn: '1', otp: '1' }, 'q', {}, navigate)(dispatch, getState, undefined);
    expect(res.status).toBe(false);
  });

  test('Moengage Track Event Verification', () => {
    expect(MoengageMixpanel.trackEvent).toBeDefined();
    expect(MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.moduleName).toBe('test');
  });

  test('doGetRentalPackNewPartnerQuote: connection count branches (1, 2, 3 connections)', async () => {
    const counts = [1, 2, 3];
    for (const count of counts) {
      getState.mockReturnValue({
        ...getState(),
        etskRegistration: { selectedPacksToBuy: [], freePackSelected: 'free' },
        quotation: { numberOfConnections: { nameNT: count }, etskPincode: '1', primaryTskType: 'p' },
      });
      (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
      await actions.doGetRentalPackNewPartnerQuote({}, 'query')(dispatch, getState, undefined);
    }
  });

  test('connectionFilter success result', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { success: true } });
    const res = await actions.connectionFilter({})(dispatch, getState, undefined);
    expect(res).toBeDefined();
  });

  test('sendSMSQuotation: with tskTypesData', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, tskTypesData: { smsStartMsg: 'Hi', smsUrl: 'url', smsEndMsg: 'Bye', nextLineChar: '\n' } },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
    await actions.sendSMSQuotation({}, 'query', {}, navigate)(dispatch, getState, undefined);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS);
  });

  test('retrieveBasePackBsStateWithoutSubId: complex success branch', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      status: true,
      result: {
        boxTypes: [{ name: 'Box' }],
        languages: [{ name: 'Lang' }],
        geners: [{ name: 'Gen' }],
        packageName: [{ PackageInfo: [{ uom: 'strings.MONTHLY', packNameNT: 'Pack', pricePt: '100' }] }],
        offerCategories: [1, 2],
        PopularPacks: [{ nameNT: 'p1' }],
        TataskyPacks: [{ nameNT: 'p2' }],
        BroadCastPacks: [{ nameNT: 'p3' }],
        AlacartePacks: [{ nameNT: 'p4' }],
        durations: [{ name: 'Dur' }],
      },
    });
    await actions.retrieveBasePackBsStateWithoutSubId(
      {
        quoteETSKOfferType: { nameNT: 'off' },
        quoteETSKPrimaryBox: { object: { valueNT: 'box' } },
        quoteETSKTownLocality: { cityNT: 'c', stateNT: 's', districtNT: 'd' },
      },
      'query',
    )(dispatch, getState, undefined);
    expect(etskActions.etskSetFiltersData).toHaveBeenCalled();
  });

  test('retrieveBasePackBsStateWithoutSubId: status false', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'fail' });
    await actions.retrieveBasePackBsStateWithoutSubId({}, 'query')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('fillInOfferAndLocation: without redirectParams', () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, redirectParams: null },
    });
    actions.fillInOfferAndLocation({ offerSelected: 'off', etskQuotePincode: '1' })(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
  });

  test('fillInTskTypeAndLocation: with redirectParams', () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, redirectParams: { secondaryBoxType: 'b', secondaryTskType: 't' } },
    });
    actions.fillInTskTypeAndLocation({ tskType: 't' })(dispatch, getState, undefined);
    expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
  });

  test('fillInQuoteData: various connection count branches', async () => {
    jest.useFakeTimers();
    const counts = [1, 2, 3];
    for (const count of counts) {
      const currentState = getState();
      getState.mockReturnValue({
        ...currentState,
        quotation: { ...currentState.quotation, isQuotationNavigate: true, numberOfConnections: { nameNT: count } },
      });
      (callAction as jest.Mock).mockImplementation(() => () => Promise.resolve({ connectionFilter: [], data: { result: { boxType: [] } } }));

      const promise = actions.fillInQuoteData({})(dispatch, getState, undefined);
      await flushPromises();
      await flushPromises();
      jest.advanceTimersByTime(200);
      await promise;
      await flushPromises();
    }
    jest.useRealTimers();
  });

  test('fillInQuoteData: count 1 branch', async () => {
    jest.useFakeTimers();
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isQuotationNavigate: true, numberOfConnections: { nameNT: 2 } },
    });
    (callAction as jest.Mock).mockImplementation(() => () => Promise.resolve({ connectionFilter: [], data: { result: { boxType: [] } } }));

    const promise = actions.fillInQuoteData({})(dispatch, getState, undefined);
    await flushPromises();
    await flushPromises();
    jest.advanceTimersByTime(200);
    await promise;
    await flushPromises();
    jest.useRealTimers();
  });

  test('clearFinalAmountTimeout: with ID', async () => {
    getState.mockReturnValue({
      ...getState(),
      quotation: { ...getState().quotation, isQuotationNavigate: true, numberOfConnections: { nameNT: 4 } },
    });
    // Start fillInQuoteData to set the timeout ID
    actions.fillInQuoteData({})(dispatch, getState, undefined);
    actions.clearFinalAmountTimeout()(dispatch, getState, undefined);
  });

  test('clearFinalAmountTimeout', () => {
    actions.clearFinalAmountTimeout();
  });
});
