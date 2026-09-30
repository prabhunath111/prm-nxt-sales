/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { ROUTE, FORMS, QUERY, STRINGS } from 'const';

import actions from 'store/sales/actions/etskRegSchedular';
import commonAction from 'store/sales/actions/common';
import { callAction } from 'utils/formBuilderHelper';
import TimeSlotsContainer from './TimeSlotsContainer';

jest.mock('store/sales/actions/etskRegSchedular');
jest.mock('store/sales/actions/common');
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));
jest.mock('utils/dateHelper', () => ({
  getTwelveHourFormat: jest.fn((time) => time),
}));
jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('styles/dimentionHelper', () => ({
  ...jest.requireActual('styles/dimentionHelper'),
  getScreenWidth: jest.fn(),
  modifiedScreenHeight: jest.fn(() => 800),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const createMockStore = (state: any) =>
  configureStore({
    reducer: () => state,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });

describe('TimeSlotsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (actions.GetETSKSlot as jest.Mock).mockReturnValue({ type: 'GET_ETSK_SLOT' });
    (actions.handleEtskTimeSlots as jest.Mock).mockReturnValue({ type: 'HANDLE_ETSK_TIME_SLOTS' });
    (actions.installationDetails as jest.Mock).mockReturnValue({ type: 'INSTALLATION_DETAILS' });
    (actions.rechargeDetails as jest.Mock).mockReturnValue({ type: 'RECHARGE_DETAILS' });
    (actions.pickPackAndGetSlotPrimaryAndSecondary as jest.Mock).mockReturnValue({ type: 'PICK_PACK_PRIMARY_SECONDARY' });
    (actions.pickPackAndGetSlotSecondary as jest.Mock).mockReturnValue({ type: 'PICK_PACK_SECONDARY' });
    (commonAction.reSetErrorMessage as jest.Mock).mockReturnValue({ type: 'RESET_ERROR' });
    (callAction as jest.Mock).mockReturnValue({ type: 'CALL_ACTION' });
  });

  const mockState = {
    etskRegSchedular: {
      timeSlotsData: {
        slotSuggestions: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '17:00' },
        ],
      },
      date: '2024-01-01',
    },
    common: { errorMessage: '' },
    ui: { isModalLoading: false },
  };

  test('renders component', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(await screen.findByTestId('timeSlotsContainer-test')).toBeTruthy();
  });

  test('calls GetETSKSlot on mount for default route', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(commonAction.reSetErrorMessage).toHaveBeenCalled();
    expect(actions.GetETSKSlot).toHaveBeenCalled();
  });

  test('calls pickPackAndGetSlotPrimaryAndSecondary for PRIMARY_REGISTRATION_SUMMARY', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(actions.pickPackAndGetSlotPrimaryAndSecondary).toHaveBeenCalled();
  });

  test('calls pickPackAndGetSlotPrimaryAndSecondary for RE_PUSH_ORDER_SUMMARY', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.RE_PUSH_ORDER_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(actions.pickPackAndGetSlotPrimaryAndSecondary).toHaveBeenCalled();
  });

  test('calls pickPackAndGetSlotPrimaryAndSecondary for WO_RECREATION_SUMMARY', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.WO_RECREATION_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(actions.pickPackAndGetSlotPrimaryAndSecondary).toHaveBeenCalled();
  });

  test('calls pickPackAndGetSlotSecondary for MULTI_TV_REGISTRATION_SUMMARY', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(actions.pickPackAndGetSlotSecondary).toHaveBeenCalled();
  });

  test('sets default time slot when slotSuggestions available', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    await waitFor(() => {
      expect(actions.handleEtskTimeSlots).toHaveBeenCalledWith('09:00 - 12:00');
    });
  });

  test('handles calendar icon press', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const pressable = screen.getByTestId('image-test');
    fireEvent.press(pressable);
    expect(actions.installationDetails).toHaveBeenCalled();
  });

  test('handles time slot selection', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const firstTimeSlot = screen.getByText('09:00 - 12:00');
    fireEvent.press(firstTimeSlot);
    expect(actions.handleEtskTimeSlots).toHaveBeenCalledWith('09:00 - 12:00');
  });

  test('handles proceed recharge button for default route', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: 'SOME_DEFAULT_ROUTE' });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const rechargeButton = screen.getByTestId('button-test');
    fireEvent.press(rechargeButton);
    expect(actions.rechargeDetails).toHaveBeenCalledWith(FORMS.rechargeDetails, STRINGS.NO);
  });

  test('handles proceed recharge for PRIMARY_REGISTRATION_SUMMARY', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const rechargeButton = screen.getByTestId('button-test');
    fireEvent.press(rechargeButton);
    expect(actions.rechargeDetails).toHaveBeenCalledWith(FORMS.primaryRechargeDetails, STRINGS.NO);
  });

  test('handles proceed recharge for RE_PUSH_ORDER_SUMMARY', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.RE_PUSH_ORDER_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const rechargeButton = screen.getByTestId('button-test');
    fireEvent.press(rechargeButton);
    expect(actions.rechargeDetails).toHaveBeenCalledWith(FORMS.primaryRechargeDetails, STRINGS.NO);
  });

  test('handles proceed recharge for ETSK_MULTI_TV_SUMMARY', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_MULTI_TV_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const rechargeButton = screen.getByTestId('button-test');
    fireEvent.press(rechargeButton);
    expect(actions.rechargeDetails).toHaveBeenCalledWith(FORMS.etskMultiTvRechargeDetails, STRINGS.NO);
  });

  test('handles proceed recharge for ETSK_REPUSH_SUMMARY', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const rechargeButton = screen.getByTestId('button-test');
    fireEvent.press(rechargeButton);
    expect(actions.rechargeDetails).toHaveBeenCalledWith(FORMS.eTSKRepushRechargeDetails, STRINGS.NO);
  });

  test('handles proceed recharge for MULTI_TV_REGISTRATION_SUMMARY', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const rechargeButton = screen.getByTestId('button-test');
    fireEvent.press(rechargeButton);
    expect(actions.rechargeDetails).toHaveBeenCalledWith(FORMS.multiTvRechargeDetails, STRINGS.NO);
  });

  test('handles proceed recharge for WO_RECREATION_SUMMARY', async () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.WO_RECREATION_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    const rechargeButton = screen.getByTestId('button-test');
    fireEvent.press(rechargeButton);
    expect(callAction).toHaveBeenCalledWith({ recharge: STRINGS.NO }, QUERY.WoRechargeDetails);
  });

  test('displays error message when present', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const stateWithError = { ...mockState, common: { errorMessage: 'Test error' } };
    const store = createMockStore(stateWithError);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Test error')).toBeTruthy();
  });

  test('displays loading indicator when isModalLoading is true', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const stateWithLoading = { ...mockState, ui: { isModalLoading: true } };
    const store = createMockStore(stateWithLoading);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('timeSlotsContainer-test')).toBeTruthy();
  });

  test('renders with error prop', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer error="Custom error" id="test-id" />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Custom error')).toBeTruthy();
  });

  test('renders in mobile view', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(400);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('timeSlotsContainer-test')).toBeTruthy();
  });

  test('renders with disabled prop', () => {
    const useCurrentRoute = require('hooks/useCurrentRoute').default;
    useCurrentRoute.mockReturnValue({ routeName: ROUTE.WEB.ETSK_REPUSH_SUMMARY });
    const { getScreenWidth } = require('styles/dimentionHelper');
    getScreenWidth.mockReturnValue(600);

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TimeSlotsContainer disabled />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('timeSlotsContainer-test')).toBeTruthy();
  });
});
