import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import salesReducer from 'store/sales/reducer/root.reducer';
import prmReducer from 'store/prm/reducer/root.reducer';
import SelectList from './SelectList';

// Mocking dependencies if needed
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

const mockTskData = {
  TskDetails: [
    { TskSno: '1', VCType: 'Type A', status: 'Pending' },
    { TskSno: '2', VCType: 'Type B', status: 'Completed' },
  ],
};

const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: combineReducers({
      ...salesReducer,
      prmReducer,
    }),
    preloadedState: initialState,
  });

describe('SelectList Component Coverage', () => {
  const onSelectMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}, initialState = {}) =>
    render(
      <Provider store={createTestStore(initialState)}>
        <NavigationContainer>
          <SelectList onSelect={onSelectMock} {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('renders empty container when no data available', () => {
    renderComponent({}, { tskRefund: { data: { TskDetails: [] } } } as any);
    expect(screen.getByTestId('selectlist-test')).toBeTruthy();
    expect(screen.queryByText('Type A')).toBeNull();
  });

  test('renders data correctly when available', () => {
    renderComponent({ headingText: 'My Heading' }, { tskRefund: { data: mockTskData } } as any);
    expect(screen.getByText('My Heading')).toBeTruthy();
    expect(screen.getByText('1 - Type A - Pending')).toBeTruthy();
    expect(screen.getByText('2 - Type B - Completed')).toBeTruthy();
  });

  test('handles item selection and toggling', () => {
    renderComponent({}, { tskRefund: { data: mockTskData } } as any);

    const selectButtons = screen.getAllByText('strings.select');

    // Select first item
    fireEvent.press(selectButtons[0]);
    expect(onSelectMock).toHaveBeenCalledWith(mockTskData.TskDetails[0]);
    expect(screen.getByText('X')).toBeTruthy();

    // Select second item
    fireEvent.press(screen.getByText('strings.select')); // There's only one select button left now
    expect(onSelectMock).toHaveBeenCalledWith(mockTskData.TskDetails[1]);

    // Deselect second item
    fireEvent.press(screen.getByText('X'));
    expect(onSelectMock).toHaveBeenCalledWith(null);
    expect(screen.getAllByText('strings.select')).toHaveLength(2);
  });

  test('renders error message when provided', () => {
    renderComponent({ error: 'Some error' }, { tskRefund: { data: mockTskData } } as any);
    expect(screen.getByText('Some error')).toBeTruthy();
  });

  test('snapshot tests for SelectList with data', () => {
    const component = renderComponent({ headingText: 'My Heading' }, { tskRefund: { data: mockTskData } } as any);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
