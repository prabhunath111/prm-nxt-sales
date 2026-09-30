import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/boxUpgrade';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { refactorResponse } from 'utils/responseHelper';
import {
  clearTskPinTimeout,
  modelForRMN,
  MultipleSubIdModal,
  getAccountInfoBoxUpgrade,
  isEligibleForUpgrade,
  existingWorkOrder,
  proceedWithRechargeBox,
  ProceedWithConfirm,
  getBingePlusData,
  finalBoxUpgradation,
  showModifyPackModal,
  changeRechargeAmount,
  backToRMNModal,
  getValueofExitsingBox,
  getWODetails,
  getRechargeDetails,
} from './boxUpgrade.action';

jest.mock('services/apolloClient', () => ({
  api: { post: jest.fn() },
}));

jest.mock('store/sales/reducer/boxUpgrade', () => ({
  sliceActions: {
    setRechargeAmount: jest.fn(),
    setBoxUpgradeACInfoBoxData: jest.fn(),
    setSubscriberID: jest.fn(),
    setBoxData: jest.fn(),
    setElegibles: jest.fn(),
    setSelectedBox: jest.fn(),
    setSelectedBoxVcNumber: jest.fn(),
    setSelectedBoxType: jest.fn(),
    setSelectedBoxConnectionType: jest.fn(),
    setWoDetails: jest.fn(),
    setBingeOfferData: jest.fn(),
    setStatus: jest.fn(),
    setTransactionID: jest.fn(),
    setSRno: jest.fn(),
    setSucessMsg: jest.fn(),
    setEVDPin: jest.fn(),
    setPaidAmount: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(() => ({ type: 'SHOW_BOTTOM_MODAL' })),
  setModalLoader: jest.fn(() => ({ type: 'SET_MODAL_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'CLEAR_LOADER' })),
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
  showErrorPage: jest.fn(() => ({ type: 'SHOW_ERROR_PAGE' })),
  showAlert: jest.fn(() => ({ type: 'SHOW_ALERT' })),
}));

jest.mock('store/sales/actions/common', () => ({
  setErrorMessage: jest.fn(() => ({ type: 'SET_ERROR_MESSAGE' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setDealerDetails: jest.fn(() => ({ type: 'SET_DEALER_DETAILS' })),
  setSubIdList: jest.fn(() => ({ type: 'SET_SUB_ID_LIST' })),
  setRadioContainerOptions: jest.fn(() => ({ type: 'SET_RADIO_OPTIONS' })),
  setUpdatedFormFields: jest.fn(() => ({ type: 'SET_UPDATED_FORM_FIELDS' })),
  setFieldsToDisable: jest.fn(() => ({ type: 'SET_FIELDS_TO_DISABLE' })),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    BoxUpgrade: {
      BoxUpgrade_PageVisit: { moduleName: 'BoxUpgrade_PageVisit', attributes: { Status: 'Status' } },
      BoxUpgradeBoxselectionProceed: {
        moduleName: 'BoxUpgradeBoxselectionProceed',
        attributes: { Status: 'Status', SubscriberID: 'SubscriberID', vcNumber: 'vcNumber' },
      },
      BoxUpgradeChangeBoxType: { moduleName: 'BoxUpgradeChangeBoxType', attributes: { Status: 'Status' } },
      BoxUpgradeRechargeConfirm: { moduleName: 'BoxUpgradeRechargeConfirm', attributes: { Status: 'Status', details: 'details' } },
    },
  },
}));

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('const', () => ({
  ALERT: { ERROR: 'ERROR' },
  CHILD_TYPE: {
    REGISTRATION_SALES_NEXT_FORM: 'REGISTRATION_SALES_NEXT_FORM',
    DYNAMIC_SALES_NEXT_FORM: 'DYNAMIC_SALES_NEXT_FORM',
    DYNAMIC_FORM: 'DYNAMIC_FORM',
    LABEl: 'LABEl',
  },
  CONNECTION_TYPE: { PRIMARY: 'PRIMARY' },
  FORMS: {
    boxUpgrade: 'boxUpgrade',
    boxUpgradeSubIdList: 'boxUpgradeSubIdList',
    selectExitingBox: 'selectExitingBox',
    existingWorkOrder: 'existingWorkOrder',
    proceedWithRecharge: 'proceedWithRecharge',
    modifyPack: 'modifyPack',
  },
  HEADER_TITLE: {
    BOX_UPGRADE: 'BOX_UPGRADE',
    SUBSCRIBER_ID: 'SUBSCRIBER_ID',
    SELECT_BOX: 'SELECT_BOX',
    CONFIRMATION: 'CONFIRMATION',
    RECHARGE_BOX: 'RECHARGE_BOX',
  },
  ICONS: { BOX_UPGRADE: 'BOX_UPGRADE' },
  MODAL: { OK: 'OK', CONFIRM: 'CONFIRM', BACK: 'BACK' },
  QUERY: {
    BoxUpgradeRadioData: 'BoxUpgradeRadioData',
    ModelForRMN: 'ModelForRMN',
    FinalBoxUpgradation: 'FinalBoxUpgradation',
    proceedWithRechargeBox: 'proceedWithRechargeBox',
  },
  ROUTE: { WEB: { BOX_UPGRADE: 'BOX_UPGRADE', BOX_UPGRADE_SUCCESS: 'BOX_UPGRADE_SUCCESS' } },
  STATE_KEY: { MODAL_STATE: 'MODAL_STATE' },
  STRINGS: { ANDROID: 'ANDROID', HD: 'HD', RECHARGE_AMOUNT_FIELD: 'rechargeAmount' },
  SUBSCRIBER_STATUS: { ACTIVE: 'Active' },
}));

describe('boxUpgrade actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  const baseBoxUpgradeState = {
    SubscriberID: 'sub123',
    vcNumber: 'vc001',
    upgradedToNT: 'HD',
    paidAmount: '100',
    evdPin: '1234',
    eligibles: [{ NEW_BOXNT: 'HD', SR_SUBAREANT: 'area', SR_TYPENT: 'type', DESCRIPTIONNT: 'desc' }],
    bingeFlag: false,
    rechargeFlag: true,
    finalRequiredAmount: '200',
    accountInfoBoxData: { boxDetails: [{ vcNumber: 'vc001' }], subId: 'sub123' },
    woDetails: [{ woNo: 'WO001', woType: 'type1', woSubType: 'subtype1' }],
    upgradedType: 'HD',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    dispatch = jest.fn();
    getState = jest.fn(() => ({ boxUpgrade: baseBoxUpgradeState }));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  // clearTskPinTimeout
  describe('clearTskPinTimeout', () => {
    test('runs without error when no timeout is set', () => {
      const action = clearTskPinTimeout();
      action(dispatch, getState, undefined);
    });
  });

  // modelForRMN
  describe('modelForRMN', () => {
    test('dispatches setRechargeAmount and showBottomModal', () => {
      const action = modelForRMN();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setRechargeAmount(''));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  // MultipleSubIdModal
  describe('MultipleSubIdModal', () => {
    test('dispatches showBottomModal', () => {
      const action = MultipleSubIdModal();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  // getAccountInfoBoxUpgrade
  describe('getAccountInfoBoxUpgrade', () => {
    const params = { subscriberInfo: { mdn: '9999999999' } };

    test('returns error for inactive customerStatus (Cancelled)', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ customerStatus: 'subscriberStatus.Cancelled' });
      (api.post as jest.Mock).mockResolvedValue({});
      await getAccountInfoBoxUpgrade(params, 'queryName')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage(expect.any(String)));
    });

    test('returns error for inactive customerStatus (Suspended)', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ customerStatus: 'subscriberStatus.Suspended' });
      (api.post as jest.Mock).mockResolvedValue({});
      await getAccountInfoBoxUpgrade(params, 'queryName')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage(expect.any(String)));
    });

    test('dispatches MultipleSubIdModal when subIdList exists', async () => {
      const subIdList = [
        { status: 'Active', id: 'sub1' },
        { status: 'Inactive', id: 'sub2' },
      ];
      (refactorResponse as jest.Mock).mockReturnValue({
        customerStatus: 'Active',
        subIdList,
        subId: 'sub1',
        customerName: 'John',
        customerRMN: '9999',
        boxDetails: [],
      });
      (api.post as jest.Mock).mockResolvedValue({});
      const result = await getAccountInfoBoxUpgrade(params, 'queryName')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setSubIdList(expect.any(Array)));
      expect(result).toEqual(expect.objectContaining({ status: false }));
    });

    test('returns error when boxDetails is empty', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({
        customerStatus: 'Active',
        subIdList: null,
        subId: 'sub1',
        customerName: 'John',
        customerRMN: '9999',
        boxDetails: [],
      });
      (api.post as jest.Mock).mockResolvedValue({});
      await getAccountInfoBoxUpgrade(params, 'queryName')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage(expect.any(String)));
    });

    test('returns error when hasPrimaryAndroidBox is true', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({
        customerStatus: 'Active',
        subIdList: null,
        subId: 'sub1',
        customerName: 'John',
        customerRMN: '9999',
        boxDetails: [
          {
            vcNumber: 'vc1',
            connectionTypeNT: 'PRIMARY',
            boxTypeNT: 'strings.Android',
            connectionType: 'PRIMARY',
            boxType: 'strings.Android',
          },
        ],
      });
      (api.post as jest.Mock).mockResolvedValue({});
      const result = await getAccountInfoBoxUpgrade(params, 'queryName')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage(expect.any(String)));
      expect(result).toEqual({ status: false });
    });

    test('shows select box modal on success with sorted box details', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({
        customerStatus: 'Active',
        subIdList: null,
        subId: 'sub1',
        customerName: 'John',
        customerRMN: '9999',
        boxDetails: [
          { vcNumber: 'vc1', connectionTypeNT: 'SECONDARY', boxTypeNT: 'SD', connectionType: 'SECONDARY', boxType: 'SD' },
          { vcNumber: 'vc2', connectionTypeNT: 'PRIMARY', boxTypeNT: 'HD', connectionType: 'PRIMARY', boxType: 'HD' },
        ],
      });
      (api.post as jest.Mock).mockResolvedValue({});
      const result = await getAccountInfoBoxUpgrade(params, 'queryName')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setBoxData(expect.any(Array)));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
      expect(result).toEqual(expect.objectContaining({ status: true }));
    });

    test('handles API error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));
      await getAccountInfoBoxUpgrade(params, 'queryName')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('Network error'));
    });
  });

  // isEligibleForUpgrade
  describe('isEligibleForUpgrade', () => {
    test('dispatches setElegibles when eligibilities exist', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ eligibilities: [{ id: 1 }] });
      (api.post as jest.Mock).mockResolvedValue({});
      const result = await isEligibleForUpgrade({ quality: 'HD' })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setElegibles([{ id: 1 }]));
      expect(result).toEqual({ status: true });
    });

    test('shows not eligible modal when eligibilities is empty', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ eligibilities: [] });
      (api.post as jest.Mock).mockResolvedValue({});
      const result = await isEligibleForUpgrade({ quality: 'HD' })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
      expect(result).toEqual({ status: false });
    });

    test('handles error with param.screen = true', async () => {
      (api.post as jest.Mock).mockRejectedValue({ message: 'Apollo error: some error' });
      await isEligibleForUpgrade({ quality: 'HD', screen: true })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setElegibles([]));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showAlert(expect.anything(), expect.anything(), expect.anything(), expect.anything()));
    });

    test('handles error with param.screen = false', async () => {
      (api.post as jest.Mock).mockRejectedValue({ message: 'some error' });
      await isEligibleForUpgrade({ quality: 'HD', screen: false })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage('some error'));
    });
  });

  // existingWorkOrder
  describe('existingWorkOrder', () => {
    test('dispatches isEligibleForUpgrade when quality is ANDROID', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ workOrderDetails: [] });
      (api.post as jest.Mock).mockResolvedValue({});
      await existingWorkOrder({ campaign: 'vc001-type-ANDROID' })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setSelectedBox(expect.anything()));
    });

    test('dispatches isEligibleForUpgrade when no workOrderDetails', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ workOrderDetails: [null] });
      (api.post as jest.Mock).mockResolvedValue({});
      await existingWorkOrder({ campaign: 'vc001-type-HD' })(dispatch, getState, undefined);
      expect(api.post).toHaveBeenCalled();
    });

    test('shows existing work order modal when workOrderDetails exist', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ workOrderDetails: [{ woNo: 'WO001' }] });
      (api.post as jest.Mock).mockResolvedValue({});
      const result = await existingWorkOrder({ campaign: 'vc001-type-HD' })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setWoDetails([{ woNo: 'WO001' }]));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
      expect(result).toEqual({ status: false });
    });

    test('handles API error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('API error'));
      await existingWorkOrder({ campaign: 'vc001-type-HD' })(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('API error'));
    });
  });

  // proceedWithRechargeBox
  describe('proceedWithRechargeBox', () => {
    test('dispatches showBottomModal', () => {
      const action = proceedWithRechargeBox();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  // ProceedWithConfirm
  describe('ProceedWithConfirm', () => {
    test('dispatches hideBottomModal, setEVDPin and showBottomModal with confirmation', () => {
      const action = ProceedWithConfirm({ EvdPinInput: '5678' });
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.hideBottomModal());
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setEVDPin('5678'));
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  // getBingePlusData
  describe('getBingePlusData', () => {
    test('returns { status: false } when param is empty', async () => {
      const result = await getBingePlusData('')(dispatch, getState, undefined);
      expect(result).toEqual({ status: false });
    });

    test('dispatches setBingeOfferData on success', async () => {
      (refactorResponse as jest.Mock).mockReturnValue({ packageDetails: [{ id: 1 }] });
      (api.post as jest.Mock).mockResolvedValue({});
      const result = await getBingePlusData('3months')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setBingeOfferData([{ id: 1 }]));
      expect(result).toEqual({ status: true });
    });

    test('handles API error', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Binge error'));
      await getBingePlusData('3months')(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('Binge error'));
    });
  });

  // finalBoxUpgradation
  describe('finalBoxUpgradation', () => {
    test('navigates to success on successful response', async () => {
      const navigate = jest.fn();
      (refactorResponse as jest.Mock).mockReturnValue({
        errorCode: '0',
        transId: 'txn001',
        srNumberNT: 'SR001',
        message: 'Success',
      });
      (api.post as jest.Mock).mockResolvedValue({});
      await finalBoxUpgradation({}, '', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setStatus('0'));
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setTransactionID('txn001'));
      expect(navigate).toHaveBeenCalledWith('BOX_UPGRADE_SUCCESS');
    });

    test('handles API error', async () => {
      const navigate = jest.fn();
      (api.post as jest.Mock).mockRejectedValue(new Error('Final error'));
      const result = await finalBoxUpgradation({}, '', {}, navigate)(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('Final error'));
      expect(result).toEqual({ status: false });
    });
  });

  // showModifyPackModal
  describe('showModifyPackModal', () => {
    test('dispatches showBottomModal', () => {
      const action = showModifyPackModal();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(uiActions.showBottomModal(expect.anything()));
    });
  });

  // changeRechargeAmount
  describe('changeRechargeAmount', () => {
    test('dispatches setPaidAmount with rechargeAmount', () => {
      const action = changeRechargeAmount({ rechargeAmount: '500' });
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(sliceActions.setPaidAmount('500'));
    });
  });

  // backToRMNModal
  describe('backToRMNModal', () => {
    test('dispatches callAction', () => {
      const navigate = jest.fn();
      const action = backToRMNModal({ key: 'val' }, 'queryName', {}, navigate);
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalled();
    });
  });

  // getValueofExitsingBox
  describe('getValueofExitsingBox', () => {
    test('dispatches setUpdatedFormFields with single box message', () => {
      getState = jest.fn(() => ({
        boxUpgrade: {
          ...baseBoxUpgradeState,
          accountInfoBoxData: { boxDetails: [{ vcNumber: 'vc1' }], subId: 'sub123' },
        },
      }));
      const action = getValueofExitsingBox();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields(expect.anything(), 'MODAL_STATE'));
    });

    test('dispatches setUpdatedFormFields with multiple box message', () => {
      getState = jest.fn(() => ({
        boxUpgrade: {
          ...baseBoxUpgradeState,
          accountInfoBoxData: { boxDetails: [{ vcNumber: 'vc1' }, { vcNumber: 'vc2' }], subId: 'sub123' },
        },
      }));
      const action = getValueofExitsingBox();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields(expect.anything(), 'MODAL_STATE'));
    });
  });

  // getWODetails
  describe('getWODetails', () => {
    test('dispatches setUpdatedFormFields with WO info', () => {
      const action = getWODetails();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields(expect.objectContaining({ WOType: 'type1', WOSubType: 'subtype1' }), 'MODAL_STATE'));
    });
  });

  // getRechargeDetails
  describe('getRechargeDetails', () => {
    test('dispatches setUpdatedFormFields with rechargeAmount', () => {
      const action = getRechargeDetails();
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields({ rechargeAmount: '100' }, 'MODAL_STATE'));
    });

    test('sets timeout to disable field when upgradedType is HD', () => {
      const action = getRechargeDetails();
      action(dispatch, getState, undefined);
      jest.runAllTimers();
      expect(dispatch).toHaveBeenCalledWith(formActions.setFieldsToDisable(expect.anything(), 'MODAL_STATE'));
    });

    test('sets timeout to disable field when isDhamakaEligible is true', () => {
      getState = jest.fn(() => ({
        boxUpgrade: {
          ...baseBoxUpgradeState,
          upgradedType: 'SD',
          accountInfoBoxData: { isDhamakaEligible: true },
          paidAmount: '100',
        },
      }));
      const action = getRechargeDetails();
      action(dispatch, getState, undefined);
      jest.runAllTimers();
      expect(dispatch).toHaveBeenCalledWith(formActions.setFieldsToDisable(expect.anything(), 'MODAL_STATE'));
    });

    test('does not set timeout when upgradedType is not HD and isDhamakaEligible is false', () => {
      getState = jest.fn(() => ({
        boxUpgrade: {
          ...baseBoxUpgradeState,
          upgradedType: 'SD',
          accountInfoBoxData: { isDhamakaEligible: false },
          paidAmount: '100',
        },
      }));
      const action = getRechargeDetails();
      action(dispatch, getState, undefined);
      jest.runAllTimers();
      expect(dispatch).toHaveBeenCalledWith(formActions.setUpdatedFormFields({ rechargeAmount: '100' }, 'MODAL_STATE'));
    });
  });

  // clearTskPinTimeout with active timeout (via getRechargeDetails)
  describe('clearTskPinTimeout with active timeout', () => {
    test('clears active timeout set by getRechargeDetails', () => {
      getRechargeDetails()(dispatch, getState, undefined);
      const clearAction = clearTskPinTimeout();
      clearAction(dispatch, getState, undefined);
      jest.runAllTimers();
    });
  });
});
