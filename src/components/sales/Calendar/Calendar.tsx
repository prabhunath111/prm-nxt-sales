/**
 * Calendar component for picking dates.
 * For more information, see https://www.npmjs.com/package/react-native-calendars
 * @module components/Calendar
 * @memberof CommonComponent
 */
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'components/sales/Image';
import { DateData, Calendar as RNCalendar } from 'react-native-calendars';
import { Colors, Sizing } from 'styles';
import { ICONS } from 'const';
import { Direction } from 'react-native-calendars/src/types';
import styles from './Calendar.styles';

/**
 * Props for the Calendar component.
 * @typedef {object} CalendarProps
 * @property {function} [onDateSelected] - Callback function invoked when a date is selected.
 * @property {string} [currentDate] - The currently selected date in ISO format (YYYY-MM-DD).
 */

/**
 * Represents a callback function invoked when the date is selected.
 * @callback onDateSelected
 * @param {object} day - The selected date object.
 * @returns {void}
 */
export type CalendarProps = {
  onDateSelected?: (day: any) => void;
  currentDate?: string;
  defaultDate?: string;
  minDate?: string;
  maxDate?: string;
  isDateRangePicker?: boolean;
};

/**
 * Represents a Calendar component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns Calendar
 */
const Calendar = ({ onDateSelected, currentDate, defaultDate = '', minDate = '', maxDate = '', isDateRangePicker, ...props }: CalendarProps) => {
  const initDate = new Date(defaultDate).toISOString().substring(0, 10);

  const [selected, setSelected] = useState(initDate);
  useEffect(() => {
    if (currentDate) {
      setSelected(currentDate);
    }
  }, [currentDate]);
  useEffect(() => {
    if (defaultDate) {
      setSelected(defaultDate);
    }
  }, []);
  const marked = useMemo(
    () => ({
      [selected]: {
        selected: true,
        selectedColor: Colors.neutral.black,
        selectedTextColor: Colors.neutral.white,
      },
    }),
    [selected],
  );

  const customTheme: any = isDateRangePicker
    ? {
        'stylesheet.day.basic': {
          base: {
            width: Sizing.layout.x24,
            height: Sizing.layout.x24,
            alignItems: 'center',
            justifyContent: 'center',
            margin: -Sizing.layout.x5,
          },
        },
      }
    : {};

  return (
    <RNCalendar
      style={styles.calenderView}
      markedDates={marked}
      minDate={minDate}
      maxDate={maxDate}
      initialDate={currentDate}
      theme={customTheme}
      onDayPress={(day: DateData) => {
        setSelected(day.dateString);
        onDateSelected?.(day);
      }}
      renderArrow={(direction: Direction) => {
        if (direction === 'left') return <Image iconName={ICONS.ICONLEFT} width={Sizing.layout.x25} height={Sizing.layout.x25} isDimension={false} />;
        if (direction === 'right') return <Image iconName={ICONS.ICONRIGHT} width={Sizing.layout.x25} height={Sizing.layout.x25} isDimension={false} />;
        return null;
      }}
      testID="calendar-test"
      {...props}
    />
  );
};

export default Calendar;
