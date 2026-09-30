import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/evdTransfer';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import { fetchChildPartnerDetails, doEVDTransferWeb } from './evdTransfer.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/evdTransfer', () => ({
  sliceActions: {
    setEvdTransferData: jest.fn(),
    setEvdTransferSuccessData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDropdownData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('const', () => ({
  PROPERTIES: {
    EVD_TRANSFER: {
      forwardTransfer: 'forwardTransfer',
      reverseTransfer: 'reverseTransfer',
    },
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    evdTransfer: {
      EVD_Transfer: {
        moduleName: 'EVD_Transfer',
        attributes: { Status: 'Status', amount: 'amount', childMdn: 'childMdn', childName: 'childName', typeOfTransfer: 'typeOfTransfer' },
      },
    },
  },
}));

describe('evdTransfer actions', () => {
  let dispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
  });

  test('fetchChildPartnerDetails success', async () => {
    const mockData = { result: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);

    const action = fetchChildPartnerDetails({ searchText: 'test' }, 'queryName');
    await action(dispatch, jest.fn(), undefined);

    expect(sliceActions.setEvdTransferData).toHaveBeenCalledWith(mockData);
    expect(formAction.setDropdownData).toHaveBeenCalledWith({ data: mockData.result, queryName: 'queryName' });
  });

  test('doEVDTransferWeb success', async () => {
    const mockData = { status: true };
    (api.post as jest.Mock).mockResolvedValue(mockData);

    const action = doEVDTransferWeb(
      {
        pin: '1234',
        selectPartner: { mobile: '1234567890', name: 'Test' },
        transferType: 'forwardTransfer',
        amount: '100',
      },
      'queryName',
    );
    await action(dispatch, jest.fn(), undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(sliceActions.setEvdTransferSuccessData).toHaveBeenCalledWith(mockData);
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });
});
