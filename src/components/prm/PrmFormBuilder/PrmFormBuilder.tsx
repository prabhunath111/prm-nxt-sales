/**
 * Component for generating ui with form json.
 *
 * @module components/PrmFormBuilder
 * @memberof CommonComponent
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import actions from 'store/sales/actions/form';
import commonAction from 'store/sales/actions/common';
import { FIELD_TYPE, KEYBOARD_TYPE, SUBMISSION, VALIDATIONS, ICONS, VALUE_TYPE, STATE_KEY, STRINGS, CHILD_TYPE, PROPERTIES } from 'const';
import { dropdown, DropdownType, formItem, FormItemType, group, GroupStyle, input, InputStyleType, LabelType, textLabel } from 'styles/forms';
import Text from 'components/sales/Text';
import IconTextInput from 'components/sales/IconTextInput';
import { Colors, Sizing } from 'styles';
import {
  callAction,
  checkAllowedLength,
  checkFixLength,
  checkMaxLength,
  checkMaxValue,
  checkMinLength,
  checkMinValue,
  extractValues,
  isValidEmail,
  isValidMobile,
} from 'utils/formBuilderHelper';
import Autocomplete from 'components/sales/Autocomplete';
import Button from 'components/sales/Button';
import { formatValue } from 'utils/responseHelper';
import Dropdown, { DataItem } from 'components/sales/Dropdown';
import RadioContainer, { RadioItem } from 'components/sales/RadioContainer';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import Search from 'components/sales/Search';
import AccordionWrapper from 'components/sales/AccordionWrapper';
import InputWithButton from 'components/sales/InputWithButton';
import Checkbox from 'components/sales/Checkbox';
import PillsGroup from 'components/sales/PillsGroup';
import SearchBarItems from 'components/sales/SearchBarItems';
import TableWrapper from 'components/sales/TableWrapper';
import ActionTileCard from 'components/sales/ActionTileCard';
import InformationText from 'components/sales/InformationText';
import uiActions from 'store/sales/actions/ui';
import styles from './PrmFormBuilder.styles';

/**
 * Component type definitions
 *
 * @typedef {object} PrmFormBuilderProps
 * @property {string} [text] - The content for the component
 */

export type PrmFormBuilderProps = {
  formName: string;
  formValues?: ParentObject;
  onSubmit: (values: ParentObject, submitType: string, queryName: string, navigateTo: string) => void;
  formContainerStyle?: object;
  containerStyle?: object;
  stateKey?: string;
};

type InputChangeProps = {
  name: string;
  value: any;
  hasDependentChildren?: number[];
  hasRelatedChildren?: number[];
  parentId?: number;
  dependentChildValue?: string | number | object | boolean;
};

/**
 * Represents a PrmFormBuilder component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered PrmFormBuilder component
 *
 * @example
 * <PrmFormBuilder text="Hello World!" />
 */

const PrmFormBuilder = ({ formName, onSubmit, formContainerStyle, containerStyle, stateKey = STATE_KEY.FORM_STATE }: PrmFormBuilderProps) => {
  const { formData, formQuery, formNavigationData, formValues, updatedFormFields } = useSelector((state: RootState) => state.form[stateKey]);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { tableFilteredData, tableColumns, errorMessage } = useSelector((state: RootState) => state.common);
  const [values, setValues] = useState<ParentObject>({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(formData);
  const { goBack, goHome } = useNavigate();
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const getKeyByParentId = (parentId: number) => Object.keys(form).find((formKey) => form[formKey].id === parentId);
  const { isLoading, bottomModal } = useSelector((state: RootState) => state.ui);
  let timeoutId: ReturnType<typeof setTimeout>;

  const initForm = useCallback(
    (formModel: ParentObject = formData) => {
      const temp: ParentObject = {};

      function mergeValues(newForm: ParentObject) {
        Object.keys(newForm)?.forEach((key) => {
          if (newForm[key]?.subForm) {
            mergeValues(newForm[key]?.subForm);
          }
          if (newForm[key].hasValue && newForm[key].isVisible) {
            temp[key] = formValues && formValues[key] ? formValues[key] : null;
          }
        });
      }

      mergeValues(formModel);

      setValues({
        ...temp,
      });
    },
    [formData, formValues],
  );

  const resetForm = () => {
    setErrors({});
    initForm();
  };

  const updateFieldsVisibility = ({ fieldsToShow = [], fieldsToHide = [] }: { fieldsToShow?: number[]; fieldsToHide?: number[] }) => {
    const updatedForm = { ...form };
    const updatedValues = { ...values };
    const updatedErrors: Record<string, string> = { ...errors };

    // Set visibility to true for fields to show
    fieldsToShow?.forEach((id) => {
      const key = getKeyByParentId(id);
      if (key) {
        updatedForm[key] = {
          ...updatedForm[key],
          isVisible: 1,
        };
        if (updatedForm[key].hasValue) updatedValues[key] = null; // Add key for visible field
        delete updatedErrors[key]; // Ensure there is no error for the newly visible field
      }
    });

    // Set visibility to false for fields to hide
    fieldsToHide?.forEach((id) => {
      const key = getKeyByParentId(id);
      if (key) {
        updatedForm[key] = {
          ...updatedForm[key],
          isVisible: 0,
        };
        delete updatedValues[key]; // Remove hidden field key from values
        delete updatedErrors[key]; // Remove hidden field key from errors
      }
    });
    // Update state with the modified form, values, and errors
    setForm(updatedForm);
    setValues(updatedValues);
    setErrors(updatedErrors);
  };

  // Helper function to get related field name by field key
  const getRelatedFieldKey = (key: string, index = 0): string | undefined => {
    const relatedFields = formData[key]?.relatedFields && JSON.parse(formData[key]?.relatedFields);
    if (relatedFields?.length > 0) {
      const relatedFieldId = relatedFields[index];
      return getKeyByParentId(relatedFieldId);
    }
    return undefined;
  };

  const validate = (fieldValues = values, formObject = form) => {
    const formModel: ParentObject = fieldValues;
    const formError: ParentObject = errors;

    // Validates dependent fields
    const validateDependentFields = (key: string) => {
      const dependentFields = formData[key]?.dependentFields && JSON.parse(formData[key]?.dependentFields);
      const validationObj = formObject[key].validation.find((obj: ParentObject) => obj.type === VALIDATIONS.DEPENDENT_FIELD);
      if (dependentFields?.length > 0) {
        dependentFields.forEach((fieldId: number) => {
          const dependentFieldName = Object.keys(formData).find((formKey) => formData[formKey].id === fieldId);
          if (dependentFieldName && formModel[key] && formModel[dependentFieldName] && validationObj) {
            formError[dependentFieldName] = '';
            formError[key] = validationObj?.message || t('validations.enterEitherOne');
          } else if (formError[key] && dependentFieldName && values[dependentFieldName]) {
            formError[key] = '';
            validate({ [dependentFieldName]: values[dependentFieldName] });
          }
        });
      }
    };

    // Validates related fields
    const validateRelatedFields = (key: string) => {
      const relatedFieldValidationExists = formObject[key].validation.some((obj: ParentObject) => obj.type === VALIDATIONS.RELATED_FIELD);
      if (relatedFieldValidationExists) {
        const relatedFields = formData[key]?.relatedFields && JSON.parse(formData[key]?.relatedFields);
        if (relatedFields?.length > 0) {
          relatedFields.forEach((fieldId: number) => {
            const relatedFieldName = Object.keys(formData).find((formKey) => formData[formKey].id === fieldId);
            if (relatedFieldName && !values[relatedFieldName]) {
              formError[key] = '';
            }
          });
        }
      }
    };

    Object.keys(formObject).forEach((key) => {
      if (key in formModel && formObject[key]?.validation) {
        // Clear existing error for this field before validation
        formError[key] = '';

        // Short-circuit validation if an error is found
        formObject[key].validation.some((obj: ParentObject) => {
          switch (obj.type) {
            case VALIDATIONS.REQUIRED:
              if (!formModel[key]) {
                formError[key] = obj.message;
                return true; // Stop further checks for this field
              }

              break;

            case VALIDATIONS.NOT_EQUAL_WITH:
              {
                const notEqualKeyName = getRelatedFieldKey(key);
                if (notEqualKeyName && values[notEqualKeyName] === formModel[key]) {
                  formError[key] = obj.message;
                  return true;
                }
              }
              break;

            case VALIDATIONS.EQUAL_WITH:
              {
                const equalKeyName = getRelatedFieldKey(key);
                if (equalKeyName && values[equalKeyName] !== formModel[key]) {
                  formError[key] = obj.message;
                  return true;
                }
              }
              break;

            case VALIDATIONS.ALLOWED_LENGTH:
              if (!checkAllowedLength(formModel[key], obj.value)) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.MIN_LENGTH:
              if (!checkMinLength(formModel[key], obj.value)) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.MAX_LENGTH:
              if (!checkMaxLength(formModel[key], obj.value)) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.EMAIL:
              if (!isValidEmail(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.MOBILE:
              if (!isValidMobile(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.FIX_LENGTH:
              if (!checkFixLength(formModel[key], obj.value)) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.MIN_VALUE:
              if (!checkMinValue(formModel[key], obj.value)) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.MAX_VALUE:
              if (!checkMaxValue(formModel[key], obj.value)) {
                formError[key] = obj.message;
                return true;
              }
              break;

            default:
              break;
          }

          // Clear error if validation passes
          formError[key] = '';
          return false; // Continue with the next validation
        });

        if (formModel === values) {
          validateDependentFields(key); // Also validate dependent properties
          validateRelatedFields(key); // Also validate related properties
        }
      }

      // Handle subForm validations
      if (formObject[key]?.subForm && (formModel[key] || !formObject[key].hasValue)) {
        validate(formModel, formObject[key].subForm);
      }
    });

    // Set the form errors state
    setErrors({
      ...formError,
    });

    return Object.keys(formModel).every((key) => !formError[key]);
  };

  const handleInputChange = ({ name, value, hasDependentChildren, hasRelatedChildren, dependentChildValue }: InputChangeProps) => {
    // Check for empty or undefined values
    const isEmpty = value === false || value === '' || value === undefined || value === null;

    if (Array.isArray(hasDependentChildren)) {
      hasDependentChildren.forEach((childKey) => {
        // Convert the childKey to the corresponding field name (assuming a mapping or directly from the form json)
        const dependentFieldName: string | undefined = Object.keys(formData).find((key) => formData[key].id === childKey);
        if (dependentFieldName) {
          switch (formData[dependentFieldName]?.type) {
            case FIELD_TYPE.INPUT:
            case FIELD_TYPE.AMOUNT:
              if (dependentChildValue) {
                setValues((prev) => ({
                  ...prev,
                  [dependentFieldName]: dependentChildValue,
                }));
              }
              break;

            case FIELD_TYPE.DROPDOWN:
              {
                const queryName = formData[dependentFieldName]?.queryName;
                if (queryName) {
                  dispatch(actions.fetchOptionData({ [formData[dependentFieldName]?.queryParams]: value }, queryName, stateKey));
                }
              }
              break;

            case FIELD_TYPE.CONTAINER_BUTTON:
              {
                const dependentField = formData[dependentFieldName];
                if (dependentField.dependencyValue === value) {
                  updateFieldsVisibility({ fieldsToShow: hasDependentChildren, fieldsToHide: hasRelatedChildren });
                } else {
                  setForm((prev: ParentObject) => ({
                    ...prev,
                    [dependentFieldName]: {
                      ...dependentField,
                      isVisible: 1,
                      label: `${dependentField.label} ${formatValue(VALUE_TYPE.AMOUNT, value)} `,
                    },
                  }));
                }
              }
              break;

            case FIELD_TYPE.CUSTOM_AMOUNT:
              {
                const dependentField = formData[dependentFieldName];

                setForm((prev: ParentObject) => ({
                  ...prev,
                  [dependentFieldName]: {
                    ...dependentField,
                    dataItem: value,
                  },
                }));
              }
              break;

            case FIELD_TYPE.SEARCH_BAR_ITEMS:
              if (formData[name].type === FIELD_TYPE.PILLS_GROUP) {
                setValues((prev) => ({
                  ...prev,
                  [dependentFieldName]: null,
                }));
              }

              break;

            default:
              break;
          }
        }
      });
    }

    if (Array.isArray(hasRelatedChildren)) {
      hasRelatedChildren.forEach((childKey) => {
        // Convert the childKey to the corresponding field name (assuming a mapping or directly from the form json)
        const relatedFieldName: string | undefined = Object.keys(formData).find((key) => formData[key].id === childKey);
        if (relatedFieldName) {
          switch (formData[relatedFieldName]?.type) {
            case FIELD_TYPE.AUTOCOMPLETE:
              {
                const relatedField = formData[relatedFieldName];
                if (relatedField.dependencyValue === value) {
                  updateFieldsVisibility({ fieldsToShow: hasRelatedChildren, fieldsToHide: hasDependentChildren });
                }
              }
              break;
            default:
              break;
          }
        }
      });

      const parentFiled = formData[name];
      switch (parentFiled?.type) {
        case FIELD_TYPE.SEARCH_BAR_ITEMS:
        case FIELD_TYPE.AUTOCOMPLETE:
          if (parentFiled?.parentId) {
            const fieldValue = values;
            const key = getKeyByParentId(parentFiled?.parentId);
            if (key && fieldValue[key] === dependentChildValue) {
              updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
              updateFieldsVisibility({ fieldsToShow: hasDependentChildren });
            } else {
              updateFieldsVisibility({ fieldsToHide: hasDependentChildren });
              updateFieldsVisibility({ fieldsToShow: hasRelatedChildren });
            }
          } else {
            const relatedFields = dependentChildValue ? hasRelatedChildren?.slice(0, 2) : hasRelatedChildren;
            if (value) {
              updateFieldsVisibility({ fieldsToShow: relatedFields });
            } else {
              updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
            }
          }

          break;

        default:
          break;
      }
    }

    validate({ [name]: value });

    switch (formData[name]?.type) {
      case FIELD_TYPE.AUTOCOMPLETE:
        {
          const onChangeQuery = formData[name]?.onChangeQuery;
          if (onChangeQuery) {
            let param = { ...values, [formData[name]?.queryParams]: value };

            param = extractValues(param);

            dispatch(callAction(param, onChangeQuery));
          }
        }
        break;
      case FIELD_TYPE.DROPDOWN:
        {
          const onChangeQuery = formData[name]?.onChangeQuery;
          if (onChangeQuery) {
            let param = { ...values, [formData[name]?.queryParams]: value };

            param = extractValues(param);

            dispatch(callAction(param, onChangeQuery));
          }

          // open custom date picker and set its value
          const param = extractValues({ [name]: value });
          if (dependentChildValue === param[name]) {
            timeoutId = setTimeout(() => {
              dispatch(
                uiActions.showBottomModal({
                  isModalVisible: true,
                  type: CHILD_TYPE.CUSTOM_DATE_PICKER,
                  headerTitle: t(`strings.${PROPERTIES.EVD_MDN_CHANGE_DETAILS.dateRangeTitle}`),
                  showCloseIcon: true,
                  showHeader: true,
                  data: { name, value },
                }),
              );
            }, 500);
          }
        }
        break;

      case FIELD_TYPE.RADIO_CONTAINER:
        if (dependentChildValue === STRINGS.RESET_FIELDS) {
          if (Array.isArray(hasRelatedChildren)) {
            hasRelatedChildren.forEach((childKey) => {
              const relevantFieldKey: string | undefined = Object.keys(formData).find((key) => formData[key].id === childKey);
              if (relevantFieldKey && formData[relevantFieldKey]) {
                const dependentFields = JSON.parse(formData[relevantFieldKey]?.dependentFields || '[]');
                const relatedFields = JSON.parse(formData[relevantFieldKey]?.relatedFields || '[]');

                // Merge the two arrays and get unique values
                const uniqueArray = [...new Set([...dependentFields, ...relatedFields])];
                updateFieldsVisibility({ fieldsToHide: uniqueArray });
              }
            });
          }
        }

        break;

      default:
        break;
    }

    if (!isEmpty) {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (submitType: string, queryName: string, routeName: string) => {
    switch (submitType) {
      case SUBMISSION.SUBMIT:
        {
          const result = validate();
          if (result) {
            onSubmit(values, submitType, queryName, routeName);
          }
        }
        break;

      case SUBMISSION.NAVIGATION:
        {
          const result = validate();
          if (result) {
            onSubmit(values, submitType, queryName, routeName);
          }
        }
        break;

      case SUBMISSION.SUBMIT_NAVIGATION:
        {
          const result = validate();
          if (result) {
            onSubmit(values, submitType, queryName, routeName);
          }
        }
        break;

      case SUBMISSION.RESET:
        resetForm();
        break;

      case SUBMISSION.BACK:
        goBack();
        break;

      case SUBMISSION.HOME:
        if (bottomModal.isModalVisible) {
          dispatch(uiActions.hideBottomModal());
        }
        goHome(isRedirection);
        break;

      default:
        break;
    }
  };

  const renderFormControl = (id: string, field: ParentObject) => {
    const required = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.REQUIRED);
    const formModel: ParentObject = values;
    const formError: ParentObject = errors;
    const parentId = field?.parentId ?? 0;

    switch (field.type) {
      case FIELD_TYPE.AMOUNT: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} />
            <IconTextInput
              id={id}
              value={String(formModel[id] || '')}
              placeholder={field.placeholderText ?? t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId })}
              error={formError[id]}
              inputFieldStyle={input[field.inputStyle as InputStyleType]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              isNumericValue={numeric}
              maxValue={maxValue}
              leftIconName={ICONS.RUPEE_SYMBOL}
              rightIconName={formError[id] && ICONS.LOW_BALANCE}
              rightIconStyle={styles.amountIconStyle}
            />
          </View>
        );
      }
      case FIELD_TYPE.INPUT: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} />
            <IconTextInput
              id={id}
              value={formModel[id] || ''}
              placeholder={field.placeholderText}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId })}
              error={formError[id]}
              inputFieldStyle={input[field.inputStyle as InputStyleType]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              placeholderTextColor={Colors.violet.v200}
              isNumericValue={numeric}
              maxValue={maxValue}
              leftIconName={ICONS[field.iconName as keyof typeof ICONS]}
            />
          </View>
        );
      }
      case FIELD_TYPE.PASSWORD: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} />
            <IconTextInput
              id={id}
              value={String(formModel[id] || '')}
              placeholder={field.placeholderText ?? t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, parentId })}
              error={formError[id]}
              secureTextEntry={!showPassword}
              inputFieldStyle={input[field.inputStyle as InputStyleType]}
              isNumericValue={numeric}
              maxValue={maxValue}
              rightIconName={showPassword ? ICONS.VISIBLE : ICONS.NON_VISIBLE}
              onIconPress={() => setShowPassword((prev) => !prev)}
            />
          </View>
        );
      }

      case FIELD_TYPE.LABEL:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.labelTextStyle, textLabel[field.inputStyle as LabelType]]} />
          </View>
        );

      case FIELD_TYPE.ERROR_MESSAGE:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            {errorMessage && <Text id={id} style={[styles.labelTextStyle, textLabel[field.inputStyle as LabelType]]} label={errorMessage} color={Colors.error.primary} />}
          </View>
        );

      case FIELD_TYPE.AUTOCOMPLETE:
        return (
          <View
            key={id}
            style={[styles.autoCompleteContainer, styles[gcs('autoCompleteContainer', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}
          >
            <Text id={id} required={required} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} />
            <Autocomplete
              isCloseIconRequired={false}
              queryName={field.queryName}
              queryParams={field.queryParams}
              id={id}
              selectedValue={formModel[id]}
              error={formError[id]}
              placeholder={field.placeholderText}
              onSelect={(item: ParentObject | null) => {
                handleInputChange({
                  name: id,
                  value: item,
                  hasDependentChildren: JSON.parse(field?.dependentFields),
                  hasRelatedChildren: JSON.parse(field?.relatedFields),
                  dependentChildValue: field?.dependencyValue,
                });
              }}
              stateKey={stateKey}
              formValues={extractValues(formModel)}
            />
          </View>
        );

      case FIELD_TYPE.BUTTON:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Button
              label={field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName)}
              type={field.buttonStyle}
              fontSize={Sizing.layout.x16}
              outline={field.inputStyle}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
              disabled={isLoading}
            />
          </View>
        );
      case FIELD_TYPE.CONTAINER_BUTTON: {
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Button
              label={field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName)}
              type={field.buttonStyle}
              fontSize={Sizing.layout.x16}
              outline={field.inputStyle}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            />
          </View>
        );
      }

      case FIELD_TYPE.DROPDOWN:
        return (
          <View
            key={id}
            style={[styles.dropdownContainerStyle, styles[gcs('dropdownContainerStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}
          >
            {field.label ? <Text id={id} label={field.label} style={[styles.itemTextStyle]} /> : null}
            <Dropdown
              queryName={field.queryName}
              queryParams={field.queryParams}
              innerContainerStyle={dropdown[field.inputStyle as DropdownType]}
              error={formError[id]}
              id={id}
              selectedValue={formModel[id]}
              defaultSelectedValue={field?.defaultSelectedValue}
              onSelect={(item: DataItem) => {
                handleInputChange({
                  name: id,
                  value: item,
                  parentId,
                  hasDependentChildren: JSON.parse(field.dependentFields),
                  dependentChildValue: field?.dependencyValue,
                });
              }}
              placeholder={field.placeholderText}
              stateKey={stateKey}
            />
          </View>
        );

      case FIELD_TYPE.RADIO_CONTAINER: {
        return (
          <View key={id} style={styles.itemViewStyle}>
            {field.label ? <Text id={id} label={field.label} style={[styles.itemTextStyle]} /> : null}
            <RadioContainer
              containerStyle={formItem[field.itemStyle as FormItemType]}
              items={JSON.parse(field.dataItems ?? null) as RadioItem[]}
              onSelectionChange={(text: string) =>
                handleInputChange({
                  name: id,
                  value: text,
                  hasDependentChildren: JSON.parse(field?.dependentFields),
                  hasRelatedChildren: JSON.parse(field?.relatedFields),
                  dependentChildValue: field?.dependencyValue,
                })
              }
              defaultSelected={formNavigationData.params.transferType}
              selectedValue={formModel[id]}
            />
          </View>
        );
      }

      case FIELD_TYPE.SEARCH_BAR_ITEMS: {
        const dependentField = getKeyByParentId(JSON.parse(field.dependentFields)?.[0]);

        return (
          <View key={id} style={styles.itemViewStyle}>
            <SearchBarItems
              queryName={dependentField && field.queryParams === STRINGS.DYNAMIC_QUERY ? formModel[dependentField] : field.queryName}
              listType={field.dataItems}
              selectedItem={formModel[id]}
              onItemSelect={(item: ParentObject | null, dependentChildValue: boolean | number[]) =>
                handleInputChange({ name: id, value: item, hasRelatedChildren: JSON.parse(field.relatedFields), dependentChildValue })
              }
              stateKey={stateKey}
            />
          </View>
        );
      }

      case FIELD_TYPE.SEARCH: {
        const dependentField = getKeyByParentId(JSON.parse(field.dependentFields)?.[0]);

        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            {field.label ? <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} /> : null}
            <Search
              onChange={(val) => handleInputChange({ name: id, value: val })}
              value={formModel[id]}
              queryName={dependentField && field.queryParams === STRINGS.DYNAMIC_QUERY ? formModel[dependentField] : field.queryName}
              placeholder={field.placeholderText}
              formValues={extractValues(formModel)}
              commonQueryName={field.queryName}
            />
          </View>
        );
      }

      case FIELD_TYPE.LINE_SEPRATOR: {
        return <View style={styles.lineSeprator} />;
      }

      case FIELD_TYPE.ACCORDION:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <AccordionWrapper
              name={field.field_name}
              onSelect={(selectedValue) =>
                handleInputChange({ name: '', value: '', hasDependentChildren: JSON.parse(field.dependentFields), parentId, dependentChildValue: selectedValue })
              }
            />
          </View>
        );

      case FIELD_TYPE.INPUT_WITH_BUTTON: {
        return (
          <InputWithButton id={id} field={field} formModel={formModel} formError={formError} handleInputChange={handleInputChange} handleSubmit={handleSubmit} input={input} />
        );
      }

      case FIELD_TYPE.CHECKBOX:
        return (
          <View key={id} style={[styles.itemViewStyle]}>
            <Checkbox
              label={field.label}
              subLabel={field.dataItems}
              value={formModel[id]}
              required={required}
              id={id}
              error={formError[id]}
              onValueChange={(text: boolean) => handleInputChange({ name: id, value: text, parentId })}
              labelStyle={styles.checkboxLabelStyle}
            />
          </View>
        );

      case FIELD_TYPE.PILLS_GROUP: {
        return (
          <View key={id} style={[styles.itemViewStyle]}>
            <PillsGroup
              itemsArr={JSON.parse(field.dataItems ?? null)}
              onPillPress={(text: string) => handleInputChange({ name: id, value: text, dependentChildValue: text, hasDependentChildren: JSON.parse(field.dependentFields) })}
              selectedPillText={formModel[id]}
              defaultSelected={field.hasValue}
            />
          </View>
        );
      }

      case FIELD_TYPE.TABLE:
        return (
          <View style={styles.itemViewStyle}>
            {tableFilteredData.length > 0 ? (
              <TableWrapper tableData={tableFilteredData} tableColumns={tableColumns} isDashboardTable maxFontSize={Sizing.layout.x14} />
            ) : (
              <Text style={styles.alignCenter} label={t('errors.noDataFound')} />
            )}
          </View>
        );

      case FIELD_TYPE.ACTION_TILE_CARD:
        return (
          <View key={id} style={styles.itemViewStyle}>
            <ActionTileCard
              label={field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName)}
              iconName={ICONS[field.iconName as keyof typeof ICONS]}
            />
          </View>
        );

      case FIELD_TYPE.INFORMATION_TEXT:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <InformationText
              type={field.submitType}
              primaryText={field.label}
              primaryStyle={styles.primaryInfoTextStyle}
              secondaryText={formModel[id]}
              containerStyle={[styles.infoContainerStyle, styles[gcs('infoContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            />
          </View>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      ...updatedFormFields,
    }));
  }, [updatedFormFields]);

  useEffect(() => {
    if (formData) {
      initForm();
      dispatch(commonAction.reSetErrorMessage());
      dispatch(commonAction.reSetCustomAmount());
    }
  }, [formData, formValues, initForm]);

  useEffect(() => {
    if (formData) {
      setForm(formData);
    }
  }, [formData]);

  useEffect(() => {
    if (formQuery) {
      dispatch(callAction({}, formQuery, stateKey));
    }
  }, [formQuery]);

  useEffect(() => {
    if (formName) {
      dispatch(actions.getFormData({ formName }, stateKey));
      setErrors({});
    }

    return () => {};
  }, [dispatch, formName]);

  useEffect(
    () => () => {
      // reset table will clear all table and column data when form builder unmount
      dispatch(commonAction.resetTable());
      clearTimeout(timeoutId);
    },
    [],
  );

  const renderForm = (formJson: ParentObject) => {
    const groupedFields: { [key: string]: ParentObject } = {};
    const buttonContainers: ParentObject[] = []; // Store buttonContainer fields separately
    const customerCard: ParentObject[] = []; // Store customerCard fields separately

    Object.entries(formJson).forEach(([id, field]: any) => {
      if ((field.type === FIELD_TYPE.CONTAINER_BUTTON || field.type === FIELD_TYPE.INFORMATION_TEXT) && field.isVisible) {
        buttonContainers.push({ id, ...field }); // Add buttonContainer to separate list
      } else if (field.type === FIELD_TYPE.CUSTOMER_DETAILS_CARD && field.isVisible) {
        customerCard.push({ id, ...field }); // Add customerCard to separate list
      } else {
        const groupId = field.groupId || `group-${id}`; // Use id as fallback if no groupId
        if (!groupedFields[groupId]) {
          groupedFields[groupId] = {
            groupStyle: field.groupStyle ?? {},
            fields: [],
          };
        }
        groupedFields[groupId].fields.push({ id, ...field });
      }
    });
    return (
      <View style={[[styles.container, containerStyle], styles[gcs('container', inflection, true, ['sm', 'xs'])]]} id="formContainer" testID="formBuilderTest">
        <ScrollView contentContainerStyle={[styles.formContainer, formContainerStyle]} bounces={false}>
          {Object.entries(groupedFields).map(([groupId, { groupStyle, fields }]: any) => (
            <View key={groupId} style={[styles.groupContainer, group[groupStyle as GroupStyle], styles[gcs('groupContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              {fields.map((field: any) => (field.isVisible ? <React.Fragment key={field.id}>{renderFormControl(field.field_name, field)}</React.Fragment> : null))}
            </View>
          ))}
        </ScrollView>

        {/* Separate container for buttonContainer fields outside of ScrollView */}
        {buttonContainers.length ? (
          <View style={styles.buttonContainer}>
            {buttonContainers.map((field: any) => (
              <React.Fragment key={field.id}>{renderFormControl(field.field_name, field)}</React.Fragment>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  return renderForm(form);
};

export default PrmFormBuilder;
