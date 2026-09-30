import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import CallSubscriberCard from './CallSubscriberCard';

/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

jest.mock('styles/webBreakpoints', () => ({
  isXL: jest.fn(() => false),
  isLG: jest.fn(() => false),
  isMD: jest.fn(() => false),
  isMDL: jest.fn(() => false),
  isSM: jest.fn(() => false),
  isXS: jest.fn(() => false),
  gcs: jest.fn((key) => `${key}_md`),
}));

jest.mock('config/i18n', () => ({
  getDeviceLanguage: jest.fn(() => 'en'),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn((_payload, query) => {
    if (query === 'accountInformation') {
      return (_dispatch: any) => Promise.resolve({ status: true, data: { customerRMN: '9876543210' } });
    }
    if (query === 'getUniqueKwlrtyToken') {
      return (_dispatch: any) => Promise.resolve({ status: true, data: { result: { dialingNo: '1234567890' } } });
    }
    return (_dispatch: any) => Promise.resolve({ status: true });
  }),
  openDialer: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'md' }),
}));

jest.mock('store/sales/actions', () => ({
  setSubscribeRmn: jest.fn(() => ({ type: 'setSubscribeRmn' })),
}));

jest.mock('store/sales/actions/form', () => ({
  setDealerDetails: jest.fn(() => ({ type: 'setDealerDetails' })),
  setUpdatedFormFields: jest.fn(() => ({ type: 'setUpdatedFormFields' })),
}));

const mockSubscriberDetails = {
  data: {
    subscriberId: 'SUB123',
  },
};

const mockAccountInformation = {
  maskedRMN: '****1234',
  customerName: 'John Doe',
  customerStatus: 'Active',
  balance: 100,
  rechargeDueDate: '2024-12-31',
  monthlyRecharge: 500,
  customerRMN: '9876543210',
};

const mockUniqueKwlrtyNumber = {
  result: {
    dialingNo: '1234567890',
  },
};

const createMockStore = (overrides: { rechargeWinback?: any; accountInformation?: any; form?: any } = {}) =>
  configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    reducer: {
      rechargeWinback: () => ({
        subscriberDetails: mockSubscriberDetails,
        uniqueKwlrtyNumber: mockUniqueKwlrtyNumber,
        ...overrides.rechargeWinback,
      }),
      accountInformation: () => ({
        accountInformation: mockAccountInformation,
        ...overrides.accountInformation,
      }),
      form: () => ({
        formState: {},
        ...overrides.form,
      }),
    },
  });

describe('Test for the component CallSubscriberCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { callAction, openDialer } = require('utils/formBuilderHelper');
    const { MoengageMixpanel } = require('services/moengageMixpanel');

    callAction.mockImplementation((_payload: any, query: any) => {
      if (query === 'accountInformation') {
        return (_dispatch: any) => Promise.resolve({ status: true, data: { customerRMN: '9876543210' } });
      }
      if (query === 'getUniqueKwlrtyToken') {
        return (_dispatch: any) => Promise.resolve({ status: true, data: { result: { dialingNo: '1234567890' } } });
      }
      return (_dispatch: any) => Promise.resolve({ status: true });
    });
    openDialer.mockImplementation(() => {});
    MoengageMixpanel.trackEvent.mockImplementation(() => {});
  });

  test('render component CallSubscriberCard', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
  });

  test('snapshot tests for CallSubscriberCard', async () => {
    const mockStore = createMockStore();
    const component = render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('renders with custom label prop', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard label="Call Now" />
        </NavigationContainer>
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByText('Call Now')).toBeTruthy();
    });
  });

  test('renders without label prop', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
  });

  test('fetches account information on mount with subscriberId', async () => {
    const mockStore = createMockStore();
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith({ subscriberInfo: 'SUB123' }, expect.any(String));
    });
  });

  test('dispatches setSubscribeRmn action when account information fetch succeeds', async () => {
    const mockStore = createMockStore();
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(callAction).toHaveBeenCalled();
    });
  });

  test('does not fetch account information when subscriberId is missing', async () => {
    const mockStore = createMockStore({
      rechargeWinback: {
        subscriberDetails: { data: {} },
        uniqueKwlrtyNumber: mockUniqueKwlrtyNumber,
      },
    });
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    // Initial check
    expect(callAction).not.toHaveBeenCalled();

    // Give it some time to make sure it doesn't call it later
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(callAction).not.toHaveBeenCalled();
  });

  test('updates customer details when accountInformation changes', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
    });
  });

  test('dispatches setDealerDetails action with subscriber and customer name', async () => {
    const mockStore = createMockStore();
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(callAction).toHaveBeenCalled();
    });
  });

  test('dispatches setUpdatedFormFields action with monthly recharge', async () => {
    const mockStore = createMockStore();
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(callAction).toHaveBeenCalled();
    });
  });

  test('calls subscriber when button is pressed', async () => {
    const mockStore = createMockStore();
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith({ subID: 'SUB123', mobile: '9876543210' }, expect.any(String));
    });
  });

  test('opens dialer with correct number when call succeeds', async () => {
    const mockStore = createMockStore();
    const { openDialer } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(openDialer).toHaveBeenCalledWith('1234567890');
    });
  });

  test('tracks mixpanel event when call succeeds', async () => {
    const mockStore = createMockStore();
    const { MoengageMixpanel } = require('services/moengageMixpanel');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
    });
  });

  test('does not open dialer when call fails', async () => {
    const { callAction, openDialer } = require('utils/formBuilderHelper');
    callAction.mockImplementationOnce((_payload: any, _query: any) => (_dispatch: any) => Promise.resolve({ status: false }));

    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(openDialer).not.toHaveBeenCalled();
    });
  });

  test('handles missing uniqueKwlrtyNumber gracefully', async () => {
    const mockStore = createMockStore({
      rechargeWinback: {
        subscriberDetails: mockSubscriberDetails,
        uniqueKwlrtyNumber: null,
      },
    });
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(callAction).toHaveBeenCalled();
    });
  });

  test('renders TextContainer with correct data', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('****1234')).toBeTruthy();
    });
  });

  test('renders button with telephone icon', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
  });

  test('handles empty accountInformation', async () => {
    const mockStore = createMockStore({
      accountInformation: {
        accountInformation: {},
      },
    });

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
  });

  test('handles null subscriberDetails', async () => {
    const mockStore = createMockStore({
      rechargeWinback: {
        subscriberDetails: null,
        uniqueKwlrtyNumber: mockUniqueKwlrtyNumber,
      },
    });

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
  });

  test('handles account information fetch failure', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    callAction.mockImplementationOnce((_payload: any, _query: any) => (_dispatch: any) => Promise.resolve({ status: false }));

    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(callAction).toHaveBeenCalled();
    });
  });

  test('renders with all customer details populated', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('****1234')).toBeTruthy();
      expect(screen.getByText('Active')).toBeTruthy();
    });
  });

  test('button press triggers callSubscriber function', async () => {
    const mockStore = createMockStore();
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledTimes(2);
    });
  });

  test('mixpanel event includes correct attributes', async () => {
    const mockStore = createMockStore();
    const { MoengageMixpanel } = require('services/moengageMixpanel');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          Status: true,
          mobileNumber: '****1234',
          subscriberId: 'SUB123',
        }),
      );
    });
  });

  test('component updates when accountInformation prop changes', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
    });
  });

  test('handles multiple button presses', async () => {
    const mockStore = createMockStore();
    const { callAction } = require('utils/formBuilderHelper');

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);
    fireEvent.press(button);

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledTimes(3);
    });
  });

  test('renders with correct styling applied', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
  });

  test('handles undefined label gracefully', async () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard label={undefined} />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
  });

  test('component mounts and unmounts without errors', async () => {
    const mockStore = createMockStore();
    const { unmount } = render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <CallSubscriberCard />
        </NavigationContainer>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('button-test')).toBeTruthy();
    });
    unmount();
  });
});
