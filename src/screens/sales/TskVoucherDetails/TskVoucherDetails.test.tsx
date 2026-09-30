import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import * as navigationHelper from 'utils/navigationHelper';
import useNavigate from 'hooks/useNavigate';
import TskVoucherDetails from './TskVoucherDetails';

jest.mock('utils/navigationHelper');
jest.mock('hooks/useNavigate');
jest.mock('components/sales/PincodeDetailsCard/PincodeDetailsCard', () => () => null);
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'ltr' }),
}));
jest.mock('styles/webBreakpoints', () => ({
  gcs: () => '',
}));

describe('Test for the component TskVoucherDetails', () => {
  const mockGoHome = jest.fn();
  const mockCloseWebView = jest.spyOn(navigationHelper, 'closeWebView');

  const createMockStore = (isRedirection: boolean) =>
    configureStore({
      reducer: {
        user: () => ({ isRedirection }),
        tskVoucher: () => ({ tskDetails: {} }),
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue({ goHome: mockGoHome });
  });

  test('render component TskVoucherDetails', () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TskVoucherDetails />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('TskVoucherDetails')).toBeTruthy();
  });

  test('calls goHome when OK button is pressed and isRedirection is false', () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TskVoucherDetails />
        </NavigationContainer>
      </Provider>,
    );

    const okButton = screen.getByTestId('button-test');
    fireEvent.press(okButton);
    expect(mockGoHome).toHaveBeenCalled();
  });

  test('calls closeWebView when OK button is pressed and isRedirection is true', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TskVoucherDetails />
        </NavigationContainer>
      </Provider>,
    );

    const okButton = screen.getByTestId('button-test');
    fireEvent.press(okButton);
    expect(mockCloseWebView).toHaveBeenCalled();
  });
});
