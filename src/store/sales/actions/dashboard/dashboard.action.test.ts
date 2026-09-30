import { sliceActions } from 'store/sales/reducer/dashboard';
import uiActions from 'store/sales/actions/ui';
import { api } from 'services/apolloClient';
import { dashboardAction } from './dashboard.action';

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/dashboard', () => ({
  sliceActions: {
    dashboardStart: jest.fn(),
    dashboardSuccess: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showErrorPage: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('store/sales/query', () => ({
  SAMPLE_QUERY: 'SAMPLE_QUERY',
}));

describe('dashboard actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn();
  });

  test('dashboardAction success', async () => {
    const mockData = { data: 'test' };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = dashboardAction({
      cumulativeFilterData: {},
      cumulativeTableData: [],
      monthWiseFilterData: {},
      monthWiseTableData: [],
      infoLastUpdatedDate: '2023-01-01',
    } as any);
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(sliceActions.dashboardStart());
    expect(sliceActions.dashboardSuccess).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });

  test('dashboardAction failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = dashboardAction({
      cumulativeFilterData: {},
      cumulativeTableData: [],
      monthWiseFilterData: {},
      monthWiseTableData: [],
      infoLastUpdatedDate: '2023-01-01',
    } as any);
    await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });
});
