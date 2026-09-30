/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { FORMS, STATE_KEY } from 'const';
import InventoryTable from './InventoryTable';

// ── Mocks ─────────────────────────────────────────────────────────────────────

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

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((offset: string) => offset),
  isXL: false,
  isLG: false,
  isMD: false,
  isMDL: false,
  isSM: false,
  isXS: false,
}));

let mockOnSelectData = { id: 'AZ Alphabetical', name: 'A-Z', object: { value: 'AZ Alphabetical' } };

jest.mock('components/sales/Dropdown', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    __esModule: true,
    default: ({ onSelect, testID }: any) => <TouchableOpacity testID={testID} onPress={() => onSelect(mockOnSelectData)} />,
  };
});

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'XL' }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

const mockSortAlpha = jest.fn(() => ({ type: 'SORT_ALPHA' }));
const mockSortMax = jest.fn(() => ({ type: 'SORT_MAX' }));
const mockSortMaxAsc = jest.fn(() => ({ type: 'SORT_MAX_ASC' }));

jest.mock('store/sales/actions/tsraInventory', () => {
  const alphaHelper = () => mockSortAlpha();
  const maxHelper = () => mockSortMax();
  const maxAscHelper = () => mockSortMaxAsc();
  return {
    __esModule: true,
    sortTsraInventoryAlphabetically: alphaHelper,
    sortTsraInventoryByMaxStockDays: maxHelper,
    sortTsraInventoryByMaxStockDaysAsc: maxAscHelper,
    default: {
      sortTsraInventoryAlphabetically: alphaHelper,
      sortTsraInventoryByMaxStockDays: maxHelper,
      sortTsraInventoryByMaxStockDaysAsc: maxAscHelper,
    },
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// ── Store factory ──────────────────────────────────────────────────────────────

const makeStore = (overrides: any = {}) =>
  configureStore({
    reducer: {
      common: (state = { totalListCount: overrides.totalListCount || 0, tableData: [] }) => state,
      user: (state = { isRedirection: false }) => state,
      form: (state = { [STATE_KEY.FORM_STATE]: { dropdownOptions: {} } }) => state,
    },
  });

const renderComponent = (props: any = {}, storeOverrides: any = {}) => {
  const store = makeStore(storeOverrides);
  const utils = render(
    <Provider store={store}>
      <NavigationContainer>
        <InventoryTable {...props} />
      </NavigationContainer>
    </Provider>,
  );
  return { ...utils, store };
};

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('InventoryTable Component', () => {
  const defaultProps = {
    totalCount: 10,
    limit: 5,
    data: [
      { id: '1', name: 'Item 1', value: '10' },
      { id: '2', name: 'Item 2', value: '20' },
    ],
    columns: [
      { accessorKey: 'name', header: 'Name', isBorder: true },
      { accessorKey: 'value', header: 'Value' },
    ],
    showPagination: true,
    pagination: { pageIndex: 0, pageSize: 5 },
    setPagination: jest.fn(),
  };

  it('renders table with data and pagination', () => {
    renderComponent(defaultProps);
    expect(screen.getByTestId('table-test')).toBeTruthy();
    // Header for "Name" column is replaced by Dropdown
    expect(screen.getByTestId('sort-dropdown')).toBeTruthy();
    expect(screen.getByText('Value')).toBeTruthy();
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('>>')).toBeTruthy();
    expect(screen.getByText('<<')).toBeTruthy();
    expect(screen.getByText('>')).toBeTruthy();
    expect(screen.getByText('<')).toBeTruthy();
  });

  it('renders nothing when data is empty', () => {
    const { toJSON } = renderComponent({ ...defaultProps, data: [] });
    expect(toJSON()).toBeNull();
  });

  it('renders merged headers (parentHeading)', () => {
    const columnsWithParent = [
      { accessorKey: 'c1', header: 'C1', parentHeading: 'Parent' },
      { accessorKey: 'c2', header: 'C2', parentHeading: 'Parent' },
      { accessorKey: 'c3', header: 'C3' },
    ];
    renderComponent({ ...defaultProps, columns: columnsWithParent });
    // Use partial match because parent heading might have nested elements
    expect(screen.getByText('Parent', { exact: false })).toBeTruthy();
  });

  it('handles sorting arrows (FORMS.tsraInventory)', () => {
    renderComponent({ ...defaultProps, formName: FORMS.tsraInventory });
    expect(screen.getByTestId('sort-arrow-1')).toBeTruthy();
  });

  it('handles dropdown sorting selection - All Cases', () => {
    renderComponent({ ...defaultProps, formName: FORMS.tsraInventory });
    const dropdown = screen.getByTestId('sort-dropdown');

    // Case 1: AZ Alphabetical
    mockOnSelectData = { id: 'AZ Alphabetical', name: 'A-Z', object: { value: 'AZ Alphabetical' } };
    fireEvent.press(dropdown);
    expect(mockSortAlpha).toHaveBeenCalled();

    // Case 2: High to Low
    mockOnSelectData = { id: 'High to low in hand stock', name: 'H-L', object: { value: 'High to low in hand stock' } };
    fireEvent.press(dropdown);
    expect(mockSortMax).toHaveBeenCalled();

    // Case 3: Low to High
    mockOnSelectData = { id: 'Low to high in hand stock', name: 'L-H', object: { value: 'Low to high in hand stock' } };
    fireEvent.press(dropdown);
    expect(mockSortMaxAsc).toHaveBeenCalled();

    // Case 4: Default case
    mockOnSelectData = { id: 'Other', name: 'O', object: { value: 'Other' } };
    fireEvent.press(dropdown);
  });

  it('handles sorting arrows click', () => {
    renderComponent({ ...defaultProps, formName: FORMS.tsraInventory });
    // Columns are ['name', 'value']. Index 1 is 'value'.
    const arrow = screen.getByTestId('sort-arrow-1');
    fireEvent.press(arrow); // Asc
    fireEvent.press(arrow); // Desc
  });

  it('handles pagination button clicks', () => {
    // Page 0
    renderComponent(defaultProps);
    fireEvent.press(screen.getByTestId('pagination-next'));
    fireEvent.press(screen.getByTestId('pagination-last'));

    // Page 1 (to enable Prev/First)
    renderComponent({ ...defaultProps, pagination: { pageIndex: 1, pageSize: 5 } });
    fireEvent.press(screen.getByTestId('pagination-prev'));
    fireEvent.press(screen.getByTestId('pagination-first'));
  });

  it('covers isTsraTable text formatting', () => {
    const tsraProps = {
      ...defaultProps,
      isTsraTable: true,
      // Use two columns, the second one will be text
      columns: [
        { accessorKey: 'c1', header: 'Dropdown' },
        { accessorKey: 'c2', header: 'Three Word Header' },
      ],
    };
    renderComponent(tsraProps);
    // Regex for Three Word\nHeader (newline before 3rd word "Header")
    expect(screen.getByText(/Three Word[\s\n]+Header/)).toBeTruthy();
  });

  it('covers complex column width logic', () => {
    const manyColumns = [
      { accessorKey: 'c1', header: 'C1' },
      { accessorKey: 'c2', header: 'C2' },
      { accessorKey: 'c3', header: 'C3' },
      { accessorKey: 'c4', header: 'C4' },
      { accessorKey: 'c5', header: 'C5' },
      { accessorKey: 'c6', header: 'C6' },
      { accessorKey: 'c7', header: 'C7' },
      { accessorKey: 'c8', header: 'C8' },
    ];
    renderComponent({ ...defaultProps, columns: manyColumns });
    // This should trigger the complex width logic for visibleColumns >= 6
    expect(screen.getByText('C8')).toBeTruthy();
  });
});
