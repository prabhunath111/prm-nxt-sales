/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import RedirectToManagePack from './RedirectToManagePack';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    WebView: (props: any) => React.createElement(View, { ...props, testID: 'RedirectToManagePack' }),
  };
});

const mockStore = configureStore({
  reducer: {
    modifyPack: () => ({
      packSelectorAccountInfo: {
        checksum: 'checksum',
        subscriberId: '12345',
        subscriberNameNT: 'Test',
        source: 'PRMNXT',
        agentUserId: 'agent',
        redirectionUrl: 'https://example.com',
      },
    }),
  },
});

describe('Test for the component RedirectToManagePack', () => {
  test('render component RedirectToManagePack', () => {
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <RedirectToManagePack />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('RedirectToManagePack')).toBeTruthy();
  });

  test('snapshot tests for RedirectToManagePack', () => {
    const component = render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <RedirectToManagePack />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
