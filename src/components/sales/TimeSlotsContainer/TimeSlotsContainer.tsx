/**
 * The DatePicker component allows users to select a date from a calendar modal.
 *
 * @module components/DatePicker
 * @memberof - Common Component
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import { FORMS, ICONS, QUERY, ROUTE, STRINGS } from 'const';
import { Colors, Sizing } from 'styles';
import { ParentObject } from 'store/sales/types/common';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import commonAction from 'store/sales/actions/common';
import Button from 'components/sales/Button';
import actions from 'store/sales/actions/etskRegSchedular';
import { getTwelveHourFormat } from 'utils/dateHelper';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { getScreenWidth } from 'styles/dimentionHelper';
import { callAction } from 'utils/formBuilderHelper';
import styles from './TimeSlotsContainer.styles';

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
export type TimeSlotsProps = {
  disabled?: boolean;
  imgStyle?: object;
  inputContainerStyle?: object;
  error?: string;
  id?: string;
};

/**
 * Represents a DatePicker component.
 * @component
 * @param {DatePickerProps} props - The props for the DatePicker component.
 * @returns {JSX.Element} - The rendered DatePicker component.
 */

const CalendarImage = React.memo(({ imgStyle }: ParentObject) => (
  <Image iconName={ICONS.CALENDAR_PINK} style={[imgStyle]} height={Sizing.layout.x2} width={Sizing.layout.x2} isDimension />
));

const TimeSlotsContainer = ({ disabled, imgStyle, inputContainerStyle, error = '', id }: TimeSlotsProps) => {
  const popoverRef = useRef(null);

  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const { timeSlotsData } = useSelector((state: RootState) => state.etskRegSchedular);
  const { date } = useSelector((state: RootState) => state.etskRegSchedular);
  const { errorMessage } = useSelector((state: RootState) => state.common);
  const { routeName } = useCurrentRoute();
  const screenWidth = getScreenWidth();
  const isMobileView = screenWidth <= Sizing.layout.x500;

  const handleRechargeDetails = (recharge: string) => {
    switch (routeName) {
      case ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY:
      case ROUTE.WEB.RE_PUSH_ORDER_SUMMARY:
        dispatch(actions.rechargeDetails(FORMS.primaryRechargeDetails, recharge));
        break;
      case ROUTE.WEB.ETSK_MULTI_TV_SUMMARY:
        dispatch(actions.rechargeDetails(FORMS.etskMultiTvRechargeDetails, recharge));
        break;
      case ROUTE.WEB.ETSK_REPUSH_SUMMARY:
        dispatch(actions.rechargeDetails(FORMS.eTSKRepushRechargeDetails, recharge));
        break;

      case ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY:
        dispatch(actions.rechargeDetails(FORMS.multiTvRechargeDetails, recharge));
        break;

      case ROUTE.WEB.WO_RECREATION_SUMMARY:
        dispatch(callAction({ recharge }, QUERY.WoRechargeDetails));

        break;
      default:
        dispatch(actions.rechargeDetails(FORMS.rechargeDetails, recharge));
        break;
    }
  };

  const handleInstallationDetails = () => {
    dispatch(actions.installationDetails());
  };

  useEffect(() => {
    switch (routeName) {
      case ROUTE.WEB.WO_RECREATION_SUMMARY:
      case ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY:
      case ROUTE.WEB.RE_PUSH_ORDER_SUMMARY:
        dispatch(actions.pickPackAndGetSlotPrimaryAndSecondary());
        break;

      case ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY:
        dispatch(actions.pickPackAndGetSlotSecondary());
        break;

      default:
        dispatch(commonAction.reSetErrorMessage());
        dispatch(actions.GetETSKSlot());
        break;
    }
  }, []);

  useEffect(() => {
    const defaultTimeSlot = `${timeSlotsData?.slotSuggestions?.[0]?.start} - ${timeSlotsData?.slotSuggestions?.[0]?.end}`;
    if (timeSlotsData?.slotSuggestions?.[0]?.start && timeSlotsData?.slotSuggestions?.[0]?.end) {
      dispatch(actions.handleEtskTimeSlots(defaultTimeSlot));
    }
  }, [timeSlotsData?.slotSuggestions]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isModalLoading } = useSelector((state: RootState) => state.ui);

  return (
    <View>
      <Text style={styles.title}>{t(`strings.date`)}</Text>
      <View style={[styles.inputContainer, inputContainerStyle]} testID="timeSlotsContainer-test">
        <Pressable onPress={handleInstallationDetails} style={styles.iconButton} disabled={disabled} ref={popoverRef}>
          <CalendarImage imgStyle={imgStyle} />
        </Pressable>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <Text style={[styles.title, { marginTop: Sizing.layout.x10 }]}>{t(`strings.time`)}</Text>
      <ScrollView style={styles.contentContainer}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {isModalLoading ? (
          <ActivityIndicator color={Colors.appColors.pink} />
        ) : (
          <FlatList
            data={timeSlotsData?.slotSuggestions || []}
            renderItem={({ item, index }) => (
              <Pressable
                style={[styles.timeSlotContainer, { borderColor: selectedIndex === index ? Colors.appColors.pink : Colors.neutral.g250 }]}
                onPress={() => {
                  setSelectedIndex(index);
                  const timeSlotPayload = `${item.start} - ${item.end}`;
                  dispatch(actions.handleEtskTimeSlots(timeSlotPayload));
                }}
              >
                <Text
                  style={[styles.timeSlotText, { color: selectedIndex === index ? Colors.appColors.pink : Colors.neutral.black }]}
                >{`${getTwelveHourFormat(item.start)} - ${getTwelveHourFormat(item.end)}`}</Text>
              </Pressable>
            )}
            numColumns={isMobileView ? 1 : 2}
          />
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.marginRight}
          label={t('strings.proceedRecharge')}
          onPress={() => handleRechargeDetails(STRINGS.NO)}
          labelStyle={styles.buttonLabel}
          disabled={errorMessage}
        />
        {/* removing the button as Jeevan asked not to add this button Proceed Without recharge */}
      </View>
      {error ? <Text id={`${id}error`} label={error} style={[styles.errorText]} color={Colors.error.primary} /> : null}
    </View>
  );
};

export default TimeSlotsContainer;
