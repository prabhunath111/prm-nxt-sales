/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { PROPERTIES, CHILD_TYPE, ICONS } from 'const';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import uiActions from 'store/sales/actions/ui';
import DealerDetailsCard from './DealerDetailsCard';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const { useSelector } = require('react-redux');

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
  MoengageMixpanelModules: {
    StoreDashboard: {
      StoreDashboardChangeDistributor: {
        moduleName: 'StoreDashboardChangeDistributor',
        attributes: { Status: 'Status', dealerID: 'dealerID' },
      },
    },
    CompetitorDataCapture: {
      CompetitorDataCaptureChangeDealer: {
        moduleName: 'CompetitorDataCaptureChangeDealer',
        attributes: { Status: 'Status' },
      },
    },
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn((payload) => ({ type: 'SHOW_MODAL', payload })),
}));

// Comprehensive platform helper mock
jest.mock('utils/platformHelper', () => ({
  isDesktop: true,
  isWeb: true,
  isAndroid: jest.fn(() => false),
  isTablet: jest.fn(() => false),
}));

// Mock DeviceInfo
jest.mock('react-native-device-info', () => ({
  getSystemName: jest.fn(() => 'web'),
  getModel: jest.fn(() => 'web'),
  getDeviceId: jest.fn(() => 'web'),
  getManufacturerSync: jest.fn(() => 'web'),
  getSerialNumberSync: jest.fn(() => 'web'),
  getSystemVersion: jest.fn(() => 'web'),
  getVersion: jest.fn(() => 'web'),
  isEmulatorSync: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'web'),
}));

// Mock Inflection with BreakPoints
const mockInflection = jest.fn(() => 'xl');
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: mockInflection() }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

// Mock Image component
jest.mock('components/sales/Image', () => {
  const { View } = require('react-native');
  // eslint-disable-next-line react/destructuring-assignment
  return (props: any) => <View {...props} testID={`image-${props.iconName}`} />;
});

describe('DealerDetailsCard Component', () => {
  const defaultDealerDetails = {
    evdCode: 'EVD123',
    mdn: '9876543210',
    name: 'Default Dealer',
    dealerID: 'D123',
  };

  const defaultUserInfo = {
    internalRole: PROPERTIES.ROLES.fos,
  };

  const defaultState = {
    common: { dealerDetails: defaultDealerDetails },
    user: { info: defaultUserInfo },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation((selector: any) => selector(defaultState));
    mockInflection.mockReturnValue('xl');
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={configureStore({ reducer: { dummy: (state = {}) => state } })}>
        <NavigationContainer>
          <DealerDetailsCard {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('renders correctly with default Redux data', () => {
    renderComponent();
    expect(screen.getByText('strings.dealerDetails')).toBeTruthy();
    expect(screen.getByText('strings.evdCode')).toBeTruthy();
    expect(screen.getByText('EVD123')).toBeTruthy();
    expect(screen.getByText('strings.mdn')).toBeTruthy();
    expect(screen.getByText('9876543210')).toBeTruthy();
    expect(screen.getByText('strings.name')).toBeTruthy();
    expect(screen.getByText('Default Dealer')).toBeTruthy();
  });

  test('renders with custom props overriding Redux data', () => {
    renderComponent({
      title: 'Custom Title',
      evdCode: 'PROP_EVD',
      mdn: 'PROP_MDN',
      name: 'PROP_NAME',
    });
    expect(screen.getByText('Custom Title')).toBeTruthy();
    expect(screen.getByText('PROP_EVD')).toBeTruthy();
    expect(screen.getByText('PROP_MDN')).toBeTruthy();
    expect(screen.getByText('PROP_NAME')).toBeTruthy();
  });

  test('shows change dealer link for non-dealer roles', () => {
    renderComponent();
    expect(screen.getByText('strings.changeDealer')).toBeTruthy();
    expect(screen.getByTestId(`image-${ICONS.EDIT_PENCIL}`)).toBeTruthy();
  });

  test('hides change dealer link for dealer role', () => {
    useSelector.mockImplementation((selector: any) =>
      selector({
        ...defaultState,
        user: { info: { internalRole: PROPERTIES.ROLES.dealer } },
      }),
    );
    renderComponent();
    expect(screen.queryByText('strings.changeDealer')).toBeNull();
  });

  test('hides change dealer link when link prop is false', () => {
    renderComponent({ link: false });
    expect(screen.queryByText('strings.changeDealer')).toBeNull();
  });

  test('handles change dealer with routeName (Navigation path)', () => {
    renderComponent({ routeName: 'TargetRoute' });
    const changeBtn = screen.getByText('strings.changeDealer');
    fireEvent.press(changeBtn);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('TargetRoute');
  });

  test('handles change dealer with routeName and custom title', () => {
    renderComponent({ routeName: 'TargetRoute', title: 'Custom Title' });
    const changeBtn = screen.getByText('strings.changeDistributor');
    fireEvent.press(changeBtn);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('TargetRoute');
  });

  test('handles change dealer without routeName (Modal path)', () => {
    renderComponent({ formName: 'CustomForm', bottomModalHeader: 'ModalHeader' });
    const changeBtn = screen.getByText('strings.changeDealer');
    fireEvent.press(changeBtn);

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: 'ModalHeader',
        showCloseIcon: true,
        showHeader: true,
        formName: 'CustomForm',
        isCenterModal: true,
      }),
    );
  });

  test('DealerDetailRow renders with responsive styles for different inflections', () => {
    mockInflection.mockReturnValue('md');
    renderComponent();
    expect(screen.getByText('EVD123')).toBeTruthy();

    mockInflection.mockReturnValue('lg');
    const { rerender } = renderComponent();
    rerender(
      <Provider store={configureStore({ reducer: { dummy: (state = {}) => state } })}>
        <NavigationContainer>
          <DealerDetailsCard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('EVD123')).toBeTruthy();
  });

  test('DealerDetailRow branches for removeBorder and removePadding coverage', () => {
    renderComponent();
    expect(screen.getByText('strings.evdCode')).toBeTruthy();
    expect(screen.getByText('strings.name')).toBeTruthy();
  });

  test('snapshot test', () => {
    const component = render(
      <Provider store={configureStore({ reducer: { dummy: (state = {}) => state } })}>
        <NavigationContainer>
          <DealerDetailsCard />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
