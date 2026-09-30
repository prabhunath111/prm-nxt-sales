/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from 'store';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE } from 'const';
import SimpleDatePicker from './SimpleDatePicker';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const mockRouteName = { routeName: '' };
jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: () => mockRouteName,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('store/sales/reducer/storeDashboard', () => ({
  sliceActions: {
    setDateForStoreDashboard: jest.fn((date) => ({ type: 'SET_DATE', payload: date })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
  showBottomModal: jest.fn((payload) => ({ type: 'SHOW_BOTTOM_MODAL', payload })),
}));

// Capture onDateSelected so tests can invoke it directly
let capturedOnDateSelected: ((day: { dateString: string }) => void) | null = null;

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    CustomCalendar: ({ onDateSelected, maxDate, minDate, defaultDate, isDateRangePicker }: any) => {
      capturedOnDateSelected = onDateSelected;
      return (
        <View testID="CustomCalendar">
          <Text testID="cal-maxDate">{maxDate}</Text>
          <Text testID="cal-minDate">{minDate ?? ''}</Text>
          <Text testID="cal-defaultDate">{defaultDate}</Text>
          <Text testID="cal-isDateRangePicker">{String(isDateRangePicker)}</Text>
        </View>
      );
    },
    Button: ({ label, onPress }: any) => (
      <TouchableOpacity testID="ConfirmButton" onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Text: ({ label, id, color }: any) => (
      <Text testID={id} style={{ color }}>
        {label}
      </Text>
    ),
  };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const { useSelector } = require('react-redux');
const uiActions = require('store/sales/actions/ui');
const { sliceActions } = require('store/sales/reducer/storeDashboard');

const renderComponent = (props = {}) =>
  render(
    <Provider store={store}>
      <NavigationContainer>
        <View>
          <SimpleDatePicker {...props} />
        </View>
      </NavigationContainer>
    </Provider>,
  );

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SimpleDatePicker', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteName.routeName = '';
    useSelector.mockImplementation((selector: any) => selector({ dealerHelp: { dashboardBingeRetailerLatest: null } }));
  });

  // ── Render ────────────────────────────────────────────────────────────────

  test('renders SimpleDatePicker with testID', () => {
    renderComponent();
    expect(screen.getByTestId('SimpleDatePicker')).toBeTruthy();
  });

  test('snapshot', () => {
    const { toJSON } = renderComponent();
    expect(toJSON()).toMatchSnapshot();
  });

  // ── Calendar props ────────────────────────────────────────────────────────

  test('passes today as maxDate and defaultDate to CustomCalendar', () => {
    renderComponent();
    expect(screen.getByTestId('cal-maxDate').props.children).toBe('2024-06-01');
    expect(screen.getByTestId('cal-defaultDate').props.children).toBe('2024-06-01');
  });

  test('passes isDateRangePicker=false to CustomCalendar', () => {
    renderComponent();
    expect(screen.getByTestId('cal-isDateRangePicker').props.children).toBe('false');
  });

  test('passes undefined minDate when route is not BINGE_RETAILER_DASHBOARD', () => {
    mockRouteName.routeName = ROUTE.WEB.PURCHASE_ORDER_SETTLEMENTS;
    renderComponent();
    expect(screen.getByTestId('cal-minDate').props.children).toBe('');
  });

  // ── Error prop ────────────────────────────────────────────────────────────

  test('does not render error Text when error prop is empty (default)', () => {
    renderComponent();
    expect(screen.queryByTestId('error')).toBeNull();
  });

  test('renders error Text when error prop is provided', () => {
    renderComponent({ error: 'Date is required', id: 'field-' });
    expect(screen.getByTestId('field-error')).toBeTruthy();
    expect(screen.getByTestId('field-error').props.children).toBe('Date is required');
  });

  test('renders error Text without id prefix when id is undefined', () => {
    renderComponent({ error: 'Some error' });
    // id is undefined → testID becomes "undefinederror"
    expect(screen.getByTestId('undefinederror')).toBeTruthy();
  });

  // ── handleDateSelected ────────────────────────────────────────────────────

  test('handleDateSelected updates tempDate used on confirm', () => {
    renderComponent();
    capturedOnDateSelected!({ dateString: '2024-05-20' });
    fireEvent.press(screen.getByTestId('ConfirmButton'));
    expect(sliceActions.setDateForStoreDashboard).toHaveBeenCalledWith('2024-05-20');
  });

  // ── handleConfirmDate — default route ─────────────────────────────────────

  test('dispatches setDateForStoreDashboard and showBottomModal on confirm (default route)', () => {
    mockRouteName.routeName = 'SOME_OTHER_ROUTE';
    renderComponent();
    capturedOnDateSelected!({ dateString: '2024-05-15' });
    fireEvent.press(screen.getByTestId('ConfirmButton'));

    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setDateForStoreDashboard('2024-05-15'));
    expect(uiActions.showBottomModal).toHaveBeenCalled();
    expect(uiActions.hideBottomModal).not.toHaveBeenCalled();
  });

  test('showBottomModal called with correct payload shape', () => {
    mockRouteName.routeName = 'SOME_OTHER_ROUTE';
    renderComponent();
    fireEvent.press(screen.getByTestId('ConfirmButton'));

    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isModalVisible: true,
        isCenterModal: true,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: { goToHome: true },
      }),
    );
  });

  // ── handleConfirmDate — PURCHASE_ORDER_SETTLEMENTS ────────────────────────

  test('dispatches hideBottomModal and NOT showBottomModal for PURCHASE_ORDER_SETTLEMENTS', () => {
    mockRouteName.routeName = ROUTE.WEB.PURCHASE_ORDER_SETTLEMENTS;
    renderComponent();
    capturedOnDateSelected!({ dateString: '2024-05-10' });
    fireEvent.press(screen.getByTestId('ConfirmButton'));

    expect(mockDispatch).toHaveBeenCalledWith(sliceActions.setDateForStoreDashboard('2024-05-10'));
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.showBottomModal).not.toHaveBeenCalled();
  });

  // ── handleConfirmDate — BINGE_RETAILER_DASHBOARD ──────────────────────────

  test('dispatches hideBottomModal and NOT showBottomModal for BINGE_RETAILER_DASHBOARD', () => {
    mockRouteName.routeName = ROUTE.WEB.BINGE_RETAILER_DASHBOARD;
    useSelector.mockImplementation((selector: any) =>
      selector({
        dealerHelp: {
          dashboardBingeRetailerLatest: { enableMonthDashboardBR: '10' },
        },
      }),
    );
    renderComponent();
    capturedOnDateSelected!({ dateString: '2024-05-25' });
    fireEvent.press(screen.getByTestId('ConfirmButton'));

    expect(uiActions.hideBottomModal).toHaveBeenCalled();
    expect(uiActions.showBottomModal).not.toHaveBeenCalled();
  });

  // ── minDate useEffect — BINGE_RETAILER_DASHBOARD ──────────────────────────

  test('computes minDate correctly when enableMonthDashboardBR is set', () => {
    mockRouteName.routeName = ROUTE.WEB.BINGE_RETAILER_DASHBOARD;
    // today is 2024-06-01, enableDays = 10 → minDate = 2024-05-22
    useSelector.mockImplementation((selector: any) =>
      selector({
        dealerHelp: {
          dashboardBingeRetailerLatest: { enableMonthDashboardBR: '10' },
        },
      }),
    );
    renderComponent();
    expect(screen.getByTestId('cal-minDate').props.children).toBe('2024-05-22');
  });

  test('computes minDate as today when enableMonthDashboardBR is 0', () => {
    mockRouteName.routeName = ROUTE.WEB.BINGE_RETAILER_DASHBOARD;
    useSelector.mockImplementation((selector: any) =>
      selector({
        dealerHelp: {
          dashboardBingeRetailerLatest: { enableMonthDashboardBR: '0' },
        },
      }),
    );
    renderComponent();
    expect(screen.getByTestId('cal-minDate').props.children).toBe('2024-06-01');
  });

  test('falls back to 0 days when enableMonthDashboardBR is missing', () => {
    mockRouteName.routeName = ROUTE.WEB.BINGE_RETAILER_DASHBOARD;
    useSelector.mockImplementation((selector: any) =>
      selector({
        dealerHelp: {
          dashboardBingeRetailerLatest: {}, // no enableMonthDashboardBR key
        },
      }),
    );
    renderComponent();
    // 0 days back → minDate === today
    expect(screen.getByTestId('cal-minDate').props.children).toBe('2024-06-01');
  });

  test('does NOT set minDate when route is not BINGE_RETAILER_DASHBOARD', () => {
    mockRouteName.routeName = ROUTE.WEB.PURCHASE_ORDER_SETTLEMENTS;
    useSelector.mockImplementation((selector: any) =>
      selector({
        dealerHelp: {
          dashboardBingeRetailerLatest: { enableMonthDashboardBR: '10' },
        },
      }),
    );
    renderComponent();
    expect(screen.getByTestId('cal-minDate').props.children).toBe('');
  });
});
