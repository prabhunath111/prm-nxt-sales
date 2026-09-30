/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import actions from 'store/sales/actions/common';
import uiActions from 'store/sales/actions/ui';
import { CHILD_TYPE } from 'const';
import SelectDate from './SelectDate';

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock store actions
jest.mock('store/sales/actions/common', () => ({
  __esModule: true,
  default: {
    resetCustomFormData: jest.fn(() => ({ type: 'RESET_FORM' })),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showBottomModal: jest.fn((options) => ({ type: 'SHOW_MODAL', options })),
  },
}));

// Mock constants
jest.mock('const', () => ({
  STRINGS: { DATE_FORMAT: 'en-GB' },
  PROPERTIES: { SELECT_DATE: { year: 'numeric', month: 'long', day: 'numeric' } },
  ICONS: { CALENDAR_PINK: 'calendar-pink' },
  CHILD_TYPE: { SIMPLE_CALENDER: 'simple-calendar' },
}));

jest.mock('const/regexes', () => ({
  SPACE_REGEX_GLOBAL: / /g,
}));

// Mock child component
jest.mock('components/sales', () => {
  const React = require('react');
  const { View, Text: RNText } = require('react-native');
  return {
    IconTextInput: (props: any) => <View testID="IconTextInput" {...props} />,
    Text: ({ label, color }: any) => (
      <RNText style={{ color }} testID="ErrorText">
        {label}
      </RNText>
    ),
  };
});

describe('SelectDate Component', () => {
  const mockDispatch = jest.fn();
  const mockT = jest.fn((key) => key);
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useTranslation as jest.Mock).mockReturnValue({ t: mockT });

    // Mock system time to have consistent today's date
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const setupStore = (selectedDate: string | null = null) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        storeDashboard: { selectedDate },
      }),
    );
  };

  test("renders with today's date by default if no date in Redux", () => {
    setupStore(null);
    render(<SelectDate onValueChange={mockOnValueChange} />);

    const expectedDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/ /g, '-');

    expect(screen.getByTestId('IconTextInput').props.value).toBe(expectedDate);
    expect(mockOnValueChange).toHaveBeenCalledWith(expectedDate);
  });

  test('renders with formatted date from Redux state', () => {
    const specificDate = '2024-12-25T10:00:00Z';
    setupStore(specificDate);
    render(<SelectDate onValueChange={mockOnValueChange} />);

    const formatted = new Date(specificDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/ /g, '-');

    expect(screen.getByTestId('IconTextInput').props.value).toBe(formatted);
    expect(mockOnValueChange).toHaveBeenCalledWith(formatted);
  });

  test('dispatches reset and modal actions on press', () => {
    setupStore(null);
    render(<SelectDate />);

    fireEvent.press(screen.getByTestId('SelectDate'));

    expect(mockDispatch).toHaveBeenCalledWith(actions.resetCustomFormData());
    expect(uiActions.showBottomModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isModalVisible: true,
        type: CHILD_TYPE.SIMPLE_CALENDER,
      }),
    );
  });

  test('displays error text when error prop is provided', () => {
    setupStore(null);
    const errorMsg = 'Please select a date';
    render(<SelectDate error={errorMsg} />);

    expect(screen.getByTestId('ErrorText').children[0]).toBe(errorMsg);
  });

  test('passes placeholder to IconTextInput', () => {
    setupStore(null);
    const placeholder = 'Select your bday';
    render(<SelectDate placeholder={placeholder} />);

    expect(screen.getByTestId('IconTextInput').props.placeholder).toBe(placeholder);
  });

  test('updates display when state date changes from null to value', () => {
    (useSelector as unknown as jest.Mock).mockReturnValueOnce({ selectedDate: null });
    const { rerender } = render(<SelectDate onValueChange={mockOnValueChange} />);

    setupStore('2025-01-01');
    rerender(<SelectDate onValueChange={mockOnValueChange} />);

    const formatted = new Date('2025-01-01').toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/ /g, '-');
    expect(screen.getByTestId('IconTextInput').props.value).toBe(formatted);
  });
});
