/**
 * The DatePicker component allows users to select a date from a calendar modal.
 *
 * @module components/DatePicker
 * @memberof - Common Component
 */
import React, { useState, useRef } from 'react';
import { View, Pressable } from 'react-native';
import Calendar from 'components/sales/Calendar';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import TextInput from 'components/sales/TextInput';
import Modal, { ModalPlacement } from 'components/sales/Modal';
import { formatDate, toISODate } from 'utils/dateHelper';
import { ICONS } from 'const';
import { Colors, Sizing } from 'styles';
import { isWeb } from 'utils/platformHelper';
import { ParentObject } from 'store/sales/types/common';
import styles from './DatePicker.styles';

/**
 * Represents the props for the DatePicker component.
 * @typedef {object} DatePickerProps
 * @property {Function} onDateSelected - Callback function invoked when a date is selected.
 * @property {boolean} [disabled] - Whether the DatePicker is disabled.
 * @property {object} [imgStyle] - Additional styles for the calendar icon.
 * @property {object} [inputStyle] - Additional styles for the text input.
 * @property {string} [error] - Error message to display.
 * @property {string} [id] - Unique identifier for the DatePicker component.
 * @property {string} [placeholder] - Placeholder text for the text input.
 * @property {object} [style] - Additional styles for the DatePicker container.
 * @property {object} [props] - Additional props to pass to the Calendar component.
 * @property {string} [value] - The initial value of the DatePicker.
 * @property {number} [modalHeight=Sizing.x350] - Height of the calendar modal.
 * @property {number} [modalWidth=Sizing.x250] - Width of the calendar modal.
 */

/**
 * Represents a callback function invoked when the date is selected.
 * @callback onDateSelected
 * @param {object} day - The selected date object.
 * @returns {void}
 */
export type DatePickerProps = {
  onDateSelected: (day: any) => void;
  disabled?: boolean;
  imgStyle?: object;
  inputStyle?: object;
  inputContainerStyle?: object;
  error?: string;
  id?: string;
  placeholder?: string;
  style?: object;
  props?: object;
  value?: string;
  defaultDate?: string;
  minDate?: string;
  maxDate?: string;
  modalHeight?: number;
  modalWidth?: number;
};

/**
 * Represents a DatePicker component.
 * @component
 * @param {DatePickerProps} props - The props for the DatePicker component.
 * @returns {JSX.Element} - The rendered DatePicker component.
 */

const CalendarImage = React.memo(({ imgStyle }: ParentObject) => (
  <Image iconName={ICONS.CALENDAR} style={[imgStyle]} height={Sizing.layout.x2} width={Sizing.layout.x2} isDimension />
));

const DatePicker = ({
  onDateSelected,
  disabled,
  imgStyle,
  inputStyle,
  inputContainerStyle,
  error = '',
  id,
  placeholder,
  value,
  defaultDate,
  minDate,
  maxDate,
  modalHeight = Sizing.x350,
  modalWidth = Sizing.x300,
  ...props
}: DatePickerProps) => {
  const [showModal, setShowModal] = useState(false);
  const popoverRef = useRef(null);

  const handleImagePress = () => {
    setShowModal(true);
  };

  const handleDateSelected = (day: any) => {
    setShowModal(false);
    const newDate = formatDate(day.timestamp);
    onDateSelected(newDate);
  };
  const placement = isWeb ? [ModalPlacement.BOTTOM, ModalPlacement.AUTO] : ModalPlacement.CENTER;

  return (
    <>
      <View style={[styles.inputContainer, inputContainerStyle]} testID="datepicker-test">
        <TextInput
          editable={!disabled}
          readOnly
          value={value}
          inputFieldStyle={[styles.inputField, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral.g300}
        />
        <Pressable onPress={handleImagePress} style={styles.iconButton} disabled={disabled} ref={popoverRef}>
          <CalendarImage imgStyle={imgStyle} />
        </Pressable>
      </View>
      <Modal
        modalTarget={popoverRef}
        isBackgroundBlurRequired={!isWeb}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        height={modalHeight}
        width={modalWidth}
        placementType={placement}
        arrowSize={styles.arrow}
      >
        <Calendar onDateSelected={handleDateSelected} defaultDate={defaultDate} minDate={minDate} maxDate={maxDate} currentDate={toISODate(value || '')} {...props} />
      </Modal>
      {error ? <Text id={`${id}error`} label={error} style={[styles.errorText]} color={Colors.error.primary} /> : null}
    </>
  );
};

export default DatePicker;
