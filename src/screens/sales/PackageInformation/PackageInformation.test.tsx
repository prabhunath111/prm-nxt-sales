/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ALERT, STRINGS } from 'const';
import actions from 'store/sales/actions';
import uiActions from 'store/sales/actions/ui';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import PackageInformation from './PackageInformation';

jest.mock('store/sales/actions', () => ({
  getPackageInformation: jest.fn(() => ({ type: 'GET_PACKAGE_INFO' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  showAlert: jest.fn((msg, type, _primary, _data) => ({ type: 'SHOW_ALERT', msg, alertType: type })),
}));

jest.mock('utils/navigationHelper', () => ({
  handleWebViewUrl: jest.fn(),
}));

jest.mock('services/moengageMixpanel', () => ({
  MoengageMixpanel: {
    trackEvent: jest.fn(),
  },
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((style) => style),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Card: ({ children, cardStyle }: any) => <View style={cardStyle}>{children}</View>,
    EmptyData: ({ text }: any) => <Text>{text}</Text>,
    FormHeader: ({ formName }: any) => <Text>{formName}</Text>,
    Text: ({ children, style, label }: any) => <Text style={style}>{label || children}</Text>,
    WebView: ({ uri }: any) => (
      <View testID="webview-mock">
        <Text>{uri}</Text>
      </View>
    ),
  };
});

const createMockStore = (initialState: any) =>
  configureStore({
    reducer: {
      packageInformation: (state = initialState.packageInformation) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

describe('PackageInformation Component', () => {
  const initialState: any = {
    packageInformation: { packageInformation: null },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (state: any = initialState) =>
    render(
      <Provider store={createMockStore(state)}>
        <NavigationContainer>
          <PackageInformation />
        </NavigationContainer>
      </Provider>,
    );

  test('dispatches getPackageInformation and tracks events on mount', () => {
    renderComponent();
    expect(actions.getPackageInformation).toHaveBeenCalled();
    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });

  test('renders EmptyData when packageInformation is null', () => {
    renderComponent();
    expect(screen.getByText(STRINGS.EMPTY_PACKAGE_INFO_COLLECTION)).toBeTruthy();
  });

  test('renders package list and handles item click with valid URL', async () => {
    (handleWebViewUrl as jest.Mock).mockResolvedValue('http://mapped-url.com');
    const dataWithPackages = {
      packageInformation: {
        packageInformation: {
          packageInformation: [{ linkName: 'Pack 1', linkURL: 'http://pack1.com' }],
        },
      },
    };

    renderComponent(dataWithPackages);
    expect(screen.getByText('Pack 1')).toBeTruthy();

    fireEvent.press(screen.getByText('Pack 1'));

    await waitFor(() => expect(handleWebViewUrl).toHaveBeenCalledWith('http://pack1.com'));
    expect(await screen.findByTestId('webview-mock')).toBeTruthy();
    expect(screen.getByText('http://mapped-url.com')).toBeTruthy();
  });

  test('handles item click with empty URL', () => {
    const dataWithPackages = {
      packageInformation: {
        packageInformation: {
          packageInformation: [{ linkName: 'Pack 2', linkURL: '' }],
        },
      },
    };

    renderComponent(dataWithPackages);
    fireEvent.press(screen.getByText('Pack 2'));

    expect(uiActions.showAlert).toHaveBeenCalledWith('errors.noDataAvailable', ALERT.INFO, expect.anything(), expect.anything());
  });

  test('tracks event when packageInformation updates', () => {
    const dataWithPackages = {
      packageInformation: {
        packageInformation: {
          packageInformation: [{ linkName: 'Pack 1', linkURL: 'http://pack1.com' }],
        },
      },
    };

    const { rerender } = renderComponent();

    rerender(
      <Provider store={createMockStore(dataWithPackages)}>
        <NavigationContainer>
          <PackageInformation />
        </NavigationContainer>
      </Provider>,
    );

    expect(MoengageMixpanel.trackEvent).toHaveBeenCalled();
  });
});
