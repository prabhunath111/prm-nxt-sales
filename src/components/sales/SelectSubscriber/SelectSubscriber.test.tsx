/* eslint-disable react/no-array-index-key */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import salesReducer from 'store/sales/reducer/root.reducer';
import prmReducer from 'store/prm/reducer/root.reducer';
import { ROUTE } from 'const';
import useNavigate from 'hooks/useNavigate';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import List from 'components/sales/List';
import SelectSubscriber from './SelectSubscriber';

// Mocking dependencies
jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('components/sales/List', () => {
  const { View } = require('react-native');
  return jest.fn(({ data, renderItem, ...props }) => <View {...props}>{data?.map((item: any, index: number) => <View key={index}>{renderItem({ item, index })}</View>)}</View>);
});

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'MOCK_ACTION' })),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  ...jest.requireActual('wrappers/inflection/InflectionProvider'),
  useInflection: jest.fn(),
  BreakPoints: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
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
  isLandscapeSync: jest.fn(() => false),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
}));

const mockSubscriberList = [
  { subscriberId: 'sub1', responseStatus: 'Active', offerCode: 'OFF1' },
  { subscriberId: 'sub2', responseStatus: 'Inactive', offerCode: 'OFF2' },
];

const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: combineReducers({
      ...salesReducer,
      prmReducer,
    }),
    preloadedState: initialState,
  });

describe('SelectSubscriber Component Coverage', () => {
  const mockNavigate = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.XS });
  });

  const renderComponent = (props = { queryName: 'testQuery' }, initialState = {}) =>
    render(
      <Provider store={createTestStore(initialState)}>
        <NavigationContainer>
          <SelectSubscriber {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('renders empty state message when no subscribers', () => {
    renderComponent(undefined, { rechargeWinback: { filteredSubscriberList: [] } } as any);
    expect(screen.getByText('errors.noDataFound')).toBeTruthy();
  });

  test('renders subscribers correctly', () => {
    renderComponent(undefined, { rechargeWinback: { filteredSubscriberList: mockSubscriberList } } as any);
    expect(screen.getByText('sub1')).toBeTruthy();
    expect(screen.getByText('Active')).toBeTruthy();
  });

  test('handles subscriber selection', () => {
    renderComponent({ queryName: 'testAction' }, { rechargeWinback: { filteredSubscriberList: mockSubscriberList } } as any);

    // No longer need to manually call renderItem as the mock does it
    fireEvent.press(screen.getByText('sub1'));
    expect(mockNavigate.navigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS);
  });

  test('responsive layout: 2 columns for LG inflection', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.LG });
    renderComponent(undefined, { rechargeWinback: { filteredSubscriberList: mockSubscriberList } } as any);
    expect((List as unknown as jest.Mock).mock.calls[0][0].numColumns).toBe(2);
  });

  test('responsive layout: 3 columns for XL inflection', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.XL });
    renderComponent(undefined, { rechargeWinback: { filteredSubscriberList: mockSubscriberList } } as any);
    expect((List as unknown as jest.Mock).mock.calls[0][0].numColumns).toBe(3);
  });

  test('snapshot tests for SelectSubscriber with data', () => {
    const component = renderComponent(undefined, { rechargeWinback: { filteredSubscriberList: mockSubscriberList } } as any);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
