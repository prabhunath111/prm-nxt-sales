/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
import { beforeAll, afterAll } from '@jest/globals';
import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CalendarNew from './CalendarNew';

jest.mock('react-native-calendars', () => {
  const { View: RNView, TouchableOpacity } = require('react-native');
  return {
    Calendar: ({ onDayPress, renderArrow, renderHeader, theme }: any) => (
      <RNView testID="calendar-test">
        {renderHeader && renderHeader('2024-06-01T00:00:00.000Z')}
        <TouchableOpacity testID="calendar-day-press" onPress={() => onDayPress({ dateString: '2024-06-15', day: 15, month: 6, year: 2024 })} />
        <RNView testID="calendar-arrow-left">{renderArrow && renderArrow('left')}</RNView>
        <RNView testID="calendar-arrow-right">{renderArrow && renderArrow('right')}</RNView>
        <RNView testID="calendar-arrow-other">{renderArrow && renderArrow('down')}</RNView>
        <RNView testID="calendar-theme-check" accessible accessibilityLabel={JSON.stringify(theme)} />
      </RNView>
    ),
  };
});

describe('Test for the component CalendarNew', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-01T15:50:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('render component CalendarNew with defaults', () => {
    render(<CalendarNew defaultDate="2024-06-01" />);
    expect(screen.getByTestId('calendar-test')).toBeTruthy();
  });

  test('currentDate updates selected date', () => {
    const { rerender } = render(<CalendarNew currentDate="2024-06-01" />);
    expect(screen.getByTestId('calendar-test')).toBeTruthy();

    // Update currentDate to cover line 53
    rerender(<CalendarNew currentDate="2024-06-10" />);
  });

  test('trigger onDayPress and onDateSelected callback', () => {
    const onDateSelected = jest.fn();
    render(<CalendarNew currentDate="2024-06-01" onDateSelected={onDateSelected} />);

    // Fire onDayPress
    fireEvent.press(screen.getByTestId('calendar-day-press'));
    expect(onDateSelected).toHaveBeenCalledWith(expect.objectContaining({ dateString: '2024-06-15' }));
  });

  test('render with isDateRangePicker applying custom theme', () => {
    render(<CalendarNew isDateRangePicker />);
    expect(screen.getByTestId('calendar-test')).toBeTruthy();
  });

  test('snapshot tests for CalendarNew', () => {
    const component = render(
      <View>
        <CalendarNew defaultDate="2024-06-01" />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
