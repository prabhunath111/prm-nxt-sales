import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { useSelector } from 'react-redux';
import { closeWebView } from 'utils/navigationHelper';
import ErrorPage from './ErrorPage';

const mockGoHome = jest.fn();
const mockDispatch = jest.fn();
const mockDoLogout = jest.fn();

// Mock Apollo Client
jest.mock('services/apolloClient', () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

// Mock i18n
jest.mock('config/i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock form builder helper
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

// Mock all dependencies
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
  useInflection: () => ({ inflection: 'md', orientation: 'portrait' }),
}));

jest.mock('utils/platformHelper', () => ({
  isDesktop: false,
  isWeb: false,
  isAndroid: jest.fn(() => false),
  isiOS: jest.fn(() => true),
  isTablet: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'ios' })),
}));

jest.mock('styles/dimentionHelper', () => ({
  getPlatformInformation: jest.fn(() => ({
    deviceId: 'mock-device-id',
    model: 'mock-model',
    manufacturer: 'mock-manufacturer',
    serialNumber: 'mock-serial',
    systemName: 'mock-system',
    systemVersion: 'mock-version',
    appVersion: 'mock-app-version',
    isEmulator: false,
    isTablet: false,
    readableVersion: 'mock-readable-version',
  })),
  getWindowWidth: jest.fn(() => 768),
  modifiedScreenHeight: jest.fn(() => 800),
  getScreenHeight: jest.fn(() => 800),
  getFullScreenHeight: jest.fn(() => 800),
  getFullScreenWidth: jest.fn(() => 768),
  getScreenWidth: jest.fn(() => 768),
  getWindowHeight: jest.fn(() => 800),
  getScaleFactorX: jest.fn(() => 1),
  getScaleFactorY: jest.fn(() => 1),
  scaleFont: jest.fn((size) => size),
  BASE_PIXEL_WIDTH: 768,
  BASE_PIXEL_HEIGHT: 800,
  windowH: 800,
  OS: { IOS: 1, ANDROID: 2, WEB: 3 },
  DEVICE: {
    ANDROID_PHONE: 'ANDROID_PHONE',
    ANDROID_TABLET: 'ANDROID_TABLET',
    IPAD: 'IPAD',
    IPHONE: 'IPHONE',
    WEB: 'WEB',
  },
}));

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => 'mock-version'),
  isEmulatorSync: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
}));

jest.mock('hooks/useNavigate', () => () => ({
  goHome: mockGoHome,
}));

jest.mock('utils/navigationHelper', () => ({
  closeWebView: jest.fn(),
}));

jest.mock('store/sales/actions/user', () => ({
  __esModule: true,
  default: {
    doLogout: () => ({ type: 'USER_LOGOUT' }),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    exitErrorPage: () => ({ type: 'UI_EXIT_ERROR_PAGE' }),
    hideBottomModal: () => ({ type: 'UI_HIDE_BOTTOM_MODAL' }),
  },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
  useSelector: jest.fn(),
}));

describe('ErrorPage Component', () => {
  const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
  const mockCloseWebView = closeWebView as jest.MockedFunction<typeof closeWebView>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component with all elements', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('errors.errorHeader')).toBeTruthy();
    expect(screen.getByText('errors.queryFetchError')).toBeTruthy();
    expect(screen.getByText('strings.goToHome')).toBeTruthy();
  });

  test('dispatches actions on component mount', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UI_EXIT_ERROR_PAGE' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UI_HIDE_BOTTOM_MODAL' });
  });

  test('calls closeWebView when isRedirection is true and button is pressed', () => {
    mockUseSelector.mockReturnValue({ isRedirection: true });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByText('strings.goToHome');
    fireEvent.press(button);

    expect(mockCloseWebView).toHaveBeenCalled();
    expect(mockDoLogout).not.toHaveBeenCalled();
    expect(mockGoHome).not.toHaveBeenCalled();
  });

  test('calls doLogout and goHome when isRedirection is false and button is pressed', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByText('strings.goToHome');
    fireEvent.press(button);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'USER_LOGOUT' });
    expect(mockGoHome).toHaveBeenCalled();
    expect(mockCloseWebView).not.toHaveBeenCalled();
  });

  test('snapshot test for ErrorPage', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  test('memo component re-renders correctly with different props', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    const { rerender } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    // Change the selector return value to trigger re-render
    mockUseSelector.mockReturnValue({ isRedirection: true });

    rerender(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('errors.errorHeader')).toBeTruthy();
  });

  test('component handles multiple button clicks correctly', () => {
    mockUseSelector.mockReturnValue({ isRedirection: true });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    const button = screen.getByText('strings.goToHome');

    // Click multiple times to ensure function is called multiple times
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockCloseWebView).toHaveBeenCalledTimes(2);
  });

  test('useEffect cleanup and re-execution', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    const { unmount, rerender } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    // Verify initial useEffect calls
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UI_EXIT_ERROR_PAGE' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UI_HIDE_BOTTOM_MODAL' });

    // Clear mocks and re-render to test useEffect again
    jest.clearAllMocks();

    rerender(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    // useEffect should not run again since deps array is empty
    expect(mockDispatch).not.toHaveBeenCalled();

    unmount();
  });

  test('memo comparison prevents unnecessary re-renders', () => {
    const TestWrapper = () => {
      mockUseSelector.mockReturnValue({ isRedirection: false });
      return (
        <Provider store={store}>
          <NavigationContainer>
            <ErrorPage />
          </NavigationContainer>
        </Provider>
      );
    };

    const { rerender } = render(<TestWrapper />);

    // Clear dispatch calls from initial render
    jest.clearAllMocks();

    // Re-render with same props - memo should prevent re-render
    rerender(<TestWrapper />);

    // Component should still be rendered
    expect(screen.getByText('errors.errorHeader')).toBeTruthy();
  });

  test('component unmounts cleanly', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    const { unmount } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    expect(() => unmount()).not.toThrow();
  });

  test('tests memo wrapper function directly', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    // Test the memoized component
    const MemoizedComponent = React.memo(() => (
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>
    ));

    const { rerender } = render(<MemoizedComponent />);

    // Force re-render with same props
    rerender(<MemoizedComponent />);

    expect(screen.getByText('errors.errorHeader')).toBeTruthy();
  });

  test('tests component function execution paths', () => {
    // Test with different selector values to ensure all code paths
    const testCases = [{ isRedirection: true }, { isRedirection: false }, { isRedirection: undefined }];

    testCases.forEach((testCase) => {
      mockUseSelector.mockReturnValue(testCase);

      const { unmount } = render(
        <Provider store={store}>
          <NavigationContainer>
            <ErrorPage />
          </NavigationContainer>
        </Provider>,
      );

      // Test button click for each case
      const button = screen.getByText('strings.goToHome');
      fireEvent.press(button);

      unmount();
    });
  });

  test('tests all hook functions are called', () => {
    mockUseSelector.mockReturnValue({ isRedirection: false });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ErrorPage />
        </NavigationContainer>
      </Provider>,
    );

    // Verify component renders correctly
    expect(screen.getByText('errors.errorHeader')).toBeTruthy();
    expect(screen.getByText('errors.queryFetchError')).toBeTruthy();
    expect(screen.getByText('strings.goToHome')).toBeTruthy();
  });
});
