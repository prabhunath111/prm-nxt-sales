/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ROUTE } from 'const';
import QuotationPortalDetails from './QuotationPortalDetails';

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ code: 'TEST_CODE' }),
}));

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
  useLazyQuery: jest.fn(),
  gql: jest.fn((query) => query),
}));

jest.mock('services/apolloClient', () => ({
  client: {},
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((data) => data),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Image: () => <View testID="mock-image" />,
    Text: ({ children, style, label }: any) => <Text style={style}>{label || children}</Text>,
  };
});

const createMockStore = () => {
  const store = configureStore({
    reducer: {
      ui: (state = {}) => state,
      form: (state = {}) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });
  store.dispatch = jest.fn();
  return store;
};

describe('QuotationPortalDetails Component', () => {
  const mockGetOfferDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLazyQuery as jest.Mock).mockReturnValue([mockGetOfferDetails, { loading: false, data: null, error: null }]);
  });

  test('renders loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      data: null,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <NavigationContainer>
          <QuotationPortalDetails />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Loading....')).toBeTruthy();
  });

  test('renders error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: null,
      error: { message: 'Query Error' },
    });

    render(
      <Provider store={createMockStore()}>
        <NavigationContainer>
          <QuotationPortalDetails />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Query Error')).toBeTruthy();
  });

  test('renders quotation details and handles view details', () => {
    const mockData = {
      getQuotationDetails: {
        status: true,
        result: {
          totalPrice: '1000',
          primary: {
            NCF: '150',
            boxPrice: '500',
            boxType: 'HD',
            pack: [{ pack: 'Primary Pack', price: '350' }],
          },
          secondaryBox1: {
            NCF: '50',
            boxPrice: '200',
            boxType: 'SD',
            pack: [{ pack: 'Secondary Pack 1', price: '100' }],
          },
          secondaryBox2: {
            NCF: '50',
            boxPrice: '200',
            boxType: 'SD',
            pack: [{ pack: 'Secondary Pack 2', price: '100' }],
          },
          secondaryBox3: {
            NCF: '50',
            boxPrice: '200',
            boxType: 'SD',
            pack: [{ pack: 'Secondary Pack 3', price: '100' }],
          },
        },
      },
    };

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: mockData,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <NavigationContainer>
          <QuotationPortalDetails />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Your Order Summary')).toBeTruthy();
    expect(screen.getByText('₹1000')).toBeTruthy();

    // Test clicking info icon
    fireEvent.press(screen.getByTestId('view-details-Primary Pack'));
    expect(mockGetOfferDetails).toHaveBeenCalled();
  });

  test('handles lazy query loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { getQuotationDetails: { status: true, result: {} } },
      error: null,
    });
    (useLazyQuery as jest.Mock).mockReturnValue([mockGetOfferDetails, { loading: true, data: null, error: null }]);

    const store = createMockStore();
    render(
      <Provider store={store}>
        <NavigationContainer>
          <QuotationPortalDetails />
        </NavigationContainer>
      </Provider>,
    );

    expect(store.dispatch).toHaveBeenCalled(); // Should dispatch setLoader
  });

  test('handles lazy query error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { getQuotationDetails: { status: true, result: {} } },
      error: null,
    });
    (useLazyQuery as jest.Mock).mockReturnValue([mockGetOfferDetails, { loading: false, data: null, error: { message: 'Lazy Error' } }]);

    const store = createMockStore();
    render(
      <Provider store={store}>
        <NavigationContainer>
          <QuotationPortalDetails />
        </NavigationContainer>
      </Provider>,
    );

    expect(store.dispatch).toHaveBeenCalled(); // Should dispatch showErrorPage
  });

  test('handles lazy query data state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { getQuotationDetails: { status: true, result: {} } },
      error: null,
    });
    (useLazyQuery as jest.Mock).mockReturnValue([mockGetOfferDetails, { loading: false, data: { someData: {} }, error: null }]);

    render(
      <Provider store={createMockStore()}>
        <NavigationContainer>
          <QuotationPortalDetails />
        </NavigationContainer>
      </Provider>,
    );

    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.PACK_VIEW_DETAILS);
  });
});
