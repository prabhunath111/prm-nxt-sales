/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ActionRequestPo from './ActionRequestPo';

// Mock utils/dateHelper BEFORE imports if possible, or use a more robust mock
jest.mock('utils/dateHelper', () => ({
  formatDate: jest.fn((ts) => ts || ''),
}));

jest.mock('services/storageService', () => ({}));
jest.mock('services/apolloClient', () => ({}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

const mockNavigate = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('hooks/useNavigate', () => () => mockNavigate);

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(() => ({ inflection: 'xs' })),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    SM: 'sm',
  },
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    Button: ({ label, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{label}</Text>
      </Pressable>
    ),
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
    List: require('react-native').FlatList,
    Search: ({ value, onChange, placeholder }: any) => {
      const { TextInput } = require('react-native');
      return <TextInput value={value} onChangeText={onChange} placeholder={placeholder} />;
    },
    TextContainer: ({ data }: any) => {
      const { Text } = require('react-native');
      return (
        <View>
          {Object.entries(data).map(([key, value]: any) => (
            <View key={key}>
              <Text>{value}</Text>
            </View>
          ))}
        </View>
      );
    },
  };
});

// Mock react-redux useDispatch
jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: jest.fn(),
  };
});

const mockStore = (actionRequestTableData: any[] = []) =>
  configureStore({
    reducer: {
      purchaseOrder: () => ({ actionRequestTableData }),
    },
  });

describe('Test for the component ActionRequestPo', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    const { useInflection } = require('wrappers/inflection/InflectionProvider');
    useInflection.mockReturnValue({ inflection: 'sm' });
  });

  test('render component ActionRequestPo without data', () => {
    const store = mockStore([]);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('errors.noDataFound')).toBeTruthy();
  });

  test('render component ActionRequestPo with data and search functionality', () => {
    const mockData = [
      {
        id: '1',
        name: 'Dealer 1',
        nameNT: 'Dealer 1',
        mdn: '12345',
        mdnNT: '12345',
        amount: '1000',
        amountNT: '1000',
        request_date: '2023-01-01',
        key: '1',
      },
      {
        id: '2',
        name: 'Other',
        nameNT: 'Other',
        mdn: '67890',
        mdnNT: '67890',
        amount: '2000',
        amountNT: '2000',
        request_date: '2023-01-02',
        key: '2',
      },
    ];
    const store = mockStore(mockData);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText(/Dealer 1/i)).toBeTruthy();
    expect(screen.getByText(/Other/i)).toBeTruthy();

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.changeText(searchInput, 'Dealer');
    expect(screen.getByText(/Dealer 1/i)).toBeTruthy();
    expect(screen.queryByText(/Other/i)).toBeNull();

    fireEvent.changeText(searchInput, '');
    expect(screen.getByText(/Other/i)).toBeTruthy();
  });

  test('handles approve and reject requests in mobile view', () => {
    const mockData = [
      {
        id: '1',
        name: 'Dealer 1',
        nameNT: 'Dealer 1',
        mdn: '12345',
        mdnNT: '12345',
        amount: '1000',
        amountNT: '1000',
        statusNT: 'PENDING',
        transactee_account_id: 'acc1',
        transactor_account_id: 'acc2',
        key: '1',
        request_date: '2023-01-01',
      },
    ];
    const store = mockStore(mockData);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.approve'));
    expect(mockDispatch).toHaveBeenCalled();

    fireEvent.press(screen.getByText('strings.reject'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles approve and reject requests in web view', () => {
    const { useInflection } = require('wrappers/inflection/InflectionProvider');
    useInflection.mockReturnValue({ inflection: 'lg' });

    const mockData = [
      {
        id: '1',
        name: 'Dealer 1',
        nameNT: 'Dealer 1',
        mdn: '12345',
        mdnNT: '12345',
        amount: '1000',
        amountNT: '1000',
        statusNT: 'PENDING',
        key: '1',
        request_date: '2023-01-01',
      },
    ];
    const store = mockStore(mockData);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('strings.approve')).toBeTruthy();
    fireEvent.press(screen.getByText('strings.approve'));
    expect(mockDispatch).toHaveBeenCalled();

    fireEvent.press(screen.getByText('strings.reject'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles back button press', () => {
    const store = mockStore([]);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.cancel'));
    expect(mockNavigate.goBack).toHaveBeenCalled();
  });

  test('covers more inflection and search branches', () => {
    const { useInflection } = require('wrappers/inflection/InflectionProvider');
    useInflection.mockReturnValue({ inflection: 'xl' });

    const mockData = [
      {
        id: '1',
        name: 'Dealer 1',
        nameNT: 'Dealer 1',
        mdn: '11111',
        mdnNT: '11111',
        amount: '100',
        amountNT: '100',
        statusNT: 'PENDING',
        key: '1',
        request_date: '2023-01-01',
      },
      {
        id: '2',
        name: 'Other',
        nameNT: 'Other',
        mdn: '22222',
        mdnNT: '22222',
        amount: '200',
        amountNT: '200',
        statusNT: 'PENDING',
        key: '2',
        request_date: '2023-01-01',
      },
    ];
    const store = mockStore(mockData);
    const { rerender } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );

    const searchInput = screen.getByPlaceholderText('strings.search');

    // Search by MDN
    fireEvent.changeText(searchInput, '11111');
    expect(screen.getByText(/Dealer 1/i)).toBeTruthy();
    expect(screen.queryByText(/Other/i)).toBeNull();

    // Clear search
    fireEvent.changeText(searchInput, '');

    // Search by Amount
    fireEvent.changeText(searchInput, '200');
    expect(screen.getByText(/Other/i)).toBeTruthy();
    expect(screen.queryByText(/Dealer 1/i)).toBeNull();

    // Clear search
    fireEvent.changeText(searchInput, '');

    // Test MD inflection
    useInflection.mockReturnValue({ inflection: 'md' });
    rerender(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText(/Dealer 1/i)).toBeTruthy();

    // Test LG inflection
    useInflection.mockReturnValue({ inflection: 'lg' });
    rerender(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText(/Dealer 1/i)).toBeTruthy();
  });

  test('handles null actionRequestTableData', () => {
    const store = configureStore({
      reducer: {
        purchaseOrder: () => ({ actionRequestTableData: null }),
      },
    });
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('errors.noDataFound')).toBeTruthy();
  });

  test('snapshot tests for ActionRequestPo', () => {
    const store = mockStore([]);
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionRequestPo />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
