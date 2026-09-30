/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { ROUTE } from 'const';
import MyEvdBalance from './MyEvdBalance';

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'primaryText'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'sm' }),
}));

jest.mock('components/sales', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ActionTileCard: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`action-tile-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    InformationText: ({ primaryText, secondaryText }: { primaryText: string; secondaryText: string }) => (
      <View>
        <Text>{primaryText}</Text>
        <Text>{secondaryText}</Text>
      </View>
    ),
  };
});

describe('MyEvdBalance Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    // Mock useSelector to call the selector function to get coverage on it
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        evdBalanceInfo: { evdInfo: { currentBalance: 500 } },
      }),
    );
  });

  it('renders MyEvdBalance with balance info', () => {
    const { getByText } = render(<MyEvdBalance />);
    expect(getByText('strings.currentBalance')).toBeTruthy();
    expect(getByText('₹500')).toBeTruthy();
  });

  it('handles navigate for recharge transaction tile', () => {
    const { getByTestId } = render(<MyEvdBalance />);
    fireEvent.press(getByTestId('action-tile-strings.rechargeTransaction'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_TRANSACTION);
  });

  it('handles navigate for OTF credit details tile', () => {
    const { getByTestId } = render(<MyEvdBalance />);
    fireEvent.press(getByTestId('action-tile-strings.otfCreditDetails'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.OTF_CREDIT_DETAILS);
  });

  it('handles navigate for balance transfer details tile', () => {
    const { getByTestId } = render(<MyEvdBalance />);
    fireEvent.press(getByTestId('action-tile-strings.balanceTransferDetails'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.BALANCE_TRANSFER_DETAILS);
  });

  it('handles navigate for consolidated transactions tile', () => {
    const { getByTestId } = render(<MyEvdBalance />);
    fireEvent.press(getByTestId('action-tile-strings.consolidatedTransactions'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CONSOLIDATED_TRANSACTION);
  });

  it('renders correctly when evdInfo is missing or balance is null', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        evdBalanceInfo: { evdInfo: null },
      }),
    );
    const { getByText } = render(<MyEvdBalance />);
    expect(getByText('₹')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(<MyEvdBalance />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
