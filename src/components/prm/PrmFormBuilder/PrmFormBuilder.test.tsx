import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import PrmFormBuilder from './PrmFormBuilder';

describe('Test for the component PrmFormBuilder', () => {
  test('render component PrmFormBuilder', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PrmFormBuilder formName="" onSubmit={() => {}} />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('formBuilderTest')).toBeTruthy();
  });

  test('snapshot tests for PrmFormBuilder', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <PrmFormBuilder formName="" onSubmit={() => {}} />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
