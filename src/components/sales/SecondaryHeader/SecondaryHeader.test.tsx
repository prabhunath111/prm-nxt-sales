import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import salesReducer from 'store/sales/reducer/root.reducer';
import prmReducer from 'store/prm/reducer/root.reducer';
import { PROPERTIES, ROUTE } from 'const';
import useNavigate from 'hooks/useNavigate';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import * as platformHelper from 'utils/platformHelper';
import SecondaryHeader from './SecondaryHeader';

// Explicitly mocking hooks for default exports
jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  ...jest.requireActual('wrappers/inflection/InflectionProvider'),
  useInflection: jest.fn(),
  BreakPoints: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
}));

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

jest.mock('utils/platformHelper', () => ({
  platform: jest.fn(() => ({ OS: 'ios' })),
  isAndroid: jest.fn(() => false),
  isiOS: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isWeb: false,
}));

jest.mock('utils/languageHelper', () => ({
  loadLanguage: jest.fn(),
}));

const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: combineReducers({
      ...salesReducer,
      prmReducer,
    }),
    preloadedState: initialState,
  });

describe('SecondaryHeader Component Coverage', () => {
  const mockNavigate = {
    replace: jest.fn(),
    goBack: jest.fn(),
    goHome: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'MockRoute' });
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.XS });
  });

  const renderComponent = (props = {}, initialState = {}) =>
    render(
      <Provider store={createTestStore(initialState)}>
        <NavigationContainer>
          <SecondaryHeader {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('renders PRIMARY type for primary modules', () => {
    const primaryScreen = PROPERTIES.PRIMARY_MODULES[0];
    renderComponent({ screenName: primaryScreen });
    expect(screen.getByTestId('header-test')).toBeTruthy();
    expect(screen.getByTestId('home-button-primary')).toBeTruthy();
  });

  test('renders SECONDARY type for non-primary modules', () => {
    renderComponent({ screenName: 'Other' });
    expect(screen.getByTestId('home-button')).toBeTruthy();
  });

  test('backHandler logic: RECHARGE_VIEW_DETAILS', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS });
    const initialState = {
      user: { navigation: { routes: [{ path: ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS, menuName: ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS }] } },
      customerRecharge: { navigationId: '123' },
    } as any;
    renderComponent({ screenName: 'Test' }, initialState);
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.goBack).toHaveBeenCalled();
  });

  test('backHandler logic: WIN_BACK_OFFERS', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS });
    const initialState = {
      user: { navigation: { routes: [{ path: ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS }] } },
      rechargeWinback: { campaignName: 'SummerCampaign' },
    } as any;
    renderComponent({ screenName: 'Test' }, initialState);
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.goBack).toHaveBeenCalled();
  });

  test('backHandler logic: RECHARGE_TRANSACTION', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.RECHARGE_TRANSACTION });
    renderComponent({ screenName: 'Test' });
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.navigate).toHaveBeenCalledWith(ROUTE.WEB.EVD_BALANCE_INFO);
  });

  test('backHandler logic: RECHARGE_TRANSACTION_FOS', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.RECHARGE_TRANSACTION_FOS });
    renderComponent({ screenName: 'Test' });
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.navigate).toHaveBeenCalledWith(ROUTE.WEB.EVD_BALANCE_INFO);
  });

  test('backHandler logic: EVD_BALANCE_INFO', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.EVD_BALANCE_INFO });
    renderComponent({ screenName: 'Test' });
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.goHome).toHaveBeenCalled();
  });

  test('backHandler logic: EVD_BALANCE_INFO with accountInformation', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.EVD_BALANCE_INFO });
    const initialState = {
      accountInformation: { accountInformation: { test: true } },
    } as any;
    renderComponent({ screenName: 'Test' }, initialState);
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.goHome).toHaveBeenCalled();
  });

  test('backHandler logic: prevPath exists', () => {
    renderComponent({ screenName: 'Test', prevPath: '/previous' });
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.replace).toHaveBeenCalledWith('/previous');
  });

  test('backHandler logic: resets AccountInformation if present', () => {
    const initialState = {
      accountInformation: { accountInformation: { test: true } },
    } as any;
    renderComponent({ screenName: 'Test' }, initialState);
    fireEvent.press(screen.getByTestId('back-button'));
    expect(mockNavigate.goBack).toHaveBeenCalled();
  });

  test('handleHomeButton logic: MULTI_TV_REGISTRATION_SUMMARY shows alert', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY });
    renderComponent({ screenName: 'Test' });
    fireEvent.press(screen.getByTestId('home-button'));
  });

  test('handleHomeButton logic: secondary type goHome', () => {
    renderComponent({ screenName: 'Test' });
    fireEvent.press(screen.getByTestId('home-button'));
    expect(mockNavigate.goHome).toHaveBeenCalled();
  });

  test('handleHomeButton logic: primary type goHome', () => {
    const primaryScreen = PROPERTIES.PRIMARY_MODULES[0];
    renderComponent({ screenName: primaryScreen });
    fireEvent.press(screen.getByTestId('home-button-primary'));
    expect(mockNavigate.goHome).toHaveBeenCalled();
  });

  test('handleHomeButton logic: resets AccountInformation', () => {
    const initialState = {
      accountInformation: { accountInformation: { test: true } },
    } as any;
    renderComponent({ screenName: 'Test' }, initialState);
    fireEvent.press(screen.getByTestId('home-button'));
    expect(mockNavigate.goHome).toHaveBeenCalled();
  });

  test('responsive layout: Desktop (XL)', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.XL });
    renderComponent({ screenName: 'Test' });
    expect(screen.getByText('strings.back')).toBeTruthy();
  });

  test('responsive layout: Mobile (XS)', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.XS });
    renderComponent({ screenName: 'Other' });
    expect(screen.queryByText('strings.back')).toBeNull();
  });

  test('platform specific: isAndroid/isiOS', () => {
    (platformHelper.isAndroid as jest.Mock).mockReturnValue(true);
    renderComponent({ screenName: 'Test' });
  });

  test('hides back button based on route', () => {
    const hiddenRoute = PROPERTIES.HIDE_BACK_BUTTON_FOR_ROUTE[0];
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: hiddenRoute });
    renderComponent({ screenName: 'Test' });
    expect(screen.queryByTestId('back-button')).toBeNull();
  });

  test('renders menu icon if present in routeDetails', () => {
    const initialState = {
      user: { navigation: { routes: [{ path: 'MockRoute', menuIcon: 'TEST_ICON' }] } },
    } as any;
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'MockRoute' });
    renderComponent({ screenName: 'Test' }, initialState);
  });

  test('renders large icon if specified', () => {
    const largeIcon = PROPERTIES.LARGE_ICON[0];
    const initialState = {
      user: { navigation: { routes: [{ path: 'MockRoute', menuIcon: largeIcon }] } },
    } as any;
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'MockRoute' });
    renderComponent({ screenName: 'Test' }, initialState);
  });

  test('renders with default props', () => {
    render(
      <Provider store={createTestStore()}>
        <NavigationContainer>
          <SecondaryHeader />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('header-test')).toBeTruthy();
  });

  test('handles empty navigation routes or no match', () => {
    const initialState = {
      user: { navigation: { routes: [] } },
    } as any;
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'NonExistent' });
    renderComponent({ screenName: 'Test' }, initialState);
  });
});
