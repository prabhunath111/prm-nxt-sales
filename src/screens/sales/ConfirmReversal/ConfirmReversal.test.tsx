/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { fieldValidation } from 'utils/ValidationHelper';
import { checkFixLength } from 'utils/formBuilderHelper';
import { ROUTE } from 'const';
import ConfirmReversal from './ConfirmReversal';

// Mock dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', MD_L: 'mdL', SM: 'sm', XS: 'xs' },
}));

jest.mock('hooks/useCurrentRoute', () => jest.fn());

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: { trackEvent: jest.fn() },
  MoengageMixpanelModules: {
    RechargeReversal: {
      RechargeReversalProceed: { moduleName: 'RechargeReversalProceed' },
      RechargeReversalDetails: {
        moduleName: 'RechargeReversalDetails',
        attributes: { Message: 'Message', Status: 'Status', ReversalReason: 'ReversalReason', TransactionID: 'TransactionID', SubscriberID: 'SubscriberID' },
      },
    },
  },
}));

jest.mock('utils/responseHelper', () => ({
  formatValue: jest.fn((_type, val) => val),
}));

jest.mock('utils/ValidationHelper', () => ({
  fieldValidation: jest.fn(),
}));

jest.mock('utils/dateHelper', () => ({
  calculateDaysDifference: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  checkFixLength: jest.fn(),
}));

// Mock internal components
jest.mock('components/sales', () => {
  const rn = require('react-native');
  return {
    Button: (props: any) => (
      <rn.TouchableOpacity onPress={props.onPress} testID={props.testID || `button-${props.label}`}>
        <rn.Text>{props.label}</rn.Text>
      </rn.TouchableOpacity>
    ),
    Card: (props: any) => <rn.View style={props.cardStyle}>{props.children}</rn.View>,
    TextInput: (props: any) => <rn.TextInput value={props.value} onChangeText={props.onChangeText} testID="text-input" />,
    Text: (props: any) => <rn.Text style={props.style}>{props.label || props.children}</rn.Text>,
    Dropdown: (props: any) => (
      <rn.View testID="dropdown">
        {props.error ? <rn.Text>{props.error}</rn.Text> : null}
        {props.data.map((item: any) => (
          <rn.TouchableOpacity key={item.name} onPress={() => props.onSelect(item)} testID={`dropdown-item-${item.name}`}>
            <rn.Text>{item.name}</rn.Text>
          </rn.TouchableOpacity>
        ))}
      </rn.View>
    ),
    TextContainer: (props: any) => {
      const rn = require('react-native');
      return (
        <rn.View testID="text-container">
          {Object.values(props.data || {}).map((v: any, i) => (
            <rn.Text key={i}>{v}</rn.Text>
          ))}
        </rn.View>
      );
    },
    FormHeader: (_props: any) => <rn.View testID="form-header" />,
    KeyboardDismissContainer: (props: any) => <rn.View>{props.children}</rn.View>,
    IconTextInput: (props: any) => (
      <rn.View>
        <rn.TextInput value={props.value} onChangeText={props.onInputChange} testID="icon-text-input" />
        {props.error ? <rn.Text>{props.error}</rn.Text> : null}
        <rn.TouchableOpacity onPress={props.onIconPress} testID="icon-press" />
      </rn.View>
    ),
  };
});

describe('ConfirmReversal Component', () => {
  const mockDispatch = jest.fn();
  const mockState = {
    transactionHistory: {
      transactionDetails: {
        subscriberId: 'SUB123',
        inTransId: 'TXN123',
        chargeableAmount: '100',
        requestDate: '2023-01-01',
        requestDateNT: '2023-01-01',
        reversalEligibleDaysCount: 5,
      },
      transactionHistory: [],
      isTransactionDetails: false,
      balance: '200',
      reversalReasons: [{ name: 'Reason 1', nameNT: 'REASON_1' }],
    },
    user: {
      info: { mdn: '9999999999', userId: 'USER123' },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: 'md' });
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: 'ConfirmReversal' });
    (fieldValidation as jest.Mock).mockReturnValue([false, '']);
    (checkFixLength as jest.Mock).mockReturnValue(true);
  });

  test('renders initial state correctly', () => {
    render(<ConfirmReversal />);
    expect(screen.getByTestId('text-container')).toBeTruthy();
  });

  test('handles confirmBalance action', () => {
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByText('strings.confirmBalance'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('validates required reason on confirm', () => {
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByText('strings.confirm'));
    expect(screen.getByText('strings.rechargeReversalReason')).toBeTruthy();
  });

  test('handles pin input logic', () => {
    render(<ConfirmReversal />);
    const input = screen.getByTestId('icon-text-input');
    fireEvent.changeText(input, '1');
    fireEvent.changeText(input, '12');
    fireEvent.changeText(input, '1');
    fireEvent.changeText(input, '1234');
    fireEvent.changeText(input, '1234a');
    fireEvent.press(screen.getByTestId('icon-press'));
    fireEvent.changeText(input, '12');
  });

  test('handles initial pin validation error', () => {
    (fieldValidation as jest.Mock).mockReturnValue([true, 'strings.invalidPin']);
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByTestId('dropdown-item-Reason 1'));
    fireEvent.press(screen.getByText('strings.confirm'));
    expect(screen.getByText('strings.invalidPin')).toBeTruthy();
  });

  test('handles pin length validation error', () => {
    (checkFixLength as jest.Mock).mockReturnValue(false);
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByTestId('dropdown-item-Reason 1'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), '12');
    fireEvent.press(screen.getByText('strings.confirm'));
    expect(screen.getByText('validations.pinFixLength')).toBeTruthy();
  });

  test('completes confirmation (Web flow)', () => {
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.CONFIRM_REVERSAL_INFO });
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByTestId('dropdown-item-Reason 1'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), '1234');
    fireEvent.press(screen.getByText('strings.confirm'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles diffDate > reversalEligibleDaysCount error', () => {
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: 'Mobile' });
    const { calculateDaysDifference } = require('utils/dateHelper');
    calculateDaysDifference.mockReturnValue(10);

    render(<ConfirmReversal />);
    fireEvent.press(screen.getByTestId('dropdown-item-Reason 1'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), '1234');
    fireEvent.press(screen.getByText('strings.confirm'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles amount > balance error', () => {
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: 'Mobile' });
    const { calculateDaysDifference } = require('utils/dateHelper');
    calculateDaysDifference.mockReturnValue(1);
    const customState = {
      ...mockState,
      transactionHistory: { ...mockState.transactionHistory, balance: '50' },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(customState));

    render(<ConfirmReversal />);
    fireEvent.press(screen.getByTestId('dropdown-item-Reason 1'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), '1234');
    fireEvent.press(screen.getByText('strings.confirm'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('completes confirmation (Mobile success path)', () => {
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: 'Mobile' });
    const { calculateDaysDifference } = require('utils/dateHelper');
    calculateDaysDifference.mockReturnValue(1);

    render(<ConfirmReversal />);
    fireEvent.press(screen.getByTestId('dropdown-item-Reason 1'));
    fireEvent.changeText(screen.getByTestId('icon-text-input'), '1234');
    fireEvent.press(screen.getByText('strings.confirm'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('handles cancelHandler variants', () => {
    // Info
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.CONFIRM_REVERSAL_INFO });
    let { unmount } = render(<ConfirmReversal />);
    fireEvent.press(screen.getByText('strings.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_TRANSACTION);
    unmount();

    // FOS
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: ROUTE.WEB.CONFIRM_REVERSAL_INFO_FOS });
    ({ unmount } = render(<ConfirmReversal />));
    fireEvent.press(screen.getByText('strings.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_TRANSACTION_FOS);
    unmount();

    // Details Reversal
    const detailState = {
      ...mockState,
      transactionHistory: { ...mockState.transactionHistory, isTransactionDetails: true },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(detailState));
    (useCurrentRoute as unknown as jest.Mock).mockReturnValue({ routeName: 'Any' });
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByText('strings.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_REVERSAL);
    unmount();

    // Else (Empty history)
    const emptyHistoryState = {
      ...mockState,
      transactionHistory: { ...mockState.transactionHistory, isTransactionDetails: false, transactionHistory: [] },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(emptyHistoryState));
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByText('strings.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_REVERSAL);
    unmount();

    // Else (With history)
    const historyState = {
      ...mockState,
      transactionHistory: { ...mockState.transactionHistory, isTransactionDetails: false, transactionHistory: [{ id: 1 }] },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(historyState));
    render(<ConfirmReversal />);
    fireEvent.press(screen.getByText('strings.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.TRANSACTION_HISTORY);
  });

  test('unmounts and resets info', () => {
    const { unmount } = render(<ConfirmReversal />);
    unmount();
    expect(mockDispatch).toHaveBeenCalled();
  });
});
