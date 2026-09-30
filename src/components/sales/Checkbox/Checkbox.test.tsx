/* eslint-disable camelcase */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */
import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Checkbox from './Checkbox';

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

const mockUseTranslation = { i18n: { language: 'en' } };
jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation,
}));

jest.mock('hooks/useCurrentRoute', () => jest.fn(() => ({ routeName: '' })));

describe('Test for the component Checkbox', () => {
  test('render component Checkbox', () => {
    render(<Checkbox label="checkbox" />);
    expect(screen.getByText('checkbox')).toBeTruthy();
  });

  test('snapshot tests for Checkbox', () => {
    const component = render(
      <View>
        <Checkbox label="checkbox" />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('handles checkbox press and calls onValueChange', () => {
    const onValueChange = jest.fn();
    const { UNSAFE_getAllByType } = render(<Checkbox label="checkbox" onValueChange={onValueChange} />);
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    fireEvent.press(pressables[0]);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  test('renders with error message', () => {
    render(<Checkbox label="checkbox" error="Error message" id="test" />);
    expect(screen.getByText('Error message')).toBeTruthy();
  });

  test('renders with subLabel', () => {
    render(<Checkbox label="checkbox" subLabel="Sub label text" />);
    expect(screen.getByText('Sub label text')).toBeTruthy();
  });

  test('renders with subLabel in non-EN language', () => {
    mockUseTranslation.i18n.language = 'es';
    render(<Checkbox label="checkbox" subLabel="Sub label text" />);
    expect(screen.getByText('Sub label text')).toBeTruthy();
    mockUseTranslation.i18n.language = 'en';
  });

  test('renders with required and hideRequired props', () => {
    render(<Checkbox label="checkbox" required hideRequired />);
    expect(screen.getByText('checkbox')).toBeTruthy();
  });
});
