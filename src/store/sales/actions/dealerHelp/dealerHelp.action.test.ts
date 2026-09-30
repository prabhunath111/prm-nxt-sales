import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/dealerHelp';
import { api } from 'services/apolloClient';
import { ROUTE } from 'const';
import {
  getMainCategoryBR,
  getAllSRDetailsForLoginUser,
  createBRSSRWorkOrder,
  getBposDetailsDirectFromFE,
  getDashboardBingeRetailerLatest,
  bingeDshBoardDtlsFromService,
} from './dealerHelp.action';

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/dealerHelp', () => ({
  sliceActions: {
    setNatureOfRequest: jest.fn(),
    setTypeOfRequest: jest.fn(),
    setDealerSubArea: jest.fn(),
    setdealerRoleandID: jest.fn(),
    setTableColumn: jest.fn(),
    setTableRowData: jest.fn(),
    setdealerSuccessData: jest.fn(),
    setBposData: jest.fn(),
    setBingeLatestSummary: jest.fn(),
    setBingeTableColumn: jest.fn(),
    setBingeTableData: jest.fn(),
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

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((objs) => objs.ios),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  },
  StyleSheet: {
    hairlineWidth: 1,
    create: jest.fn((styles) => styles),
  },
}));

jest.mock('react-native-device-info', () => ({
  getModel: jest.fn(() => 'iPhone'),
  getSystemVersion: jest.fn(() => '16.0'),
  getVersion: jest.fn(() => '1.0.0'),
}));

jest.mock('store/sales/query', () => ({
  getMainCategoryBR: 'getMainCategoryBR',
  getAllSRDetailsForLoginUser: 'getAllSRDetailsForLoginUser',
  createBRSSRWorkOrder: 'createBRSSRWorkOrder',
  getBposDetailsDirectFromFE: 'getBposDetailsDirectFromFE',
  getDashboardBingeRetailerLatest: 'getDashboardBingeRetailerLatest',
  bingeDshBoardDtlsFromService: 'bingeDshBoardDtlsFromService',
}));

describe('dealerHelp actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;
  let navigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      user: {
        info: {
          mdn: '1234567890',
          userId: 'user123',
        },
      },
      dealerHelp: {
        bposData: {
          bposId: 'bpos123',
          newRole: 'role123',
        },
      },
    }));
    navigate = jest.fn();
  });

  test('getMainCategoryBR success', async () => {
    const mockData = {
      result: {
        role: 'role',
        bposId: 'bpos',
        mainCategory: 'main',
        subCategory: 'sub',
        data: [{ SUB_AREA_MAPPING: 'area' }],
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getMainCategoryBR({}, 'query', {}, navigate);
    const result = await action(dispatch, getState, undefined);

    expect(sliceActions.setNatureOfRequest).toHaveBeenCalledWith('main');
    expect(sliceActions.setTypeOfRequest).toHaveBeenCalledWith('sub');
    expect(sliceActions.setDealerSubArea).toHaveBeenCalledWith('area');
    expect(sliceActions.setdealerRoleandID).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.DEALER_RAISE_REQUEST);
    expect(result).toEqual({ status: true });
  });

  test('getMainCategoryBR failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = getMainCategoryBR({}, 'query', {}, navigate);
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });

  test('getAllSRDetailsForLoginUser success', async () => {
    const mockData = { tableColumns: [], result: [] };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = getAllSRDetailsForLoginUser({}, 'query', {}, navigate);
    const result = await action(dispatch, getState, undefined);

    expect(sliceActions.setTableColumn).toHaveBeenCalledWith(mockData.tableColumns);
    expect(sliceActions.setTableRowData).toHaveBeenCalledWith(mockData.result);
    expect(navigate).toHaveBeenCalledWith(ROUTE.WEB.DEALER_TRACK_REQUEST);
    expect(result).toEqual({ status: true });
  });

  test('getAllSRDetailsForLoginUser failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = getAllSRDetailsForLoginUser({}, 'query', {}, navigate);
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });

  test('createBRSSRWorkOrder success', async () => {
    const mockData = { response: 'ok' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = createBRSSRWorkOrder({ bposId: '1' });
    const result = await action(dispatch, getState, undefined);

    expect(sliceActions.setdealerSuccessData).toHaveBeenCalledWith('ok');
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('createBRSSRWorkOrder failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = createBRSSRWorkOrder({});
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });

  test('getBposDetailsDirectFromFE success', async () => {
    const mockData = { some: 'data' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getBposDetailsDirectFromFE();
    const result = await action(dispatch, getState, undefined);

    expect(result).toEqual({ status: true, data: mockData });
  });

  test('getBposDetailsDirectFromFE failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = getBposDetailsDirectFromFE();
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });

  test('getDashboardBingeRetailerLatest success', async () => {
    const mockData = { response: 'data' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = getDashboardBingeRetailerLatest({ bposId: '1', newRole: 'role' });
    const result = await action(dispatch, getState, undefined);

    expect(sliceActions.setBposData).toHaveBeenCalled();
    expect(sliceActions.setBingeLatestSummary).toHaveBeenCalledWith('data');
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('getDashboardBingeRetailerLatest failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = getDashboardBingeRetailerLatest({});
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });

  test('bingeDshBoardDtlsFromService success', async () => {
    const mockData = { tableColumns: [], response: 'data' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = bingeDshBoardDtlsFromService({ fromDt: '2023-01-01' });
    const result = await action(dispatch, getState, undefined);

    expect(sliceActions.setBingeTableColumn).toHaveBeenCalledWith(mockData.tableColumns);
    expect(sliceActions.setBingeTableData).toHaveBeenCalledWith(mockData.response);
    expect(result).toEqual({ status: true, data: mockData });
  });

  test('bingeDshBoardDtlsFromService failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = bingeDshBoardDtlsFromService({});
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });
});
