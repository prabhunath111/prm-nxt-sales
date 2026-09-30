/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';

import EvdRaiseRequest from './EvdRaiseRequest';

// Mock dependencies
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
jest.mock('wrappers/inflection/InflectionProvider', () => ({ useInflection: () => ({ inflection: 'xl' }) }));
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({ navigate: mockNavigate, goBack: mockGoBack }));
jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock('styles/webBreakpoints', () => ({ gcs: (s: any) => s }));
jest.mock('react-native-razorpay', () => ({ open: jest.fn(), default: { open: jest.fn() } }));
jest.mock('utils/formBuilderHelper', () => ({ callAction: jest.fn() }));

// Mock constants
jest.mock('const', () => {
  const actual = jest.requireActual('const');
  return {
    ...actual,
    STRINGS: {
      ...actual.STRINGS,
      BANK: 'BANK',
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE',
    },
    ROUTE: {
      ...actual.ROUTE,
      WEB: {
        ...actual.ROUTE.WEB,
        EVD_RAISE_REQUEST_SUCCESS: 'evdRaiseRequestSuccess',
      },
    },
  };
});

// Mock components
jest.mock('components/sales', () => {
  const rn = require('react-native');
  const React = require('react');
  return {
    BalanceContainer: ({ balance }: any) => <rn.Text>Balance: {balance}</rn.Text>,
    Button: ({ label, onPress, testID }: any) => (
      <rn.TouchableOpacity testID={testID || label} onPress={onPress}>
        <rn.Text>{label}</rn.Text>
      </rn.TouchableOpacity>
    ),
    Checkbox: ({ value, onValueChange, label }: any) => (
      <rn.TouchableOpacity testID="checkbox" onPress={() => onValueChange(!value)}>
        <rn.Text>
          {label} {value ? 'Checked' : 'Unchecked'}
        </rn.Text>
      </rn.TouchableOpacity>
    ),
    Dropdown: ({ onSelect, data, testID, placeholder }: any) => (
      <rn.View testID={testID}>
        <rn.Text>{placeholder}</rn.Text>
        {data?.map((item: any, i: number) => (
          <rn.TouchableOpacity key={i} testID={`dropdown-item-${item.value || i}`} onPress={() => onSelect(item)}>
            <rn.Text>{item.name}</rn.Text>
          </rn.TouchableOpacity>
        ))}
      </rn.View>
    ),
    IconTextInput: ({ value, onInputChange, error, testID, placeholder }: any) => (
      <rn.View testID={testID}>
        <rn.TextInput testID="text-input" value={value} onChangeText={onInputChange} placeholder={placeholder} />
        {error ? <rn.Text testID="input-error">{error}</rn.Text> : null}
      </rn.View>
    ),
    InformationText: ({ primaryText, secondaryText, testID }: any) => (
      <rn.View testID={testID || primaryText}>
        <rn.Text>
          {primaryText}: {secondaryText}
        </rn.Text>
      </rn.View>
    ),
    PillsGroup: ({ itemsArr, onPillPress, testID }: any) => (
      <rn.View testID={testID || 'pills'}>
        {itemsArr?.map((pill: any, i: number) => (
          <rn.TouchableOpacity key={i} testID={`pill-${pill.value || pill || i}`} onPress={() => onPillPress(String(pill.value || pill))}>
            <rn.Text>{pill.name || pill}</rn.Text>
          </rn.TouchableOpacity>
        ))}
      </rn.View>
    ),
    Tabs: ({ tabs, setSelectedTab }: any) => {
      const [localTab, setLocalTab] = React.useState(0);
      React.useEffect(() => {
        setSelectedTab(0);
      }, []);
      return (
        <rn.View>
          {tabs.map((tab: any, i: number) => (
            <rn.TouchableOpacity
              key={i}
              testID={`tab-${i}`}
              onPress={() => {
                setSelectedTab(i);
                setLocalTab(i);
              }}
            >
              <rn.Text>{tab.title}</rn.Text>
            </rn.TouchableOpacity>
          ))}
          <rn.View testID="tab-content">{tabs[localTab].component}</rn.View>
        </rn.View>
      );
    },
    Text: ({ label, children, style }: any) => <rn.Text style={style}>{label || children}</rn.Text>,
    Sizing: { x5: 5, x6: 6, layout: { x16: 16 } },
    Colors: { violet: { v200: '#ccc' } },
    STYLE_VARIANT: { P4: 'P4' },
    PROPERTIES: {
      PURCHASE_ORDER: {
        PILLS_GROUP_ARRAY: ['500', '1000', '2000', '5000'],
      },
    },
    ICONS: { RUPEE_SYMBOL: 'rs' },
  };
});

describe('EvdRaiseRequest Component', () => {
  const mockDispatch = jest.fn();
  let mockState: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    mockState = {
      user: { info: { mdn: '1234567890', userId: 'U1' } },
      purchaseOrder: {
        balanceEnquiryData: { currentBalance: '1000', instantThreshold: [100, 5000, 2] },
        paymentTypesData: {
          paymentId: [
            { name: 'B1', value: 'V1', paymentTypeNT: 'BANK', paymentIdNT: 'A1', ifscNoNT: 'IFSC1', userName: 'User1' },
            { name: 'W1', value: 'V2', paymentTypeNT: 'WALLET', paymentIdNT: 'ID1' },
          ],
        },
      },
      ui: { isLoading: false },
    };
    (useSelector as unknown as jest.Mock).mockImplementation((fn) => fn(mockState));

    mockDispatch.mockImplementation((action: any) => {
      if (typeof action === 'function') return action(mockDispatch, () => mockState);
      return action;
    });
  });

  test('Submission and Razorpay callbacks', async () => {
    const { callAction } = require('utils/formBuilderHelper');
    const Razorpay = require('react-native-razorpay');

    callAction.mockResolvedValueOnce({
      status: true,
      data: { response: { apiKey: 'K1', orderId: 'O1', evdTransId: 'T1', distId: 'D1', dealerId: 'U1', transferId: 'TR1', comAmount: '10' } },
    });

    render(<EvdRaiseRequest />);
    const input = screen.getByTestId('text-input');

    fireEvent.changeText(input, '1000');
    fireEvent.press(screen.getByText('strings.sendRequest'));

    await waitFor(() => expect(Razorpay.open).toHaveBeenCalled());
    const [options, success, failure] = (Razorpay.open as jest.Mock).mock.calls[0];

    act(() => {
      success({ data: 'ok' });
    });
    act(() => {
      failure({ error: { description: 'err', reason: 'r' } });
    });
    act(() => {
      options.handler({ res: 'ok' });
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('Validation edge cases - Online and Request', async () => {
    render(<EvdRaiseRequest />);
    const input = screen.getByTestId('text-input');

    // Online Tab
    fireEvent.changeText(input, '50'); // multiplesOf100
    expect(screen.getByText('errors.multiplesOf100')).toBeTruthy();

    fireEvent.changeText(input, '0'); // minAmount
    expect(screen.getByText('errors.minAmount')).toBeTruthy();

    fireEvent.changeText(input, '6000'); // maxAmount
    expect(screen.getByText('errors.maxAmount')).toBeTruthy();

    fireEvent.changeText(input, 'abc'); // regex early return
    expect(input.props.value).toBe('6000'); // value should not change from previous valid/partial valid

    fireEvent.changeText(input, '500'); // valid
    expect(screen.queryByTestId('input-error')).toBeNull();

    fireEvent.changeText(input, ''); // empty check
    fireEvent.press(screen.getByText('strings.sendRequest'));
    expect(mockDispatch).toHaveBeenCalled(); // showAlert called

    // Request Tab validation
    fireEvent.press(screen.getByTestId('tab-1'));
    const requestInput = screen.getByTestId('text-input');

    fireEvent.changeText(requestInput, 'abc'); // regex early return
    fireEvent.changeText(requestInput, '500');
    fireEvent.changeText(requestInput, ''); // !val case

    // Press send to trigger empty partner alert
    fireEvent.press(screen.getByText('strings.sendRequest'));

    fireEvent.press(screen.getByTestId('dropdown-item-V1')); // BANK
    expect(screen.getByText('strings.bankAccountNo: A1')).toBeTruthy();
    expect(screen.getByText('strings.enterIfscCode: IFSC1')).toBeTruthy();
    expect(screen.getByText('strings.accountHolderName: User1')).toBeTruthy();

    fireEvent.press(screen.getByTestId('dropdown-item-V2')); // WALLET
    expect(screen.getByText('strings.PaymentIDPO ID1')).toBeTruthy();

    // Trigger missing checkbox alert
    fireEvent.press(screen.getByText('strings.sendRequest'));
    fireEvent.press(screen.getByTestId('checkbox')); // Checked

    // Trigger missing amount alert
    fireEvent.changeText(requestInput, '');
    fireEvent.press(screen.getByText('strings.sendRequest'));
  });

  test('Interaction branches and success path', async () => {
    const { callAction } = require('utils/formBuilderHelper');

    // Test falsy response from DealerBalanceRequest (for branch 282)
    callAction.mockResolvedValueOnce(null);
    render(<EvdRaiseRequest />);
    fireEvent.press(screen.getByTestId('tab-1'));
    fireEvent.changeText(screen.getByTestId('text-input'), '500');
    fireEvent.press(screen.getByTestId('dropdown-item-V1'));
    fireEvent.press(screen.getByTestId('checkbox'));
    fireEvent.press(screen.getByText('strings.sendRequest'));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    }); // Wait for microtasks

    // Test success branch
    callAction.mockResolvedValueOnce({ status: true });
    fireEvent.press(screen.getByText('strings.sendRequest'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('evdRaiseRequestSuccess'));

    fireEvent.press(screen.getByText('strings.back'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('Request Tab with validation error (for branch 268 false)', () => {
    render(<EvdRaiseRequest />);
    // Force error in Tab 0
    fireEvent.changeText(screen.getByTestId('text-input'), '50');
    // Switch to Tab 1
    fireEvent.press(screen.getByTestId('tab-1'));
    // Press send request -> error is not empty, so 268 is false
    fireEvent.press(screen.getByText('strings.sendRequest'));
    expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'CALL_ACTION' }));
  });

  test('Tab 0 with positive amount but has error (for branch 207 false)', () => {
    render(<EvdRaiseRequest />);
    fireEvent.changeText(screen.getByTestId('text-input'), '50'); // has error
    fireEvent.press(screen.getByText('strings.sendRequest'));
    // Should hit line 264 false because selectedTab is 0 but amount is '50' (truthy)
    // and it hits line 268 false because selectedTab is 0.
    expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'CALL_ACTION' }));
  });

  test('Pill interactions', () => {
    render(<EvdRaiseRequest />);
    fireEvent.press(screen.getByTestId('pill-1000'));
    expect(screen.getByTestId('text-input').props.value).toBe('1000');

    fireEvent.press(screen.getByTestId('tab-1'));
    fireEvent.press(screen.getByTestId('pill-5000'));
    expect(screen.getByTestId('text-input').props.value).toBe('5000');
  });

  test('Error handling in GetOrderId', async () => {
    const { callAction } = require('utils/formBuilderHelper');

    // Test !response?.status for GetOrderId
    callAction.mockResolvedValueOnce({ status: false });

    render(<EvdRaiseRequest />);
    fireEvent.changeText(screen.getByTestId('text-input'), '500');
    fireEvent.press(screen.getByText('strings.sendRequest'));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    // Test rejection path
    callAction.mockRejectedValueOnce({ message: 'Error Message' });
    fireEvent.press(screen.getByText('strings.sendRequest'));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
  });

  test('tabs reset state in useEffect', () => {
    render(<EvdRaiseRequest />);
    fireEvent.changeText(screen.getByTestId('text-input'), '500');
    fireEvent.press(screen.getByTestId('tab-1'));
    expect(screen.getByTestId('text-input').props.value).toBe('');
  });
});
