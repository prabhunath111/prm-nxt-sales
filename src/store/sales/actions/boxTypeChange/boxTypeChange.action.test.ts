/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { api } from 'services/apolloClient';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/boxTypeChange';
import { sliceActions as etskRegistrationActions } from 'store/sales/reducer/etskRegistration';
import { callAction } from 'utils/formBuilderHelper';
import { QUERY, STRINGS, ROUTE } from 'const';
import * as actions from './boxTypeChange.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(() => ({ type: 'UI_SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'UI_CLEAR_LOADER' })),
  setModalLoader: jest.fn(() => ({ type: 'UI_SET_MODAL_LOADER' })),
  showBottomModal: jest.fn((_p) => ({ type: 'UI_SHOW_BOTTOM_MODAL', payload: _p })),
  hideBottomModal: jest.fn(() => ({ type: 'UI_HIDE_BOTTOM_MODAL' })),
  showErrorPage: jest.fn((_m) => ({ type: 'UI_SHOW_ERROR', payload: _m })),
  showAlert: jest.fn((_m, _t, _b, _o) => ({ type: 'UI_SHOW_ALERT', payload: { _m, _t, _b, _o } })),
  clearAlert: jest.fn(() => ({ type: 'UI_CLEAR_ALERT' })),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn((m) => ({ type: 'COMMON_SET_ERROR_MESSAGE', payload: m })),
  reSetErrorMessage: jest.fn(() => ({ type: 'COMMON_RESET_ERROR_MESSAGE' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdList: jest.fn((_d) => ({ type: 'FORM_SET_SUB_ID_LIST', payload: _d })),
  setDealerDetails: jest.fn((_d) => ({ type: 'FORM_SET_DEALER_DETAILS', payload: _d })),
  setRadioContainerOptions: jest.fn((_d, _q) => ({ type: 'FORM_SET_RADIO_OPTIONS', payload: { _d, _q } })),
  setUpdatedFormFields: jest.fn((_f, _s) => ({ type: 'FORM_SET_UPDATED_FIELDS', payload: { _f, _s } })),
  setFieldsToDisable: jest.fn((_f, _s) => ({ type: 'FORM_SET_DISABLED_FIELDS', payload: { _f, _s } })),
}));

jest.mock('store/sales/reducer/boxTypeChange', () => ({
  sliceActions: {
    setFirstFlag: jest.fn(() => ({ type: 'BTC_SET_FIRST_FLAG' })),
    resetSelectBoxDetails: jest.fn(() => ({ type: 'BTC_RESET_DETAILS' })),
    setBoxTypeProps: jest.fn(() => ({ type: 'BTC_SET_PROPS' })),
    setSubID: jest.fn(() => ({ type: 'BTC_SET_SUB_ID' })),
    setPendingWo: jest.fn(() => ({ type: 'BTC_SET_PENDING_WO' })),
    setPendingWoDetails: jest.fn(() => ({ type: 'BTC_SET_PENDING_WO_DETAILS' })),
    setOderNumber: jest.fn(() => ({ type: 'BTC_SET_ORDER_NUMBER' })),
    setTskDetails: jest.fn(() => ({ type: 'BTC_SET_TSK_DETAILS' })),
    setFlags: jest.fn(() => ({ type: 'BTC_SET_FLAGS' })),
    setTskPin: jest.fn(() => ({ type: 'BTC_SET_PIN' })),
    setTskSnoAndBoxTypeArr: jest.fn(() => ({ type: 'BTC_SET_ARR' })),
    setBoxData: jest.fn(() => ({ type: 'BTC_SET_BOX_DATA' })),
    setBoxDetails: jest.fn(() => ({ type: 'BTC_SET_BOX_DETAILS' })),
    setboxType: jest.fn(() => ({ type: 'BTC_SET_BOX_TYPE' })),
    setBoxTypeChangeReferenceId: jest.fn(() => ({ type: 'BTC_SET_REF_ID' })),
    setBoxTypeSuccessData: jest.fn(() => ({ type: 'BTC_SET_SUCCESS_DATA' })),
    setAccountDetailsPrimaryAndSecondaryRepushBoxType: jest.fn(() => ({ type: 'BTC_SET_REPUSH_DATA' })),
    setOnlyPricePtForMultiTVInput: jest.fn(() => ({ type: 'BTC_SET_MULTI_PRICE' })),
  },
}));

jest.mock('store/sales/reducer/etskRegistration', () => ({
  sliceActions: {
    etskClearSelectedPacksToBuyData: jest.fn(() => ({ type: 'ETSK_CLEAR_PACKS' })),
    etskSetCategorySelected: jest.fn((_c) => ({ type: 'ETSK_SET_CAT', payload: _c })),
    etskSetDurationSelected: jest.fn((_d) => ({ type: 'ETSK_SET_DUR', payload: _d })),
    etskSetPackSelected: jest.fn((_p) => ({ type: 'ETSK_SET_PACK', payload: _p })),
    etskSetSelectedPill: jest.fn((_p) => ({ type: 'ETSK_SET_PILL', payload: _p })),
    etskSetAccountCreationSuccessData: jest.fn((_d) => ({ type: 'ETSK_SET_SUCCESS_DATA', payload: _d })),
    etskSetFiltersData: jest.fn((_f) => ({ type: 'ETSK_SET_FILTERS', payload: _f })),
    etskSetFreePackSelected: jest.fn((_p) => ({ type: 'ETSK_SET_FREE_PACK', payload: _p })),
    etskSetPrimaryBoxPrice: jest.fn((_p) => ({ type: 'ETSK_SET_PRICE', payload: _p })),
    etskSetCategoryDropdownData: jest.fn((_d) => ({ type: 'ETSK_SET_CAT_DRP', payload: _d })),
    etskSetDurationDropdownData: jest.fn((_d) => ({ type: 'ETSK_SET_DUR_DRP', payload: _d })),
    etskSetCategorySelectionPacksData: jest.fn((_d) => ({ type: 'ETSK_SET_CAT_PACKS', payload: _d })),
    etskSetValidatePacksSuccessData: jest.fn((_d) => ({ type: 'ETSK_SET_VAL_PACKS', payload: _d })),
    etskSetPaidPrice: jest.fn((_p) => ({ type: 'ETSK_SET_PAID_PRICE', payload: _p })),
  },
}));

jest.mock('store/sales/reducer/boxUpgrade', () => ({
  sliceActions: {
    setBoxData: jest.fn((d) => ({ type: 'BU_SET_BOX_DATA', payload: d })),
    setSelectedBox: jest.fn((b) => ({ type: 'BU_SET_SELECTED_BOX', payload: b })),
    setSelectedBoxVcNumber: jest.fn((n) => ({ type: 'BU_SET_VC', payload: n })),
    setSelectedBoxType: jest.fn((t) => ({ type: 'BU_SET_TYPE', payload: t })),
    setSelectedBoxConnectionType: jest.fn((c) => ({ type: 'BU_SET_CONN', payload: c })),
    setElegibles: jest.fn((e) => ({ type: 'BU_SET_ELEGIBLES', payload: e })),
    setSubscriberID: jest.fn((id) => ({ type: 'BU_SET_SUB_ID', payload: id })),
    setRechargeFlag: jest.fn((f) => ({ type: 'BU_SET_RECH_FLAG', payload: f })),
    setPaidAmount: jest.fn((a) => ({ type: 'BU_SET_PAID', payload: a })),
    setStatus: jest.fn((s) => ({ type: 'BU_SET_STATUS', payload: s })),
    setTransactionID: jest.fn((id) => ({ type: 'BU_SET_TRANS_ID', payload: id })),
    setSRno: jest.fn((n) => ({ type: 'BU_SET_SR', payload: n })),
    setSucessMsg: jest.fn((m) => ({ type: 'BU_SET_MSG', payload: m })),
    setFinalRequiredAmount: jest.fn((a) => ({ type: 'BU_SET_FINAL', payload: a })),
  },
}));

jest.mock('store/sales/reducer/primaryTvRegistration', () => ({
  sliceActions: {
    setTskValidateData: jest.fn((d) => ({ type: 'PRIMARY_SET_VAL', payload: d })),
  },
}));

jest.mock('store/sales/reducer/etskMultiTv', () => ({
  sliceActions: {
    etskMultiTvSetBoxTypeSelected: jest.fn((t) => ({ type: 'MULTI_SET_BOX', payload: t })),
    etskSetMultiBoxSelectedDetails: jest.fn((d) => ({ type: 'MULTI_SET_DETAILS', payload: d })),
  },
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => {
    if (key === 'strings.Unscheduled') return 'Unscheduled';
    if (key === 'subscriberStatus.Cancelled') return 'Cancelled';
    if (key === 'subscriberStatus.Active') return 'Active';
    if (key === 'subscriberStatus.Pending') return 'Pending';
    if (key === 'strings.MONTHLY') return 'MONTHLY';
    return key;
  }),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn((p, q, s, n) => ({ type: 'FORM_BUILDER_CALL_ACTION', payload: { p, q, s, n } })),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((_r) => _r),
  filterPackDetails: jest.fn((_p, _f) => _p),
  getDisabledCategoryMatch: jest.fn((_p, _d) => null),
  getRechargeFlag: jest.fn((_p, _d) => true),
  transformSelectedPacksArray: jest.fn((_p) => []),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    BoxTypeChange: {
      BoxTypeChange_CheckWOStatus: { moduleName: 'CheckWO', attributes: { Status: 'S', SubscriberID: 'SID', tskPin1: 'P1', vcNumber: 'VC' } },
      BoxTypeChange_WOcancellationConfirm: {
        moduleName: 'CancelWO',
        attributes: { Status: 'S', SubscriberID: 'SID', woSalesType: 'ST', woSubType: 'SUB', woType: 'T', workOrderNo: 'NO' },
      },
      BoxTypeChange_ValidateSubID: { moduleName: 'ValidateSubID', attributes: { Status: 'S', SubscriberID: 'SID', tskPin1: 'P1' } },
      BoxTypeChange_ChangeBox: { moduleName: 'ChangeBox', attributes: { Status: 'S', SubscriberID: 'SID', newTSKType: 'T', salesOrderNum: 'O', tskSerialNumber: 'SN' } },
      BoxTypeChange_PickPack: { moduleName: 'PickPack', attributes: { Status: 'S', SubscriberID: 'SID', roleId: 'R', tskPin: 'P', userName: 'U' } },
      BoxTypeChange_SelectPackCategory: { moduleName: 'SelectPack', attributes: { Status: 'S', boxType: 'BT', category: 'C' } },
      BoxTypeChange_PickPackProceed: {
        moduleName: 'PickPackProc',
        attributes: { Status: 'S', SubscriberID: 'SID', boxType: 'BT', packPriceFe: 'PF', selectedPacksTogetRentalUniqueArray: 'PA', tskPin: 'P', tskSerialNumber: 'SN' },
      },
      BoxTypeChange_SummaryProceed: {
        moduleName: 'SummaryProc',
        attributes: { Status: 'S', SubscriberID: 'SID', boxType: 'BT', packPriceFe: 'PF', selectedPacksTogetRentalUniqueArray: 'PA', tskPin: 'P', tskSerialNumber: 'SN' },
      },
      BoxTypeChange_RechargeConfirm: {
        moduleName: 'RechConfirm',
        attributes: {
          Status: 'S',
          SubscriberID: 'SID',
          requiredRechargeAmount: 'RA',
          selectedPackAndCategoriesArray: 'PA',
          rechargeAmount: 'A',
          rechargeEvdPin: 'PIN',
          tskSerialNumber: 'SN',
        },
      },
    },
  },
}));

jest.mock('store/sales/query', () => ({
  default: {
    getBoxTypesFromProps: 'getBoxTypesFromProps',
    getExistingWO: 'getExistingWO',
    deleteWorkOrder: 'deleteWorkOrder',
    getTskPinDetailsBoxType: 'getTskPinDetailsBoxType',
    getActivationStatusOtherDetailsBoxType: 'getActivationStatusOtherDetailsBoxType',
    getMultiTvBoxType: 'getMultiTvBoxType',
    getPacks: 'getPacks',
    getWoRentalPack: 'getWoRentalPack',
    doPickPackAndWorkOrderCreationPrimaryAndSecondary: 'doPickPackAndWorkOrderCreationPrimaryAndSecondary',
    getOnlyPricePtForMultiTV: 'getOnlyPricePtForMultiTV',
    getSecMultiTVDtlsOrg: 'getSecMultiTVDtlsOrg',
  },
}));

describe('boxTypeChange actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => ({
      boxTypeChange: {
        subId: 'sub123',
        firstFlag: true,
        tskDetails: [{ TskSno: 'pin1' }],
        boxTypeProps: { woType: ['Primary', 'S1', 'S2', 'S3', 'Multi'] },
      },
      user: {
        info: {
          userId: 'user123',
          roleId: 'role1',
        },
      },
      etskRegistration: {
        selectedPacksToBuy: [],
        freePackSelected: 'Basic',
      },
      boxUpgrade: {
        vcNumber: 'vc123',
      },
      etskRegSchedular: {
        selectedSlot: '10 - 12',
        timeSlotsData: { taskId: 'task1' },
      },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') return action(dispatch, getState, undefined);
      return action;
    }) as any;
  });

  describe('clearTskPinTimeout', () => {
    test('clears timeout if exists', () => {
      // Trigger timeout set
      const { getDisabledCategoryMatch } = require('utils/responseHelper');
      getDisabledCategoryMatch.mockReturnValue({ rechargeEnabled: STRINGS.NO });
      actions.getRechargeAmount()(dispatch, getState, undefined);

      // Now clear it
      actions.clearTskPinTimeout()(dispatch, getState, undefined);
    });
  });

  describe('modelForBoxTypeRMN', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { types: [] } });
      await actions.modelForBoxTypeRMN()(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(dispatch).toHaveBeenCalledWith(sliceActions.setFirstFlag(true));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });

    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('API fail'));
      await actions.modelForBoxTypeRMN()(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('API fail'));
    });
  });

  describe('showExitsingBox', () => {
    test('dispatches modal', () => {
      actions.showExitsingBox()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  describe('getAccountInfoBoxTypeChange', () => {
    test('success with subscriberList', async () => {
      const mockResponse = { subscriberList: [{ id: '1' }] };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      const result = await actions.getAccountInfoBoxTypeChange({ subscriberInfo: 'sub1' }, 'QUERY_NAME', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdList(expect.anything()));
      expect(result.status).toBe(false);
    });

    test('success with unauthorized for etsk', async () => {
      const mockResponse = { tskDeatils: [{ connectionType: 'Primary', bookingFormNo: '123' }] };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      await actions.getAccountInfoBoxTypeChange({ subscriberInfo: 'sub1' }, 'QUERY_NAME', {}, navigate)(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'strings.boxTypeNotForEtsk', type: 'COMMON_SET_ERROR_MESSAGE' }));
    });

    test('success with no tsk data', async () => {
      const mockResponse = { tskDeatils: [] };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      await actions.getAccountInfoBoxTypeChange({ subscriberInfo: 'sub1' }, 'QUERY_NAME', {}, navigate)(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('strings.tskNotFromMsale'));
    });

    test('success and calls GetWorkOrderDetailsBoxType', async () => {
      const mockResponse = { tskDeatils: [{ connectionType: 'Secondary' }] };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      await actions.getAccountInfoBoxTypeChange({ subscriberInfo: 'sub1' }, 'QUERY_NAME', {}, navigate)(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: expect.objectContaining({ q: QUERY.GetWorkOrderDetailsBoxType }) }));
    });

    test('error path', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getAccountInfoBoxTypeChange({}, 'QUERY_NAME', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('fail'));
    });
  });

  describe('getWorkOrderDetailsBoxType', () => {
    test('unscheduled and not firstFlag', async () => {
      getState.mockReturnValue({
        boxTypeChange: { firstFlag: false, subId: 's1', tskDetails: [{ TskSno: 'p' }] },
      });
      (api.post as jest.Mock).mockResolvedValue({ workOrderDetails: [{ woStatus: STRINGS.UNSCHEDULED }] });
      const result = await actions.getWorkOrderDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('strings.workOrderStillNotCancelled'));
      expect(result.status).toBe(false);
    });

    test('unscheduled and firstFlag', async () => {
      (api.post as jest.Mock).mockResolvedValue({ workOrderDetails: [{ woStatus: STRINGS.UNSCHEDULED }] });
      const result = await actions.getWorkOrderDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setPendingWo(true));
      expect(result.status).toBe(true);
    });

    test('other status and not firstFlag', async () => {
      getState.mockReturnValue({
        boxTypeChange: { firstFlag: false, subId: 's1' },
      });
      (api.post as jest.Mock).mockResolvedValue({ workOrderDetails: [{ woStatus: 'CANCELLED' }] });
      await actions.getWorkOrderDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showAlert(expect.anything(), expect.anything(), expect.anything(), expect.anything()));
    });

    test('error path', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await actions.getWorkOrderDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });
  });

  describe('cancelWorkorder', () => {
    test('success', async () => {
      getState.mockReturnValue({
        boxTypeChange: { pendingWoDetails: { woSubType: 'S' }, subId: 's1' },
      });
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      const result = await actions.cancelWorkorder({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(result.status).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setFirstFlag(false));
    });

    test('failure status', async () => {
      getState.mockReturnValue({
        boxTypeChange: { pendingWoDetails: {} },
      });
      (api.post as jest.Mock).mockResolvedValue({ status: false });
      const result = await actions.cancelWorkorder({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(result.status).toBe(false);
    });

    test('error path', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.cancelWorkorder({}, 'QUERY', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'COMMON_SET_ERROR_MESSAGE', payload: 'fail' }));
    });
  });

  describe('tskStatusAllDetailsProcedure', () => {
    test('no tsk details', async () => {
      (api.post as jest.Mock).mockResolvedValue({ tskDetails: [] });
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('strings.noDataFound'));
    });

    test('auth dealer and multiTV act not active', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'user123' }],
        dealerDetails: [],
        accountStatus: 'Inactive',
        woDetails: [{ status: 'Unscheduled', SubType: 'Multi' }],
        accountDetails: { firstName: 'F', lastName: 'L' },
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('strings.multiTVActNotActive'));
    });

    test('auth dealer and primary act not pending', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'user123' }],
        dealerDetails: [],
        accountStatus: 'Active',
        woDetails: [{ status: 'Unscheduled', SubType: 'Primary' }],
        accountDetails: { firstName: 'F', lastName: 'L' },
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('strings.actNotInPending'));
    });

    test('auth dealer and success', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'user123' }],
        dealerDetails: [],
        accountStatus: 'Pending',
        woDetails: [{ status: 'Unscheduled', SubType: 'Primary' }],
        accountDetails: { firstName: 'F', lastName: 'L' },
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(callAction(expect.anything(), QUERY.getTskPinDetailsBoxType, expect.anything(), expect.anything()));
    });

    test('no unscheduled WO error', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'user123' }],
        dealerDetails: [],
        woDetails: [{ status: 'Completed' }],
        accountDetails: { firstName: 'F', lastName: 'L' },
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('strings.noUnscheduledWO'));
    });

    test('not authorized dealer error', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'other' }],
        dealerDetails: [{ connectionType: 'Other', dealerCode: 'other' }],
        woDetails: [{ status: 'Unscheduled', SubType: 'Primary' }],
        accountDetails: { firstName: 'F', lastName: 'L' },
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('strings.dealerNotAuth'));
    });

    test('not auth dealer but multi sub auth success', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'user123' }, { DealerCode: 'other' }],
        dealerDetails: [{ connectionType: 'SECONDARY', dealerCode: 'user123' }],
        accountStatus: 'Active',
        woDetails: [{ status: 'Unscheduled', SubType: 'Multi' }],
        accountDetails: { firstName: 'F', lastName: 'L' },
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      getState.mockReturnValue({
        boxTypeChange: { boxTypeProps: { woType: ['Primary', 'S1', 'S2', 'S3', 'Multi'] }, subId: 's1' },
        user: { info: { userId: 'user123' } },
        etskRegistration: {},
      });
      await actions.tskStatusAllDetailsProcedure({}, QUERY.TskStatusAllDetailsProcedure, {}, navigate)(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 150);
      });

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'FORM_BUILDER_CALL_ACTION',
          payload: expect.objectContaining({ q: QUERY.getTskPinDetailsBoxType }),
        }),
      );
    });

    test('not auth dealer and no unscheduled WO', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'other' }],
        dealerDetails: [],
        woDetails: [],
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'strings.noUnscheduledWO' }));
    });

    test('error path catch', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'fail', type: 'COMMON_SET_ERROR_MESSAGE' }));
    });

    test('auth dealer but no woDetails', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'user123' }],
        dealerDetails: [],
        woDetails: [],
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      getState.mockReturnValue({
        boxTypeChange: { boxTypeProps: { woType: [] }, subId: 's1' },
        user: { info: { userId: 'user123' } },
        etskRegistration: {},
      });
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'strings.noUnscheduledWO' }));
    });

    test('not auth dealer but multi sub auth and inactive status', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'user123' }, { DealerCode: 'other' }],
        dealerDetails: [],
        accountStatus: 'Inactive',
        woDetails: [{ status: 'Unscheduled', SubType: 'Multi' }],
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      getState.mockReturnValue({
        boxTypeChange: { boxTypeProps: { woType: ['', '', '', '', 'Multi'] }, subId: 's1' },
        user: { info: { userId: 'user123' } },
        etskRegistration: {},
      });
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'COMMON_SET_ERROR_MESSAGE', payload: 'strings.multiTVActNotActive' }));
    });

    test('not auth dealer and multi sub auth false', async () => {
      const mockData = {
        tskDetails: [{ DealerCode: 'other' }],
        dealerDetails: [],
        accountStatus: 'Active',
        woDetails: [{ status: 'Unscheduled', SubType: 'Multi' }],
      };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      getState.mockReturnValue({
        boxTypeChange: { boxTypeProps: { woType: ['', '', '', '', 'Multi'] }, subId: 's1' },
        user: { info: { userId: 'different' } },
        etskRegistration: {},
      });
      await actions.tskStatusAllDetailsProcedure({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'strings.dealerNotAuth' }));
    });
  });

  describe('getTskPinDetailsBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ pin: '123' });
      await actions.getTskPinDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setTskPin(expect.anything()));
    });
    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getTskPinDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('fail'));
    });
  });

  describe('getActivationStatusOtherDetailsBoxType', () => {
    test('success with navigation (firstFlag false)', async () => {
      getState.mockReturnValue({
        boxTypeChange: { tskDetails: [{ TskSno: 'pin1', VCType: 'V' }], subId: 's1', firstFlag: false },
      });
      const mockResponse = { otherDetails: [{ pref_box_typeNT: 'STANDARD', tsk_no: 'pin1' }] };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      await actions.getActivationStatusOtherDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.SELECT_BOX_TYPE);
    });

    test('success with callAction (firstFlag true)', async () => {
      getState.mockReturnValue({
        boxTypeChange: { tskDetails: [{ TskSno: 'pin1', VCType: 'V' }], subId: 's1', firstFlag: true },
      });
      const mockResponse = { otherDetails: [{ pref_box_typeNT: 'HD', tsk_no: 'pin1' }] };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      await actions.getActivationStatusOtherDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(callAction(expect.anything(), QUERY.exitingWorkOrder, expect.anything(), expect.anything()));
    });

    test('error path', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getActivationStatusOtherDetailsBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('fail'));
    });
  });

  describe('getBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ boxType: [] });
      await actions.getBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.SELECT_BOX_TYPE);
    });

    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });
  });

  describe('exitingWorkOrder', () => {
    test('standard flow (no pending WO)', () => {
      getState.mockReturnValue({
        boxTypeChange: { pendingWo: false },
        boxUpgrade: {},
      });
      actions.exitingWorkOrder({ campaign: '123-HD-PRIMARY' }, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(callAction(expect.anything(), 'getBoxType', expect.anything(), expect.anything()));
    });

    test('pending WO flow', () => {
      getState.mockReturnValue({
        boxTypeChange: { pendingWo: true },
        boxUpgrade: {},
      });
      actions.exitingWorkOrder({ campaign: '123-HD-PRIMARY' }, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  describe('boxTypeChange', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ referenceId: 'ref1' });
      const result = await actions.boxTypeChange({ upgradedType: 'SD', vcNumber: 'vc1' }, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(result.status).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setboxType(STRINGS.STANDARD));
    });

    test('error path', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(actions.boxTypeChange({}, 'Q', {}, navigate)(dispatch, getState, undefined)).rejects.toThrow('fail');
    });
  });

  describe('boxTypeChangeSuccess', () => {
    test('onlyMulti flag true', () => {
      getState.mockReturnValue({ boxTypeChange: { flags: { onlyMulti: true } } });
      actions.boxTypeChangeSuccess({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(callAction(expect.anything(), QUERY.GetOnlyPricePtForMultiTVInputBoxType, expect.anything(), expect.anything()));
    });

    test('onlyMulti flag false', () => {
      getState.mockReturnValue({ boxTypeChange: { flags: { onlyMulti: false } } });
      actions.boxTypeChangeSuccess({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(callAction(expect.anything(), QUERY.getAccountDetailsPrimaryAndSecondaryRepushBoxType, expect.anything(), expect.anything()));
    });
  });

  describe('getAccountDetailsPrimaryAndSecondaryRepushBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: {} });
      await actions.getAccountDetailsPrimaryAndSecondaryRepushBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setAccountDetailsPrimaryAndSecondaryRepushBoxType(expect.anything()));
      expect(dispatch).toHaveBeenCalledWith(callAction(expect.anything(), QUERY.getAllPacksPropBoxType, expect.anything(), expect.anything()));
    });

    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getAccountDetailsPrimaryAndSecondaryRepushBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('fail'));
    });
  });

  describe('getAllPacksPropBoxType', () => {
    test('success', async () => {
      const mockResponse = {
        languages: [],
        geners: [],
        boxTypes: [],
        PopularPacks: [],
        durations: [],
        offerCategories: [],
        packageName: [{ PackageInfo: [{ uom: 'Monthly', packName: 'M1', pricePt: '10' }] }],
      };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      await actions.getAllPacksPropBoxType({}, QUERY.GetAllPacksProp, {}, navigate)(dispatch, getState, undefined);

      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.BOX_TYPE_CHANNELS);
    });

    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getAllPacksPropBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('fail'));
    });
  });

  describe('getWoPacksBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true, result: { packsDetails: [] } });
      await actions.getWoPacksBoxType({ value: { nameNT: 'N' }, filters: {} })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetCategorySelectionPacksData(expect.anything()));
    });

    test('error from API status', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'fail' });
      await actions.getWoPacksBoxType({ value: {}, filters: {} })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'fail', type: 'UI_SHOW_ERROR' }));
    });

    test('error path catch', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getWoPacksBoxType({ value: {}, filters: {} })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'UI_SHOW_ERROR' }));
    });
  });

  describe('getRentalPackBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true, result: { connections: 1 } });
      await actions.getRentalPackBoxType({})(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetValidatePacksSuccessData(expect.anything()));
    });

    test('failure status', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'fail' });
      const result = await actions.getRentalPackBoxType({})(dispatch, getState, undefined);
      expect(result.status).toBe(false);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'fail', type: 'UI_SHOW_ERROR' }));
    });

    test('error path catch', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getRentalPackBoxType({})(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'UI_SHOW_ERROR' }));
    });
  });

  describe('boxTypeRechargeDetails', () => {
    test('dispatches modal', () => {
      actions.boxTypeRechargeDetails()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  describe('boxTypeRecreationFillAmount', () => {
    test('updates amount with matched pack', () => {
      const { getDisabledCategoryMatch } = require('utils/responseHelper');
      getDisabledCategoryMatch.mockReturnValue({ rechargeAmount: 1000, rechargeEnabled: STRINGS.NO, pricePt: '100' });
      jest.useFakeTimers();
      actions.boxTypeRecreationFillAmount({ packsData: [] })(dispatch, getState, undefined);
      jest.advanceTimersByTime(200);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'FORM_SET_UPDATED_FIELDS' }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'FORM_SET_DISABLED_FIELDS' }));
      jest.useRealTimers();
    });
  });

  describe('confirmBoxTypeRechargeModal', () => {
    test('dispatches modal and handles onClose', () => {
      actions.confirmBoxTypeRechargeModal({ rechargeAmount: '100' }, 'Q', {})(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));

      const modalCall = (uiActions.showBottomModal as jest.Mock).mock.calls[0][0];
      modalCall.onClose();
      expect(dispatch).toHaveBeenCalledWith(commonActions.reSetErrorMessage());
    });
  });

  describe('doPickPackAndWorkOrderCreationPrimaryAndSecondaryBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true, message: 'S', result: { transId: 'T' }, woNumber: 'W' });
      getState.mockReturnValue({
        etskRegistration: { selectedPacksToBuy: [], freePackSelected: 'B' },
        boxTypeChange: { accountDetailsPrimaryAndSecondaryRepushBoxType: { subscriberId: 's1' } },
        etskRegSchedular: { selectedSlot: '10 - 12' },
      });
      await actions.doPickPackAndWorkOrderCreationPrimaryAndSecondaryBoxType({ rechargeAmount: '100' }, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.BOX_TYPE_SUCCESS);
    });

    test('failure status', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: false, message: 'fail' });
      await actions.doPickPackAndWorkOrderCreationPrimaryAndSecondaryBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });

    test('error path catch', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.doPickPackAndWorkOrderCreationPrimaryAndSecondaryBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });
  });

  describe('getExistingBoxDetails', () => {
    test('logic branches', () => {
      getState.mockReturnValue({ boxTypeChange: { subId: 's1', boxData: [1, 2] } });
      actions.getExistingBoxDetails()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields(expect.anything(), expect.anything()));
    });
  });

  describe('getRechargeAmount', () => {
    test('logic branches with paidPrice', () => {
      getState.mockReturnValue({
        etskRegistration: { paidPrice: '100', selectedPacksToBuy: [] },
      });
      actions.getRechargeAmount()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields({ rechargeAmount: '100' }, expect.anything()));
    });

    test('logic branches with matched pack recharge disabled', () => {
      getState.mockReturnValue({
        etskRegistration: { paidPrice: '100', selectedPacksToBuy: [], accountCreationSuccessData: { disableLDPPacks: [] } },
      });
      const { getDisabledCategoryMatch } = require('utils/responseHelper');
      getDisabledCategoryMatch.mockReturnValue({ rechargeEnabled: 'N' });
      jest.useFakeTimers();
      actions.getRechargeAmount()(dispatch, getState, undefined);
      jest.advanceTimersByTime(200);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'FORM_SET_DISABLED_FIELDS' }));
      jest.useRealTimers();
    });
  });

  describe('handelRechargeAmount', () => {
    test('sets paid price', () => {
      actions.handelRechargeAmount({ rechargeAmount: '100' })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(etskRegistrationActions.etskSetPaidPrice('100'));
    });
  });

  describe('getWODetailsBoxtype', () => {
    test('sets forms', () => {
      getState.mockReturnValue({ boxTypeChange: { pendingWoDetails: { woNo: '123' } } });
      actions.getWODetailsBoxtype()(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields(expect.anything(), expect.anything()));
    });
  });

  describe('getOnlyPricePtForMultiTVInputBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ status: true, boxType: 'HD' });
      await actions.getOnlyPricePtForMultiTVInputBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setOnlyPricePtForMultiTVInput(expect.anything()));
    });
    test('success with data status false', async () => {
      const { refactorResponse } = require('utils/responseHelper');
      refactorResponse.mockReturnValueOnce({ status: false });
      (api.post as jest.Mock).mockResolvedValue({ status: true });
      const result = await actions.getOnlyPricePtForMultiTVInputBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(result.status).toBe(true);
    });
    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getOnlyPricePtForMultiTVInputBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('fail'));
    });
  });

  describe('getSecMultiTVDtlsOrgBoxType', () => {
    test('success', async () => {
      (api.post as jest.Mock).mockResolvedValue({ disableEditRechDhamakaMultiTVBoxChange: true });
      await actions.getSecMultiTVDtlsOrgBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY);
    });
    test('error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await actions.getSecMultiTVDtlsOrgBoxType({}, 'Q', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('fail'));
    });
  });
});
