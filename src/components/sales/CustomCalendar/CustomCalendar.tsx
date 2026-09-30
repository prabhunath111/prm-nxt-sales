/**
 * In the component user can navigate to the year wise
 *
 * @module components/CustomCalendar
 * @memberof CommonComponent
 */

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DateData, Calendar as RNCalendar } from 'react-native-calendars';
import Image from 'components/sales/Image';
import { Colors, Sizing } from 'styles';
import { ICONS, PROPERTIES, STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import styles from './CustomCalendar.styles';

export type CalendarProps = {
  onDateSelected?: (day: ParentObject) => void;
  currentDate?: string;
  defaultDate?: string;
  minDate?: string;
  maxDate?: string;
  isDateRangePicker?: boolean;
};

const CustomCalendar = ({ onDateSelected, currentDate, defaultDate = '', minDate = '', maxDate = '', isDateRangePicker, ...props }: CalendarProps) => {
  const initDate = new Date(defaultDate || new Date()).toISOString().substring(0, 10);
  const [selected, setSelected] = useState(initDate);
  const [currentMonth, setCurrentMonth] = useState(new Date(initDate));

  useEffect(() => {
    if (currentDate) {
      setSelected(currentDate);
      setCurrentMonth(new Date(currentDate));
    }
  }, [currentDate]);

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

  const customTheme: ParentObject = isDateRangePicker
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

  const changeMonth = (months: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + months);
    setCurrentMonth(newDate);
  };

  const formatMonth = (date: Date) => date.toLocaleDateString(STRINGS.CALENDAR_FORMAT, PROPERTIES.CUSTOM_CALENDAR);

  return (
    <RNCalendar
      key={currentMonth.toISOString().substring(0, 7)}
      style={styles.calenderView}
      markedDates={marked}
      minDate={minDate}
      maxDate={maxDate}
      current={currentMonth.toISOString().substring(0, 10)}
      theme={customTheme}
      onDayPress={(day: DateData) => {
        setSelected(day.dateString);
        onDateSelected?.(day);
      }}
      renderHeader={() => {
        const monthText = formatMonth(currentMonth);

        return (
          <View style={styles.headerContainer}>
            <View style={styles.navButtons}>
              <TouchableOpacity onPress={() => changeMonth(-12)}>
                <Text style={styles.doubleArrow}>{'<<'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Image iconName={ICONS.ICONLEFT} width={Sizing.layout.x25} height={Sizing.layout.x25} isDimension={false} />
              </TouchableOpacity>
            </View>
            <Text style={styles.monthTitle}>{monthText}</Text>
            <View style={styles.navButtons}>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Image iconName={ICONS.ICONRIGHT} width={Sizing.layout.x25} height={Sizing.layout.x25} isDimension={false} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeMonth(12)}>
                <Text style={styles.doubleArrow}>{'>>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
      hideArrows
      testID="CustomCalendar"
      {...props}
    />
  );
};

export default CustomCalendar;
