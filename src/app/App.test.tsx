/* eslint-disable global-require */
import 'react-native';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

jest.mock('react-native-device-info', () => ({
  isTablet: jest.fn(() => false),
  isLandscapeSync: jest.fn(() => false),
  getVersion: jest.fn(() => '1.0.0'),
  getSystemVersion: jest.fn(() => '16.0'),
  getModel: jest.fn(() => 'mock-model'),
  getFreeDiskStorageSync: jest.fn(() => 1024),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
  getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  isEmulatorSync: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
  getDeviceName: jest.fn(() => 'mocked-device-name'),
  getBrand: jest.fn(() => 'mocked-brand'),
  isDevelopmentSettingsMode: jest.fn(() => Promise.resolve(false)),
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

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('jail-monkey', () => ({
  isJailBroken: jest.fn(() => false),
  canMockLocation: jest.fn(() => false),
  hookDetected: jest.fn(() => false),
  isDevelopmentSettingsMode: jest.fn(() => Promise.resolve(false)),
}));

jest.mock('wrappers/container/ProviderContainer', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

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

jest.mock('navigation/routes', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('wrappers/network/NetworkStatus', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: any) => children,
}));

jest.mock('components/sales', () => {
  const React = require('react'); // eslint-disable-line @typescript-eslint/no-var-requires
  const { View } = require('react-native'); // eslint-disable-line @typescript-eslint/no-var-requires
  return {
    MoengageNotifications: () => null,
    Alert: () => null,
    AppLoader: () => React.createElement(View, { testID: 'loader-test' }),
    BottomModal: () => null,
    Text: ({ children, label }: any) => React.createElement(View, {}, label || children),
    Image: () => null,
    AppSuspense: ({ children }: any) => children,
  };
});

const mockStore = configureStore({
  reducer: {
    ui: () => ({ isLoading: false, loaderInfo: { message: null } }),
    user: () => ({ isRedirection: false, info: {} }),
  },
});

describe('Test for the component App', () => {
  test('render component App', () => {
    render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(screen.getByTestId('loader-test')).toBeTruthy();
  });

  test('snapshot tests for App', () => {
    const component = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
