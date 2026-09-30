import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/fetchLanguage';
import { api } from 'services/apolloClient';
import { refactorResponse } from 'utils/responseHelper';
import { fetchLanguageAction, setLanguagePreference, getMenus } from './fetchLanguage.action';

jest.mock('store/sales/reducer/fetchLanguage', () => ({
  sliceActions: {
    setLanguageData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showAlert: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('store/sales/actions/user', () => ({
  addNavigation: jest.fn(),
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

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

describe('fetchLanguage actions', () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    user: { info: { userId: 'u1' } },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const flushPromises = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  };

  test('fetchLanguageAction success', async () => {
    const mockData = { result: [{}] };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    fetchLanguageAction()(dispatch, getState, undefined);
    await flushPromises();

    expect(sliceActions.setLanguageData).toHaveBeenCalledWith(mockData.result);
  });

  test('fetchLanguageAction error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    fetchLanguageAction()(dispatch, getState, undefined);
    await flushPromises();

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('setLanguagePreference success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });

    setLanguagePreference('en')(dispatch, getState, undefined);
    await flushPromises();

    expect(api.get).toHaveBeenCalledWith(expect.any(String), { languagePreference: 'en' });
  });

  test('setLanguagePreference error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    setLanguagePreference('en')(dispatch, getState, undefined);
    await flushPromises();

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('getMenus success', async () => {
    const mockData = { menus: [], routes: [], dashboard: [] };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    (refactorResponse as jest.Mock).mockReturnValue(mockData);

    getMenus()(dispatch, getState, undefined);
    await flushPromises();

    expect(api.get).toHaveBeenCalled();
  });

  test('getMenus error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));

    getMenus()(dispatch, getState, undefined);
    await flushPromises();

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });
});
