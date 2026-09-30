/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/dealerFeedback';
import { api } from 'services/apolloClient';
import { filterByParams, normalizeArray } from 'utils/formBuilderHelper';
import { filterLastNDays } from 'utils/tableHelper';
import { PROPERTIES, STRINGS } from 'const';
import {
  dealerFeedbackFilter,
  dealerFeedbackList,
  searchTrackDealerFeedback,
  raiseFeedback,
  setValidateSubscriber,
  validateSubscriberId,
  submitFeedback,
  showRelevantField,
} from './dealerFeedback.action';

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
  showAlert: jest.fn(),
}));

jest.mock('store/sales/actions/common', () => ({
  setTableColumnData: jest.fn(),
  setErrorMessage: jest.fn(),
  setTableFilteredData: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setMultipleDropdownOptionsData: jest.fn(),
  setFormValues: jest.fn(),
  setFieldsToShow: jest.fn(),
}));

jest.mock('store/sales/reducer/dealerFeedback', () => ({
  sliceActions: {
    setValidateSubscriber: jest.fn(),
    setRadioFeedbackSelected: jest.fn(),
    setDealerSuccess: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('utils/formBuilderHelper', () => ({
  filterByParams: jest.fn((data) => data),
  normalizeArray: jest.fn((val) => val || []),
}));

jest.mock('utils/tableHelper', () => ({
  filterLastNDays: jest.fn((data) => data),
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

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('store/sales/query', () => ({
  SAMPLE_QUERY: 'SAMPLE_QUERY',
  submitFeedback: 'submitFeedback',
}));

describe('dealerFeedback actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      common: {
        tableData: [{ status: 'open', date: '2023-01-01' }],
      },
      dealerFeedback: {
        isSubscriberValid: true,
        radioFeedbackSelected: 'raiseFeedbackList.Other issue',
      },
    }));
  });

  test('dealerFeedbackFilter success', async () => {
    const mockData = { options: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = dealerFeedbackFilter({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.setLoader());
    expect(dispatch).toHaveBeenCalledWith(formActions.setMultipleDropdownOptionsData(mockData));
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });

  test('dealerFeedbackFilter failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = dealerFeedbackFilter({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(dispatch).toHaveBeenCalledWith(uiActions.clearLoader());
  });

  test('dealerFeedbackList success with result', async () => {
    const mockData = { dealerFeedbackList: [{}], tableColumns: [] };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = dealerFeedbackList({}, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(commonActions.setTableColumnData({ tableColumns: [], result: [] }));
    expect(dispatch).toHaveBeenCalledWith(commonActions.setTableColumnData({ tableColumns: mockData.tableColumns, result: mockData.dealerFeedbackList }));
    expect(result).toEqual({ data: mockData, status: true });
  });

  test('dealerFeedbackList success without result', async () => {
    const mockData = { dealerFeedbackList: [], message: 'no data' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = dealerFeedbackList({}, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(commonActions.setErrorMessage(mockData.message));
    expect(result).toEqual({ data: mockData, status: false });
  });

  test('dealerFeedbackList failure', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = dealerFeedbackList({}, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
    expect(result).toEqual({ status: false });
  });

  describe('searchTrackDealerFeedback', () => {
    test('filters by status', () => {
      const params = { statusFilter: ['open'] };
      (normalizeArray as jest.Mock).mockReturnValue(['open']);
      const action = searchTrackDealerFeedback(params);
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalled();
    });

    test('filters by day', () => {
      const params = { day: 7 };
      const action = searchTrackDealerFeedback(params);
      action(dispatch, getState, undefined);
      expect(filterLastNDays).toHaveBeenCalled();
    });

    test('filters by custom date range', () => {
      const params = { day: STRINGS.CUSTOM_DATE_RANGE, requestedDate: '2023-01-01' };
      const action = searchTrackDealerFeedback(params);
      action(dispatch, getState, undefined);
      expect(filterLastNDays).toHaveBeenCalled();
    });

    test('filters by search text', () => {
      const params = { searchText: 'test' };
      const action = searchTrackDealerFeedback(params);
      action(dispatch, getState, undefined);
      expect(filterByParams).toHaveBeenCalled();
    });

    test('no filters applied', () => {
      const params = {};
      (normalizeArray as jest.Mock).mockReturnValue([]);
      const action = searchTrackDealerFeedback(params);
      action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(commonActions.setTableFilteredData({ result: expect.any(Array) }));
    });
  });

  test('raiseFeedback', async () => {
    jest.useFakeTimers();
    const params = { dealerFeedbackList: 'test' };
    const action = raiseFeedback(params);
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(sliceActions.setValidateSubscriber({ isSubscriberValid: false, message: '' }));
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setRadioFeedbackSelected('test'));

    jest.runAllTimers();
    expect(dispatch).toHaveBeenCalledWith(formActions.setFormValues({ dealerFeedback: 'test' }));
    expect(result).toEqual({ data: params, status: true });
    jest.useRealTimers();
  });

  test('raiseFeedback on web', async () => {
    const { Platform } = require('react-native');
    const originalOS = Platform.OS;
    Platform.OS = 'web';
    const params = { dealerFeedbackList: 'test' };
    const action = raiseFeedback(params);
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(formActions.setFormValues({ dealerFeedback: 'test' }));
    expect(result).toEqual({ data: params, status: true });
    Platform.OS = originalOS; // Reset
  });

  test('setValidateSubscriber', async () => {
    const params = { isSubscriberValid: true };
    const action = setValidateSubscriber(params);
    await action(dispatch, getState, undefined);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setValidateSubscriber(params));
  });

  test('validateSubscriberId success', async () => {
    const mockData = { status: PROPERTIES.DEALER_FEEDBACK.success, message: 'valid' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = validateSubscriberId({}, 'SAMPLE_QUERY');
    const result = await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(sliceActions.setValidateSubscriber({ isSubscriberValid: true, message: 'valid' }));
    expect(dispatch).toHaveBeenCalledWith(uiActions.showAlert(expect.any(String), expect.any(String), expect.any(Object), expect.any(Object)));
    expect(result).toEqual(mockData);
  });

  test('validateSubscriberId failure response', async () => {
    const mockData = { status: 'failed', message: 'invalid' };
    (api.post as jest.Mock).mockResolvedValue(mockData);
    const action = validateSubscriberId({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(sliceActions.setValidateSubscriber({ isSubscriberValid: false, message: 'invalid' }));
    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage('invalid'));
  });

  test('validateSubscriberId error', async () => {
    const error = { message: 'error' };
    (api.post as jest.Mock).mockRejectedValue(error);
    const action = validateSubscriberId({}, 'SAMPLE_QUERY');
    await action(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(uiActions.showErrorPage(error.message));
  });

  describe('submitFeedback', () => {
    test('fails if month not selected when required', async () => {
      const params = { dealerFeedback: PROPERTIES.DEALER_FEEDBACK.CMSSchemeAmountNotReceived };
      const action = submitFeedback(params);
      const result = await action(dispatch, getState, undefined);
      expect(uiActions.showAlert).toHaveBeenCalledWith(PROPERTIES.DEALER_FEEDBACK.pleaseSelectMonth, expect.any(String), expect.any(Object), expect.any(Object));
      expect(result).toEqual({ status: false });
    });

    test('fails if subscriber not valid when required', async () => {
      getState.mockReturnValue({
        dealerFeedback: { isSubscriberValid: false },
      });
      const params = { dealerFeedback: PROPERTIES.DEALER_FEEDBACK.installationNotHappeningOnTime };
      const action = submitFeedback(params);
      const result = await action(dispatch, getState, undefined);
      expect(uiActions.showAlert).toHaveBeenCalledWith(PROPERTIES.DEALER_FEEDBACK.pleaseValidateSubscriberId, expect.any(String), expect.any(Object), expect.any(Object));
      expect(result).toEqual({ status: false });
    });

    test('submits successfully', async () => {
      const params = { dealerFeedback: 'Other issue', description: 'test' };
      const mockData = { id: 1 };
      (api.post as jest.Mock).mockResolvedValue(mockData);
      const action = submitFeedback(params);
      const result = await action(dispatch, getState, undefined);

      expect(sliceActions.setDealerSuccess).toHaveBeenCalledWith(mockData);
      expect(result).toEqual({ status: true });
    });

    test('handles api error', async () => {
      const params = { dealerFeedback: 'Other issue' };
      const error = { message: 'error' };
      (api.post as jest.Mock).mockRejectedValue(error);
      const action = submitFeedback(params);
      const result = await action(dispatch, getState, undefined);

      expect(uiActions.showErrorPage).toHaveBeenCalledWith(error.message);
      expect(result).toEqual({ status: false, error });
    });

    test('appends months correctly', async () => {
      const params = {
        dealerFeedback: 'Other issue',
        January: true,
        February: true,
      };
      (api.post as jest.Mock).mockResolvedValue({});
      const action = submitFeedback(params);
      await action(dispatch, getState, undefined);

      expect(api.post).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          input: expect.objectContaining({
            feedbackSubCategory: 'January, February',
          }),
        }),
      );
    });
  });

  test('showRelevantField', () => {
    jest.useFakeTimers();
    const action = showRelevantField();
    action(dispatch, getState, undefined);

    jest.runAllTimers();
    expect(dispatch).toHaveBeenCalledWith(formActions.setFieldsToShow(['description']));
    jest.useRealTimers();
  });

  test('showRelevantField with fields', () => {
    getState.mockReturnValue({
      dealerFeedback: {
        radioFeedbackSelected: 'raiseFeedbackList.Installation not happening on time',
      },
    });
    jest.useFakeTimers();
    const action = showRelevantField();
    action(dispatch, getState, undefined);

    jest.runAllTimers();
    expect(dispatch).toHaveBeenCalledWith(formActions.setFieldsToShow(['validate', 'subscriberId']));
    jest.useRealTimers();
  });

  test('showRelevantField with no mapping', () => {
    getState.mockReturnValue({
      dealerFeedback: {
        radioFeedbackSelected: 'Unknown Category',
      },
    });
    jest.useFakeTimers();
    const action = showRelevantField();
    action(dispatch, getState, undefined);

    jest.runAllTimers();
    expect(formActions.setFieldsToShow).not.toHaveBeenCalledWith(undefined);
    jest.useRealTimers();
  });
});
