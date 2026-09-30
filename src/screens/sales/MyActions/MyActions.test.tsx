/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE } from 'const/strings';
import MyActions from './MyActions';

// BreakPoints constant for use in the test
const BreakPoints = {
  XL: 'xl',
  LG: 'lg',
  MD: 'md',
  MD_L: 'mdL',
  SM: 'sm',
  XS: 'xs',
};

// Mocks
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
let mockInflectionVal = BreakPoints.XS;
let mockIsWeb = false;

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({ navigate: mockNavigate }),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
  useInflection: () => ({ inflection: mockInflectionVal }),
}));

jest.mock('utils/platformHelper', () => ({
  __esModule: true,
  get isWeb() {
    return mockIsWeb;
  },
}));

jest.mock('styles/dimentionHelper', () => ({
  getFullScreenWidth: jest.fn(() => 375),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
  MoengageMixpanelModules: {
    demoBoxDetail: { DemoBoxDetail_PageVisit: { moduleName: 'DemoBoxDetail', attributes: { Status: 'Status' } } },
    tsraInventory: { TSRAInventory_PageVisit: { moduleName: 'TSRAInventory', attributes: { Status: 'Status' } } },
    StoreDashboard: { StoreDashboardPageVisit: { moduleName: 'StoreDashboard', attributes: { Status: 'Status' } } },
    TsraApproval: { TSRA_ApprovalPageVisit: { moduleName: 'TsraApproval', attributes: { Status: 'Status' } } },
    PartnerApproval: { PartnerApproval_PageVisit: { moduleName: 'PartnerApproval', attributes: { Status: 'Status' } } },
    Manage_Hierarchy: { CreateNewDealer_PageVisit: { moduleName: 'Manage_Hierarchy', attributes: { Status: 'Status' } } },
    DemoAccountCreation: { DemoAccountRegistartion_PageVisit: { moduleName: 'DemoAccountCreation', attributes: { Status: 'Status' } } },
  },
}));

// Mocking components to verify props and interactions
jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');
  return {
    ActionTileCard: ({ label, onPress }: any) => (
      <View testID={`action-tile-${label}`}>
        <Pressable onPress={onPress}>
          <Text>{label}</Text>
        </Pressable>
      </View>
    ),
    DashboardIcon: ({ label, value, onPress }: any) => (
      <View testID={`dashboard-icon-${value}`}>
        <Pressable onPress={onPress}>
          <Text>{label}</Text>
        </Pressable>
      </View>
    ),
    Text: ({ children, style, testID }: any) => (
      <Text style={style} testID={testID}>
        {children}
      </Text>
    ),
  };
});

jest.mock('components/sales/Carousel', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ data }: any) => (
      <View testID="carousel">
        {data.map((item: any) => (
          <View key={item.id} testID={`carousel-item-${item.id}`}>
            {item.children}
          </View>
        ))}
      </View>
    ),
  };
});

jest.mock('navigation/drawer/AppDrawer', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ onDrawerStateChange }: any) => (
      <View testID="app-drawer">
        <Pressable onPress={onDrawerStateChange}>
          <Text>Toggle Drawer</Text>
        </Pressable>
      </View>
    ),
  };
});

// Mocking store actions
jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    toggleDrawer: jest.fn((val) => ({ type: 'TOGGLE_DRAWER', payload: val })),
  },
}));

jest.mock('store/sales/actions/homePage', () => ({
  __esModule: true,
  default: {
    getHomePageData: jest.fn(() => ({ type: 'GET_HOME_PAGE_DATA' })),
    getEvdBalance: jest.fn(() => ({ type: 'GET_EVD_BALANCE' })),
  },
}));

describe('MyActions Component', () => {
  const mockDashboard = [
    { menuTitle: 'EVD Balance', path: 'evdBalanceInfo', menuIcon: 'balance', id: '1' },
    { menuTitle: 'Purchase Order', path: 'purchaseOrder', menuIcon: 'po', id: '2' },
    { menuTitle: 'Create Channel Partner', path: 'createChannelPartner', menuIcon: 'partner', id: '3' },
    { menuTitle: 'Demo Box Detail', path: 'demoBoxDetail', menuIcon: 'demo', id: '4' },
    { menuTitle: 'Partner Approval', path: 'partnerApproval', menuIcon: 'approval', id: '5' },
    { menuTitle: 'TSRA Inventory', path: 'tsraInventory', menuIcon: 'inventory', id: '6' },
  ];

  const mockReduxState = {
    user: {
      navigation: {
        dashboard: mockDashboard,
      },
    },
    ui: {
      isDrawerOpen: false,
    },
    homePage: {
      homePageData: {
        rechargeFtd: '100',
        rechargeMtd: '1000',
        activationFtd: '10',
        activationMtd: '100',
        tskStock: '50',
      },
      evdBalance: '5000',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockImplementation((callback: any) => callback(mockReduxState));
    mockInflectionVal = BreakPoints.XS;
    mockIsWeb = false;
  });

  afterEach(() => {
    cleanup();
  });

  test('renders MyActions correctly and matches snapshot', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <MyActions />
      </NavigationContainer>,
    );

    expect(screen.getByTestId('MyActions')).toBeTruthy();
    expect(screen.getByTestId('carousel')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  test('dispatches actions and navigates', () => {
    render(
      <NavigationContainer>
        <MyActions />
      </NavigationContainer>,
    );

    // Initial dispatches
    expect(mockDispatch).toHaveBeenCalled();

    // Toggle drawer
    (useSelector as unknown as jest.Mock).mockImplementation((callback: any) => callback({ ...mockReduxState, ui: { isDrawerOpen: true } }));
    render(
      <NavigationContainer>
        <MyActions />
      </NavigationContainer>,
    );
    fireEvent.press(screen.getAllByText('Toggle Drawer')[0]);
    expect(mockDispatch).toHaveBeenCalled();

    // Navigation
    fireEvent.press(screen.getByTestId('action-tile-Create Channel Partner'));
    expect(mockNavigate).toHaveBeenCalledWith('createChannelPartner');

    // Tracked navigation
    fireEvent.press(screen.getByTestId('action-tile-Demo Box Detail'));
    expect(mockNavigate).toHaveBeenCalledWith('demoBoxDetail');

    // Info card view details
    fireEvent.press(screen.getAllByText('View Details')[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.TRANSACTION);
  });

  test('handles all breakpoint scenarios for web', () => {
    mockIsWeb = true;

    [BreakPoints.XS, BreakPoints.SM, BreakPoints.XL].forEach((bp) => {
      mockInflectionVal = bp;
      render(
        <NavigationContainer>
          <MyActions />
        </NavigationContainer>,
      );
      expect(screen.getByTestId('MyActions')).toBeTruthy();
      cleanup();
    });
  });

  test('handles tracked events for all supported routes', () => {
    render(
      <NavigationContainer>
        <MyActions />
      </NavigationContainer>,
    );

    const trackedRoutes = ['demoBoxDetail', 'tsraInventory'];

    trackedRoutes.forEach((route) => {
      const item = mockDashboard.find((i) => i.path === route);
      if (item) {
        fireEvent.press(screen.getByTestId(`action-tile-${item.menuTitle}`));
        expect(mockNavigate).toHaveBeenCalledWith(route);
      }
    });
  });
});
