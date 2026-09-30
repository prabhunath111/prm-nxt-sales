import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/tsraInventory';
import {
  tsraInventory,
  filterInventory,
  resetTsraFilterData,
  searchTsraInventory,
  sortTsraInventoryAlphabetically,
  sortTsraInventoryByMaxStockDays,
  sortTsraInventoryByMaxStockDaysAsc,
} from './tsraInventory.action';

jest.mock('store/sales/reducer/tsraInventory', () => ({
  sliceActions: {
    setSelcectedFilters: jest.fn(),
    tsraFilterCount: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
    showErrorPage: jest.fn(),
    hideBottomModal: jest.fn(),
    showBottomModal: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setTableColumnData: jest.fn(),
    setTotalListCount: jest.fn(),
    setErrorMessage: jest.fn(),
    setTableFilteredData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setUpdatedFormFields: jest.fn(),
    setFormValues: jest.fn(),
  },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('utils/formBuilderHelper', () => ({
  filterByParams: jest.fn((d) => d),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('const', () => ({
  STRINGS: {
    ALL: 'ALL',
    SUPPLY_INFORMATION: 'SUPPLY',
    MATERIAL_LIST: 'MATERIAL',
    SOMETHING_WENT_WRONG: 'WRONG',
    MAXIMUM_STOCK: 'MAX',
    CURRENT_STOCK: 'CUR',
    CONSUMPTION_INFO: 'CONS',
    ERROR_OCCURED_WHILE_FETCHING_DATA: 'ERROR',
  },
  ALERT: { ERROR: 'ERROR', SUCCESS: 'SUCCESS' },
  MODAL: { OK: 'OK', MODIFY: 'MODIFY' },
  STATE_KEY: { FORM_STATE: 'form', MODAL_STATE: 'modal' },
  CHILD_TYPE: { DYNAMIC_FORM: 'DYNAMIC_FORM' },
  HEADER_TITLE: { CONFIGURE: 'CONFIGURE' },
  FORMS: { tsraInventory: 'tsraInventory', filterTsraInventory: 'filterTsraInventory' },
  ICONS: { WORK_ORDER: 'WORK_ORDER' },
  QUERY: {
    DoPickPackAndWorkOrderCreationPrimaryAndSecondary: 'DoPickPackAndWorkOrderCreationPrimaryAndSecondary',
    WoRechargeDetails: 'WoRechargeDetails',
  },
}));

describe('tsraInventory actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockImplementation(() => Promise.resolve({}));
    getState = jest.fn(() => ({
      tsraInventory: { selcectedFilters: {} },
      common: { tableData: [{ materialNameNT: 'A', inhandstock: 10, daysOfStockLeft: 5, quantitytobesupplied: 2 }] },
      form: { form: { formValues: {} } },
    }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('tsraInventory success - no filters', async () => {
    (api.get as jest.Mock).mockResolvedValue({ tsraInventory: [{ id: 1 }], tableColumns: [], count: 1 });
    await tsraInventory({} as any, 'q')(dispatch, getState, undefined);
    expect(sliceActions.tsraFilterCount).toHaveBeenCalledWith(0);
  });

  test('tsraInventory success - with all filter', async () => {
    (api.get as jest.Mock).mockResolvedValue({ tsraInventory: [{ id: 1 }], tableColumns: [], count: 1 });
    await tsraInventory({ multiCheckbox: [{ id: 'all' }] } as any, 'q')(dispatch, getState, undefined);
    expect(sliceActions.tsraFilterCount).toHaveBeenCalledWith(1);
  });

  test('tsraInventory success - with specific filter', async () => {
    (api.get as jest.Mock).mockResolvedValue({ tsraInventory: [{ id: 1 }], tableColumns: [], count: 1 });
    await tsraInventory({ multiCheckbox: [{ id: 'supplyInformation' }] } as any, 'q')(dispatch, getState, undefined);
    expect(sliceActions.tsraFilterCount).toHaveBeenCalledWith(1);
  });

  test('tsraInventory status false', async () => {
    (api.get as jest.Mock).mockResolvedValue({ tsraInventory: [], message: 'no data' });
    const res = await tsraInventory({} as any, 'q')(dispatch, getState, undefined);
    expect(res.status).toBe(false);
    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('no data');
  });

  test('tsraInventory failure', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const res = await tsraInventory({} as any, 'q')(dispatch, getState, undefined);
    expect(res.status).toBe(false);
    expect(uiActions.showErrorPage).toHaveBeenCalled();
  });

  test('filterInventory', () => {
    filterInventory({} as any)(dispatch, getState, undefined);
    expect(uiActions.showBottomModal).toHaveBeenCalled();
  });

  test('resetTsraFilterData', () => {
    resetTsraFilterData({} as any)(dispatch, getState, undefined);
    expect(sliceActions.tsraFilterCount).toHaveBeenCalledWith('');
  });

  test('searchTsraInventory - hideZero and showLowSupply', () => {
    searchTsraInventory({ hideZeroInventory: true, showLowSupply: true })(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('sortTsraInventoryAlphabetically', () => {
    sortTsraInventoryAlphabetically()(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('sortTsraInventoryByMaxStockDays', () => {
    sortTsraInventoryByMaxStockDays()(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });

  test('sortTsraInventoryByMaxStockDaysAsc', () => {
    sortTsraInventoryByMaxStockDaysAsc()(dispatch, getState, undefined);
    expect(commonActions.setTableFilteredData).toHaveBeenCalled();
  });
});
