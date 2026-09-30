/**
 * Calendar component for picking dates.
 * For more information, see https://www.npmjs.com/package/react-native-calendars
 * @module components/Calendar
 * @memberof CommonComponent
 */
import React, { useState, useEffect } from 'react';
import Image from 'components/sales/Image';
import { DateData, Calendar as RNCalendar } from 'react-native-calendars';
import { Colors, Sizing, Typography } from 'styles';
import { ALIGNMENT, ICONS } from 'const';
import { Direction } from 'react-native-calendars/src/types';
import Text from 'components/sales/Text';
import { handleIsValidDate } from 'utils/dateHelper';
import styles from './CalendarNew.styles';

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
  onDateSelected?: (day: DateData) => void;
  currentDate?: string;
  defaultDate?: string;
  isDateRangePicker?: boolean;
};

// Helper to format month name from Date object
const getMonthName = (date: Date): string => date.toLocaleString('default', { month: 'long' });

/**
 * Represents a Calendar component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns Calendar
 */
const CalendarNew = ({ onDateSelected, currentDate, defaultDate = '', isDateRangePicker, ...props }: CalendarProps) => {
  const initDate = handleIsValidDate(defaultDate);

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
      initialDate={currentDate}
      theme={customTheme}
      onDayPress={(day: DateData) => {
        setSelected(day.dateString);
        onDateSelected?.(day);
      }}
      markedDates={{
        [selected]: {
          customStyles: {
            container: styles.markedDate,
            text: styles.selectedText,
          },
        },
      }}
      markingType="custom"
      renderHeader={(dateObject: any) => {
        const date = new Date(dateObject.toString());
        return (
          <Text
            style={{
              fontSize: Sizing.layout.x18,
              fontWeight: Typography.fontWeight.x600,
              color: Colors.neutral.black,
              paddingVertical: Sizing.layout.x8,
            }}
          >
            {getMonthName(date)}
          </Text>
        );
      }}
      renderArrow={(direction: Direction) => {
        if (direction === ALIGNMENT.LEFT) return <Image iconName={ICONS.ICONLEFT} width={Sizing.layout.x15} height={Sizing.layout.x15} isDimension={false} style={styles.icon} />;
        if (direction === ALIGNMENT.RIGHT) return <Image iconName={ICONS.ICONRIGHT} width={Sizing.layout.x15} height={Sizing.layout.x15} isDimension={false} style={styles.icon} />;
        return null;
      }}
      testID="calendar-test"
      {...props}
      minDate={new Date().toISOString().split('T')[0]}
    />
  );
};

export default CalendarNew;
