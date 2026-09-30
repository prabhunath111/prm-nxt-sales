/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { STATE_KEY } from 'const';
import MonthWiseDashboard from './MonthWiseDashboard';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options: any) => options?.defaultValue || key,
  }),
}));

// Mock individual components to avoid circular dependency with components/sales/index
jest.mock('../RadioContainer/RadioContainer', () => {
  const { View: RNView, TouchableOpacity } = require('react-native');
  return ({ items, onSelectionChange }: any) => (
    <RNView testID="mock-radio-container">
      {items?.map((item: any) => (
        <TouchableOpacity key={item.key || item.text} testID={`radio-item-${item.key || item.text}`} onPress={() => onSelectionChange(item.key || item.text)}>
          <RNView />
        </TouchableOpacity>
      ))}
    </RNView>
  );
});

jest.mock('../BottomModal/BottomModal', () => {
  const { View: RNView, Button: RNButton } = require('react-native');
  return ({ modalProps, children }: any) => {
    if (!modalProps.isModalVisible) return null;
    return (
      <RNView testID="mock-bottom-modal">
        {children}
        <RNButton title="Close" onPress={() => modalProps.onClose()} testID="mock-modal-close" />
      </RNView>
    );
  };
});

// Mock other components that might cause issues if they are complex
jest.mock('../ChartWrapper/ChartWrapper', () => {
  const { View: RNView } = require('react-native');
  return () => <RNView testID="mock-chart-wrapper" />;
});

jest.mock('../TableWrapper/TableWrapper', () => {
  const { View: RNView } = require('react-native');
  return () => <RNView testID="mock-table-wrapper" />;
});

describe('Test for the component MonthWiseDashboard', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        dashboard: (
          state = {
            infoLastUpdatedDate: '2026-03-27',
            monthWiseFilterData: [{ text: 'Option 1', key: 'opt1' }],
            monthWiseTableData: [],
          },
        ) => state,
        form: (
          state = {
            [STATE_KEY.FORM_STATE]: { dropdownOptions: {} },
          },
        ) => state,
      },
    });
    jest.clearAllMocks();
  });

  test('render component MonthWiseDashboard', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <MonthWiseDashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('strings.filterBy')).toBeTruthy();
  });

  test('handle modal open/close', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <MonthWiseDashboard />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('dashboard-filter-pressable'));
    expect(screen.getByTestId('mock-bottom-modal')).toBeTruthy();

    fireEvent.press(screen.getByTestId('mock-modal-close'));
    expect(screen.queryByTestId('mock-bottom-modal')).toBeNull();
  });

  test('handle filter selection and clear', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <MonthWiseDashboard />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('dashboard-filter-pressable'));

    // Select Option 1 in RadioContainer
    fireEvent.press(screen.getByTestId('radio-item-opt1'));

    // Clear filter
    fireEvent.press(screen.getByText('strings.clear'));

    // Show results
    fireEvent.press(screen.getByText('strings.showResults'));
  });

  test('snapshot tests for MonthWiseDashboard', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <MonthWiseDashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
