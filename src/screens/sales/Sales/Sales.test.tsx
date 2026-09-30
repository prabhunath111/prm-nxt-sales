/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FORMS, STATE_KEY } from 'const';
import actions from 'store/sales/actions/form';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import Sales from './Sales';

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('react-native-device-info', () => ({
  getModel: jest.fn(() => 'mock-model'),
  getFreeDiskStorageSync: jest.fn(() => 1024),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
  getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  getSystemVersion: jest.fn(() => 'mock-system-version'),
  getVersion: jest.fn(() => 'mock-app-version'),
  isEmulatorSync: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraPermission: jest.fn(() => [true, null]),
  useCameraDevice: jest.fn(() => null),
  useCodeScanner: jest.fn(() => ({ scan: jest.fn() })),
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

const mockRoute = { routeName: 'raiseRequest' };
jest.mock('hooks/useCurrentRoute', () => () => mockRoute);

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('store/sales/actions/form', () => ({
  setFormDependentDefault: jest.fn(() => ({ type: 'SET_FORM_DEPENDENT' })),
  setNavigationData: jest.fn(() => ({ type: 'SET_NAV_DATA' })),
  submitForm: jest.fn(() => () => Promise.resolve({ status: true })),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Button } = require('react-native');
  return {
    Card: ({ children }: any) => React.createElement(View, null, children),
    FormHeader: () => React.createElement(View, { testID: 'form-header' }),
    FormWrapper: ({ onSubmit }: any) =>
      React.createElement(
        View,
        { testID: 'mock-form-wrapper' },
        React.createElement(Button, {
          title: 'Nav',
          onPress: () => onSubmit({ val: 1 }, 'navigation', 'query', 'target'),
          testID: 'btn-nav',
        }),
        React.createElement(Button, {
          title: 'SubmitNav',
          onPress: () => onSubmit({ val: 1 }, 'navigationWithSubmit', 'query', 'target'),
          testID: 'btn-sub-nav',
        }),
        React.createElement(Button, {
          title: 'Link',
          onPress: () => onSubmit({ val: 1 }, 'link', 'query', 'target'),
          testID: 'btn-link',
        }),
        React.createElement(Button, {
          title: 'Default',
          onPress: () => onSubmit({ val: 1 }, 'DEFAULT', 'query', ''),
          testID: 'btn-default',
        }),
      ),
  };
});

// Mock usePlatformFocusEffect to run the callback immediately
jest.mock('hooks/usePlatformFocusEffect', () => ({
  usePlatformFocusEffect: (callback: any) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, []);
  },
}));

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      user: () => state.user,
      form: () => state.form,
      redirection: () => ({ data: {} }),
      ui: () => ({ isLoading: false }),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('Sales Component', () => {
  const initialState = {
    user: { info: { name: 'test' }, isRedirection: false },
    form: {
      [STATE_KEY.FORM_STATE]: { formDependentDefault: {}, formData: {}, subIdList: [] },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders and tracks page visit', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <Sales />
      </Provider>,
    );

    expect(screen.getByTestId('sales')).toBeTruthy();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('dispatches setFormDependentDefault for changeEVDPin', () => {
    mockRoute.routeName = FORMS.changeEVDPin;
    render(
      <Provider store={createMockStore(initialState)}>
        <Sales />
      </Provider>,
    );

    expect(actions.setFormDependentDefault).toHaveBeenCalledWith(initialState.user.info);
  });

  test('handles onSubmit for NAVIGATION', async () => {
    mockRoute.routeName = 'raiseRequest';
    render(
      <Provider store={createMockStore(initialState)}>
        <Sales />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-nav'));
    expect(actions.setNavigationData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('target');
  });

  test('handles onSubmit for SUBMIT_NAVIGATION success', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <Sales />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-sub-nav'));
    expect(actions.submitForm).toHaveBeenCalled();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('target'));
  });

  test('handles onSubmit for SUBMIT_NAVIGATION failure', async () => {
    (actions.submitForm as jest.Mock).mockReturnValueOnce(() => Promise.resolve({ status: false }));
    render(
      <Provider store={createMockStore(initialState)}>
        <Sales />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-sub-nav'));
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });

  test('handles onSubmit for LINK', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <Sales />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-link'));
    expect(actions.submitForm).toHaveBeenCalled();
  });

  test('handles onSubmit for default path', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <Sales />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-default'));
    expect(actions.submitForm).toHaveBeenCalled();
  });
});
