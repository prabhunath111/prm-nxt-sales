import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch', () => {
  it('renders ToggleSwitch correctly with default props', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('toggleSwitchTest')).toBeTruthy();
  });

  it('renders ToggleSwitch correctly with label', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch label="Test Label" />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Test Label')).toBeTruthy();
  });

  it('renders ToggleSwitch correctly with custom testID', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch testID="custom-toggle" />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('custom-toggle')).toBeTruthy();
  });

  it('renders ToggleSwitch correctly when selectedValue is true', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch selectedValue />
        </NavigationContainer>
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onValueChange when toggled', () => {
    const onValueChangeMock = jest.fn();
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch onValueChange={onValueChangeMock} selectedValue={false} />
        </NavigationContainer>
      </Provider>,
    );

    const switchComponent = screen.getByRole('switch');
    fireEvent(switchComponent, 'valueChange', true);

    expect(onValueChangeMock).toHaveBeenCalledWith(true);
  });

  it('calls onValueChange when toggled from true to false', () => {
    const onValueChangeMock = jest.fn();
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch onValueChange={onValueChangeMock} selectedValue />
        </NavigationContainer>
      </Provider>,
    );

    const switchComponent = screen.getByRole('switch');
    fireEvent(switchComponent, 'valueChange', false);

    expect(onValueChangeMock).toHaveBeenCalledWith(false);
  });

  it('does not crash when toggled and onValueChange is not provided', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch selectedValue={false} />
        </NavigationContainer>
      </Provider>,
    );

    const switchComponent = screen.getByRole('switch');
    fireEvent(switchComponent, 'valueChange', true);
    // Should not throw
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ToggleSwitch />
        </NavigationContainer>
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
