/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import BoxSelection from './BoxSelection';

// Manual store mock
const createMockStore = (initialState: any) => ({
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => initialState),
  replaceReducer: jest.fn(),
  [Symbol.observable]: jest.fn(),
});

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xl',
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

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => React.createElement(React.Fragment, {}, children),
    SafeAreaView: ({ children }: any) => React.createElement(View, { testID: 'BoxSelection' }, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    GestureHandlerRootView: ({ children }: any) => React.createElement(React.Fragment, {}, children),
  };
});

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

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
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

jest.mock('components/sales', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    RadioContainer: () => null,
    Button: () => null,
    InformationText: () => null,
    Accordion: ({ children }: any) => React.createElement(View, {}, children),
    TextContainer: () => null,
    Tabs: () => null,
    CustomerDetailsCard: () => null,
    Text: ({ children }: any) => React.createElement(View, {}, children),
  };
});

jest.mock('components/sales/Autocomplete', () => () => null);

describe('Test for the component BoxSelection', () => {
  const initialState = {
    boxUpgrade: {
      accountInfoBoxData: {
        customerName: 'Test Customer',
        maskedRMN: '******1234',
        state: 'Test State',
        customerStatus: 'Active',
      },
      upgradedType: 'HD',
      rechargeAmount: '100',
      boxType: 'Box',
      bingeOffer: [],
      eligibles: [{ AMOUNTNT: '100', NEW_BOX: 'HD', NEW_BOXNT: 'HD' }],
    },
    ui: {
      isLoading: false,
    },
  };

  test('render component BoxSelection', () => {
    const store = createMockStore(initialState);
    render(
      <Provider store={store as any}>
        <NavigationContainer>
          <BoxSelection />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('BoxSelection')).toBeTruthy();
  });

  test('snapshot tests for BoxSelection', () => {
    const store = createMockStore(initialState);
    const component = render(
      <Provider store={store as any}>
        <NavigationContainer>
          <BoxSelection />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
