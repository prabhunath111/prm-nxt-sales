import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import { ICONS, STYLES } from 'const';
import { Outlines } from 'styles';
import Button from './Button';

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

describe('Test for the component Button', () => {
  test('render component Button', () => {
    render(
      <Button
        label="Custom Button"
        iconPosition=""
        isOnlyIcon
        borderRadius={Outlines.borderRadius.small}
        type={STYLES.TYPE.SECONDARY}
        iconName={ICONS.SETTINGS}
        size={STYLES.SIZE.MD}
        disabled={false}
        loading={false}
        onPress={() => {}}
      />,
    );
    expect(screen.getByTestId('button-test')).toBeTruthy();
  });

  test('snapshot tests for Button', () => {
    const component = render(
      <View>
        <Button
          label="Custom Button"
          isOnlyIcon
          borderRadius={Outlines.borderRadius.small}
          type={STYLES.TYPE.SECONDARY}
          iconName={ICONS.SETTINGS}
          size={STYLES.SIZE.MD}
          disabled={false}
          loading={false}
          onPress={() => {}}
        />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
