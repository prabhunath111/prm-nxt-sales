/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react-native';
import BingeViewDetails from './BingeViewDetails';

// Mock dependencies
jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'web' }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((id) => id),
}));

// Mock components/sales
jest.mock('components/sales', () => {
  const { Text: RNText, TouchableOpacity: RNTouchableOpacity, Image: RNImage } = require('react-native');
  return {
    Button: ({ onPress, label, testID }: any) => (
      <RNTouchableOpacity onPress={onPress} testID={testID || 'button-test'}>
        <RNText>{label}</RNText>
      </RNTouchableOpacity>
    ),
    Image: ({ testID }: any) => <RNImage testID={testID || 'image-test'} />,
    Text: ({ label, style }: any) => <RNText style={style}>{label}</RNText>,
  };
});

// Mock redux hooks implicitly via a custom store
const createMockStore = (initialState: any) =>
  configureStore({
    reducer: {
      customerOffers: (state = initialState.customerOffers) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

const mockInitialState = {
  customerOffers: {
    selectedOffer: {
      imageArray: [{ id: '1', iconName: 'image1' }],
    },
  },
};

const renderComponent = (customState = {}) => {
  const state = {
    customerOffers: { ...mockInitialState.customerOffers, ...((customState as any).customerOffers || {}) },
  };
  const store = createMockStore(state);

  return render(
    <Provider store={store}>
      <NavigationContainer>
        <BingeViewDetails />
      </NavigationContainer>
    </Provider>,
  );
};

describe('Test for the component BingeViewDetails', () => {
  test('render component BingeViewDetails with images', () => {
    renderComponent();
    expect(screen.getByText('strings.bingeFlexiLite')).toBeTruthy();
    expect(screen.getAllByTestId('image-test')).toBeTruthy();
  });

  test('renders without selectedOffer or imageArray', () => {
    renderComponent({
      customerOffers: {
        selectedOffer: null,
      },
    });
    expect(screen.getByText('strings.bingeFlexiLite')).toBeTruthy();
  });

  test('button interaction (empty handler coverage)', () => {
    renderComponent();
    const button = screen.getByTestId('button-test');
    fireEvent.press(button);
  });

  test('snapshot tests for BingeViewDetails', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
