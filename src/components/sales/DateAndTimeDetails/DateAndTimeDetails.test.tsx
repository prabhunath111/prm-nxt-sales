import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import salesReducer from 'store/sales/reducer/root.reducer';
import prmReducer from 'store/prm/reducer/root.reducer';
import DateAndTimeDetails from './DateAndTimeDetails';

const createTestStore = () =>
  configureStore({
    reducer: combineReducers({
      ...salesReducer,
      prmReducer,
    }),
  });

describe('Test for the component DateAndTimeDetails', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-21T15:51:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('render component DateAndTimeDetails', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DateAndTimeDetails />{' '}
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('strings.date')).toBeTruthy();
  });

  test('snapshot tests for DateAndTimeDetails', () => {
    const store = createTestStore();
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <View>
            <DateAndTimeDetails />
          </View>
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
