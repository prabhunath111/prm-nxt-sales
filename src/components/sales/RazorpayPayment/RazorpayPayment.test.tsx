/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import RazorpayPayment from './RazorpayPayment';

const mockDispatch = jest.fn();
const mockStore = {
  dispatch: mockDispatch,
  subscribe: jest.fn(),
  getState: jest.fn(() => ({})),
} as any;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-native-razorpay', () => ({
  open: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('store/sales/actions/ui', () => ({
  showAlert: jest.fn((msg, type) => ({ type: 'SHOW_ALERT', payload: { msg, type } })),
}));

jest.mock('config/env', () => ({
  RAZORPAY_KEY: 'mock_key',
}));

describe('RazorpayPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <RazorpayPayment />
      </Provider>,
    );

  test('renders correctly', () => {
    renderComponent();
    expect(screen.getByTestId('razorpayTest')).toBeTruthy();
    expect(screen.getByText('strings.doPayment')).toBeTruthy();
  });

  test('handles payment success', async () => {
    const paymentId = 'pay_123';
    (RazorpayCheckout.open as jest.Mock).mockResolvedValue({ razorpay_payment_id: paymentId });

    renderComponent();
    fireEvent.press(screen.getByText('strings.doPayment'));

    await waitFor(() => {
      const { showAlert } = require('store/sales/actions/ui');
      expect(showAlert).toHaveBeenCalledWith(expect.stringContaining(paymentId), expect.anything(), expect.anything(), expect.anything());
    });
  });

  test('handles payment failure', async () => {
    const error = { code: 500, description: 'Payment Failed' };
    (RazorpayCheckout.open as jest.Mock).mockRejectedValue(error);

    renderComponent();
    fireEvent.press(screen.getByText('strings.doPayment'));

    await waitFor(() => {
      const { showAlert } = require('store/sales/actions/ui');
      expect(showAlert).toHaveBeenCalledWith(expect.stringContaining('500'), expect.anything(), expect.anything(), expect.anything());
    });
  });

  test('snapshot test', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
