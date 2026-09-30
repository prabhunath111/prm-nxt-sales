import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Colors } from 'styles';
import { Text, IconTextInput } from 'components/sales';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/common';
import uiActions from 'store/sales/actions/ui';
import { CHILD_TYPE, ICONS, PROPERTIES, STRINGS } from 'const';
import { SPACE_REGEX_GLOBAL } from 'const/regexes';
import styles from './SelectDate.styles';

const formatDate = (date: Date): string => date.toLocaleDateString(STRINGS.DATE_FORMAT, PROPERTIES.SELECT_DATE).replace(SPACE_REGEX_GLOBAL, '-');

export type SelectDateProps = {
  error?: string;
  onValueChange?: (selectedDate: string) => void;
  placeholder?: string;
};

const SelectDate = ({ error, onValueChange, placeholder }: SelectDateProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const state = useSelector((state: RootState) => state.storeDashboard);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));

  const date = state?.selectedDate;

  useEffect(() => {
    if (date) {
      const d = new Date(date);
      const formatted = formatDate(d);
      setSelectedDate(formatted);
      onValueChange?.(formatted);
    } else {
      const today = formatDate(new Date());
      setSelectedDate(today);
      onValueChange?.(today);
    }
  }, [date]);

  const handleSelection = () => {
    dispatch(actions.resetCustomFormData());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.SIMPLE_CALENDER,
        headerTitle: t('strings.selectDate'),
        showHeader: true,
        buttonInfo: {
          isMultiDates: false,
        },
      }),
    );
  };
  return (
    <Pressable style={styles.container} onPress={handleSelection} testID="SelectDate">
      <View style={styles.inputWrapper}>
        <IconTextInput
          readOnly
          value={selectedDate}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral.g300}
          leftIconName={ICONS.CALENDAR_PINK}
          containerStyle={styles.iconInputContainer}
        />
      </View>
      {error && <Text label={error} color={Colors.error.primary} />}
    </Pressable>
  );
};

export default SelectDate;
