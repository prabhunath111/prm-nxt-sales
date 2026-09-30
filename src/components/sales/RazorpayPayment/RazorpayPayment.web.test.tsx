import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { ALERT } from 'const';
import RazorpayPayment from './RazorpayPayment.web';

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockShowAlert = jest.fn((msg, type) => ({ type: 'SHOW_ALERT', payload: { msg, type } }));
jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showAlert: (msg: string, type: string) => mockShowAlert(msg, type),
  },
}));

jest.mock('config/env', () => ({
  RAZORPAY_KEY: 'mock_key',
}));

// Manual Mock for DOM
const mockScript: any = {
  src: '',
  id: '',
  async: false,
};

const mockDocument: any = {
  createElement: jest.fn(() => mockScript),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  getElementById: jest.fn((id) => (mockScript.id === id ? mockScript : null)),
};

const mockWindow: any = {
  Razorpay: null,
};

(global as any).document = mockDocument;
(global as any).window = mockWindow;

describe('RazorpayPayment Web', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWindow.Razorpay = null;
    mockScript.id = '';
    mockScript.src = '';
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <RazorpayPayment />
      </Provider>,
    );

  test('renders correctly and appends script', () => {
    renderComponent();
    expect(mockDocument.createElement).toHaveBeenCalledWith('script');
    expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockScript);
    expect(mockScript.id).toBe('razorpay-script');
    expect(screen.getByText('strings.doPayment')).toBeTruthy();
  });

  test('cleans up script on unmount', () => {
    const { unmount } = renderComponent();
    unmount();
    expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockScript);
  });

  test('shows alert if Razorpay SDK is not loaded', () => {
    renderComponent();
    fireEvent.press(screen.getByText('strings.doPayment'));

    expect(mockShowAlert).toHaveBeenCalledWith('strings.razorpaySdkIsNotLoaded', ALERT.ERROR);
  });

  test('handles payment through window.Razorpay', () => {
    const mockOpen = jest.fn();
    mockWindow.Razorpay = jest.fn().mockImplementation(() => ({
      open: mockOpen,
    }));

    renderComponent();
    fireEvent.press(screen.getByText('strings.doPayment'));

    expect(mockWindow.Razorpay).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalled();
  });
});
