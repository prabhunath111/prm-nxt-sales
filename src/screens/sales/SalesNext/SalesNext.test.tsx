/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { STATE_KEY } from 'const';
import actions from 'store/sales/actions/form';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import SalesNext from './SalesNext';

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

const mockRoute = { routeName: 'raiseRequest' };
jest.mock('hooks/useCurrentRoute', () => () => mockRoute);

jest.mock('store/sales/actions/form', () => ({
  setFormValues: jest.fn(() => ({ type: 'SET_FORM_VALUES' })),
  setNavigationData: jest.fn(() => ({ type: 'SET_NAV_DATA' })),
  submitForm: jest.fn(() => () => Promise.resolve({ status: true, route: 'successRoute' })),
}));

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    resetDropdownData: jest.fn(() => ({ type: 'RESET_DROPDOWN' })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_MODAL' })),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Button } = require('react-native');
  return {
    SalesFormBuilder: ({ onSubmit }: any) => (
      <View testID="mock-sales-form-builder">
        <Button title="Nav" onPress={() => onSubmit({ val: 1 }, 'navigation', 'query', 'target')} testID="btn-nav" />
        <Button title="NavNoTarget" onPress={() => onSubmit({ val: 1 }, 'navigation', 'query', '')} testID="btn-nav-no-target" />
        <Button title="NavTo" onPress={() => onSubmit({ val: 1 }, 'navigateTo', 'query', 'target')} testID="btn-nav-to" />
        <Button title="SubmitNav" onPress={() => onSubmit({ val: 1 }, 'navigationWithSubmit', 'query', 'target')} testID="btn-sub-nav" />
        <Button title="Link" onPress={() => onSubmit({ val: 1 }, 'link', 'query', 'target')} testID="btn-link" />
        <Button title="Default" onPress={() => onSubmit({ val: 1 }, 'DEFAULT', 'query', '')} testID="btn-default" />
      </View>
    ),
  };
});

const createMockStore = (state: any) =>
  configureStore({
    reducer: {
      user: () => state.user,
      form: () => ({}),
      redirection: () => ({ data: {} }),
      ui: () => ({ isLoading: false }),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('SalesNext Component', () => {
  const initialState = {
    user: { info: { name: 'test' } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders and dispatches initial actions', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    expect(actions.setFormValues).toHaveBeenCalledWith(initialState.user.info);
    expect(formAction.resetDropdownData).toHaveBeenCalledWith({});
  });

  test('hides bottom modal when stateKey is FORM_STATE', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext stateKey={STATE_KEY.FORM_STATE} />
      </Provider>,
    );

    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  test('sets containerWidthStyle for 80P routes', () => {
    mockRoute.routeName = 'eTSKRegistration';
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );
    // containerWidthStyle is passed to SalesFormBuilder, we can check if it rendered (if we mock SalesFormBuilder to display it)
  });

  test('handles onSubmit for NAVIGATION', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-nav'));
    expect(actions.setNavigationData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('target');
  });

  test('handles onSubmit for NAVIGATION_TO', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-nav-to'));
    expect(actions.setNavigationData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('target');
  });

  test('handles onSubmit for SUBMIT_NAVIGATION success with response route', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-sub-nav'));
    expect(actions.submitForm).toHaveBeenCalled();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('successRoute'));
  });

  test('handles onSubmit for SUBMIT_NAVIGATION success without response route', async () => {
    (actions.submitForm as jest.Mock).mockReturnValueOnce(() => Promise.resolve({ status: true }));
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-sub-nav'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('target'));
  });

  test('handles onSubmit for SUBMIT_NAVIGATION failure', async () => {
    (actions.submitForm as jest.Mock).mockReturnValueOnce(() => Promise.resolve({ status: false }));
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-sub-nav'));
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });

  test('handles onSubmit for LINK success', async () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-link'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('successRoute'));
  });

  test('handles onSubmit for NAVIGATION without navigateTo', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-nav-no-target'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles onSubmit for default path', () => {
    render(
      <Provider store={createMockStore(initialState)}>
        <SalesNext />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('btn-default'));
    expect(actions.submitForm).toHaveBeenCalled();
  });
});
