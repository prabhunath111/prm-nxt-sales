import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import SalesFormBuilder from './SalesFormBuilder';

describe('Test for the component SalesFormBuilder', () => {
  test('render component SalesFormBuilder', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <SalesFormBuilder formName="" onSubmit={() => {}} />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  test('snapshot tests for SalesFormBuilder', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <SalesFormBuilder formName="" onSubmit={() => {}} />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
