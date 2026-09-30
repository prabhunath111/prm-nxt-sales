import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/etskMultiTv';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as etskActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as regActions } from 'store/sales/reducer/etskRegSchedular';
import { api } from 'services/apolloClient';
import { MoengageMixpanel } from 'services/moengageMixpanel/index.web';
import {
  etskMultiTvStartingModel,
  validSubIDETSKMulti,
  fillInOfferAndConnections,
  getSecMultiTVDtlsETSKMul,
  eTskMultiTvSubmissionConfirmation,
  doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul,
  etskMultiTvRepushModel,
  etskMultiTvRepush,
} from './etskMultiTv.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: {
    testQuery: 'testQuery',
    doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul: 'doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul',
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setModalLoader: jest.fn(),
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
  showBottomModal: jest.fn(),
  hideBottomModal: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdList: jest.fn(),
  setDealerDetails: jest.fn(),
  setUpdatedFormFields: jest.fn(),
}));

jest.mock('store/sales/reducer/etskMultiTv', () => ({
  sliceActions: {
    etskMultiTvSetSubscriberId: jest.fn(),
    etskMultiTvSetSubscriberData: jest.fn(),
    etskMultiTvSetBoxTypeSelected: jest.fn(),
    etskMultiTvSetOfferSelected: jest.fn(),
    etskSetMultiBoxSelectedDetails: jest.fn(),
    etskMultiTvRepushSetSubscriberId: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setMultipleAutoCompleteData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskSetFlexiPlan: jest.fn(),
    etskSetBoxTypeSelected: jest.fn(),
    etskSetValidatePacksSuccessData: jest.fn(),
    etskSetCustomerDetailsData: jest.fn(),
    etskSetPaidPrice: jest.fn(),
    etskSetEvdPin: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/etskRegSchedular', () => ({
  sliceActions: {
    setCreateWoEtskSuccessData: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('services/moengageMixpanel/index.web', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    ETSMultiTV: {
      ETSKMultiTVPageVisit: { moduleName: 'mod1', attributes: { Status: 'Status' } },
      ETSKMultiSUBIDRMNProceed: { moduleName: 'mod2', attributes: { Status: 'Status', SubscriberID: 'sub', userName: 'user' } },
      ETSKMultiBoxtypeSelectionProceed: {
        moduleName: 'mod3',
        attributes: { Status: 'Status', boxType: 'box', SubscriberID: 'sub', bingeplusSelectedpacks: 'packs', etskMulSelOfr: 'ofr' },
      },
      ETSKMultiSummaryProceed: { moduleName: 'mod4', attributes: { Status: 'Status' } },
      ETSKMultiRechargeConfirm: {
        moduleName: 'mod5',
        attributes: { SubscriberID: 'sub', boxType: 'box', dhamakaMulRechBalChk: 'chk', etskSelectedOffer: 'ofr', rechargeEvdPin: 'pin' },
      },
      ETSKMultiRepushPageVisit: { moduleName: 'mod6', attributes: { Status: 'Status' } },
      ETSKMultiRepushSUBIDRMNProceed: { moduleName: 'mod7', attributes: { Status: 'Status', SubscriberID: 'sub', userName: 'user' } },
    },
    Quotation: {
      QuoteConnectionProceed: { moduleName: 'mod8', attributes: { Status: 'Status', boxType: 'box', noOfBoxes: 'num' } },
    },
  },
}));

jest.mock('config/env', () => ({
  __esModule: true,
  default: {
    ENABLE_MOENGAGE_MIXPANEL_EVENTS: 'true',
  },
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
}));

describe('etskMultiTv actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      user: { info: { userId: 'U123' } },
      etskMultiTv: {
        subscriberId: 'S123',
        subscriberData: { eTskMultiOfrTypeDropdown: [] },
        boxSelectedDetails: { eTSKMinRechargeAmount: '100', disableEditRechDhamakaMultiTV: 'Y' },
      },
      etskRegistration: { finalPrice: '500' },
      etskRegSchedular: { selectedSlot: '10:00 - 11:00', timeSlotsData: { taskId: 'T1' } },
    }));
  });

  test('etskMultiTvStartingModel', () => {
    const action = etskMultiTvStartingModel({});
    action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(etskActions.etskSetFlexiPlan).toHaveBeenCalledWith(0);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('validSubIDETSKMulti success with subIdList', async () => {
    const mockData = { status: true, accountInfo: { subIdList: [1, 2] } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = validSubIDETSKMulti({ subscriberInfo: 'SUB1' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.setModalLoader).toHaveBeenCalled();
    expect(formActions.setSubIdList).toHaveBeenCalledWith([1, 2]);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
    expect(result).toEqual({ status: false, data: mockData });
  });

  test('validSubIDETSKMulti success without subIdList', async () => {
    const mockData = { status: true, accountInfo: { subId: 'SUB1', customerName: 'Name', customerRMN: '123' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = validSubIDETSKMulti({ multiSubId: 'SUB1' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(sliceActions.etskMultiTvSetSubscriberId).toHaveBeenCalledWith('SUB1');
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('validSubIDETSKMulti failure', async () => {
    const mockData = { status: false, message: 'Invalid' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = validSubIDETSKMulti({}, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('Invalid');
    expect(result).toEqual({ status: false, message: 'Invalid' });
  });

  test('validSubIDETSKMulti catch error', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = validSubIDETSKMulti({}, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
  });

  test('fillInOfferAndConnections', () => {
    const action = fillInOfferAndConnections({});
    action(dispatch, getState, undefined);
    expect(formAction.setMultipleAutoCompleteData).toHaveBeenCalled();
    expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
  });

  test('getSecMultiTVDtlsETSKMul validation failures', () => {
    let action = getSecMultiTVDtlsETSKMul({}, 'testQuery');
    let result = action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('strings.selectNumberOfConnections');
    expect(result).toBeNull();

    action = getSecMultiTVDtlsETSKMul({ numberOfConnectionsDropdown: '1' }, 'testQuery');
    result = action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('strings.selectBoxType');

    action = getSecMultiTVDtlsETSKMul({ numberOfConnectionsDropdown: '1', secondary1Dropdown: {} }, 'testQuery');
    result = action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('strings.selectOfferType');
  });

  test('getSecMultiTVDtlsETSKMul success', async () => {
    const mockData = { status: true, customerInformation: { name: 'Name', primaryMobile: '123', email: 'a@b.com' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getSecMultiTVDtlsETSKMul(
      {
        numberOfConnectionsDropdown: '1',
        secondary1Dropdown: { value: 'SD', name: 'SD' },
        OfferDropdown: { nameNT: 'OFR1' },
      },
      'testQuery',
    );
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(sliceActions.etskSetMultiBoxSelectedDetails).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('getSecMultiTVDtlsETSKMul status false', async () => {
    const mockData = { status: false, message: 'Fail' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getSecMultiTVDtlsETSKMul(
      {
        numberOfConnectionsDropdown: '1',
        secondary1Dropdown: { value: 'SD' },
        OfferDropdown: { nameNT: 'OFR1' },
      },
      'testQuery',
    );
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('Fail');
    expect(result).toEqual({ status: false, message: 'Fail' });
  });

  test('getSecMultiTVDtlsETSKMul catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = getSecMultiTVDtlsETSKMul(
      {
        numberOfConnectionsDropdown: '1',
        secondary1Dropdown: { value: 'SD' },
        OfferDropdown: { nameNT: 'OFR1' },
      },
      'testQuery',
    );
    await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
  });

  test('eTskMultiTvSubmissionConfirmation min amount failure', () => {
    const action = eTskMultiTvSubmissionConfirmation({ rechargeAmount: '50' });
    const result = action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('eTskMultiTvSubmissionConfirmation success', () => {
    const action = eTskMultiTvSubmissionConfirmation({ rechargeAmount: '200', evdPin: '1234' });
    const result = action(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
    expect(result).toEqual({ params: { rechargeAmount: '200', evdPin: '1234' }, status: true });
  });

  test('doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul success', async () => {
    const navigate = jest.fn();
    const mockData = { status: true, response: { workOrderId: 'WO1' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul({}, 'testQuery', {}, navigate);
    const result = await action(dispatch, getState, undefined);

    expect(regActions.setCreateWoEtskSuccessData).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
    expect(result).toEqual({ status: true, routeName: 'eTskMultiTvSuccess' });
  });

  test('doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul failure', async () => {
    const mockData = { status: false, message: 'Error' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul({}, 'testQuery', {}, jest.fn());
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('Error');
    expect(result).toEqual({ status: false, message: 'Error' });
  });

  test('doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul({}, 'testQuery', {}, jest.fn());
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false, message: 'error' });
  });

  test('etskMultiTvRepushModel', () => {
    const action = etskMultiTvRepushModel({});
    action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('etskMultiTvRepush RechNo case', async () => {
    const mockData = { status: true, response: { status: 'RechNo' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = etskMultiTvRepush({ subscriberInfoRepush: 'S1' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('strings.multiTvRegister');
    expect(result).toBeNull();
  });

  test('etskMultiTvRepush success subIdList', async () => {
    const mockData = { status: true, response: { accountInfo: { subIdList: [1] } } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = etskMultiTvRepush({ multiSubIdRepush: 'S1' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(formActions.setSubIdList).toHaveBeenCalled();
    expect(result).toEqual({ status: false, data: mockData });
  });

  test('etskMultiTvRepush success final', async () => {
    const mockData = { status: true, response: { subscriberId: 'S1', boxType: 'HD', rechargeAmount: '100' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = etskMultiTvRepush({}, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(sliceActions.etskMultiTvRepushSetSubscriberId).toHaveBeenCalledWith('S1');
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('etskMultiTvRepush failure', async () => {
    const mockData = { status: false, message: 'Fail' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = etskMultiTvRepush({}, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('Fail');
    expect(result).toEqual({ status: false, message: 'Fail' });
  });

  test('etskMultiTvRepush catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = etskMultiTvRepush({}, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
  });

  test('getSecMultiTVDtlsETSKMul success with NA values and missing data', async () => {
    const mockData = {
      status: true,
      customerInformation: {
        name: 'Name',
        primaryMobile: '123',
        email: 'NA',
        district: 'NA',
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getSecMultiTVDtlsETSKMul(
      {
        numberOfConnectionsDropdown: '1',
        secondary1Dropdown: { value: 'SD', name: 'SD' },
        OfferDropdown: { nameNT: 'OFR1' },
      },
      'testQuery',
    );
    await action(dispatch, getState, undefined);
    expect(etskActions.etskSetCustomerDetailsData).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: [],
        district: '',
      }),
    );
  });

  test('eTskMultiTvSubmissionConfirmation with missing state data', () => {
    getState.mockReturnValue({
      etskMultiTv: {
        boxSelectedDetails: null, // trigger ?? '0' in line 246
        subscriberData: { accountInfo: null }, // trigger line 268
      },
      etskRegistration: {},
      etskRegSchedular: null, // trigger line 254
    });
    const action = eTskMultiTvSubmissionConfirmation({ rechargeAmount: '200' });
    const result = action(dispatch, getState, undefined);
    expect(result).toBeDefined();
    // Verify requestInput values if possible, but they are localized in the thunk
  });

  test('eTskMultiTvSubmissionConfirmation with STRINGS.YES', () => {
    getState.mockReturnValue({
      user: { info: { userId: 'U123' } },
      etskMultiTv: {
        boxSelectedDetails: { disableEditRechDhamakaMultiTV: 'Y', eTSKMinRechargeAmount: '100' },
        subscriberData: { accountInfo: { ocsFlag: 'Y' } },
        subscriberId: 'S123',
        offerSelected: 'O1',
        boxType: 'BT1',
      },
      etskRegistration: { finalPrice: '500' },
      etskRegSchedular: { selectedSlot: '10:00 - 11:00', timeSlotsData: { taskId: 'T1' } },
    });
    const action = eTskMultiTvSubmissionConfirmation({ rechargeAmount: '200', evdPin: '1234' });
    action(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('validSubIDETSKMulti success with missing accountInfo handle branches', async () => {
    const mockData = { status: true, accountInfo: undefined };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = validSubIDETSKMulti({}, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(sliceActions.etskMultiTvSetSubscriberId).toHaveBeenCalled();
  });

  test('doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul success with DL branch', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'U123' } },
      etskMultiTv: {
        boxSelectedDetails: { disableEditRechDhamakaMultiTV: 'N' },
        subscriberId: 'S123',
        offerSelected: 'O1',
        boxType: 'BT1',
      },
    });
    const mockData = { status: true, response: { workOrderId: 'WO1' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul({}, 'testQuery', {}, jest.fn());
    await action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('etskMultiTvRepush success final with null response', async () => {
    const mockData = { status: true, response: null };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = etskMultiTvRepush({}, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('eTskMultiTvSubmissionConfirmation min amount failure exact', () => {
    getState.mockReturnValue({
      user: { info: { userId: 'U123' } },
      etskMultiTv: {
        boxSelectedDetails: { eTSKMinRechargeAmount: '100' },
      },
    });
    const action = eTskMultiTvSubmissionConfirmation({ rechargeAmount: '50' });
    const result = action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('strings.minRechargeAmount 100');
    expect(result).toBeNull();
  });

  test('doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul with missing boxSelectedDetails', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'U123' } },
      etskMultiTv: {
        boxSelectedDetails: null, // hit line 321 branch ?? DL
        subscriberId: 'S123',
        offerSelected: 'O1',
        boxType: 'BT1',
      },
    });
    const mockData = { status: true, response: { workOrderId: 'WO1' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doRechargeETSKPickPackConfirmSlotWOrkOrderETSKPureMul({}, 'testQuery', {}, jest.fn());
    await action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('etskMultiTvRepush with totally missing response', async () => {
    const mockData = { status: true, response: undefined }; // hit line 409 ?? {}
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = etskMultiTvRepush({ subscriberInfoRepush: 'S1' }, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('eTskMultiTvSubmissionConfirmation with negative amount to hit ?? branches', () => {
    getState.mockReturnValue({
      user: { info: { userId: 'U123' } },
      etskMultiTv: {
        boxSelectedDetails: { eTSKMinRechargeAmount: undefined }, // hit ?? '0'
      },
    });
    const action = eTskMultiTvSubmissionConfirmation({ rechargeAmount: '-50' }); // -50 < 0 is true
    const result = action(dispatch, getState, undefined);
    expect(result).toBeNull();
  });
});
