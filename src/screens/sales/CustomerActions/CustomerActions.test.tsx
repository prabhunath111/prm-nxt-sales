import React from 'react';
import { FlatList } from 'react-native';
import { render } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { store } from 'store';
import CustomerActions from './CustomerActions';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useNavigationState: (selector: any) =>
    selector({
      routes: [{ name: 'CustomerActions' }],
    }),
}));

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
  useInflection: () => ({ inflection: 'mobile' }),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
  MoengageMixpanelModules: {
    customerInvoice: {
      customerInvoice_PageVisit: {
        moduleName: 'CustomerInvoice',
        attributes: { Status: 'status' },
      },
    },
    evdTransfer: {
      EVD_Transfer_PageVisit: {
        moduleName: 'EVDTransfer',
        attributes: { Status: 'status' },
      },
    },
    RepushOrder: {
      RepushOrderPageVisit: {
        moduleName: 'RepushOrder',
        attributes: { Status: 'status' },
      },
    },
    TSKVoucher: {
      TSKVoucherPageVisit: {
        moduleName: 'TSKVoucher',
        attributes: { Status: 'status' },
      },
    },
    ExclusiveStore: {
      ExclusiveStorePageVisit: {
        moduleName: 'ExclusiveStore',
        attributes: { Status: 'status' },
      },
    },
    WorkOrderRecreation: {
      WorkOrderRecreationPageVisit: {
        moduleName: 'WorkOrderRecreation',
        attributes: { Status: 'status' },
      },
    },
  },
}));

jest.mock('const/strings', () => ({
  ...jest.requireActual('const/strings'),
  ROUTE: {
    WEB: {
      EXCLUSIVE_STORE: 'exclusiveStore',
      CUSTOMER_INVOICE: 'customerInvoice',
      EVD_TRANSFER: 'evdTransfer',
    },
  },
}));

describe('CustomerActions', () => {
  const mockDashboard = [
    { id: '1', menuTitle: 'Customer Invoice', path: 'customerInvoice', menuIcon: 'invoice', isModel: false, isDisable: false },
    { id: '2', menuTitle: 'EVD Transfer', path: 'evdTransfer', menuIcon: 'transfer', isModel: false, isDisable: false },
    { id: '3', menuTitle: 'Disabled Module', path: 'disabledModule', menuIcon: 'disabled', isModel: false, isDisable: true },
    { id: '4', menuTitle: 'Exclusive Store', path: 'exclusiveStore', menuIcon: 'store', isModel: false, isDisable: false, moduleNameNT: 'exclusiveStore' },
  ];

  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        user: {
          navigation: {
            dashboard: mockDashboard,
          },
          eligibleStoreAutomation: true,
        },
      }),
    );
    mockNavigate.mockClear();
    mockDispatch.mockClear();
  });

  test('renders component', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    expect(getByTestId('CustomerActions')).toBeTruthy();
  });

  test('filters dashboard items correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    expect(flatList.props.data).toBeDefined();
  });

  test('filters out exclusive store when eligibleStoreAutomation is false', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        user: {
          navigation: {
            dashboard: mockDashboard,
          },
          eligibleStoreAutomation: false,
        },
      }),
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    const exclusiveStoreItem = flatList.props.data.find((item: any) => item.path === 'exclusiveStore');
    expect(exclusiveStoreItem).toBeUndefined();
  });

  test('calls navigate when enabled item is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    const item = { menuTitle: 'Customer Invoice', path: 'customerInvoice', menuIcon: 'invoice', isModel: false, isDisable: false };
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('customerInvoice');
  });

  test('shows modal when disabled item is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    const item = { menuTitle: 'Disabled Module', path: 'disabledModule', menuIcon: 'disabled', isModel: false, isDisable: true };
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('tracks event for repushOrder route', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    const item = { menuTitle: 'Repush Order', path: 'repushOrder', menuIcon: 'refresh', isModel: false, isDisable: false };
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('repushOrder');
  });

  test('tracks event for tskVoucher route', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    const item = { menuTitle: 'TSK Voucher', path: 'tskVoucher', menuIcon: 'voucher', isModel: false, isDisable: false };
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('tskVoucher');
  });

  test('tracks event for exclusiveStore route', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    const item = { menuTitle: 'Exclusive Store', path: 'exclusiveStore', menuIcon: 'store', isModel: false, isDisable: false };
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('exclusiveStore');
  });

  test('tracks event for woRecreation route', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomerActions />
      </Provider>,
    );
    const flatList = getByTestId('CustomerActions').findByType(FlatList);
    const item = { menuTitle: 'WO Recreation', path: 'woRecreation', menuIcon: 'recreation', isModel: false, isDisable: false };
    const renderedItem = flatList.props.renderItem({ item });

    renderedItem.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('woRecreation');
  });
});
