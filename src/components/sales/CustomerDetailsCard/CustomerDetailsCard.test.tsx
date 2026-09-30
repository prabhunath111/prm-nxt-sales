import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen } from '@testing-library/react-native';
import CustomerDetailsCard from './CustomerDetailsCard';

describe('Test for the component CustomerDetailsCard', () => {
  test('render component CustomerDetailsCard', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <CustomerDetailsCard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('text-test')).toBeTruthy();
  });

  test('snapshot tests for CustomerDetailsCard', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <CustomerDetailsCard />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
