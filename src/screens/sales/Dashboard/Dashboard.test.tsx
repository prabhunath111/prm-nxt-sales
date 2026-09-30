import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import Dashboard from './Dashboard';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

describe('Test for the component Dashboard', () => {
  test('render component Dashboard', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Dashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('table-test')).toBeTruthy();
  });

  test('snapshot tests for Dashboard', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <Dashboard />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
