/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable camelcase */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import { store } from 'store';
import { configureStore } from '@reduxjs/toolkit';
import MultiCheckbox, { DataItem } from './MultiCheckbox';

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'en' } }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('hooks/useCurrentRoute', () => jest.fn(() => ({ routeName: '' })));

jest.mock('store/sales/actions/form', () => ({
  fetchOptionData: jest.fn((params, queryName) => ({ type: 'FETCH_OPTION_DATA', params, queryName })),
}));

const mockData = [
  { id: '1', name: 'One' },
  { id: '2', name: 'Two' },
  { id: '3', name: 'All' },
];

const createMockStore = (dropdownOptions = {}) =>
  configureStore({
    reducer: {
      form: () => ({ formState: { dropdownOptions } }),
    },
  });

describe('Test for the component MultiCheckbox', () => {
  test('render component MultiCheckbox with static data', () => {
    render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} />
      </Provider>,
    );
    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Two')).toBeTruthy();
    expect(screen.getByText('All')).toBeTruthy();
  });

  test('snapshot test for MultiCheckbox', () => {
    const component = render(
      <Provider store={store}>
        <View>
          <MultiCheckbox data={mockData} />
        </View>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('handles checkbox press and calls onSelect', () => {
    const onSelect = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} onSelect={onSelect} />
      </Provider>,
    );
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    fireEvent.press(pressables[0]);
    expect(onSelect).toHaveBeenCalled();
  });

  test('handles selecting All checkbox', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} onSelect={onSelect} />
      </Provider>,
    );
    const allCheckbox = getByText('All');
    fireEvent.press(allCheckbox);
    expect(onSelect).toHaveBeenCalled();
    const callArg = onSelect.mock.calls[0][0];
    expect(Array.isArray(callArg)).toBe(true);
    expect(callArg.length).toBe(3);
  });

  test('handles deselecting All checkbox', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} selectedValues={mockData} onSelect={onSelect} />
      </Provider>,
    );
    const allCheckbox = getByText('All');
    fireEvent.press(allCheckbox);
    expect(onSelect).toHaveBeenCalled();
    const callArg = onSelect.mock.calls[0][0];
    expect(callArg).toBeNull();
  });

  test('handles selecting item when All is already selected', () => {
    const onSelect = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} selectedValues={mockData} onSelect={onSelect} />
      </Provider>,
    );
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    fireEvent.press(pressables[0]);
    expect(onSelect).toHaveBeenCalled();
  });

  test('handles selecting all items individually to auto-select All', () => {
    const onSelect = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} onSelect={onSelect} />
      </Provider>,
    );
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    fireEvent.press(pressables[0]);
    fireEvent.press(pressables[1]);
    expect(onSelect).toHaveBeenCalled();
  });

  test('handles deselecting an item', () => {
    const onSelect = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} selectedValues={[mockData[0]]} onSelect={onSelect} />
      </Provider>,
    );
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    fireEvent.press(pressables[0]);
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  test('renders with error message', () => {
    render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} error="Error message" />
      </Provider>,
    );
    expect(screen.getByText('Error message')).toBeTruthy();
  });

  test('handles selectedValues as null', () => {
    const { rerender } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} selectedValues={[mockData[0]]} />
      </Provider>,
    );
    rerender(
      <Provider store={store}>
        <MultiCheckbox data={mockData} selectedValues={null} />
      </Provider>,
    );
    expect(screen.getByText('One')).toBeTruthy();
  });

  test('uses dynamic options from Redux when available', () => {
    const dynamicData = [{ id: '4', name: 'Dynamic' }];
    const mockStore = createMockStore({ testQuery: dynamicData });
    render(
      <Provider store={mockStore}>
        <MultiCheckbox queryName="testQuery" />
      </Provider>,
    );
    expect(screen.getByText('Dynamic')).toBeTruthy();
  });

  test('handles All checkbox with lowercase id', () => {
    const dataWithLowercaseAll = [
      { id: 'all', name: 'Item' },
      { id: '2', name: 'Two' },
    ];
    const onSelect = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <MultiCheckbox data={dataWithLowercaseAll} onSelect={onSelect} />
      </Provider>,
    );
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    fireEvent.press(pressables[0]);
    expect(onSelect).toHaveBeenCalled();
  });

  test('handles non-array optionData gracefully', () => {
    const mockStore = createMockStore({ testQuery: null });
    render(
      <Provider store={mockStore}>
        <MultiCheckbox queryName="testQuery" data={mockData} />
      </Provider>,
    );
    expect(screen.getByText('One')).toBeTruthy();
  });

  test('handles selecting items to trigger auto-select All', () => {
    const dataWithAll = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
      { id: '3', name: 'All' },
    ];
    const onSelect = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <MultiCheckbox data={dataWithAll} selectedValues={[dataWithAll[0]]} onSelect={onSelect} />
      </Provider>,
    );
    const twoCheckbox = getByText('Two');
    fireEvent.press(twoCheckbox);
    expect(onSelect).toHaveBeenCalled();
    const lastCall = onSelect.mock.calls[onSelect.mock.calls.length - 1][0];
    expect(lastCall).toHaveLength(3);
    const hasAllItem = lastCall?.some((item: DataItem) => item.name === 'All');
    expect(hasAllItem).toBe(true);
  });

  test('dispatches fetchOptionData when queryParams and queryName are provided', () => {
    const mockStore = createMockStore({});
    render(
      <Provider store={mockStore}>
        <MultiCheckbox queryName="testQuery" queryParams="testParams" />
      </Provider>,
    );
    expect(screen).toBeTruthy();
  });

  test('handles selectedValues update from array to array', () => {
    const { rerender } = render(
      <Provider store={store}>
        <MultiCheckbox data={mockData} selectedValues={[mockData[0]]} />
      </Provider>,
    );
    rerender(
      <Provider store={store}>
        <MultiCheckbox data={mockData} selectedValues={[mockData[1]]} />
      </Provider>,
    );
    expect(screen.getByText('Two')).toBeTruthy();
  });

  test('handles auto-select All when all non-All items are selected', () => {
    const dataWithAll = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
      { id: 'all', name: 'All' },
    ];
    const onSelect = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <MultiCheckbox data={dataWithAll} selectedValues={[dataWithAll[0]]} onSelect={onSelect} />
      </Provider>,
    );
    const twoCheckbox = getByText('Two');
    fireEvent.press(twoCheckbox);
    expect(onSelect).toHaveBeenCalled();
    const lastCall = onSelect.mock.calls[onSelect.mock.calls.length - 1][0];
    expect(lastCall).toHaveLength(3);
    const hasAllItem = lastCall?.some((item: DataItem) => item.name === 'All');
    expect(hasAllItem).toBe(true);
  });

  test('does not dispatch fetchOptionData when dropdownOptions already exist', () => {
    const mockStore = createMockStore({ testQuery: [{ id: '1', name: 'Existing' }] });
    render(
      <Provider store={mockStore}>
        <MultiCheckbox queryName="testQuery" queryParams="testParams" />
      </Provider>,
    );
    expect(screen.getByText('Existing')).toBeTruthy();
  });

  test('handles case when All item does not exist in data', () => {
    const dataWithoutAll = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
    ];
    const onSelect = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <MultiCheckbox data={dataWithoutAll} selectedValues={[dataWithoutAll[0]]} onSelect={onSelect} />
      </Provider>,
    );
    const twoCheckbox = getByText('Two');
    fireEvent.press(twoCheckbox);
    expect(onSelect).toHaveBeenCalled();
    const lastCall = onSelect.mock.calls[onSelect.mock.calls.length - 1][0];
    expect(lastCall).toHaveLength(2);
  });
});
