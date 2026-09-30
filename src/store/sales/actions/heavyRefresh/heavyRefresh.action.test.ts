import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { doHeavyRefresh } from './heavyRefresh.action';

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showAlert: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setSubIdList: jest.fn(),
  setSubIdListDefault: jest.fn(),
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
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('store/sales/query/heavyRefresh', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

describe('heavyRefresh actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => ({}));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('doHeavyRefresh success with subIdList', async () => {
    const mockData = { accountInfo: { subIdList: ['123'] }, message: 'Success' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    await doHeavyRefresh({ subscriberInfo: 'sid' }, 'query1')(dispatch, getState, undefined);
    expect(uiActions.setLoader).toHaveBeenCalled();
    expect(formActions.setSubIdList).toHaveBeenCalled();
  });

  test('doHeavyRefresh success without subIdList', async () => {
    const mockData = { subscriberId: 'sid123', message: 'Success Single' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    await doHeavyRefresh({ subscriberInfo: 'sid' }, 'query1')(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('doHeavyRefresh failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await doHeavyRefresh({ subscriberInfo: 'sid' }, 'query1')(dispatch, getState, undefined);
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });
});
