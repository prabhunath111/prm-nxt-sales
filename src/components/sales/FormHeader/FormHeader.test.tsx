import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { FORMS } from 'const/strings';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import FormHeader from './FormHeader';

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

describe('Test for the component FormHeader', () => {
  test('render component FormHeader', () => {
    render(<FormHeader formName={FORMS.customerRecharge as FormNameKeys} />);
    expect(screen.getByTestId('header-test')).toBeTruthy();
  });

  test('snapshot tests for FormHeader', () => {
    const component = render(
      <View>
        <FormHeader formName={FORMS.customerRecharge as FormNameKeys} />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
