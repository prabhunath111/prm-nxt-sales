/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { CHILD_TYPE, STRINGS } from 'const';
import * as navigationHelper from 'utils/navigationHelper';
import * as formBuilderHelper from 'utils/formBuilderHelper';
import { useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { ROUTE } from 'const';
import BottomModal from './BottomModal';

// Mock Redux
const mockDispatch = jest.fn((action: any) => action);
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  // eslint-disable-next-line react/jsx-no-useless-fragment
  SafeAreaProvider: ({ children }: any) => <>{children}</>,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(() => ({ inflection: 'md' })),
  BreakPoints: { MD: 'md', LG: 'lg', XL: 'xl' },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('hooks/useNavigate', () => {
  const navigate = jest.fn();
  const goHome = jest.fn();
  return jest.fn(() => ({ navigate, goHome }));
});

jest.mock('hooks/useCurrentRoute', () => jest.fn(() => ({ routeName: 'MockRoute' })));

jest.mock('utils/platformHelper', () => ({
  isAndroid: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'ios' })),
  isWeb: false,
}));

jest.mock('utils/navigationHelper', () => ({
  closeWebView: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
    clearLoader: jest.fn(() => ({ type: 'CLEAR_LOADER' })),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  setCustomFormData: jest.fn(() => ({ type: 'SET_CUSTOM_FORM_DATA' })),
}));

jest.mock('store/sales/actions/customerOffers/customerOffers.action', () => ({
  handleRemoveOffer: jest.fn(() => ({ type: 'HANDLE_REMOVE_OFFER' })),
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

const createMockComponent = (name: string) => {
  const React = require('react');
  const { Text } = require('react-native');
  return (_props: any) => <Text>{name}</Text>;
};
jest.mock('screens/sales/SalesNext', () => createMockComponent('SalesNext'));
jest.mock('screens/sales/DynamicSalesNext', () => createMockComponent('DynamicSalesNext'));
jest.mock('screens/sales/RegistrationSalesNext', () => createMockComponent('RegistrationSalesNext'));
jest.mock('components/sales/OtpVerification', () => createMockComponent('OtpVerification'));
jest.mock('components/sales/DealerDetailsCard', () => createMockComponent('DealerDetailsCard'));
jest.mock('components/sales/AddPackageOffer', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return (props: any) => (
    <TouchableOpacity testID="mock-add-package-offer" onPress={props.onRemoveOffer}>
      <Text onPress={props.onViewDetails}>AddPackageOffer</Text>
    </TouchableOpacity>
  );
});
jest.mock('components/sales/DateRangePicker', () => createMockComponent('DateRangePicker'));
jest.mock('components/sales/DatePickerNew', () => createMockComponent('DatePickerNew'));
jest.mock('components/sales/TimeSlotsContainer', () => createMockComponent('TimeSlotsContainer'));
jest.mock('components/sales/SimpleDatePicker', () => createMockComponent('SimpleDatePicker'));
jest.mock('components/sales/TextContainer', () => createMockComponent('TextContainer'));
jest.mock('components/sales/Text', () => {
  const React = require('react');
  const { Text: RNText } = require('react-native');
  return (props: any) => <RNText {...props}>{props.label || props.children}</RNText>;
});
jest.mock('components/sales/Button', () => {
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { TouchableOpacity, Text } = require('react-native');
  return (props: any) => (
    <TouchableOpacity testID="mock-button" onPress={props.onPress} disabled={props.disabled}>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );
});

describe('BottomModal component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        ui: { modalData: {}, isModalLoading: false },
        customerOffers: { selectedOfferData: { offerType: 'test' } },
        customerRecharge: { dataPacks: { accountInfo: { accountType: STRINGS.RESIDENTIAL } } },
        user: { isRedirection: false },
      }),
    );
  });

  const renderComponent = (modalProps: any = {}) =>
    render(
      <NavigationContainer>
        <BottomModal modalProps={modalProps} />
      </NavigationContainer>,
    );

  test('renders properly when visible', () => {
    renderComponent({ isModalVisible: true });
    expect(screen.getByTestId('bottomModalTest')).toBeTruthy();
  });

  test('renders header properly', () => {
    renderComponent({ isModalVisible: true, showHeader: true, headerTitle: 'Test Header' });
    expect(screen.getByText('strings.Test Header')).toBeTruthy();
  });

  test('renders CHILD_TYPE.DYNAMIC_FORM', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.DYNAMIC_FORM });
    expect(screen.getByText('SalesNext')).toBeTruthy();
  });

  test('renders CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM });
    expect(screen.getByText('DynamicSalesNext')).toBeTruthy();
  });

  test('renders CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM });
    expect(screen.getByText('RegistrationSalesNext')).toBeTruthy();
  });

  test('renders CHILD_TYPE.LABEl', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.LABEl, buttonInfo: { childData: 'My Label', subLabel: 'My Sub Label' } });
    expect(screen.getByText('strings.My Label')).toBeTruthy();
    expect(screen.getByText('strings.My Sub Label')).toBeTruthy();
  });

  test('renders CHILD_TYPE.PACK_CARD and triggers removeOffer and viewDetails', async () => {
    (formBuilderHelper.callAction as jest.Mock).mockReturnValue(Promise.resolve({ status: true }));
    renderComponent({
      isModalVisible: true,
      type: CHILD_TYPE.PACK_CARD,
      buttonInfo: { childData: { nameNT: 'Pack', stdPriUnit: 10 } },
    });

    expect(screen.getByTestId('mock-add-package-offer')).toBeTruthy();
    fireEvent.press(screen.getByTestId('mock-add-package-offer'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HANDLE_REMOVE_OFFER' });

    fireEvent.press(screen.getByText('AddPackageOffer'));
    expect(mockDispatch).toHaveBeenCalled();
    // we also mocked formBuilderHelper.callAction
    expect(formBuilderHelper.callAction).toHaveBeenCalled();
    await act(async () => {});
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_BOTTOM_MODAL' });
  });

  test('renders CHILD_TYPE.OTP_MODAL', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.OTP_MODAL, data: { mdn: '123' } });
    expect(screen.getByText('OtpVerification')).toBeTruthy();
  });

  test('renders CHILD_TYPE.PARTNER_DETAILS', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.PARTNER_DETAILS, data: { name: 'Dealer', textMessage: 'Hello' } });
    expect(screen.getByText('DealerDetailsCard')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy(); // textMessage
  });

  test('renders CHILD_TYPE.CUSTOM_DATE_PICKER', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.CUSTOM_DATE_PICKER });
    expect(screen.getByText('DateRangePicker')).toBeTruthy();
  });

  test('renders CHILD_TYPE.CALENDAR', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.CALENDAR });
    expect(screen.getByText('DatePickerNew')).toBeTruthy();
  });

  test('renders CHILD_TYPE.DATE_TIME', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.DATE_TIME });
    expect(screen.getByText('TimeSlotsContainer')).toBeTruthy();
  });

  test('renders CHILD_TYPE.SIMPLE_CALENDER', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.SIMPLE_CALENDER });
    expect(screen.getByText('SimpleDatePicker')).toBeTruthy();
  });

  test('renders CHILD_TYPE.INFO_TEXT', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.INFO_TEXT });
    expect(screen.getByText('TextContainer')).toBeTruthy();
  });

  test('renders CHILD_TYPE.PARTNER_MARGIN', () => {
    renderComponent({ isModalVisible: true, type: CHILD_TYPE.PARTNER_MARGIN, buttonInfo: { childData: { subscriberOffer: '10%' } } });
    expect(screen.getByText('strings.partnerMargin : ')).toBeTruthy();
    expect(screen.getByText('10%')).toBeTruthy();
  });

  test('renders CHILD_TYPE.WINBACK_FLEXI_MARGIN', () => {
    renderComponent({
      isModalVisible: true,
      type: CHILD_TYPE.WINBACK_FLEXI_MARGIN,
      buttonInfo: { childData: [{ dealerMargin: 10, winbackOfferDisclaimer: 'Disclaimer' }] },
    });
    expect(screen.getByText('strings.partnerMargin : ')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('Disclaimer')).toBeTruthy();
  });

  test('displays buttons and calls primary and secondary actions', async () => {
    const mockOnClose = jest.fn();
    (formBuilderHelper.callAction as jest.Mock).mockReturnValue(Promise.resolve({ routeName: 'NewRoute' }));

    renderComponent({
      isModalVisible: true,
      buttonInfo: {
        primaryButtonLabel: 'OK',
        secondaryButtonLabel: 'Cancel',
        queryName: 'TestQuery',
        secondaryQueryName: 'SecondQuery',
      },
      onClose: mockOnClose,
    });

    const buttons = screen.getAllByTestId('mock-button');
    expect(buttons.length).toBe(2);

    // Primary action
    fireEvent.press(buttons[0]);
    expect(formBuilderHelper.callAction).toHaveBeenCalledWith({}, 'TestQuery', '', expect.any(Function));
    expect(mockOnClose).toHaveBeenCalledWith(false);

    await act(async () => {});
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_BOTTOM_MODAL' });

    // Secondary action
    fireEvent.press(buttons[1]);
    expect(formBuilderHelper.callAction).toHaveBeenCalledWith(null, 'SecondQuery', '', expect.any(Function));
  });

  test('handles route redirection when queryName is not passed on submit', () => {
    renderComponent({
      isModalVisible: true,
      buttonInfo: {
        primaryButtonLabel: 'Primary',
        isRedirection: true,
      },
    });
    const buttons = screen.getAllByTestId('mock-button');
    // Primary action
    fireEvent.press(buttons[0]);
    expect(navigationHelper.closeWebView).toHaveBeenCalled();
  });

  test('primary button closes modal when no query or redirection is provided', () => {
    renderComponent({
      isModalVisible: true,
      buttonInfo: {
        primaryButtonLabel: 'PrimaryFallback',
      },
    });
    const buttons = screen.getAllByTestId('mock-button');
    fireEvent.press(buttons[0]);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_BOTTOM_MODAL' });
  });

  test('primary button navigates to tsk cancellation when routeName matches', () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate, goHome: jest.fn() });

    renderComponent({
      isModalVisible: true,
      onClose: jest.fn(),
      buttonInfo: {
        primaryButtonLabel: 'PrimaryTSK',
        queryName: 'SomeQuery',
        routeName: ROUTE.WEB.TSK_CANCELLATION,
      },
    });
    const buttons = screen.getAllByTestId('mock-button');
    fireEvent.press(buttons[0]);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.TSK_CANCELLATION);
  });

  test('secondary button redirects when isRedirection is true and secondaryQueryName missing', () => {
    renderComponent({
      isModalVisible: true,
      buttonInfo: {
        secondaryButtonLabel: 'SecondaryRedirect',
        isRedirection: true,
      },
    });
    const buttons = screen.getAllByTestId('mock-button');
    fireEvent.press(buttons[0]);
    expect(navigationHelper.closeWebView).toHaveBeenCalled();
  });

  test('secondary button closes modal when no secondaryQueryName or redirection', () => {
    renderComponent({
      isModalVisible: true,
      buttonInfo: {
        secondaryButtonLabel: 'SecondaryFallback',
      },
    });
    const buttons = screen.getAllByTestId('mock-button');
    fireEvent.press(buttons[0]);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_BOTTOM_MODAL' });
  });

  test('closeModal specifically for ROUTE.WEB.INVOICE_TRANSACTION', () => {
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.INVOICE_TRANSACTION });
    renderComponent({
      isModalVisible: true,
      buttonInfo: { primaryButtonLabel: 'OK' },
    });
    const buttons = screen.getAllByTestId('mock-button');
    fireEvent.press(buttons[0]);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_BOTTOM_MODAL' });
  });

  test('closeModal specifically with goHome behavior', () => {
    const mockGoHome = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue({ navigate: jest.fn(), goHome: mockGoHome });
    (useCurrentRoute as jest.Mock).mockReturnValue({ routeName: 'SomeOtherRoute' });
    renderComponent({
      isModalVisible: true,
      buttonInfo: { primaryButtonLabel: 'OK', goToHome: true },
    });
    const buttons = screen.getAllByTestId('mock-button');
    fireEvent.press(buttons[0]);
    expect(mockGoHome).toHaveBeenCalled();
  });
});
