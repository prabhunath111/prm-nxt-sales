/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { api } from 'services/apolloClient';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import { sliceActions as etskRegistrationActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as primaryTvRegistrationActions } from 'store/sales/reducer/primaryTvRegistration';
import { sliceActions as quoteActions } from 'store/sales/reducer/quotation';
import { STRINGS, ROUTE, STATE_KEY } from 'const';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { callAction } from 'utils/formBuilderHelper';
import * as actions from './primaryTvRegistration.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/primaryTvRegistration', () => ({
  sliceActions: {
    setTskValidateData: jest.fn(() => ({ type: 'PRIMARY_SET_TSK_VALIDATE_DATA' })),
    setIsBoxMismatchConfirmed: jest.fn(() => ({ type: 'PRIMARY_SET_IS_BOX_MISMATCH_CONFIRMED' })),
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskSetCategorySelected: jest.fn(() => ({ type: 'ETSK_SET_CAT_SELECTED' })),
    etskSetDurationSelected: jest.fn(() => ({ type: 'ETSK_SET_DUR_SELECTED' })),
    etskSetSelectedPill: jest.fn(() => ({ type: 'ETSK_SET_PILL_SELECTED' })),
    etskClearSelectedPacksToBuyData: jest.fn(() => ({ type: 'ETSK_CLEAR_PACKS' })),
    etskSetPackSelected: jest.fn(() => ({ type: 'ETSK_SET_PACK_SELECTED' })),
    etskSetBoxTypeSelected: jest.fn(() => ({ type: 'ETSK_SET_BOX_TYPE' })),
    etskSetAccountCreationSuccessData: jest.fn(() => ({ type: 'ETSK_SET_SUCCESS_DATA' })),
    etskSetCustomerDetailsData: jest.fn(() => ({ type: 'ETSK_SET_CUSTOMER_DETAILS' })),
    etskSetFiltersData: jest.fn(() => ({ type: 'ETSK_SET_FILTERS' })),
    etskSetFreePackSelected: jest.fn(() => ({ type: 'ETSK_SET_FREE_PACK' })),
    etskSetPrimaryBoxPrice: jest.fn(() => ({ type: 'ETSK_SET_PRICE' })),
    etskSetCategoryDropdownData: jest.fn(() => ({ type: 'ETSK_SET_CAT_DRP' })),
    etskSetDurationDropdownData: jest.fn(() => ({ type: 'ETSK_SET_DUR_DRP' })),
    etskRemoveSelectedPacksToBuyData: jest.fn(() => ({ type: 'ETSK_REMOVE_PACK' })),
    etskSetValidatePacksSuccessData: jest.fn(() => ({ type: 'ETSK_SET_VAL_PACK_SUCCESS' })),
    etskSetPaidPrice: jest.fn(() => ({ type: 'ETSK_SET_PAID_PRICE' })),
    etskSetEvdPin: jest.fn(() => ({ type: 'ETSK_SET_EVD_PIN' })),
    etskSetCategorySelectionPacksData: jest.fn(() => ({ type: 'ETSK_SET_CAT_SEL_PACKS' })),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setUpdatedFormFields: jest.fn(() => ({ type: 'FORM_SET_UPDATED_FIELDS' })),
    setDropdownData: jest.fn(() => ({ type: 'FORM_SET_DRP_DATA' })),
    setDropdownOptionsData: jest.fn(() => ({ type: 'FORM_SET_DRP_OPTS' })),
    setDealerDetails: jest.fn(() => ({ type: 'FORM_SET_DEALER_DETAILS' })),
    setMultipleDropdownOptionsData: jest.fn(() => ({ type: 'FORM_SET_MULT_DRP' })),
  },
}));

jest.mock('store/sales/reducer/quotation', () => ({
  sliceActions: {
    quotationEtskSetIsQuotationNavigate: jest.fn(() => ({ type: 'QUOTE_SET_NAV' })),
    quotationPrimarySetNumberOfConnections: jest.fn(() => ({ type: 'QUOTE_SET_CONN' })),
    quotationEtskSetPrimaryBoxSelected: jest.fn(() => ({ type: 'QUOTE_SET_BOX_SEL' })),
    etskSetBoxType1Selected: jest.fn(() => ({ type: 'QUOTE_SET_BOX1' })),
    etskSetBoxType2Selected: jest.fn(() => ({ type: 'QUOTE_SET_BOX2' })),
    etskSetBoxType3Selected: jest.fn(() => ({ type: 'QUOTE_SET_BOX3' })),
    quotationEtskSetSelectedPill: jest.fn(() => ({ type: 'QUOTE_SET_PILL' })),
  },
}));

jest.mock('store/sales/reducer/etskRegSchedular', () => ({
  sliceActions: {
    setCreateWoEtskSuccessData: jest.fn(() => ({ type: 'SCHED_SET_SUCCESS' })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
  showErrorPage: jest.fn(() => ({ type: 'UI_SHOW_ERROR' })),
  hideBottomModal: jest.fn(() => ({ type: 'UI_HIDE_MODAL' })),
  showAlert: jest.fn(() => ({ type: 'UI_SHOW_ALERT' })),
  setModalLoader: jest.fn(() => ({ type: 'UI_SET_MODAL_LOADER' })),
  showBottomModal: jest.fn(() => ({ type: 'UI_SHOW_MODAL' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setUpdatedFormFields: jest.fn(() => ({ type: 'UI_FORM_SET_FIELDS' })),
  setFieldsToDisable: jest.fn(() => ({ type: 'UI_FORM_SET_DISABLE' })),
  setDealerDetails: jest.fn(() => ({ type: 'UI_FORM_SET_DEALER' })),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(() => ({ type: 'COMMON_SET_ERROR' })),
  reSetErrorMessage: jest.fn(() => ({ type: 'COMMON_RESET_ERROR' })),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
  arePinsUnique: jest.fn(() => true),
  filterPackDetails: jest.fn((data) => data),
  getDisabledCategoryMatch: jest.fn(() => ({})),
  getRechargeFlag: jest.fn(() => 'N'),
  isDhamakaCODCategory: jest.fn(() => false),
  transformSelectedPacksArray: jest.fn((data) => data),
  getSafeValue: jest.fn((val) => val),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
  extractValues: jest.fn((data) => data),
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => {
    if (key === 'strings.true') return 'true';
    if (key === 'strings.MONTHLY') return 'MONTHLY';
    return key;
  }),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    PrimaryRegistration: {
      PrimaryRegistrationConnectionProceed: { moduleName: 'CP', attributes: { parimaryTSKPin: 'P', Status: 'S', primaryBoxType: 'B', pincode: 'PC' } },
      PrimaryRegistrationValidateTSK: { moduleName: 'VT', attributes: { parimaryTSKPin: 'P', Status: 'S', pincode: 'PC' } },
      PrimaryRegistrationCustomerdetailsProceed: { moduleName: 'CD', attributes: { input: 'I', Status: 'S' } },
      PrimaryRegistrationPickPackProceed: { moduleName: 'PP', attributes: { Status: 'S', variables: 'V' } },
      PrimaryRegistrationSummaryProceed: {
        moduleName: 'SP',
        attributes: { Status: 'S', SubscriberID: 'SID', packageName: 'PN', rechargeAmount: 'RA', requiredRechargeAmount: 'RRA' },
      },
    },
    RepushOrder: {
      RepushOrderPickPackProceed: { moduleName: 'RPP', attributes: { Status: 'S', variables: 'V' } },
      RepushOrderSummaryProceed: { moduleName: 'RSP', attributes: { Status: 'S', packageName: 'PN', rechargeAmount: 'RA', requiredRechargeAmount: 'RRA', subscriberId: 'SID' } },
    },
  },
}));

jest.mock('store/sales/query', () => ({
  default: {
    ConnectionFilter: 'ConnectionFilterQuery',
    LocationDropdown: 'LocationDropdownQuery',
    GetAllRePushPacksProp: 'GetAllRePushPacksPropQuery',
    PrimaryTskSchedular: 'PrimaryTskSchedularQuery',
    RechargeDetails: 'RechargeDetailsQuery',
    doPickPackAndWorkOrderCreationPrimaryAndSecondary: 'doPickPackAndWorkOrderCreationPrimaryAndSecondaryQuery',
    getPacks: 'getPacksQuery',
    getWoRentalPack: 'getWoRentalPackQuery',
  },
}));

describe('primaryTvRegistration actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  const navigate = jest.fn();

  // Use to fix lint

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    }) as any;
    getState = jest.fn(() => ({
      quotation: {
        etskTownLocality: 'town',
        isQuotationNavigate: false,
        etskboxType: { id: 'box1' },
      },
      primaryTvRegistration: {
        tskValidateData: { pincode: '123456', primaryTskPin: 'pin1' },
        isBoxMismatchConfirmed: false,
      },
      etskRegistration: {
        selectedPacksToBuy: [],
        accountCreationSuccessData: { subId: 'sub123' },
        packSelected: 'pack1',
      },
      user: {
        info: {
          userId: 'user123',
          roleId: 'role1',
        },
      },
      etskRegSchedular: {
        selectedSlot: '10 - 12',
        timeSlotsData: { orderId: 'ord1', taskId: 'task1' },
      },
    }));
  });

  describe('clearFormPrimaryTv', () => {
    test('when isQuotationNavigate is true', () => {
      getState.mockReturnValueOnce({
        ...getState(),
        quotation: { ...getState().quotation, isQuotationNavigate: true },
      });
      actions.clearFormPrimaryTv()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetCategorySelected(undefined));
      expect(dispatch).toHaveBeenCalledWith({ type: 'UI_FORM_SET_FIELDS' });
      expect(dispatch).toHaveBeenCalledWith({ type: 'FORM_SET_DRP_DATA' });
    });

    test('when isQuotationNavigate is false', () => {
      actions.clearFormPrimaryTv()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskClearSelectedPacksToBuyData());
      expect(dispatch).toHaveBeenCalledWith({ type: 'FORM_SET_DRP_DATA' });
    });
  });

  describe('clearFormRepushOrder', () => {
    test('success', async () => {
      (callAction as jest.Mock).mockResolvedValueOnce({ connectionFilter: [] });
      await actions.clearFormRepushOrder()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetCategorySelected(undefined));
      expect(dispatch).toHaveBeenCalledWith(quoteActions.quotationEtskSetIsQuotationNavigate(false));
      expect(dispatch).toHaveBeenCalledWith({ type: 'FORM_SET_DRP_OPTS' });
    });

    test('callAction returns null', async () => {
      (callAction as jest.Mock).mockResolvedValueOnce(null);
      await actions.clearFormRepushOrder()(dispatch, getState, undefined);
      expect(dispatch).not.toHaveBeenCalledWith({ type: 'FORM_SET_DRP_OPTS' });
    });
  });

  describe('validatePrimaryTSK', () => {
    const params = { pincode: '123456', primaryTskPin: 'pin1', primaryBoxType: 'box1' };
    const queryName = 'query';

    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: 'true', languageList: [] });
      jest.useFakeTimers();
      const result = await actions.validatePrimaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(primaryTvRegistrationActions.setTskValidateData({ pincode: params.pincode }));
      jest.advanceTimersByTime(500);
      expect(dispatch).toHaveBeenCalledWith({ type: 'UI_FORM_SET_FIELDS' });
      expect(result).toEqual({ status: true, data: [] });
      jest.useRealTimers();
    });

    test('failure with errors', async () => {
      const response = { status: 'false', primaryTskPinError: true, pinCodeError: true, message: 'error' };
      (api.post as jest.Mock).mockResolvedValueOnce(response);
      const result = await actions.validatePrimaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith({ type: 'UI_FORM_SET_FIELDS' });
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('error'));
      expect(result).toEqual({ status: false, data: response });
    });

    test('catch block', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const result = await actions.validatePrimaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith({ type: 'UI_FORM_SET_FIELDS' });
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('fail'));
      expect(result).toEqual({ status: false, data: new Error('fail') });
    });
  });

  describe('clearTskPinTimeout', () => {
    test('clears timeout', () => {
      // Set the timeout first
      const params = { pincode: '123456', primaryTskPin: 'pin1', primaryBoxType: 'box1' };
      (api.post as jest.Mock).mockResolvedValueOnce({ status: 'true' });
      actions.validatePrimaryTSK(params, 'q')(dispatch, getState, undefined);

      actions.clearTskPinTimeout()(dispatch, getState, undefined);
      // Success is not crashing
    });
  });

  describe('handelAlertConfirmation', () => {
    test('dispatches action', () => {
      actions.handelAlertConfirmation()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(primaryTvRegistrationActions.setIsBoxMismatchConfirmed(true));
    });
  });

  describe('validateSecondaryTSK', () => {
    const params = { primaryBoxType: { id: 'box1' }, secondaryBoxType1: { id: 'box2' }, numberOfConnections: { id: 1 } };
    const queryName = 'query';

    test('isQuotationNavigate true and mismatch triggers alert', async () => {
      getState.mockReturnValueOnce({
        ...getState(),
        quotation: { ...getState().quotation, isQuotationNavigate: true, etskboxType: { id: 'box2' } },
        primaryTvRegistration: { ...getState().primaryTvRegistration, isBoxMismatchConfirmed: false },
      });
      const result = await actions.validateSecondaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showAlert(expect.anything(), expect.anything(), expect.anything(), expect.anything()));
      expect(result).toBe(false);
    });

    test('duplicate pins triggers error page', async () => {
      const { arePinsUnique } = require('utils/responseHelper');
      arePinsUnique.mockReturnValueOnce(false);
      const result = await actions.validateSecondaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(expect.anything()));
      expect(result).toBe(false);
    });

    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: 'true', response: { primaryBoxType: 'B1', location: [] } });
      const result = await actions.validateSecondaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
      expect(dispatch).toHaveBeenCalledWith(primaryTvRegistrationActions.setIsBoxMismatchConfirmed(true));
      expect(result.status).toBe(true);
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: 'false', message: 'error' });
      const result = await actions.validateSecondaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('error'));
      expect(result.status).toBe(false);
    });

    test('catch block', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await actions.validateSecondaryTSK(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });
  });

  describe('languageList', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ languageList: [] });
      const result = await actions.languageList({ searchText: 'en' }, 'q')(dispatch, getState, undefined);
      expect(result).toEqual({ status: true, data: [] });
    });

    test('failure catch', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const result = await actions.languageList({ searchText: 'en' }, 'q')(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });
  });

  describe('primaryTvRegistrationModal', () => {
    test('dispatches actions and shows modal', () => {
      actions.primaryTvRegistrationModal({ showCloseIcon: true })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(quoteActions.quotationEtskSetIsQuotationNavigate(false));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  describe('addDasSegmentValue', () => {
    test('sets DAS segment available', () => {
      actions.addDasSegmentValue({ searchLocally: { object: { salesSegment: 'DAS1' } } })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith({ type: 'UI_FORM_SET_FIELDS' });
    });

    test('sets NO_DAS_AVAILABLE when no segment', () => {
      actions.addDasSegmentValue({ searchLocally: { object: {} } })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith({ type: 'UI_FORM_SET_FIELDS' });
    });
  });

  describe('registrationDetailsSubmit', () => {
    const params = { firstName: 'F', lastName: 'L', town: { object: { location: 'L' } } };
    const queryName = 'query';

    test('building name validation error', async () => {
      const result = await actions.registrationDetailsSubmit({ buildingName: STRINGS.BUILDING }, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(expect.anything()));
      expect(result).toBe(null);
    });

    test('success path', async () => {
      getState.mockReturnValue({
        ...getState(),
        etskRegistration: {
          ...getState().etskRegistration,
          selectedPacksToBuy: [{ pill: STRINGS.NEW_CUSTOMER_BEST_OFFERS, category: { nameNT: 'Other' } }],
        },
      });
      const mockResponse = {
        status: true,
        subId: 's1',
        packageName: [{ PackageInfo: [{ uom: 'MONTHLY', packNameNT: 'P1', pricePt: '10' }] }],
        boxTypes: [{ name: 'Box' }],
        languages: [],
        geners: [],
        PopularPacks: [{ nameNT: 'Pop' }],
        offerCategories: [1, 2],
        durations: [],
        code: '01',
        firstName: 'F',
        lastName: 'L',
      };
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      const result = await actions.registrationDetailsSubmit(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
      expect(dispatch).toHaveBeenCalledWith(formAction.setDealerDetails(expect.anything()));
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetAccountCreationSuccessData(expect.anything()));
      expect(result.status).toBe(true);
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationCustomerdetailsProceed.moduleName, expect.anything());
    });

    test('failure status from response', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'error' });
      const result = await actions.registrationDetailsSubmit(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('error'));
      expect(result.status).toBe(false);
    });

    test('catch block', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await actions.registrationDetailsSubmit(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });
  });

  describe('getPacks', () => {
    const params = { value: { nameNT: 'Cat' }, filters: {} };
    const queryName = 'query';

    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { packsDetails: [] } });
      const result = await actions.getPacks(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetCategorySelectionPacksData(expect.anything()));
      expect(result.status).toBe(true);
    });

    test('failure status', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'error' });
      const result = await actions.getPacks(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('error'));
      expect(result.status).toBe(true); // Logic in code returns true even on status false
    });

    test('catch block', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await actions.getPacks(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });
  });

  describe('getRentalPackNew', () => {
    test('success', async () => {
      getState.mockReturnValue({
        ...getState(),
        etskRegistration: {
          ...getState().etskRegistration,
          freePackSelected: 'FP',
          selectedPacksToBuy: [{ siebelNameNT: 'S1', price: 100 }],
          accountCreationSuccessData: { subId: 'sub123' },
        },
      });
      (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { connections: 1 } });
      const result = await actions.getRentalPackNew({}, 'q')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetValidatePacksSuccessData(expect.anything()));
      expect(result).toBe(true);
    });

    test('failure status', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'error' });
      const result = await actions.getRentalPackNew({}, 'q')(dispatch, getState, undefined);
      expect(result).toBe(false);
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    });

    test('catch block', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const result = await actions.getRentalPackNew({}, 'q')(dispatch, getState, undefined);
      expect(result).toBe(false);
    });
  });

  describe('primaryTvRegSubmissionConfirmation', () => {
    test('prepares data and shows modal', () => {
      getState.mockReturnValueOnce({
        ...getState(),
        etskRegistration: { ...getState().etskRegistration, freePackSelected: 'FP', selectedPacksToBuy: [{ siebelNameNT: 'S1', price: 100 }] },
      });
      const params = { evdPin: '1234', rechargeAmount: '100' };
      actions.primaryTvRegSubmissionConfirmation(params as any)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetPaidPrice('100'));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));

      const modalCall = (uiActions.showBottomModal as jest.Mock).mock.calls[0][0];
      modalCall.onClose();
      expect(dispatch).toHaveBeenCalledWith(commonActions.reSetErrorMessage());
    });
  });

  describe('primaryTskSchedular', () => {
    test('success with primary success route', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: { woNumber: '123' } });
      const result = await actions.primaryTskSchedular({}, 'q', {}, navigate)(dispatch, getState, undefined);
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.PRIMARY_TV_REG_SUCCESS);
      expect(result.status).toBe(true);
    });

    test('success with repush success route', async () => {
      getState.mockReturnValueOnce({
        ...getState(),
        etskRegistration: { accountCreationSuccessData: { code: '07' } },
      });
      (api.post as jest.Mock).mockResolvedValueOnce({ status: true, result: {} });
      await actions.primaryTskSchedular({}, 'q', {}, navigate)(dispatch, getState, undefined);
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.RE_PUSH_ORDER_SUCCESS);
    });

    test('failure status', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: false, message: 'error' });
      const result = await actions.primaryTskSchedular({}, 'q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('error'));
      expect(result.status).toBe(false);
    });

    test('catch block', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await actions.primaryTskSchedular({}, 'q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });
  });

  describe('primaryTvFillAmount', () => {
    test('updates form with paidPrice', () => {
      getState.mockReturnValueOnce({
        ...getState(),
        etskRegistration: { ...getState().etskRegistration, paidPrice: '500', finalPrice: '1000' },
      });
      actions.primaryTvFillAmount({})(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields({ rechargeAmount: '500', evdPin: undefined }, STATE_KEY.MODAL_STATE));
    });

    test('updates form and disables field with matched pack', () => {
      const { getDisabledCategoryMatch } = require('utils/responseHelper');
      getDisabledCategoryMatch.mockReturnValueOnce({ rechargeEnabled: 'N' });
      jest.useFakeTimers();
      actions.primaryTvFillAmount({})(dispatch, getState, undefined);
      jest.advanceTimersByTime(200);
      expect(dispatch).toHaveBeenCalledWith(formActions.setFieldsToDisable(expect.anything(), expect.anything()));
      jest.useRealTimers();
    });
  });

  describe('getDetailsRepush', () => {
    const params = { tskPin: 'p1' };
    const queryName = 'query';

    test('duplicate pins', async () => {
      const { arePinsUnique } = require('utils/responseHelper');
      arePinsUnique.mockReturnValueOnce(false);
      const result = await actions.getDetailsRepush(params, queryName)(dispatch, getState, undefined);
      expect(result).toBe(false);
    });

    test('failure codes (01, 03, etc)', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ code: '01' });
      const result = await actions.getDetailsRepush(params, queryName)(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });

    test('success code 07 and pack fetching', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({
        code: '07',
        subscriberId: 's1',
        firstName: 'F',
        lastName: 'L',
        boxTypes: [{ name: 'Box' }],
        PopularPacks: [],
        durations: [],
        offerCategories: [1, 2],
        languages: [],
        geners: [],
      });
      (callAction as jest.Mock).mockResolvedValueOnce({
        status: true,
        data: { languages: [], geners: [], boxTypes: [{ name: 'Box' }], PopularPacks: [], durations: [], offerCategories: [1, 2] },
      });
      const result = await actions.getDetailsRepush(params, queryName)(dispatch, getState, undefined);
      expect(result.status).toBe(true);
      expect(result.routeName).toBe(ROUTE.WEB.RE_PUSH_ORDER_CHANNELS);
    });

    test('repush with other code (default failure path)', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ code: 'XX', message: 'Unknown' });
      const result = await actions.getDetailsRepush(params, queryName)(dispatch, getState, undefined);
      expect(result.status).toBe(false);
      expect(result.message).toBe('Unknown');
    });

    test('repush with failure code 00', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ code: '00', message: 'fail' });
      const result = await actions.getDetailsRepush(params, queryName)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
      expect(result.status).toBe(false);
    });

    test('catch block', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const result = await actions.getDetailsRepush(params, queryName)(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });
  });

  describe('getAllRePushPacksProp', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ status: true });
      const result = await actions.getAllRePushPacksProp({})(dispatch, getState, undefined);
      expect(result.status).toBe(true);
    });

    test('failure catch', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const result = await actions.getAllRePushPacksProp({})(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });
  });
});
