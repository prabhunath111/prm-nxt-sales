/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { QUERY, ROUTE } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import QuotationPrimaryOffer from './QuotationPrimaryOffer';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

// Mock Actions
jest.mock('store/sales/reducer/quotation', () => ({
  sliceActions: {
    quotationEtskSetTownLocality: jest.fn((v) => ({ type: 'SET_TOWN', payload: v })),
    quotationPrimarySetNumberOfConnections: jest.fn((v) => ({ type: 'SET_CONN', payload: v })),
    quotationPrimarySetTskTypeObject: jest.fn((v) => ({ type: 'SET_TSK', payload: v })),
    quotationEtskSetPrimaryBoxSelected: jest.fn((v) => ({ type: 'SET_BOX', payload: v })),
    quotSetTSKtype1SelectedObject: jest.fn((v) => ({ type: 'SET_TSK1', payload: v })),
    etskSetBoxType1Selected: jest.fn((v) => ({ type: 'SET_BOX1', payload: v })),
    quotSetTSKtype2SelectedObject: jest.fn((v) => ({ type: 'SET_TSK2', payload: v })),
    etskSetBoxType2Selected: jest.fn((v) => ({ type: 'SET_BOX2', payload: v })),
    quotSetTSKtype3SelectedObject: jest.fn((v) => ({ type: 'SET_TSK3', payload: v })),
    etskSetBoxType3Selected: jest.fn((v) => ({ type: 'SET_BOX3', payload: v })),
  },
}));

// Mock Hooks
const mockNavigate = jest.fn();
const mockGoHome = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goHome: mockGoHome,
}));

// Mock Inflection
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'md' }),
}));

// Mock Translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Styles and Breakpoints
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
      x9: 9,
      x10: 10,
      x12: 12,
      x14: 14,
      x16: 16,
      x20: 20,
      x24: 24,
      x30: 30,
      x200: 200,
      x250: 250,
      x660: 660,
      x1024: 1024,
      xDot5: 0.5,
    },
    layoutP: {
      xp100: '100%',
      xp80: '80%',
      xp50: '50%',
      xp40: '40%',
      xp30: '30%',
      xp20: '20%',
      xp8: '8%',
    },
    flexSize: {
      x100: 1,
    },
    shadowOpacity: {
      x12: 0.12,
    },
  },
  Colors: {
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
      g150: '#E6E6E6',
      g300: '#B3B3B3',
    },
    violet: {
      v400: '#7F00FF',
    },
    appColors: {
      lightRed: '#FFCCCB',
    },
  },
  Typography: {
    fontName: {
      medium: { fontSize: 16 },
    },
    medium: {
      x14: { fontSize: 14 },
    },
    fontWeight: {
      x500: '500',
    },
  },
  Outlines: {
    borderRadius: {
      small: 4,
    },
    borderWidth: {
      base: 1,
    },
  },
  Forms: {
    buttonContainer: {
      shadowContainer: {},
    },
  },
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((base) => base),
}));

// Mock Utils
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => Promise.resolve({ success: true })),
}));

// Mock UI Components
jest.mock('components/sales/Autocomplete', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return ({ selectedValue, onSelect, placeholder, testID }: any) => (
    <View testID={testID || `autocomplete-${placeholder}`}>
      <Pressable onPress={() => onSelect({ salesSegmentNT: 'DAS', salesSegment: 'DAS Segment' })} testID={`select-option-${placeholder}`}>
        <Text>{selectedValue?.label || placeholder}</Text>
      </Pressable>
      <Pressable onPress={() => onSelect(null)} testID={`clear-option-${placeholder}`}>
        <Text>Clear</Text>
      </Pressable>
    </View>
  );
});

jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <Pressable onPress={onPress} testID={`button-${label}`}>
        <Text>{label}</Text>
      </Pressable>
    ),
    Dropdown: ({ selectedValue, onSelect, placeholder, testID }: any) => (
      <View testID={testID || `dropdown-${placeholder}`}>
        <Pressable onPress={() => onSelect({ nameNT: 2, label: 'Option 2' })} testID={`select-option-${placeholder}`}>
          <Text>{selectedValue?.label || placeholder}</Text>
        </Pressable>
        <Pressable onPress={() => onSelect(null)} testID={`clear-option-${placeholder}`}>
          <Text>Clear</Text>
        </Pressable>
      </View>
    ),
    Autocomplete: require('components/sales/Autocomplete'),
    PincodeDetailsCard: () => <View testID="pincode-card" />,
    Text: ({ children, label, style }: any) => <Text style={style}>{children || label}</Text>,
  };
});

describe('QuotationPrimaryOffer Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockImplementation((action: any) => action);
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: false },
        quotation: {
          etskLocationData: [],
          tskTypesData: { tskType: [] },
          numberOfConnectionsData: [],
          boxTypeData: [],
          etskTownLocality: {},
          numberOfConnections: {},
          primaryTskTypeObject: {},
          etskboxType: {},
        },
      }),
    );
  });

  const renderComponent = () => render(<QuotationPrimaryOffer />);

  test('should handle town selection and clear errors', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: false },
        quotation: {
          etskTownLocality: { salesSegmentNT: 'DAS', salesSegment: 'DAS Segment' }, // Pre-set for coverage
        },
      }),
    );
    renderComponent();
    const townAutocomplete = screen.getByTestId('autocomplete-strings.selectTownCode');

    // Select
    fireEvent.press(within(townAutocomplete).getByTestId('select-option-strings.selectTownCode'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TOWN', payload: expect.any(Object) });
    expect(screen.getByText('strings.DAS_SEGMENT DAS Segment')).toBeTruthy();

    // Clear
    fireEvent.press(within(townAutocomplete).getByTestId('clear-option-strings.selectTownCode'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TOWN', payload: {} });
  });

  test('should handle connections selection', () => {
    renderComponent();
    const connDropdown = screen.getByTestId('dropdown-strings.numberOfConnections');

    // Select
    fireEvent.press(within(connDropdown).getByTestId('select-option-strings.numberOfConnections'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_CONN', payload: expect.any(Object) });

    // Clear
    fireEvent.press(within(connDropdown).getByTestId('clear-option-strings.numberOfConnections'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_CONN', payload: {} });
  });

  test('should validate form and show mistakes', () => {
    renderComponent();
    fireEvent.press(screen.getByTestId('button-strings.proceed'));

    expect(screen.getByText('errors.selectTownLocality')).toBeTruthy();
    expect(screen.getByText('strings.selectNumberOfConnections')).toBeTruthy();
    expect(screen.getByText('errors.selectTSKType')).toBeTruthy();
    expect(screen.getByText('strings.PLEASE_SELECT_BOX_TYPE')).toBeTruthy();
  });

  test('should handle successful submission for secondary connections', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: true }, // Coverage for redirection
        quotation: {
          etskTownLocality: { id: 1 },
          numberOfConnections: { nameNT: 4 },
          primaryTskTypeObject: { id: 1 },
          etskboxType: { id: 1 },
          tSKtype1SelectedObject: { id: 2 },
          boxType1: { id: 2 },
          tSKtype2SelectedObject: { id: 3 },
          boxType2: { id: 3 },
          tSKtype3SelectedObject: { id: 4 },
          boxType3: { id: 4 },
        },
      }),
    );

    renderComponent();

    await act(async () => {
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });

    expect(callAction).toHaveBeenCalledWith(expect.any(Object), QUERY.GetAllCategoryPacks);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.QUOTATION_PRIMARY_CHANNELS);

    // Cancel in Redirection
    fireEvent.press(screen.getByTestId('button-strings.cancel'));
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });

  test('should show validation errors for secondary boxes when connections > 1', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: false },
        quotation: {
          etskTownLocality: { id: 1 },
          numberOfConnections: { nameNT: 4 },
          primaryTskTypeObject: { id: 1 },
          etskboxType: { id: 1 },
        },
      }),
    );

    renderComponent();
    fireEvent.press(screen.getByTestId('button-strings.proceed'));

    expect(screen.getAllByText('errors.selectTSKType').length).toBe(3);
    expect(screen.getAllByText('strings.PLEASE_SELECT_BOX_TYPE').length).toBe(3);
  });

  test('should handle all primary and secondary box selections with duplicate testIDs', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: false },
        quotation: {
          numberOfConnections: { nameNT: 4 },
          tskTypesData: { tskType: [] },
          boxTypeData: [{ id: 1, label: 'Box' }],
        },
      }),
    );

    renderComponent();

    // Select Primary TSK
    const allTskAutocompletes = screen.getAllByTestId('autocomplete-strings.selectTskType');
    fireEvent.press(within(allTskAutocompletes[0]).getByTestId('select-option-strings.selectTskType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TSK', payload: expect.any(Object) });

    // Select Primary Box
    const allBoxDropdowns = screen.getAllByTestId('dropdown-strings.quottaionSelectBoxType');
    fireEvent.press(within(allBoxDropdowns[0]).getByTestId('select-option-strings.quottaionSelectBoxType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_BOX', payload: expect.any(Object) });

    // Secondary 1
    fireEvent.press(within(allTskAutocompletes[1]).getByTestId('select-option-strings.selectTskType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TSK1', payload: expect.any(Object) });
    fireEvent.press(within(allBoxDropdowns[1]).getByTestId('select-option-strings.quottaionSelectBoxType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_BOX1', payload: expect.any(Object) });

    // Secondary 2
    fireEvent.press(within(allTskAutocompletes[2]).getByTestId('select-option-strings.selectTskType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TSK2', payload: expect.any(Object) });
    fireEvent.press(within(allBoxDropdowns[2]).getByTestId('select-option-strings.quottaionSelectBoxType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_BOX2', payload: expect.any(Object) });

    // Secondary 3
    fireEvent.press(within(allTskAutocompletes[3]).getByTestId('select-option-strings.selectTskType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TSK3', payload: expect.any(Object) });
    fireEvent.press(within(allBoxDropdowns[3]).getByTestId('select-option-strings.quottaionSelectBoxType'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_BOX3', payload: expect.any(Object) });
  });

  test('should handle no sales segment available', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: false },
        quotation: {
          etskTownLocality: { id: 1 }, // No salesSegmentNT
        },
      }),
    );
    renderComponent();

    // Trigger town selection to set showDas to true
    const townAutocomplete = screen.getByTestId('autocomplete-strings.selectTownCode');
    fireEvent.press(within(townAutocomplete).getByTestId('select-option-strings.selectTownCode'));

    expect(screen.getByText('strings.NO_DAS_AVAILABLE')).toBeTruthy();
  });

  test('should handle all primary and secondary box clear selections', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: false },
        quotation: {
          numberOfConnections: { nameNT: 4 },
        },
      }),
    );
    renderComponent();

    const allTskAutocompletes = screen.getAllByTestId('autocomplete-strings.selectTskType');
    const allBoxDropdowns = screen.getAllByTestId('dropdown-strings.quottaionSelectBoxType');

    // Clear all
    fireEvent.press(within(allTskAutocompletes[0]).getByTestId('clear-option-strings.selectTskType'));
    fireEvent.press(within(allBoxDropdowns[0]).getByTestId('clear-option-strings.quottaionSelectBoxType'));
    fireEvent.press(within(allTskAutocompletes[1]).getByTestId('clear-option-strings.selectTskType'));
    fireEvent.press(within(allBoxDropdowns[1]).getByTestId('clear-option-strings.quottaionSelectBoxType'));
    fireEvent.press(within(allTskAutocompletes[2]).getByTestId('clear-option-strings.selectTskType'));
    fireEvent.press(within(allBoxDropdowns[2]).getByTestId('clear-option-strings.quottaionSelectBoxType'));
    fireEvent.press(within(allTskAutocompletes[3]).getByTestId('clear-option-strings.selectTskType'));
    fireEvent.press(within(allBoxDropdowns[3]).getByTestId('clear-option-strings.quottaionSelectBoxType'));

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TSK', payload: {} });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_BOX', payload: {} });
  });

  test('should handle falsy response from GetAllCategoryPacks', async () => {
    (callAction as jest.Mock).mockReturnValueOnce(Promise.resolve(null));
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { isRedirection: false },
        quotation: {
          etskTownLocality: { id: 1 },
          numberOfConnections: { nameNT: 1 },
          primaryTskTypeObject: { id: 1 },
          etskboxType: { id: 1 },
        },
      }),
    );

    renderComponent();
    await act(async () => {
      fireEvent.press(screen.getByTestId('button-strings.proceed'));
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
