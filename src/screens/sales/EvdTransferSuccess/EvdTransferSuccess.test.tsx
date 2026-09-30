/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import formAction from 'store/sales/actions/form';
import { PROPERTIES, ROUTE, STATE_KEY } from 'const';
import { BreakPoints } from 'wrappers/inflection/InflectionProvider';
import EvdTransferSuccess from './EvdTransferSuccess';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('store/sales/actions/form', () => ({
  setNavigationData: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
  BreakPoints: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'transectionContainer'),
}));

jest.mock('utils/responseHelper', () => ({
  formatValue: jest.fn((_, val) => `formatted-${val}`),
}));

jest.mock('components/sales', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="home-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CommonSuccess: ({ primaryText }: { primaryText: string }) => <Text>{primaryText}</Text>,
    Image: () => null,
    InformationText: ({ primaryText, secondaryText, containerStyle }: any) => (
      <View style={containerStyle}>
        <Text>{primaryText}</Text>
        <Text>{secondaryText}</Text>
      </View>
    ),
    Link: ({ label, onPress }: any) => (
      <Text onPress={onPress} testID="reverse-transfer-link">
        {label}
      </Text>
    ),
    BalanceContainer: ({ balance }: any) => <Text>{`Balance: ${balance}`}</Text>,
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
  };
});

describe('EvdTransferSuccess Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockGoHome = jest.fn();
  const { useInflection } = require('wrappers/inflection/InflectionProvider');

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate, goHome: mockGoHome });
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.MD });
  });

  const renderWithState = (evdState: any, userState: any, formState: any) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        evdTransfer: evdState,
        user: userState,
        form: {
          [STATE_KEY.FORM_STATE]: formState,
        },
      };
      return selector(state);
    });
    return render(<EvdTransferSuccess />);
  };

  it('renders forward transfer for non-restricted role and handles reverse link press', () => {
    const evdState = {
      evdTransferSuccessData: { subMessage: 'Success', transactionId: 'TX123', newBalance: 1000, partnerName: 'John', partnerMdn: '9876543210', amountTransfer: 500 },
    };
    const userState = { info: { internalRole: 'SOME_OTHER_ROLE' }, isRedirection: false };
    const formState = { formNavigationData: { params: { transferType: PROPERTIES.EVD_TRANSFER.forwardTransfer } } };

    renderWithState(evdState, userState, formState);

    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('Balance: 1000')).toBeTruthy();
    expect(screen.getByText('strings.reverseTransfer')).toBeTruthy();

    fireEvent.press(screen.getByTestId('reverse-transfer-link'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.EVD_TRANSFER);
    expect(formAction.setNavigationData).toHaveBeenCalledWith({ transferType: PROPERTIES.EVD_TRANSFER.reverseTransfer }, '', '', '');
  });

  it('renders forward transfer for restricted role (no reverse link)', () => {
    const evdState = {
      evdTransferSuccessData: { subMessage: 'Success', transactionId: 'TX123', newBalance: 1000, partnerName: 'John', partnerMdn: '9876543210', amountTransfer: 500 },
    };
    const userState = { info: { internalRole: PROPERTIES.ROLES.fos }, isRedirection: false };
    const formState = { formNavigationData: { params: { transferType: PROPERTIES.EVD_TRANSFER.forwardTransfer } } };

    renderWithState(evdState, userState, formState);
    expect(screen.queryByTestId('reverse-transfer-link')).toBeNull();
  });

  it('renders asm transfer with dealerId and handles navigation', () => {
    const evdState = {
      evdTransferSuccessData: { subMessage: 'ASM Success', transactionId: 'TX456', partnerName: 'Jane', partnerMdn: '0123456789', amountTransfer: 200, dealerId: 'D789' },
    };
    const userState = { info: { internalRole: 'ASM' }, isRedirection: true };
    const formState = { formNavigationData: { params: { transferType: PROPERTIES.EVD_TRANSFER.asmTransfer } } };

    renderWithState(evdState, userState, formState);

    expect(screen.getByText('D789')).toBeTruthy();
    expect(screen.queryByText(/Balance:/)).toBeNull(); // asmTransfer doesn't show balance

    // Test handleNavigation
    const navigationContainer = screen.getByText('strings.dealerReverseTransfer').parent!;
    fireEvent.press(navigationContainer);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.EVD_TRANSFER);
    expect(formAction.setNavigationData).toHaveBeenCalledWith({ transferType: PROPERTIES.EVD_TRANSFER.asmTransfer }, '', '', '');
  });

  it('renders asm transfer without dealerId (dealerId is falsy)', () => {
    const evdState = {
      evdTransferSuccessData: { subMessage: 'ASM Success', transactionId: 'TX456', partnerName: 'Jane', partnerMdn: '0123456789', amountTransfer: 200, dealerId: '' },
    };
    const userState = { info: { internalRole: 'ASM' }, isRedirection: true };
    const formState = { formNavigationData: { params: { transferType: PROPERTIES.EVD_TRANSFER.asmTransfer } } };

    renderWithState(evdState, userState, formState);

    expect(screen.queryByText('id')).toBeNull();
  });

  it('renders for SM breakpoint', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: BreakPoints.SM });
    const evdState = { evdTransferSuccessData: { subMessage: 'Success', transactionId: 'TX123', partnerName: 'John', partnerMdn: '9876543210' } };
    const userState = { info: {}, isRedirection: false };
    const formState = { formNavigationData: { params: { transferType: PROPERTIES.EVD_TRANSFER.reverseTransfer } } };

    renderWithState(evdState, userState, formState);
    expect(screen.getByText('strings.transactionID')).toBeTruthy();
    expect(screen.getByText('TX123')).toBeTruthy();
  });

  it('handles goHome when button is pressed', () => {
    const evdState = { evdTransferSuccessData: { subMessage: 'Success' } };
    const userState = { isRedirection: true };
    const formState = { formNavigationData: { params: {} } };

    renderWithState(evdState, userState, formState);
    fireEvent.press(screen.getByTestId('home-button'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  it('matches snapshot', () => {
    const evdState = { evdTransferSuccessData: { subMessage: 'Success', transactionId: 'TX123', partnerName: 'John', partnerMdn: '9876543210' } };
    const userState = { info: {}, isRedirection: false };
    const formState = { formNavigationData: { params: { transferType: PROPERTIES.EVD_TRANSFER.forwardTransfer } } };

    const tree = renderWithState(evdState, userState, formState).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
