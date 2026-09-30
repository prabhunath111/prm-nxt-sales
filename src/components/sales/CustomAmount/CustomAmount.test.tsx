/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ICONS, VALUE_TYPE } from 'const';
import CustomAmount from './CustomAmount';

// ==================== MOCKS ====================

const mockCustomAmount = { value: '500' };

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => selector({ common: { customAmount: mockCustomAmount.value } })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('utils/responseHelper', () => ({
  formatValue: (type: string, value: any) => `${type}:${value}`,
}));

jest.mock('components/sales/Radio', () => {
  const { TouchableOpacity, Text: RNText } = require('react-native');
  return ({ text, isSelected, onPress }: any) => (
    <TouchableOpacity testID={`radio-${text}`} onPress={onPress}>
      <RNText>{isSelected ? 'Selected' : 'Unselected'}</RNText>
      <RNText>{text}</RNText>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/IconTextInput', () => {
  const { TextInput } = require('react-native');
  return ({ value, onInputChange, placeholder }: any) => <TextInput testID="icon-text-input" value={value} onChangeText={onInputChange} placeholder={placeholder} />;
});

jest.mock('components/sales/Image', () => {
  const { View: RNView } = require('react-native');
  return ({ iconName }: any) => <RNView testID={`image-${iconName}`} />;
});

jest.mock('components/sales/Text', () => {
  const { Text: RNText } = require('react-native');
  return ({ label, style }: any) => <RNText style={style}>{label}</RNText>;
});

// Mock styles
jest.mock('./CustomAmount.styles', () => ({
  container: {},
  balanceContainer: {},
  partnerContainer: {},
  selectPartnerLabel: {},
  radioContainerStyle: {},
  amountTextContainer: {},
  lightTextStyle: {},
  columnContainer: {},
  amountContainerStyle: {},
}));

describe('Test for the component CustomAmount', () => {
  const mockOnAmountChange = jest.fn();
  const radioTextArr = ['Full amount', 'Custom amount'];
  const userDetails = { name: 'John Doe', walletBalance: '1000' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCustomAmount.value = '500';
  });

  test('renders component CustomAmount with user details and customAmount', () => {
    render(<CustomAmount userDetails={userDetails} radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} headerLabel="Select Amount" />);

    expect(screen.getByText("John Doe's strings.walletBalance")).toBeTruthy();
    expect(screen.getByText(`${VALUE_TYPE.AMOUNT}:500`)).toBeTruthy();
    expect(screen.getByText('Select Amount')).toBeTruthy();
    expect(screen.getByTestId(`image-${ICONS.RUPEE_SYMBOL}`)).toBeTruthy();
  });

  test('does not render balance container if userDetails or customAmount is missing', () => {
    mockCustomAmount.value = '';
    const { rerender } = render(<CustomAmount userDetails={userDetails} radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} />);
    expect(screen.queryByText(/strings.walletBalance/)).toBeNull();

    mockCustomAmount.value = '500';
    rerender(<CustomAmount radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} />);
    expect(screen.queryByText(/strings.walletBalance/)).toBeNull();
  });

  test('handles full amount selection', () => {
    render(<CustomAmount userDetails={userDetails} radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} />);

    const fullAmountRadio = screen.getByTestId(`radio-${radioTextArr[0]}`);
    fireEvent.press(fullAmountRadio);

    // useEffect should trigger onAmountChange with customAmount
    expect(mockOnAmountChange).toHaveBeenCalledWith('500');
  });

  test('handles custom amount selection and input change', () => {
    render(<CustomAmount userDetails={userDetails} radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} />);

    const input = screen.getByTestId('icon-text-input');
    fireEvent.changeText(input, '200');

    // handleAmountChange sets selectedRadio to customAmount and updates amount
    // useEffect should trigger onAmountChange with '200'
    expect(mockOnAmountChange).toHaveBeenCalledWith('200');
  });

  test('handles radio button press for custom amount', () => {
    render(<CustomAmount userDetails={userDetails} radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} />);

    const customAmountRadio = screen.getByTestId(`radio-${radioTextArr[1]}`);
    fireEvent.press(customAmountRadio);

    // Should call onAmountChange with current amount (which is empty string initially)
    expect(mockOnAmountChange).toHaveBeenCalledWith('');
  });

  test('useEffect clears amount if customAmount is missing', () => {
    mockCustomAmount.value = '';
    render(<CustomAmount userDetails={userDetails} radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} />);

    expect(mockOnAmountChange).toHaveBeenCalledWith('');
  });

  test('useEffect returns early if userDetails is missing', () => {
    render(<CustomAmount radioTextArr={radioTextArr} onAmountChange={mockOnAmountChange} />);

    // onAmountChange should NOT be called because of the early return in useEffect
    expect(mockOnAmountChange).not.toHaveBeenCalled();
  });
});
