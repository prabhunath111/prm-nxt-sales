/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/rechargeWinback';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import * as actions from './rechargeWinback.action';

// ==================== MOCKS ====================

jest.mock('store/sales/reducer/rechargeWinback', () => ({
  __esModule: true,
  sliceActions: {
    winbackConfigProperties: jest.fn((v) => ({ type: 'WB_SET_PROP', payload: v })),
    winBackSubscriberList: jest.fn((v) => ({ type: 'WB_SET_SUB_LIST', payload: v })),
    setFilteredSubscriberList: jest.fn((v) => ({ type: 'WB_SET_FILTERED', payload: v })),
    setCampaignName: jest.fn((v) => ({ type: 'WB_SET_CAMP', payload: v })),
    winBackPacks: jest.fn((v) => ({ type: 'WB_SET_PACKS', payload: v })),
    winBackSuccessData: jest.fn((v) => ({ type: 'WB_SET_SUCCESS', payload: v })),
    setUniqueKwlrtyNumber: jest.fn((v) => ({ type: 'WB_SET_KWLRTY', payload: v })),
    setSubscriberDetails: jest.fn((v) => ({ type: 'WB_SET_SUB_DET', payload: v })),
    setSubscriberRmn: jest.fn((v) => ({ type: 'WB_SET_SUB_RMN', payload: v })),
    setWinBackPack: jest.fn((v) => ({ type: 'WB_SET_WB_PACK', payload: v })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
    clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
    showErrorPage: jest.fn((m) => ({ type: 'UI_SHOW_ERROR', payload: m })),
    showAlert: jest.fn((m, t, c, d) => ({ type: 'UI_SHOW_ALERT', payload: { m, t, c, d } })),
    showBottomModal: jest.fn((c) => ({ type: 'UI_SHOW_MODAL', payload: c })),
    hideBottomModal: jest.fn(() => ({ type: 'UI_HIDE_MODAL' })),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setRadioContainerOptions: jest.fn((v, q) => ({ type: 'FORM_SET_RADIO', payload: { v, q } })),
    setMultipleDropdownOptionsData: jest.fn((v) => ({ type: 'FORM_SET_MULTIPLE', payload: v })),
    setFormValues: jest.fn((v) => ({ type: 'FORM_SET_VAL', payload: v })),
    setNavigationData: jest.fn((p, s, r, b) => ({ type: 'FORM_SET_NAV', payload: { p, s, r, b } })),
    setUpdatedFormFields: jest.fn((v, k) => ({ type: 'FORM_SET_UPDATED', payload: { v, k } })),
    clearFormData: jest.fn((v) => ({ type: 'FORM_CLEAR', payload: v })),
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
  filterByParams: jest.fn((l, _p) => l),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
  MoengageMixpanelModules: {
    rechargeWinback: {
      Winback_SelectCampaign: { moduleName: 'm1', attributes: { Status: 's', winBackCategory: 'wc' } },
      Winback_SelectSubid: { moduleName: 'm2', attributes: { Status: 's', subscriberId: 'sid' } },
      Winback_Update: { moduleName: 'm3', attributes: { Status: 's', campaignCode: 'cc', comment: 'c', offerCode: 'oc', rmn: 'r', subscriberId: 'sid', treatmentCode: 'tc' } },
      Winback_Recharge: { moduleName: 'm4', attributes: { Status: 's', amount: 'a', pin: 'p', subscriberInfo: 'si', tskNumber: 'tn' } },
    },
  },
}));

jest.useFakeTimers();

// ==================== TEST SUITE ====================
describe('rechargeWinback actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  const mockState = {
    rechargeWinback: {
      winBackSubscriberList: { identifier: 'PK', winBackSubIdList: [{ responseStatus: 'S1' }] },
      subscriberDetails: { data: { subscriberId: '1', campCode: 'C', offerCode: 'O', treatmentCode: 'T' } },
      subscriberRmn: { data: '123' },
      winBackPack: { data: { stdPriUnit: 100, name: 'P', friendlyName: 'FN' } },
    },
    accountInformation: { accountInformation: { customerRMN: '123', balance: '10', customerName: 'N' } },
    form: {
      formState: { formNavigationData: { params: { monthlyRecharge: 500 } } },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => mockState);
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch, getState, undefined);
      return action;
    });
  });

  // ==================== getWinBackConfigProperties ====================
  describe('getWinBackConfigProperties', () => {
    test('success', async () => {
      const response = { winBackSubCategoryNewRadio: 'opt', other: 'data' };
      (api.post as jest.Mock).mockResolvedValue(response);
      const result = await actions.getWinBackConfigProperties({}, 'query')(dispatch, getState, undefined);
      expect(result).toEqual(response);
      expect(sliceActions.winbackConfigProperties).toHaveBeenCalled();
      expect(formActions.setRadioContainerOptions).toHaveBeenCalled();
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getWinBackConfigProperties({}, 'query')(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });
  });

  // ==================== getWinBackSubscriberList ====================
  describe('getWinBackSubscriberList', () => {
    test('success with campaign name', async () => {
      (api.post as jest.Mock).mockResolvedValue({ winBackSubIdList: [] });
      await actions.getWinBackSubscriberList({ campaign: 'C1' }, 'query')(dispatch, getState, undefined);
      expect(sliceActions.setCampaignName).toHaveBeenCalledWith('C1');
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
      jest.runAllTimers();
      expect(formActions.setFormValues).toHaveBeenCalled();
    });

    test('success with campaignDropDown', async () => {
      (api.post as jest.Mock).mockResolvedValue({ winBackSubIdList: [] });
      await actions.getWinBackSubscriberList({ campaignDropDown: { name: 'C2' } }, 'query')(dispatch, getState, undefined);
      expect(sliceActions.setCampaignName).toHaveBeenCalledWith('C2');
    });

    test('success with no campaign name', async () => {
      (api.post as jest.Mock).mockResolvedValue({ winBackSubIdList: [] });
      await actions.getWinBackSubscriberList({}, 'query')(dispatch, getState, undefined);
      expect(sliceActions.setCampaignName).not.toHaveBeenCalled();
      expect(MoengageMixpanel.trackEvent).not.toHaveBeenCalled();
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await actions.getWinBackSubscriberList({}, 'query')(dispatch, getState, undefined);
      expect(result.status).toBe(false);
      expect(sliceActions.setFilteredSubscriberList).toHaveBeenCalledWith([]);
      expect(uiActions.showErrorPage).toHaveBeenCalled();
    });
  });

  // ==================== fetchWinBackPacks ====================
  describe('fetchWinBackPacks', () => {
    test('success when identifier is PK', async () => {
      (api.post as jest.Mock).mockResolvedValue(['pack1']);
      await actions.fetchWinBackPacks({ subscriberId: '1' }, 'query')(dispatch, getState, undefined);
      expect(sliceActions.winBackPacks).toHaveBeenCalledWith(['pack1']);
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    });

    test('early return when identifier is not PK', async () => {
      getState.mockReturnValue({ rechargeWinback: { winBackSubscriberList: { identifier: 'NOT_PK' } } });
      const result = await actions.fetchWinBackPacks({}, 'query')(dispatch, getState, undefined);
      expect(result.status).toBe(false);
      expect(sliceActions.winBackPacks).toHaveBeenCalledWith([]);
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.fetchWinBackPacks({ subscriberId: '1' }, 'query')(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
      expect(sliceActions.winBackPacks).toHaveBeenCalledWith([]);
    });
  });

  // ==================== updateWinBackSubscriberStatus ====================
  describe('updateWinBackSubscriberStatus', () => {
    test('success with updateStatus and alert suppression', async () => {
      (api.post as jest.Mock).mockResolvedValue({ message: 'done', campCode: 'C', offerCode: 'O', subscriberId: '1', treatmentCode: 'T' });
      await actions.updateWinBackSubscriberStatus({ updateStatus: 'S' }, 'query')(dispatch, getState, undefined);
      expect(sliceActions.winBackSuccessData).toHaveBeenCalled();
      expect(uiActions.showAlert).not.toHaveBeenCalled();
    });

    test('success with customerResponseDropDown and alert trigger', async () => {
      (api.post as jest.Mock).mockResolvedValue({ message: 'done', campCode: 'C', offerCode: 'O', subscriberId: '1', treatmentCode: 'T' });
      await actions.updateWinBackSubscriberStatus({ customerResponseDropDown: { nameNT: 'R' } }, 'query')(dispatch, getState, undefined);
      expect(uiActions.showAlert).toHaveBeenCalled();
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.updateWinBackSubscriberStatus({}, 'query')(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });
  });

  // ==================== confirmAddWinbackOffer ====================
  test('confirmAddWinbackOffer triggers modal', () => {
    actions.confirmAddWinbackOffer()(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // ==================== addWinBackOfferPack ====================
  describe('addWinBackOfferPack', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ transId: 'T1' });
      const { callAction } = require('utils/formBuilderHelper');
      await actions.addWinBackOfferPack({ evdPin: '123' })(dispatch, getState, undefined);
      expect(uiActions.hideBottomModal).toHaveBeenCalled();
      jest.runAllTimers();
      expect(uiActions.setLoader).toHaveBeenCalled();
      expect(callAction).toHaveBeenCalled();
      expect(formActions.setNavigationData).toHaveBeenCalledWith({ transactionId: 'T1' }, '', '', '');
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.addWinBackOfferPack({})(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
      expect(uiActions.hideBottomModal).toHaveBeenCalled();
    });
  });

  // ==================== winbackSubListFilter ====================
  describe('winbackSubListFilter', () => {
    test('filter with ALL status', () => {
      actions.winbackSubListFilter({ statusDropDown: { 1: { name: 'ALL' } } })(dispatch, getState, undefined);
      expect(sliceActions.setFilteredSubscriberList).toHaveBeenCalled();
    });

    test('filter with specific status', () => {
      const state = {
        rechargeWinback: {
          winBackSubscriberList: {
            winBackSubIdList: [{ responseStatus: 'S1' }, { responseStatus: 'S2' }],
          },
        },
      };
      getState.mockReturnValue(state);
      actions.winbackSubListFilter({ statusDropDown: { 1: { name: 'S1' } } })(dispatch, getState, undefined);
      expect(sliceActions.setFilteredSubscriberList).toHaveBeenCalled();
    });

    test('filter with search tags', () => {
      actions.winbackSubListFilter({ searchText: 'tag' })(dispatch, getState, undefined);
      actions.winbackSubListFilter({ searchCapaign: 'tag' })(dispatch, getState, undefined);
      expect(sliceActions.setFilteredSubscriberList).toHaveBeenCalledTimes(2);
    });

    test('handle missing filteredList', () => {
      getState.mockReturnValue({
        rechargeWinback: {
          winBackSubscriberList: null,
        },
      });
      actions.winbackSubListFilter({})(dispatch, getState, undefined);
      expect(sliceActions.setFilteredSubscriberList).toHaveBeenCalledWith([]);
    });
  });

  // ==================== monthlyRechargeSecurityCheck ====================
  test('monthlyRechargeSecurityCheck triggers navigation and modal', () => {
    actions.monthlyRechargeSecurityCheck({ monthlyRecharge: 100 })(dispatch, getState, undefined);
    expect(formActions.setNavigationData).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  // ==================== doMonthlyRecharge ====================
  describe('doMonthlyRecharge', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
      await actions.doMonthlyRecharge({ evdPin: '123' })(dispatch, getState, undefined);
      expect(uiActions.hideBottomModal).toHaveBeenCalled();
      jest.runAllTimers();
      expect(uiActions.setLoader).toHaveBeenCalled();
      expect(uiActions.showAlert).toHaveBeenCalled();
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.doMonthlyRecharge({})(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
      expect(formActions.clearFormData).toHaveBeenCalledWith(true);
    });
  });

  // ==================== getUniqueKwlrtyToken ====================
  describe('getUniqueKwlrtyToken', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ token: 'T1' });
      await actions.getUniqueKwlrtyToken({}, 'query')(dispatch, getState, undefined);
      expect(sliceActions.setUniqueKwlrtyNumber).toHaveBeenCalledWith({ token: 'T1' });
    });

    test('failure', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getUniqueKwlrtyToken({}, 'query')(dispatch, getState, undefined);
      expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
    });
  });

  // ==================== small setters ====================
  test('setters functional correctly', () => {
    actions.setSubscriberDetails({ id: 1 })(dispatch, getState, undefined);
    expect(sliceActions.setSubscriberDetails).toHaveBeenCalledWith({ data: { id: 1 } });

    actions.setSubscribeRmn({ mobile: '123' })(dispatch, getState, undefined);
    expect(sliceActions.setSubscriberRmn).toHaveBeenCalledWith({ data: { mobile: '123' } });

    actions.setWinBackPack({ name: 'P' })(dispatch, getState, undefined);
    expect(sliceActions.setWinBackPack).toHaveBeenCalledWith({ data: { name: 'P' } });
  });

  // ==================== restrictAmount ====================
  describe('restrictAmount', () => {
    test('empty or invalid numeric input', () => {
      actions.restrictAmount({ amount: 'abc' })(dispatch, getState, undefined);
      actions.restrictAmount({ amount: '' })(dispatch, getState, undefined);
      expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ monthlyRecharge: '' });
    });

    test('value below MIN (200)', () => {
      actions.restrictAmount({ amount: '100' })(dispatch, getState, undefined);
      expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ monthlyRecharge: '200' });
    });

    test('value above MAX (49000)', () => {
      actions.restrictAmount({ amount: '50000' })(dispatch, getState, undefined);
      expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ monthlyRecharge: '49000' });
    });

    test('valid value', () => {
      actions.restrictAmount({ amount: '500' })(dispatch, getState, undefined);
      expect(formActions.setUpdatedFormFields).toHaveBeenCalledWith({ monthlyRecharge: '500' });
    });
  });
});
