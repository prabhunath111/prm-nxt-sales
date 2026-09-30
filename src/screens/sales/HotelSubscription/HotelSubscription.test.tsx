/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';

// Mock dependencies EARLY
let mockIsWeb = false;
jest.mock('utils/platformHelper', () => ({
  get isWeb() {
    return mockIsWeb;
  },
}));

jest.mock('utils/externalAppLinkHelper', () => ({
  openBrowser: jest.fn(),
}));

const mockGetHotelSubscriptionURLThunk = jest.fn();
jest.mock('store/sales/actions/common', () => ({
  getHotelSubscriptionURL: jest.fn(() => mockGetHotelSubscriptionURLThunk),
}));

const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () =>
  jest.fn(() => ({
    goHome: mockGoHome,
  })),
);

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.Linking.openURL = jest.fn();
  return rn;
});

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('components/sales', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ label, children, onPress }: any) => <Text onPress={onPress}>{label || children}</Text>,
  };
});

describe('HotelSubscription Component', () => {
  const mockDispatch = jest.fn();
  const mockOpenBrowser = require('utils/externalAppLinkHelper').openBrowser;
  const { Linking } = require('react-native');

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockReturnValue({ isRedirection: false });

    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') return action();
      return Promise.resolve(action);
    });

    global.window = {
      open: jest.fn(),
    } as any;

    mockIsWeb = false;
  });

  const setupMockUrl = (url: string | null = 'https://hotel-sub.com') => {
    mockGetHotelSubscriptionURLThunk.mockResolvedValue({ data: { url } });
  };

  const getComponent = () => {
    const HotelSubscription = require('./HotelSubscription').default;
    return <HotelSubscription />;
  };

  it('handles native platform redirection (not web)', async () => {
    mockIsWeb = false;
    setupMockUrl();
    render(getComponent());

    await waitFor(() => {
      expect(mockOpenBrowser).toHaveBeenCalledWith('https://hotel-sub.com');
      expect(mockGoHome).toHaveBeenCalledWith(false);
    });
  });

  it('handles web platform with popup allowed', async () => {
    mockIsWeb = true;
    setupMockUrl();

    // Initial call returns a mock window object (popups allowed)
    (global.window.open as jest.Mock).mockReturnValue({ close: jest.fn() });

    render(getComponent());

    await waitFor(() => {
      // First call is the real URL
      expect(global.window.open).toHaveBeenCalledWith('https://hotel-sub.com', '_blank', 'noopener,noreferrer');
      expect(mockGoHome).toHaveBeenCalledWith(false);
    });
  });

  it('handles web platform with popup blocked', async () => {
    mockIsWeb = true;
    setupMockUrl();

    // Force popup blocked by returning null on all calls
    (global.window.open as jest.Mock).mockReturnValue(null);

    render(getComponent());

    await waitFor(() => {
      expect(screen.getByText('strings.popupBlocked')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('strings.popupBlocked'));
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  it('handles web platform with cordova_iab', async () => {
    mockIsWeb = true;
    setupMockUrl();
    (global.window as any).webkit = {
      messageHandlers: {
        cordova_iab: {
          postMessage: jest.fn(),
        },
      },
    };

    render(getComponent());

    await waitFor(() => {
      expect((global.window as any).webkit.messageHandlers.cordova_iab.postMessage).toHaveBeenCalled();
    });
  });

  it('handles native fallback using Linking', async () => {
    mockIsWeb = true;
    setupMockUrl();
    (global.window.open as jest.Mock).mockReturnValue(null);

    render(getComponent());

    await waitFor(() => {
      expect(screen.getByText('strings.popupBlocked')).toBeTruthy();
    });

    mockIsWeb = false;
    fireEvent.press(screen.getByText('strings.popupBlocked'));
    expect(Linking.openURL).toHaveBeenCalledWith('https://hotel-sub.com');
  });

  it('does nothing if url is missing', async () => {
    setupMockUrl(null);
    render(getComponent());

    await waitFor(() => {
      expect(mockOpenBrowser).not.toHaveBeenCalled();
    });
  });
});
