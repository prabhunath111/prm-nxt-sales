/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HeaderFilters from './HeaderFilters';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockLoadLanguage = jest.fn().mockResolvedValue(undefined);
const mockGetFullLanguageName = jest.fn().mockReturnValue('English');

jest.mock('utils/languageHelper', () => ({
  loadLanguage: (...args: any[]) => mockLoadLanguage(...args),
  getFullLanguageName: (...args: any[]) => mockGetFullLanguageName(...args),
}));

const mockSetItem = jest.fn().mockResolvedValue(undefined);
jest.mock('services/storageService', () => ({
  storageService: {
    setItem: (...args: any[]) => mockSetItem(...args),
    getItem: jest.fn().mockResolvedValue(null),
  },
}));

const mockGetMenus = jest.fn(() => ({ type: 'GET_MENUS' }));
jest.mock('store/sales/actions/fetchLanguage', () => ({
  __esModule: true,
  default: { getMenus: () => mockGetMenus() },
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'XL' }),
  BreakPoints: { XL: 'XL', LG: 'LG', MD: 'MD', MD_L: 'MD_L', SM: 'SM', XS: 'XS' },
}));

jest.mock('styles/dimentionHelper', () => ({
  getScreenHeight: () => 800,
  getScreenWidth: () => 400,
}));

jest.mock('components/sales/Modal', () => ({ children, isVisible }: any) => {
  const { View } = require('react-native');
  return isVisible ? <View testID="modal-wrapper">{children}</View> : null;
});

jest.mock('components/sales/Checkbox', () => ({ label, value, onValueChange }: any) => {
  const { TouchableOpacity, Text } = require('react-native');
  return (
    <TouchableOpacity testID={`checkbox-${label}`} onPress={onValueChange}>
      <Text>{label}</Text>
      <Text testID={`checkbox-${label}-state`}>{value ? 'checked' : 'unchecked'}</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/Button', () => ({ label, onPress }: any) => {
  const { TouchableOpacity, Text } = require('react-native');
  return (
    <TouchableOpacity testID={`btn-${label}`} onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
});

jest.mock('components/sales/Image', () => () => {
  const { View } = require('react-native');
  return <View testID="close-icon" />;
});

// ── Store factory ──────────────────────────────────────────────────────────────

const makeStore = (isLangSelectorModalVisible = true, languageData: any[] = []) =>
  configureStore({
    reducer: {
      ui: (state = { isLangSelectorModalVisible, bottomModal: { isModalVisible: false } }) => state,
      fetchLanguage: (state = { languageData }) => state,
    },
  });

const renderComponent = (isVisible = true, languages: any[] = [], closeModal = jest.fn()) => {
  const store = makeStore(isVisible, languages);
  render(
    <Provider store={store}>
      <HeaderFilters closeModal={closeModal} />
    </Provider>,
  );
  return { store, closeModal };
};

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('HeaderFilters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFullLanguageName.mockReturnValue('English');
    mockLoadLanguage.mockResolvedValue(undefined);
  });

  describe('Initial render', () => {
    it('renders the modal container when isLangSelectorModalVisible is true', () => {
      renderComponent(true);
      expect(screen.getByTestId('header-filters-test-container')).toBeTruthy();
    });

    it('does NOT render content when isLangSelectorModalVisible is false', () => {
      renderComponent(false);
      expect(screen.queryByTestId('header-filters-test-container')).toBeNull();
    });
  });

  describe('useEffect — language initialisation', () => {
    it('calls loadLanguage on mount', () => {
      renderComponent();
      expect(mockLoadLanguage).toHaveBeenCalled();
    });

    it('renders without crash when fullLanguageName is BANGLA (sets Bengali)', () => {
      mockGetFullLanguageName.mockReturnValue('Bangla');
      renderComponent();
      expect(screen.getByTestId('header-filters-test-container')).toBeTruthy();
    });

    it('renders without crash when fullLanguageName is ODIA (sets Oriya)', () => {
      mockGetFullLanguageName.mockReturnValue('Odia');
      renderComponent();
      expect(screen.getByTestId('header-filters-test-container')).toBeTruthy();
    });

    it('renders without crash for other full language names (else branch)', () => {
      mockGetFullLanguageName.mockReturnValue('Hindi');
      renderComponent();
      expect(screen.getByTestId('header-filters-test-container')).toBeTruthy();
    });
  });

  describe('languageList rendering', () => {
    it('renders a Checkbox for each language item', () => {
      renderComponent(true, [
        { key: 'en', value: 'English' },
        { key: 'hi', value: 'Hindi' },
      ]);
      expect(screen.getByTestId('checkbox-English')).toBeTruthy();
      expect(screen.getByTestId('checkbox-Hindi')).toBeTruthy();
    });

    it('renders without list items when languageData is empty', () => {
      renderComponent(true, []);
      expect(screen.getByTestId('header-filters-test-container')).toBeTruthy();
      expect(screen.queryByTestId('checkbox-English')).toBeNull();
    });

    it('marks matching language as checked (value=true)', () => {
      mockGetFullLanguageName.mockReturnValue('English');
      renderComponent(true, [
        { key: 'en', value: 'English' },
        { key: 'hi', value: 'Hindi' },
      ]);
      // English matches selectedLanguage so value=true → renders 'checked'
      expect(screen.getByText('checked')).toBeTruthy();
      // Hindi doesn't match → renders 'unchecked'
      expect(screen.getByText('unchecked')).toBeTruthy();
    });
  });

  describe('handleSelectLanguage', () => {
    it('saves language key and lowercase value to storage when checkbox pressed', async () => {
      renderComponent(true, [{ key: 'hi', value: 'Hindi' }]);
      await act(async () => {
        fireEvent.press(screen.getByTestId('checkbox-Hindi'));
      });
      expect(mockSetItem).toHaveBeenCalledWith('lang', 'hindi');
      expect(mockSetItem).toHaveBeenCalledWith('appLanguage', 'hi');
    });

    it('calls storageService twice with correct values when a language is selected', async () => {
      mockGetFullLanguageName.mockReturnValue('English');
      renderComponent(true, [
        { key: 'en', value: 'English' },
        { key: 'hi', value: 'Hindi' },
      ]);
      await act(async () => {
        fireEvent.press(screen.getByTestId('checkbox-Hindi'));
      });
      // Storage updated with Hindi selection
      expect(mockSetItem).toHaveBeenCalledTimes(2);
      expect(mockSetItem).toHaveBeenCalledWith('lang', 'hindi');
      expect(mockSetItem).toHaveBeenCalledWith('appLanguage', 'hi');
    });
  });

  describe('Close button (outline)', () => {
    it('calls closeModal when the Close button is pressed', () => {
      const closeModal = jest.fn();
      renderComponent(true, [], closeModal);
      fireEvent.press(screen.getByTestId('btn-modal.close'));
      expect(closeModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('Close icon (TouchableOpacity)', () => {
    it('calls closeModal when the X icon is pressed', () => {
      const closeModal = jest.fn();
      renderComponent(true, [], closeModal);
      // The TouchableOpacity wrapping the Image/close icon
      const { TouchableOpacity } = require('react-native');
      const touchables = screen.UNSAFE_getAllByType(TouchableOpacity);
      fireEvent.press(touchables[0]);
      expect(closeModal).toHaveBeenCalled();
    });
  });

  describe('Show Results button', () => {
    it('dispatches getMenus, calls loadLanguage, and calls closeModal', async () => {
      const closeModal = jest.fn();
      renderComponent(true, [], closeModal);
      await act(async () => {
        fireEvent.press(screen.getByTestId('btn-modal.showResults'));
      });
      expect(mockGetMenus).toHaveBeenCalled();
      expect(mockLoadLanguage).toHaveBeenCalledTimes(2); // once on mount, once on press
      expect(closeModal).toHaveBeenCalled();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const store = makeStore(true, [{ key: 'en', value: 'English' }]);
      const component = render(
        <Provider store={store}>
          <HeaderFilters closeModal={jest.fn()} />
        </Provider>,
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
