import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen } from '@testing-library/react-native';
import DetailsHeader from './DetailsHeader';

describe('Test for the component DetailsHeader', () => {
  test('render component DetailsHeader', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DetailsHeader />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('text-test')).toBeTruthy();
  });

  test('snapshot tests for DetailsHeader', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <DetailsHeader />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
