/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { ROUTE, STRINGS } from 'const';
import evdMdnChange from 'store/sales/actions/evdMdnChange';
import EvdMdnDistSuccess from './EvdMdnDistSuccess';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('store/sales/actions/evdMdnChange', () => ({
  resetEvdMdnPartnerList: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('components/sales', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="home-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CommonSuccess: ({ primaryText, iconName }: any) => (
      <View testID="common-success">
        <Text>{primaryText}</Text>
        <Text>{iconName}</Text>
      </View>
    ),
    Image: () => null,
    InformationText: ({ primaryText, secondaryText }: any) => (
      <View>
        <Text>{primaryText}</Text>
        <Text>{secondaryText}</Text>
      </View>
    ),
    Text: ({ label, children, style }: any) => {
      if (typeof children === 'string') return <Text style={style}>{children}</Text>;
      if (label) return <Text style={style}>{label}</Text>;
      return <Text style={style}>{children}</Text>;
    },
  };
});

describe('EvdMdnDistSuccess Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockGoHome = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate, goHome: mockGoHome });
  });

  const renderWithState = (isRedirection: boolean, successData: any) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { isRedirection },
        evdMdnChange: { evdMdnDistSuccessData: successData },
      };
      return selector(state);
    });
    return render(<EvdMdnDistSuccess />);
  };

  it('renders correctly without reason and handles back to home', () => {
    const successData = {
      message: 'Success Message',
      partnerName: 'Partner Name',
      partnerId: 'P123',
      newRmn: '9876543210',
      reason: null,
    };
    renderWithState(true, successData);
    expect(screen.getByText('Success Message')).toBeTruthy();
    expect(screen.getByText('Partner Name')).toBeTruthy();
    expect(screen.getByText('P123')).toBeTruthy();
    expect(screen.getByText('9876543210')).toBeTruthy();
    expect(screen.queryByText(STRINGS.REASON_FOR_REJECTION)).toBeNull();

    fireEvent.press(screen.getByTestId('home-button'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  it('renders correctly with reason for rejection', () => {
    const successData = {
      message: 'Rejection Message',
      partnerName: 'Partner Name',
      partnerId: 'P123',
      newRmn: '9876543210',
      reason: 'Missing Documents',
    };
    renderWithState(false, successData);
    expect(screen.getByText('Rejection Message')).toBeTruthy();
    expect(screen.getByText('Missing Documents')).toBeTruthy();
    expect(screen.getByText(STRINGS.REASON_FOR_REJECTION)).toBeTruthy();
  });

  it('handles navigation for ACTION_MDN', () => {
    const successData = { message: 'Success' };
    renderWithState(false, successData);

    // Test action mdn navigation
    fireEvent.press(screen.getByText('strings.actionMdnChange').parent!);
    expect(evdMdnChange.resetEvdMdnPartnerList).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.EVD_MDN_APPROVE_OR_REJECT);
  });

  it('handles navigation for other branch (TRACK_EVD_MDN_CHANGE)', () => {
    const successData = { message: 'Success' };
    renderWithState(false, successData);

    // Test track change navigation
    fireEvent.press(screen.getByText('strings.trackMdnChange').parent!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.FILTER_EVD_MDN_CHANGE);
  });

  it('matches snapshot', () => {
    const successData = { message: 'Success', partnerName: 'Name', partnerId: 'ID', newRmn: '123' };
    const tree = renderWithState(false, successData).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
