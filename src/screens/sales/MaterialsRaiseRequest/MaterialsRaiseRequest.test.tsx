/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTE, QUERY, ALERT, MODAL } from 'const';
import uiActions from 'store/sales/actions/ui';
import { sliceActions } from 'store/sales/reducer/purchaseOrder';
import { callAction } from 'utils/formBuilderHelper';
import MaterialsRaiseRequest from './MaterialsRaiseRequest';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

// Mock Styles and Breakpoints
jest.mock('styles', () => ({
  Sizing: {
    layout: {
      x0: 0,
      x1: 1,
      x2: 2,
      x5: 5,
      x8: 8,
      x12: 12,
      x16: 16,
      x18: 18,
      x32: 32,
      x35: 35,
      x40: 40,
      x90: 90,
      x100: 100,
      x120: 120,
    },
    flexSize: {
      x100: 1,
    },
    layoutP: {
      xp100: '100%',
      xp80: '80%',
    },
  },
  Colors: {
    neutral: {
      white: '#FFFFFF',
      g150: '#E0E0E0',
      g70: '#F5F5F5',
    },
    violet: {
      v50: '#F3E5F5',
      v200: '#7B1FA2',
    },
    primary: {
      brand: '#6200EE',
    },
    appColors: {
      lightPurple: '#BB86FC',
    },
  },
  Typography: {
    fontName: {
      medium: 'MediumFont',
      regular: 'RegularFont',
      semibold: 'SemiboldFont',
    },
    semibold: {
      x14: { fontSize: 14, fontWeight: '600' },
    },
    medium: {
      x16: { fontSize: 16, fontWeight: '500' },
    },
    fontSize: {
      x12: { fontSize: 12 },
      x24: { fontSize: 24 },
    },
    fontWeight: {
      x600: { fontWeight: '600' },
      x300: { fontWeight: '300' },
    },
  },
  Forms: {
    buttonContainer: {
      shadowContainer: {},
    },
  },
  Outlines: {
    borderRadius: {
      smallMedium: 8,
    },
  },
  Buttons: {},
  Global: {},
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((base) => base),
  BreakPoints: { XL: 1200, LG: 992, MD: 768, SM: 576 },
}));

// Mock Hooks
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
}));

const mockSliceActions = sliceActions as any;

// Mock Inflection
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: {} }),
}));

// Mock Translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'strings.POS') return 'POS';
      if (key === 'strings.TSK&RCV') return 'TSK&RCV';
      if (key === 'strings.TSK') return 'TSK';
      if (key === 'strings.RCV') return 'RCV';
      if (key === 'strings.All') return 'All';
      if (key === 'errors.minAmount') return `Min: ${options?.min}`;
      if (key === 'errors.maxAmount') return `Max: ${options?.max}`;
      return key;
    },
  }),
}));

// Mock Utils
jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => ({ type: 'CALL_ACTION' })),
}));

// Mock UI Components to verify props
jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable, TextInput } = require('react-native');
  return {
    Button: ({ onPress, label, disabled }: any) => (
      <Pressable onPress={onPress} disabled={disabled} testID={`button-${label}`}>
        <Text>{label}</Text>
      </Pressable>
    ),
    Image: () => <View testID="mock-image" />,
    List: ({ data, renderItem, testID }: any) => (
      <View testID={testID || 'mock-list'}>
        {data.map((item: any, index: number) => (
          <View key={index} testID={`list-item-${item.productCode || index}`}>
            {renderItem({ item })}
          </View>
        ))}
      </View>
    ),
    PillsGroup: ({ itemsArr, onPillPress }: any) => (
      <View testID="mock-pills-group">
        {itemsArr.map((item: string) => (
          <Pressable key={item} onPress={() => onPillPress(item)} testID={`pill-${item}`}>
            <Text>{item}</Text>
          </Pressable>
        ))}
      </View>
    ),
    Search: ({ onChange, value }: any) => <TextInput testID="mock-search" value={value} onChangeText={onChange} />,
    Text: ({ children, label, style, testID }: any) => (
      <Text style={style} testID={testID}>
        {children || label}
      </Text>
    ),
  };
});

// Mock Actions
jest.mock('store/sales/actions/ui', () => ({
  showAlert: jest.fn(() => ({ type: 'SHOW_ALERT' })),
}));

describe('MaterialsRaiseRequest Tests', () => {
  const mockDispatch = jest.fn();
  const mockPosmProductsArray = [
    { productCode: 'P1', productName: 'POS Product', materialType: 'POS', productFriendlyName: 'Friendly POS', productFriendlyNameNT: 'Friendly POS' },
    { productCode: 'P2', productName: 'TSK Product', materialType: 'TSK', productNameNT: 'TSK NT' },
    { productCode: 'P3', productName: 'RCV Product', materialType: 'RCV', productCodeNT: 'P3-NT' },
    { productCode: 'P4', productName: 'Other Product', materialType: 'OTHER', materialTypeNT: 'OTHER-NT' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
  });

  const renderComponent = () => render(<MaterialsRaiseRequest />);

  test('should fetch initial data on mount', () => {
    renderComponent();
    expect(callAction).toHaveBeenCalledWith({}, QUERY.GetPOSMData);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CALL_ACTION' });
  });

  test('should filter data based on selected pill (POS)', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [],
          selectedMaterialPill: 'POS',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    expect(screen.getByText('POS Product')).toBeTruthy();
    expect(screen.queryByText('TSK Product')).toBeNull();
  });

  test('should filter data based on selected pill (TSK&RCV)', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [],
          selectedMaterialPill: 'TSK&RCV',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    expect(screen.getByText('TSK Product')).toBeTruthy();
    expect(screen.getByText('RCV Product')).toBeTruthy();
    expect(screen.queryByText('POS Product')).toBeNull();
  });

  test('should filter data based on search query', () => {
    renderComponent();
    const searchInput = screen.getByTestId('mock-search');
    fireEvent.changeText(searchInput, 'Friendly POS');
    expect(screen.getByText('POS Product')).toBeTruthy();
    expect(screen.queryByText('TSK Product')).toBeNull();

    fireEvent.changeText(searchInput, 'TSK NT');
    expect(screen.getByText('TSK Product')).toBeTruthy();

    fireEvent.changeText(searchInput, 'P3-NT');
    expect(screen.getByText('RCV Product')).toBeTruthy();

    fireEvent.changeText(searchInput, 'OTHER-NT');
    expect(screen.getByText('Other Product')).toBeTruthy();
  });

  test('should add material to selection', () => {
    renderComponent();
    const listItemP1 = screen.getByTestId('list-item-P1');
    const addBtn = within(listItemP1).getByText('+ strings.add');
    fireEvent.press(addBtn);
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSliceActions.setSelectedMaterial([
        {
          productCode: 'P1',
          productName: 'POS Product',
          productFriendlyName: 'Friendly POS',
          materialType: 'POS',
          totalCount: 1,
        },
      ]),
    );
  });

  test('should increment totalCount if material already exists', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [{ productCode: 'P1', totalCount: 1 }],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    const listItemP1 = screen.getByTestId('list-item-P1');
    const plusBtn = within(listItemP1).getByText('+');
    fireEvent.press(plusBtn);
    expect(mockDispatch).toHaveBeenCalledWith(mockSliceActions.setSelectedMaterial([{ productCode: 'P1', totalCount: 2 }]));
  });

  test('should filter data based on custom selected pill', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [],
          selectedMaterialPill: 'OTHER',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    expect(screen.getByText('Other Product')).toBeTruthy();
    expect(screen.queryByText('POS Product')).toBeNull();
  });

  test('should decrement totalCount if material already exists', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [{ productCode: 'P1', totalCount: 2 }],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    const listItemP1 = screen.getByTestId('list-item-P1');
    const minusBtn = within(listItemP1).getByText('-');
    fireEvent.press(minusBtn);
    expect(mockDispatch).toHaveBeenCalledWith(mockSliceActions.setSelectedMaterial([{ productCode: 'P1', totalCount: 1 }]));
  });

  test('should remove material if count reaches 0', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [{ productCode: 'P1', totalCount: 1 }],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    const listItemP1 = screen.getByTestId('list-item-P1');
    const minusBtn = within(listItemP1).getByText('-');
    fireEvent.press(minusBtn);
    expect(mockDispatch).toHaveBeenCalledWith(mockSliceActions.setSelectedMaterial([]));
  });

  test('should show alert when changing category with items in cart', () => {
    renderComponent();
    const pill = screen.getByTestId('pill-POS');
    fireEvent.press(pill);
    expect(uiActions.showAlert).toHaveBeenCalledWith(
      'errors.TSKPOSnotAllowed',
      ALERT.CONFIRM,
      expect.objectContaining({
        primaryText: MODAL.PROCEED,
        isSecondaryRequire: true,
        secondaryText: MODAL.CANCEL,
      }),
      {},
    );

    // Test onProceed callback
    const showAlertArgs = (uiActions.showAlert as jest.Mock).mock.calls[0];
    const { onProceed } = showAlertArgs[2];
    onProceed();
    expect(mockDispatch).toHaveBeenCalledWith(mockSliceActions.setSelectedMaterial([]));
    expect(mockDispatch).toHaveBeenCalledWith(mockSliceActions.setSelectedMaterialPill('POS'));
  });

  test('should navigate to summary on proceed', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [{ productCode: 'P1', totalCount: 5 }],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    const proceedBtn = screen.getByTestId('button-strings.proceed');
    fireEvent.press(proceedBtn);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.MATERIALS_SUMMARY, {
      selectedMaterial: [{ productCode: 'P1', totalCount: 5 }],
    });
  });

  test('should go back on cancel', () => {
    renderComponent();
    const cancelBtn = screen.getByTestId('button-strings.cancel');
    fireEvent.press(cancelBtn);
    expect(mockGoBack).toHaveBeenCalledWith(false);
  });

  test('should show cart badge with multiple items', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [
            { productCode: 'P1', totalCount: 2 },
            { productCode: 'P2', totalCount: 1 },
          ],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    // Two '2's: badge and P1 count
    const badgeElements = screen.getAllByText('2');
    expect(badgeElements.length).toBeGreaterThan(1);
    expect(screen.getByText('strings.itemsAdded')).toBeTruthy();
  });

  test('should show singular "itemAdded" for one item', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: { posmProductsArray: mockPosmProductsArray },
          selectedMaterial: [{ productCode: 'P1', totalCount: 2 }],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    expect(screen.getByText('1')).toBeTruthy(); // selectedMaterial.length is 1
    expect(screen.getByText('strings.itemAdded')).toBeTruthy();
  });

  test('should handle missing materialDetailsData', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        purchaseOrder: {
          materialDetailsData: null,
          selectedMaterial: [],
          selectedMaterialPill: 'All',
        },
        user: { isRedirection: false },
      }),
    );
    renderComponent();
    expect(screen.getByTestId('tsraSubscriberListTest')).toBeTruthy();
  });
});
