/* eslint-disable react/no-array-index-key */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import PurchaseOrderSettlements from './PurchaseOrderSettlements';

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: 'purchaseOrderSettlements',
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

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

// Mock PROPERTIES.TOTAL_MONTHS
jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    PROPERTIES: {
      ...actual.PROPERTIES,
      TOTAL_MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  };
});

jest.mock('components/sales/Autocomplete', () => ({
  __esModule: true,
  default: ({ data, onSelect, testID }: any) => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID={testID}>
        {data?.map((item: any, index: number) => (
          <TouchableOpacity key={item.id || index} onPress={() => onSelect(item)} testID={item.id ? `auto-item-${item.id}` : `auto-item-${index}`}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Dropdown: ({ data, onSelect, placeholder, testID }: any) => {
      const testBase = testID || placeholder;
      return (
        <View testID={`dropdown-${testBase}`}>
          {data?.map((item: any) => (
            <TouchableOpacity key={item.id} onPress={() => onSelect(item)} testID={`dropdown-item-${testBase}-${item.id}`}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    },
    Autocomplete: ({ data, onSelect, testID }: any) => (
      <View testID={testID}>
        {data?.map((item: any, index: number) => (
          <TouchableOpacity key={item.id || index} onPress={() => onSelect(item)} testID={item.id ? `auto-item-${item.id}` : `auto-item-${index}`}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    Search: ({ placeholder }: any) => (
      <View testID="search-test">
        <TextInput placeholder={placeholder} />
      </View>
    ),
    DynamicTable: ({ data }: any) => <View testID="dynamic-table">{data?.map((item: any, index: number) => <Text key={index}>{item.dealerCode}</Text>)}</View>,
    Image: ({ iconName }: any) => <View testID={`image-${iconName}`} />,
    Text: ({ children, style, label }: any) => <Text style={style}>{label || children}</Text>,
    Pressable: ({ children, onPress, testID }: any) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        {children}
      </TouchableOpacity>
    ),
  };
});

const createMockStore = (initialState: any) =>
  configureStore({
    reducer: {
      storeDashboard: () => initialState.storeDashboard,
      common: () => initialState.common,
      purchaseOrder: () => initialState.purchaseOrder,
      ui: (state = { isModalVisible: false }) => state,
      form: (state = { formState: { searchSuggestions: {} } }) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('PurchaseOrderSettlements Component', () => {
  const initialState = {
    storeDashboard: { selectedDate: '' },
    common: { tableFilteredData: [] },
    purchaseOrder: {
      tableColumn: [],
      settlementsData: { totalAmount: '1000', dealers: [] },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render component PurchaseOrderSettlements', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByTestId('SelectBox')).toBeTruthy();
    expect(screen.getByText('1000')).toBeTruthy();
  });

  test('handles year dropdown change', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => expect(screen.getByTestId('dropdown-item-strings.year-2026')).toBeTruthy());

    fireEvent.press(screen.getByTestId('dropdown-item-strings.year-2026'));
    expect(callAction).toHaveBeenCalled();
  });

  test('handles month dropdown change', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => expect(screen.getByTestId('dropdown-item-strings.month-2')).toBeTruthy());

    fireEvent.press(screen.getByTestId('dropdown-item-strings.month-2'));
    expect(callAction).toHaveBeenCalled();
  });

  test('handles date dropdown change', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => expect(screen.getByTestId('dropdown-item-strings.date-15')).toBeTruthy());

    fireEvent.press(screen.getByTestId('dropdown-item-strings.date-15'));
    expect(callAction).toHaveBeenCalled();
  });

  test('handles calendar icon press', async () => {
    const store = createMockStore(initialState);
    store.dispatch = jest.fn();
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-calendar'));
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('handles back button press', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('modal.back'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.PURCHASE_ORDER_REQUEST);
  });

  test('handles date selection from storeDashboard', async () => {
    const stateWithDate = {
      ...initialState,
      storeDashboard: { selectedDate: '2026-03-15' },
    };

    render(
      <Provider store={createMockStore(stateWithDate)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => expect(callAction).toHaveBeenCalled());
  });

  test('filters table data by dealerId', async () => {
    const stateWithData = {
      ...initialState,
      common: { tableFilteredData: [{ dealerCode: 'D1' }, { dealerCode: 'D2' }] },
      purchaseOrder: {
        ...initialState.purchaseOrder,
        settlementsData: {
          totalAmount: '1000',
          dealers: [
            { id: 'D1', name: 'Dealer 1', value: 'D1' },
            { id: 'ALL', name: 'All', value: 'All' },
          ],
        },
      },
    };

    render(
      <Provider store={createMockStore(stateWithData)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('D1')).toBeTruthy();
    expect(screen.getByText('D2')).toBeTruthy();

    await waitFor(() => expect(screen.getByTestId('auto-item-D1')).toBeTruthy());

    // Select D1
    await act(async () => {
      fireEvent.press(screen.getByTestId('auto-item-D1'));
    });

    await waitFor(() => expect(screen.queryByText('D2')).toBeNull());
    expect(screen.getByText('D1')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByTestId('auto-item-ALL'));
    });
    await waitFor(() => expect(screen.getByText('D2')).toBeTruthy());
  });

  test('renders no settlements found message', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('errors.noSettlementsFound')).toBeTruthy();
  });

  test('handles date logic paths when selectedDate is empty', async () => {
    const store = createMockStore(initialState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => expect(screen.getByTestId('SelectBox')).toBeTruthy());
  });

  test('initialization with existing dates in store', async () => {
    const stateWithPrefilled = {
      ...initialState,
      storeDashboard: { selectedDate: '2026-03-15' },
    };

    render(
      <Provider store={createMockStore(stateWithPrefilled)}>
        <NavigationContainer>
          <PurchaseOrderSettlements />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => expect(callAction).toHaveBeenCalled());
  });
});
