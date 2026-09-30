/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CustomCalendar from './CustomCalendar';

// ==================== MOCKS ====================

const mockCalendarProps = jest.fn();

jest.mock('react-native-calendars', () => {
  const { View: ViewActual, TouchableOpacity: TouchableOpacityActual } = require('react-native');

  return {
    Calendar: (props: any) => {
      mockCalendarProps(props);
      const Header = props.renderHeader ? props.renderHeader() : null;
      return (
        <ViewActual testID={props.testID || 'RNCalendar'}>
          {Header}
          <TouchableOpacityActual testID="onDayPress-trigger" onPress={() => props.onDayPress({ dateString: '2024-06-15' })} />
        </ViewActual>
      );
    },
  };
});

jest.mock('components/sales/Image', () => ({ iconName, testID }: any) => {
  const { View: ViewActual } = require('react-native');
  return <ViewActual testID={testID || `image-${iconName}`} />;
});

jest.mock('./CustomCalendar.styles', () => ({
  calenderView: {},
  headerContainer: { flexDirection: 'row' },
  navButtons: { flexDirection: 'row' },
  doubleArrow: {},
  monthTitle: {},
}));

describe('Test for the component CustomCalendar', () => {
  const onDateSelectedMock = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render component CustomCalendar with default props', () => {
    render(<CustomCalendar />);
    expect(screen.getByTestId('CustomCalendar')).toBeTruthy();
    // Default system time is June 2024
    expect(screen.getByText(/June 2024/i)).toBeTruthy();
  });

  test('render component with defaultDate', () => {
    render(<CustomCalendar defaultDate="2024-01-01" />);
    expect(screen.getByText(/January 2024/i)).toBeTruthy();
  });

  test('updates selected date and current month when currentDate prop changes (useEffect)', () => {
    const { rerender } = render(<CustomCalendar currentDate="2024-06-01" />);
    expect(screen.getByText(/June 2024/i)).toBeTruthy();

    rerender(<CustomCalendar currentDate="2024-12-25" />);
    expect(screen.getByText(/December 2024/i)).toBeTruthy();
  });

  test('handles onDayPress and updates internal state', () => {
    render(<CustomCalendar onDateSelected={onDateSelectedMock} />);

    const trigger = screen.getByTestId('onDayPress-trigger');
    fireEvent.press(trigger);

    expect(onDateSelectedMock).toHaveBeenCalledWith({ dateString: '2024-06-15' });
  });

  test('navigates months back and forth', () => {
    render(<CustomCalendar defaultDate="2024-06-01" />);

    expect(screen.getByText(/June 2024/i)).toBeTruthy();

    // Next Month
    const nextMonthBtn = screen.getByTestId('image-icons/icons_iconRight.png');
    fireEvent.press(nextMonthBtn);
    expect(screen.getByText(/July 2024/i)).toBeTruthy();

    // Previous Month
    const prevMonthBtn = screen.getByTestId('image-icons/icons_iconLeft.png');
    fireEvent.press(prevMonthBtn);
    expect(screen.getByText(/June 2024/i)).toBeTruthy();
  });

  test('navigates years back and forth (changeMonth +/- 12)', () => {
    render(<CustomCalendar defaultDate="2024-06-01" />);

    expect(screen.getByText(/June 2024/i)).toBeTruthy();

    // Next Year
    const nextYearBtn = screen.getByText('>>');
    fireEvent.press(nextYearBtn);
    expect(screen.getByText(/June 2025/i)).toBeTruthy();

    // Previous Year
    const prevYearBtn = screen.getByText('<<');
    fireEvent.press(prevYearBtn);
    expect(screen.getByText(/June 2024/i)).toBeTruthy();
  });

  test('applies customTheme when isDateRangePicker is true', () => {
    render(<CustomCalendar isDateRangePicker />);

    // Check if the mock was called with the dateRangePicker theme
    const callProps = mockCalendarProps.mock.calls[0][0];
    expect(callProps.theme['stylesheet.day.basic']).toBeDefined();
  });

  test('does not apply customTheme when isDateRangePicker is false', () => {
    render(<CustomCalendar isDateRangePicker={false} />);

    const callProps = mockCalendarProps.mock.calls[0][0];
    expect(callProps.theme).toEqual({});
  });
});
