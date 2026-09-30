/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as reactRedux from 'react-redux';
import { Linking } from 'react-native';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import actions from 'store/sales/actions/activationStatusDetails';
import WoInformation from './WoInformation';

// Mocking dependencies
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'xs' }),
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

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('store/sales/actions/activationStatusDetails', () => ({
  getWODetailsActivationStatus: jest.fn((subId) => ({ type: 'GET_WO_DETAILS', payload: subId })),
  getActivationStatusOtherDetails: jest.fn((subId) => ({ type: 'GET_OTHER_DETAILS', payload: subId })),
  getUpgradeWODetailsActivationStatus: jest.fn((subId) => ({ type: 'GET_UPGRADE_WO_DETAILS', payload: subId })),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    PillsGroup: ({ itemsArr, onPillPress }: any) => (
      <View testID="pills-group">
        {itemsArr.map((item: string) => (
          <TouchableOpacity key={item} testID={`pill-${item}`} onPress={() => onPillPress(item)}>
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    Text: ({ label, children, style }: any) => <Text style={style}>{label || children}</Text>,
    TextContainer: ({ data, dataArray }: any) => (
      <View testID="text-container">
        {dataArray.map((item: any) => (
          <Text key={item.key}>{data[item.key]}</Text>
        ))}
      </View>
    ),
    Image: () => <View testID="image-mock" />,
    List: ({ data, renderItem, ListEmptyComponent }: any) => (
      <View testID="list-component">
        {data && data.length > 0 ? data.map((item: any, index: number) => <View key={index}>{renderItem({ item, index })}</View>) : ListEmptyComponent && <ListEmptyComponent />}
      </View>
    ),
  };
});

const mockDispatch = jest.fn();

describe('WoInformation Component', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatusDetails: {
          woDetailsData: [],
          woOtherDetails: [],
          upgradeWoDetails: [],
          accountInfo: { subId: '123' },
        },
      }),
    );

    store = configureStore({
      reducer: {
        activationStatusDetails: (state = {}) => state,
      },
    });
  });

  it('renders correctly and dispatches initial actions', () => {
    render(
      <Provider store={store}>
        <WoInformation />
      </Provider>,
    );

    expect(screen.getByTestId('wo-info-test')).toBeTruthy();
    expect(mockDispatch).toHaveBeenCalledWith(actions.getWODetailsActivationStatus());
    expect(mockDispatch).toHaveBeenCalledWith(actions.getActivationStatusOtherDetails());
    expect(mockDispatch).toHaveBeenCalledWith(actions.getUpgradeWODetailsActivationStatus());
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  it('tracks events when switching pills', async () => {
    render(
      <Provider store={store}>
        <WoInformation />
      </Provider>,
    );

    // Initial selected pill might not trigger switch case until onPillPress
    const otherDetailsPill = screen.getByTestId(`pill-Other Details`);
    fireEvent.press(otherDetailsPill);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ Status: true }));

    const upgradeWoPill = screen.getByTestId(`pill-Upgrade WO Details`);
    fireEvent.press(upgradeWoPill);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ Status: true }));

    const woDetailsPill = screen.getByTestId(`pill-Work Order Details`);
    fireEvent.press(woDetailsPill);
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  it('handles openDialer correctly', async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);

    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatusDetails: {
          woDetailsData: [{ wo_num: 'WO1', wo_isp_mobile: '9876543210' }],
          woOtherDetails: [],
          upgradeWoDetails: [],
          accountInfo: { subId: '123' },
        },
      }),
    );

    render(
      <Provider store={store}>
        <WoInformation />
      </Provider>,
    );

    // Ensure we are on WO Details pill
    const woDetailsPill = screen.getByTestId(`pill-Work Order Details`);
    fireEvent.press(woDetailsPill);

    const dialerButton = screen.getByText('9876543210');
    fireEvent.press(dialerButton);

    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith('tel:9876543210');
      expect(Linking.openURL).toHaveBeenCalledWith('tel:9876543210');
    });
  });

  it('does not call openURL if phoneNumber is not available', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatusDetails: {
          woDetailsData: [{ wo_num: 'WO1', wo_isp_mobile: 'notAvailable' }],
          woOtherDetails: [],
          upgradeWoDetails: [],
          accountInfo: { subId: '123' },
        },
      }),
    );

    render(
      <Provider store={store}>
        <WoInformation />
      </Provider>,
    );

    // Press pill FIRST to render the table
    const woDetailsPill = screen.getByTestId(`pill-Work Order Details`);
    fireEvent.press(woDetailsPill);

    const dialerButton = screen.getByText('notAvailable');
    fireEvent.press(dialerButton);

    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('renders No Data Available in Other Details when data is empty', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatusDetails: {
          woDetailsData: [],
          woOtherDetails: [],
          upgradeWoDetails: [],
          accountInfo: { subId: '123' },
        },
      }),
    );

    render(
      <Provider store={store}>
        <WoInformation />
      </Provider>,
    );

    const otherDetailsPill = screen.getByTestId(`pill-Other Details`);
    fireEvent.press(otherDetailsPill);

    expect(screen.getByText('errors.noDataAvailable')).toBeTruthy();
  });

  it('renders Upgrade WO details correctly', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatusDetails: {
          woDetailsData: [],
          woOtherDetails: [],
          upgradeWoDetails: [{ wo_num: 'UP1', wo_status: 'Completed' }],
          accountInfo: { subId: '123' },
        },
      }),
    );

    render(
      <Provider store={store}>
        <WoInformation />
      </Provider>,
    );

    const upgradeWoPill = screen.getByTestId(`pill-Upgrade WO Details`);
    fireEvent.press(upgradeWoPill);

    expect(screen.getByText('UP1')).toBeTruthy();
  });

  it('renders other details when other details pill is pressed', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activationStatusDetails: {
          woDetailsData: [],
          woOtherDetails: [{ tsk_no: 'TSK1', bookformno: 'B1', pref_box_type: 'BOX1', contact_1: '999', connectionType: 'CONN1' }],
          upgradeWoDetails: [],
          accountInfo: { subId: '123' },
        },
      }),
    );

    render(
      <Provider store={store}>
        <WoInformation />
      </Provider>,
    );

    const otherPill = screen.getByTestId('pill-Other Details');
    fireEvent.press(otherPill);

    await waitFor(() => {
      expect(screen.getByText('TSK1')).toBeTruthy();
    });
  });
});
