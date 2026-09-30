/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ALERT, PROPERTIES, QUERY, ROUTE } from 'const';
import uiActions from 'store/sales/actions/ui';
import { callAction } from 'utils/formBuilderHelper';
import RegisterNewPaymentId from './RegisterNewPaymentId';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  memo: (c: any) => c,
}));

// Mock Actions
jest.mock('store/sales/actions/ui', () => ({
  showAlert: jest.fn((msg) => ({ type: 'SHOW_ALERT', msg })),
}));

// Mock Hooks
const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
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

// Mock i18next
jest.mock('i18next', () => ({
  t: (key: string) => key,
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
      x15: 15,
      x16: 16,
      x20: 20,
      x24: 24,
      x30: 30,
      x50: 50,
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
  callAction: jest.fn((data) => ({ type: 'CALL_ACTION', data })),
}));

// Mock UI Components
jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text, Pressable, TextInput } = require('react-native');
  return {
    Button: ({ onPress, label }: any) => (
      <Pressable onPress={onPress} testID={`button-${label}`}>
        <Text>{label}</Text>
      </Pressable>
    ),
    Dropdown: ({ data, onSelect, placeholder, selectedValue }: any) => (
      <View testID={`dropdown-${placeholder}`}>
        <Pressable onPress={() => onSelect(data?.[0] || { nameNT: 'BANK', label: 'Bank' })} testID={`select-option-${placeholder}`}>
          <Text>{selectedValue?.nameNT || placeholder}</Text>
        </Pressable>
      </View>
    ),
    Checkbox: ({ onValueChange, label }: any) => (
      <Pressable onPress={() => onValueChange(true)} testID="checkbox">
        <Text>{label}</Text>
      </Pressable>
    ),
    IconTextInput: ({ value, onInputChange, maxLength }: any) => <TextInput value={value} onChangeText={onInputChange} maxLength={maxLength} testID="icon-text-input" />,
    Text: ({ children, label, style }: any) => <Text style={style}>{children || label}</Text>,
  };
});
// Mock Const
jest.mock('const', () => {
  const original = jest.requireActual('const');
  return {
    ...original,
    PROPERTIES: {
      ...original.PROPERTIES,
      PURCHASE_ORDER: {
        ...original.PROPERTIES.PURCHASE_ORDER,
        VALIDATIONS_PO: {
          acNumber: jest.fn(() => true),
          bankName: jest.fn(() => true),
          ifscCode: jest.fn(() => true),
          acHolderName: jest.fn(() => true),
          upiID: jest.fn(() => true),
        },
      },
    },
  };
});

describe('RegisterNewPaymentId Tests', () => {
  const mockDispatch = jest.fn();
  let mockState: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      purchaseOrder: {
        paymentTypeArray: [{ nameNT: 'Bank', label: 'Bank' }],
        fullPaymentType: [
          { nameNT: 'Bank', label: 'Bank' },
          { nameNT: 'UPI', label: 'UPI' },
        ],
        isEdit: false,
        editableData: {},
        walletDetails: [],
      },
    };
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) => selector(mockState));

    // Reset Validators
    (PROPERTIES.PURCHASE_ORDER.VALIDATIONS_PO.acNumber as jest.Mock).mockReturnValue(true);
    (PROPERTIES.PURCHASE_ORDER.VALIDATIONS_PO.bankName as jest.Mock).mockReturnValue(true);
    (PROPERTIES.PURCHASE_ORDER.VALIDATIONS_PO.ifscCode as jest.Mock).mockReturnValue(true);
    (PROPERTIES.PURCHASE_ORDER.VALIDATIONS_PO.acHolderName as jest.Mock).mockReturnValue(true);
    (PROPERTIES.PURCHASE_ORDER.VALIDATIONS_PO.upiID as jest.Mock).mockReturnValue(true);
  });

  const renderComponent = () => render(<RegisterNewPaymentId />);

  test('should render registration mode and handle validation alerts', () => {
    renderComponent();
    expect(screen.getByText('strings.registerNewPaymentID')).toBeTruthy();

    // 1. Missing wallet type
    fireEvent.press(screen.getByTestId('button-strings.add'));
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.selectWallet', ALERT.WARNING, expect.any(Object), {});

    // Select Wallet (Bank)
    fireEvent.press(screen.getByTestId('select-option-strings.selectWalletType'));

    // 2. Missing Bank Details (acNumber)
    fireEvent.press(screen.getByTestId('button-strings.add'));
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.bankDetailsAlert', ALERT.WARNING, expect.any(Object), {});

    // Fill Bank Details Partially
    const inputs = screen.getAllByTestId('icon-text-input');
    fireEvent.changeText(inputs[0], '123456'); // acNumber
    fireEvent.changeText(inputs[1], 'My Bank'); // bankName
    fireEvent.changeText(inputs[2], 'IFSC001'); // ifscCode
    fireEvent.changeText(inputs[3], 'John Doe'); // acHolderName

    // 3. Missing Checkbox
    fireEvent.press(screen.getByTestId('button-strings.add'));
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.acceptTerm', ALERT.WARNING, expect.any(Object), {});

    // Check Checkbox
    fireEvent.press(screen.getByTestId('checkbox'));

    // 4. Successful Submission (New)
    fireEvent.press(screen.getByTestId('button-strings.add'));
    expect(callAction).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentOperation: 'I',
        paymentType: 'Bank',
        paymentId: '123456',
      }),
      QUERY.DistributorPaymentIdUpdate,
      '',
      mockNavigate,
    );
  });

  test('should handle modify mode and UPI type', () => {
    mockState.purchaseOrder = {
      paymentTypeArray: [],
      fullPaymentType: [{ nameNT: 'UPI', label: 'UPI' }],
      isEdit: true,
      editableData: { paymentTypeNT: 'UPI', paymentIdNT: 'old-upi' },
      walletDetails: [{ id: 1 }],
    };

    renderComponent();
    expect(screen.getByText('strings.modifyPaymentID')).toBeTruthy();

    // Fill UPI (missing validation first)
    fireEvent.press(screen.getByTestId('checkbox'));

    // Test same ID error
    const upiInput = screen.getByTestId('icon-text-input');
    fireEvent.changeText(upiInput, 'old-upi');
    fireEvent.press(screen.getByTestId('button-modal.proceed'));
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.medifyError', ALERT.WARNING, expect.any(Object), {});

    // Successful Modify
    fireEvent.changeText(upiInput, 'new-upi');
    fireEvent.press(screen.getByTestId('button-modal.proceed'));
    expect(callAction).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentOperation: 'M',
        paymentId: 'new-upi',
        oldPaymentId: 'old-upi',
      }),
      QUERY.DistributorPaymentIdUpdate,
      '',
      mockNavigate,
    );
  });

  test('should handle validation constraints from PROPERTIES', () => {
    (PROPERTIES.PURCHASE_ORDER.VALIDATIONS_PO.acNumber as jest.Mock).mockReturnValue(false);

    renderComponent();
    fireEvent.press(screen.getByTestId('select-option-strings.selectWalletType')); // Select Bank

    const acInput = screen.getAllByTestId('icon-text-input')[0];
    fireEvent.changeText(acInput, 'invalid');
    expect(acInput.props.value).toBe(''); // Should not update
  });

  test('should handle cancel navigation paths', () => {
    // Case 1: walletDetails empty
    const { unmount } = renderComponent();
    fireEvent.press(screen.getByTestId('button-strings.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.PURCHASE_ORDER_REQUEST);
    unmount();

    // Case 2: walletDetails NOT empty
    mockState.purchaseOrder = {
      walletDetails: [{ id: 1 }],
      paymentTypeArray: [],
      fullPaymentType: [],
      isEdit: false,
      editableData: {},
    };
    render(<RegisterNewPaymentId />);
    fireEvent.press(screen.getByTestId('button-strings.cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.REGISTER_PAYMENT_OPTION);
  });

  test('should handle edge cases in isEdit mode (Bank type)', () => {
    mockState.purchaseOrder = {
      paymentTypeArray: [],
      fullPaymentType: [{ nameNT: 'Bank', label: 'Bank' }],
      isEdit: true,
      editableData: { paymentTypeNT: 'Bank', paymentIdNT: 'old-bank', bankNameNT: 'B', ifscNoNT: 'I', userNameNT: 'U' },
      walletDetails: [],
    };
    renderComponent();

    const acInput = screen.getAllByTestId('icon-text-input')[0];
    fireEvent.press(screen.getByTestId('checkbox'));
    fireEvent.changeText(acInput, 'old-bank');
    fireEvent.press(screen.getByTestId('button-modal.proceed'));
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.modifyErrorBank', ALERT.WARNING, expect.any(Object), {});
  });

  test('should handle UPI missing value alert', () => {
    mockState.purchaseOrder.paymentTypeArray = [{ nameNT: 'UPI', label: 'UPI' }];
    renderComponent();
    fireEvent.press(screen.getByTestId('select-option-strings.selectWalletType'));
    fireEvent.press(screen.getByTestId('button-strings.add'));
    expect(uiActions.showAlert).toHaveBeenCalledWith('strings.PaymentID', ALERT.WARNING, expect.any(Object), {});
  });

  test('should skip setup if selectedType is not found in edit mode', () => {
    mockState.purchaseOrder = {
      isEdit: true,
      editableData: { paymentTypeNT: 'Invalid' },
      fullPaymentType: [{ nameNT: 'Bank', label: 'Bank' }],
      paymentTypeArray: [],
      walletDetails: [],
    };
    renderComponent();
    expect(screen.getByText('strings.modifyPaymentID')).toBeTruthy();
  });
});
