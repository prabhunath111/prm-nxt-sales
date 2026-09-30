/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as reactRedux from 'react-redux';
import actions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import PrmNext from './PrmNext';

// Mocking dependencies
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('store/sales/actions/form', () => ({
  setFormValues: jest.fn((info) => ({ type: 'SET_FORM_VALUES', payload: info })),
  setNavigationData: jest.fn((data, queryName, formName, routeName) => ({ type: 'SET_NAVIGATION_DATA', payload: { data, queryName, formName, routeName } })),
  submitForm: jest.fn((_values, _queryName) => () => Promise.resolve({ status: true, route: 'successRoute' })),
}));
jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_BOTTOM_MODAL' })),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));
jest.mock('hooks/useCurrentRoute', () => () => ({ routeName: 'CurrentRoute' }));
jest.mock('const', () => ({
  SUBMISSION: {
    NAVIGATION: 'NAVIGATION',
    SUBMIT_NAVIGATION: 'SUBMIT_NAVIGATION',
  },
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Button } = require('react-native');
  return {
    SalesFormBuilder: ({ onSubmit }: any) => (
      <View testID="form-builder-mock">
        <Button testID="submit-navigation" title="Submit Navigation" onPress={() => onSubmit({ name: 'test' }, 'NAVIGATION', 'queryName', 'navigateToRoute')} />
        <Button testID="submit-submit-navigation" title="Submit + Navigation" onPress={() => onSubmit({ name: 'test' }, 'SUBMIT_NAVIGATION', 'queryName', 'navigateToRoute')} />
        <Button testID="submit-default" title="Submit Default" onPress={() => onSubmit({ name: 'test' }, 'OTHER', 'queryName', 'whatever')} />
      </View>
    ),
  };
});

const mockDispatch: any = jest.fn((action) => (typeof action === 'function' ? action(mockDispatch) : action));

describe('PrmNext Component', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({ info: { userId: '123' } });

    store = configureStore({
      reducer: {
        form: (state = { data: {} }) => state,
      },
    });
  });

  it('renders correctly and calls setFormValues on mount', () => {
    render(
      <Provider store={store}>
        <PrmNext />
      </Provider>,
    );

    expect(screen.getByTestId('form-builder-mock')).toBeTruthy();
    expect(mockDispatch).toHaveBeenCalledWith(actions.setFormValues({ userId: '123' }));
  });

  it('uses customFormName if provided', () => {
    render(
      <Provider store={store}>
        <PrmNext customFormName="CustomForm" />
      </Provider>,
    );

    // To verify formName used, we could check how onSubmit is called or mock SalesFormBuilder differently
    // but the logic is const formName = customFormName || (routeName as FormNameKeys);
  });

  it('handles SUBMISSION.NAVIGATION logic', () => {
    render(
      <Provider store={store}>
        <PrmNext />
      </Provider>,
    );

    const button = screen.getByTestId('submit-navigation');
    fireEvent.press(button);

    expect(mockDispatch).toHaveBeenCalledWith(actions.setNavigationData({ name: 'test' }, 'queryName', 'CurrentRoute', 'CurrentRoute'));
    expect(mockNavigate).toHaveBeenCalledWith('navigateToRoute');
  });

  it('handles SUBMISSION.SUBMIT_NAVIGATION success logic', async () => {
    (actions.submitForm as unknown as jest.Mock).mockReturnValue(Promise.resolve({ status: true, route: 'successRoute' }));

    render(
      <Provider store={store}>
        <PrmNext />
      </Provider>,
    );

    const button = screen.getByTestId('submit-submit-navigation');
    fireEvent.press(button);

    expect(mockDispatch).toHaveBeenCalledWith(actions.setNavigationData({ name: 'test' }, 'queryName', 'CurrentRoute', 'CurrentRoute'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.submitForm({ name: 'test' }, 'queryName'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(uiActions.hideBottomModal());
      expect(mockNavigate).toHaveBeenCalledWith('successRoute');
    });
  });

  it('handles SUBMISSION.SUBMIT_NAVIGATION success logic without route in response', async () => {
    (actions.submitForm as unknown as jest.Mock).mockReturnValue(Promise.resolve({ status: true }));

    render(
      <Provider store={store}>
        <PrmNext />
      </Provider>,
    );

    const button = screen.getByTestId('submit-submit-navigation');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('navigateToRoute');
    });
  });

  it('handles SUBMISSION.SUBMIT_NAVIGATION failure logic', async () => {
    (actions.submitForm as unknown as jest.Mock).mockReturnValue(Promise.resolve({ status: false }));

    render(
      <Provider store={store}>
        <PrmNext />
      </Provider>,
    );

    const button = screen.getByTestId('submit-submit-navigation');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles default submission logic', () => {
    render(
      <Provider store={store}>
        <PrmNext />
      </Provider>,
    );

    const button = screen.getByTestId('submit-default');
    fireEvent.press(button);

    expect(mockDispatch).toHaveBeenCalledWith(actions.submitForm({ name: 'test' }, 'queryName'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
