import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen } from '@testing-library/react-native';
import AutoEvdSuccess from './AutoEvdSuccess';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

describe('Test for the component AutoEvdSuccess', () => {
  test('render component AutoEvdSuccess', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <AutoEvdSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('button-test')).toBeTruthy();
  });

  test('snapshot tests for AutoEvdSuccess', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <AutoEvdSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
