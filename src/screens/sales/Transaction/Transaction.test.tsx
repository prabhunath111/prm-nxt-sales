/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import homePageActions from 'store/sales/actions/homePage';
import uiActions from 'store/sales/actions/ui';
import Transaction from './Transaction';

// Mock dependencies
const mockNavigate = jest.fn();

jest.mock('styles/dimentionHelper', () => ({
  ...jest.requireActual('styles/dimentionHelper'),
  getScreenWidth: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('store/sales/actions/homePage', () => ({
  getTransactionSummary: jest.fn(() => ({ type: 'GET_SUMMARY' })),
  getTransactionSummaryWithFilter: jest.fn(() => ({ type: 'GET_FILTERED_SUMMARY' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(() => ({ type: 'SHOW_MODAL' })),
}));

jest.mock('store/sales/actions/common', () => ({
  resetCustomFormData: jest.fn(() => ({ type: 'RESET_FORM' })),
}));

jest.mock('hooks/useDebounce', () => ({
  useDebounce: (fn: Function) => fn,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../TransactionDetails', () => {
  const { View } = require('react-native');
  return (props: any) => <View testID="transaction-details" {...props} />;
});

jest.mock('components/sales', () => {
  const { View, TouchableOpacity, TextInput, Text } = require('react-native');
  return {
    Dropdown: ({ onSelect, placeholder, testID }: any) => (
      <View testID={testID || `dropdown-${placeholder}`}>
        <TouchableOpacity onPress={() => onSelect({ nameNT: 'Selected', object: { valueNT: 'VAL' } })} testID={`select-${placeholder}`}>
          <Text>Select</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSelect({ nameNT: 'Custom date range', object: { valueNT: 'CUSTOM' } })} testID={`select-custom-${placeholder}`}>
          <Text>Select Custom</Text>
        </TouchableOpacity>
      </View>
    ),
    Search: ({ onChange, placeholder }: any) => <TextInput placeholder={placeholder} onChangeText={onChange} testID="search-input" />,
    Text: ({ label, children }: any) => <Text>{label || children}</Text>,
    TransactionCard: () => <View testID="transaction-card" />,
    TransactionDetails: () => <View testID="transaction-details" />,
  };
});

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      homePage: (s = state.homePage) => s,
      common: (s = state.common) => s,
      user: (s = state.user) => s,
    },
  });

describe('Transaction Component Tests', () => {
  const initialState = {
    homePage: {
      transactionData: { lastUpdatedOn: '2023-10-10', headerText: 'Header', primaryText: 'Primary' },
      transactionsDetails: [{ transactionId: '1', date: '2023-10-10', amount: '100', status: 'Success' }],
      daysFilter: [{ name: 'Last 7 Days', nameNT: '7', object: { valueNT: '7' } }],
      statusFilter: [{ name: 'Success', nameNT: 'SUCCESS', object: { valueNT: 'SUCCESS' } }],
      paymentType: [{ name: 'Credit Card', nameNT: 'CC', object: { valueNT: 'CC' } }],
      transactionAmount: [{ name: '100-500', nameNT: '100', object: { valueNT: '100' } }],
    },
    common: {
      customFormData: {},
    },
    user: {
      info: { id: 'user1', name: 'Test User' },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProps = (state = initialState) =>
    render(
      <Provider store={createMockStore(state)}>
        <NavigationContainer>
          <Transaction />
        </NavigationContainer>
      </Provider>,
    );

  test('render component Transaction and fetches summary', () => {
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(1000); // Desktop view default
    renderWithProps();
    expect(screen.getByTestId('transactionTest')).toBeTruthy();
    expect(homePageActions.getTransactionSummary).toHaveBeenCalled();
  });

  test('handles mobile view filters and layout', async () => {
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(400); // Mobile width

    renderWithProps();

    expect(screen.getByTestId('search-input')).toBeTruthy();

    fireEvent.press(screen.getByTestId('select-strings.status'));
    fireEvent.press(screen.getByTestId('select-strings.paymentType'));
    fireEvent.press(screen.getByTestId('select-strings.transactionAmount'));

    await waitFor(() => {
      expect(homePageActions.getTransactionSummaryWithFilter).toHaveBeenCalled();
    });
  });

  test('handles desktop view filters and layout', async () => {
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(1200); // Desktop width

    renderWithProps();

    fireEvent.press(screen.getByTestId('select-strings.date'));
    fireEvent.press(screen.getByTestId('select-strings.status'));
    fireEvent.press(screen.getByTestId('select-strings.paymentType'));
    fireEvent.press(screen.getByTestId('select-strings.transactionAmount'));

    await waitFor(() => {
      expect(homePageActions.getTransactionSummaryWithFilter).toHaveBeenCalled();
    });
  });

  test('triggers custom date picker modal via mobile select', async () => {
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(400);
    jest.useFakeTimers();
    renderWithProps();

    fireEvent.press(screen.getByTestId('select-custom-strings.date'));
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(uiActions.showBottomModal).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('handles search input in both views', async () => {
    renderWithProps();
    fireEvent.changeText(screen.getByTestId('search-input'), 'test query');
    await waitFor(() => expect(homePageActions.getTransactionSummaryWithFilter).toHaveBeenCalled());
  });

  test('handles pagination triggers', async () => {
    const manyState = {
      ...initialState,
      homePage: { ...initialState.homePage, transactionsDetails: Array(20).fill({ transactionId: 'T' }) },
    };
    renderWithProps(manyState);

    const flatList = screen.getByTestId('transaction-list');
    await act(async () => {
      flatList.props.onEndReached();
    });

    expect(homePageActions.getTransactionSummaryWithFilter).toHaveBeenCalled();
  });

  test('updates on customFormData change', async () => {
    const updatedState = {
      ...initialState,
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: { startDate: '2023-01-01', endDate: '2023-01-02' },
          },
        },
      },
    };

    const { rerender } = render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <Transaction />
        </NavigationContainer>
      </Provider>,
    );

    rerender(
      <Provider store={createMockStore(updatedState)}>
        <NavigationContainer>
          <Transaction />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => expect(homePageActions.getTransactionSummaryWithFilter).toHaveBeenCalled());
  });

  test('shows empty state component', () => {
    const emptyState = {
      ...initialState,
      homePage: { ...initialState.homePage, transactionsDetails: [] },
    };
    renderWithProps(emptyState);
    expect(screen.getByText('strings.noItemAvailable')).toBeTruthy();
  });
});
