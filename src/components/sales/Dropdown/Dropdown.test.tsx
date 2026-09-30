/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';

import Dropdown from './Dropdown';

// Use global with fallbacks to avoid hoisting/initialization issues
(global as any).isWebMock = false;
(global as any).isDesktopMock = false;
(global as any).isiOSMock = jest.fn(() => false);
(global as any).isAndroidMock = jest.fn(() => true);
(global as any).isTabletMock = jest.fn(() => false);
(global as any).isIpadMock = jest.fn(() => false);
(global as any).isMobileDeviceMock = jest.fn(() => true);
(global as any).platformMockFn = jest.fn(() => ({ OS: 'android' }));

jest.mock('utils/platformHelper', () => ({
  get isWeb() {
    return (global as any).isWebMock ?? false;
  },
  get isDesktop() {
    return (global as any).isDesktopMock ?? false;
  },
  isiOS: () => (global as any).isiOSMock?.() ?? false,
  isAndroid: () => (global as any).isAndroidMock?.() ?? true,
  isTablet: () => (global as any).isTabletMock?.() ?? false,
  isIpad: () => (global as any).isIpadMock?.() ?? false,
  isMobileDevice: () => (global as any).isMobileDeviceMock?.() ?? true,
  platform: () => (global as any).platformMockFn?.() ?? { OS: 'ios' },
}));

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  isTablet: jest.fn(() => false),
  getModel: jest.fn(() => 'mock-model'),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
  getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  getSystemVersion: jest.fn(() => 'mock-system-version'),
  getVersion: jest.fn(() => 'mock-app-version'),
  isEmulatorSync: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'strings.SELECT') return 'Select';
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock List
jest.mock('components/sales/List', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  const ListMock = (props: any) => <FlatList {...props} testID="dropdown-option-list" />;
  return {
    __esModule: true,
    default: ListMock,
  };
});

// Mock Modal for Web
jest.mock('components/sales/Modal', () => {
  const React = require('react');
  const { View, Pressable } = require('react-native');
  const ModalMock = ({ children, isVisible, onClose }: any) =>
    isVisible ? (
      <View testID="dropdown-web-modal">
        <Pressable testID="modal-close-btn" onPress={onClose} />
        {children}
      </View>
    ) : null;
  (ModalMock as any).ModalPlacement = {
    BOTTOM: 'BOTTOM',
    TOP: 'TOP',
  };
  return {
    __esModule: true,
    default: ModalMock,
    ModalPlacement: {
      BOTTOM: 'BOTTOM',
      TOP: 'TOP',
    },
  };
});

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'XL',
  }),
  BreakPoints: {
    XL: 'XL',
    LG: 'LG',
    MD: 'MD',
    MD_L: 'MD_L',
    SM: 'SM',
    XS: 'XS',
  },
}));

// Mock Redux Action
jest.mock('store/sales/actions/form', () => ({
  fetchOptionData: jest.fn(() => ({ type: 'FETCH_MOCK' })),
}));

const mockStore = configureStore({
  reducer: {
    form: (state: any = { formState: { dropdownOptions: {} } }) => state,
  },
});

const dropdownData = [
  { name: 'One', value: '1', object: { value: '1' } },
  { name: 'Two', value: '2', object: { value: '2' } },
];

describe('Dropdown Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    // Default to Android Native
    (global as any).isWebMock = false;
    (global as any).isDesktopMock = false;
    (global as any).isAndroidMock.mockReturnValue(true);
    (global as any).isiOSMock.mockReturnValue(false);
    (global as any).platformMockFn.mockReturnValue({ OS: 'android' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderWithProps = (props: any = {}, storeState: any = null) => {
    const store = storeState ? configureStore({ reducer: { form: () => storeState } }) : mockStore;
    return render(
      <Provider store={store}>
        <NavigationContainer>
          <Dropdown data={dropdownData} isDisabled={false} {...props} />
        </NavigationContainer>
      </Provider>,
    );
  };

  test('renders in Native mode (Android)', () => {
    renderWithProps();
    expect(screen.getByTestId('dropdown-test-container')).toBeTruthy();
  });

  test('toggles visibility and selects item (Android)', () => {
    const onSelect = jest.fn();
    renderWithProps({ onSelect });
    const input = screen.getByPlaceholderText('Select');

    fireEvent.press(input);
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('dropdown-option-list')).toBeTruthy();

    const item = screen.getByText('One');
    fireEvent.press(item);
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(onSelect).toHaveBeenCalled();
  });

  test('Native formatting branches (Lines 180, 182, 184)', () => {
    renderWithProps({
      data: [{ name: 'SubItem', subName: 'Sub' }, { name: 'StaticItem' }, { name: 'NormalItem' }],
      hasStaticValues: true,
    });
    fireEvent.press(screen.getByPlaceholderText('Select'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText('SubItem - Sub')).toBeTruthy();
    expect(screen.getByText('strings.StaticItem')).toBeTruthy();
    expect(screen.getByText('strings.NormalItem')).toBeTruthy();
  });

  test('Data sync from Redux (Line 103)', () => {
    const storeState = { formState: { dropdownOptions: { Q: [{ name: 'ReduxItem' }] } } };
    renderWithProps({ queryName: 'Q' }, storeState);
    fireEvent.press(screen.getByPlaceholderText('Select'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText('ReduxItem')).toBeTruthy();
  });

  test('Data sync from Props with rerender (Line 105)', () => {
    const { rerender } = render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <Dropdown data={[]} isDisabled={false} />
        </NavigationContainer>
      </Provider>,
    );

    rerender(
      <Provider store={mockStore}>
        <NavigationContainer>
          <Dropdown data={[{ name: 'RerenderItem' }]} isDisabled={false} />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByPlaceholderText('Select'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText('RerenderItem')).toBeTruthy();
  });

  test('Redux fetch (Line 97)', () => {
    const actions = require('store/sales/actions/form');
    renderWithProps({ queryName: 'fetchQ', queryParams: 'params' });
    expect(actions.fetchOptionData).toHaveBeenCalled();
  });

  test('Web formatting branches (Lines 225, 227, 229, 232)', () => {
    (global as any).isWebMock = true;
    (global as any).isDesktopMock = true;
    (global as any).isAndroidMock.mockReturnValue(false);

    const onSelect = jest.fn();
    renderWithProps({
      onSelect,
      data: [{ name: 'WSub', subName: 'S' }, { name: 'WStatic' }, { name: 'WNormal' }],
      hasStaticValues: true,
    });

    fireEvent.press(screen.getByPlaceholderText('Select'));
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('WSub - S')).toBeTruthy(); // Line 225
    expect(screen.getByText('strings.WStatic')).toBeTruthy(); // Line 227
    expect(screen.getByText('strings.WNormal')).toBeTruthy();

    fireEvent.press(screen.getByText('strings.WNormal')); // Line 232
    expect(onSelect).toHaveBeenCalled();
  });

  test('Web modal close (Line 215)', () => {
    (global as any).isWebMock = true;
    (global as any).isDesktopMock = true;
    (global as any).isAndroidMock.mockReturnValue(false);

    renderWithProps();
    fireEvent.press(screen.getByPlaceholderText('Select'));
    act(() => {
      jest.advanceTimersByTime(100);
    });

    fireEvent.press(screen.getByTestId('modal-close-btn'));
    expect(screen.queryByTestId('dropdown-web-modal')).toBeNull();
  });

  test('Default value (Line 135) and selectedValue map (Line 125)', () => {
    const onSelect = jest.fn();
    renderWithProps({
      defaultSelectedValue: '1',
      onSelect,
      selectedValue: { name: 'Fixed' },
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByDisplayValue('Fixed')).toBeTruthy();
  });

  test('iOS specific timeout', () => {
    (global as any).isiOSMock.mockReturnValue(true);
    (global as any).isAndroidMock.mockReturnValue(false);

    renderWithProps();
    fireEvent.press(screen.getByPlaceholderText('Select'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.queryByTestId('dropdown-option-list')).toBeNull();

    act(() => {
      jest.advanceTimersByTime(110);
    });
    expect(screen.getByTestId('dropdown-option-list')).toBeTruthy();
  });

  test('handles onLayout', () => {
    renderWithProps();
    const container = screen.getByTestId('dropdown-test-container').children[0];
    fireEvent(container as any, 'onLayout', { nativeEvent: { layout: { width: 500 } } });
  });

  test('handles required and error display', () => {
    renderWithProps({ required: true, error: 'Err' });
    expect(screen.getByText('* ')).toBeTruthy();
    expect(screen.getByText('Err')).toBeTruthy();
  });
});
