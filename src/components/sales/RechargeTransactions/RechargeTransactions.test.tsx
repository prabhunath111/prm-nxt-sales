import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import * as ReactRedux from 'react-redux';
import { store, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import actions from 'store/sales/actions/activationStatusDetails';
import RechargeTransactions from './RechargeTransactions';

// mock navigate hook
jest.mock('hooks/useNavigate');
const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue({ navigate: mockNavigate });

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

describe('RechargeTransactions', () => {
  let spyDispatch: jest.SpyInstance;
  let spyUseSelector: jest.SpyInstance;

  beforeEach(() => {
    // Spy on store.dispatch
    spyDispatch = jest.spyOn(store, 'dispatch').mockImplementation((() => Promise.resolve({ status: true })) as any);

    // Spy on useSelector from react-redux
    spyUseSelector = jest.spyOn(ReactRedux, 'useSelector');

    jest.clearAllMocks();
  });

  afterEach(() => {
    spyDispatch.mockRestore();
    spyUseSelector.mockRestore();
  });

  it('dispatches getLastFiveRechargesDetails on mount', () => {
    const spyAction = jest.spyOn(actions, 'getLastFiveRechargesDetails');
    spyUseSelector.mockReturnValue({
      transactions: [],
      accountInfo: { balance: '500', subId: '123' },
    } as unknown as RootState['activationStatusDetails']);

    render(
      <Provider store={store}>
        <RechargeTransactions />
      </Provider>,
    );

    expect(spyAction).toHaveBeenCalled();
  });

  it('renders current balance', () => {
    spyUseSelector.mockReturnValue({
      transactions: [],
      accountInfo: { balance: '500', subId: '123' },
    } as unknown as RootState['activationStatusDetails']);

    render(
      <Provider store={store}>
        <RechargeTransactions />
      </Provider>,
    );

    expect(screen.getByText('500')).toBeTruthy();
  });

  it('renders positive transaction (green)', () => {
    spyUseSelector.mockReturnValue({
      transactions: [{ amount: '20', transactionId: 't1', transactionDate: '2025-09-19' }],
      accountInfo: { subId: '123' },
    } as unknown as RootState['activationStatusDetails']);

    render(
      <Provider store={store}>
        <RechargeTransactions />
      </Provider>,
    );

    expect(screen.getByText('20')).toBeTruthy();
  });

  it('renders negative transaction (red)', () => {
    spyUseSelector.mockReturnValue({
      transactions: [{ amount: '-10', transactionId: 't2', transactionDate: '2025-09-19' }],
      accountInfo: { subId: '123' },
    } as unknown as RootState['activationStatusDetails']);

    render(
      <Provider store={store}>
        <RechargeTransactions />
      </Provider>,
    );

    expect(screen.getByText('-10')).toBeTruthy();
  });

  it('does not show footer when <=5 transactions', () => {
    spyUseSelector.mockReturnValue({
      transactions: new Array(5).fill({ amount: '5', transactionId: 'id', transactionDate: '2025-09-19' }),
      accountInfo: { subId: '123' },
    } as unknown as RootState['activationStatusDetails']);

    render(
      <Provider store={store}>
        <RechargeTransactions />
      </Provider>,
    );

    expect(screen.queryByText('strings.viewMore')).toBeNull();
  });

  it('toggles view more/view less when >5 transactions', () => {
    spyUseSelector.mockReturnValue({
      transactions: new Array(6).fill({ amount: '5', transactionId: 'id', transactionDate: '2025-09-19' }),
      accountInfo: { subId: '123' },
    } as unknown as RootState['activationStatusDetails']);

    render(
      <Provider store={store}>
        <RechargeTransactions />
      </Provider>,
    );

    const btn = screen.getByText('strings.viewMore');
    fireEvent.press(btn);
    expect(screen.getByText('strings.viewLess')).toBeTruthy();
  });

  it('navigates to recharge reversal on button press', async () => {
    spyUseSelector.mockReturnValue({
      transactions: [{ amount: '10', transactionId: 't3', transactionDate: '2025-09-19', paymentType: 'EVD PAYMENT' }],
      accountInfo: { subId: '123' },
    } as unknown as RootState['activationStatusDetails']);

    render(
      <Provider store={store}>
        <RechargeTransactions />
      </Provider>,
    );

    fireEvent.press(screen.getByText('forms.rechargeReversal'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('confirmReversal'));
    });
  });
});
