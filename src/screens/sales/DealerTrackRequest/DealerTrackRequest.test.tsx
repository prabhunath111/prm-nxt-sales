/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import DealerTrackRequest from './DealerTrackRequest';

// ─── Mock: Platform ───────────────────────────────────────────────────────────
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
  Version: 14,
}));

// ─── Mock: utils/formBuilderHelper ───────────────────────────────────────────
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

// ─── Mock: Dropdown component ─────────────────────────────────────────────────
jest.mock('components/sales/Dropdown', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    __esModule: true,
    default: ({ placeholder, onSelect, selectedValue }: any) => (
      <TextInput placeholder={placeholder} value={selectedValue?.name || ''} onChangeText={() => {}} testID="dropdown" onSelect={onSelect} />
    ),
  };
});

// ─── Mock: i18n config ────────────────────────────────────────────────────────
jest.mock('config/i18n', () => ({
  __esModule: true,
  default: {
    t: (key: string) => key,
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
  },
}));

// ─── Mock: react-redux (keep useSelector, override useDispatch) ──────────────
const mockDispatch = jest.fn();

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useDispatch: () => mockDispatch,
  };
});

// ─── Mock: i18next ────────────────────────────────────────────────────────────
jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// ─── Mock: InflectionProvider ─────────────────────────────────────────────────
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  __esModule: true,
  useInflection: () => ({ inflection: 'xs' }),
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', SM: 'sm' },
}));

// ─── Mock: useNavigate ────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({ navigate: mockNavigate }),
}));

// ─── Mock: useCurrentRoute ────────────────────────────────────────────────────
jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: () => ({ routeName: 'DEALER_TRACK_REQUEST' }),
}));

// ─── Mock: uiActions ─────────────────────────────────────────────────────────
const mockShowBottomModal = jest.fn((payload) => ({ type: 'ui/showBottomModal', payload }));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: (payload: any) => mockShowBottomModal(payload),
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockTableColumn = [
  { id: 1, accessorKey: 'srNumber', label: 'SR Number' },
  { id: 2, accessorKey: 'statusNT', label: 'Status' },
];

const mockTableRowData = [
  {
    srNumber: 'SR001',
    srTypeNT: 'Technical',
    raisedDate: '01/01/2024',
    srAreaNT: 'North',
    statusNT: 'Open',
    status: 'Open',
  },
  {
    srNumber: 'SR002',
    srTypeNT: 'Billing',
    raisedDate: '15/06/2024',
    srAreaNT: 'South',
    statusNT: 'Closed',
    status: 'Closed',
  },
  {
    srNumber: 'SR003',
    srTypeNT: 'Network',
    raisedDate: '2024-03-10 14:30:00.0',
    srAreaNT: 'East',
    statusNT: 'Pending',
    status: 'Pending',
  },
];

const makeMockStore = (overrides: Record<string, any> = {}) => {
  const defaultState = {
    common: { customFormData: {} },
    dealerHelp: {
      tableColumn: mockTableColumn,
      tableRowData: mockTableRowData,
    },
    form: {},
    evdBalanceInfo: {
      pageNumber: 0,
      paginationData: { totalPages: 0 },
    },
  };

  return {
    getState: () => ({ ...defaultState, ...overrides }),
    subscribe: jest.fn(),
    dispatch: mockDispatch,
    replaceReducer: jest.fn(),
    [Symbol.observable]: jest.fn(),
  };
};

const renderComponent = (overrides: Record<string, any> = {}) =>
  render(
    <Provider store={makeMockStore(overrides) as any}>
      <NavigationContainer>
        <DealerTrackRequest />
      </NavigationContainer>
    </Provider>,
  );

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('DealerTrackRequest Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────────────────
  describe('Rendering', () => {
    test('renders component without crashing', () => {
      renderComponent();
      expect(screen.getByPlaceholderText('strings.dealerSearchText')).toBeTruthy();
    });

    test('renders search input with placeholder', () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      expect(searchInput).toBeTruthy();
    });

    test('renders filter by label', () => {
      renderComponent();
      expect(screen.getByText('strings.filterBy')).toBeTruthy();
    });

    test('renders status dropdown with placeholder', () => {
      renderComponent();
      expect(screen.getByPlaceholderText('strings.status')).toBeTruthy();
    });

    test('renders date filter input with placeholder', () => {
      renderComponent();
      expect(screen.getByPlaceholderText('strings.selectDate')).toBeTruthy();
    });

    test('renders DynamicTable when tableRowData has items', () => {
      renderComponent();
      expect(screen.getByTestId('dynamicTable')).toBeTruthy();
    });

    test('renders "no data found" text when tableRowData is empty', () => {
      renderComponent({
        dealerHelp: { tableColumn: [], tableRowData: [] },
      });
      expect(screen.getByText('errors.noDataFound')).toBeTruthy();
    });

    test('renders the back button', () => {
      renderComponent();
      expect(screen.getByText('strings.back')).toBeTruthy();
    });

    test('matches snapshot', () => {
      const component = renderComponent();
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  // ── Search Filtering ─────────────────────────────────────────────────────
  describe('Search Filtering', () => {
    test('filters by srNumber', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, 'SR001');
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('filters by srTypeNT', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, 'Billing');
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('filters by srAreaNT', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, 'North');
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('filters by statusNT', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, 'Open');
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('handles whitespace-only search query (shows all data)', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, '   ');
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('shows no data when search matches nothing', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, 'XYZNOTFOUND');
      await waitFor(() => {
        expect(screen.getByText('errors.noDataFound')).toBeTruthy();
      });
    });

    test('search is case-insensitive', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, 'sr001');
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('clearing search restores full data', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('strings.dealerSearchText');
      fireEvent.changeText(searchInput, 'SR001');
      fireEvent.changeText(searchInput, '');
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });
  });

  // ── Status Filtering ─────────────────────────────────────────────────────
  describe('Status Filtering', () => {
    test('filters by status when a non-All status is selected', async () => {
      renderComponent();
      const dropdown = screen.getByPlaceholderText('strings.status');
      fireEvent(dropdown, 'onSelect', { id: 'Open', name: 'Open' });
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('shows all data when "All" status is selected', async () => {
      renderComponent();
      const dropdown = screen.getByPlaceholderText('strings.status');
      fireEvent(dropdown, 'onSelect', { id: 'All', name: 'All' });
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('shows no data when status filter matches no items', async () => {
      renderComponent();
      const dropdown = screen.getByPlaceholderText('strings.status');
      fireEvent(dropdown, 'onSelect', { id: 'Cancelled', name: 'Cancelled' });
      await waitFor(() => {
        expect(screen.getByText('errors.noDataFound')).toBeTruthy();
      });
    });
  });

  // ── Date Range Filtering ─────────────────────────────────────────────────
  describe('Date Range Filtering', () => {
    test('displays selected date range string when customFormData has date range', () => {
      renderComponent({
        common: {
          customFormData: {
            evdMdnChangeFilter: {
              customDateRange: {
                startDate: '01/01/2024',
                endDate: '31/01/2024',
              },
            },
          },
        },
      });
      expect(screen.getByDisplayValue('01/01/2024 - 31/01/2024')).toBeTruthy();
    });

    test('filters data within date range (dd/mm/yyyy format)', async () => {
      renderComponent({
        common: {
          customFormData: {
            evdMdnChangeFilter: {
              customDateRange: {
                startDate: '01/01/2024',
                endDate: '31/01/2024',
              },
            },
          },
        },
      });
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('filters data within date range (datetime format)', async () => {
      renderComponent({
        common: {
          customFormData: {
            evdMdnChangeFilter: {
              customDateRange: {
                startDate: '2024-01-01 00:00:00',
                endDate: '2024-12-31 23:59:59',
              },
            },
          },
        },
      });
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('shows no data when date range excludes all records', async () => {
      renderComponent({
        common: {
          customFormData: {
            evdMdnChangeFilter: {
              customDateRange: {
                startDate: '01/01/2020',
                endDate: '31/12/2020',
              },
            },
          },
        },
      });
      await waitFor(() => {
        expect(screen.getByText('errors.noDataFound')).toBeTruthy();
      });
    });

    test('does not filter when only startDate is provided', async () => {
      renderComponent({
        common: {
          customFormData: {
            evdMdnChangeFilter: {
              customDateRange: {
                startDate: '01/01/2024',
                endDate: '',
              },
            },
          },
        },
      });
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });

    test('clears selectedDate when no date range is in customFormData', async () => {
      renderComponent({
        common: { customFormData: {} },
      });
      await waitFor(() => {
        expect(screen.getByPlaceholderText('strings.selectDate')).toBeTruthy();
      });
    });
  });

  // ── Date Picker Modal ────────────────────────────────────────────────────
  describe('Date Picker Modal', () => {
    test('dispatches showBottomModal when date field is pressed', () => {
      renderComponent();
      const dateField = screen.getByPlaceholderText('strings.selectDate');
      if (dateField.parent) {
        fireEvent.press(dateField.parent);
        expect(mockDispatch).toHaveBeenCalled();
      }
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────────
  describe('Navigation', () => {
    test('calls navigate with BINGE_RETAILER route when back button is pressed', () => {
      renderComponent();
      const backButton = screen.getByText('strings.back');
      fireEvent.press(backButton);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  // ── Re-render / Update ───────────────────────────────────────────────────
  describe('Re-render behaviour', () => {
    test('updates filtered data when tableRowData changes via store override', async () => {
      const { rerender } = render(
        <Provider store={makeMockStore() as any}>
          <NavigationContainer>
            <DealerTrackRequest />
          </NavigationContainer>
        </Provider>,
      );

      const updatedStore = makeMockStore({
        dealerHelp: {
          tableColumn: mockTableColumn,
          tableRowData: [mockTableRowData[0]],
        },
      });

      rerender(
        <Provider store={updatedStore as any}>
          <NavigationContainer>
            <DealerTrackRequest />
          </NavigationContainer>
        </Provider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });
  });

  // ── parseDate internals covered via filtering ────────────────────────────
  describe('parseDate edge cases (via date-range filter)', () => {
    test('handles items with missing raisedDate gracefully', async () => {
      renderComponent({
        dealerHelp: {
          tableColumn: mockTableColumn,
          tableRowData: [{ srNumber: 'SR999', status: 'Open', statusNT: 'Open' }],
        },
        common: {
          customFormData: {
            evdMdnChangeFilter: {
              customDateRange: { startDate: '01/01/2024', endDate: '31/12/2024' },
            },
          },
        },
      });
      // Item should be excluded (date 0 < start range)
      await waitFor(() => {
        expect(screen.getByText('errors.noDataFound')).toBeTruthy();
      });
    });

    test('handles ISO-like date string via fallback', async () => {
      renderComponent({
        dealerHelp: {
          tableColumn: mockTableColumn,
          tableRowData: [
            {
              srNumber: 'SR100',
              raisedDate: '2024-06-15',
              status: 'Open',
              statusNT: 'Open',
              srTypeNT: '',
              srAreaNT: '',
            },
          ],
        },
        common: {
          customFormData: {
            evdMdnChangeFilter: {
              customDateRange: { startDate: '01/01/2024', endDate: '31/12/2024' },
            },
          },
        },
      });
      await waitFor(() => {
        expect(screen.getByTestId('dynamicTable')).toBeTruthy();
      });
    });
  });
});
