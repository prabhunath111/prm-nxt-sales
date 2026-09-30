import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/exclusiveStore';
import { sliceActions as quotationAction } from 'store/sales/reducer/quotation';
import { api } from 'services/apolloClient';
import { STRINGS, FORMS, QUERY, ROUTE, CONNECTION_TYPE, STATE_KEY } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import {
  getWalkInDetailsData,
  setWalkInDetails,
  getOverThePhoneLeadDetails,
  setOverThePhoneLead,
  getTeleCallingData,
  setTeleCallingDetails,
  getOutboundActivityLeadData,
  setOutBoundDetails,
  submitWalkinDetails,
  getSpecialCommentdata,
  getSpecialCommentsData,
  getStoreOpeningStoreClosingData,
  multiTVBoxType,
  getStoreOpeningQuestion,
  getStoreClosingQuestion,
  checkStoreStatus,
  submitStoreAns,
  submitDemoForm,
  changeExclusiveAction,
  setNewConnectionDetails,
  getNewConnectionDetails,
} from './exclusiveStore.action';

jest.mock('store/sales/reducer/exclusiveStore', () => ({
  sliceActions: {
    setActionType: jest.fn(),
    setNewConnectionDetails: jest.fn(),
    setDemoFormQuestions: jest.fn(),
    setMultiTvData: jest.fn(),
    setIsStoreOpen: jest.fn(),
    exclusiveStoreOpenData: jest.fn(),
    setExclusiveStoreDistSuccessData: jest.fn(),
    setNeedValidation: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/quotation', () => ({
  sliceActions: {
    quotationEtskSetPincode: jest.fn(),
    setisWalkIn: jest.fn(),
    setIsMultiTv: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/customerService', () => ({
  sliceActions: {
    setSubscriberData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(),
  hideBottomModal: jest.fn(),
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  setModalLoader: jest.fn(),
  showAlert: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setRadioContainerOptions: jest.fn(),
  setUpdatedFormFields: jest.fn(),
  setFieldsToDisable: jest.fn(),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    ExclusiveStore: {
      ExclusiveStoreSpecialCommentsProceed: { moduleName: 'm', attributes: { Status: 's', modName: 'm', partnerId: 'p', reason: 'r', remarks: 're' } },
      ExclusiveStoreWalkInDetailsPageProceed: { moduleName: 'm', attributes: { Status: 's', FormName: 'f' } },
      ExclusiveStoreStoreOpen: { moduleName: 'm', attributes: { Status: 's', storeOpen: 'so' } },
      ExclusiveStoreStoreClose: { moduleName: 'm', attributes: { Status: 's', storeClose: 'sc' } },
    },
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

describe('exclusiveStore actions', () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    user: { info: { userId: 'u1' } },
    quotation: { etskPincode: 'p1' },
    exclusiveStore: { actionType: 'a1', newConnectionDetails: {} },
  }));
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const navigatCases = [
    { pin: STRINGS.NEW_CONNECTION, route: ROUTE.WEB.PRIMARY_TV_REGISTRATION },
    { pin: STRINGS.RECHARGE, route: ROUTE.WEB.CUSTOMER_RECHARGE },
    { pin: STRINGS.SERVICE_COMPLAINT, route: ROUTE.WEB.CUSTOMER_SERVICE },
    { pin: STRINGS.ENQUIRY_NEW_CONNECTION, route: ROUTE.WEB.QUOTATION },
    { pin: STRINGS.ENQUIRY_PACK, route: ROUTE.WEB.MODIFY_PACK },
    { pin: STRINGS.SALES_VAS, route: ROUTE.WEB.CUSTOMER_OFFERS },
    { pin: STRINGS.BOX_UPGRADE, route: ROUTE.WEB.BOX_UPGRADE },
  ];

  const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
  };

  describe('Modal Launchers', () => {
    test('getWalkInDetailsData', () => {
      getWalkInDetailsData()(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ formName: FORMS.walkInDetails }));
    });

    test('getOverThePhoneLeadDetails', () => {
      getOverThePhoneLeadDetails({}, 'q', {})(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ formName: FORMS.overThePhoneDetails }));
    });

    test('getTeleCallingData', () => {
      getTeleCallingData()(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ formName: FORMS.teleCallingDetails }));
    });

    test('getOutboundActivityLeadData', () => {
      getOutboundActivityLeadData()(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ formName: FORMS.outBoundDetails }));
    });
  });

  describe('Lead Setters', () => {
    const campaigns = [
      { campaign: STRINGS.NEW_CONNECTION, expected: FORMS.newConnectionDetails },
      { campaign: STRINGS.RECHARGE, expected: FORMS.rechargeLead },
      { campaign: STRINGS.SERVICE_COMPLAINT, expected: FORMS.serviceComplaintLead },
      { campaign: STRINGS.ENQUIRY_NEW_CONNECTION, expected: FORMS.newConnectionEnquiryDetails },
      { campaign: STRINGS.ENQUIRY_PACK, expected: FORMS.packEnquiryDetails },
      { campaign: STRINGS.SALES_VAS, expected: FORMS.salesOfValueLead },
      { campaign: STRINGS.BOX_UPGRADE, expected: FORMS.boxUpgradeDetailsLead },
      { campaign: STRINGS.GENERAL_ENQUIRY, expected: FORMS.generalEnquiryLead },
      { campaign: 'OTHER', expected: FORMS.walkinDetailsLead },
    ];

    test.each(campaigns)('setWalkInDetails for %s', ({ campaign, expected }) => {
      setWalkInDetails({ campaign })(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalledWith(expect.objectContaining({ formName: expected }));
    });

    test.each(campaigns)('setOverThePhoneLead for %s', ({ campaign }) => {
      setOverThePhoneLead({ campaign })(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalled();
    });

    test.each(campaigns)('setTeleCallingDetails for %s', ({ campaign }) => {
      setTeleCallingDetails({ campaign }, 'q', {})(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalled();
    });

    test.each(campaigns)('setOutBoundDetails for %s', ({ campaign }) => {
      setOutBoundDetails({ campaign }, 'q', {})(dispatch, getState, undefined);
      expect(uiActions.showBottomModal).toHaveBeenCalled();
    });
  });

  describe('submitWalkinDetails', () => {
    const params = { subscriberID: 's1', subscriberRmn: 'r1', subscriberName: 'n1', pinCode: 'p1', connectionType: 'c1' };

    test('success with SPECIAL_COMMENTS', async () => {
      (getState as jest.Mock).mockReturnValue({
        user: { info: { userId: 'u1' } },
        quotation: { etskPincode: 'p1' },
        exclusiveStore: { actionType: STRINGS.SPECIAL_COMMENTS },
      });
      (api.post as jest.Mock).mockResolvedValue({ status: true });

      submitWalkinDetails(params, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showAlert).toHaveBeenCalled();
    });

    test('success with GENERAL_ENQUIRY early return', async () => {
      (getState as jest.Mock).mockReturnValue({
        user: { info: { userId: 'u1' } },
        quotation: { etskPincode: STRINGS.GENERAL_ENQUIRY },
        exclusiveStore: { actionType: 'other' },
      });
      (api.post as jest.Mock).mockResolvedValue({ status: true });

      submitWalkinDetails(params, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showAlert).toHaveBeenCalled();
    });

    test.each(navigatCases)('navigation for %s', async ({ pin, route }) => {
      jest.useFakeTimers();
      (getState as jest.Mock).mockReturnValue({
        user: { info: { userId: 'u1' } },
        quotation: { etskPincode: pin },
        exclusiveStore: { actionType: 'other' },
      });
      (api.post as jest.Mock).mockResolvedValue({ status: true });

      const p = { ...params, connectionType: pin === STRINGS.ENQUIRY_NEW_CONNECTION ? STRINGS.MULTI : 'c1' };
      submitWalkinDetails(p, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      jest.runAllTimers();
      if (route) {
        expect(navigate).toHaveBeenCalledWith(route);
      }
      jest.useRealTimers();
    });

    test('navigation for OTHER (default case)', async () => {
      (getState as jest.Mock).mockReturnValue({
        user: { info: { userId: 'u1' } },
        quotation: { etskPincode: 'UNKNOWN' },
        exclusiveStore: { actionType: 'other' },
      });
      (api.post as jest.Mock).mockResolvedValue({ status: true });

      submitWalkinDetails(params, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.hideBottomModal).toHaveBeenCalled();
    });

    test('navigation for ENQUIRY_NEW_CONNECTION PRIMARY', async () => {
      (getState as jest.Mock).mockReturnValue({
        user: { info: { userId: 'u1' } },
        quotation: { etskPincode: STRINGS.ENQUIRY_NEW_CONNECTION },
        exclusiveStore: { actionType: 'other' },
      });
      (api.post as jest.Mock).mockResolvedValue({ status: true });

      const p = { ...params, connectionType: CONNECTION_TYPE.PRIMARY };
      submitWalkinDetails(p, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(quotationAction.setisWalkIn).toHaveBeenCalledWith(true);
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.QUOTATION);
    });

    test('error path with SPECIAL_COMMENTS', async () => {
      (getState as jest.Mock).mockReturnValue({
        user: { info: { userId: 'u1' } },
        quotation: { etskPincode: 'p1' },
        exclusiveStore: { actionType: STRINGS.SPECIAL_COMMENTS },
      });
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

      submitWalkinDetails(params, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalled();
    });

    test('error path for other cases', async () => {
      (getState as jest.Mock).mockReturnValue({
        user: { info: { userId: 'u1' } },
        quotation: { etskPincode: 'p1' },
        exclusiveStore: { actionType: 'other' },
      });
      (api.post as jest.Mock).mockRejectedValue(new Error('global fail'));

      submitWalkinDetails(params, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('global fail');
    });
  });

  describe('Store Opening/Closing', () => {
    test('getStoreOpeningStoreClosingData success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      getStoreOpeningStoreClosingData({}, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(sliceActions.setDemoFormQuestions).toHaveBeenCalled();
    });

    test('getStoreOpeningStoreClosingData error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      getStoreOpeningStoreClosingData({}, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });

    test('multiTVBoxType success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      multiTVBoxType({}, 'q', {})(dispatch, getState, undefined);
      await flush();
      expect(sliceActions.setMultiTvData).toHaveBeenCalled();
    });

    test('multiTVBoxType error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      multiTVBoxType({}, 'q', {})(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });

    test('getStoreOpeningQuestion success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      getStoreOpeningQuestion()(dispatch, getState, undefined);
      await flush();
      expect(sliceActions.setIsStoreOpen).toHaveBeenCalledWith(true);
    });

    test('getStoreOpeningQuestion error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      getStoreOpeningQuestion()(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });

    test('getStoreClosingQuestion success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      getStoreClosingQuestion()(dispatch, getState, undefined);
      await flush();
      expect(sliceActions.setIsStoreOpen).toHaveBeenCalledWith(false);
    });

    test('getStoreClosingQuestion error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      getStoreClosingQuestion()(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });

    test('checkStoreStatus success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: 'OPEN' });
      const result = await checkStoreStatus({ actionType: 'open' })(dispatch, getState, undefined);
      expect(result).toEqual({ status: 'OPEN' });
    });

    test('checkStoreStatus error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      checkStoreStatus({ actionType: 'open' })(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });
  });

  describe('Submissions and Questions', () => {
    test('getSpecialCommentdata', async () => {
      const result = await getSpecialCommentdata({}, 'q', {})(dispatch, getState, undefined);
      expect(result.status).toBe(true);
    });

    test('getSpecialCommentsData', () => {
      jest.useFakeTimers();
      getSpecialCommentsData({}, 'q', {})(dispatch, getState, undefined);
      jest.advanceTimersByTime(100);
      expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
      jest.useRealTimers();
    });

    test('submitStoreAns success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      await submitStoreAns({ questionId: 1, answer: 'a' })(dispatch, getState, undefined);
      expect(api.post).toHaveBeenCalled();
    });

    test('submitStoreAns error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('ans fail'));
      await submitStoreAns({ questionId: 1, answer: 'a' })(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('ans fail');
    });

    test('submitDemoForm success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      submitDemoForm({ finalData: {} }, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showAlert).toHaveBeenCalled();
    });

    test('submitDemoForm error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      submitDemoForm({ finalData: {} }, 'q', {}, navigate)(dispatch, getState, undefined);
      await flush();
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });
  });

  describe('Remaining Actions', () => {
    test('changeExclusiveAction logic', () => {
      const cases = [
        { type: STRINGS.WALK_IN, query: QUERY.GetWalkInDetailsData },
        { type: STRINGS.OVER_THE_PHONE, query: QUERY.GetOverThePhoneLeadDetails },
        { type: STRINGS.TELE_CALLING, query: QUERY.GetTeleCallingData },
        { type: STRINGS.OUTBOUND_ACTIVITY, query: QUERY.GetOutboundActivityLeadData },
        { type: 'OTHER', query: QUERY.GetWalkInDetailsData },
      ];
      cases.forEach(({ type, query }) => {
        (getState as jest.Mock).mockReturnValue({ exclusiveStore: { actionType: type } });
        changeExclusiveAction()(dispatch, getState, undefined);
        expect(callAction).toHaveBeenCalledWith(expect.any(Object), query);
      });
    });

    test('setNewConnectionDetails', () => {
      setNewConnectionDetails({})(dispatch, getState, undefined);
      expect(sliceActions.setNewConnectionDetails).toHaveBeenCalled();
    });

    test('getNewConnectionDetails PRIMARY', () => {
      jest.useFakeTimers();
      (getState as jest.Mock).mockReturnValue({ exclusiveStore: { newConnectionDetails: { pinCode: '1' } } });
      getNewConnectionDetails({ connectionType: CONNECTION_TYPE.PRIMARY })(dispatch, getState, undefined);
      jest.advanceTimersByTime(400);
      expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
      jest.useRealTimers();
    });

    test('getNewConnectionDetails MULTI', () => {
      jest.useFakeTimers();
      (getState as jest.Mock).mockReturnValue({ exclusiveStore: { newConnectionDetails: { subID: '1' } } });
      getNewConnectionDetails({ connectionType: STRINGS.MULTI })(dispatch, getState, undefined);
      jest.advanceTimersByTime(400);
      expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith(expect.any(Object), STATE_KEY.MODAL_STATE);
      jest.useRealTimers();
    });
  });
});
