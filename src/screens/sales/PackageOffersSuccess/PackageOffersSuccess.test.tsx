/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE, STRINGS } from 'const';
import formAction from 'store/sales/actions/form';
import PackageOffersSuccess from './PackageOffersSuccess';

const mockNavigate = jest.fn();
const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goHome: mockGoHome,
}));

let mockRouteName = ROUTE.WEB.CUSTOMER_OFFER_SUCCESS;
jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: mockRouteName,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('store/sales/actions/form', () => ({
  setFormDependentDefault: jest.fn((data) => ({ type: 'SET_FORM_DEFAULT', payload: data })),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CommonSuccess: ({ primaryText, secondaryText, value }: any) => (
      <View testID="common-success">
        <Text>{primaryText}</Text>
        <Text>{secondaryText}</Text>
        <Text>{value}</Text>
      </View>
    ),
    CustomerDetailsCard: () => <View testID="customer-details-card" />,
    Image: ({ iconName }: any) => <View testID={`image-${iconName}`} />,
    Text: ({ children, style, label }: any) => <Text style={style}>{label || children}</Text>,
  };
});

const createMockStore = (initialState: any) =>
  configureStore({
    reducer: {
      form: (state = initialState.form) => state,
      user: (state = initialState.user) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('PackageOffersSuccess Component', () => {
  const initialState = {
    form: {
      formState: {
        formNavigationData: { params: { transactionId: 'TX123' } },
        dealerDetails: { subscriberId: 'SUB456' },
      },
    },
    user: { isRedirection: false },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteName = ROUTE.WEB.CUSTOMER_OFFER_SUCCESS;
  });

  const renderComponent = (state = initialState) =>
    render(
      <Provider store={createMockStore(state)}>
        <NavigationContainer>
          <PackageOffersSuccess />
        </NavigationContainer>
      </Provider>,
    );

  test('renders correctly with transaction and subscriber info', () => {
    renderComponent();
    expect(screen.getByText('requestSuccessFul')).toBeTruthy();
    expect(screen.getByText('transactionID')).toBeTruthy();
    expect(screen.getByText('TX123')).toBeTruthy();
    expect(screen.getByText('strings.subID: SUB456')).toBeTruthy();
  });

  test('handles close customer session (goHome) without redirection', () => {
    renderComponent();
    fireEvent.press(screen.getByText('strings.closeCustomerSession'));
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  test('handles close customer session (goHome) with redirection', () => {
    renderComponent({ ...initialState, user: { isRedirection: true } });
    fireEvent.press(screen.getByText('strings.closeCustomerSession'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  test('handles check offers for another customer', () => {
    renderComponent();
    fireEvent.press(screen.getByText('strings.checkOffersForAnotherCustomer'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CUSTOMER_OFFERS);
  });

  test('handles recharge winback for another customer when route is different', () => {
    mockRouteName = 'some_other_route';
    renderComponent();
    fireEvent.press(screen.getByText('strings.rechargeWinBackForAnotherCustomer'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_WINBACK);
  });

  test('handles heavy refresh module route', () => {
    renderComponent();
    fireEvent.press(screen.getByText('forms.heavyRefresh'));
    expect(formAction.setFormDependentDefault).toHaveBeenCalledWith({ [STRINGS.SUBSCRIBER_INFO]: 'SUB456' });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.HEAVY_REFRESH);
  });

  test('handles recharge reversal module route', () => {
    renderComponent();
    fireEvent.press(screen.getByText('forms.rechargeReversal'));
    expect(formAction.setFormDependentDefault).toHaveBeenCalledWith({ [STRINGS.SUBSCRIBER_ID]: 'SUB456' });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RECHARGE_REVERSAL);
  });
});
