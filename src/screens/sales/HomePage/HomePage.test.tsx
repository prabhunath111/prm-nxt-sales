/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { Linking } from 'react-native';

import HomePage from './HomePage';

// ==================== MOCKS ====================

jest.mock('config/i18n', () => ({
  t: (key: string) => key,
  changeLanguage: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getModel: jest.fn(() => 'mock-model'),
  getSystemVersion: jest.fn(() => 'mock-system-version'),
  getVersion: jest.fn(() => 'mock-app-version'),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
  getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  isEmulatorSync: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
}));

jest.mock('react-native-moengage', () => ({
  setUserUniqueID: jest.fn(),
  setUserAttribute: jest.fn(),
}));

jest.mock('react-native-push-notification', () => ({
  createChannel: jest.fn((_options, callback) => callback(true)),
}));

jest.mock('utils/platformHelper', () => ({
  isAndroid: jest.fn(() => true),
  isTablet: jest.fn(() => false),
  isWeb: false,
}));

jest.mock('hooks/useNavigate', () => {
  const navigate = jest.fn();
  return () => ({ navigate });
});

jest.mock('hooks/usePlatformFocusEffect', () => ({
  usePlatformFocusEffect: (callback: any) => callback(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn((payload) => ({ type: 'SHOW_BOTTOM_MODAL', payload })),
  toggleDrawer: jest.fn((payload) => ({ type: 'TOGGLE_DRAWER', payload })),
}));

jest.mock('store/sales/actions/notifications', () => ({
  getCarouselImage: jest.fn(() => ({ type: 'GET_CAROUSEL_IMAGE' })),
}));

jest.mock('store/sales/actions/ui/ui.action', () => ({
  handleLangSlectorModal: jest.fn((val) => ({ type: 'HANDLE_LANG_SELECTOR', val })),
}));

jest.mock('const/strings', () => {
  const actual = jest.requireActual('const/strings');
  return {
    ...actual,
    HOME_ROUTE: ['test-path', 'no-icon-path', null],
    HOME_ICON: {
      'test-path': 'TEST_ICON',
    },
    FORMS: {
      ...actual.FORMS,
      demoBoxDetail: 'demoBoxDetail',
    },
    MOENGAGE: {
      ...actual.MOENGAGE,
      DEEPLINK_URL: 'tpsales://',
    },
    ROUTE: {
      ...actual.ROUTE,
      WEB: {
        ...actual.ROUTE.WEB,
        OTHER_CUSTOMER_ACTIONS: 'customerActions',
        REGISTER_NEW_CUSTOMER: 'registerNewCustomer',
        PACKAGE_INFORMATION: 'packageInformation',
      },
    },
  };
});

jest.mock('components/sales', () => {
  const { View: V, TouchableOpacity: TO, Text: T } = require('react-native');
  return {
    ActionTileCard: ({ label, onPress }: any) => (
      <TO testID={`action-tile-${label}`} onPress={onPress}>
        <T>{label}</T>
      </TO>
    ),
    Gradient: ({ children }: any) => <V testID="gradient">{children}</V>,
    HeaderFilters: ({ closeModal }: any) => (
      <TO testID="header-filters" onPress={closeModal}>
        <T>HeaderFilters</T>
      </TO>
    ),
  };
});

jest.mock('components/sales/DashboardIcon', () => {
  const { View: V, Text: T } = require('react-native');
  return ({ label, value }: any) => (
    <V testID={`dashboard-icon-${value}`}>
      <T>{label}</T>
    </V>
  );
});

jest.mock('components/sales/Carousel', () => {
  const { View: V } = require('react-native');
  return () => <V testID="carousel" />;
});

jest.mock('navigation/drawer/AppDrawer', () => {
  const { TouchableOpacity: TO, Text: T } = require('react-native');
  return ({ onDrawerStateChange }: any) => (
    <TO testID="app-drawer" onPress={onDrawerStateChange}>
      <T>AppDrawer</T>
    </TO>
  );
});

const createTestStore = (initialState: any = {}) =>
  configureStore({
    reducer: {
      user: (
        state = initialState.user ?? {
          navigation: { dashboard: [] },
          info: { userId: '123', internalRole: 'Dealer' },
        },
      ) => state,
      ui: (state = initialState.ui ?? { isDrawerOpen: false }) => state,
      homePage: (state = initialState.homePage ?? { bannerImages: { getBanner: [] } }) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('HomePage - 100% Coverage', () => {
  let store: ReturnType<typeof createTestStore>;

  const renderComponent = (overrides = {}) => {
    store = createTestStore(overrides);
    return render(
      <Provider store={store}>
        <NavigationContainer>
          <HomePage />
        </NavigationContainer>
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders homepage container', () => {
    renderComponent();
    expect(screen.getByTestId('home-scroll-view')).toBeTruthy();
  });

  test('renders AppDrawer when isDrawerOpen is true', () => {
    renderComponent({ ui: { isDrawerOpen: true } });
    expect(screen.getByTestId('app-drawer')).toBeTruthy();
  });

  test('useEffect: initial dispatches and MoEngage attributes', () => {
    const ReactMoE = require('react-native-moengage');
    const PushNotification = require('react-native-push-notification');
    renderComponent();
    expect(ReactMoE.setUserUniqueID).toHaveBeenCalledWith('123');
    expect(PushNotification.createChannel).toHaveBeenCalled();
  });

  test('useEffect: avoids PushNotification on non-Android', () => {
    const { isAndroid } = require('utils/platformHelper');
    const PushNotification = require('react-native-push-notification');
    isAndroid.mockReturnValueOnce(false);
    renderComponent();
    expect(PushNotification.createChannel).not.toHaveBeenCalled();
  });

  test('useEffect: processes banners with deepLink formats and empty cases', () => {
    renderComponent({
      homePage: { bannerImages: null },
    });
    renderComponent({
      homePage: {
        bannerImages: {
          getBanner: [{ image_url: 'img1', deeplink: 'https://link.com' }, { image_url: 'img2', deeplink: 'test-path' }, { image_url: 'img3' }],
        },
      },
    });
    expect(screen.getByTestId('carousel')).toBeTruthy();
  });

  test('Linking: handles initial deep link URL', async () => {
    const initialUrl = 'tpsales://test-path';
    jest.spyOn(Linking, 'getInitialURL').mockResolvedValueOnce(initialUrl);
    renderComponent();
    const { navigate } = require('hooks/useNavigate')();
    await act(async () => {});
    expect(navigate).toHaveBeenCalled();
  });

  test('Linking: handleRouteAction with demoBoxDetail form', async () => {
    const initialUrl = 'tpsales://demoBoxDetail';
    jest.spyOn(Linking, 'getInitialURL').mockResolvedValueOnce(initialUrl);
    const actions = require('store/sales/actions/ui');
    renderComponent();
    await act(async () => {});
    expect(actions.showBottomModal).toHaveBeenCalled();
  });

  test('Linking: handleDeepLink subscription and unmount', () => {
    const addListenerSpy = jest.spyOn(Linking, 'addEventListener');
    const removeSpy = jest.fn();
    addListenerSpy.mockReturnValueOnce({ remove: removeSpy } as any);
    const { unmount } = renderComponent();
    expect(addListenerSpy).toHaveBeenCalledWith('url', expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalled();
  });

  test('Linking: triggers handleDeepLink from event', () => {
    let handler: any;
    jest.spyOn(Linking, 'addEventListener').mockImplementation((_event: string, callback: any) => {
      handler = callback;
      return { remove: jest.fn() } as any;
    });
    renderComponent();
    const { navigate } = require('hooks/useNavigate')();
    act(() => {
      handler({ url: 'tpsales://test-path' });
    });
    expect(navigate).toHaveBeenCalled();
  });

  test('handleToggleDrawer: triggers toggleDrawer action', () => {
    const actions = require('store/sales/actions/ui');
    renderComponent({ ui: { isDrawerOpen: true } });
    const drawer = screen.getByTestId('app-drawer');
    fireEvent.press(drawer);
    expect(actions.toggleDrawer).toHaveBeenCalled();
  });

  test('navigateTo: triggers navigate from ActionTileCard', () => {
    const { navigate } = require('hooks/useNavigate')();
    renderComponent();

    const customerActions = screen.getByTestId('action-tile-homeScreen.CustomerActions');
    fireEvent.press(customerActions);
    expect(navigate).toHaveBeenCalledWith('customerActions');

    const regCustomer = screen.getByTestId('action-tile-homeScreen.RegisterNewCustomer');
    fireEvent.press(regCustomer);
    expect(navigate).toHaveBeenCalledWith('registerNewCustomer');

    const viewPkg = screen.getByTestId('action-tile-homeScreen.ViewPackageInformation');
    fireEvent.press(viewPkg);
    expect(navigate).toHaveBeenCalledWith('packageInformation');
  });

  test('HeaderFilters: triggers closeModal on HeaderFilters press', () => {
    const { handleLangSlectorModal } = require('store/sales/actions/ui/ui.action');
    renderComponent();
    const filters = screen.getByTestId('header-filters');
    fireEvent.press(filters);
    expect(handleLangSlectorModal).toHaveBeenCalledWith(false);
  });

  test('Menu Logic: tests branch coverage for icons and paths', () => {
    renderComponent({
      user: {
        info: { userId: '123' },
        navigation: {
          dashboard: [
            { menuTitle: 'WithIcon', path: 'test-path', isModel: 0, menuId: 1 },
            { menuTitle: 'NoIcon', path: 'no-icon-path', isModel: 0, menuId: 2, menuIcon: 'fallbackIcon' },
            { menuTitle: 'NoPath', path: null, isModel: 0, menuId: 3, menuIcon: 'icon' },
          ],
        },
      },
    });
    expect(screen.getByTestId('dashboard-icon-test-path')).toBeTruthy();
    expect(screen.getByTestId('dashboard-icon-no-icon-path')).toBeTruthy();
    expect(screen.getByTestId('dashboard-icon-')).toBeTruthy();
  });
});
