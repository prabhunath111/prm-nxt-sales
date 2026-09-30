/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { ROUTE } from 'const';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import EvdRaiseRequestSuccess from './EvdRaiseRequestSuccess';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style, _inflection, _bool, _sizes) => style),
}));

jest.mock('components/sales', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="home-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CommonSuccess: ({ primaryText }: { primaryText: string }) => <Text>{primaryText}</Text>,
    Image: () => null,
    Text: ({ label, children }: any) => <Text>{label || children}</Text>,
  };
});

describe('EvdRaiseRequestSuccess Component', () => {
  const mockGoHome = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue({ goHome: mockGoHome, reset: mockReset });
    (useInflection as jest.Mock).mockReturnValue({ inflection: 'sm' });
  });

  const renderWithState = (isRedirection: boolean, successMessage: string) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { isRedirection },
        purchaseOrder: { successMessage },
      };
      return selector(state);
    });
    return render(<EvdRaiseRequestSuccess />);
  };

  it('renders correctly and handles back to home', () => {
    renderWithState(true, 'Order success message');
    expect(screen.getByText('Order success message')).toBeTruthy();

    fireEvent.press(screen.getByTestId('home-button'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  it('handles navigate for raise new request', () => {
    renderWithState(false, 'Success');
    fireEvent.press(screen.getByText('strings.raiseNewRequest').parent!);
    expect(mockReset).toHaveBeenCalledWith(ROUTE.WEB.PURCHASE_ORDER_REQUEST, false);
  });

  it('handles navigate for track request', () => {
    renderWithState(false, 'Success');
    fireEvent.press(screen.getByText('strings.trackRequest').parent!);
    expect(mockReset).toHaveBeenCalledWith(ROUTE.WEB.PURCHASE_ORDER_REQUEST, false);
  });

  it('renders with md inflection', () => {
    (useInflection as jest.Mock).mockReturnValue({ inflection: 'md' });
    renderWithState(false, 'Success');
    expect(screen.getByText('Success')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = renderWithState(false, 'Order success message').toJSON();
    expect(tree).toMatchSnapshot();
  });
});
