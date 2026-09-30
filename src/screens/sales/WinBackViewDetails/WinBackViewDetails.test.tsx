import { Provider } from 'react-redux';
import { store } from 'store';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import WinBackViewDetails from './WinBackViewDetails';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('Test for the component WinBackViewDetails', () => {
  test('render component WinBackViewDetails', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <WinBackViewDetails />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('strings.channelPackPrice')).toBeTruthy();
  });

  test('snapshot tests for WinBackViewDetails', () => {
    const component = render(
      <View>
        <WinBackViewDetails />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
