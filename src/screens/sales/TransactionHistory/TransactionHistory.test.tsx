/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ROUTE } from 'const';
import actions from 'store/sales/actions/transactionHistory';
import formAction from 'store/sales/actions/form';
import TransactionHistory from './TransactionHistory';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('utils/platformHelper', () => ({
  isDesktop: true,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'xl' }),
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', SM: 'sm', XS: 'xs' },
}));

// Mock redux actions
jest.mock('store/sales/actions/transactionHistory', () => ({
  resetTransactionHistory: jest.fn(() => ({ type: 'RESET_HISTORY' })),
  retrieveTransactionDetails: jest.fn(() => () => Promise.resolve({ status: true })),
  resetIsTransactionDetails: jest.fn(() => ({ type: 'RESET_IS_DETAILS' })),
}));

jest.mock('store/sales/actions/form', () => ({
  resetNavigationData: jest.fn(() => ({ type: 'RESET_NAV' })),
}));

jest.mock('components/sales', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <TouchableOpacity onPress={onPress} testID={`btn-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Card: ({ children, childrenStyle }: any) => (
      <View testID="card-container" style={childrenStyle}>
        {children}
      </View>
    ),
    FormHeader: ({ formName }: any) => (
      <View testID="form-header">
        <Text>{formName}</Text>
      </View>
    ),
    TextContainer: ({ data }: any) => (
      <View testID="text-container">
        <Text>{data.transactionId}</Text>
      </View>
    ),
    Text: ({ children, label }: any) => <Text>{label || children}</Text>,
  };
});

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      transactionHistory: (s = state.transactionHistory) => s,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('TransactionHistory Component', () => {
  const initialState = {
    transactionHistory: {
      transactionHistory: [
        { transactionId: 'T1', amount: '100' },
        { transactionId: 'T2', amount: '200' },
      ],
      isTransactionDetails: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly and handles back button', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TransactionHistory />
      </Provider>,
    );
    expect(screen.getByTestId('form-header')).toBeTruthy();
    expect(screen.getAllByTestId('card-container')).toHaveLength(2);

    fireEvent.press(screen.getByTestId('btn-strings.back'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_REVERSAL);
    expect(actions.resetTransactionHistory).toHaveBeenCalled();
    expect(formAction.resetNavigationData).toHaveBeenCalled();
  });

  test('auto-navigates when isTransactionDetails is true', () => {
    render(
      <Provider store={createMockStore({ ...initialState, transactionHistory: { ...initialState.transactionHistory, isTransactionDetails: true } })}>
        <TransactionHistory />
      </Provider>,
    );
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CONFIRM_REVERSAL);
  });

  test('handles reverse button click', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <TransactionHistory />
      </Provider>,
    );

    await act(async () => {
      fireEvent.press(screen.getAllByTestId('btn-strings.reverse')[0]);
    });

    expect(actions.retrieveTransactionDetails).toHaveBeenCalled();
    expect(actions.resetIsTransactionDetails).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CONFIRM_REVERSAL);
  });
});
