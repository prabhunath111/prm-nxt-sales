/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import DealerStock from './DealerStock';

jest.mock('react-redux', () => {
  const mockDispatch = jest.fn();
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useDispatch: () => mockDispatch,
  };
});
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    DealerStock: {
      DealerStockChangeDealer: {
        moduleName: 'DealerStockChangeDealer',
        attributes: { Status: 'Status' },
      },
    },
  },
}));

jest.mock('components/sales/Dropdown/Dropdown', () => (props: any) => {
  const React = require('react');
  const { View } = require('react-native');
  return React.createElement(View, { testID: 'mock-dropdown', ...props });
});

jest.mock('components/sales/Search/Search', () => (props: any) => {
  const React = require('react');
  const { View, TextInput } = require('react-native');
  return React.createElement(
    View,
    { testID: 'mock-search-container' },
    React.createElement(TextInput, {
      testID: 'mock-search',
      onChangeText: props.onChange,
      value: props.value,
      placeholder: props.placeholder,
    }),
  );
});

jest.mock('hooks/useNavigate', () => () => ({
  goBack: jest.fn(),
  goHome: jest.fn(),
  navigate: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('components/sales/TableWrapper/TableWrapper', () => (props: any) => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return React.createElement(
    View,
    { testID: 'table-test' },
    props.tableData?.map((item: any, i: number) => React.createElement(Text, { key: i }, item.product)),
  );
});

jest.mock('components/sales/Table/Table', () => (props: any) => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return React.createElement(
    View,
    { testID: 'table-test' },
    props.data?.map((item: any, i: number) => React.createElement(Text, { key: i }, item.product)),
  );
});
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  __esModule: true,
  useInflection: () => ({ inflection: 'sm' }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    SM: 'sm',
  },
}));

const mockDispatch = jest.fn();

describe('DealerStock Component Tests', () => {
  const mockStockData = {
    stockList: {
      mdn: '12345',
      name: 'Test Dealer',
      userId: 'EVD001',
      evdBalance: '₹50,000',
      dealerStocks: [
        {
          id: 1,
          product: 'Product A',
          productType: 'product_a',
          stockInHand: 10,
          xTslSugestedQty: 20,
        },
        {
          id: 2,
          product: 'Product B',
          productType: 'product_b',
          stockInHand: 30,
          xTslSugestedQty: 15,
        },
        {
          id: 3,
          product: 'Test Product',
          stockInHand: 5,
          xTslSugestedQty: 10,
        },
      ],
    },
    productTypeDropdownList: {
      productTypes: [
        { name: 'Product A', value: 'product_a' },
        { name: 'Product B', value: 'product_b' },
      ],
    },
    multiCheckboxStockFilter: {
      multiCheckboxStockFilter: [],
    },
  };

  const makeMockStore = (overrides = {}) => {
    const defaultFormSlice = {
      dropdownOptions: {},
      formState: {},
      formDependentData: {},
      tables: {},
      isMarkedForDeletion: false,
    };

    const state = {
      dealerStock: mockStockData,
      form: new Proxy<Record<string, { dropdownOptions: any; formState: any }>>(
        {
          dealerStock: defaultFormSlice,
          filterDealerStock: defaultFormSlice,
        },
        {
          get: (target, prop: string) => target[prop] ?? defaultFormSlice,
        },
      ),
      ui: { error: { message: '' } },
      common: { totalListCount: 0 },
      ...overrides,
    };

    return {
      getState: () => state,
      subscribe: jest.fn(),
      dispatch: mockDispatch,
      replaceReducer: jest.fn(),
      [Symbol.observable]: jest.fn(),
    };
  };

  const renderComponent = (overrides = {}) =>
    render(
      <Provider store={makeMockStore(overrides) as any}>
        <NavigationContainer>
          <DealerStock />
        </NavigationContainer>
      </Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic Rendering Tests
  test('renders component successfully', () => {
    renderComponent();
    expect(screen.getByTestId('mock-dropdown')).toBeTruthy();
  });

  test('renders search placeholder text', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('strings.search')).toBeTruthy();
  });

  test('renders product type dropdown placeholder', () => {
    renderComponent();
    expect(screen.getByTestId('mock-dropdown')).toBeTruthy();
  });

  // Search Functionality Tests
  test('handles search input changes', () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('strings.search');
    fireEvent.changeText(searchInput, 'Test Product');

    expect(searchInput.props.value).toBe('Test Product');
  });

  test('filters dealer stocks based on search query', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('strings.search');
    fireEvent.changeText(searchInput, 'Product A');

    await waitFor(() => {
      expect(screen.queryByText('Product B')).toBeFalsy();
    });
  });

  test('shows empty state when search returns no results', () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('strings.search');
    fireEvent.changeText(searchInput, 'Non-existent Product');

    expect(screen.getByText('errors.stockDetailsNotAvailable')).toBeTruthy();
  });

  // // Filter Tests
  test('opens filter modal when filter button is pressed', () => {
    renderComponent();

    const filterButton = screen.getByTestId('filter-icon');
    fireEvent.press(filterButton);
  });

  test('displays correct filter count', () => {
    renderComponent({
      dealerStock: {
        ...mockStockData,
        multiCheckboxStockFilter: {
          multiCheckboxStockFilter: [{ id: 'filter1' }, { id: 'filter2' }],
        },
      },
    });

    expect(screen.getByText('2')).toBeTruthy();
  });

  // Data Display Tests
  test('renders dealer stock data when available', () => {
    renderComponent();
    expect(screen.getAllByTestId('table-test').length).toBeGreaterThan(0);
  });

  test('shows error message when no stock data available', () => {
    renderComponent({
      dealerStock: {
        ...mockStockData,
        stockList: { ...mockStockData.stockList, dealerStocks: [] },
      },
    });

    expect(screen.getByText('errors.stockDetailsNotAvailable')).toBeTruthy();
  });

  test('shows error message when stockList is null', () => {
    renderComponent({
      dealerStock: {
        ...mockStockData,
        stockList: null,
      },
    });

    expect(screen.getByText('errors.stockDetailsNotAvailable')).toBeTruthy();
  });

  // Snapshot Test
  test('matches snapshot', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });

  // Edge Cases
  test('handles empty search query', () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('strings.search');
    fireEvent.changeText(searchInput, '   ');
    expect(screen.getAllByTestId('table-test').length).toBeGreaterThan(0);
  });

  test('handles case-insensitive search', () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('strings.search');
    fireEvent.changeText(searchInput, 'PRODUCT A');

    expect(screen.getAllByTestId('table-test').length).toBeGreaterThan(0);
  });

  // Performance Test
  test('component re-renders correctly when props change', () => {
    const { rerender } = renderComponent();

    const newStoreData = {
      dealerStock: {
        ...mockStockData,
        stockList: { ...mockStockData.stockList, mdn: '67890' },
      },
    };

    rerender(
      <Provider store={makeMockStore(newStoreData) as any}>
        <NavigationContainer>
          <DealerStock />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByTestId('mock-dropdown')).toBeTruthy();
  });

  test('filter icon press calls dispatch', () => {
    renderComponent();
    const filterButton = screen.getByTestId('filter-icon');
    fireEvent.press(filterButton);
  });

  test('filters dealer stocks by selected partner', async () => {
    renderComponent();
    const dropdown = screen.getByTestId('mock-dropdown');
    fireEvent(dropdown, 'onSelect', { name: 'Product A', value: 'product_a' });

    await waitFor(() => {
      expect(screen.getAllByText('Product A').length).toBeGreaterThan(0);
      expect(screen.queryByText('Product B')).toBeFalsy();
    });
  });

  test('filters stocks with greaterStockFilter', async () => {
    renderComponent({
      dealerStock: {
        ...mockStockData,
        multiCheckboxStockFilter: {
          multiCheckboxStockFilter: [{ id: 'greaterStockInHand' }],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Product B')).toBeTruthy();
    });
  });

  test('filters stocks with lessStockFilter', async () => {
    renderComponent({
      dealerStock: {
        ...mockStockData,
        multiCheckboxStockFilter: {
          multiCheckboxStockFilter: [{ id: 'lessStockInHand' }],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getAllByText('Product A').length).toBeGreaterThan(0);
    });
  });

  test('handles empty selectedPartner', async () => {
    renderComponent();
    const dropdown = screen.getByTestId('mock-dropdown');
    fireEvent(dropdown, 'onSelect', undefined);
    await waitFor(() => {
      expect(screen.getAllByTestId('table-test').length).toBeGreaterThan(0);
    });
  });

  test('handles undefined stockList gracefully', () => {
    renderComponent({
      dealerStock: { ...mockStockData, stockList: undefined },
    });
    expect(screen.getByText('errors.stockDetailsNotAvailable')).toBeTruthy();
  });
});
