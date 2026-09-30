import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import CompetitorDataSuccess from './CompetitorDataSuccess';

describe('Test for the component CompetitorDataSuccess', () => {
  test('render component CompetitorDataSuccess', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <CompetitorDataSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('competitorDataTest')).toBeTruthy();
  });

  test('snapshot tests for CompetitorDataSuccess', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <CompetitorDataSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
