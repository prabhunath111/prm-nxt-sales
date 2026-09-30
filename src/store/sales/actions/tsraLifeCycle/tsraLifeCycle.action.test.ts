import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/tsraLifeCycle';
import {
  tsrafilter,
  trackTsraRequest,
  searchTrackTsraRequest,
  trackTsraAction,
  getTsraPartnerDetails,
  getTsraDropDowns,
  tsraActionApprovedReject,
  resetTsraSubscriberList,
} from './tsraLifeCycle.action';

jest.mock('store/sales/reducer/tsraLifeCycle', () => ({
  sliceActions: {
    setTsraSubscriberList: jest.fn(),
    setTsraSuccessData: jest.fn(),
    resetTsraSubscriberList: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    showErrorPage: jest.fn(),
    showAlert: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setTableColumnData: jest.fn(),
    setTableFilteredData: jest.fn(),
    setErrorMessage: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setMultipleDropdownOptionsData: jest.fn(),
    setFormValues: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({})),
    get: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('utils/formBuilderHelper', () => ({
  extractValues: jest.fn((v) => v),
  filterByParams: jest.fn((d) => d),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('const', () => ({
  CONNECTION_TYPE: { PRIMARY: 'PRIMARY' },
  PROPERTIES: { WO_RECREATION: { WO_STATUS: ['STATUS'] }, EVENT: { LOGOUT: 'LOGOUT' } },
  ROUTE: { WEB: { WORK_ORDER_RECREATION_SUCCEESS: 'SUCCESS', WO_RECREATION_CHANNELS: 'CHANNELS' } },
  STRINGS: { SUPPLY_INFORMATION: 'SUPPLY', MATERIAL_LIST: 'MATERIAL', SOMETHING_WENT_WRONG: 'WRONG', ERROR_OCCURED_WHILE_FETCHING_DATA: 'ERROR' },
  WO_VALIDATION: { CANCELLED: 'CANCELLED', OPEN: 'OPEN' },
  STATE_KEY: { FORM_STATE: 'form', MODAL_STATE: 'modal' },
  ALERT: { ERROR: 'ERROR', SUCCESS: 'SUCCESS' },
  MODAL: { OK: 'OK', MODIFY: 'MODIFY' },
  CHILD_TYPE: { DYNAMIC_FORM: 'DYNAMIC_FORM' },
  HEADER_TITLE: { CONFIGURE: 'CONFIGURE' },
  FORMS: { filterTsraInventory: 'filterTsraInventory', woRecreation: 'woRecreation' },
  ICONS: { WORK_ORDER: 'WORK_ORDER' },
  QUERY: {
    DoPickPackAndWorkOrderCreationPrimaryAndSecondary: 'DoPickPackAndWorkOrderCreationPrimaryAndSecondary',
    WoRechargeDetails: 'WoRechargeDetails',
    GET_ALL_FORMS: 'GET_ALL_FORMS',
    GET_ALL_PATH: 'GET_ALL_PATH',
    GET_ALL_ROLES: 'GET_ALL_ROLES',
  },
}));

describe('tsraLifeCycle actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockImplementation(() => Promise.resolve({}));
    (api.get as jest.Mock).mockImplementation(() => Promise.resolve({}));
    getState = jest.fn(() => ({
      common: { tableData: [] },
      form: { form: { formValues: { partnerCode: 'p1' } } },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('tsrafilter success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await tsrafilter({}, 'q')(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('tsrafilter failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await tsrafilter({}, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('trackTsraRequest success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ tsraTrack: [{ id: 1 }], tableColumns: [] });
    const res = await trackTsraRequest({ daysFilter: '1', statusFilter: 'OPEN' } as any, 'q')(dispatch, getState, undefined);
    expect(res.status).toBe(true);
    expect(commonActions.setTableColumnData).toHaveBeenCalled();
  });

  test('trackTsraRequest empty data', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ tsraTrack: [] });
    const res = await trackTsraRequest({ daysFilter: '1' } as any, 'q')(dispatch, getState, undefined);
    expect(res.status).toBe(false);
    expect(commonActions.setErrorMessage).toHaveBeenCalled();
  });

  test('trackTsraRequest failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const res = await trackTsraRequest({ daysFilter: '1' } as any, 'q')(dispatch, getState, undefined);
    expect(res.status).toBe(false);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('searchTrackTsraRequest', () => {
    searchTrackTsraRequest({ searchText: 'abc' } as any)(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('trackTsraAction success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ tsraTrack: [] });
    await trackTsraAction({} as any, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setTsraSubscriberList).toHaveBeenCalled();
  });

  test('trackTsraAction failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await trackTsraAction({} as any, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getTsraPartnerDetails success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ partnerDetails: { id: 1 } });
    await getTsraPartnerDetails({} as any, 'q')(dispatch, getState, undefined);
    expect(formActions.setFormValues).toHaveBeenCalled();
  });

  test('getTsraPartnerDetails failure', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getTsraPartnerDetails({} as any, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('getTsraDropDowns success', async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    await getTsraDropDowns({} as any, 'q')(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('getTsraDropDowns failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await getTsraDropDowns({} as any, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('tsraActionApprovedReject success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await tsraActionApprovedReject({ firstName: 'f', actionType: 'APP' } as any, 'q')(dispatch, getState, undefined);
    expect(sliceActions.setTsraSuccessData).toHaveBeenCalled();
  });

  test('tsraActionApprovedReject failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await tsraActionApprovedReject({ firstName: 'f', actionType: 'APP' } as any, 'q')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('resetTsraSubscriberList', () => {
    resetTsraSubscriberList()(dispatch, getState, undefined);
    expect(sliceActions.resetTsraSubscriberList).toHaveBeenCalled();
  });
});
