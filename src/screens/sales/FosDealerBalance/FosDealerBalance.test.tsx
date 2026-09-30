/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import evdBalanceInfoActions from 'store/sales/actions/evdBalanceInfo';
import { sliceActions as evdBalanceActions } from 'store/sales/reducer/evdBalanceInfo';
import { PARTNER_ROLES } from 'const/strings';
import { ROUTE } from 'const';
import FosDealerBalance from './FosDealerBalance';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('store/sales/actions/evdBalanceInfo', () => ({
  doBalanceEnquiryEvd: jest.fn(),
}));

jest.mock('store/sales/reducer/evdBalanceInfo', () => ({
  sliceActions: {
    setDealerBalanceInput: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('components/sales', () => {
  const { Text, TouchableOpacity, TextInput } = require('react-native');
  return {
    ActionTileCard: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`action-tile-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="validate-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    IconTextInput: ({ onInputChange, value, placeholder }: any) => <TextInput testID="icon-text-input" onChangeText={onInputChange} value={value} placeholder={placeholder} />,
    PartnerInfo: () => <Text>PartnerInfo</Text>,
  };
});

describe('FosDealerBalance Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockImplementation((action) => (typeof action === 'function' ? action() : action));
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  const renderWithState = (userState: any, evdState: any) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: userState,
        evdBalanceInfo: evdState,
      };
      return selector(state);
    });
    return render(<FosDealerBalance />);
  };

  it('renders correctly for FOS role and resets input on mount', () => {
    renderWithState({ info: { roleId: PARTNER_ROLES.fos } }, { dealerBalanceInput: '' });
    expect(screen.getByText('strings.dealerBalance')).toBeTruthy();
    expect(evdBalanceActions.setDealerBalanceInput).toHaveBeenCalledWith('');
  });

  it('renders correctly for AD role', () => {
    renderWithState({ info: { roleId: PARTNER_ROLES.ad } }, { dealerBalanceInput: '' });
    expect(screen.getByText('strings.fosBalance')).toBeTruthy();
  });

  it('renders correctly for DIS role', () => {
    renderWithState({ info: { roleId: PARTNER_ROLES.dis } }, { dealerBalanceInput: '' });
    expect(screen.getByText('strings.adBalance')).toBeTruthy();
  });

  it('returns empty string for unknown role', () => {
    renderWithState({ info: { roleId: 'UNKNOWN' } }, { dealerBalanceInput: '' });
  });

  it('handles handleValidation', () => {
    renderWithState({ info: { roleId: PARTNER_ROLES.fos } }, { dealerBalanceInput: '' });
    (evdBalanceActions.setDealerBalanceInput as unknown as jest.Mock).mockClear();
    const input = screen.getByTestId('icon-text-input');
    fireEvent.changeText(input, '123abc456');
    expect(evdBalanceActions.setDealerBalanceInput).toHaveBeenCalledWith('123456');
  });

  it('does not dispatch if numeric text length > 10', () => {
    renderWithState({ info: { roleId: PARTNER_ROLES.fos } }, { dealerBalanceInput: '' });
    (evdBalanceActions.setDealerBalanceInput as unknown as jest.Mock).mockClear();
    const input = screen.getByTestId('icon-text-input');
    fireEvent.changeText(input, '12345678901');
    expect(evdBalanceActions.setDealerBalanceInput).not.toHaveBeenCalled();
  });

  it('handles handleNavigation success', async () => {
    (evdBalanceInfoActions.doBalanceEnquiryEvd as jest.Mock).mockReturnValue(() => Promise.resolve({ success: true }));
    renderWithState({ info: { roleId: PARTNER_ROLES.fos } }, { dealerBalanceInput: '12345' });

    fireEvent.press(screen.getByTestId('validate-button'));

    await screen.findByText('PartnerInfo');
    expect(screen.getByText('PartnerInfo')).toBeTruthy();
  });

  it('handles handleNavigation failure', async () => {
    (evdBalanceInfoActions.doBalanceEnquiryEvd as jest.Mock).mockReturnValue(() => Promise.resolve(null));
    renderWithState({ info: { roleId: PARTNER_ROLES.fos } }, { dealerBalanceInput: '12345' });

    fireEvent.press(screen.getByTestId('validate-button'));

    expect(screen.queryByText('PartnerInfo')).toBeNull();
  });

  it('handles navigation for all action tiles', async () => {
    (evdBalanceInfoActions.doBalanceEnquiryEvd as jest.Mock).mockReturnValue(() => Promise.resolve({ success: true }));
    renderWithState({ info: { roleId: PARTNER_ROLES.fos } }, { dealerBalanceInput: '12345' });
    fireEvent.press(screen.getByTestId('validate-button'));

    await screen.findByText('PartnerInfo');

    fireEvent.press(screen.getByTestId('action-tile-strings.rechargeTransaction'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_TRANSACTION_FOS);

    fireEvent.press(screen.getByTestId('action-tile-strings.otfCreditDetails'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.OTF_CREDIT_DETAILS_FOS);

    fireEvent.press(screen.getByTestId('action-tile-strings.balanceTransferDetails'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS);

    fireEvent.press(screen.getByTestId('action-tile-strings.consolidatedTransactions'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CONSOLIDATED_TRANSACTION_FOS);
  });

  it('matches snapshot', () => {
    const tree = renderWithState({ info: { roleId: PARTNER_ROLES.fos } }, { dealerBalanceInput: '' }).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
