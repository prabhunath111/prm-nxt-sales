import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ROUTE } from 'const';
import TsraLifeSuccess from './TsraLifeSuccess';

jest.mock('services/storageService', () => ({}));
jest.mock('services/apolloClient', () => ({}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

const mockNavigate = jest.fn();
const mockGoHome = jest.fn();

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    navigate: mockNavigate,
    goHome: mockGoHome,
  }),
}));

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: () => ({
    routeName: 'TsraLifeSuccess',
  }),
}));

const mockResetTsraSubscriberList = jest.fn();

jest.mock('store/sales/actions/tsraLifeCycle', () => ({
  __esModule: true,
  default: {
    resetTsraSubscriberList: () => mockResetTsraSubscriberList,
  },
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

const mockStore = (tsraSuccessData = {}, isRedirection = false) =>
  configureStore({
    reducer: {
      tsraLifeCycle: () => ({ tsraSuccessData }),
      user: () => ({ isRedirection, info: {} }),
      rechargeWinback: () => ({ winBackSuccessData: {} }),
    },
  });

describe('Test for the component TsraLifeSuccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render component TsraLifeSuccess', () => {
    const store = mockStore({ message: 'Success message' });
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraLifeSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('strings.backToHome')).toBeTruthy();
  });

  test('navigates to track TSRA action on press', () => {
    const store = mockStore({ message: 'Success' });
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraLifeSuccess />
        </NavigationContainer>
      </Provider>,
    );
    fireEvent.press(screen.getByText('strings.trackTsraRequest'));
    expect(mockResetTsraSubscriberList).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.TRACK_TSRA_ACTION);
  });

  test('navigates to filter track TSRA request on press', () => {
    const store = mockStore({ message: 'Success' });
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraLifeSuccess />
        </NavigationContainer>
      </Provider>,
    );
    fireEvent.press(screen.getByText('strings.raiseNewActionTsraRequest'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.FILTER_TRACK_TSRA_REQUEST);
  });

  test('calls goHome with isRedirection on back to home button press', () => {
    const store = mockStore({ message: 'Success' }, true);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraLifeSuccess />
        </NavigationContainer>
      </Provider>,
    );
    fireEvent.press(screen.getByText('strings.backToHome'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  test('snapshot tests for TsraLifeSuccess', () => {
    const store = mockStore({ message: 'Success message' });
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraLifeSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
