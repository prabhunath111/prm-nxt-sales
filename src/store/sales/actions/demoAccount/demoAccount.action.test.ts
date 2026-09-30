import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/demoAccount';
import { api } from 'services/apolloClient';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { callAction } from 'utils/formBuilderHelper';
import {
  demoAccountCreationModal,
  demoAccountETSKModal,
  checkDealerEligibilityForDemo,
  tskPinValidateForDemo,
  doDemoAccountCreationAndTSKRegistration,
  checkForCategory,
  doPickPackAndWorkOrderCreationPrimary,
  validateDemoAcEtsk,
} from './demoAccount.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: {
    testQuery: 'testQuery',
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
  setRadioContainerOptions: jest.fn(),
  setMultipleDropdownOptionsData: jest.fn(),
  setDealerDetails: jest.fn(),
  setUpdatedFormFields: jest.fn(),
}));

jest.mock('store/sales/reducer/demoAccount', () => ({
  sliceActions: {
    setDemoAccountEVDCode: jest.fn(),
    setDemoAccountDealerDetails: jest.fn(),
    setIsETSK: jest.fn(),
    setSetUpBox: jest.fn(),
    setTskValidationDetails: jest.fn(),
    setPackDetails: jest.fn(),
    setDemoAccountSuccessData: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    DemoAccountCreation: {
      DemoAccountCreation_PageVisit: { moduleName: 'mod1', attributes: { Status: 'Status' } },
      DemoAccountETSKRepush_PageVisit: { moduleName: 'mod2', attributes: { Status: 'Status' } },
      DemoAccountCreation_ValidateDistributor_DealerCode: { moduleName: 'mod3', attributes: { Status: 'Status', dealerId: 'dealerId' } },
      DemoAccountCreation_Tsk_Validation: { moduleName: 'mod4', attributes: { Status: 'Status', TSKPin: 'pin', dealerId: 'dealerId' } },
      DemoAccountCreation_Pickpack_PageVisit: { moduleName: 'mod5', attributes: { Status: 'Status', TSKPin: 'pin', boxType: 'box' } },
      DemoAccountCreation_Pickpack_Proceed: { moduleName: 'mod6', attributes: { Status: 'Status', SubscriberID: 'sub', dealerCodePrimary: 'code', tskSerialNumber: 'sn' } },
      DemoAccountCreation_Success_PageVisit: { moduleName: 'mod7', attributes: { Status: 'Status', SubscriberID: 'sub', dealerCodePrimary: 'code', tskSerialNumber: 'sn' } },
      DemoAccountETSKRepush_Validate: { moduleName: 'mod8', attributes: { Status: 'Status', bookingFormNumber: 'bfn' } },
      DemoAccountETSKRepushPickPack_PageVisit: { moduleName: 'mod9', attributes: { Status: 'Status', bookingFormNumber: 'bfn' } },
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

describe('demoAccount actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      user: { info: { userId: 'U123' } },
      demoAccount: {
        evdCode: 'EVD123',
        demoAccountDealerDetails: {
          response: {
            eligibility: [{ DLR_ID: 'D123', ELIGIBILE_COUNT: '1' }],
            dealerDetails: {
              name: 'John Doe',
              nameNT: 'John Doe',
              roleIdNT: 'R1',
              addressLine1NT: 'Addr1',
              cityNT: 'City',
              districtNT: 'Dist',
              mobileNo: '1234567890',
              pincode: '400001',
              stateNT: 'State',
              townNT: 'Town',
            },
          },
        },
        packDetails: {
          response: {
            subID: 'S123',
            dealerCode: 'C123',
            packageName: [{ OfferCategory: 'Cat1', PackageInfo: [] }],
          },
        },
        isETSK: false,
      },
    }));
  });

  test('demoAccountCreationModal', () => {
    const action = demoAccountCreationModal({ showCloseIcon: true });
    action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('demoAccountCreationModal default close icon', () => {
    const action = demoAccountCreationModal({});
    action(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('demoAccountETSKModal', () => {
    const action = demoAccountETSKModal({});
    action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('checkDealerEligibilityForDemo success', async () => {
    const mockData = {
      status: true,
      response: {
        eligibility: [{ ELIGIBILE_COUNT: '5' }],
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = checkDealerEligibilityForDemo({ subscriberInfo: 'D123' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.setModalLoader).toHaveBeenCalled();
    expect(sliceActions.setDemoAccountEVDCode).toHaveBeenCalledWith('D123');
    expect(sliceActions.setDemoAccountDealerDetails).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('checkDealerEligibilityForDemo not eligible (0)', async () => {
    const mockData = {
      status: true,
      response: {
        eligibility: [{ ELIGIBILE_COUNT: '0' }],
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = checkDealerEligibilityForDemo({ subscriberInfo: 'D123' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalled();
    expect(result).toEqual({ status: false, data: mockData });
  });

  test('checkDealerEligibilityForDemo not eligible (null)', async () => {
    const mockData = {
      status: true,
      response: {
        eligibility: [{ ELIGIBILE_COUNT: null }],
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = checkDealerEligibilityForDemo({ subscriberInfo: 'D123' }, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('checkDealerEligibilityForDemo zero branch case', async () => {
    const mockData = {
      status: true,
      response: {
        eligibility: [{ ELIGIBILE_COUNT: '-1' }],
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = checkDealerEligibilityForDemo({ subscriberInfo: 'D123' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);
    expect(result.status).toBe(false);
  });

  test('checkDealerEligibilityForDemo catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = checkDealerEligibilityForDemo({}, 'testQuery');
    const result = await action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false, message: 'error' });
  });

  test('tskPinValidateForDemo ETSK case', () => {
    const navigate = jest.fn();
    const action = tskPinValidateForDemo({ connectionType: 'ETSK', primaryBoxType: { nameNT: 'HD' }, tskPin: '1234' }, 'query', {}, navigate);
    const result = action(dispatch, getState, undefined);

    expect(sliceActions.setIsETSK).toHaveBeenCalledWith(true);
    expect(callAction).toHaveBeenCalled();
    expect(result).toEqual({ status: true });
  });

  test('tskPinValidateForDemo success non-ETSK', async () => {
    const mockData = { status: true, response: { boxType: 'HD' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = tskPinValidateForDemo({ connectionType: 'NORMAL', primaryBoxType: { nameNT: 'HD' }, tskPin: '1234' }, 'testQuery', {}, jest.fn());
    const result = await action(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(sliceActions.setTskValidationDetails).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('tskPinValidateForDemo catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = tskPinValidateForDemo({}, 'testQuery', {}, jest.fn());
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false, message: 'error' });
  });

  test('doDemoAccountCreationAndTSKRegistration success', async () => {
    jest.useFakeTimers();
    const navigate = jest.fn();
    const mockData = { status: true, response: { offerCategory: [], subID: 'S1' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doDemoAccountCreationAndTSKRegistration({ tskPin: '1234', boxType: 'HD', isEtskDemoAcc: false }, 'testQuery', {}, navigate);
    const promise = action(dispatch, getState, undefined);

    jest.advanceTimersByTime(200);
    expect(uiActions.setLoader).toHaveBeenCalled();

    const result = await promise;
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
    expect(sliceActions.setPackDetails).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
    jest.useRealTimers();
  });

  test('doDemoAccountCreationAndTSKRegistration lastName branch', async () => {
    getState.mockReturnValue({
      user: { info: { userId: 'U123' } },
      demoAccount: {
        evdCode: 'EVD123',
        demoAccountDealerDetails: {
          response: {
            dealerDetails: { name: 'John', nameNT: 'John' },
          },
        },
      },
    });
    const mockData = { status: true, response: {} };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doDemoAccountCreationAndTSKRegistration({}, 'testQuery', {}, jest.fn());
    await action(dispatch, getState, undefined);
    expect(api.post).toHaveBeenCalled();
  });

  test('doDemoAccountCreationAndTSKRegistration timeout cleanup', async () => {
    jest.useFakeTimers();
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    const action = doDemoAccountCreationAndTSKRegistration({}, 'testQuery', {}, jest.fn());
    await action(dispatch, getState, undefined);
    // Finally block covers clearTimeout
    jest.useRealTimers();
  });

  test('doDemoAccountCreationAndTSKRegistration catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = doDemoAccountCreationAndTSKRegistration({}, 'testQuery', {}, jest.fn());
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false, message: 'error' });
  });

  test('checkForCategory success', async () => {
    const action = checkForCategory({ offerName: 'Cat1' });
    const result = await action(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
    expect(result).toEqual({ status: true, message: '' });
  });

  test('checkForCategory branch null', async () => {
    const action = checkForCategory({ null: 'Cat1' });
    await action(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('doPickPackAndWorkOrderCreationPrimary success', async () => {
    const mockData = { status: true, response: {} };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = doPickPackAndWorkOrderCreationPrimary({ packageName: { name: 'P1' } }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(sliceActions.setDemoAccountSuccessData).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('doPickPackAndWorkOrderCreationPrimary catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = doPickPackAndWorkOrderCreationPrimary({}, 'testQuery');
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false, message: 'error' });
  });

  test('validateDemoAcEtsk success', async () => {
    const navigate = jest.fn();
    const mockData = { status: true, response: { offerCategory: [], subID: 'S1', boxType: { boxTypeNT: 'HD' }, dealerDetails: { name: 'D1' } } };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = validateDemoAcEtsk({ bookingFormNumberRepush: 'BFN1' }, 'testQuery', {}, navigate);
    const result = await action(dispatch, getState, undefined);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('validateDemoAcEtsk catch error', async () => {
    (api.post as jest.Mock).mockRejectedValue({ message: 'error' });
    const action = validateDemoAcEtsk({}, 'testQuery', {}, jest.fn());
    const result = await action(dispatch, getState, undefined);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false, message: 'error' });
  });
});
