import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/changeEvdPin';
import uiActions from 'store/sales/actions/ui';
import { changeEvdPin } from './changeEvdPin.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/changeEvdPin', () => ({
  sliceActions: {
    changeEvdPinSuccess: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
  showAlert: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('const', () => ({
  ALERT: { SUCCESS: 'SUCCESS' },
  MODAL: { OK: 'OK' },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    ChangeEVDPin: {
      ChangeEVDPinSubmit: { moduleName: 'ChangeEVDPinSubmit', attributes: { Status: 'Status', Success: 'Success' } },
    },
  },
}));

describe('changeEvdPin actions', () => {
  let dispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
  });

  test('changeEvdPin success', async () => {
    const mockData = { message: 'Success' };
    (api.post as jest.Mock).mockResolvedValue(mockData);

    const action = changeEvdPin({ oldPin: '1234', newPin: '5678', confirmPin: '5678', data: {} });
    await action(dispatch, jest.fn(), undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(dispatch).toHaveBeenCalledWith(uiActions.showAlert('Success', 'SUCCESS', expect.anything(), {}));
    expect(sliceActions.changeEvdPinSuccess).toHaveBeenCalledWith(mockData);
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });
});
