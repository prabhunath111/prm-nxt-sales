import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/homePage';
import { api } from 'services/apolloClient';
import { PROPERTIES } from 'const';
import { getHomePageData, getTransactionSummary, getTransactionSummaryWithFilter, getBannerImages, getEvdBalance, getFtdData } from './homePage.action';

jest.mock('store/sales/reducer/homePage', () => ({
  sliceActions: {
    setHomePageData: jest.fn(),
    setTransaction: jest.fn(),
    setTransactionWithFilter: jest.fn(),
    setBannerImages: jest.fn(),
    setEvdBalance: jest.fn(),
    setFtdData: jest.fn(),
    homePageStart: jest.fn(),
    homePageSuccess: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
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

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

const flushPromises = () =>
  new Promise((resolve) => {
    resolve(null);
  });

describe('homePage actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => ({
      user: { info: { roleId: PROPERTIES.ROLES.ad, mdn: '123', userId: 'u1' } },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('getBannerImages success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, info: [] });
    await getBannerImages({})(dispatch, getState, undefined);
    await flushPromises();
    expect(sliceActions.setBannerImages).toHaveBeenCalled();
  });

  test('getHomePageData success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, homepageData: [{}] });
    await getHomePageData('q')(dispatch, getState, undefined);
    expect(sliceActions.setHomePageData).toHaveBeenCalled();
  });

  test('getHomePageData failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail msg'));
    await getHomePageData('q')(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail msg');
  });

  test('getTransactionSummary success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await getTransactionSummary('q', {})(dispatch, getState, undefined);
    expect(sliceActions.setTransaction).toHaveBeenCalled();
  });

  test('getTransactionSummary failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await getTransactionSummary('q', {})(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getTransactionSummaryWithFilter success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true, result: {} });
    await getTransactionSummaryWithFilter('q', {})(dispatch, getState, undefined);
    expect(sliceActions.setTransactionWithFilter).toHaveBeenCalled();
  });

  test('getTransactionSummaryWithFilter failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await getTransactionSummaryWithFilter('q', {})(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getEvdBalance success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ partnerBalance: 100 });
    await getEvdBalance('q')(dispatch, getState, undefined);
    expect(sliceActions.setEvdBalance).toHaveBeenCalled();
  });

  test('getEvdBalance no mdn', async () => {
    getState.mockReturnValue({ user: { info: {} } });
    await getEvdBalance('q')(dispatch, getState, undefined);
    expect(api.post).not.toHaveBeenCalled();
  });

  test('getFtdData success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await getFtdData('q')(dispatch, getState, undefined);
    expect(sliceActions.setFtdData).toHaveBeenCalled();
  });
});
