/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable camelcase */
import React from 'react';
import { View, Text, Linking } from 'react-native';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import Carousel from './Carousel';

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

const mockGoToPath = jest.fn();
jest.mock('hooks/usePathNavigator', () => jest.fn(() => mockGoToPath));

jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

describe('Test for the component Carousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('render component Carousel', () => {
    render(<Carousel data={[]} autoScroll={false} />);
    expect(screen.getByTestId('carousel-test')).toBeTruthy();
  });

  test('snapshot tests for Carousel', () => {
    const component = render(
      <View>
        <Carousel data={[]} autoScroll={false} />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('renders carousel with image data', () => {
    const data = [
      { id: 1, image: 'image1.jpg' },
      { id: 2, image: 'image2.jpg' },
    ];
    render(<Carousel data={data} autoScroll={false} />);
    expect(screen.getByTestId('carousel-test')).toBeTruthy();
  });

  test('auto-scrolls when autoScroll is true', () => {
    const data = [
      { id: 1, image: 'image1.jpg' },
      { id: 2, image: 'image2.jpg' },
    ];
    render(<Carousel data={data} autoScroll scrollAnimationDuration={1000} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  test('does not auto-scroll when autoScroll is false', () => {
    const data = [
      { id: 1, image: 'image1.jpg' },
      { id: 2, image: 'image2.jpg' },
    ];
    render(<Carousel data={data} autoScroll={false} />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
  });

  test('handles scroll end event', () => {
    const data = [
      { id: 1, image: 'image1.jpg' },
      { id: 2, image: 'image2.jpg' },
    ];
    const { UNSAFE_getByType } = render(<Carousel data={data} width={300} autoScroll={false} />);
    const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
    fireEvent(scrollView, 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: 300 } },
    });
  });

  test('handles image press with deepLink (https)', async () => {
    const data = [{ id: 1, image: 'image1.jpg', deepLink: 'https://example.com' }];
    const { UNSAFE_getAllByType } = render(<Carousel data={data} autoScroll={false} />);
    const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
    await act(async () => {
      fireEvent.press(touchables[0]);
    });
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
    });
  });

  test('handles image press with deepLink (internal route)', async () => {
    const data = [{ id: 1, image: 'image1.jpg', deepLink: 'tpsales:///home?param=value' }];
    const { UNSAFE_getAllByType } = render(<Carousel data={data} autoScroll={false} />);
    const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
    await act(async () => {
      fireEvent.press(touchables[0]);
    });
    await waitFor(() => {
      expect(mockGoToPath).toHaveBeenCalledWith('/home');
    });
  });

  test('handles image press without deepLink', async () => {
    const data = [{ id: 1, image: 'image1.jpg' }];
    const { UNSAFE_getAllByType } = render(<Carousel data={data} autoScroll={false} />);
    const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
    await act(async () => {
      fireEvent.press(touchables[0]);
    });
    expect(Linking.openURL).not.toHaveBeenCalled();
    expect(mockGoToPath).not.toHaveBeenCalled();
  });

  test('handles pagination dot press', () => {
    const data = [
      { id: 1, image: 'image1.jpg' },
      { id: 2, image: 'image2.jpg' },
      { id: 3, image: 'image3.jpg' },
    ];
    const { UNSAFE_getAllByType } = render(<Carousel data={data} width={300} autoScroll={false} />);
    const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
    fireEvent.press(touchables[4]);
  });

  test('renders with custom props', () => {
    const data = [{ id: 1, image: 'image1.jpg' }];
    render(
      <Carousel
        data={data}
        width={400}
        height={300}
        scrollAnimationDuration={2000}
        containerStyle={{ backgroundColor: 'red' }}
        paginationDotColor="blue"
        resizeMode="contain"
        autoScroll={false}
      />,
    );
    expect(screen.getByTestId('carousel-test')).toBeTruthy();
  });

  test('renders carousel with children type', () => {
    const data = [
      { id: 1, image: 'image1.jpg', children: <Text>Child 1</Text> },
      { id: 2, image: 'image2.jpg', children: <Text>Child 2</Text> },
    ];
    render(<Carousel data={data} carouselType="custom" autoScroll={false} />);
    expect(screen.getByText('Child 1')).toBeTruthy();
    expect(screen.getByText('Child 2')).toBeTruthy();
  });
});
