/* eslint-disable import/no-extraneous-dependencies */
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import AppLoader from './AppLoader';

// Mock Redux state
const mockInitialState = {
  ui: {
    isLoading: true,
    loaderInfo: { message: 'Loading..' },
  },
};

// Create a mock reducer
const mockReducer = (state = mockInitialState, action = { type: '' }) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Create a mock store
const store = createStore(mockReducer);

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

describe('Test for the component AppLoader', () => {
  test('renders component AppLoader', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <AppLoader />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByTestId('loader-test')).toBeTruthy();
    expect(screen.getByText('Loading..')).toBeTruthy(); // Check if the message is displayed
  });

  test('snapshot tests for AppLoader', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <AppLoader />
        </NavigationContainer>
      </Provider>,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
