/**
 * This is a component where we can select start date and end date
 *
 * @module components/SelectDaterange
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Colors, Sizing } from 'styles';
import Text from 'components/sales/Text';
import IconTextInput from 'components/sales/IconTextInput';
import { CHILD_TYPE, ICONS } from 'const';
import actions from 'store/sales/actions/common';
import { callAction } from 'utils/formBuilderHelper';
import uiActions from 'store/sales/actions/ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { useTranslation } from 'react-i18next';
import styles from './SelectDaterange.styles';

/**
 * Component type definitions
 *
 * @typedef {object} SelectDaterangeProps
 * @property {string} [text] - The content for the component
 */

export type SelectDaterangeProps = {
  error?: string;
  onValueChange?: (selectedValues: { startDate: string; endDate: string }[] | string) => void;
  placeholder?: string;
  queryName?: string;
};

/**
 * Represents a SelectDaterange component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered SelectDaterange component
 *
 * @example
 * <SelectDaterange text="Hello World!" />
 */

const SelectDaterange = ({ error, queryName, onValueChange, placeholder }: SelectDaterangeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [_selectedDates, setSelectedDates] = useState([{ startDate: '', endDate: '' }]);
  const { customFormData } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation();

  const date = customFormData?.evdMdnChangeFilter?.customDateRange;

  useEffect(() => {
    if (Number(date)) {
      dispatch(actions.resetCustomFormData());
    }
    if (date) {
      const { startDate, endDate } = date;

      if (startDate && endDate) {
        const updatedDate = [{ startDate, endDate }];
        setSelectedDates(updatedDate);
        onValueChange?.(updatedDate);

        if (queryName) {
          dispatch(callAction(updatedDate, queryName));
        }
      } else {
        setSelectedDates([]);
        onValueChange?.('');
      }
    }
  }, [date]);

  const handleSelection = () => {
    dispatch(actions.resetCustomFormData());
    dispatch(uiActions.clearLoader());
    dispatch(uiActions.hideBottomModal());
    setTimeout(() => {
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.CUSTOM_DATE_PICKER,
          headerTitle: t(`strings.customDate`),
          showCloseIcon: true,
          showHeader: true,
          buttonInfo: {
            isDateRangePicker: true,
            isMultiDates: true,
            maxDateCount: Sizing.x32,
          },
        }),
      );
    }, Sizing.x100);
  };
  return (
    <Pressable style={styles.container} onPress={() => handleSelection()}>
      <IconTextInput
        readOnly
        value={`${date?.startDate || 'dd/mm/yyyy'} - ${date?.endDate || 'dd/mm/yyyy'}`}
        containerStyle={styles.inputFieldContainer}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral.g300}
        rightIconName={ICONS.CALENDAR_PINK}
        onIconPress={() => handleSelection()}
      />
      {error && <Text style={styles.errorText} label={error} color={Colors.error.primary} />}
    </Pressable>
  );
};

export default SelectDaterange;
