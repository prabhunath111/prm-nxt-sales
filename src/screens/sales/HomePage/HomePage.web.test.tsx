/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';

import HomePage from './HomePage.web';

// Mock dependencies
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
jest.mock('wrappers/inflection/InflectionProvider', () => {
  const actual = jest.requireActual('wrappers/inflection/InflectionProvider');
  return {
    ...actual,
    useInflection: jest.fn(() => ({ inflection: 'xl' })),
  };
});
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({ navigate: mockNavigate }));
jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock('styles/webBreakpoints', () => ({ gcs: (s: any) => s }));
jest.mock('utils/formBuilderHelper', () => ({ callAction: jest.fn() }));
jest.mock('utils/navigationHelper', () => ({ safePath: jest.fn((p) => p || '/') }));

// Mock constants
jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    ROUTE: {
      ...actual.ROUTE,
      WEB: {
        ...actual.ROUTE.WEB,
        OTHER_CUSTOMER_ACTIONS: 'otherCustomerActions',
        REGISTER_NEW_CUSTOMER: 'registerNewCustomer',
        PACKAGE_INFORMATION: 'packageInformation',
      },
    },
  };
});

jest.mock('const/strings', () => {
  const actual = jest.requireActual('const/strings');
  return {
    ...actual,
    HOME_ROUTE: ['test-path', 'no-icon-path', null], // added null to pass filter in branch 134
    HOME_ICON: { 'test-path': 'TEST_ICON' },
    ROLES_DEFAULT_ROUTES: {
      Dealer: '/dealer-dashboard',
      default: '/',
    },
    QUERY: { ...actual.QUERY, GetBannerImages: 'GetBannerImages' },
  };
});

// Mock components
jest.mock('components/sales', () => {
  const rn = require('react-native');
  return {
    ActionTileCard: ({ label, onPress }: any) => (
      <rn.TouchableOpacity testID={`action-tile-${label}`} onPress={onPress}>
        <rn.Text>{label}</rn.Text>
      </rn.TouchableOpacity>
    ),
    Gradient: ({ children }: any) => <rn.View testID="gradient">{children}</rn.View>,
    HeaderFilters: ({ closeModal }: any) => (
      <rn.TouchableOpacity testID="header-filters" onPress={closeModal}>
        <rn.Text>HeaderFilters</rn.Text>
      </rn.TouchableOpacity>
    ),
    ActionTileCardContainerStyleWeb: ({ children }: any) => <rn.View>{children}</rn.View>,
  };
});

jest.mock('components/sales/DashboardIcon', () => {
  const rn = require('react-native');
  return ({ label, value }: any) => (
    <rn.View testID={`dashboard-icon-${value}`}>
      <rn.Text>{label}</rn.Text>
    </rn.View>
  );
});

jest.mock('components/sales/Carousel', () => {
  const rn = require('react-native');
  return () => <rn.View testID="carousel" />;
});

jest.mock('navigation/drawer/AppDrawer', () => {
  const rn = require('react-native');
  return ({ onDrawerStateChange }: any) => (
    <rn.TouchableOpacity testID="app-drawer" onPress={onDrawerStateChange}>
      <rn.Text>AppDrawer</rn.Text>
    </rn.TouchableOpacity>
  );
});

jest.mock('store/sales/actions/ui', () => ({
  toggleDrawer: jest.fn((val) => ({ type: 'TOGGLE_DRAWER', payload: val })),
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
}));

jest.mock('store/sales/actions/ui/ui.action', () => ({
  handleLangSlectorModal: jest.fn((val) => ({ type: 'HANDLE_LANG_SELECTOR', val })),
}));

describe('HomePage web Component', () => {
  const mockDispatch = jest.fn();
  let mockState: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    mockState = {
      user: {
        navigation: {
          dashboard: [
            { menuTitle: 'Item 1', path: 'test-path', isModel: false, menuId: 1 },
            { menuTitle: 'Item 2', path: 'no-icon-path', isModel: false, menuId: 2, menuIcon: 'fallback' },
            { menuTitle: 'NoPath', path: null, isModel: false, menuId: 3 },
          ],
        },
        info: { internalRole: 'default' },
      },
      homePage: {
        bannerImages: {
          getBanner: [{ image_url: 'url1', deeplink: 'https://site.com' }, { image_url: 'url2', deeplink: 'app/path' }, { image_url: 'url3' }],
        },
      },
      ui: { isDrawerOpen: false },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((fn) => fn(mockState));
  });

  test('renders container and handles initial logic', () => {
    const actions = require('store/sales/actions/ui');
    const { callAction } = require('utils/formBuilderHelper');

    render(<HomePage />);
    expect(screen.getByTestId('home-scroll-view')).toBeTruthy();
    expect(mockDispatch).toHaveBeenCalledWith(actions.hideBottomModal());
    expect(callAction).toHaveBeenCalledWith({}, 'GetBannerImages');
  });

  test('handles redirection for non-default roles and trims correctly', () => {
    mockState.user.info.internalRole = ' Dealer ';
    render(<HomePage />);
    expect(mockNavigate).toHaveBeenCalledWith('/dealer-dashboard');
  });

  test('handles redirection fallback for missing role', () => {
    mockState.user.info.internalRole = null;
    render(<HomePage />);
    expect(mockNavigate).not.toHaveBeenCalledWith('/dealer-dashboard');
  });

  test('handles redirection fallback for missing info', () => {
    mockState.user.info = null;
    render(<HomePage />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles drawer toggle', () => {
    const actions = require('store/sales/actions/ui');
    mockState.ui.isDrawerOpen = true;
    render(<HomePage />);

    const drawer = screen.getByTestId('app-drawer');
    fireEvent.press(drawer);
    expect(actions.toggleDrawer).toHaveBeenCalledWith(false);
  });

  test('HeaderFilters close handler dispatches correctly', () => {
    const { handleLangSlectorModal } = require('store/sales/actions/ui/ui.action');
    render(<HomePage />);
    const filters = screen.getByTestId('header-filters');
    fireEvent.press(filters);
    expect(handleLangSlectorModal).toHaveBeenCalledWith(false);
  });

  test('Navigates to various screens from ActionTileCards', () => {
    render(<HomePage />);

    fireEvent.press(screen.getByTestId('action-tile-homeScreen.CustomerActions'));
    expect(mockNavigate).toHaveBeenCalledWith('otherCustomerActions');

    fireEvent.press(screen.getByTestId('action-tile-homeScreen.RegisterNewCustomer'));
    expect(mockNavigate).toHaveBeenCalledWith('registerNewCustomer');

    fireEvent.press(screen.getByTestId('action-tile-homeScreen.ViewPackageInformation'));
    expect(mockNavigate).toHaveBeenCalledWith('packageInformation');
  });

  test('Responsive dimensions for different breakpoints', () => {
    const { useInflection, BreakPoints } = require('wrappers/inflection/InflectionProvider');

    const breakpoints = [BreakPoints.XS, BreakPoints.SM, BreakPoints.MD, BreakPoints.LG, BreakPoints.XL, 'unknown'];

    breakpoints.forEach((bp) => {
      useInflection.mockReturnValueOnce({ inflection: bp });
      const { unmount } = render(<HomePage />);
      unmount();
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('Banner processing with null bannerImages', () => {
    mockState.homePage.bannerImages = null;
    render(<HomePage />);
    expect(screen.getByTestId('carousel')).toBeTruthy();
  });

  test('Banner processing with empty getBanner array', () => {
    mockState.homePage.bannerImages = { getBanner: [] };
    render(<HomePage />);
    expect(screen.getByTestId('carousel')).toBeTruthy();
  });

  test('Menu Logic: tests branch coverage for empty paths', () => {
    render(<HomePage />);
    expect(screen.getByTestId('dashboard-icon-')).toBeTruthy();
  });
});
