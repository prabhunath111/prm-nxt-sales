/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ROUTE, QUERY, FORMS, STRINGS } from 'const';
import DealerSuccess from './DealerSuccess';

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
const mockReset = jest.fn();

jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    navigate: mockNavigate,
    goHome: mockGoHome,
    reset: mockReset,
  }),
}));

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: () => ({
    routeName: 'DealerSuccess',
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'MOCK_ACTION' })),
}));

const mockStore = (dealerSuccessData = {}, isRedirection = false) =>
  configureStore({
    reducer: {
      dealerHelp: () => ({ dealerSuccessData }),
      user: () => ({ isRedirection }),
      rechargeWinback: () => ({ winBackSuccessData: {} }),
    },
  });

describe('Test for the component DealerSuccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render component DealerSuccess', () => {
    const store = mockStore({ message: STRINGS.SUCCESS });
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DealerSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('strings.backToHome')).toBeTruthy();
  });

  test('navigates to raise new dealer request on press', () => {
    const { callAction } = require('utils/formBuilderHelper');
    const store = mockStore({ message: 'Success' });
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DealerSuccess />
        </NavigationContainer>
      </Provider>,
    );
    fireEvent.press(screen.getByText('strings.raiseNewDealerRequest'));
    expect(callAction).toHaveBeenCalledWith({}, QUERY.GetMainCategoryBR, '', mockNavigate);
    expect(mockReset).toHaveBeenCalledWith(ROUTE.WEB.DEALER_RAISE_REQUEST, false);
  });

  test('navigates to track dealer request on press', () => {
    const { callAction } = require('utils/formBuilderHelper');
    const store = mockStore({ message: 'Success' });
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DealerSuccess />
        </NavigationContainer>
      </Provider>,
    );
    fireEvent.press(screen.getByText('strings.trackDealerRequest'));
    const expectedInput = {
      input: {
        formName: FORMS.dealerHelpTrackTable,
      },
    };
    expect(callAction).toHaveBeenCalledWith(expectedInput, QUERY.GetAllSRDetailsForLoginUser, '', mockNavigate);
    expect(mockReset).toHaveBeenCalledWith(ROUTE.WEB.DEALER_TRACK_REQUEST, false);
  });

  test('calls goHome with isRedirection on back to home button press', () => {
    const store = mockStore({ message: 'Success' }, true);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DealerSuccess />
        </NavigationContainer>
      </Provider>,
    );
    fireEvent.press(screen.getByText('strings.backToHome'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  test('snapshot tests for DealerSuccess', () => {
    const store = mockStore({ message: STRINGS.SUCCESS });
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <DealerSuccess />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
