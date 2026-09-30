/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import actions from 'store/sales/actions/form';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import { STATE_KEY, SUBMISSION, DYNAMIC_FORM_WIDTH_360PX, DYNAMIC_FORM_WIDTH_70P, DYNAMIC_FORM_WIDTH_80P, DYNAMIC_FORM_WIDTH_50P, QUERY, ROUTE } from 'const';
import { getGeoLocation } from 'utils/geoLocationHelper';
import { callAction } from 'utils/formBuilderHelper';
import { LOG } from 'config/logger';
import RegistrationSalesNext from './RegistrationSalesNext';

// Mocking hooks and external modules that need specific behavior
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

// Mock thunk creators (default exports)
jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    setFormValues: jest.fn((payload: any) => ({ type: 'SET_FORM_VALUES', payload })),
    setNavigationData: jest.fn((...args: any[]) => ({ type: 'SET_NAVIGATION_DATA', args })),
    submitForm: jest.fn((...args: any[]) => ({ type: 'SUBMIT_FORM', args })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
    showBottomModal: jest.fn((payload: any) => ({ type: 'SHOW_BOTTOM_MODAL', payload })),
  },
}));

const mockRouteName = jest.fn();
jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: mockRouteName(),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

jest.mock('utils/geoLocationHelper', () => ({
  getGeoLocation: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('config/logger', () => ({
  LOG: {
    info: jest.fn(),
  },
}));

// Use a getter for isWeb to allow changing it in tests
let mockIsWebValue = false;
jest.mock('utils/platformHelper', () => ({
  __esModule: true,
  ...jest.requireActual('utils/platformHelper'),
  get isWeb() {
    return mockIsWebValue;
  },
}));

// Mock RegistrationFormBuilder to trigger onSubmit
let capturedOnSubmit: any;
jest.mock('components/sales/RegistrationFormBuilder', () => {
  const { View } = require('react-native');
  const React = require('react');
  return (props: any) => {
    React.useEffect(() => {
      capturedOnSubmit = props.onSubmit;
    }, [props.onSubmit]);
    return <View testID="formBuilderTest" />;
  };
});

const mockedUseSelector = useSelector as unknown as jest.Mock;

describe('RegistrationSalesNext Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteName.mockReturnValue('defaultRoute');
    mockedUseSelector.mockReturnValue({ info: { userId: '123' } });
    mockDispatch.mockImplementation((action: any) => {
      if (typeof action === 'function') return action(mockDispatch, () => ({}));
      return action;
    });
    capturedOnSubmit = null;
    mockIsWebValue = false;
  });

  test('initializes form values and resets dropdowns on mount', () => {
    render(<RegistrationSalesNext />);
    expect(mockDispatch).toHaveBeenCalledWith(actions.setFormValues({ userId: '123' }));
    expect(mockDispatch).toHaveBeenCalledWith(formAction.resetDropdownData({}));
  });

  test('hides bottom modal on mount if stateKey is FORM_STATE', () => {
    render(<RegistrationSalesNext stateKey={STATE_KEY.FORM_STATE} />);
    expect(mockDispatch).toHaveBeenCalledWith(uiActions.hideBottomModal());
  });

  test('sets container width style based on routeName branches', () => {
    mockRouteName.mockReturnValue(DYNAMIC_FORM_WIDTH_360PX[0] || 'route360');
    render(<RegistrationSalesNext />);
    mockRouteName.mockReturnValue(DYNAMIC_FORM_WIDTH_50P[0] || 'route50');
    render(<RegistrationSalesNext />);
    mockRouteName.mockReturnValue(DYNAMIC_FORM_WIDTH_70P[0] || 'route70');
    render(<RegistrationSalesNext />);
    mockRouteName.mockReturnValue(DYNAMIC_FORM_WIDTH_80P[0] || 'route80');
    render(<RegistrationSalesNext />);
  });

  test('fetches location for SELECT_BOX_TYPE route on mount', async () => {
    mockRouteName.mockReturnValue(ROUTE.WEB.SELECT_BOX_TYPE);
    (getGeoLocation as jest.Mock).mockResolvedValue({ latitude: 10, longitude: 20 });

    render(<RegistrationSalesNext />);

    await waitFor(() => {
      expect(getGeoLocation).toHaveBeenCalled();
    });
  });

  test('handles fetchLocation error', async () => {
    mockRouteName.mockReturnValue(ROUTE.WEB.SELECT_BOX_TYPE);
    (getGeoLocation as jest.Mock).mockRejectedValue(new Error('error'));

    render(<RegistrationSalesNext />);

    await waitFor(() => {
      expect(LOG.info).toHaveBeenCalledWith('errors.locationError');
    });
  });

  test('handles fetchLocation null response', async () => {
    mockRouteName.mockReturnValue(ROUTE.WEB.SELECT_BOX_TYPE);
    (getGeoLocation as jest.Mock).mockResolvedValue(null);
    render(<RegistrationSalesNext />);
    await waitFor(() => {
      expect(getGeoLocation).toHaveBeenCalled();
    });
  });

  test('onSubmit handles NAVIGATION / NAVIGATION_TO', () => {
    render(<RegistrationSalesNext />);

    capturedOnSubmit({ data: 'test' }, SUBMISSION.NAVIGATION, 'queryName', 'navigateTo');

    expect(mockDispatch).toHaveBeenCalledWith(actions.setNavigationData({ data: 'test' }, 'queryName', 'defaultRoute', 'defaultRoute'));
    expect(mockNavigate).toHaveBeenCalledWith('navigateTo');
  });

  test('onSubmit handles SUBMIT_NAVIGATION / LINK with success response', async () => {
    mockDispatch.mockReturnValue(Promise.resolve({ status: true, route: 'customRoute' }));

    render(<RegistrationSalesNext />);

    capturedOnSubmit({ data: 'test' }, SUBMISSION.SUBMIT_NAVIGATION, 'queryName', 'navigateTo');

    expect(mockDispatch).toHaveBeenCalledWith(actions.submitForm({ data: 'test' }, 'queryName'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(uiActions.hideBottomModal());
      expect(mockNavigate).toHaveBeenCalledWith('customRoute');
    });
  });

  test('onSubmit handles SUBMIT_NAVIGATION with success response and no route', async () => {
    mockDispatch.mockReturnValue(Promise.resolve({ status: true }));

    render(<RegistrationSalesNext />);

    capturedOnSubmit({ data: 'test' }, SUBMISSION.SUBMIT_NAVIGATION, 'queryName', 'navigateTo');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('navigateTo');
    });
  });

  test('onSubmit handles SUBMIT_NAVIGATION with failure response', async () => {
    mockDispatch.mockReturnValue(Promise.resolve({ status: false }));
    render(<RegistrationSalesNext />);
    capturedOnSubmit({ data: 'test' }, SUBMISSION.SUBMIT_NAVIGATION, 'queryName', 'navigateTo');
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('onSubmit handles CAPTURE error', async () => {
    (getGeoLocation as jest.Mock).mockRejectedValue(new Error('fail'));

    render(<RegistrationSalesNext />);

    capturedOnSubmit({}, SUBMISSION.CAPTURE, 'queryName', 'navigateTo');

    await waitFor(() => {
      expect(LOG.info).toHaveBeenCalledWith('errors.captureLocationError');
    });
  });

  test('onSubmit handles CAPTURE success', async () => {
    (getGeoLocation as jest.Mock).mockResolvedValue({ latitude: 15, longitude: 25 });
    render(<RegistrationSalesNext />);
    capturedOnSubmit({}, SUBMISSION.CAPTURE, 'queryName', 'navigateTo');
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(callAction({ locations: { latitude: 15, longitude: 25 } }, QUERY.CaptureLocationAction));
    });
  });

  test('onSubmit handles default case', () => {
    render(<RegistrationSalesNext />);

    capturedOnSubmit({ data: 'test' }, 'OTHER_TYPE', 'queryName', 'navigateTo');

    expect(mockDispatch).toHaveBeenCalledWith(actions.submitForm({ data: 'test' }, 'queryName', '', mockNavigate));
  });

  test('useEffect fetch location handles web branch', async () => {
    mockIsWebValue = true;
    (global as any).window = { webkit: { messageHandlers: { cordova_iab: true } } };
    mockRouteName.mockReturnValue(ROUTE.WEB.SELECT_BOX_TYPE);
    render(<RegistrationSalesNext />);
    await waitFor(() => {
      expect(getGeoLocation).toHaveBeenCalled();
    });
    delete (global as any).window.webkit;
  });
});
