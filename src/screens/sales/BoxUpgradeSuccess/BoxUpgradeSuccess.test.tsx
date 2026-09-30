/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import BoxUpgradeSuccess from './BoxUpgradeSuccess';

const mockNavigate = jest.fn();
const mockGoHome = jest.fn();

jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goHome: mockGoHome,
}));

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(() => ({ routeName: 'MOCK_ROUTE' })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    BoxUpgrade: {
      BoxUpgradeDownloadInvoice: {
        moduleName: 'BOX_UPGRADE_DOWNLOAD_INVOICE',
        attributes: {
          Status: 'Status',
          transactionId: 'transactionId',
        },
      },
    },
  },
}));

jest.mock('const', () => ({
  ...jest.requireActual('const'),
  ROUTE: {
    WEB: {
      BOX_TYPE_SUCCESS: 'BOX_TYPE_SUCCESS',
      RECHARGE_REVERSAL: 'RECHARGE_REVERSAL',
      MODIFY_PACK: 'MODIFY_PACK',
    },
  },
  STATE_KEY: {
    MODAL_STATE: 'MODAL_STATE',
  },
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    Button: ({ label, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{label}</Text>
      </Pressable>
    ),
    CommonSuccess: ({ primaryText, iconName }: any) => (
      <View>
        <Text>{primaryText}</Text>
        <Text>{iconName}</Text>
      </View>
    ),
    CustomerDetailsCard: () => (
      <View>
        <Text>Customer Details</Text>
      </View>
    ),
    Image: ({ iconName }: any) => (
      <View>
        <Text>{iconName}</Text>
      </View>
    ),
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
  };
});

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithProvider = (component: React.ReactElement, state: any) => {
  const store = configureStore({
    reducer: {
      user: () => state.user || { isRedirection: false },
      boxUpgrade: () => state.boxUpgrade || {},
      ui: () => state.ui || { isLoading: false },
    },
  });

  return render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>,
  );
};

describe('BoxUpgradeSuccess Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders success state correctly', () => {
    const state = {
      boxUpgrade: {
        status: 'strings.success',
        SubscriberID: 'SUB123',
        SrNo: 'SR001',
        TransactionID: 'TXN123',
        paidAmount: '500',
        rechargeFlag: true,
        upgradeMsg: 'Upgrade successful',
      },
      ui: { isLoading: false },
    };

    renderWithProvider(<BoxUpgradeSuccess />, state);

    expect(screen.getByText(/Upgrade successful/i)).toBeTruthy();
    expect(screen.getByText(/SR001/i)).toBeTruthy();
    expect(screen.getByText(/TXN123/i)).toBeTruthy();
    expect(screen.getByText(/SUB123/i)).toBeTruthy();
  });

  test('renders failure state correctly', () => {
    const state = {
      boxUpgrade: {
        status: 'Failed',
        SubscriberID: 'SUB123',
        SrNo: 'SR001',
      },
    };

    renderWithProvider(<BoxUpgradeSuccess />, state);

    expect(screen.getByText('SR001')).toBeTruthy();
  });

  test('triggers goHome function via button press', () => {
    const state = {
      boxUpgrade: {
        status: 'strings.success',
      },
      user: {
        isRedirection: true,
      },
    };

    renderWithProvider(<BoxUpgradeSuccess />, state);

    fireEvent.press(screen.getByText('strings.backToHome'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  test('covers handleDownloadInvoice function', () => {
    const state = {
      boxUpgrade: {
        status: 'strings.success',
        TransactionID: 'TXN123',
      },
      ui: { isLoading: false },
    };

    renderWithProvider(<BoxUpgradeSuccess />, state);

    fireEvent.press(screen.getByText(/downloadInvoice/i));
    const { MoengageMixpanel } = require('services/moengageMixpanel');
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('covers moduleRouteHandler with timeout', () => {
    jest.useFakeTimers();
    const state = {
      boxUpgrade: {
        status: 'strings.success',
        TransactionID: 'TXN123',
        SubscriberID: 'SUB123',
      },
    };

    renderWithProvider(<BoxUpgradeSuccess />, state);

    fireEvent.press(screen.getByText('forms.modifyPack'));
    jest.advanceTimersByTime(500);
    expect(mockNavigate).toHaveBeenCalledWith('MODIFY_PACK');
    jest.useRealTimers();
  });

  test('covers moduleRouteHandler for recharge reversal branch', () => {
    const state = {
      boxUpgrade: {
        status: 'strings.success',
        TransactionID: 'TXN123',
      },
    };

    renderWithProvider(<BoxUpgradeSuccess />, state);

    fireEvent.press(screen.getByText('forms.rechargeReversal'));
    expect(mockNavigate).toHaveBeenCalledWith('RECHARGE_REVERSAL');
  });

  test('renders correctly for BOX_TYPE_SUCCESS route', () => {
    const state = {
      boxUpgrade: {
        status: 'strings.success',
        SrNo: 'SR001',
        upgradeMsg: '',
      },
    };

    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: 'BOX_TYPE_SUCCESS' });

    renderWithProvider(<BoxUpgradeSuccess />, state);
    expect(screen.getByText(/woNumber/i)).toBeTruthy();
  });

  test('covers failure state with rechargeFlag', () => {
    const state = {
      boxUpgrade: {
        status: 'Failed',
        TransactionID: 'TXN123',
        rechargeFlag: true,
      },
    };

    renderWithProvider(<BoxUpgradeSuccess />, state);
    expect(screen.getByText(/rechargeAmountReversal/i)).toBeTruthy();
  });
});
