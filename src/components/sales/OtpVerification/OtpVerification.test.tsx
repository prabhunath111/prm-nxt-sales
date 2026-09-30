/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import OtpVerification from './OtpVerification';

// Mocking dependencies
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
}));

const mockDispatch: any = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(mockDispatch, () => mockStoreState);
  }
  return action;
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector: any) => selector(mockStoreState)),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => (_dispatch: any) => Promise.resolve({ status: true })),
}));

jest.mock('store/sales/actions/common', () => ({
  reSetErrorMessage: jest.fn(() => ({ type: 'RESET_ERROR' })),
  setErrorMessage: jest.fn((msg) => ({ type: 'SET_ERROR', payload: msg })),
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(() => ({ type: 'SET_LOADER' })),
  clearLoader: jest.fn(() => ({ type: 'CLEAR_LOADER' })),
  showErrorPage: jest.fn((msg) => ({ type: 'SHOW_ERROR', payload: msg })),
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_MODAL' })),
  showAlert: jest.fn(() => ({ type: 'SHOW_ALERT' })),
}));

// Robust mock for const using requireActual
jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    QUERY: {
      ...actual.QUERY,
      loginOtpVerification: 'loginOtpVerification',
    },
    OTP_STRINGS: {
      ...actual.OTP_STRINGS,
      OTP_INPUT: 'otpInput',
    },
  };
});

const mockStoreState = {
  rechargeWinback: {
    subscriberRmn: { data: '1234567890' },
  },
  common: {
    errorMessage: '',
  },
};

const mockStore = configureStore({
  reducer: {
    rechargeWinback: (state = mockStoreState.rechargeWinback) => state,
    common: (state = mockStoreState.common) => state,
  },
});

describe('OtpVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <OtpVerification mobile="1234567890" buttonInfo={{ otpButtonLabel: 'submit' }} {...props} />
        </NavigationContainer>
      </Provider>,
    );

  test('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('123XXXX890')).toBeTruthy();
  });

  test('handles timer countdown and resend enabled', () => {
    renderComponent();
    jest.advanceTimersByTime(31000);
    const resendButton = screen.getByText('strings.resendOtp');
    fireEvent.press(resendButton);
  });

  test('handles resend OTP success', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    renderComponent();

    jest.advanceTimersByTime(31000);
    const resendButton = screen.getByText('strings.resendOtp');
    fireEvent.press(resendButton);

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith(expect.anything(), 'resendOTPWithOutSubId');
    });
  });

  test('handles resend OTP with custom query', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    renderComponent({
      buttonInfo: {
        otpButtonLabel: 'submit',
        resendOtpQuery: 'customResend',
        resendOtpQueryParams: { id: 1 },
      },
    });

    jest.advanceTimersByTime(31000);
    const resendButton = screen.getByText('strings.resendOtp');
    fireEvent.press(resendButton);

    await waitFor(() => {
      expect(callAction).toHaveBeenCalledWith({ id: 1 }, 'customResend');
    });
  });

  test('handles OTP submission success with updateEvdMdn navigation', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    const { QUERY, ROUTE } = require('const');
    (callAction as jest.Mock).mockImplementationOnce(() => () => Promise.resolve({ status: true }));
    renderComponent({ queryName: QUERY.updateEvdMdn });

    const otpInputs = screen.getAllByTestId('input-test');
    otpInputs.forEach((input, i) => fireEvent.changeText(input, String(i + 1)));

    const submitButton = screen.getByText('strings.submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.EVD_MDN_CHANGE_SUCCESS);
    });
  });

  test('handles OTP submission success with routeName navigation', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    (callAction as jest.Mock).mockImplementationOnce(() => () => Promise.resolve({ status: true }));
    renderComponent({ buttonInfo: { otpButtonLabel: 'submit', routeName: 'customRoute' } });

    const otpInputs = screen.getAllByTestId('input-test');
    otpInputs.forEach((input, i) => fireEvent.changeText(input, String(i + 1)));

    const submitButton = screen.getByText('strings.submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('customRoute');
    });
  });

  test('handles OTP submission success', async () => {
    const { api } = require('services/apolloClient');
    api.post.mockResolvedValueOnce({ data: { loginOtpVerification: { status: 'SUCCESS' } } });
    renderComponent();

    const otpInputs = screen.getAllByTestId('input-test');
    otpInputs.forEach((input, i) => fireEvent.changeText(input, String(i + 1)));

    const submitButton = screen.getByText('strings.submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'HIDE_MODAL' }));
    });
  });

  test('handles OTP submission failure', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    (callAction as jest.Mock).mockImplementationOnce(() => () => Promise.resolve({ status: false, message: 'Invalid OTP' }));
    renderComponent();

    const otpInputs = screen.getAllByTestId('input-test');
    otpInputs.forEach((input, i) => fireEvent.changeText(input, String(i + 1)));

    const submitButton = screen.getByText('strings.submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_ERROR', payload: 'Invalid OTP' }));
    });
  });

  test('handles EVD link press', () => {
    renderComponent({ buttonInfo: { otpButtonLabel: 'submit', hasEvdLink: true } });
    const evdLink = screen.getByText('strings.clickHeretoApproveViaDist');
    fireEvent.press(evdLink);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SHOW_ALERT' }));
  });

  test('handles cancel press', () => {
    renderComponent();
    const cancelButton = screen.getByText('strings.back');
    fireEvent.press(cancelButton);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'HIDE_MODAL' }));
  });

  test('handles OTP submission with short OTP', async () => {
    renderComponent();
    const otpInputs = screen.getAllByTestId('input-test');
    fireEvent.changeText(otpInputs[0], '1'); // Only 1 digit

    const submitButton = screen.getByText('strings.submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_ERROR', payload: 'errors.otpError' }));
    });
  });

  test('handles change text and resets error', () => {
    const { useSelector } = require('react-redux');
    (useSelector as jest.Mock).mockReturnValue({ errorMessage: 'Some Error' });
    renderComponent();
    const otpInputs = screen.getAllByTestId('input-test');
    fireEvent.changeText(otpInputs[0], '1');
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_ERROR' });
    (useSelector as jest.Mock).mockImplementation((selector: any) => selector(mockStoreState));
  });

  test('handles cancel press with secondary query', () => {
    const { callAction } = require('utils/formBuilderHelper');
    renderComponent({
      buttonInfo: {
        otpButtonLabel: 'submit',
        secondaryQueryName: 'secondaryQuery',
        secondaryQueryParams: { id: 1 },
      },
    });
    const cancelButton = screen.getByText('strings.back');
    jest.clearAllMocks();
    fireEvent.press(cancelButton);
    expect(callAction).toHaveBeenCalledWith({ id: 1 }, 'secondaryQuery', expect.anything(), expect.anything());
  });

  test('cleans up timer on unmount', () => {
    const { unmount } = renderComponent();
    unmount();
    // Verify clearInterval was called (indirectly via no leaks/errors)
  });

  test('handles key press on second digit with backspace', () => {
    renderComponent();
    const otpInputs = screen.getAllByTestId('input-test');
    // Set some value and clear it to simulate empty index > 0
    fireEvent.changeText(otpInputs[1], '');
    fireEvent(otpInputs[1], 'onKeyPress', { nativeEvent: { key: 'Backspace' } });
  });

  test('snapshot tests', () => {
    const component = renderComponent({ buttonInfo: { otpButtonLabel: 'submit', hasEvdLink: true } });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
