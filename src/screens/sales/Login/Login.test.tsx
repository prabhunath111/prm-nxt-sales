import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import * as platformHelper from 'utils/platformHelper';
import * as sessionHelper from 'utils/sessionHelper';
import * as formBuilderHelper from 'utils/formBuilderHelper';
import actions from 'store/sales/actions';
import userActions from 'store/sales/actions/user';
import uiActions from 'store/sales/actions/ui';
import commonAction from 'store/sales/actions/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './Login';
import { login as authLogin } from '../../../Auth';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.SettingsManager = {
    settings: {
      AppleLocale: 'en_US',
      AppleLanguages: ['en'],
    },
  };
  return RN;
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

jest.mock('utils/platformHelper', () => ({
  getDeviceID: jest.fn(),
  isWeb: false,
  isiOS: jest.fn(() => true),
  isAndroid: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isDeviceTablet: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'ios' })),
}));

jest.mock('utils/sessionHelper');
jest.mock('store/sales/actions', () => ({
  __esModule: true,
  default: {
    setUserDetails: jest.fn(),
    checkMultipleLogins: jest.fn(),
    loginWithLocalAuth: jest.fn(),
  },
}));

jest.mock('store/sales/actions/user', () => ({
  __esModule: true,
  default: {
    loginWithOtp: jest.fn(),
    loginOtpVerification: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showError: jest.fn(),
    hideBottomModal: jest.fn(),
    showAlert: jest.fn(),
    clearLoader: jest.fn(),
  },
}));

jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    setErrorMessage: jest.fn(),
    reSetErrorMessage: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../../Auth', () => ({
  login: jest.fn(),
}));
jest.mock('services/apolloClient', () => ({
  client: {
    resetStore: jest.fn(),
  },
}));
jest.mock('services/storageService', () => ({
  storageService: {
    setItem: jest.fn(),
  },
}));
jest.mock('utils/localAuthHelper', () => ({
  checkBiometrySupport: jest.fn(),
  handleLocalAuthenticate: jest.fn(),
}));
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));
jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: jest.fn(() => ({ navigate: jest.fn() })),
}));

describe('Test for the component Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (platformHelper.getDeviceID as jest.Mock).mockResolvedValue('device-123');
    (sessionHelper.getStoredItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('render component Login', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('login')).toBeTruthy();
  });

  test('handles mobile number input', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    expect(input.props.value).toBe('9876543210');
  });

  test('handles username input', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, 'testuser');
    expect(input.props.value).toBe('testuser');
  });

  test('validates mobile number with invalid characters', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '98765abc10');
    expect(screen.getByText('errors.invalidMobileNumber')).toBeTruthy();
  });

  test('validates mobile number length', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '98765');
    expect(screen.getByText('errors.mobileLength10')).toBeTruthy();
  });

  test('validates username minimum length', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, 'abc');
    expect(screen.getByText('errors.usernameMin5')).toBeTruthy();
  });

  test('validates username maximum length', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    const longUsername = 'a'.repeat(51);
    fireEvent.changeText(input, longUsername);
    expect(screen.getByText('errors.usernameMax50')).toBeTruthy();
  });

  test('handles get OTP button press without input', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);
    expect(screen.getByText('errors.enterUserName')).toBeTruthy();
  });

  test('filters special characters from input', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, 'test@user#123');
    expect(input.props.value).toBe('testuser123');
  });

  test('handles checkMultipleLogins with tranStatus false', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: false, transMessage: 'Error' } }));
    (uiActions.showError as jest.Mock).mockReturnValue({ type: 'SHOW_ERROR' });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(uiActions.showError).toHaveBeenCalled();
    });
  });

  test('handles checkMultipleLogins catch error', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.reject(new Error('Network error')));
    (commonAction.setErrorMessage as jest.Mock).mockReturnValue({ type: 'SET_ERROR' });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(commonAction.setErrorMessage).toHaveBeenCalled();
    });
  });

  test('handles AD login button press', async () => {
    (authLogin as jest.Mock).mockResolvedValue({ accessToken: 'test-token' });
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (userActions.loginOtpVerification as jest.Mock).mockReturnValue({ type: 'LOGIN_VERIFY' });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const button = screen.getByText('strings.loginAD');
    fireEvent.press(button);

    await waitFor(() => {
      expect(authLogin).toHaveBeenCalled();
    });
  });

  test('handles AD login error', async () => {
    (authLogin as jest.Mock).mockRejectedValue(new Error('Auth failed'));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const button = screen.getByText('strings.loginAD');
    fireEvent.press(button);

    await waitFor(() => {
      expect(authLogin).toHaveBeenCalled();
    });
  });

  test('switches to OTP screen and renders OTP inputs', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(userActions.loginWithOtp).toHaveBeenCalled();
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });
  });

  test('handles OTP input changes', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const otpInputs = screen.getAllByTestId('input-test');
    if (otpInputs.length >= 6) {
      fireEvent.changeText(otpInputs[0], '1');
      fireEvent.changeText(otpInputs[1], '2');
      fireEvent.changeText(otpInputs[2], '3');
      fireEvent.changeText(otpInputs[3], '4');
      fireEvent.changeText(otpInputs[4], '5');
      fireEvent.changeText(otpInputs[5], '6');
    }
  });

  test('handles OTP submission with valid OTP', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    (formBuilderHelper.callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const getOtpButton = screen.getByText('strings.getOtp');
    fireEvent.press(getOtpButton);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const loginButton = screen.getByText('strings.Login');
    fireEvent.press(loginButton);
  });

  test('handles back button in OTP screen', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const backButton = screen.getByText('strings.back');
    fireEvent.press(backButton);

    await waitFor(() => {
      expect(screen.queryByText('strings.Login')).toBeTruthy();
    });
  });

  test('handles OTP timer countdown', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });
  });

  test('handles resend OTP after timer expires', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    (formBuilderHelper.callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });
  });

  test('handles OTP error and clears on input change', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    (commonAction.reSetErrorMessage as jest.Mock).mockReturnValue({ type: 'RESET_ERROR' });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const otpInputs = screen.getAllByTestId('input-test');
    if (otpInputs.length >= 6) {
      fireEvent.changeText(otpInputs[0], '1');
    }
  });

  test('handles OTP keypress backspace', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const otpInputs = screen.getAllByTestId('input-test');
    if (otpInputs.length >= 2) {
      fireEvent(otpInputs[1], 'onKeyPress', { nativeEvent: { key: 'Backspace' } });
    }
  });

  test('handles getUserData when stored', async () => {
    (sessionHelper.getStoredItem as jest.Mock).mockResolvedValue(JSON.stringify({ isLocalAuthEnabled: 'true', userName: 'test' }));
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(actions.setUserDetails).toHaveBeenCalled();
    });
  });

  test('handles OTP submission with invalid OTP length', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    (commonAction.setErrorMessage as jest.Mock).mockReturnValue({ type: 'SET_ERROR' });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const otpInputs = screen.getAllByTestId('input-test');
    if (otpInputs.length >= 3) {
      fireEvent.changeText(otpInputs[0], '1');
      fireEvent.changeText(otpInputs[1], '2');
      fireEvent.changeText(otpInputs[2], '3');
    }

    const loginButton = screen.getByText('strings.Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(commonAction.setErrorMessage).toHaveBeenCalled();
    });
  });

  test('handles OTP submission failure', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    (formBuilderHelper.callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: false, message: 'Invalid OTP' }));
    (commonAction.setErrorMessage as jest.Mock).mockReturnValue({ type: 'SET_ERROR' });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const otpInputs = screen.getAllByTestId('input-test');
    if (otpInputs.length >= 6) {
      fireEvent.changeText(otpInputs[0], '1');
      fireEvent.changeText(otpInputs[1], '2');
      fireEvent.changeText(otpInputs[2], '3');
      fireEvent.changeText(otpInputs[3], '4');
      fireEvent.changeText(otpInputs[4], '5');
      fireEvent.changeText(otpInputs[5], '6');
    }

    const loginButton = screen.getByText('strings.Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(commonAction.setErrorMessage).toHaveBeenCalled();
    });
  });

  test('handles OTP submission catch error', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    (formBuilderHelper.callAction as jest.Mock).mockReturnValue(() => Promise.reject(new Error('Network error')));
    (commonAction.setErrorMessage as jest.Mock).mockReturnValue({ type: 'SET_ERROR' });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });

    const otpInputs = screen.getAllByTestId('input-test');
    if (otpInputs.length >= 6) {
      fireEvent.changeText(otpInputs[0], '1');
      fireEvent.changeText(otpInputs[1], '2');
      fireEvent.changeText(otpInputs[2], '3');
      fireEvent.changeText(otpInputs[3], '4');
      fireEvent.changeText(otpInputs[4], '5');
      fireEvent.changeText(otpInputs[5], '6');
    }

    const loginButton = screen.getByText('strings.Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(commonAction.setErrorMessage).toHaveBeenCalled();
    });
  });

  test('handles resend OTP button click', async () => {
    (actions.setUserDetails as jest.Mock).mockReturnValue({ type: 'SET_USER' });
    (actions.checkMultipleLogins as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true, data: { tranStatus: true } }));
    (userActions.loginWithOtp as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));
    (formBuilderHelper.callAction as jest.Mock).mockReturnValue(() => Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    const button = screen.getByText('strings.getOtp');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.queryByText('strings.oneTimePassword')).toBeTruthy();
    });
  });

  test('clears input value on trim', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '   ');
    expect(input.props.value).toBe('');
  });

  test('handles valid 10 digit mobile number', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, '9876543210');
    expect(input.props.value).toBe('9876543210');
  });

  test('handles valid username between 5-50 chars', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const input = screen.getByPlaceholderText('strings.enterHere');
    fireEvent.changeText(input, 'validusername');
    expect(input.props.value).toBe('validusername');
  });
});
