/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as i18nConfig from 'config/i18n';
import { storageService } from 'services/storageService';
import * as languageHelper from 'utils/languageHelper';
import { STRINGS } from 'const';
import LanguageSelector from './LanguageSelector';

const languages = [
  { key: 'en', value: 'English' },
  { key: 'bn', value: 'Bengali' },
  { key: 'or', value: 'Oriya' },
];

let mockLanguage = 'en';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: mockLanguage,
    },
  }),
}));

jest.mock('config/i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('services/storageService', () => ({
  storageService: {
    setItem: jest.fn(),
  },
}));

jest.mock('utils/languageHelper', () => ({
  getFullLanguageName: jest.fn(),
  loadLanguage: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  __esModule: true,
  default: {
    getModel: jest.fn(() => 'mock-model'),
    getDeviceId: jest.fn(() => 'mock-device-id'),
    getSystemName: jest.fn(() => 'mock-system-name'),
    getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
    getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
    getSystemVersion: jest.fn(() => 'mock-system-version'),
    getVersion: jest.fn(() => 'mock-app-version'),
    isEmulatorSync: jest.fn(() => false),
    isTablet: jest.fn(() => false),
    getReadableVersion: jest.fn(() => 'mock-readable-version'),
  },
  isTablet: jest.fn(() => false),
}));

// Mock Modal and List as they might be complex
jest.mock('components/sales/Modal', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    ModalPlacement: {
      BOTTOM: 'bottom',
      TOP: 'top',
      LEFT: 'left',
      RIGHT: 'right',
    },
    default: ({ children, isVisible }: any) => (isVisible ? <View testID="mock-modal">{children}</View> : null),
  };
});

// List mock that renders renderItem for each data element
jest.mock('components/sales/List', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ data, renderItem, keyExtractor }: any) => (
      <View testID="mock-list">
        {data.map((item: any, index: number) => {
          if (keyExtractor) keyExtractor(item, index);
          return renderItem({ item, index });
        })}
      </View>
    ),
  };
});

jest.mock('components/sales/Gradient', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => <View>{children}</View>,
  };
});

describe('Test for the component LanguageSelector', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        fetchLanguage: (state = { languageData: languages }) => state,
      },
    });
    jest.clearAllMocks();
    mockLanguage = 'en';
    (languageHelper.getFullLanguageName as jest.Mock).mockReturnValue('English');
  });

  test('render and open language selector', async () => {
    render(
      <Provider store={store}>
        <LanguageSelector />
      </Provider>,
    );

    expect(screen.getByTestId('language-test-container')).toBeTruthy();

    // Open selector
    fireEvent.press(screen.getByTestId('language-selector-pressable'));

    // LanguageList (Modal) should show up.
    expect(screen.getByTestId('mock-modal')).toBeTruthy();
    expect(screen.getByText('English')).toBeTruthy();
    expect(screen.getByText('Bengali')).toBeTruthy();
  });

  test('select a language', async () => {
    render(
      <Provider store={store}>
        <LanguageSelector />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('language-selector-pressable'));

    // Select Bengali
    fireEvent.press(screen.getByTestId('language-item-bn'));

    expect(languageHelper.loadLanguage).toHaveBeenCalled();
    expect(i18nConfig.changeLanguage).toHaveBeenCalledWith('bn');
    await waitFor(() => expect(storageService.setItem).toHaveBeenCalledWith(STRINGS.LANG, 'bengali'));
    await waitFor(() => expect(storageService.setItem).toHaveBeenCalledWith(STRINGS.APP_LANGUAGE, 'bn'));
  });

  test('useEffect coverage for different languages', () => {
    // Case 1: Bangla -> Bengali
    mockLanguage = 'bn';
    (languageHelper.getFullLanguageName as jest.Mock).mockReturnValue(STRINGS.BANGLA);

    const { rerender } = render(
      <Provider store={store}>
        <LanguageSelector />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('language-selector-pressable'));

    // Case 2: Odia -> Oriya
    mockLanguage = 'or';
    (languageHelper.getFullLanguageName as jest.Mock).mockReturnValue(STRINGS.ODIA);
    rerender(
      <Provider store={store}>
        <LanguageSelector />
      </Provider>,
    );

    // Case 3: Other
    mockLanguage = 'hi';
    (languageHelper.getFullLanguageName as jest.Mock).mockReturnValue('Hindi');
    rerender(
      <Provider store={store}>
        <LanguageSelector />
      </Provider>,
    );
  });

  test('snaphot test', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <LanguageSelector />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
