/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ICONS } from 'const';
import DatePicker from './DatePicker';

// ==================== MOCKS ====================

jest.mock('components/sales/Calendar', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => (
      <TouchableOpacity
        testID="calendar-mock"
        onPress={() => props.onDateSelected({ timestamp: 1718452800000 })} // 2024-06-15
      />
    ),
  };
});

jest.mock('components/sales/TextInput', () => {
  const { View, Text: RNText } = require('react-native');
  return {
    __esModule: true,
    default: ({ value, placeholder, editable }: any) => (
      <View testID="text-input-mock">
        <RNText>{value}</RNText>
        <RNText>{placeholder}</RNText>
        <RNText>{editable ? 'Editable' : 'Disabled'}</RNText>
      </View>
    ),
  };
});

jest.mock('components/sales/Modal', () => {
  const { View, TouchableOpacity, Text: RNText } = require('react-native');
  const MockModal = ({ isVisible, children, onClose, height, width, placementType }: any) =>
    isVisible ? (
      <View testID="modal-mock">
        <RNText>{`Height:${height}`}</RNText>
        <RNText>{`Width:${width}`}</RNText>
        <RNText>{`Placement:${JSON.stringify(placementType)}`}</RNText>
        <TouchableOpacity testID="modal-close" onPress={onClose} />
        {children}
      </View>
    ) : null;

  return {
    __esModule: true,
    ModalPlacement: {
      BOTTOM: 'bottom',
      AUTO: 'auto',
      CENTER: 'center',
    },
    default: MockModal,
  };
});

jest.mock('components/sales/Image', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ iconName }: any) => <View testID={`image-${iconName}`} />,
  };
});

jest.mock('components/sales/Text', () => {
  const { Text: RNText } = require('react-native');
  return {
    __esModule: true,
    default: ({ label, id }: any) => <RNText testID={id}>{label}</RNText>,
  };
});

jest.mock('utils/dateHelper', () => ({
  formatDate: jest.fn(() => '15/06/2024'),
  toISODate: jest.fn((d) => (d ? '2024-06-15' : '2024-01-01')),
}));

let mockIsWeb = false;
jest.mock('utils/platformHelper', () => ({
  get isWeb() {
    return mockIsWeb;
  },
}));

// Mock styles to avoid issues with undefined properties
jest.mock('./DatePicker.styles', () => ({
  inputContainer: {},
  inputField: {},
  iconButton: {},
  errorText: {},
  arrow: {},
}));

describe('Test for the component DatePicker', () => {
  const onDateSelectedMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsWeb = false;
  });

  test('renders component DatePicker with initial values', () => {
    render(<DatePicker onDateSelected={onDateSelectedMock} value="10/06/2024" placeholder="Select Date" />);

    expect(screen.getByText('10/06/2024')).toBeTruthy();
    expect(screen.getByText('Select Date')).toBeTruthy();
    expect(screen.getByTestId(`image-${ICONS.CALENDAR}`)).toBeTruthy();
  });

  test('opens modal when calendar icon is pressed', () => {
    render(<DatePicker onDateSelected={onDateSelectedMock} />);

    // Press the icon button (wrapped in Pressable)
    const iconButton = screen.getByTestId(`image-${ICONS.CALENDAR}`).parent;
    fireEvent.press(iconButton as any);

    expect(screen.getByTestId('modal-mock')).toBeTruthy();
  });

  test('handles date selection from Calendar', () => {
    render(<DatePicker onDateSelected={onDateSelectedMock} />);

    // Open modal
    const iconButton = screen.getByTestId(`image-${ICONS.CALENDAR}`).parent;
    fireEvent.press(iconButton as any);

    // Press calendar mock to select date
    const calendarMock = screen.getByTestId('calendar-mock');
    fireEvent.press(calendarMock);

    expect(onDateSelectedMock).toHaveBeenCalledWith('15/06/2024');
    expect(screen.queryByTestId('modal-mock')).toBeNull();
  });

  test('handles modal close action', () => {
    render(<DatePicker onDateSelected={onDateSelectedMock} />);

    // Open modal
    const iconButton = screen.getByTestId(`image-${ICONS.CALENDAR}`).parent;
    fireEvent.press(iconButton as any);

    // Close modal
    const closeButton = screen.getByTestId('modal-close');
    fireEvent.press(closeButton);

    expect(screen.queryByTestId('modal-mock')).toBeNull();
  });

  test('renders error message when error prop is provided', () => {
    render(<DatePicker onDateSelected={onDateSelectedMock} error="Invalid date" id="test-date" />);

    expect(screen.getByText('Invalid date')).toBeTruthy();
    expect(screen.getByTestId('test-dateerror')).toBeTruthy();
  });

  test('handles disabled state', () => {
    render(<DatePicker onDateSelected={onDateSelectedMock} disabled />);

    expect(screen.getByText('Disabled')).toBeTruthy();

    const iconButton = screen.getByTestId(`image-${ICONS.CALENDAR}`).parent;
    fireEvent.press(iconButton as any);

    // Modal should NOT be visible
    expect(screen.queryByTestId('modal-mock')).toBeNull();
  });

  test('applies web-specific placement and blur settings', () => {
    mockIsWeb = true;
    render(<DatePicker onDateSelected={onDateSelectedMock} />);

    const iconButton = screen.getByTestId(`image-${ICONS.CALENDAR}`).parent;
    fireEvent.press(iconButton as any);

    // placement Type should be an array [BOTTOM, AUTO]
    expect(screen.getByText(/Placement:\["bottom","auto"\]/)).toBeTruthy();
  });

  test('applies mobile-specific placement (CENTER)', () => {
    mockIsWeb = false;
    render(<DatePicker onDateSelected={onDateSelectedMock} />);

    const iconButton = screen.getByTestId(`image-${ICONS.CALENDAR}`).parent;
    fireEvent.press(iconButton as any);

    // placement Type should be "center"
    expect(screen.getByText(/Placement:"center"/)).toBeTruthy();
  });
});
