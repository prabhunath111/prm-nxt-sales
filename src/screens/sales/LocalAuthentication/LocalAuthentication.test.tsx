/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { checkBiometrySupport, handleLocalAuthenticate } from 'utils/localAuthHelper';
import { storageService } from 'services/storageService';
import uiActions from 'store/sales/actions/ui';
import userActions from 'store/sales/actions/user';
import LocalAuthentication from './LocalAuthentication';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('utils/localAuthHelper', () => ({
  checkBiometrySupport: jest.fn(),
  handleLocalAuthenticate: jest.fn(),
}));

jest.mock('services/storageService', () => ({
  storageService: {
    setItem: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  showError: jest.fn(),
}));

jest.mock('store/sales/actions/user', () => ({
  updateLocalAuthStatus: jest.fn(),
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
      <TouchableOpacity onPress={onPress} testID="enable-now-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Gradient: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    Image: () => null,
    Text: ({ label, onPress }: { label: string; onPress?: () => void }) => (
      <Text onPress={onPress} testID={onPress ? `press-text-${label}` : undefined}>
        {label}
      </Text>
    ),
  };
});

describe('LocalAuthentication Component', () => {
  const mockDispatch = jest.fn();
  const mockUserDetails = { userName: 'testUser' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { userDetails: mockUserDetails },
      }),
    );
  });

  it('renders LocalAuthentication component', () => {
    render(<LocalAuthentication />);
    expect(screen.getByText('strings.faceIdOrFingerPrint')).toBeTruthy();
  });

  it('handles handleEnableNow when biometry is not available', async () => {
    (checkBiometrySupport as jest.Mock).mockResolvedValue({ available: false });
    render(<LocalAuthentication />);
    fireEvent.press(screen.getByTestId('enable-now-button'));
    await waitFor(() => {
      expect(uiActions.showError).toHaveBeenCalledWith('errors.localAuthentication');
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('handles handleEnableNow when biometry is available and authentication is successful', async () => {
    (checkBiometrySupport as jest.Mock).mockResolvedValue({ available: true });
    (handleLocalAuthenticate as jest.Mock).mockResolvedValue({ success: true });
    render(<LocalAuthentication />);
    fireEvent.press(screen.getByTestId('enable-now-button'));
    await waitFor(() => {
      expect(storageService.setItem).toHaveBeenCalled();
      expect(userActions.updateLocalAuthStatus).toHaveBeenCalledWith(true);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('handles handleEnableNow when biometry is available and authentication fails', async () => {
    (checkBiometrySupport as jest.Mock).mockResolvedValue({ available: true });
    (handleLocalAuthenticate as jest.Mock).mockResolvedValue({ success: false });
    render(<LocalAuthentication />);
    fireEvent.press(screen.getByTestId('enable-now-button'));
    await waitFor(() => {
      expect(storageService.setItem).not.toHaveBeenCalled();
      expect(userActions.updateLocalAuthStatus).not.toHaveBeenCalled();
    });
  });

  it('handles handleSkip when skip text is pressed', () => {
    render(<LocalAuthentication />);
    fireEvent.press(screen.getByTestId('press-text-strings.skip'));
    expect(userActions.updateLocalAuthStatus).toHaveBeenCalledWith(true);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const tree = render(<LocalAuthentication />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
