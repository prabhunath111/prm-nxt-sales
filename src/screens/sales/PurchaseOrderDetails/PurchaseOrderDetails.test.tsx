/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTE, QUERY } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import PurchaseOrderDetails from './PurchaseOrderDetails';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

// Mock Hooks
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

let mockRouteName = ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS;
jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: mockRouteName,
}));

// Mock Inflection
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'md' }),
}));

// Mock Translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Styles and Breakpoints
jest.mock('styles', () => ({
  Sizing: {
    layout: {
      x0: 0,
      x1: 1,
      x2: 2,
      x5: 5,
      x9: 9,
      x10: 10,
      x14: 14,
      x16: 16,
      x24: 24,
      x30: 30,
    },
    layoutP: {
      xp100: '100%',
      xp80: '80%',
      xp50: '50%',
      xp40: '40%',
      xp30: '30%',
    },
    flexSize: {
      x100: 1,
    },
  },
  Colors: {
    neutral: {
      white: '#FFFFFF',
    },
  },
  Typography: {
    fontName: {
      medium: { fontSize: 16 },
    },
  },
  Forms: {
    buttonContainer: {
      shadowContainer: {},
    },
  },
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((base) => base),
}));

// Mock Utils
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

// Mock UI Components
jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <Pressable onPress={onPress} testID={`button-${label}`}>
        <Text>{label}</Text>
      </Pressable>
    ),
    DynamicTable: ({ data, onLinkPress }: any) => (
      <View testID="mock-dynamic-table">
        {data.map((item: any, index: number) => (
          <Pressable key={index} onPress={() => onLinkPress(item)} testID={`table-row-${index}`}>
            <Text>{item.orderNumber || item.productName || 'Row'}</Text>
          </Pressable>
        ))}
      </View>
    ),
    Search: ({ queryName }: any) => <View testID={`mock-search-${queryName}`} />,
    Text: ({ label, style }: any) => <Text style={style}>{label}</Text>,
  };
});

describe('PurchaseOrderDetails Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        common: { tableFilteredData: [{ orderNumber: 'ORD123', productDetails: [{ productName: 'Prod1', requestedQty: '10', confirmedQty: 5 }] }] },
        purchaseOrder: { tableColumn: [], detailsColumn: [] },
      }),
    );
  });

  const renderComponent = () => render(<PurchaseOrderDetails />);

  test('should render and handle item selection', () => {
    renderComponent();
    expect(screen.getByTestId('SelectBox')).toBeTruthy();
    expect(screen.getByTestId('mock-dynamic-table')).toBeTruthy();

    const row = screen.getByTestId('table-row-0');
    fireEvent.press(row);

    // After selection, the second table should appear
    expect(screen.getAllByTestId('mock-dynamic-table').length).toBe(2);
  });

  test('should handle asset details click in second table', () => {
    renderComponent();
    fireEvent.press(screen.getByTestId('table-row-0')); // Select first table row

    const productRow = screen.getAllByTestId('table-row-0')[1]; // Second table's first row
    fireEvent.press(productRow);

    expect(callAction).toHaveBeenCalledWith(expect.objectContaining({ productName: 'Prod1', orderNumber: 'ORD123' }), QUERY.DoGetPOSMAssetDetails);
  });

  test('should show "No Data Found" when tableFilteredData is empty', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        common: { tableFilteredData: [] },
        purchaseOrder: { tableColumn: [], detailsColumn: [] },
      }),
    );
    renderComponent();
    expect(screen.getByText('errors.noDataFound')).toBeTruthy();
  });

  test('should handle handleSubmit for all routes', () => {
    const routes = [
      { name: ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS, expected: ROUTE.WEB.PURCHASE_ORDER_DURATION },
      { name: ROUTE.WEB.PURCHASE_ORDER_DEALER_TRACK_DETAILS, expected: ROUTE.WEB.PURCHASE_ORDER_DEALER_DURATION },
      { name: ROUTE.WEB.PURCHASE_ORDER_FOS_TRACK_DETAILS, expected: ROUTE.WEB.PURCHASE_ORDER_FOS_DURAION },
      { name: 'UNKNOWN_ROUTE', expected: ROUTE.WEB.PURCHASE_ORDER_REQUEST },
    ];

    routes.forEach((route) => {
      mockRouteName = route.name;
      const { unmount } = renderComponent();
      fireEvent.press(screen.getByTestId('button-modal.ok'));
      expect(mockNavigate).toHaveBeenCalledWith(route.expected);
      unmount();
    });
  });

  test('should set correct searchQueryName based on routeName', () => {
    const searchRoutes = [
      { name: ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_POSM, expected: QUERY.SearchPoTrackDetailsPOSM },
      { name: ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS, expected: QUERY.SearchPoTrackDetails },
      { name: ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_DEALER_POSM, expected: QUERY.SearchPoTrackDetailsPOSM },
      { name: ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_FOS_POSM, expected: QUERY.SearchPoTrackDetailsPOSM },
      { name: ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_ASM_POSM, expected: QUERY.SearchPoTrackDetailsPOSM },
      { name: 'DEFAULT_ROUTE', expected: QUERY.SearchPoTrackDetails },
    ];

    searchRoutes.forEach((route) => {
      mockRouteName = route.name;
      const { unmount } = renderComponent();
      expect(screen.getByTestId(`mock-search-${route.expected}`)).toBeTruthy();
      unmount();
    });
  });

  test('filteredProductDetails memo should handle various product scenarios', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        common: {
          tableFilteredData: [
            {
              orderNumber: 'ORD123',
              productDetails: [
                { productName: 'RequestedNotEmpty', requestedQty: '10', confirmedQty: 0 },
                { productName: 'ConfirmedGreaterThanZero', requestedQty: '', confirmedQty: 5 },
                { productName: 'EmptyAndZero', requestedQty: ' ', confirmedQty: 0 },
              ],
            },
          ],
        },
        purchaseOrder: { tableColumn: [], detailsColumn: [] },
      }),
    );
    renderComponent();
    fireEvent.press(screen.getByTestId('table-row-0'));

    // Should only show 2 rows in the second table
    const productRows = screen.getAllByTestId('mock-dynamic-table')[1];
    expect(productRows.children.length).toBe(2);
  });

  test('should handle undefined productDetails in orderIdSelected', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        common: {
          tableFilteredData: [{ orderNumber: 'ORD123', productDetails: undefined }],
        },
        purchaseOrder: { tableColumn: [], detailsColumn: [] },
      }),
    );
    renderComponent();
    fireEvent.press(screen.getByTestId('table-row-0'));

    // The second table should still render (item is selected) but with 0 rows
    const tables = screen.getAllByTestId('mock-dynamic-table');
    expect(tables.length).toBe(2);
    expect(tables[1].children.length).toBe(0);
  });
});
