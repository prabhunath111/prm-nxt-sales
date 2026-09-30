/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react-native';
import { STATE_KEY } from 'const';
import Notifications from './Notifications';

jest.mock('services/storageService', () => ({}));
jest.mock('services/apolloClient', () => ({}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedPath'),
}));

jest.mock('hooks/usePlatformFocusEffect', () => ({
  usePlatformFocusEffect: jest.fn((effect) => {
    require('react').useEffect(effect, []);
  }),
}));

jest.mock('react-native-moengage-inbox', () => ({
  __esModule: true,
  default: {
    trackMessageClicked: jest.fn(),
  },
  trackMessageClicked: jest.fn(),
}));

jest.mock('hooks/usePathNavigator', () => () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

jest.mock('utils/mixPanelHelper', () => ({
  getCustomMoEngagePayload: jest.fn((payload) => payload),
  getMoEngageImageUrl: jest.fn(() => 'http://image.url'),
}));

jest.mock('store/sales/actions', () => ({
  __esModule: true,
  default: {
    setAllNotifications: jest.fn(() => ({ type: 'MOCK' })),
    resetNotification: jest.fn(() => ({ type: 'MOCK' })),
    setRead: jest.fn(() => ({ type: 'MOCK' })),
    setUnRead: jest.fn(() => ({ type: 'MOCK' })),
  },
}));

const mockStore = (listData: any[] = [], read = false, unRead = false) =>
  configureStore({
    reducer: {
      form: () => ({
        [STATE_KEY.FORM_STATE]: { listData },
      }),
      notifications: () => ({ read, unRead }),
    },
  });

describe('Test for the component Notifications', () => {
  test('render component Notifications', () => {
    const store = mockStore([]);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Notifications />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('notification-test')).toBeTruthy();
  });

  test('render component Notifications with data', () => {
    const mockData = [
      {
        id: '1',
        receivedTime: Date.now(),
        isClicked: false,
        text: { title: 'Title', message: 'Message' },
        action: [{ kvPair: {} }],
      },
    ];
    const store = mockStore(mockData);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <Notifications />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Title')).toBeTruthy();
  });
});
