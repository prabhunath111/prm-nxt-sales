import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { LOG } from 'config/logger';
import { demoBoxDetails, searchDemoBoxDetails, changeDealer } from './demoBoxDetails.action';

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: {
    testQuery: 'testQuery',
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
  showBottomModal: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setAllTableData: jest.fn(),
  setErrorMessage: jest.fn(),
  setTableColumnData: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setUpdatedFormFields: jest.fn(),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('utils/formBuilderHelper', () => ({
  formatFilter: jest.fn((val) => val),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    demoBoxDetail: {
      DemoBoxDetail: { moduleName: 'mod1', attributes: { Status: 'Status', subscriberID: 'sub', evdCode: 'evd', mdn: 'mdn' } },
    },
  },
}));

jest.mock('config/logger', () => ({
  LOG: {
    info: jest.fn(),
  },
}));

describe('demoBoxDetails actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      common: {
        dealerDetails: { dealerId: 'D123' },
      },
      form: {
        formState: {
          formNavigationData: { params: { subscriberId: 'SUB123' } },
        },
      },
    }));
  });

  test('demoBoxDetails success', async () => {
    const mockData = { result: [{ id: 1 }] };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = demoBoxDetails({ evdCode: 'EVD1', subscriberId: 'S1' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(formActions.setUpdatedFormFields).toHaveBeenCalled();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(commonActions.setAllTableData).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ data: mockData, status: true });
  });

  test('demoBoxDetails success but no result', async () => {
    const mockData = { result: [], message: 'no data' };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = demoBoxDetails({ dealerName: 'Dealer1' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(commonActions.setErrorMessage).toHaveBeenCalledWith('no data');
    expect(result).toEqual({ data: mockData, status: false });
  });

  test('demoBoxDetails success with empty params for coverage', async () => {
    const mockData = { result: [{ id: 1 }] };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    // Case 1: subscriberId empty
    let action = demoBoxDetails({ subscriberId: '', evdCode: 'EVD1' }, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith('mod1', expect.objectContaining({ sub: '' }));

    // Case 2: evdCode and dealerName empty
    action = demoBoxDetails({ subscriberId: 'S1', evdCode: '', dealerName: '' }, 'testQuery');
    await action(dispatch, getState, undefined);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith('mod1', expect.objectContaining({ evd: '' }));
  });

  test('demoBoxDetails failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = demoBoxDetails({}, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
    expect(LOG.info).toHaveBeenCalled();
    expect(result).toEqual({ status: false });
  });

  test('searchDemoBoxDetails success', async () => {
    const mockData = { some: 'data' };
    (api.get as jest.Mock).mockResolvedValue(mockData);
    const action = searchDemoBoxDetails({ searchText: 'search' }, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(api.get).toHaveBeenCalledWith('testQuery', expect.objectContaining({ search: 'search' }));
    expect(commonActions.setTableColumnData).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ data: mockData, status: true });
  });

  test('searchDemoBoxDetails with subscriberDetailsSearch', async () => {
    (api.get as jest.Mock).mockResolvedValue({});
    const action = searchDemoBoxDetails({ subscriberDetailsSearch: 'search2' }, 'testQuery');
    await action(dispatch, getState, undefined);

    expect(api.get).toHaveBeenCalledWith('testQuery', expect.objectContaining({ search: 'search2' }));
  });

  test('searchDemoBoxDetails no dealerId', () => {
    getState.mockReturnValue({ common: { dealerDetails: {} }, form: { formState: { formNavigationData: { params: {} } } } });
    const action = searchDemoBoxDetails({}, 'testQuery');
    const result = action(dispatch, getState, undefined);
    expect(result).toEqual({ status: false });
  });

  test('searchDemoBoxDetails failure', async () => {
    const error = { message: 'error' };
    (api.get as jest.Mock).mockRejectedValue(error);
    const action = searchDemoBoxDetails({}, 'testQuery');
    const result = await action(dispatch, getState, undefined);

    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false });
  });

  test('changeDealer success', async () => {
    const action = changeDealer({});
    const result = await action(dispatch, getState, undefined);
    expect(result).toEqual({ status: true });
    expect(uiActions.clearLoader).toHaveBeenCalled();
  });

  test('changeDealer failure', async () => {
    (uiActions.showBottomModal as jest.Mock).mockImplementationOnce(() => {
      throw new Error('error');
    });
    const action = changeDealer({});
    const result = await action(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('error');
    expect(result).toEqual({ status: false });
  });
});
