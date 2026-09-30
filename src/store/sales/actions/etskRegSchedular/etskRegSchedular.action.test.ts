import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import { sliceActions } from 'store/sales/reducer/etskRegSchedular';
import { api } from 'services/apolloClient';
import { FORMS, CHILD_TYPE } from 'const';
import {
  rechargeDetails,
  installationDetails,
  installationTimeSlots,
  handleEtskScheduleDate,
  handleEtskTimeSlots,
  GetETSKSlot,
  pickPackAndGetSlotPrimaryAndSecondary,
  pickPackAndGetSlotSecondary,
} from './etskRegSchedular.action';

jest.mock('i18next', () => ({
  t: jest.fn((k) => k),
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
  setErrorMessage: jest.fn(() => ({ type: 'COMMON_SET_ERROR_MESSAGE' })),
  reSetErrorMessage: jest.fn(() => ({ type: 'COMMON_RESET_ERROR_MESSAGE' })),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((d) => d),
}));

jest.mock('store/sales/reducer/etskRegSchedular', () => ({
  sliceActions: {
    setTimeSlotsData: jest.fn((data) => ({ type: 'ETS_SET_TIME_SLOTS_DATA', payload: data })),
    handleEtskScheduleDate: jest.fn((date) => ({ type: 'ETS_HANDLE_SCHEDULE_DATE', payload: date })),
    handleEtskTimeSlots: jest.fn((slots) => ({ type: 'ETS_HANDLE_TIME_SLOTS', payload: slots })),
  },
}));

jest.mock('store/sales/reducer/woRecreation', () => ({
  sliceActions: {},
}));

jest.mock('store/sales/reducer/multiTvRegistration', () => ({
  sliceActions: {},
}));

// Mock the entire actions index to break circularity
jest.mock('store/sales/actions', () => ({}));

describe('etskRegSchedular actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  const mockInitialState = {
    etskRegSchedular: { date: '2023-01-01' },
    woRecreation: {
      accountDetailsPrimaryAndSecondaryRepush: {
        accountDetails: [{ SUBSCRIBERID: 'SUB123' }],
      },
    },
    multiTvRegistration: {
      tskValidateData: {
        subscriberID: 'SUB456',
        tskSerial: 'SERIAL123',
        packToAdd: 'PACK123',
      },
      tskPinParams: {
        subscriberID: 'SUB789',
        multiSubId: 'SUB000',
      },
    },
    etskRegistration: {
      accountCreationSuccessData: { bookingFormNumber: 'B1', subID: 'S1', subId: 'S2', subscriberId: 'S3' },
      selectedPacksToBuy: [{ siebelName: 'P1' }],
      freePackSelected: 'F1',
      boxTypeSelected: 'BT1',
    },
    etskMultiTv: { subscriberId: 'SUB1' },
    user: { info: { userId: 'U1' } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
    getState = jest.fn(() => JSON.parse(JSON.stringify(mockInitialState)));
  });

  test('rechargeDetails with formName', () => {
    rechargeDetails('customForm')(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        formName: 'customForm',
      }),
    );
    const { onClose } = (uiActions.showBottomModal as jest.Mock).mock.calls[0][0];
    onClose();
    expect(commonActions.reSetErrorMessage).toHaveBeenCalled();
  });

  test('rechargeDetails without formName', () => {
    rechargeDetails()(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        formName: FORMS.rechargeDetails,
      }),
    );
  });

  test('installationDetails', () => {
    installationDetails()(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CHILD_TYPE.CALENDAR,
      }),
    );
    const { onClose } = (uiActions.showBottomModal as jest.Mock).mock.calls[0][0];
    onClose();
    expect(commonActions.reSetErrorMessage).toHaveBeenCalled();
  });

  test('installationTimeSlots', () => {
    installationTimeSlots()(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CHILD_TYPE.DATE_TIME,
      }),
    );
    const { onClose } = (uiActions.showBottomModal as jest.Mock).mock.calls[0][0];
    onClose();
    expect(commonActions.reSetErrorMessage).toHaveBeenCalled();
  });

  test('handleEtskScheduleDate', () => {
    handleEtskScheduleDate('2023-01-01')(dispatch, getState, undefined);
    expect(sliceActions.handleEtskScheduleDate).toHaveBeenCalledWith('2023-01-01');
  });

  test('handleEtskTimeSlots', () => {
    handleEtskTimeSlots('slot1')(dispatch, getState, undefined);
    expect(sliceActions.handleEtskTimeSlots).toHaveBeenCalledWith('slot1');
  });

  test('GetETSKSlot success', async () => {
    const mockRes = { timeSlots: [] };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await GetETSKSlot()(dispatch, getState, undefined);
    expect(sliceActions.setTimeSlotsData).toHaveBeenCalledWith(mockRes);
  });

  test('GetETSKSlot success with fallback subID', async () => {
    const customState = {
      ...mockInitialState,
      etskRegistration: {
        ...mockInitialState.etskRegistration,
        accountCreationSuccessData: { subID: 'S1' },
      },
      etskMultiTv: { subscriberId: undefined },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await GetETSKSlot()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        subscriberId: 'S1',
      }),
    );
  });

  test('GetETSKSlot success with fallback subscriberId', async () => {
    const customState = {
      ...mockInitialState,
      etskRegistration: {
        ...mockInitialState.etskRegistration,
        accountCreationSuccessData: { subscriberId: 'S3' },
      },
      etskMultiTv: { subscriberId: undefined },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await GetETSKSlot()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        subscriberId: 'S3',
      }),
    );
  });

  test('GetETSKSlot success with undefined date', async () => {
    const customState = {
      ...mockInitialState,
      etskRegSchedular: { date: undefined },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await GetETSKSlot()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        preferredDate: '',
      }),
    );
  });

  test('GetETSKSlot failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    await GetETSKSlot()(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
  });

  test('pickPackAndGetSlotPrimaryAndSecondary success', async () => {
    const mockRes = { status: true, result: { slots: [] } };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await pickPackAndGetSlotPrimaryAndSecondary()(dispatch, getState, undefined);
    expect(sliceActions.setTimeSlotsData).toHaveBeenCalledWith(mockRes.result);
  });

  test('pickPackAndGetSlotPrimaryAndSecondary success with fallback subscriberId', async () => {
    const customState = {
      ...mockInitialState,
      etskRegistration: {
        ...mockInitialState.etskRegistration,
        accountCreationSuccessData: { subscriberId: 'S3' },
      },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await pickPackAndGetSlotPrimaryAndSecondary()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        subscriberId: 'S3',
      }),
    );
  });

  test('pickPackAndGetSlotPrimaryAndSecondary success with repush subscriberId', async () => {
    const customState = {
      ...mockInitialState,
      etskRegistration: {
        accountCreationSuccessData: {},
        selectedPacksToBuy: [],
      },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await pickPackAndGetSlotPrimaryAndSecondary()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        subscriberId: 'SUB123',
      }),
    );
  });

  test('pickPackAndGetSlotPrimaryAndSecondary with undefined date', async () => {
    const customState = {
      ...mockInitialState,
      etskRegSchedular: { date: undefined },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await pickPackAndGetSlotPrimaryAndSecondary()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        preferedDate: '',
      }),
    );
  });

  test('pickPackAndGetSlotPrimaryAndSecondary failure status', async () => {
    const mockRes = { status: false, message: 'fail' };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await pickPackAndGetSlotPrimaryAndSecondary()(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('pickPackAndGetSlotPrimaryAndSecondary catch error', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    await pickPackAndGetSlotPrimaryAndSecondary()(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
  });

  test('pickPackAndGetSlotSecondary success', async () => {
    const mockRes = { status: true, result: { slots: [] } };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await pickPackAndGetSlotSecondary()(dispatch, getState, undefined);
    expect(sliceActions.setTimeSlotsData).toHaveBeenCalledWith(expect.objectContaining(mockRes.result));
  });

  test('pickPackAndGetSlotSecondary success with pinParams fallback', async () => {
    const customState = {
      ...mockInitialState,
      multiTvRegistration: {
        tskValidateData: {},
        tskPinParams: { subscriberID: 'TP1' },
      },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await pickPackAndGetSlotSecondary()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        subscriberId: 'TP1',
      }),
    );
  });

  test('pickPackAndGetSlotSecondary success with multiSubId fallback', async () => {
    const customState = {
      ...mockInitialState,
      multiTvRegistration: {
        tskValidateData: {},
        tskPinParams: { multiSubId: 'SUB000' },
      },
    };
    getState.mockReturnValue(customState);
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await pickPackAndGetSlotSecondary()(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        subscriberId: 'SUB000',
      }),
    );
  });

  test('pickPackAndGetSlotSecondary failure status', async () => {
    const mockRes = { status: false, message: 'fail' };
    (api.post as jest.Mock).mockResolvedValue(mockRes);
    await pickPackAndGetSlotSecondary()(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('fail');
  });

  test('pickPackAndGetSlotSecondary catch error', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    await pickPackAndGetSlotSecondary()(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
  });
});
