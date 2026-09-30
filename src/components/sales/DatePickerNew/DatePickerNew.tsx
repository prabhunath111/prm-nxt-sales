import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Text from 'components/sales/Text';
import { formatDateISO, formatDateToISO } from 'utils/dateHelper';
import { Colors } from 'styles';
import Button from 'components/sales/Button';
import { useTranslation } from 'react-i18next';
import { STYLES } from 'const';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import CalendarNew from 'components/sales/CalendarNew';
import actions from 'store/sales/actions/etskRegSchedular';
import uiActions from 'store/sales/actions/ui';
import styles from './DatePickerNew.styles';

export type CustomDatePickerProps = {
  error?: string;
  id?: string;
  style?: object;
  props?: object;
  customMaxDate?: Date;
  customMinDate?: Date;
  isMultiDates: boolean;
  defaultDateSelection?: number;
};

const DatePickerNew = ({ error = '', id, customMaxDate, customMinDate, isMultiDates, defaultDateSelection, ...props }: CustomDatePickerProps) => {
  const [startDate, setStartDate] = useState<string>('');
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const maxDate = customMaxDate || new Date();
  const minDate = customMinDate || new Date();
  const dateRange = defaultDateSelection || isMultiDates ? 90 : 31;
  minDate.setDate(maxDate.getDate() - dateRange);

  const handleDateSelected = (day: any) => {
    const selectedISO = day.dateString;
    dispatch(actions.handleEtskScheduleDate(selectedISO));
  };

  useEffect(() => {
    const currentDateISO = formatDateToISO(new Date());
    setStartDate(currentDateISO);
    dispatch(actions.handleEtskScheduleDate(currentDateISO));
  }, []);

  return (
    <View style={styles.inputContainer} testID="date-picker-new">
      <Text style={styles.title}>{t(`strings.date`)}</Text>
      <CalendarNew onDateSelected={handleDateSelected} defaultDate={formatDateISO(maxDate) || ''} currentDate={startDate} isDateRangePicker {...props} />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.marginRight}
          label={t('strings.timeSlot')}
          onPress={() => {
            dispatch(actions.installationTimeSlots());
          }}
        />
        <Button
          style={styles.marginRight}
          label={t('strings.cancel')}
          onPress={() => {
            dispatch(uiActions.hideBottomModal());
          }}
          type={STYLES.TYPE.SECONDARY}
          outline
        />
      </View>
      {error ? <Text id={`${id}error`} label={error} style={styles.errorText} color={Colors.error.primary} /> : null}
    </View>
  );
};

export default DatePickerNew;
