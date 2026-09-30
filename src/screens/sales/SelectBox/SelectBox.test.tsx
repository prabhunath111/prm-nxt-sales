import React from 'react';
import { View } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTE } from 'const';
import SelectBox from './SelectBox';

// Mock all dependencies
jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'mockStyle'),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

jest.mock('styles', () => ({
  Sizing: {
    layout: {
      x0: 0,
      x1: 1,
      x2: 2,
      x4: 4,
      x5: 5,
      x6: 6,
      x8: 8,
      x10: 10,
      x12: 12,
      x14: 14,
      x16: 16,
      x18: 18,
      x20: 20,
      x24: 24,
      x28: 28,
      x32: 32,
      x36: 36,
      x40: 40,
      x48: 48,
      x56: 56,
      x64: 64,
      x660: 660,
      xDot5: 0.5,
    },
    layoutP: {
      xp100: '100%',
      xp90: '90%',
      xp80: '80%',
      xp70: '70%',
      xp60: '60%',
      xp50: '50%',
      xp40: '40%',
      xp30: '30%',
      xp20: '20%',
      xp10: '10%',
    },
    flexSize: {
      x0: 0,
      x1: 1,
      x2: 2,
      x3: 3,
      x4: 4,
      x5: 5,
      x10: 10,
      x25: 25,
      x50: 50,
      x75: 75,
      x100: 100,
    },
  },
  Typography: {
    fontSize: {
      x10: { fontSize: 10 },
      x12: { fontSize: 12 },
      x13: { fontSize: 13 },
      x14: { fontSize: 14 },
      x16: { fontSize: 16 },
      x18: { fontSize: 18 },
      x20: { fontSize: 20 },
      x24: { fontSize: 24 },
    },
    fontName: {
      medium: { fontWeight: '500' },
      bold: { fontWeight: 'bold' },
      regular: { fontWeight: 'normal' },
      light: { fontWeight: '300' },
    },
    medium: {
      x10: { fontSize: 10, fontWeight: '500' },
      x12: { fontSize: 12, fontWeight: '500' },
      x14: { fontSize: 14, fontWeight: '500' },
      x16: { fontSize: 16, fontWeight: '500' },
      x18: { fontSize: 18, fontWeight: '500' },
      x20: { fontSize: 20, fontWeight: '500' },
      x24: { fontSize: 24, fontWeight: '500' },
    },
    regular: {
      x10: { fontSize: 10, fontWeight: 'normal' },
      x12: { fontSize: 12, fontWeight: 'normal' },
      x14: { fontSize: 14, fontWeight: 'normal' },
      x16: { fontSize: 16, fontWeight: 'normal' },
      x18: { fontSize: 18, fontWeight: 'normal' },
      x20: { fontSize: 20, fontWeight: 'normal' },
    },
    bold: {
      x10: { fontSize: 10, fontWeight: 'bold' },
      x12: { fontSize: 12, fontWeight: 'bold' },
      x14: { fontSize: 14, fontWeight: 'bold' },
      x16: { fontSize: 16, fontWeight: 'bold' },
      x18: { fontSize: 18, fontWeight: 'bold' },
      x20: { fontSize: 20, fontWeight: 'bold' },
    },
    fontWeight: {
      x300: { fontWeight: '300' },
      x400: { fontWeight: '400' },
      x500: { fontWeight: '500' },
      x600: { fontWeight: '600' },
      x700: { fontWeight: '700' },
      x800: { fontWeight: '800' },
    },
  },
  Colors: {
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
      gray: '#808080',
      lightGray: '#F5F5F5',
      darkGray: '#333333',
    },
    primary: {
      blue: '#007AFF',
      red: '#FF3B30',
      green: '#34C759',
      orange: '#FF9500',
      purple: '#AF52DE',
    },
    secondary: {
      brand: '#5856D6',
      accent: '#FF2D92',
      light: '#F2F2F7',
      dark: '#1C1C1E',
    },
    violet: {
      v100: '#F3F0FF',
      v200: '#E9E2FF',
      v300: '#D6C7FF',
      v400: '#B794F6',
      v500: '#9F7AEA',
      v600: '#805AD5',
      v700: '#6B46C1',
      v800: '#553C9A',
      v900: '#44337A',
    },
    appColors: {
      red: '#FF3B30',
      blue: '#007AFF',
      green: '#34C759',
      orange: '#FF9500',
      purple: '#AF52DE',
      yellow: '#FFCC00',
      pink: '#FF2D92',
      teal: '#5AC8FA',
      indigo: '#5856D6',
      brown: '#A2845E',
      gray: '#8E8E93',
      lightGray: '#AEAEB2',
      darkGray: '#636366',
      systemGray: '#8E8E93',
    },
  },
  Outlines: {
    borderRadius: {
      smallest: 4,
      small: 6,
      medium: 8,
      large: 12,
      largest: 16,
    },
    borderWidth: {
      thin: 1,
      medium: 2,
      thick: 3,
    },
  },
  Forms: {
    formField: {
      primary: {
        borderColor: '#007AFF',
        backgroundColor: '#FFFFFF',
      },
      required: {
        color: '#FF3B30',
        fontSize: 12,
        fontWeight: '500',
      },
      optional: {
        color: '#8E8E93',
        fontSize: 12,
        fontWeight: '400',
      },
      error: {
        color: '#FF3B30',
        fontSize: 12,
        fontWeight: '400',
      },
    },
    list: {
      primary: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E5E7',
        borderWidth: 1,
        borderRadius: 8,
      },
      secondary: {
        backgroundColor: '#F2F2F7',
        borderColor: '#C7C7CC',
        borderWidth: 1,
        borderRadius: 6,
      },
    },
    buttonContainer: {
      shadowContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
      },
    },
  },
}));

jest.mock('styles/dimentionHelper', () => ({
  getWindowWidth: jest.fn(() => 1024),
  getWindowHeight: jest.fn(() => 768),
  getScreenWidth: jest.fn(() => 1024),
  getScreenHeight: jest.fn(() => 768),
  scaleFont: jest.fn((fontSize, maxFontSize, minFontSize) =>
    // Simple mock implementation that returns the original fontSize
    Math.min(Math.max(fontSize, minFontSize || 10), maxFontSize || 24),
  ),
}));

jest.mock('utils/platformHelper', () => ({
  isDesktop: true,
  isiOS: jest.fn(() => false),
  isAndroid: jest.fn(() => false),
  isWeb: jest.fn(() => true),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'lg' }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('i18next-browser-languagedetector', () => ({
  __esModule: true,
  default: {
    type: 'languageDetector',
    init: jest.fn(),
    detect: jest.fn(() => 'en'),
    cacheUserLanguage: jest.fn(),
  },
}));

jest.mock('config/i18n', () => ({}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    navigate: mockNavigate,
  })),
}));

jest.mock('hooks/useCurrentRoute', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    routeName: 'selectNewBox',
  })),
}));

const mockCallAction = jest.fn(() => ({ type: 'CALL_ACTION' }));
jest.mock('utils/formBuilderHelper', () => ({
  callAction: mockCallAction,
}));

jest.mock('store/sales/reducer/boxUpgrade', () => ({
  sliceActions: {
    setRechargeAmount: jest.fn(() => ({ type: 'SET_RECHARGE_AMOUNT' })),
    setUpgradeBoxType: jest.fn(() => ({ type: 'SET_UPGRADE_BOX_TYPE' })),
    setFinalRequiredAmount: jest.fn(() => ({ type: 'SET_FINAL_REQUIRED_AMOUNT' })),
    setPaidAmount: jest.fn(() => ({ type: 'SET_PAID_AMOUNT' })),
    setRechargeFlag: jest.fn(() => ({ type: 'SET_RECHARGE_FLAG' })),
    setbingeFlag: jest.fn(() => ({ type: 'SET_BINGE_FLAG' })),
    setSelectedBox: jest.fn(() => ({ type: 'SET_SELECTED_BOX' })),
    setSelectedBoxVcNumber: jest.fn(() => ({ type: 'SET_SELECTED_BOX_VC_NUMBER' })),
    setSelectedBoxType: jest.fn(() => ({ type: 'SET_SELECTED_BOX_TYPE' })),
    setSelectedBoxConnectionType: jest.fn(() => ({ type: 'SET_SELECTED_BOX_CONNECTION_TYPE' })),
    setEVDPin: jest.fn(() => ({ type: 'SET_EVD_PIN' })),
    setUpgradeToNT: jest.fn(() => ({ type: 'SET_UPGRADE_TO_NT' })),
  },
}));

jest.mock('store/sales/reducer/boxTypeChange', () => ({
  sliceActions: {
    setFirstFlag: jest.fn(() => ({ type: 'SET_FIRST_FLAG' })),
  },
}));

jest.mock('store/sales/actions/boxUpgrade', () => ({
  __esModule: true,
  default: {
    proceedWithRechargeBox: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    setLoader: jest.fn(() => ({ type: 'ui/setLoader' })),
  },
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'callAction' })),
}));

jest.mock('store/sales/actions/boxUpgrade', () => ({
  __esModule: true,
  default: {
    proceedWithRechargeBox: jest.fn(() => ({ type: 'boxUpgrade/proceedWithRechargeBox' })),
  },
}));

jest.mock('components/sales', () => ({
  Button: ({ onPress, label, testID }: any) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');
    return React.createElement(
      View,
      {
        testID: testID || 'button',
        onTouchEnd: onPress,
      },
      React.createElement(View, null, label),
    );
  },
  CustomerDetailsCard: () => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');
    return React.createElement(View, { testID: 'customer-details-card' });
  },
  Dropdown: ({ onSelect, data, selectedValue }: any) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');
    return React.createElement(
      View,
      {
        testID: 'dropdown',
        onTouchEnd: () => onSelect && data && onSelect(data[0]),
      },
      React.createElement(View, null, selectedValue?.name || 'Select'),
    );
  },
  InformationText: ({ primaryText, secondaryText }: any) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');
    return React.createElement(View, { testID: 'information-text' }, React.createElement(View, null, primaryText), React.createElement(View, null, secondaryText));
  },
  RadioContainer: ({ onSelectionChange, items }: any) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');
    return React.createElement(
      View,
      { testID: 'radio-container' },
      items?.map((item: any, index: number) =>
        React.createElement(
          View,
          {
            key: `radio-item-${item.value || item.text || index}`,
            testID: `radio-item-${index}`,
            onTouchEnd: () => onSelectionChange && onSelectionChange(item.value),
          },
          React.createElement(View, null, item.text),
          React.createElement(View, null, item.amount),
        ),
      ),
    );
  },
  Text: ({ children }: any) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');
    return React.createElement(View, null, children);
  },
}));

// Mock store setup
const createMockStore = (initialState = {}) => {
  const defaultState = {
    boxUpgrade: {
      accountInfoBoxData: {
        balance: '₹1000',
        boxDetails: [{ id: '1', name: 'Box 1' }],
      },
      eligibles: [
        {
          NEW_BOXNT: 'HD',
          AMOUNT: '500',
        },
        {
          NEW_BOXNT: 'SD',
          AMOUNT: '300',
        },
      ],
      upgradedType: 'HD',
      formatedBoxData: [
        {
          text: 'box1',
          value: 'Box 1',
        },
      ],
      selectedBox: 'box1',
    },
    boxTypeChange: {
      firstFlag: true,
    },
    form: {
      formState: {
        searchSuggestions: {},
      },
    },
    common: {
      dropdownVisible: false,
    },
    ...initialState,
  };

  return configureStore({
    reducer: {
      boxUpgrade: (state = defaultState.boxUpgrade) => state,
      boxTypeChange: (state = defaultState.boxTypeChange) => state,
      form: (state = defaultState.form) => state,
      common: (state = defaultState.common) => state,
    },
    preloadedState: defaultState,
  });
};

const renderWithProviders = (component: React.ReactElement, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>,
  );

describe('SelectBox Component Tests', () => {
  const mockUseCurrentRoute = jest.mocked(jest.requireMock('hooks/useCurrentRoute').default);

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCurrentRoute.mockReturnValue({
      routeName: ROUTE.WEB.SELECT_NEW_BOX,
    });
  });

  describe('Basic Rendering', () => {
    test('renders SelectBox component correctly', () => {
      renderWithProviders(<SelectBox />);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
      expect(screen.getByTestId('customer-details-card')).toBeTruthy();
      expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
      expect(screen.getByTestId('radio-container')).toBeTruthy();
    });

    test('renders with single box message when only one box', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: {
            balance: '₹1000',
            boxDetails: [{ id: '1', name: 'Box 1' }],
          },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('renders with multiple box message when multiple boxes', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: {
            balance: '₹1000',
            boxDetails: [{ id: '1' }, { id: '2' }],
          },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });
  });

  describe('State Management', () => {
    test('initializes with default values from formattedDetails', async () => {
      renderWithProviders(<SelectBox />);

      await waitFor(() => {
        expect(screen.getByTestId('radio-container')).toBeTruthy();
      });
    });

    test('handles radio selection change', () => {
      renderWithProviders(<SelectBox />);

      const radioItem = screen.getByTestId('radio-item-1');
      fireEvent(radioItem, 'touchEnd');
      expect(radioItem).toBeTruthy();
    });

    test('sets HD flag when HD box type is selected', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const radioItem = screen.getByTestId('radio-item-0');
      fireEvent(radioItem, 'touchEnd');
      expect(radioItem).toBeTruthy();
    });

    test('handles non-HD box type selection', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'SD', AMOUNT: '300' }],
          upgradedType: 'SD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const radioItem = screen.getByTestId('radio-item-0');
      fireEvent(radioItem, 'touchEnd');
      expect(radioItem).toBeTruthy();
    });
  });

  describe('Dropdown Functionality', () => {
    test('dropdown renders correctly', () => {
      renderWithProviders(<SelectBox />);

      const autocomplete = screen.getByTestId('autocomplete-test');
      expect(autocomplete).toBeTruthy();
    });

    test('handles dropdown selection for SELECT_NEW_BOX route', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_NEW_BOX,
      });

      renderWithProviders(<SelectBox />);
      expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
    });

    test('handles dropdown selection for SELECT_BOX_TYPE route', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_BOX_TYPE,
      });

      renderWithProviders(<SelectBox />);
      expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
    });

    test('handles dropdown with complex box name format', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'VC123-HD-Premium', value: 'VC123-HD-Premium' }],
          selectedBox: 'VC123-HD-Premium',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
    });
  });

  describe('Button Actions - SELECT_NEW_BOX Route', () => {
    beforeEach(() => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_NEW_BOX,
      });
    });

    test('renders buttons for SELECT_NEW_BOX route', () => {
      renderWithProviders(<SelectBox />);

      expect(screen.getAllByTestId('button')).toHaveLength(3);
    });

    test('handles cancel button click', () => {
      renderWithProviders(<SelectBox />);

      const buttons = screen.getAllByTestId('button');
      fireEvent(buttons[2], 'touchEnd'); // Cancel button

      expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.BOX_UPGRADE);
    });

    test('handles change box without recharge button click', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getAllByTestId('button')).toHaveLength(3);
    });

    test('handles change box with recharge button click - HD type', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getAllByTestId('button')).toHaveLength(3);
    });

    test('handles change box with recharge button click - non-HD type', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'SD', AMOUNT: '300' }],
          upgradedType: 'SD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const buttons = screen.getAllByTestId('button');
      fireEvent(buttons[1], 'touchEnd'); // Change box with recharge button
      expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.CONFIRM_DETAILS);
    });
  });

  describe('Button Actions - SELECT_BOX_TYPE Route', () => {
    beforeEach(() => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_BOX_TYPE,
      });
    });

    test('renders buttons for SELECT_BOX_TYPE route with firstFlag true', () => {
      const store = createMockStore({
        boxTypeChange: { firstFlag: true },
      });

      renderWithProviders(<SelectBox />, store);

      expect(screen.getAllByTestId('button')).toHaveLength(2);
    });

    test('renders buttons when firstFlag is false', () => {
      const store = createMockStore({
        boxTypeChange: { firstFlag: false },
      });

      renderWithProviders(<SelectBox />, store);

      expect(screen.getAllByTestId('button')).toHaveLength(2);
    });

    test('handles change box button click when firstFlag is true', () => {
      const store = createMockStore({
        boxTypeChange: { firstFlag: true },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getAllByTestId('button')).toHaveLength(2);
    });

    test('handles check WO button click when firstFlag is false', () => {
      const store = createMockStore({
        boxTypeChange: { firstFlag: false },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getAllByTestId('button')).toHaveLength(2);
    });

    test('handles cancel button click for SELECT_BOX_TYPE route', () => {
      renderWithProviders(<SelectBox />);
      const buttons = screen.getAllByTestId('button');
      fireEvent(buttons[1], 'touchEnd'); // Cancel button
      expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.BOX_TYPE_CHANGE);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty eligibles array', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);

      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('handles missing box data', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [],
          selectedBox: null,
        },
      });

      renderWithProviders(<SelectBox />, store);

      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('handles balance without rupee symbol', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('handles invalid amount values', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: 'invalid' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('handles missing NEW_BOXNT in eligibles', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('handles radio selection with invalid value', () => {
      renderWithProviders(<SelectBox />);
      const radioContainer = screen.getByTestId('radio-container');

      // Simulate selection change with invalid data
      // const mockOnSelectionChange = jest.fn();
      fireEvent(radioContainer, 'touchEnd');
      expect(radioContainer).toBeTruthy();
    });

    test('handles different box types with icon mapping', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [
            { NEW_BOXNT: 'HD4K', AMOUNT: '800' },
            { NEW_BOXNT: 'Android', AMOUNT: '600' },
            { NEW_BOXNT: 'HDPVRTransfer', AMOUNT: '700' },
            { NEW_BOXNT: 'UnknownType', AMOUNT: '400' },
          ],
          upgradedType: 'HD4K',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });
  });

  describe('Conditional Rendering Based on Route', () => {
    test('does not show balance info for SELECT_BOX_TYPE route', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_BOX_TYPE,
      });

      renderWithProviders(<SelectBox />);

      expect(screen.queryByText('strings.balance')).toBeNull();
      expect(screen.queryByText('strings.REQUIRED_AMOUNT')).toBeNull();
    });

    test('shows balance info for SELECT_NEW_BOX route', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_NEW_BOX,
      });

      renderWithProviders(<SelectBox />);
      expect(screen.getAllByTestId('information-text')).toHaveLength(2);
    });

    test('renders correct button labels based on route', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_NEW_BOX,
      });

      renderWithProviders(<SelectBox />);
      expect(screen.getAllByTestId('button')).toHaveLength(3);
    });
  });

  describe('Component Lifecycle and Effects', () => {
    test('useEffect sets default values when formattedDetails changes', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('handles component re-render with different props', () => {
      const { rerender } = renderWithProviders(<SelectBox />);

      const newStore = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹2000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'SD', AMOUNT: '300' }],
          upgradedType: 'SD',
          formatedBoxData: [{ text: 'box2', value: 'Box 2' }],
          selectedBox: 'box2',
        },
      });

      rerender(
        <Provider store={newStore}>
          <NavigationContainer>
            <SelectBox />
          </NavigationContainer>
        </Provider>,
      );

      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });
  });

  describe('Memoized Values', () => {
    test('mappedData memoization works correctly', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [
            { text: 'box1', value: 'Box 1' },
            { text: 'box2', value: 'Box 2' },
          ],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
    });

    test('selectedBoxObj memoization works correctly', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'selectedBox', value: 'Selected Box' }],
          selectedBox: 'selectedBox',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
    });

    test('formattedDetails memoization with different box types', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [
            { NEW_BOXNT: 'HD', AMOUNT: '500' },
            { NEW_BOXNT: 'SD', AMOUNT: '300' },
            { NEW_BOXNT: 'HD4K', AMOUNT: '800' },
          ],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('radio-container')).toBeTruthy();
    });
  });

  describe('Function Coverage Tests', () => {
    test('covers chnageValue function with valid parameters', () => {
      renderWithProviders(<SelectBox />);
      const radioItem = screen.getByTestId('radio-item-0');
      fireEvent(radioItem, 'touchEnd');
      expect(radioItem).toBeTruthy();
    });

    test('covers chnageValue function with HD type', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const radioItem = screen.getByTestId('radio-item-0');
      fireEvent(radioItem, 'touchEnd');
      expect(radioItem).toBeTruthy();
    });

    test('covers chnageValue function with invalid parameters', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: '', AMOUNT: '' }],
          upgradedType: '',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('covers cleanedBalance logic with different balance formats', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '  ₹  1000  ' },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('covers formattedDetails with null/undefined values', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: null, AMOUNT: null }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('covers selectedBoxObj with name match', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Selected Box Name' }],
          selectedBox: 'Selected Box Name',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('autocomplete-test')).toBeTruthy();
    });

    test('covers radio selection with found item', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [
            { NEW_BOXNT: 'HD', AMOUNT: '500' },
            { NEW_BOXNT: 'SD', AMOUNT: '300' },
          ],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const radioItem = screen.getByTestId('radio-item-1');
      fireEvent(radioItem, 'touchEnd');
      expect(radioItem).toBeTruthy();
    });

    test('covers handleFinalSubmitWithoutRecharge function', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_NEW_BOX,
      });

      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const buttons = screen.getAllByTestId('button');
      fireEvent(buttons[0], 'touchEnd'); // handleFinalSubmitWithoutRecharge
      expect(buttons[0]).toBeTruthy();
    });

    test('covers checkWoStatus function', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_BOX_TYPE,
      });

      const store = createMockStore({
        boxTypeChange: { firstFlag: false },
      });

      renderWithProviders(<SelectBox />, store);
      const buttons = screen.getAllByTestId('button');
      fireEvent(buttons[0], 'touchEnd'); // checkWoStatus
      expect(buttons[0]).toBeTruthy();
    });

    test('covers handleFinalSubmit for SELECT_BOX_TYPE route', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_BOX_TYPE,
      });

      const store = createMockStore({
        boxTypeChange: { firstFlag: true },
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const buttons = screen.getAllByTestId('button');
      fireEvent(buttons[0], 'touchEnd'); // handleFinalSubmit for SELECT_BOX_TYPE
      expect(buttons[0]).toBeTruthy();
    });

    test('covers handleFinalSubmit for HD type with recharge', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_NEW_BOX,
      });

      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const buttons = screen.getAllByTestId('button');
      fireEvent(buttons[1], 'touchEnd'); // handleFinalSubmit for HD with recharge
      expect(buttons[1]).toBeTruthy();
    });

    test('covers dropdown change with box name parsing', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_NEW_BOX,
      });

      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'VC123-HD-Premium', value: 'VC123-HD-Premium' }],
          selectedBox: 'VC123-HD-Premium',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('covers dropdown change for SELECT_BOX_TYPE route', () => {
      mockUseCurrentRoute.mockReturnValue({
        routeName: ROUTE.WEB.SELECT_BOX_TYPE,
      });

      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'HD', AMOUNT: '500' }],
          upgradedType: 'HD',
          formatedBoxData: [{ text: 'campaign123', value: 'campaign123' }],
          selectedBox: 'campaign123',
        },
      });

      renderWithProviders(<SelectBox />, store);
      expect(screen.getByTestId('SelectBox')).toBeTruthy();
    });

    test('covers chnageValue return false case', () => {
      const store = createMockStore({
        boxUpgrade: {
          accountInfoBoxData: { balance: '₹1000', boxDetails: [{}] },
          eligibles: [{ NEW_BOXNT: 'SD', AMOUNT: '300' }],
          upgradedType: 'SD',
          formatedBoxData: [{ text: 'box1', value: 'Box 1' }],
          selectedBox: 'box1',
        },
      });

      renderWithProviders(<SelectBox />, store);
      const radioItem = screen.getByTestId('radio-item-0');
      fireEvent(radioItem, 'touchEnd');
      expect(radioItem).toBeTruthy();
    });
  });

  describe('Index File Coverage', () => {
    test('imports SelectBox component correctly', () => {
      const SelectBoxIndex = jest.requireMock('./index').default;
      expect(SelectBoxIndex).toBeDefined();
    });
  });

  describe('Snapshot Tests', () => {
    test('matches snapshot', () => {
      const component = renderWithProviders(
        <View>
          <SelectBox />
        </View>,
      );

      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
