import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from 'store';
import { NavigationContainer } from '@react-navigation/native';
import EvdBalanceInfo from './EvdBalanceInfo';

describe('Test for the component EvdBalanceInfo', () => {
  test('render component EvdBalanceInfo', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <EvdBalanceInfo />
        </NavigationContainer>
      </Provider>,
    );
  });

  test('snapshot tests for EvdBalanceInfo', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <EvdBalanceInfo />
        </NavigationContainer>
      </Provider>,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
