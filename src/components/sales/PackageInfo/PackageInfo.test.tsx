/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import actions from 'store/sales/actions/activationStatusDetails';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { callAction } from 'utils/formBuilderHelper';
import { STRINGS } from 'const';
import PackageInfo from './PackageInfo';

// Mocking dependencies
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('store/sales/actions/activationStatusDetails', () => ({
  getActivationStatusPacInfo: jest.fn(() => ({ type: 'GET_INFO' })),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('services/moengageMixpanel/config', () => ({
  MoengageMixpanelModules: {
    ActivationStatus: {
      ActivationStatusPackageInformation: {
        moduleName: 'Package Info Screen',
        attributes: {
          Status: 'Status',
          SubscriberID: 'SubscriberID',
        },
      },
    },
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('config/i18n', () => ({
  i18n: { t: (s: string) => s },
  default: { t: (s: string) => s },
  getDeviceLanguage: () => 'en',
}));

const mockDispatch: any = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(mockDispatch, () => mockStoreState);
  }
  return action;
});

const mockStoreState = {
  activationStatusDetails: {
    accountInfo: { subId: '123' },
    subscriptionDetails: [
      { packageName: 'Base Pack', packagePrice: 100, packDuration: 'M', packageType: STRINGS.PREMIUM_PACKAGE, packNameNT: 'BaseNT' },
      { packageName: 'Add-on', packagePrice: 50, packDuration: 'M', packageType: 'basic' },
    ],
  },
  common: {
    errorMessage: '',
  },
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector(mockStoreState),
}));

const mockStore = configureStore({
  reducer: {
    activationStatusDetails: (state = mockStoreState.activationStatusDetails) => state,
    common: (state = mockStoreState.common) => state,
  },
});

describe('PackageInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (actions.getActivationStatusPacInfo as jest.Mock).mockReturnValue({ type: 'GET_INFO' });
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <PackageInfo />
        </NavigationContainer>
      </Provider>,
    );

  test('renders correctly and dispatches actions on mount', () => {
    renderComponent();
    expect(screen.getByTestId('package-info-test')).toBeTruthy();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_INFO' });
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('renders list items correctly', () => {
    renderComponent();
    expect(screen.getByText('Base Pack')).toBeTruthy();
    expect(screen.getByText('₹100')).toBeTruthy();
    expect(screen.getByText('Add-on')).toBeTruthy();
  });

  test('handles view details for premium packages', async () => {
    (callAction as jest.Mock).mockImplementation(() => () => Promise.resolve({ status: true }));
    renderComponent();

    const viewDetailsArr = screen.getAllByText('strings.viewDetails');
    fireEvent.press(viewDetailsArr[0]);

    await waitFor(() => expect(callAction).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  test('handles empty list state', () => {
    const emptyState = {
      activationStatusDetails: {
        accountInfo: {},
        subscriptionDetails: [],
      },
      common: {
        errorMessage: 'No data found',
      },
    };

    jest.spyOn(require('react-redux'), 'useSelector').mockImplementation((selector: any) => selector(emptyState));

    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <PackageInfo />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('No data found')).toBeTruthy();
  });

  test('snapshot tests', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
