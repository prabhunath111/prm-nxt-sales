import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { checkRMNEligibility, updateMobileNumber } from './rmnUpdate.action';

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    showAlert: jest.fn(),
    showErrorPage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setSubIdList: jest.fn(),
    setFormDependentDefault: jest.fn(),
    setSubIdListDefault: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((r) => r),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    RMNUpdate: {
      RMNUpdateValidateIDMultiSID: { moduleName: 'm1', attributes: { RMN: 'r1' } },
      RMNUpdateValidateID: { moduleName: 'm2', attributes: { RMN: 'r1' } },
      RMNUpdateProceed: { moduleName: 'm3', attributes: { OldRMN: 'or1', newRMN: 'nr1' } },
    },
  },
}));

jest.mock(
  'store/sales/query',
  () =>
    new Proxy(
      {},
      {
        get: (_, property) => property,
      },
    ),
);

jest.mock('const', () => ({
  ALERT: { SUCCESS: 'SUCCESS' },
  MODAL: { OK: 'OK' },
  ROUTE: { WEB: { CHECK_RMN_UPDATE: 'CHECK_RMN_UPDATE' } },
}));

describe('rmnUpdate actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('checkRMNEligibility with subIdList (multi-SID)', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({
      accountInfo: { subIdList: ['1', '2'] },
    });

    const result = await checkRMNEligibility({ subscriberInfo: '123' }, 'query')(dispatch, getState, undefined);

    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(formActions.setSubIdList).toHaveBeenCalledWith(['1', '2']);
    expect(result.status).toBe(false);
  });

  test('checkRMNEligibility single SID', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({
      accountInfo: { rmn: '111', subId: '222' },
    });

    const result = await checkRMNEligibility({}, 'query')(dispatch, getState, undefined);

    expect(formActions.setFormDependentDefault).toHaveBeenCalledWith({ existingRMN: '111', subscriberID: '222' });
    expect(formActions.setSubIdListDefault).toHaveBeenCalled();
    expect(result.status).toBe(true);
  });

  test('checkRMNEligibility catch error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    await checkRMNEligibility({}, 'query')(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('updateMobileNumber success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    (refactorResponse as jest.Mock).mockReturnValue({ updateMessage: 'Updated' });

    const params = { subscriberID: '123', newRMN: '456', existingRMN: '789' };
    await updateMobileNumber(params, 'query')(dispatch, getState, undefined);

    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(uiActions.showAlert).toHaveBeenCalledWith('Updated', 'SUCCESS', expect.any(Object), {});
  });

  test('updateMobileNumber catch error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    await updateMobileNumber({ subscriberID: '123', newRMN: '456' }, 'query')(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });
});
