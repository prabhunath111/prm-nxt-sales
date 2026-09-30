import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen } from '@testing-library/react-native';
import BalanceContainer from './BalanceContainer';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

describe('Test for the component BalanceContainer', () => {
  test('render component BalanceContainer', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <BalanceContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('image-test')).toBeTruthy();
  });

  test('snapshot tests for BalanceContainer', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <BalanceContainer />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
