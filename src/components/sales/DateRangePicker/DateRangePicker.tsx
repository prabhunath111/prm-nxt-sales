import React, { useState } from 'react';
import { View } from 'react-native';
import Calendar from 'components/sales/Calendar';
import Text from 'components/sales/Text';
import TextInput from 'components/sales/TextInput';
import { calculatePastDaysDifference, formatDateISO, formatDateToISO, getCurrentDateFormatted } from 'utils/dateHelper';
import { Colors } from 'styles';
import Button from 'components/sales/Button';
import { useTranslation } from 'react-i18next';
import { PROPERTIES, STYLES } from 'const';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import actions from 'store/sales/actions/common';
import uiActions from 'store/sales/actions/ui';
import styles from './DateRangePicker.styles';

export type CustomDatePickerProps = {
  error?: string;
  id?: string;
  placeholder?: string;
  style?: object;
  props?: object;
  customMaxDate?: Date;
  customMinDate?: Date;
  isMultiDates: boolean;
  defaultDateSelection?: number;
  maxDateCount: number;
};

const DateRangePicker = ({ error = '', id, placeholder, customMaxDate, customMinDate, isMultiDates, defaultDateSelection, maxDateCount, ...props }: CustomDatePickerProps) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const maxDate = customMaxDate || new Date();
  const minDate = (() => {
    if (customMinDate) return customMinDate;
    if (defaultDateSelection) {
      const d = new Date(maxDate);
      d.setDate(d.getDate() - defaultDateSelection);
      return d;
    }
    return new Date('1900-01-01');
  })();

  const formatDisplayDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Helper function to calculate the maximum allowed end date based on start date and maxDateCount
  const getMaxAllowedEndDate = (startDateString: string): Date => {
    const startDateObj = new Date(startDateString);
    const maxAllowedEndDate = new Date(startDateObj);
    maxAllowedEndDate.setDate(startDateObj.getDate() + (maxDateCount - 1));
    return maxAllowedEndDate;
  };

  const getDisplayEndDate = (): string => {
    if (endDate) {
      return formatDisplayDate(endDate);
    }

    if (startDate && maxDateCount && isMultiDates) {
      const maxAllowedEndDate = getMaxAllowedEndDate(startDate);
      const maxDateISO = formatDateISO(maxDate);
      if (maxDateISO) {
        const originalMaxDate = new Date(maxDateISO);
        const displayDate = maxAllowedEndDate < originalMaxDate ? maxAllowedEndDate : originalMaxDate;
        return getCurrentDateFormatted(displayDate);
      }
    }

    return getCurrentDateFormatted(maxDate);
  };

  const handleDateSelected = (day: any) => {
    const selectedISO = day.dateString;

    if (!isMultiDates) {
      setStartDate(selectedISO);
      setEndDate(formatDateToISO(new Date()));
      return;
    }
    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedISO);
      setEndDate('');
    } else if (!endDate) {
      if (new Date(selectedISO) < new Date(startDate)) {
        setStartDate(selectedISO);
        return;
      }
      if (maxDateCount && isMultiDates) {
        const maxAllowedEndDate = getMaxAllowedEndDate(startDate);
        const selectedDate = new Date(selectedISO);

        if (selectedDate > maxAllowedEndDate) {
          setEndDate(formatDateToISO(maxAllowedEndDate));
        } else {
          setEndDate(selectedISO);
        }
      } else {
        setEndDate(selectedISO);
      }
    }
  };

  const handleButtonPress = (type: string) => {
    // Default to current date if either end is not selected
    const currentDateISO = formatDateToISO(new Date());
    if (type === PROPERTIES.EVD_MDN_CHANGE_DETAILS.clear) {
      setStartDate('');
      setEndDate('');
      dispatch(actions.resetCustomFormData());
    } else if (type === PROPERTIES.EVD_MDN_CHANGE_DETAILS.select) {
      if (isMultiDates) {
        let finalEndDate = endDate || currentDateISO;

        // Apply maxDateCount limit if specified
        if (maxDateCount && startDate) {
          const maxAllowedEndDate = getMaxAllowedEndDate(startDate);
          const currentEndDate = new Date(finalEndDate);

          if (currentEndDate > maxAllowedEndDate) {
            finalEndDate = formatDateToISO(maxAllowedEndDate);
          }
        }

        dispatch(
          actions.setCustomFormData({
            evdMdnChangeFilter: {
              customDateRange: {
                startDate: formatDisplayDate(startDate),
                endDate: formatDisplayDate(finalEndDate),
              },
            },
          }),
        );
      } else {
        const formattedStartDate = formatDisplayDate(startDate);
        const daysDifference = calculatePastDaysDifference(formattedStartDate);
        if (!Number.isNaN(daysDifference)) {
          dispatch(
            actions.setCustomFormData({
              evdMdnChangeFilter: {
                customDateRange: daysDifference + 1,
                type: PROPERTIES.EVD_MDN_CHANGE_DETAILS.select,
              },
            }),
          );
        } else {
          // Handle the case when the date format is invalid
          return;
        }
      }
      dispatch(uiActions.hideBottomModal());
    }
  };

  // Calculate dynamic max date for calendar when start date is selected and maxDateCount is specified
  const getCalendarMaxDate = () => {
    if (maxDateCount && isMultiDates && startDate && !endDate) {
      const maxAllowedEndDate = getMaxAllowedEndDate(startDate);
      const maxDateISO = formatDateISO(maxDate);

      if (maxDateISO) {
        const originalMaxDate = new Date(maxDateISO);
        return formatDateISO(maxAllowedEndDate < originalMaxDate ? maxAllowedEndDate : originalMaxDate);
      }
    }
    return formatDateISO(maxDate);
  };

  return (
    <View style={styles.inputContainer} testID="date-range-picker-test">
      <TextInput
        readOnly
        value={`${startDate ? formatDisplayDate(startDate) : 'dd/mm/yyyy'} - ${getDisplayEndDate()}`}
        inputFieldStyle={[styles.inputField]}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral.g300}
      />

      <Calendar
        onDateSelected={handleDateSelected}
        defaultDate={formatDateISO(maxDate) || ''}
        minDate={formatDateISO(minDate) || ''}
        maxDate={getCalendarMaxDate() || ''}
        currentDate={startDate}
        isDateRangePicker
        {...props}
      />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.marginRight}
          label={t('strings.clear')}
          labelStyle={styles.buttonLabelStyle}
          onPress={() => handleButtonPress(PROPERTIES.EVD_MDN_CHANGE_DETAILS.clear)}
          type={STYLES.TYPE.SECONDARY}
          outline
        />
        <Button
          style={styles.marginRight}
          label={t('strings.selectDate')}
          labelStyle={styles.buttonLabelStyle}
          onPress={() => handleButtonPress(PROPERTIES.EVD_MDN_CHANGE_DETAILS.select)}
        />
      </View>
      {error ? <Text id={`${id}error`} label={error} style={styles.errorText} color={Colors.error.primary} /> : null}
    </View>
  );
};

export default DateRangePicker;
