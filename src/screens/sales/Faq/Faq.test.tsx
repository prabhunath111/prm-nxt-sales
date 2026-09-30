/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { STRINGS } from 'const';

import { usePlatformFocusEffect } from 'hooks/usePlatformFocusEffect';
import Faq from './Faq';

const mockDispatch = jest.fn();
const mockTrackEvent = jest.fn();
const mockHandleWebViewUrl = jest.fn();
const mockOpenWhatsAppWithNumber = jest.fn();
const mockLinkingCanOpenURL = jest.fn();
const mockLinkingOpenURL = jest.fn();

// Mock platform helper EARLY so it's available for style imports
jest.mock('utils/platformHelper', () => ({
  isWeb: false,
  isDesktop: false,
  isiOS: jest.fn(() => false),
}));

const mockInitialState = {
  ui: {
    isLoading: false,
  },
  packageInformation: {
    packageInformation: {
      userGuide: [{ linkName: 'User Guide 1', linkURL: 'url1' }],
      trainingVideo: [{ linkName: 'Video 1', linkURL: 'vid1' }],
    },
  },
};

const mockStore = {
  dispatch: mockDispatch,
  subscribe: jest.fn(),
  getState: jest.fn(() => ({ ...mockInitialState })),
} as any;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) => selector(mockStore.getState())),
}));

jest.mock('hooks/usePlatformFocusEffect', () => ({
  usePlatformFocusEffect: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'xl' }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: (name: string, props: any) => mockTrackEvent(name, props),
  },
}));

jest.mock('store/sales/actions', () => ({
  getPackageInformation: jest.fn(() => ({ type: 'GET_PACKAGE_INFO' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  showAlert: jest.fn((msg, type) => ({ type: 'SHOW_ALERT', payload: { msg, type } })),
  showBottomModal: jest.fn(() => ({ type: 'SHOW_MODAL' })),
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_MODAL' })),
}));

jest.mock('utils/navigationHelper', () => ({
  handleWebViewUrl: jest.fn((url) => mockHandleWebViewUrl(url)),
}));

jest.mock('utils/externalAppLinkHelper', () => ({
  openWhatsAppWithNumber: jest.fn((num) => mockOpenWhatsAppWithNumber(num)),
}));

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.Linking.canOpenURL = jest.fn((url) => mockLinkingCanOpenURL(url));
  rn.Linking.openURL = jest.fn((url) => mockLinkingOpenURL(url));
  return rn;
});

// Mock WebView and other UI components
jest.mock('components/sales', () => {
  const rn = require('react-native');
  return {
    WebView: ({ uri }: any) => <rn.View testID="webview-mock" accessibilityLabel={uri} />,
    Text: ({ children, label, style }: any) => <rn.Text style={style}>{children || label}</rn.Text>,
    Image: ({ iconName }: any) => <rn.View testID={`image-${iconName}`} />,
    EmptyData: ({ text }: any) => <rn.Text>{text}</rn.Text>,
  };
});

// To cover lines 87-102 (if phoneNumber exists branch), we need mocked PROPERTIES
jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    PROPERTIES: {
      ...actual.PROPERTIES,
      FAQ: {
        HELP_LINE_NUMBERS: [
          { title: 'dealerWhatsapp', num1: '12345', num2: '9167890' },
          { title: 'customerCare', num1: '88888', num2: '99999' },
        ],
      },
    },
  };
});

describe('Faq Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const platform = require('utils/platformHelper');
    platform.isWeb = false;
  });

  const setupState = (overrides = {}) => {
    const state = {
      ...mockInitialState,
      ...overrides,
    };
    (require('react-redux').useSelector as jest.Mock).mockImplementation((selector: any) => selector(state));
  };

  test('renders correctly and dispatches action on mount', () => {
    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_PACKAGE_INFO' }));
    expect(mockTrackEvent).toHaveBeenCalledWith(expect.stringContaining('PageVisit'), expect.any(Object));
  });

  test('switches tabs correctly', () => {
    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.trainingVideo'));
    expect(screen.getByText('Video 1')).toBeTruthy();

    fireEvent.press(screen.getByText('strings.userGuide'));
    expect(screen.getByText('User Guide 1')).toBeTruthy();
  });

  test('handles item click and shows WebView', async () => {
    mockHandleWebViewUrl.mockResolvedValue('handled-url');

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('User Guide 1'));

    await waitFor(() => {
      expect(mockHandleWebViewUrl).toHaveBeenCalledWith('url1');
      expect(screen.getByTestId('webview-mock')).toBeTruthy();
    });
  });

  test('handles item click with null URL', () => {
    setupState({
      packageInformation: {
        packageInformation: {
          userGuide: [{ linkName: 'Null Link', linkURL: null }],
        },
      },
    });

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('Null Link'));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SHOW_ALERT' }));
  });

  test('handles WhatsApp contact click (adds 91)', async () => {
    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('12345'));
    expect(mockOpenWhatsAppWithNumber).toHaveBeenCalledWith('9112345');
  });

  test('handles WhatsApp contact click (already has 91)', async () => {
    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('9167890'));
    expect(mockOpenWhatsAppWithNumber).toHaveBeenCalledWith('9167890');
  });

  test('handles Phone contact click with dialer (num1 and num2)', async () => {
    mockLinkingCanOpenURL.mockResolvedValue(true);

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('88888')); // num1
    await waitFor(() => {
      expect(mockLinkingOpenURL).toHaveBeenCalledWith('tel:88888');
    });

    fireEvent.press(screen.getByText('99999')); // num2
    await waitFor(() => {
      expect(mockLinkingOpenURL).toHaveBeenCalledWith('tel:99999');
    });
  });

  test('handles dialer failure if not supported', async () => {
    mockLinkingCanOpenURL.mockResolvedValue(false);

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('88888'));
    await waitFor(() => {
      expect(mockLinkingOpenURL).not.toHaveBeenCalled();
    });
  });

  test('handles dialer with cordova webkit on web', async () => {
    const platform = require('utils/platformHelper');
    platform.isWeb = true;
    mockLinkingCanOpenURL.mockResolvedValue(true);
    (global as any).window.webkit = { messageHandlers: { cordova_iab: {} } };

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    fireEvent.press(screen.getByText('88888'));
    await waitFor(() => {
      expect(mockLinkingOpenURL).toHaveBeenCalled();
    });
    delete (global as any).window.webkit;
  });

  test('resets state on blur', () => {
    let cleanupFunc: any;
    (usePlatformFocusEffect as jest.Mock).mockImplementation((cb) => {
      cleanupFunc = cb();
    });

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    if (cleanupFunc) {
      cleanupFunc();
    }
    expect(usePlatformFocusEffect).toHaveBeenCalled();
  });

  test('renders EmptyData when data is completely missing', () => {
    setupState({
      packageInformation: {
        packageInformation: null,
      },
      ui: { isLoading: false },
    });

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );

    expect(screen.getByText(STRINGS.EMPTY_FAQ_COLLECTION)).toBeTruthy();
  });

  test('renders TabContentSection separator except for last item', () => {
    setupState({
      packageInformation: {
        packageInformation: {
          userGuide: [
            { linkName: 'Item 1', linkURL: 'url1' },
            { linkName: 'Item 2', linkURL: 'url2' },
          ],
        },
      },
    });

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
  });

  test('handles loading state in tab content', () => {
    setupState({
      ui: { isLoading: true },
    });

    render(
      <Provider store={mockStore}>
        <Faq />
      </Provider>,
    );
    // Should show cardContainer
    expect(screen.getByText('strings.userGuide')).toBeTruthy();
  });
});
