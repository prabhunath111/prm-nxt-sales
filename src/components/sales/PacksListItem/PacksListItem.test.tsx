import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from 'store';
import { NavigationContainer } from '@react-navigation/native';
import PacksListItem from './PacksListItem';

jest.mock('utils/imageHelper');
jest.mock('utils/platformHelper');

beforeAll(() => {
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.resetAllMocks();
});

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

describe('Test for the component PacksListItem', () => {
  test('render component PacksListItem', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PacksListItem data={{ id: 1 }} isOfferAdded />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('PacksListItem'));
  });

  test('snapshot tests for PacksListItem', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <PacksListItem data={{ id: 1 }} isOfferAdded />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
