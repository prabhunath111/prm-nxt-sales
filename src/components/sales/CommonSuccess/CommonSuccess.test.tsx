/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import CommonSuccess from './CommonSuccess';

// Mock Redux initial state
const mockInitialState = {
  rechargeWinback: {
    winBackSuccessData: {
      message: 'Recharge Successful',
    },
  },
};

// Mock reducer
const mockReducer = (state = mockInitialState, action = { type: '' }) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Mock store
const store = createStore(mockReducer);

// Mocks
jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('hooks/useCurrentRoute', () => () => ({
  routeName: 'MockedRoute',
}));

describe('Test for the component CommonSuccess', () => {
  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <Provider store={store}>
        <NavigationContainer>{ui}</NavigationContainer>
      </Provider>,
    );

  test('render component CommonSuccess', () => {
    renderWithProviders(<CommonSuccess />);
    expect(screen.getByTestId('image-test')).toBeTruthy();
  });

  test('snapshot tests for CommonSuccess', () => {
    const component = renderWithProviders(<CommonSuccess />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
