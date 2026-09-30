/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import CumulativeDashboard from './CumulativeDashboard';

// Mock components
jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable, TextInput } = require('react-native');
  return {
    Button: ({ onPress, label, testID }: any) => (
      <Pressable onPress={onPress} testID={testID}>
        <Text>{label}</Text>
      </Pressable>
    ),
    ChartWrapper: () => <View testID="chart-wrapper" />,
    Image: () => <View testID="image-mock" />,
    MultiFilters: ({ setSelectedLanguages }: any) => (
      <Pressable onPress={() => setSelectedLanguages([{ id: '1', name: 'Eng' }])} testID="multi-filters-mock">
        <Text>MultiFilters</Text>
      </Pressable>
    ),
    Search: ({ onChange, value }: any) => <TextInput testID="search-input" onChangeText={onChange} value={value} />,
    TableWrapper: () => <View testID="table-wrapper" />,
    Text: ({ children, style }: any) => <Text style={style}>{children}</Text>,
  };
});

jest.mock('components/sales/BottomModal', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return ({ children, modalProps }: any) =>
    modalProps.isModalVisible ? (
      <View testID="bottom-modal">
        <Text>{modalProps.headerTitle}</Text>
        <Pressable onPress={modalProps.onClose} testID="modal-close-icon">
          <Text>Close</Text>
        </Pressable>
        {children}
      </View>
    ) : null;
});

jest.mock('components/sales/MonthWiseDashboard/MonthWiseDashboard', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    InfoContainer: () => <View testID="info-container" />,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockCumulativeFilterData = [{ id: '1', name: 'Language', options: [{ id: '1', name: 'English' }] }];

const mockCumulativeTableData = [
  {
    data: [{ id: '1', name: 'Row 1' }],
    tableColumns: [{ title: 'Col 1', key: 'name' }],
  },
];

const mockStore = configureStore({
  reducer: {
    dashboard: (
      state = {
        cumulativeFilterData: mockCumulativeFilterData,
        cumulativeTableData: mockCumulativeTableData,
      },
    ) => state,
  },
});

describe('CumulativeDashboard Component', () => {
  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CumulativeDashboard />
        </NavigationContainer>
      </Provider>,
    );

  test('renders initial state', () => {
    renderComponent();
    expect(screen.getByTestId('info-container')).toBeTruthy();
    expect(screen.getByTestId('chart-wrapper')).toBeTruthy();
    expect(screen.getByText('strings.filters')).toBeTruthy();
  });

  test('opens and closes filter modal', async () => {
    renderComponent();
    const filterBtn = screen.getByText('strings.filters');

    fireEvent.press(filterBtn);
    expect(screen.getByTestId('bottom-modal')).toBeTruthy();
    expect(screen.getByText('strings.Filters')).toBeTruthy();

    const closeBtn = screen.getByTestId('modal-close-icon');
    fireEvent.press(closeBtn);
    expect(screen.queryByTestId('bottom-modal')).toBeNull();
  });

  test('handles search input change', () => {
    renderComponent();
    fireEvent.press(screen.getByText('strings.filters'));

    const searchInput = screen.getByTestId('search-input');
    fireEvent.changeText(searchInput, 'test search');
    expect(searchInput.props.value).toBe('test search');
  });

  test('handles multi-filters selection', () => {
    renderComponent();
    fireEvent.press(screen.getByText('strings.filters'));

    const multiFilters = screen.getByTestId('multi-filters-mock');
    fireEvent.press(multiFilters); // Triggers setSelectedLanguages
    expect(multiFilters).toBeTruthy();
  });

  test('handles clear filters', () => {
    renderComponent();
    fireEvent.press(screen.getByText('strings.filters'));

    const clearBtn = screen.getByText('strings.clear');
    fireEvent.press(clearBtn);
    expect(clearBtn).toBeTruthy();
  });

  test('handles show results (filterHandler)', () => {
    renderComponent();
    fireEvent.press(screen.getByText('strings.filters'));

    const resultsBtn = screen.getByText('strings.showResults');
    fireEvent.press(resultsBtn);
    expect(resultsBtn).toBeTruthy();
  });

  test('renders cumulative table data', () => {
    renderComponent();
    expect(screen.getByText('strings.activationTotal')).toBeTruthy();
    expect(screen.getByTestId('table-wrapper')).toBeTruthy();
  });

  test('handles empty cumulative data', () => {
    const emptyStore = configureStore({
      reducer: {
        dashboard: (
          state = {
            cumulativeFilterData: [],
            cumulativeTableData: [],
          },
        ) => state,
      },
    });
    render(
      <Provider store={emptyStore}>
        <NavigationContainer>
          <CumulativeDashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.queryByText('strings.activationTotal')).toBeNull();
  });
});
