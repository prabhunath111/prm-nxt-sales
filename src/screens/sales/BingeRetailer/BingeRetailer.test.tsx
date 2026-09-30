import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { store } from 'store';
import BingeRetailer from './BingeRetailer';

const mockNavigate = jest.fn();

jest.mock('const/strings', () => ({
  ...jest.requireActual('const/strings'),
  BINGE_RETAILER_ICON: {
    trainingModule: 'TRAINING_MODULE',
  },
  BingeRetailerData: [],
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
      routes: [{ name: 'BingeRetailer' }],
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

describe('BingeRetailer', () => {
  const mockDashboard = [
    { id: '1', menuTitle: 'Training Module ', path: 'trainingModule', menuIcon: 'video', isModel: false },
    { id: '2', menuTitle: 'Manage Apps', path: 'manageApps', menuIcon: 'document', isModel: false },
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
  });

  test('renders component', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BingeRetailer />
      </Provider>,
    );
    expect(getByTestId('binge-retailer-container')).toBeTruthy();
  });

  test('renders FlatList', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BingeRetailer />
      </Provider>,
    );
    expect(getByTestId('binge-retailer-list')).toBeTruthy();
  });

  test('filters and maps dashboard items correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BingeRetailer />
      </Provider>,
    );
    const flatList = getByTestId('binge-retailer-list');
    expect(flatList.props.data).toBeDefined();
  });

  test('renders dashboard items in FlatList', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BingeRetailer />
      </Provider>,
    );
    const flatList = getByTestId('binge-retailer-list');
    expect(flatList.props.data.length).toBeGreaterThan(0);
  });

  test('handles item with missing icon gracefully', () => {
    const dashboardWithMissingIcon = [{ id: '3', menuTitle: 'Test Item', path: 'unknownPath', menuIcon: 'nonexistent', isModel: false }];
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
        <BingeRetailer />
      </Provider>,
    );
    const flatList = getByTestId('binge-retailer-list');
    expect(flatList.props.data.length).toBe(0);
  });

  test('uses icon from BINGE_RETAILER_ICON mapping', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BingeRetailer />
      </Provider>,
    );
    const flatList = getByTestId('binge-retailer-list');
    const { data } = flatList.props;
    const trainingModule = data.find((item: any) => item.path === 'trainingModule');
    const manageApps = data.find((item: any) => item.path === 'manageApps');
    expect(trainingModule.menuIcon).toBe('TRAINING_MODULE');
    expect(manageApps.menuIcon).toBe('circle');
  });

  test('calls navigate when item is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BingeRetailer />
      </Provider>,
    );
    const flatList = getByTestId('binge-retailer-list');
    const item = mockDashboard[0];
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('trainingModule');
  });
});
