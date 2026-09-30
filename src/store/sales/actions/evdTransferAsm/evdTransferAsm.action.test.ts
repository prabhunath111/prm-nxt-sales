import uiActions from 'store/sales/actions/ui';
import { sliceActions as evdTransferActions } from 'store/sales/reducer/evdTransfer';
import { sliceActions as formReducerActions } from 'store/sales/reducer/form';
import { sliceActions as commonReducerActions } from 'store/sales/reducer/common';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { STATE_KEY } from 'const';
import { getFosDealerList, asmReverseTransfer, getBalanceFos } from './evdTransferAsm.action';

jest.mock('store/sales/reducer/evdTransfer', () => ({
  sliceActions: {
    setEvdTransferSuccessData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setDropdownOptionsData: jest.fn(),
    setDropdownData: jest.fn(),
    setNavigationData: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/common', () => ({
  sliceActions: {
    setCustomAmount: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
  showAlert: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  resetOptionData: jest.fn(),
  setNavigationData: jest.fn(),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

describe('evdTransferAsm actions', () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    user: { info: { userId: 'u1' } },
    form: {
      [STATE_KEY.FORM_STATE]: {
        searchSuggestions: { query1: [] },
      },
    },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const flushPromises = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  };

  test('getFosDealerList success for FOS', async () => {
    const mockData = { getFosDealerList: [{}] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    getFosDealerList({ FOS: '123' }, 'query1')(dispatch, getState, undefined);
    await flushPromises();

    expect(formReducerActions.setDropdownOptionsData).toHaveBeenCalled();
  });

  test('getFosDealerList success for Dealer', async () => {
    const mockData = { getFosDealerList: [{}] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    getFosDealerList({ Dealer: '123' }, 'query1')(dispatch, getState, undefined);
    await flushPromises();

    expect(formReducerActions.setDropdownData).toHaveBeenCalled();
  });

  test('getFosDealerList failure for FOS', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));

    getFosDealerList({ FOS: '123' }, 'query1')(dispatch, getState, undefined);
    await flushPromises();

    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('asmReverseTransfer success', async () => {
    const mockData = { status: true };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    const params = {
      selectDealer: { object: { mdn: '1' }, name: 'n' },
      customAmount: '100',
      fosDropdown: { object: { mdn: '2' } },
    };

    asmReverseTransfer(params, 'query1')(dispatch, getState, undefined);
    await flushPromises();

    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(evdTransferActions.setEvdTransferSuccessData).toHaveBeenCalled();
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('getBalanceFos success', async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    (refactorResponse as jest.Mock).mockReturnValue({ bal: 10 });

    getBalanceFos({ searchLocally: '123' }, 'query1')(dispatch, getState, undefined);
    await flushPromises();

    expect(commonReducerActions.setCustomAmount).toHaveBeenCalled();
  });
});
