/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as reactRedux from 'react-redux';
import actions from 'store/sales/actions/activationStatusDetails';
import ActivationStatus from './ActivationStatus';

// Mocking dependencies
jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'subContainer_xs'),
  BreakPoints: { XL: 'xl', LG: 'lg', MD: 'md', SM: 'sm', XS: 'xs' },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'strings.workOrderDetails') return 'Work Order Details';
      if (key === 'strings.upgradeWODetails') return 'Upgrade WO Details';
      if (key === 'strings.otherDetails') return 'Other Details';
      return key;
    },
  }),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
}));
jest.mock('hooks/useCurrentRoute', () => () => ({ routeName: 'CurrentRoute' }));
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'xs' }),
}));
jest.mock('store/sales/actions/activationStatusDetails', () => ({
  getAccountInfo: jest.fn(),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, Button } = require('react-native');
  return {
    SalesFormBuilder: ({ onSubmit }: any) => (
      <View testID="form-builder-mock">
        <Button testID="submit-navigation" title="Submit Navigation" onPress={() => onSubmit({ name: 'test' }, 'NAVIGATION', 'queryName', 'navigateToRoute')} />
        <Button
          testID="submit-submit-navigation"
          title="Submit + Navigation"
          onPress={() => onSubmit({ name: 'test' }, 'SUBMIT_NAVIGATION', 'queryName', 'navigateToRoute', 'navigateToRoute')}
        />
        <Button testID="submit-default" title="Submit Default" onPress={() => onSubmit({ name: 'test' }, 'OTHER', 'queryName', 'navigateToRoute')} />
      </View>
    ),
    Button: ({ label, onPress }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    CustomerDetailsCard: () => <View testID="customer-details-card" />,
    List: ({ data, renderItem }: any) => <View testID="list-component">{data?.map((item: any, index: number) => <View key={index}>{renderItem({ item, index })}</View>)}</View>,
    PackageInfo: () => <View testID="package-info" />,
    RechargeTransactions: () => <View testID="recharge-transactions" />,
    Tabs: () => <View testID="tabs-component" />,
    TextContainer: () => <View testID="text-container" />,
    WoInformation: () => <View testID="wo-information" />,
    Text: ({ label, children }: any) => <Text>{label || children}</Text>,
  };
});

const mockDispatch = jest.fn();

describe('ActivationStatus Component', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    store = configureStore({
      reducer: {
        activationStatus: (state = { activationStatusData: null, bcpActivationStatusData: null }) => state,
      },
    });
  });

  it('renders BCP view when activationStatusData is null', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatus: {
          activationStatusData: null,
          bcpActivationStatusData: { subscriberId: '12345', workOrderNo: 'WO-123' },
        },
      }),
    );

    render(
      <Provider store={store}>
        <ActivationStatus />
      </Provider>,
    );

    expect(screen.getByTestId('activation-status-test')).toBeTruthy();
    expect(screen.getByTestId('text-container')).toBeTruthy();
  });

  it('renders activation details when activationStatusData is present and triggers getAccountInfo', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatus: {
          activationStatusData: {
            customerRmn: '9876543210',
            secStatusArray: [{ secStatus: 'Active' }],
          },
          bcpActivationStatusData: null,
        },
      }),
    );

    render(
      <Provider store={store}>
        <ActivationStatus />
      </Provider>,
    );

    expect(screen.getByTestId('activation-status-test')).toBeTruthy();
    expect(mockDispatch).toHaveBeenCalledWith(actions.getAccountInfo());
    expect(screen.getByTestId('customer-details-card')).toBeTruthy();
    expect(screen.getByTestId('tabs-component')).toBeTruthy();
  });

  it('renders secondary connections when secStatusArray has more than one item', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatus: {
          activationStatusData: {
            customerRmn: '9876543210',
            secStatusArray: [{ secStatus: 'Active' }, { secStatus: 'SecondaryActive' }, { secStatus: 'SecondaryPending' }],
          },
          bcpActivationStatusData: null,
        },
      }),
    );

    render(
      <Provider store={store}>
        <ActivationStatus />
      </Provider>,
    );

    expect(screen.getByText('strings.secondaryConnection 1')).toBeTruthy();
    expect(screen.getByText('strings.secondaryConnection 2')).toBeTruthy();
  });

  it('does not render secondary connections when secStatusArray has only one item', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatus: {
          activationStatusData: {
            customerRmn: '9876543210',
            secStatusArray: [{ secStatus: 'Active' }],
          },
          bcpActivationStatusData: null,
        },
      }),
    );

    render(
      <Provider store={store}>
        <ActivationStatus />
      </Provider>,
    );

    expect(screen.queryByText('strings.secondaryConnection 1')).toBeNull();
  });

  it('calls goBack when back button is pressed', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatus: {
          activationStatusData: null,
          bcpActivationStatusData: null,
        },
      }),
    );

    render(
      <Provider store={store}>
        <ActivationStatus />
      </Provider>,
    );

    const backButton = screen.getByText('strings.back');
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('handles empty secStatusArray', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatus: {
          activationStatusData: {
            secStatusArray: [
              { some: 'primary', secStatus: 'Completed' },
              { name: 'secondary 1', secStatus: 'Pending' },
              { name: 'secondary 2', secStatus: 'Pending' },
            ],
          },
          bcpActivationStatusData: null,
        },
      }),
    );

    render(
      <Provider store={store}>
        <ActivationStatus />
      </Provider>,
    );

    expect(screen.getByTestId('activation-status-test')).toBeTruthy();
  });

  it('handles undefined secStatusArray', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatus: {
          activationStatusData: {
            secStatusArray: undefined,
          },
          bcpActivationStatusData: null,
        },
      }),
    );

    render(
      <Provider store={store}>
        <ActivationStatus />
      </Provider>,
    );

    expect(screen.getByTestId('activation-status-test')).toBeTruthy();
  });
});
