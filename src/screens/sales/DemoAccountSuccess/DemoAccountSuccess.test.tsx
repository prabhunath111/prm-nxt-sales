import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen, fireEvent } from '@testing-library/react-native';
import DemoAccountSuccess from './DemoAccountSuccess';

// Mock navigate and goHome
jest.mock('hooks/useNavigate', () => () => ({
  navigate: jest.fn(),
  goHome: jest.fn(),
}));

describe('Test for the component DemoAccountSuccess', () => {
  test('render component DemoAccountSuccess', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DemoAccountSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('demoAccountTest')).toBeTruthy();
  });

  test('snapshot tests for DemoAccountSuccess', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <DemoAccountSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('triggers moduleRouteHandler when module row is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <DemoAccountSuccess />
        </NavigationContainer>
      </Provider>,
    );
    const pressables = getByTestId('button-test');
    fireEvent.press(pressables);
  });

  test('calls goHome when back to home button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <DemoAccountSuccess />
        </NavigationContainer>
      </Provider>,
    );

    const homeBtn = getByText('strings.backToHome');
    fireEvent.press(homeBtn);
  });
});
