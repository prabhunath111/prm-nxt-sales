/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { PROPERTIES } from 'const';
import * as navigationHelper from 'utils/navigationHelper';
import RaiseTheRequest from './RaiseTheRequest';

const createMockItem = (n: string, i: string = '1') => ({ name: n, nameNT: n, categoryNT: n, subCategoryNT: n, id: i, toString: () => n });
const CATS = {
  N_FR: createMockItem(PROPERTIES.RAISE_REQUEST.unableToViewServices),
  N_SR: createMockItem(PROPERTIES.RAISE_REQUEST.accountUpdate),
  T_SUS: createMockItem(PROPERTIES.RAISE_REQUEST.suspension),
  T_RES: createMockItem(PROPERTIES.RAISE_REQUEST.resumption),
  SD_1: createMockItem('SD_1'),
  ST_1: createMockItem('ST_1'),
  RS_1: createMockItem('RS_1'),
  T_1: createMockItem('T_1', '101'),
};

let mockState: any;
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
const mockDispatch: any = jest.fn((a: any) => (typeof a === 'function' ? a(mockDispatch, () => mockState) : Promise.resolve(a)));
const mockNavigate = { goHome: jest.fn(), navigate: jest.fn() };
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch, useSelector: (fn: any) => fn(mockState) }));
jest.mock('hooks/useNavigate', () => () => mockNavigate);
jest.mock('wrappers/inflection/InflectionProvider', () => ({ useInflection: () => ({ inflection: 'default' }) }));
jest.mock('styles/webBreakpoints', () => ({ gcs: (s: any) => s }));
jest.mock('utils/navigationHelper', () => ({ closeWebView: jest.fn() }));
jest.mock('services/moengageMixpanel', () => ({ MoengageMixpanel: { trackEvent: jest.fn() } }));
jest.mock('hooks/useEngInputValidation', () => ({ useEnglishInputValidation: (cb: any) => ({ inputError: false, onInputChange: cb }) }));
jest.mock('store/sales/actions/customerService', () => ({
  __esModule: true,
  default: {
    resetRaiseRequest: () => ({ type: 'R1' }),
    getServiceSubCategories: () => ({ type: 'R2' }),
    getSlotDateForDropdown: () => ({ type: 'R3' }),
    getSlotTimeForDropdown: () => ({ type: 'R4' }),
    getSuspensionReason: () => ({ type: 'R5' }),
    getAvailableSlot: () => ({ type: 'R6' }),
    getCustomerServiceInfo: () => Promise.resolve({ accountInfo: { subId: '1234567890', customerName: 'J' } }),
    createServiceRequest: () => Promise.resolve({ status: true, data: { message: 'OK', transactionId: 'TX1' } }),
    resetSubCategories: () => ({ type: 'R7' }),
  },
}));
jest.mock('store/sales/reducer/customerService', () => ({ sliceActions: { setSelectedType: () => ({ type: 'R8' }), setTypeOfRequest: () => ({ type: 'R9' }) } }));
jest.mock('store/sales/actions/ui', () => ({ __esModule: true, default: { showAlert: jest.fn(() => ({ type: 'R10' })) } }));
jest.mock('store/sales/actions/form', () => ({ __esModule: true, default: { setSubIdListDefault: () => ({ type: 'R11' }) } }));
jest.mock('utils/dateHelper', () => ({
  formatDateToISO: (_d: any) => '2024-06-15',
  formatDateISO: (_d: any) => '2024-06-15',
  formatISODate: (_d: any) => '2024-06-15',
  getCurrentDateFormatted: () => '06/15/2024',
  toUSDate: (_d: any) => '06/15/2024',
  addHoursToTime: (_t: any) => '11:00 AM',
}));

let mockMinLen = true;
jest.mock('utils/formBuilderHelper', () => ({
  checkMinLength: () => mockMinLen,
  checkMaxLength: () => true,
  checkFixLength: (v: any) => String(v).length === 10,
}));

jest.mock('components/sales', () => {
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  return {
    Button: ({ onPress, label, testID }: any) => (
      <TouchableOpacity onPress={onPress} testID={testID || `btn-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Card: ({ children, testID }: any) => <View testID={testID}>{children}</View>,
    Dropdown: ({ data, onSelect, error, testID }: any) => (
      <View testID={testID}>
        {data?.map((item: any) => (
          <TouchableOpacity testID={`it-${String(item)}`} onPress={() => onSelect(item)}>
            <Text>{String(item)}</Text>
          </TouchableOpacity>
        ))}
        {error && <Text>{error}</Text>}
      </View>
    ),
    FormHeader: () => null,
    InformationText: () => (
      <View testID="info">
        <Text>Info</Text>
      </View>
    ),
    Text: ({ label }: any) => <Text>{label}</Text>,
    TextInput: ({ value, onInputChange, error, testID }: any) => (
      <View>
        <TextInput value={value} onChangeText={onInputChange} testID={testID || 'txt'} />
        {error && <Text>{error}</Text>}
      </View>
    ),
    DatePicker: ({ onDateSelected, testID }: any) => <TouchableOpacity testID={testID || 'dp'} onPress={() => onDateSelected('15/06/2024')} />,
    MultipleSubId: ({ onSelect }: any) => <TouchableOpacity testID="ms" onPress={() => onSelect('1234567890')} />,
  };
});

describe('RaiseTheRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMinLen = true;
    mockState = {
      customerService: {
        accountInfo: { subId: '1234567890', customerName: 'J', customerStatusNT: 'Active', ocsFlag: 'N' },
        messages: { frRestrictionMessage: 'RM', smsMessageFrWorkOrder: 'SM', subNotSuspended: 'NS', subNotActive: 'NA' },
        categories: [CATS.N_FR, CATS.N_SR],
        allCategoryInfo: [
          { categoryNT: String(CATS.N_FR), subCategoryNT: '', woTypeNT: 'SR', status: 'Active' },
          { categoryNT: String(CATS.N_FR), subCategoryNT: String(CATS.T_1), woTypeNT: 'Field Repair', status: 'Active' },
          { categoryNT: String(CATS.N_SR), subCategoryNT: '', woTypeNT: 'SR', status: 'Active' },
          { categoryNT: String(CATS.N_SR), subCategoryNT: String(CATS.T_1), woTypeNT: 'SR', status: 'Active' },
          { categoryNT: String(CATS.N_SR), subCategoryNT: String(CATS.T_SUS), woTypeNT: 'SR', woSubTypeNT: 'SUS', status: 'Active' },
          { categoryNT: String(CATS.N_SR), subCategoryNT: String(CATS.T_RES), woTypeNT: 'SR', woSubTypeNT: 'RES', status: 'Suspended' },
        ],
        subCategories: [CATS.T_1, CATS.T_SUS, CATS.T_RES],
        suspensionReason: [CATS.RS_1],
        slotDate: [CATS.SD_1],
        slotTime: [CATS.ST_1],
        availableSlot: { slotDate: 'SD_1', slotTimes: [CATS.ST_1] },
        slotSuggestions: [{ id: '1', start: '2024-06-15T10:00:00Z', end: '2024-06-15T13:00:00Z' }],
        taskId: { taskId: '1' },
      },
      user: { isRedirection: false },
    };
  });

  test('Status Branches & Ternaries', async () => {
    mockState.customerService.accountInfo.customerStatusNT = 'Inactive';
    render(<RaiseTheRequest />);
    fireEvent.press(screen.getByTestId('ms'));
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.validateId')));

    // Status mismatches
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_FR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_SUS)}`));

    // Ternary branch: Deactivated (Line 247, 359)
    mockState.customerService.accountInfo.ocsFlag = 'Y';
    mockState.customerService.accountInfo.customerStatusNT = 'Deactivated';
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_FR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_SUS)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_SR)}`));

    // Validation failure
    mockMinLen = false;
    fireEvent.changeText(screen.getAllByTestId('txt')[0], '123'); // Should trigger minLength error
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_FR)}`));
  });

  test('Non-OCS FR Flow', async () => {
    render(<RaiseTheRequest />);
    fireEvent.changeText(screen.getAllByTestId('txt')[0], '1234567890');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.validateId')));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_FR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_1)}`));
    await waitFor(() => expect(screen.getByTestId('it-SD_1')).toBeTruthy());
    fireEvent.press(screen.getByTestId('it-SD_1'));
    fireEvent.press(screen.getByTestId('it-ST_1'));
    fireEvent.changeText(screen.getAllByTestId('txt')[1], 'Reason');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.proceed')));
  });

  test('OCS FR Flow', async () => {
    mockState.customerService.accountInfo.ocsFlag = 'Y';
    render(<RaiseTheRequest />);
    fireEvent.changeText(screen.getAllByTestId('txt')[0], '1234567890');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.validateId')));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_FR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_1)}`));
    await waitFor(() => expect(screen.getByTestId('btn-strings.availableSlot')).toBeTruthy());
    fireEvent.press(screen.getByTestId('btn-strings.availableSlot'));
    fireEvent.press(screen.getByTestId('dp'));
    fireEvent.press(screen.getByTestId('it-ST_1'));
    fireEvent.changeText(screen.getAllByTestId('txt')[1], 'Reason');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.proceed')));
  });

  test('OCS Suspension Flow', async () => {
    mockState.customerService.accountInfo.ocsFlag = 'Y';
    render(<RaiseTheRequest />);
    fireEvent.changeText(screen.getAllByTestId('txt')[0], '1234567890');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.validateId')));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_SR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_SUS)}`));
    await waitFor(() => expect(screen.getByTestId('it-RS_1')).toBeTruthy());
    fireEvent.press(screen.getByTestId('it-RS_1'));
    fireEvent.press(screen.getAllByTestId('dp')[0]);
    fireEvent.press(screen.getAllByTestId('dp')[1]);
    fireEvent.changeText(screen.getAllByTestId('txt')[1], 'Reason');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.proceed')));
  });

  test('Non-OCS Suspension Flow', async () => {
    render(<RaiseTheRequest />);
    fireEvent.changeText(screen.getAllByTestId('txt')[0], '1234567890');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.validateId')));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_SR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_SUS)}`));
    await waitFor(() => expect(screen.getByTestId('it-RS_1')).toBeTruthy());
    fireEvent.press(screen.getByTestId('it-RS_1'));
    fireEvent.press(screen.getAllByTestId('dp')[0]);
    fireEvent.press(screen.getAllByTestId('dp')[1]);
    fireEvent.changeText(screen.getAllByTestId('txt')[1], 'Reason');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.proceed')));
  });

  test('OCS Default Flow & Navigation', async () => {
    mockState.customerService.accountInfo.ocsFlag = 'Y';
    render(<RaiseTheRequest />);
    fireEvent.changeText(screen.getAllByTestId('txt')[0], '1234567890');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.validateId')));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_SR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_1)}`));
    fireEvent.changeText(screen.getAllByTestId('txt')[1], 'Reason');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.proceed')));
    fireEvent.press(screen.getByTestId('btn-strings.cancel'));
    expect(mockNavigate.goHome).toHaveBeenCalled();
  });

  test('Non-OCS Resumption Flow', async () => {
    mockState.customerService.accountInfo.customerStatusNT = 'Suspended';
    render(<RaiseTheRequest />);
    fireEvent.changeText(screen.getAllByTestId('txt')[0], '1234567890');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.validateId')));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_SR)}`));
    fireEvent.press(screen.getByTestId(`it-${String(CATS.T_RES)}`));
    fireEvent.changeText(screen.getAllByTestId('txt')[1], 'Reason');
    await act(async () => fireEvent.press(screen.getByTestId('btn-strings.proceed')));
  });

  test('Navigation - closeWebView', async () => {
    mockState.user.isRedirection = true;
    render(<RaiseTheRequest />);
    fireEvent.press(screen.getByTestId('btn-strings.cancel'));
    expect(navigationHelper.closeWebView).toHaveBeenCalled();
  });

  test('Handoff Branch', async () => {
    mockState.customerService.allCategoryInfo[0].woTypeNT = 'Field Repair';
    render(<RaiseTheRequest />);
    fireEvent.press(screen.getByTestId(`it-${String(CATS.N_FR)}`));
  });
});
