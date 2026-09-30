import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import { render, screen } from '@testing-library/react-native';
import ActionTileCard from './ActionTileCard';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

describe('Test for the component ActionTileCard', () => {
  test('render component ActionTileCard', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionTileCard />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('action-tile-card')).toBeTruthy();
  });

  test('snapshot tests for ActionTileCard', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <ActionTileCard />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
