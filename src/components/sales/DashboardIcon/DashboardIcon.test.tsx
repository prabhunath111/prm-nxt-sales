import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import uiActions from 'store/sales/actions/ui';
import demoBoxDetailsAction from 'store/sales/actions/demoBoxDetails';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { CHILD_TYPE, HEADER_TITLE, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS } from 'const';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import env from 'config/env';
import DashboardIcon from './DashboardIcon';

// --- Mocks ---
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

const mockDispatch = jest.fn();
let mockInfo: any = {};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector({ user: { info: mockInfo } }),
}));

jest.mock('store/sales/actions/ui', () => ({
  showBottomModal: jest.fn(),
}));

jest.mock('store/sales/actions/demoBoxDetails', () => ({
  demoBoxDetails: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  ...jest.requireActual('wrappers/inflection/InflectionProvider'),
  useInflection: () => ({ inflection: false }),
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

jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraPermission: jest.fn(() => [true, null]),
  useCameraDevice: jest.fn(() => null),
  useCodeScanner: jest.fn(() => ({ scan: jest.fn() })),
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

describe('DashboardIcon Component', () => {
  const baseItem = {
    label: 'Modify Pack',
    value: 'http://google.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockInfo = {}; // reset info
  });

  const renderComponent = (props: any) =>
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DashboardIcon {...props} />
        </NavigationContainer>
      </Provider>,
    );

  it('renders correctly', () => {
    renderComponent({ ...baseItem, iconName: 'Refresh-box-icon' });
    expect(screen.getByText('Modify Pack')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const component = renderComponent(baseItem);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('handles isDisable correctly', () => {
    const { getByText } = renderComponent({ ...baseItem, isDisable: true });
    fireEvent.press(getByText('Modify Pack'));

    expect(uiActions.showBottomModal).toHaveBeenCalledWith({
      isModalVisible: true,
      type: CHILD_TYPE.LABEl,
      headerTitle: HEADER_TITLE.CONFIRMATION,
      showCloseIcon: true,
      showHeader: false,
      buttonInfo: {
        primaryButtonLabel: MODAL.OK,
        childData: HEADER_TITLE.THIS_MODULE_IS_NOT_APPLICABLE,
        centerLabel: true,
      },
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles DEMO_BOX_DETAIL with dealer role correctly', () => {
    mockInfo = { internalRole: PROPERTIES.ROLES.dealer, userId: 'dealer123' };
    const { getByText } = renderComponent({ ...baseItem, value: ROUTE.WEB.DEMO_BOX_DETAIL });
    fireEvent.press(getByText('Modify Pack'));

    expect(demoBoxDetailsAction.demoBoxDetails).toHaveBeenCalledWith({ evdCode: 'dealer123' }, QUERY.DemoBoxDetails);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.DEMO_BOX_DETAILS);
  });

  it('handles isModal correctly for PRIMARY_TV_REGISTRATION', () => {
    const { getByText } = renderComponent({
      ...baseItem,
      isModal: true,
      value: ROUTE.WEB.PRIMARY_TV_REGISTRATION,
      iconName: 'Refresh-box-icon',
    });
    fireEvent.press(getByText('Modify Pack'));

    expect(uiActions.showBottomModal).toHaveBeenCalledWith({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: 'Modify Pack',
      showCloseIcon: true,
      showHeader: true,
      formName: ROUTE.WEB.PRIMARY_TV_REGISTRATION,
      headerIcon: 'Refresh-box-icon',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles isModal correctly for other routes', () => {
    const { getByText } = renderComponent({ ...baseItem, isModal: true, value: 'other-form' });
    fireEvent.press(getByText('Modify Pack'));

    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CHILD_TYPE.DYNAMIC_FORM,
        formName: 'other-form',
      }),
    );
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles ROUTE.WEB.DASHBOARD correctly', () => {
    const { getByText } = renderComponent({ ...baseItem, value: ROUTE.WEB.DASHBOARD });
    fireEvent.press(getByText('Modify Pack'));

    expect(callAction).toHaveBeenCalledWith({ moduleName: STRINGS.DASHBOARD, externalUrl: env.DASHBOARD_EXTERNAL_URL }, QUERY.GetSSORedirectionToken);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles ROUTE.WEB.DEALER_STOCK correctly', () => {
    const { getByText } = renderComponent({ ...baseItem, value: ROUTE.WEB.DEALER_STOCK });
    fireEvent.press(getByText('Modify Pack'));

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(MoengageMixpanelModules.DealerStock.DealerStockPageVisit.moduleName, {
      [MoengageMixpanelModules.DealerStock.DealerStockPageVisit.attributes.Status]: true,
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.DEALER_STOCK);
  });

  it('handles default navigation correctly', () => {
    const { getByText } = renderComponent({ ...baseItem, value: '/some-other-route' });
    fireEvent.press(getByText('Modify Pack'));

    expect(mockNavigate).toHaveBeenCalledWith('/some-other-route');
  });
});
