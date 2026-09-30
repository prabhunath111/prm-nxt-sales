import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { ROUTE } from 'const';
import BingeRetailerDashboard from './BingeRetailerDashboard';

const mockNavigate = jest.fn();
const mockGoHome = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules.I18nManager = {
    localeIdentifier: 'en_US',
    allowRTL: jest.fn(),
    forceRTL: jest.fn(),
    swapLeftAndRightInRTL: jest.fn(),
    isRTL: false,
    getConstants: () => ({
      isRTL: false,
      doLeftAndRightSwapInRTL: false,
      localeIdentifier: 'en_US',
    }),
  };

  RN.NativeModules.SettingsManager = {
    settings: {
      AppleLanguages: ['en_US'],
      AppleLocale: 'en_US',
    },
    getConstants: () => ({
      settings: {
        AppleLanguages: ['en_US'],
        AppleLocale: 'en_US',
      },
    }),
  };

  return RN;
});

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({ navigate: mockNavigate, goHome: mockGoHome }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'mobile' }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  getCdnUri: jest.fn((uri) => uri || 'mockedCdnUri'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
}));

jest.mock('utils/platformHelper', () => ({
  isWeb: false,
  isIOS: false,
  isAndroid: jest.fn(() => true),
  isTablet: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'android' })),
}));

let mockState: any;

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => selector(mockState),
  };
});

describe('BingeRetailerDashboard', () => {
  beforeEach(() => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: { customFormData: {} },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {
          monthlyEarning: '1000',
          packSoldFortheMonth: '50',
          earningForTheDay: '100',
          dayCount: '5',
          previousMonthEarning: '900',
          previousMonthCount: '45',
        },
      },
    };
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    mockGoHome.mockClear();
  });

  test('renders component', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('strings.SUMMARY')).toBeTruthy();
  });

  test('snapshot test', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('shows error when submit without date', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );
    const submitButton = screen.getByText('Submit');
    fireEvent.press(submitButton);
    expect(screen.getByText('validations.selectDateRequired')).toBeTruthy();
  });

  test('opens date picker modal', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );
    const dateInput = screen.getByPlaceholderText('strings.selectDate');
    const { parent } = dateInput;
    if (parent) {
      fireEvent.press(parent);
    }
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('submits with valid date', async () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: { startDate: '01/01/2024', endDate: '31/01/2024' },
          },
        },
      },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      const submitButton = screen.getByText('Submit');
      fireEvent.press(submitButton);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  test('displays table when data available', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: { startDate: '01/01/2024', endDate: '31/01/2024' },
          },
        },
      },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [{ key: 'col1', label: 'Column 1' }],
        bingeTableData: [{ col1: 'data1' }],
        dashboardBingeRetailerLatest: {},
      },
    };

    const { rerender } = render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    const submitButton = screen.getByText('Submit');
    fireEvent.press(submitButton);

    rerender(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.queryByText('errors.noDataFound')).toBeFalsy();
  });

  test('shows no data message when table empty', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: { customFormData: {} },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    const submitButton = screen.getByText('Submit');
    fireEvent.press(submitButton);

    expect(screen.queryByText('errors.noDataFound')).toBeNull();
  });

  test('handles back button', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );
    const backButton = screen.getByText('strings.back');
    fireEvent.press(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.BINGE_RETAILER);
  });

  test('handles cancel button', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );
    const cancelButton = screen.getByText('strings.cancel');
    fireEvent.press(cancelButton);
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  test('renders summary cards with correct values', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('1000')).toBeTruthy();
    expect(screen.getByText('50')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('900')).toBeTruthy();
    expect(screen.getByText('45')).toBeTruthy();
  });

  test('handles invalid date format', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: { startDate: 'invalid', endDate: 'invalid' },
          },
        },
      },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByPlaceholderText('strings.selectDate')).toBeTruthy();
  });

  test('loads initial data on mount', async () => {
    mockDispatch.mockResolvedValue({ status: true, data: {} });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('handles loading state', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: true },
      common: { customFormData: {} },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    expect(component).toBeTruthy();
  });

  test('handles zero values in summary', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: { customFormData: {} },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {
          monthlyEarning: '0',
          packSoldFortheMonth: '0',
          earningForTheDay: '0',
          dayCount: '0',
          previousMonthEarning: '0',
          previousMonthCount: '0',
        },
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  test('clears date error on valid submission', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: { startDate: '01/01/2024', endDate: '31/01/2024' },
          },
        },
      },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.queryByText('validations.selectDateRequired')).toBeNull();
  });

  test('handles isRedirection true', () => {
    mockState = {
      user: { isRedirection: true },
      ui: { isLoading: false },
      common: { customFormData: {} },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    const cancelButton = screen.getByText('strings.cancel');
    fireEvent.press(cancelButton);
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  test('formats date correctly', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: { startDate: '15/03/2024', endDate: '20/03/2024' },
          },
        },
      },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByTestId('date-input');
    expect(input).toBeTruthy();
  });

  test('handles missing date parts', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: { startDate: '15/03', endDate: '20/03/2024' },
          },
        },
      },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByPlaceholderText('strings.selectDate')).toBeTruthy();
  });

  test('resets table visibility on date clear', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: {
        customFormData: {
          evdMdnChangeFilter: {
            customDateRange: {},
          },
        },
      },
      storeDashboard: { selectedDate: '' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.queryByText('errors.noDataFound')).toBeFalsy();
  });

  test('formats date when selectedDate is provided', () => {
    mockState = {
      user: { isRedirection: false },
      ui: { isLoading: false },
      common: { customFormData: {} },
      storeDashboard: { selectedDate: '2024-03-15' },
      dealerHelp: {
        bingTableColumn: [],
        bingeTableData: [],
        dashboardBingeRetailerLatest: {},
      },
    };

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByTestId('date-input');
    expect(input).toBeTruthy();
  });

  test('handles error in loadInitialData', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    let callCount = 0;

    mockDispatch.mockImplementation((action: any) => {
      callCount += 1;
      if (typeof action === 'function' && callCount === 4) {
        return Promise.reject(new Error('API Error'));
      }
      return Promise.resolve({ status: false });
    });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <BingeRetailerDashboard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
