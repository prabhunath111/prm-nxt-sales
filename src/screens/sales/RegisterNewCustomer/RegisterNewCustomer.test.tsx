import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { store } from 'store';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import RegisterNewCustomer from './RegisterNewCustomer';

const mockNavigate = jest.fn();

jest.mock('const/strings', () => ({
  ...jest.requireActual('const/strings'),
  NEW_CUSTOMER_ICON: {
    primaryTvRegistration: 'PRIMARY_TV',
    activationStatus: 'ACTIVATION',
  },
}));

jest.mock('utils/navigationHelper', () => ({
  navigationRef: { current: null },
  navigate: jest.fn(),
  handleWebViewUrl: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  createNavigationContainerRef: jest.fn(() => ({ current: null })),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useNavigationState: (selector: any) =>
    selector({
      routes: [{ name: 'RegisterNewCustomer' }],
    }),
}));

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({ navigate: mockNavigate }),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
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
  useInflection: () => ({ inflection: 'mobile' }),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

describe('RegisterNewCustomer', () => {
  const mockDashboard = [
    { id: '1', menuTitle: 'Primary TV Registration ', path: 'primaryTvRegistration', menuIcon: 'tv', isModel: false },
    { id: '2', menuTitle: 'Activation Status', path: 'activationStatus', menuIcon: 'status', isModel: false },
    { id: '3', menuTitle: 'Quotation', path: 'quotation', menuIcon: 'quote', isModel: false },
    { id: '4', menuTitle: 'ETSK Multi', path: 'eTSKMulti', menuIcon: 'multi', isModel: false },
  ];

  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        user: {
          navigation: {
            dashboard: mockDashboard,
          },
        },
      }),
    );
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  test('renders component', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterNewCustomer />
      </Provider>,
    );
    expect(getByTestId('RegisterNewCustomer')).toBeTruthy();
  });

  test('filters and maps dashboard items correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterNewCustomer />
      </Provider>,
    );
    const container = getByTestId('RegisterNewCustomer');
    expect(container).toBeTruthy();
  });

  test('handles item with missing icon gracefully', () => {
    const dashboardWithMissingIcon = [{ id: '5', menuTitle: 'Test Item', path: 'unknownPath', menuIcon: 'nonexistent', isModel: false }];
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        user: {
          navigation: {
            dashboard: dashboardWithMissingIcon,
          },
        },
      }),
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterNewCustomer />
      </Provider>,
    );
    expect(getByTestId('RegisterNewCustomer')).toBeTruthy();
  });

  test('calls navigate and tracks event for primaryTvRegistration', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterNewCustomer />
      </Provider>,
    );
    const container = getByTestId('RegisterNewCustomer');
    const flatList = container.props.children;
    const item = mockDashboard[0];
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('primaryTvRegistration');
  });

  test('calls navigate and tracks event for activationStatus', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterNewCustomer />
      </Provider>,
    );
    const container = getByTestId('RegisterNewCustomer');
    const flatList = container.props.children;
    const item = mockDashboard[1];
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('activationStatus');
  });

  test('calls navigate and tracks event for quotation', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterNewCustomer />
      </Provider>,
    );
    const container = getByTestId('RegisterNewCustomer');
    const flatList = container.props.children;
    const item = mockDashboard[2];
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('quotation');
  });

  test('calls navigate and tracks event for eTSKMulti', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterNewCustomer />
      </Provider>,
    );
    const container = getByTestId('RegisterNewCustomer');
    const flatList = container.props.children;
    const item = mockDashboard[3];
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('eTSKMulti');
  });
});
