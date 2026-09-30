import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import EtskRegistration from './EtskRegistration';

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

describe('Test for the component EtskRegistration', () => {
  test('render component EtskRegistration', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <EtskRegistration />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('EtskRegistration')).toBeTruthy();
  });

  test('snapshot tests for EtskRegistration', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <EtskRegistration />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
