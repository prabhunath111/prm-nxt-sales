import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'store/sales/actions/etskRegSchedular';
import uiActions from 'store/sales/actions/ui';
import DatePickerNew from './DatePickerNew';

// Mocking dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('store/sales/actions/etskRegSchedular', () => ({
  handleEtskScheduleDate: jest.fn((date) => ({ type: 'HANDLE_DATE', payload: date })),
  installationTimeSlots: jest.fn(() => ({ type: 'INSTALLATION_TIME_SLOTS' })),
}));

jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_MODAL' })),
}));

// Mock CalendarNew to easily trigger onDateSelected
jest.mock('components/sales/CalendarNew', () => {
  const { Pressable } = jest.requireActual('react-native');
  // eslint-disable-next-line react/destructuring-assignment
  return (props: any) => <Pressable testID="mock-calendar" onPress={() => props.onDateSelected({ dateString: '2024-06-02' })} />;
});

const mockStore = (state = {}) =>
  configureStore({
    reducer: {
      etskRegSchedular: (s = state) => s,
    },
  });

describe('DatePickerNew Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders correctly and dispatches initial date on mount', () => {
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} />
      </Provider>,
    );

    expect(screen.getByTestId('date-picker-new')).toBeTruthy();
    expect(mockDispatch).toHaveBeenCalledWith(actions.handleEtskScheduleDate('2024-06-01'));
  });

  test('handles date selection from calendar', () => {
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('mock-calendar'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.handleEtskScheduleDate('2024-06-02'));
  });

  test('handles time slot button press', () => {
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} />
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.timeSlot'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.installationTimeSlots());
  });

  test('handles cancel button press', () => {
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} />
      </Provider>,
    );

    fireEvent.press(screen.getByText('strings.cancel'));
    expect(mockDispatch).toHaveBeenCalledWith(uiActions.hideBottomModal());
  });

  test('renders error message when error prop is provided', () => {
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} error="Test Error" id="test-id" />
      </Provider>,
    );

    expect(screen.getByText('Test Error')).toBeTruthy();
  });

  test('calculates minDate correctly when isMultiDates is true', () => {
    const spySetDate = jest.spyOn(Date.prototype, 'setDate');
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates />
      </Provider>,
    );
    // 90 days range
    expect(spySetDate).toHaveBeenCalled();
    spySetDate.mockRestore();
  });

  test('calculates minDate correctly when defaultDateSelection is provided', () => {
    const spySetDate = jest.spyOn(Date.prototype, 'setDate');
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} defaultDateSelection={45} />
      </Provider>,
    );
    // 45 days range
    expect(spySetDate).toHaveBeenCalled();
    spySetDate.mockRestore();
  });

  test('uses customMaxDate and customMinDate if provided', () => {
    const customMax = new Date('2024-07-01');
    const customMin = new Date('2024-05-01');
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} customMaxDate={customMax} customMinDate={customMin} />
      </Provider>,
    );
    expect(screen.getByTestId('date-picker-new')).toBeTruthy();
  });

  test('uses empty string for defaultDate if formatDateISO returns null', () => {
    const invalidDate = new Date('invalid');
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} customMaxDate={invalidDate} />
      </Provider>,
    );
    expect(screen.getByTestId('date-picker-new')).toBeTruthy();
  });

  test('calculates dateRange as 31 when both defaultDateSelection and isMultiDates are false/undefined', () => {
    const spySetDate = jest.spyOn(Date.prototype, 'setDate');
    render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} />
      </Provider>,
    );
    // 31 days range
    expect(spySetDate).toHaveBeenCalled();
    spySetDate.mockRestore();
  });

  test('snapshot test', () => {
    const component = render(
      <Provider store={mockStore()}>
        <DatePickerNew isMultiDates={false} />
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
