import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/packageInformation';
import uiActions from 'store/sales/actions/ui';
import { getPackageInformation } from './packageInformation.action';

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('store/sales/reducer/packageInformation', () => ({
  sliceActions: {
    packageInformationSuccess: jest.fn(),
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

describe('packageInformation actions', () => {
  let dispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
  });

  test('getPackageInformation success', async () => {
    const mockData = { packages: [] };
    (api.get as jest.Mock).mockResolvedValue(mockData);

    const action = getPackageInformation();
    await action(dispatch, jest.fn(), undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(sliceActions.packageInformationSuccess).toHaveBeenCalledWith(mockData);
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });
});
