/**
 * TO raise customer request
 *
 * @module components/RaiseTheRequest
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Dropdown, FormHeader, InformationText, Text, TextInput, DatePicker, MultipleSubId } from 'components/sales';
import { ALERT, CHILD_TYPE, FIELD_TYPE, FORMS, MODAL, PROPERTIES, QUERY, STYLES, SUBSCRIBER_STATUS, VALIDATIONS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { useTranslation } from 'react-i18next';
import { Colors, Sizing } from 'styles';
import customerService from 'store/sales/actions/customerService';
import { sliceActions as customerServiceActions } from 'store/sales/reducer/customerService';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { DataItem } from 'components/sales/Dropdown';
import { CategoryProps } from 'store/sales/types/customerService';
import { checkFixLength, checkMaxLength, checkMinLength } from 'utils/formBuilderHelper';
import { formatDateToISO, formatDateISO, formatISODate, getCurrentDateFormatted, toUSDate, addHoursToTime } from 'utils/dateHelper';
import { LOG } from 'config/logger';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { closeWebView } from 'utils/navigationHelper';
import { useEnglishInputValidation } from 'hooks/useEngInputValidation';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './RaiseTheRequest.styles';

/**
 * Represents a RaiseTheRequest component
 *
 * @returns {JSX.Element} The rendered RaiseTheRequest component
 *
 * @example
 * <RaiseTheRequest text="Hello World!" />
 */

const RaiseTheRequest = () => {
  const { t } = useTranslation();
  const { goHome } = useNavigate();
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);

  const defaultValues = {
    requestObject: {
      natureOfRequest: { name: t('strings.natureOfRequest') },
      typeOfRequest: { name: t('strings.typeOfRequest') },
      suspensionReason: { name: t('strings.suspensionReason') },
      selectDate: { name: t('strings.selectDate') },
      selectTime: { name: t('strings.selectTime') },
      descriptionMaxValue: Sizing.layout.x700,
      subscriberInfo: '',
    },
    values: {
      selectDate: '',
      selectTime: '',
      reason: '',
      suspensionDate: '',
      resumptionDate: '',
      preferredDate: '',
      subscriberInfo: '',
    },
  };

  const [requestObject, setRequestObject] = useState<ParentObject>(defaultValues.requestObject);
  const [values, setValues] = useState<ParentObject>(defaultValues.values);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [conditionalElements, setConditionalElements] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { accountInfo, messages, categories, allCategoryInfo, subCategories, suspensionReason, availableSlot, slotSuggestions, slotDate, slotTime, taskId } = useSelector(
    (state: RootState) => state.customerService,
  );

  type InputChangeProps = {
    name: string;
    value: any;
    queryName?: string;
    fieldType?: string;
    queryParam?: string | undefined;
  };

  const subscriberId = accountInfo.subId || requestObject.subId || requestObject.subscriberInfo;

  useEffect(() => {
    if (subscriberId) {
      setValues((prev) => ({
        ...prev,
        subscriberInfo: subscriberId,
      }));
      setRequestObject((prev) => ({
        ...prev,
        subscriberInfo: subscriberId,
      }));
    }
  }, [subscriberId]);

  const resetForm = () => {
    setValues(defaultValues.values);
    setRequestObject(defaultValues.requestObject);
    setConditionalElements('');
    dispatch(customerService.resetRaiseRequest());
  };

  const handleSlotSelection = () => {
    if (availableSlot?.slotDate) {
      setValues((prevState) => ({
        ...prevState,
        preferredDate: String(availableSlot?.slotDate),
      }));
    }
  };

  useEffect(() => {
    // Update `preferredDate` when `slotSuggestions` changes
    handleSlotSelection();
  }, [availableSlot]);

// reset form on unmount
  useEffect(() => {
    // This will run when the component mounts
    setValues (defaultValues.values);
    dispatch(formActions.setSubIdListDefault());

    // Cleanup function: this will run when the component unmounts
    return () => {
      resetForm();
    };
  }, []); // Empty dependency array means this runs only once on mount and unmount

  const resetDropdown = (name: string, fieldType: string = FIELD_TYPE.DROPDOWN) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: null,
    }));
    setRequestObject((prevValues) => ({
      ...prevValues,
      [name]: fieldType === FIELD_TYPE.DROPDOWN ? { name: t(`strings.${name}`) } : null,
    }));
  };

  const validateField = (fieldValues = values) => {
    const formObject: ParentObject = PROPERTIES.RAISE_REQUEST.formValidation;
    const formModel: ParentObject = fieldValues;
    const formError: ParentObject = validationErrors;

    Object.keys(formObject).forEach((key) => {
      if (key in formModel && formObject[key]?.validation) {
        formObject[key].validation.forEach((obj: ParentObject) => {
          switch (obj.type) {
            case VALIDATIONS.REQUIRED:
              formError[key] = formModel[key] ? '' : t(`validations.${obj.message}`);
              break;
            case VALIDATIONS.MIN_LENGTH:
              if (formModel[key]) {
                formError[key] = checkMinLength(formModel[key], obj.value) ? '' : t(`validations.${obj.message}`);
              }
              break;
            case VALIDATIONS.MAX_LENGTH:
              if (formModel[key]) {
                formError[key] = checkMaxLength(formModel[key], obj.value) ? '' : t(`validations.${obj.message}`);
              }
              break;
            case VALIDATIONS.FIX_LENGTH:
              if (formModel[key]) {
                formError[key] = checkFixLength(formModel[key], obj.value) ? '' : t(`validations.${obj.message}`);
              }
              break;
            default:
              break;
          }
        });
      }
    });

    setValidationErrors({
      ...formError,
    });

    if (formModel === values) {
      return Object.values(formError).every((x) => x === '');
    }

    return Object.keys(formModel).every((key) => formError[key] === '');
  };

  const setTextMaxValue = (maxValue: number = Sizing.layout.x700) => {
    // set description limit
    setRequestObject((prevValues) => ({
      ...prevValues,
      description: '',
      descriptionMaxValue: maxValue,
    }));
  };

  const handleChange = ({ name, value, fieldType, queryName = '', queryParam = '' }: InputChangeProps) => {
    const isEmpty = value === false || value === '' || value === undefined || value === null;
    // Function to handle changes for 'natureOfRequest'
    const handleNatureOfRequest = (value: DataItem) => {
      // Find the category object
      const selectedCategory = allCategoryInfo.find((item: CategoryProps) => item.categoryNT === String(value));

      // reset conditional element
      setConditionalElements('');

      // Check specific conditions for 'natureOfRequest'
      if (selectedCategory?.woTypeNT === PROPERTIES.RAISE_REQUEST.fieldRepair && value?.nameNT === PROPERTIES.RAISE_REQUEST.unableToViewServices) {
        resetDropdown(PROPERTIES.RAISE_REQUEST.natureOfRequest);
        dispatch(uiActions.showAlert(messages.frRestrictionMessage, ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
      } else if (value?.nameNT === PROPERTIES.RAISE_REQUEST.unableToViewServices) {
        // set description limit
        setTextMaxValue(Sizing.layout.x230);
        if (accountInfo.customerStatusNT === SUBSCRIBER_STATUS.DEACTIVATED) {
          dispatch(uiActions.showAlert(messages.frRestrictionMessage, ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
        } else {
          dispatch(uiActions.showAlert(messages.smsMessageFrWorkOrder, ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
        }
        if (accountInfo.ocsFlag === PROPERTIES.RAISE_REQUEST.ocsFlag) {
          setConditionalElements(accountInfo.customerStatusNT === SUBSCRIBER_STATUS.ACTIVE ? PROPERTIES.RAISE_REQUEST.requestOcsDateTime : '');
          resetDropdown(PROPERTIES.RAISE_REQUEST.selectTime);
        } else {
          setConditionalElements(accountInfo.customerStatusNT === SUBSCRIBER_STATUS.ACTIVE ? PROPERTIES.RAISE_REQUEST.requestDateTime : '');
          resetDropdown(PROPERTIES.RAISE_REQUEST.selectDate);
          resetDropdown(PROPERTIES.RAISE_REQUEST.selectTime);
        }
        if (accountInfo.ocsFlag === PROPERTIES.RAISE_REQUEST.ocsFlag) {
          // disabled preferred dates in calendar
          const minDate = new Date();
          const maxDate = new Date();
          maxDate.setDate(minDate.getDate() + PROPERTIES.RAISE_REQUEST.preferredMaxDate);
          setRequestObject((prevValues) => ({
            ...prevValues,
            preferredMinDate: formatDateISO(minDate),
            preferredMaxDate: formatDateISO(maxDate),
          }));
        }
      } else if (value?.nameNT === PROPERTIES.RAISE_REQUEST.accountUpdate) {
        // set description limit
        setTextMaxValue(Sizing.layout.x230);
      } else {
        // set description limit
        setTextMaxValue(Sizing.layout.x700);
      }

      // Dispatch action to fetch service subcategories
      if (queryName) {
        if (value?.nameNT === PROPERTIES.RAISE_REQUEST.unableToViewServices && accountInfo.customerStatusNT === SUBSCRIBER_STATUS.DEACTIVATED) {
          resetDropdown(PROPERTIES.RAISE_REQUEST.typeOfRequest);
          dispatch(customerService.resetSubCategories());
        } else {
          resetDropdown(PROPERTIES.RAISE_REQUEST.typeOfRequest);
          dispatch(customerService.getServiceSubCategories(queryParam ? { [queryParam]: value?.nameNT } : {}, queryName));
        }
      }

      // Dispatch action to fetch SlotDateForDropdown
      if (accountInfo.ocsFlag !== PROPERTIES.RAISE_REQUEST.ocsFlag && value?.nameNT === PROPERTIES.RAISE_REQUEST.unableToViewServices)
        dispatch(customerService.getSlotDateForDropdown({}, QUERY.GetSlotDateForDropdown));

      // disable suspension and resumption date
      if (value?.nameNT === PROPERTIES.RAISE_REQUEST.accountUpdate) {
        const todayDate = new Date();
        // Create a new date for the next day by adding 1 to the current day
        const suspensionMinDate = new Date(todayDate);
        suspensionMinDate.setDate(todayDate.getDate() + 1);

        // Correctly create a new Date object for `resumptionMinDate`
        const resumptionMinDate = new Date(todayDate);
        resumptionMinDate.setDate(todayDate.getDate() + 2);

        // Set the request object with properly formatted dates
        setRequestObject((prevValues) => ({
          ...prevValues,
          suspensionMinDate: formatDateISO(suspensionMinDate),
          resumptionMinDate: formatDateISO(resumptionMinDate),
        }));
      }
    };

    // Function to handle changes for 'typeOfRequest'
    const handleTypeOfRequest = (value: DataItem) => {
      const selectedCategory = allCategoryInfo.find((item: CategoryProps) => item.categoryNT === String(values.natureOfRequest) && item.subCategoryNT === String(value.nameNT));
      const statusArray = selectedCategory?.status.split(',') || [];
      if (statusArray.length > 0 && statusArray[0] !== '') {
        if (!statusArray.includes(accountInfo.customerStatusNT)) {
          resetDropdown(PROPERTIES.RAISE_REQUEST.typeOfRequest);
          const alertMessage = value?.nameNT === PROPERTIES.RAISE_REQUEST.resumption ? messages.subNotSuspended : messages.subNotActive;
          dispatch(uiActions.showAlert(alertMessage, ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
        }
      }

      if (value?.nameNT === PROPERTIES.RAISE_REQUEST.suspension) {
        if (queryName) {
          dispatch(customerService.getSuspensionReason(queryParam ? { [queryParam]: value?.nameNT } : {}, queryName));
        }
        setConditionalElements(accountInfo.customerStatusNT === SUBSCRIBER_STATUS.ACTIVE ? PROPERTIES.RAISE_REQUEST.suspension : '');
        resetDropdown(PROPERTIES.RAISE_REQUEST.suspensionReason);
        resetDropdown(PROPERTIES.RAISE_REQUEST.suspensionDate, FIELD_TYPE.DATE);
        resetDropdown(PROPERTIES.RAISE_REQUEST.resumptionDate, FIELD_TYPE.DATE);
      } else if (value?.nameNT === PROPERTIES.RAISE_REQUEST.resumption) {
        // Correctly create a new Date object for `resumptionMinDate`
        const suspensionDate = new Date();
        // Set the request object with properly formatted dates
        setValues((prevValues) => ({
          ...prevValues,
          suspensionDate: getCurrentDateFormatted(suspensionDate, 'mm/dd/yyyy'),
        }));
        setConditionalElements('');
      }
    };

    // Handle specific cases based on the field type
    const handleDropdownChange = (value: DataItem) => {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value.nameNT,
      }));

      setRequestObject((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      validateField({ [name]: value.nameNT });

      switch (name) {
        case PROPERTIES.RAISE_REQUEST.natureOfRequest:
          handleNatureOfRequest(value);
          break;

        case PROPERTIES.RAISE_REQUEST.typeOfRequest:
          handleTypeOfRequest(value);
          break;

        default:
          break;
      }
    };

    // Main function logic
    if (fieldType === FIELD_TYPE.DROPDOWN) {
      handleDropdownChange(value);
    } else if (fieldType === FIELD_TYPE.INPUT || fieldType === FIELD_TYPE.DATE || fieldType === FIELD_TYPE.MULTIPLE_SUB_ID) {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      setRequestObject((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      validateField({ [name]: value });
      if (isEmpty) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
    // disable resumption date when select suspension date
    if (fieldType === FIELD_TYPE.DATE && name === PROPERTIES.RAISE_REQUEST.suspensionDate) {
      // reset resumption
      resetDropdown(PROPERTIES.RAISE_REQUEST.resumptionDate, FIELD_TYPE.DATE);
      // Correctly create a new Date object for `suspensionDate`

      setValues((prevValues) => ({
        ...prevValues,
        [PROPERTIES.RAISE_REQUEST.resumptionDate]: '',
      }));

      const [day, month, year] = value.split('/').map(Number);
      const suspensionDate = new Date(year, month - 1, day);
      suspensionDate.setDate(suspensionDate.getDate() + 1);

      // Set the request object with properly formatted dates
      setRequestObject((prevValues) => ({
        ...prevValues,
        resumptionMinDate: formatDateToISO(suspensionDate),
      }));
    }
  };

  const {
    inputError, // eng input error
    onInputChange, // function call
  } = useEnglishInputValidation((text) => {
    handleChange({
      name: PROPERTIES.RAISE_REQUEST.description,
      value: text,
      fieldType: FIELD_TYPE.INPUT,
    });
  }, requestObject.description ?? '');

  const validateId = () => {
    const isValidation = validateField({ subscriberInfo: requestObject.subscriberInfo });
    setValues((prevValues) => ({
      ...prevValues,
      description: null,
    }));
    setRequestObject((prevValues) => ({
      ...prevValues,
      description: null,
    }));

    resetDropdown(PROPERTIES.RAISE_REQUEST.natureOfRequest);
    resetDropdown(PROPERTIES.RAISE_REQUEST.typeOfRequest);
    if (isValidation) {
      setValidationErrors({});
      setConditionalElements('');
      dispatch(customerService.resetRaiseRequest());
      const updatedValues: ParentObject = { ...values };
      if (updatedValues.subId) {
        updatedValues.subscriberInfo = updatedValues.subId;
        delete updatedValues.subId;
      }
      dispatch(customerService.getCustomerServiceInfo(updatedValues, QUERY.GetCustomerServiceInfo)).then((response: any) => {
        setValues((prevValues) => ({
          ...prevValues,
          subscriberId: response?.accountInfo?.subId,
        }));
      });
    }
  };

  const getAvailableSlot = (isEarliestSlot: boolean, prefDate: string) => {
    const isValidation = validateField({ subscriberInfo: requestObject.subscriberInfo });
    if (isValidation) {
      resetDropdown(PROPERTIES.RAISE_REQUEST.selectTime);
      const selectedCategory = allCategoryInfo.find((item: CategoryProps) => item.categoryNT === String(values.natureOfRequest));
      let date = prefDate;
      if (prefDate) date = toUSDate(date);

      const subscriberId = accountInfo.subId || requestObject.subId || requestObject.subscriberInfo;

      const requestSlot = {
        subscriberId,
        woType: selectedCategory?.woTypeNT,
        woSubType: selectedCategory?.woSubTypeNT,
        isEarliestSlot,
      };

      dispatch(customerService.getAvailableSlot({ ...requestSlot, prefDate: date }, QUERY.GetAvailableSlot));
    }
  };

  const finalSubmit = () => {
    // do validation for common fields
    const fieldToValidate = {
      subscriberInfo: values.subscriberInfo,
      natureOfRequest: values.natureOfRequest,
      typeOfRequest: values.typeOfRequest,
      description: values.description,
    };

    let response: any;

    // set common fields
    const selectedCategory = allCategoryInfo.find(
      (item: CategoryProps) => item.categoryNT === String(values.natureOfRequest) && item.subCategoryNT === String(values.typeOfRequest),
    );
    const input = {
      subscriberId: values.subId ? values.subId : values.subscriberId,
      woSubType: selectedCategory?.woSubTypeNT,
      woType: selectedCategory?.woTypeNT,
      description: values.description,
      slotStartTime: values.selectDate,
      slotEndTime: values.selectTime,
    };
    if (accountInfo.ocsFlag === PROPERTIES.RAISE_REQUEST.ocsFlag) {
      if (conditionalElements === PROPERTIES.RAISE_REQUEST.requestOcsDateTime) {
        const isValidation = validateField({ ...fieldToValidate, preferredDate: values.preferredDate, selectTime: values?.selectTime });
        if (isValidation && !inputError) {
          const slotIndex = availableSlot?.slotTimes?.findIndex((slot: ParentObject) => slot.id === requestObject?.selectTime?.id);
          const selectTime = slotSuggestions[slotIndex];
          LOG.info('raise request submit => 0', conditionalElements, { ...input, slotEndTime: selectTime?.end, slotStartTime: values.preferredDate, taskId: taskId.taskId }); // raise request submit 0 Added for debugging don't remove it
          response = dispatch(
            customerService.createServiceRequest({ ...input, slotEndTime: selectTime?.end, slotStartTime: selectTime.start, taskId: taskId.taskId }, QUERY.CreateFRWorkOrderOCS),
          );
        }
      } else if (conditionalElements === PROPERTIES.RAISE_REQUEST.suspension) {
        LOG.info('raise request submit => 1', conditionalElements, {
          ...input,
          subArea: selectedCategory?.subAreaNT,
          reason: values.reason,
          slotStartTime: formatISODate(toUSDate(values.suspensionDate)),
          slotEndTime: formatISODate(toUSDate(values.resumptionDate)),
        }); // raise request submit 1 Added for debugging don't remove it
        const isValidation = validateField({
          ...fieldToValidate,
          suspensionReason: values.suspensionReason,
          suspensionDate: values.suspensionDate,
          resumptionDate: values.resumptionDate,
        });
        if (isValidation && !inputError) {
          response = dispatch(
            customerService.createServiceRequest(
              {
                ...input,
                subArea: selectedCategory?.subAreaNT,
                reason: values.suspensionReason,
                slotStartTime: formatISODate(toUSDate(values.suspensionDate)),
                slotEndTime: formatISODate(toUSDate(values.resumptionDate)),
              },
              QUERY.CreateSRWorkOrder,
            ),
          );
        }
      } else {
        const isValidation = validateField({ ...fieldToValidate });
        LOG.info('raise request submit => 1.1', conditionalElements, {
          ...input,
          subArea: selectedCategory?.subAreaNT,
          reason: values.suspensionReason,
          ...(values.suspensionDate !== '' && { slotEndTime: formatISODate(values.suspensionDate) }),
          ...(values.resumptionDate !== '' && { slotStartTime: values.resumptionDate }),
        }); // raise request submit 1 Added for debugging don't remove it
        if (isValidation && !inputError) {
          response = dispatch(
            customerService.createServiceRequest(
              {
                ...input,
                subArea: selectedCategory?.subAreaNT,
                reason: values.reason,
                ...(values.suspensionDate !== '' && { slotEndTime: formatISODate(values.suspensionDate) }),
                ...(values.resumptionDate !== '' && { slotStartTime: values.resumptionDate }),
              },
              QUERY.CreateSRWorkOrder,
            ),
          );
        }
      }
    } else if (conditionalElements === PROPERTIES.RAISE_REQUEST.requestDateTime) {
      const isValidation = validateField({ ...fieldToValidate, selectDate: values.selectDate, selectTime: values.selectTime });
      if (isValidation && !inputError) {
        const slotStartTime = formatISODate(requestObject?.selectDate?.object?.value, requestObject?.selectTime?.object?.value);
        const slotEndTime = formatISODate(requestObject?.selectDate?.object?.value, addHoursToTime(requestObject?.selectTime?.object?.value, 3));
        LOG.info('raise request submit => 2', conditionalElements, {
          ...input,
          slotStartTime,
          slotEndTime,
        }); // raise request submit 2 Added for debugging don't remove it
        response = dispatch(customerService.createServiceRequest({ ...input, slotStartTime, slotEndTime }, QUERY.CreateFRWorkOrder));
      }
    } else if (conditionalElements === PROPERTIES.RAISE_REQUEST.suspension) {
      const isValidation = validateField({
        ...fieldToValidate,
        suspensionReason: values.suspensionReason,
        suspensionDate: values.suspensionDate,
        resumptionDate: values.resumptionDate,
      });
      LOG.info('raise request submit => 3', conditionalElements, {
        ...input,
        subArea: selectedCategory?.subAreaNT,
        reason: values.suspensionReason,
        slotStartTime: formatISODate(toUSDate(values.suspensionDate)),
        slotEndTime: formatISODate(toUSDate(values.resumptionDate)),
      }); // raise request submit 3 Added for debugging don't remove it
      if (isValidation && !inputError) {
        response = dispatch(
          customerService.createServiceRequest(
            {
              ...input,
              subArea: selectedCategory?.subAreaNT,
              reason: values.suspensionReason,
              slotStartTime: formatISODate(toUSDate(values.suspensionDate)),
              slotEndTime: formatISODate(toUSDate(values.resumptionDate)),
            },
            QUERY.CreateSRWorkOrder,
          ),
        );
      }
    } else {
      const isValidation = validateField({ ...fieldToValidate });
      if (isValidation && !inputError) {
        const { subscriberId, woSubType, woType, description } = input;
        const requestObject = {
          subscriberId,
          woSubType,
          woType,
          description,
          subArea: selectedCategory?.subAreaNT,
          ...(values.reason && { reason: values.reason }),
          ...(values.suspensionDate !== '' && { slotEndTime: formatISODate(values.suspensionDate) }),
          ...(values.resumptionDate !== '' && { slotStartTime: values.resumptionDate }),
        };

        LOG.info('raise request submit => 4', conditionalElements, {
          ...requestObject,
        }); // raise request submit 3 Added for debugging don't remove it
        response = dispatch(customerService.createServiceRequest(requestObject, QUERY.CreateSRWorkOrder));
      }
    }

    // show alert message
    response?.then((response: ParentObject) => {
      if (response?.status) {
        resetForm();
        dispatch(uiActions.showAlert(response.data.message, ALERT.SUCCESS, { primaryText: MODAL.OK }, { data: { text: response.data.transactionId }, type: CHILD_TYPE.TEXT }));
      }
    });
  };

  const cancelButton = () => {
    if (isRedirection) {
      closeWebView();
    } else {
      goHome();
    }
  };
  const renderConditionalElements = () => {
    switch (conditionalElements) {
      case PROPERTIES.RAISE_REQUEST.requestDateTime:
        return (
          <View style={[styles.dropdownContainer, styles[gcs('dropdownContainer', inflection, true, ['lg', 'xl'])]]}>
            <Dropdown
              data={slotDate}
              selectedValue={requestObject.selectDate}
              required
              onSelect={(item: DataItem) => {
                handleChange({ name: PROPERTIES.RAISE_REQUEST.selectDate, value: item, fieldType: FIELD_TYPE.DROPDOWN });
                dispatch(customerService.getSlotTimeForDropdown({ selectedDate: item?.object?.value }, QUERY.GetSlotTimeForDropdown));
              }}
              innerContainerStyle={styles.dropdownContainerStyle}
              inputFieldStyle={styles.inputFieldStyle}
              iconStyle={styles.chevronIconStyle}
              error={validationErrors.selectDate}
            />
            <Dropdown
              data={slotTime}
              selectedValue={requestObject.selectTime}
              required
              onSelect={(item: DataItem) => {
                handleChange({ name: PROPERTIES.RAISE_REQUEST.selectTime, value: item, fieldType: FIELD_TYPE.DROPDOWN });
              }}
              innerContainerStyle={styles.dropdownContainerStyle}
              inputFieldStyle={styles.inputFieldStyle}
              iconStyle={styles.chevronIconStyle}
              error={validationErrors.selectTime}
            />
          </View>
        );
      case PROPERTIES.RAISE_REQUEST.requestOcsDateTime:
        return (
          <View style={[styles.suspenseDropdownContainer, styles[gcs('suspenseDropdownContainer', inflection, true, ['lg', 'xl'])]]}>
            <View style={[styles.slotButtonContainer, styles[gcs('avlBtnMarginTop', inflection, true, ['md', 'lg', 'xl'])]]}>
              <Button onPress={() => getAvailableSlot(true, '')} label={t('strings.availableSlot')} style={styles.button} labelStyle={styles.slotButton} />
            </View>
            <View style={styles.flexStyle}>
              <Text label={t('strings.preferredDate')} required color={Colors.neutral.black} style={styles.inputLabel} />
              <DatePicker
                minDate={requestObject.preferredMinDate}
                defaultDate={requestObject.preferredMinDate}
                maxDate={requestObject?.preferredMaxDate}
                value={values.preferredDate}
                onDateSelected={(text: string) => {
                  handleChange({ name: PROPERTIES.RAISE_REQUEST.preferredDate, value: text, fieldType: FIELD_TYPE.DATE });
                  getAvailableSlot(false, text);
                }}
                inputContainerStyle={styles.input}
                placeholder={`DD/MM/${new Date().getFullYear()}`}
                error={validationErrors.preferredDate}
              />
            </View>
            <View style={styles.flexStyle}>
              <Text label={t('strings.selectTime')} required color={Colors.neutral.black} style={styles.inputLabel} />
              <Dropdown
                data={availableSlot?.slotTimes}
                selectedValue={requestObject.selectTime}
                onSelect={(item: DataItem) => {
                  handleChange({ name: PROPERTIES.RAISE_REQUEST.selectTime, value: item, fieldType: FIELD_TYPE.DROPDOWN });
                }}
                innerContainerStyle={styles.dropdownContainerStyle}
                inputFieldStyle={styles.inputFieldStyle}
                iconStyle={styles.chevronIconStyle}
                error={validationErrors.selectTime}
              />
            </View>
          </View>
        );
      case PROPERTIES.RAISE_REQUEST.suspension:
        return (
          <View style={[styles.suspenseDropdownContainer, styles[gcs('suspenseDropdownContainer', inflection, true, ['lg', 'xl'])]]}>
            <View style={styles.flexStyle}>
              <Text label={t('strings.suspensionReason')} required color={Colors.neutral.black} style={styles.inputLabel} />
              <Dropdown
                data={suspensionReason}
                selectedValue={requestObject.suspensionReason}
                onSelect={(item: DataItem) => {
                  handleChange({ name: PROPERTIES.RAISE_REQUEST.suspensionReason, value: item, fieldType: FIELD_TYPE.DROPDOWN });
                }}
                innerContainerStyle={styles.dropdownContainerStyle}
                inputFieldStyle={styles.inputFieldStyle}
                iconStyle={styles.chevronIconStyle}
                error={validationErrors.suspensionReason}
              />
            </View>

            <View style={styles.flexStyle}>
              <Text label={t('strings.suspensionDate')} required color={Colors.neutral.black} style={styles.inputLabel} />
              <DatePicker
                minDate={requestObject.suspensionMinDate}
                defaultDate={requestObject.suspensionMinDate}
                value={values.suspensionDate}
                onDateSelected={(text: string) => handleChange({ name: PROPERTIES.RAISE_REQUEST.suspensionDate, value: text, fieldType: FIELD_TYPE.DATE })}
                inputContainerStyle={styles.input}
                placeholder="DD/MM/YYYY"
                error={validationErrors.suspensionDate}
              />
            </View>

            <View style={styles.flexStyle}>
              <Text label={t('strings.resumptionDate')} required color={Colors.neutral.black} style={styles.inputLabel} />
              <DatePicker
                minDate={requestObject.resumptionMinDate}
                defaultDate={requestObject.resumptionMinDate}
                value={values.resumptionDate}
                onDateSelected={(text: string) => handleChange({ name: PROPERTIES.RAISE_REQUEST.resumptionDate, value: text, fieldType: FIELD_TYPE.DATE })}
                inputContainerStyle={styles.input}
                placeholder="DD/MM/YYYY"
                error={validationErrors.resumptionDate}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Card cardStyle={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]} childrenStyle={styles.content}>
      <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
        <FormHeader formName={FORMS.raiseRequest as FormNameKeys} />
      </View>
      <View style={styles.scrollContainer}>
        <View style={[styles.itemViewStyle]}>
          <Text label={t('strings.subscriberIdOrMobile')} required color={Colors.neutral.black} style={styles.inputLabel} />
          <TextInput
            value={values.subscriberInfo || ''}
            onInputChange={(text: string) => handleChange({ name: PROPERTIES.RAISE_REQUEST.subscriberInfo, value: text, fieldType: FIELD_TYPE.INPUT })}
            inputFieldStyle={[styles.input]}
            isNumericKeyboard
            isNumericValue
            maxValue={Sizing.layout.x10}
            placeholder={t('strings.enterHere')}
            placeholderTextColor={Colors.neutral.g300}
            error={validationErrors.subscriberInfo}
          />
        </View>
        <View>
          <MultipleSubId
            selectedId={values.subId}
            onSelect={(value: string) => handleChange({ name: PROPERTIES.RAISE_REQUEST.subId, value, fieldType: FIELD_TYPE.MULTIPLE_SUB_ID })}
            type={STYLES.TYPE.SECONDARY}
          />
        </View>
        <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Button onPress={validateId} label={t('strings.validateId')} style={[styles.button, styles[gcs('button', inflection, true, ['md', 'lg', 'xl'])]]} />
        </View>
        {accountInfo?.customerName && (
          <View style={styles.accountInfoContainer}>
            <InformationText
              containerStyle={styles.textWrapper}
              primaryStyle={styles.primaryText}
              secondaryStyle={styles.secondaryText}
              primaryText={PROPERTIES.RAISE_REQUEST.name}
              separator=": "
              secondaryText={accountInfo?.customerName}
            />
            <View style={[styles.dropdownContainer, styles[gcs('dropdownContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              <Dropdown
                data={categories}
                selectedValue={requestObject?.natureOfRequest}
                required
                onSelect={(item: DataItem) => {
                  dispatch(customerServiceActions.setSelectedType((item.name ?? '').toString()));
                  handleChange({
                    name: PROPERTIES.RAISE_REQUEST.natureOfRequest,
                    value: item,
                    fieldType: FIELD_TYPE.DROPDOWN,
                    queryName: QUERY.GetServiceSubCategories,
                    queryParam: PROPERTIES.RAISE_REQUEST.category,
                  });
                }}
                innerContainerStyle={styles.dropdownContainerStyle}
                iconStyle={styles.chevronIconStyle}
                error={validationErrors.natureOfRequest}
              />
              <Dropdown
                data={subCategories}
                selectedValue={requestObject.typeOfRequest}
                required
                onSelect={(item: DataItem) => {
                  dispatch(customerServiceActions.setTypeOfRequest((item.name ?? '').toString()));
                  MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestGetSlot.moduleName, {
                    Status: true,
                    [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestGetSlot.attributes.SubscriberID]: subscriberId,
                    [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestGetSlot.attributes.RequestType]: item?.name,
                    [MoengageMixpanelModules.CustomerService.CustomerServiceRaiseRequestGetSlot.attributes.NatureOfRequest]: requestObject?.natureOfRequest?.name,
                  });
                  handleChange({ name: PROPERTIES.RAISE_REQUEST.typeOfRequest, value: item, fieldType: FIELD_TYPE.DROPDOWN, queryName: QUERY.GetSuspensionReason });
                }}
                innerContainerStyle={styles.dropdownContainerStyle}
                iconStyle={styles.chevronIconStyle}
                error={validationErrors.typeOfRequest}
              />
            </View>
            {/* render conditional elements */}
            {renderConditionalElements()}
            <View>
              <Text label={t('strings.description')} required color={Colors.neutral.black} style={styles.inputLabel} />
              <TextInput
                value={requestObject.description}
                onInputChange={onInputChange}
                inputFieldStyle={[styles.input, styles.textArea]}
                multiline
                numberOfLines={Sizing.layout.x10}
                error={inputError ?? validationErrors.description}
                maxValue={requestObject?.descriptionMaxValue}
                showRemainingCharacters
              />
            </View>
            <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              <Button onPress={finalSubmit} label={t('strings.proceed')} style={[styles.button, styles[gcs('button', inflection, true, ['md', 'lg', 'xl'])]]} />
              <Button
                onPress={cancelButton}
                label={t('strings.cancel')}
                style={[styles.button, styles[gcs('button', inflection, true, ['md', 'lg', 'xl'])]]}
                type={STYLES.TYPE.SECONDARY}
                outline
              />
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

export default RaiseTheRequest;
