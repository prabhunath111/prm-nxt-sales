/**
 * Component for generating ui with form json.
 *
 * @module components/DynamicFormBuilder
 * @memberof CommonComponent
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, KeyboardAvoidingView, SafeAreaView, Platform } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import actions from 'store/sales/actions/form';
import commonAction from 'store/sales/actions/common';
import dealerFeedbackAction from 'store/sales/actions/dealerFeedback';
import { FIELD_TYPE, KEYBOARD_TYPE, SUBMISSION, VALIDATIONS, ICONS, VALUE_TYPE, STATE_KEY, STRINGS, CHILD_TYPE, PROPERTIES, STYLES } from 'const';
import { ButtonType, dropdown, button, DropdownType, formItem, FormItemType, group, GroupStyle, input, InputStyleType, LabelType, textLabel } from 'styles/forms';
import Text from 'components/sales/Text';
import TextInput from 'components/sales/TextInput';
import IconTextInput from 'components/sales/IconTextInput';
import MultiSelectDropdown from 'components/sales/MultiSelectDropdown';
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
  shouldHideField,
} from 'utils/formBuilderHelper';
import Autocomplete from 'components/sales/Autocomplete';
import Button from 'components/sales/Button';
import { formatValue } from 'utils/responseHelper';
import Dropdown, { DataItem } from 'components/sales/Dropdown';
import RadioContainer, { RadioItem } from 'components/sales/RadioContainer';
import BalanceContainer from 'components/sales/BalanceContainer';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import Search from 'components/sales/Search';
import SelectSubscriber from 'components/sales/SelectSubscriber';
import CallSubscriberCard from 'components/sales/CallSubscriberCard';
import AccordionWrapper from 'components/sales/AccordionWrapper';
import InputWithButton from 'components/sales/InputWithButton';
import CustomAmount from 'components/sales/CustomAmount';
import Checkbox from 'components/sales/Checkbox';
import PillsGroup from 'components/sales/PillsGroup';
import DealerDetailsCard from 'components/sales/DealerDetailsCard';
import SearchBarItems from 'components/sales/SearchBarItems';
import CustomerDetailsCard from 'components/sales/CustomerDetailsCard';
import ActionTileCard from 'components/sales/ActionTileCard';
import PartnerApprovalCard from 'components/sales/PartnerApprovalCard';
import MultipleSubId from 'components/sales/MultipleSubId';
import InformationText from 'components/sales/InformationText';
import uiActions from 'store/sales/actions/ui';
import TsraSubscriberList from 'components/sales/TsraSubscriberList';
import Link from 'components/sales/Link';
import ToggleSwitch from 'components/sales/ToggleSwitch';
import IconWithCount from 'components/sales/IconWithCount';
import MultiCheckboxDropdown from 'components/sales/MultiCheckboxDropdown';
import DynamicTable from 'components/sales/DynamicTable';
import MultiCheckbox from 'components/sales/MultiCheckbox';
import CustomerDetails from 'components/sales/CustomerDetails';
import PartnerInfo from 'components/sales/PartnerInfo';
import SelectDate from 'components/sales/SelectDate';
import GroupedActionTiles from 'components/sales/GroupedActionTiles';
import ChecklistTiles from 'components/sales/ChecklistTiles';
import { isiOS } from 'utils/platformHelper';
import SlabList from 'components/sales/SlabList';
import styles from './DynamicFormBuilder.styles';
import DateAndTimeDetails from '../DateAndTimeDetails';

/**
 * Component type definitions
 *
 * @typedef {object} DynamicFormBuilderProps
 * @property {string} [text] - The content for the component
 */

export type DynamicFormBuilderProps = {
  formName: string;
  formValues?: ParentObject;
  onSubmit: (values: ParentObject, submitType: string, queryName: string, navigateTo: string) => void;
  formContainerStyle?: object;
  containerStyle?: object;
  dynamicCardContainerStyle?: string;
  stateKey?: string;
};

type InputChangeProps = {
  name: string;
  value: any;
  hasDependentChildren?: number[];
  hasRelatedChildren?: number[];
  parentId?: number;
  dependentChildValue?: string | number | object | boolean | number[];
};

/**
 * Represents a DynamicFormBuilder component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered DynamicFormBuilder component
 *
 * @example
 * <DynamicFormBuilder text="Hello World!" />
 */

const DynamicFormBuilder = ({
  formName,
  onSubmit,
  formContainerStyle,
  containerStyle,
  dynamicCardContainerStyle = '',
  stateKey = STATE_KEY.FORM_STATE,
}: DynamicFormBuilderProps) => {
  const { formData, formQuery, formNavigationData, formValues, updatedFormFields, fieldsToDisable, fieldsToShow } = useSelector((state: RootState) => state.form[stateKey]);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { tableFilteredData, tableColumns, errorMessage, customFormData } = useSelector((state: RootState) => state.common);
  const { isSubscriberValid } = useSelector((state: RootState) => state.dealerFeedback);
  const { showDynamicNoData } = useSelector((state: RootState) => state.partnerApproval);
  const [values, setValues] = useState<ParentObject>({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(formData);
  const { goBack, goHome } = useNavigate();
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const getKeyByParentId = (parentId: number) => Object.keys(form).find((formKey) => form[formKey].id === parentId);
  const { isModalLoading, bottomModal } = useSelector((state: RootState) => state.ui);
  const { isEngValidate } = useSelector((state: RootState) => state.utility);
  const [isPressed, setIsPressed] = useState(false);

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

  const updateFieldsVisibility = ({ fieldsToShow = [], fieldsToHide = [] }: { fieldsToShow?: number[]; fieldsToHide?: number[] }, hideFirst: boolean = false) => {
    const updatedForm = { ...form };
    const updatedValues = { ...values };
    const updatedErrors: Record<string, string> = { ...errors };

    const hideFields = () => {
      fieldsToHide?.forEach((id) => {
        const key = getKeyByParentId(id);
        if (key) {
          updatedForm[key] = { ...updatedForm[key], isVisible: 0 };
          delete updatedValues[key]; // Remove hidden field key from values
          delete updatedErrors[key]; // Remove hidden field key from errors
        }
      });
    };

    const showFields = () => {
      fieldsToShow?.forEach((id) => {
        const key = getKeyByParentId(id);
        if (key) {
          updatedForm[key] = { ...updatedForm[key], isVisible: 1 };
          if (updatedForm[key].hasValue) updatedValues[key] = null; // Add key for visible field
          delete updatedErrors[key]; // Ensure there is no error for the newly visible field
        }
      });
    };

    // Execute based on `hideFirst` flag
    if (hideFirst) {
      hideFields();
      showFields();
    } else {
      showFields();
      hideFields();
    }

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

  const handleFormUpdate = async (fieldsToValidate: number[], queryName: string) => {
    let isValidAction = false;
    const fieldValues: ParentObject = {};
    if (fieldsToValidate?.length > 0) {
      fieldsToValidate.forEach((fieldId: number) => {
        const ValidateFieldName = Object.keys(formData).find((key) => formData[key].id === fieldId);
        if (ValidateFieldName) fieldValues[ValidateFieldName] = values[ValidateFieldName];
      });
      isValidAction = validate(fieldValues);
    } else {
      isValidAction = validate();
    }

    if (isValidAction && queryName) {
      if (values.subId) {
        fieldValues.subscriberInfo = values.subId;
      }
      dispatch(callAction(fieldValues, queryName));
    }
  };

  const handleInputChange = ({ name, value, hasDependentChildren, hasRelatedChildren, dependentChildValue }: InputChangeProps) => {
    // Check for empty or undefined values
    const isEmpty = value === false || value === '' || value === undefined || value === null;
    const updatedErrors: ParentObject = { ...errors };
    switch (formData[name]?.type) {
      case FIELD_TYPE.DROPDOWN:
        // Reset all error messages at the beginning
        setTimeout(() => {
          setErrors({});
        }, 0);
        break;

      default:
        break;
    }
    // reset modal error messages
    if (errorMessage) {
      dispatch(commonAction.reSetErrorMessage());
    }

    if (isSubscriberValid) {
      dispatch(dealerFeedbackAction.setValidateSubscriber({ isSubscriberValid: false, message: '' }));
    }

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
            case FIELD_TYPE.FLAT_DROPDOWN:
            case FIELD_TYPE.DROPDOWN:
              {
                if (dependentFieldName) {
                  setValues((prev) => ({
                    ...prev,
                    [dependentFieldName]: null, // Reset value
                  }));
                }
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
                dispatch(commonAction.reSetCustomAmount());
                if (name === STRINGS.SELECT_DEALER) {
                  setForm((prev: ParentObject) => ({
                    ...prev,
                    [dependentFieldName]: {
                      ...dependentField,
                      dataItem: value,
                    },
                  }));
                }
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

            case FIELD_TYPE.AUTOCOMPLETE:
              if (dependentFieldName) {
                dispatch(formAction.resetDropdownData({}));
                setValues((prev) => ({
                  ...prev,
                  [dependentFieldName]: null, // Reset value
                }));
              }
              break;

            case FIELD_TYPE.CHECKBOX:
              if (dependentFieldName) {
                updatedErrors[dependentFieldName] = '';
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
            case FIELD_TYPE.AMOUNT:
              {
                const relatedField = formData[relatedFieldName];
                // Update the validation array
                const updatedValidations = relatedField.validation.map((validation: ParentObject) =>
                  validation.type === VALIDATIONS.MAX_VALUE ? { ...validation, value: dependentChildValue } : validation,
                );
                setForm((prev: ParentObject) => {
                  // Create a new object with the same order
                  const newForm = { ...prev };
                  newForm[relatedFieldName] = {
                    ...newForm[relatedFieldName],
                    validation: updatedValidations,
                  };

                  return newForm;
                });
              }
              break;
            default:
              break;
          }
        }
      });

      const parentFiled = formData[name];
      switch (parentFiled?.type) {
        case FIELD_TYPE.DROPDOWN:
          updateFieldsVisibility({ fieldsToShow: hasRelatedChildren });
          break;
        case FIELD_TYPE.FLAT_DROPDOWN:
          if (value?.PRIMARY_MULTI_TV === STRINGS.YES) {
            updateFieldsVisibility({ fieldsToShow: hasRelatedChildren });
          } else {
            updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
          }
          break;
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
          } else if (Array.isArray(dependentChildValue)) {
            const relatedFields = hasRelatedChildren.filter((_, index) => dependentChildValue.includes(index));
            if (value) {
              updateFieldsVisibility({ fieldsToHide: hasRelatedChildren, fieldsToShow: relatedFields }, true);
            } else {
              updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
            }
          } else if (value) {
            updateFieldsVisibility({ fieldsToShow: hasRelatedChildren });
          } else {
            updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
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
      case FIELD_TYPE.MULTISELECT_DROPDOWN:
        {
          const onChangeQuery = formData[name]?.onChangeQuery;
          if (onChangeQuery) {
            let param = { ...values, [formData[name]?.queryParams]: value };

            param = extractValues(param);

            dispatch(callAction(param, onChangeQuery));
          }
        }
        break;
      case FIELD_TYPE.MULTI_CHECKBOX_DROPDOWN:
        {
          const onChangeQuery = formData[name]?.onChangeQuery;
          if (onChangeQuery) {
            let param = { ...values, [formData[name]?.queryParams]: value };

            param = extractValues(param);

            dispatch(callAction(param, onChangeQuery));
          }
        }
        break;
      case FIELD_TYPE.FLAT_DROPDOWN:
      case FIELD_TYPE.INPUT:
        {
          const onChangeQuery = formData[name]?.onChangeQuery;
          if (onChangeQuery) {
            const param = { [formData[name]?.queryParams]: value };

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
          const currentField = formData[name];
          let relatedFieldIds = hasRelatedChildren;
          // If hasRelatedChildren is undefined, try to get from form configuration
          if (!relatedFieldIds && currentField?.relatedFields) {
            try {
              relatedFieldIds = JSON.parse(currentField.relatedFields);
            } catch (e) {
              return;
            }
          }
          // Check if current field has dependency logic
          if (currentField?.dependencyValue && relatedFieldIds && relatedFieldIds.length > 0) {
            if (param[name] === currentField.dependencyValue) {
              updateFieldsVisibility({ fieldsToShow: relatedFieldIds });
            } else {
              updateFieldsVisibility({ fieldsToHide: relatedFieldIds });
            }
          }
          // Fallback: if dependencyValue is not set but we have dependentChildValue
          else if (dependentChildValue && relatedFieldIds && relatedFieldIds.length > 0) {
            if (param[name] === dependentChildValue) {
              updateFieldsVisibility({ fieldsToShow: relatedFieldIds });
            } else {
              updateFieldsVisibility({ fieldsToHide: relatedFieldIds });
            }
          }

          if (dependentChildValue === param[name] && dependentChildValue === STRINGS.CUSTOM_DATE_RANGE) {
            setTimeout(() => {
              dispatch(
                uiActions.showBottomModal({
                  isModalVisible: true,
                  type: CHILD_TYPE.CUSTOM_DATE_PICKER,
                  headerTitle: t(`strings.${PROPERTIES.EVD_MDN_CHANGE_DETAILS.dateRangeTitle}`),
                  showCloseIcon: true,
                  showHeader: true,
                  data: { name, value },
                  buttonInfo: {
                    isDateRangePicker: true,
                    defaultDateSelection: 90,
                  },
                }),
              );
            }, 500);
          }
        }
        break;

      case FIELD_TYPE.RADIO_CONTAINER: {
        const onChangeQuery = formData[name]?.onChangeQuery;
        if (onChangeQuery) {
          const param = { [formData[name]?.queryParams]: value };
          dispatch(callAction(param, onChangeQuery));
        }
        if (dependentChildValue === STRINGS.RESET_FIELDS) {
          const currentSelectPartner = values.selectPartner?.name || '';
          if (currentSelectPartner !== '') {
            dispatch(actions.setFormValues({ ...values, selectPartner: '', transferType: value }));
          }
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
      }
      case FIELD_TYPE.TOGGLE_SWITCH:
        {
          const { queryName } = formData[name];
          dispatch(callAction({ ...values, [name]: value }, queryName));
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
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...updatedErrors,
        [name]: null,
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

  const handleSubmit = (submitType: string, queryName: string, routeName: string, optionalParam?: ParentObject, fieldsToValidate?: number[]) => {
    if (isPressed) return; // Ignore if already pressed

    setIsPressed(true);

    switch (submitType) {
      case SUBMISSION.SUBMIT:
        {
          const result = optionalParam && Object.keys(optionalParam).length > 0 ? validate(optionalParam) : validate();
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
      case SUBMISSION.NAVIGATION_TO:
        onSubmit(values, submitType, queryName, routeName);
        break;

      case SUBMISSION.SUBMIT_NAVIGATION:
        {
          const result = validate();
          if (result && isEngValidate) {
            onSubmit(values, submitType, queryName, routeName);
          }
        }
        break;

      case SUBMISSION.RESET:
        resetForm();
        break;
      case SUBMISSION.LINK:
        onSubmit(values, submitType, queryName, routeName);
        break;
      case SUBMISSION.BACK:
        goBack();
        break;
      case SUBMISSION.CLOSE:
        dispatch(uiActions.hideBottomModal());
        break;
      case SUBMISSION.UPDATE:
        if (fieldsToValidate) {
          handleFormUpdate(fieldsToValidate, queryName);
        }

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
    // Reset after a delay (e.g., 2 seconds)
    setTimeout(() => {
      setIsPressed(false);
    }, 2000);
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
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
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
              rightIconName={formError[id] === STRINGS.KINDLY_RECHARGE ? ICONS.LOW_BALANCE : null}
              rightIconStyle={[styles.amountIconStyle, formError[id] ? styles[gcs('iconRightStyle', inflection, true, ['md', 'lg', 'xl'])] : {}]}
              leftIconStyle={styles.leftIconStyle}
              containerStyle={styles.containerInputTextStyle}
            />
          </View>
        );
      }
      case FIELD_TYPE.INPUT: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required} />
            <IconTextInput
              id={id}
              value={formModel[id] || ''}
              placeholder={field.placeholderText}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId })}
              error={formError[id]}
              inputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              placeholderTextColor={Colors.violet.v200}
              isNumericValue={numeric}
              maxValue={maxValue}
              leftIconName={ICONS[field.iconName as keyof typeof ICONS]}
              containerStyle={styles.containerInputTextStyle}
            />
          </View>
        );
      }

      case FIELD_TYPE.TEXTAREA: {
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required && field.label} />
            <TextInput
              id={id}
              value={id === STRINGS.DEALER_FEEDBACK ? t(`raiseFeedbackList.${formModel[id]}`) : formModel[id] || ''}
              placeholder={field.placeholderText}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId })}
              error={formError[id]}
              inputFieldStyle={[styles.inputField, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              placeholderTextColor={Colors.neutral.g200}
              multiline
              numberOfLines={maxValue ? Sizing.layout.x5 : Sizing.layout.x1}
              maxValue={maxValue}
              showRemainingCharacters={maxValue}
            />
          </View>
        );
      }

      case FIELD_TYPE.PASSWORD: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} />
            <IconTextInput
              id={id}
              value={String(formModel[id] || '')}
              placeholder={field.placeholderText ?? t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, parentId })}
              error={formError[id]}
              secureTextEntry={!showPassword}
              inputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              isNumericValue={numeric}
              maxValue={maxValue}
              rightIconName={showPassword ? ICONS.VISIBLE : ICONS.NON_VISIBLE}
              onIconPress={() => setShowPassword((prev) => !prev)}
              containerStyle={styles.containerInputTextStyle}
            />
          </View>
        );
      }

      case FIELD_TYPE.CONTAINER_LABEL:
      case FIELD_TYPE.LABEL:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text
              id={id}
              label={field.label}
              style={[styles.labelTextStyle, styles[gcs('labelTextStyle', inflection, true, ['md', 'lg', 'xl'])], textLabel[field.inputStyle as LabelType]]}
              required={field.placeholderText}
            />
          </View>
        );

      case FIELD_TYPE.DESCRIPTION:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text style={field.inputStyle ? styles.descriptionBoldTextStyle : styles.labelTextStyle}>{formModel[id]}</Text>
          </View>
        );

      case FIELD_TYPE.ERROR_MESSAGE:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            {errorMessage && <Text id={id} style={[styles.errorStyle, textLabel[field.inputStyle as LabelType]]} label={errorMessage} color={Colors.error.primary} />}
          </View>
        );

      case FIELD_TYPE.AUTOCOMPLETE:
        return (
          <View
            key={id}
            style={[
              field.inputStyle === STRINGS.YES ? {} : styles.autoCompleteContainer,
              styles[gcs('autoCompleteContainer', inflection, true, ['md', 'lg', 'xl'])],
              formItem[field.itemStyle as FormItemType],
            ]}
          >
            <Text id={id} required={required} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} />
            <Autocomplete
              data={JSON?.parse(field?.dataItems ?? null)}
              containerStyle={dropdown[field.inputStyle as DropdownType]}
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
              label={field.buttonStyle === STYLES.TYPE.PRIMARY && isModalLoading ? <ActivityIndicator color={Colors.neutral.white} /> : field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, {}, JSON.parse(field?.dependentFields))}
              type={field.buttonStyle}
              fontSize={Sizing.layout.x16}
              outline={field.inputStyle}
              disabled={field.buttonStyle === STYLES.TYPE.PRIMARY && (isPressed || isModalLoading)}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])], button[field.dataItems as ButtonType]]}
              {...(field.iconName && {
                iconName: ICONS[field.iconName as keyof typeof ICONS],
                iconPosition: STYLES.POSITION.LEFT,
                iconHeight: Sizing.layout.x1Dot5,
                iconWidth: Sizing.layout.x1Dot5,
                iconStyle: styles.primaryIconStyle,
              })}
            />
          </View>
        );
      case FIELD_TYPE.CONTAINER_BUTTON: {
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType], shouldHideField(field, STRINGS.HIDE_IN_MOBILE) && styles.removeField]}>
            <Button
              label={field.buttonStyle === STYLES.TYPE.PRIMARY && isModalLoading ? <ActivityIndicator color={Colors.neutral.white} /> : field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName)}
              type={field.buttonStyle}
              fontSize={Sizing.layout.x16}
              outline={field.inputStyle}
              disabled={field.buttonStyle === STYLES.TYPE.PRIMARY && isModalLoading}
              style={[styles.containerButtonStyle, styles[gcs('containerButtonStyle', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])], styles[field.itemStyle]]}
              {...(field.iconName && {
                iconName: ICONS[field.iconName as keyof typeof ICONS],
                iconPosition: STYLES.POSITION.LEFT,
                iconHeight: Sizing.layout.x1Dot5,
                iconWidth: Sizing.layout.x1Dot5,
                iconStyle: styles.primaryIconStyle,
              })}
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
              data={JSON?.parse(field?.dataItems ?? null)}
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
                  hasRelatedChildren: JSON.parse(field?.relatedFields),
                });
              }}
              placeholder={field.placeholderText}
              placeholderTextColor={Colors.neutral.black}
              stateKey={stateKey}
            />
          </View>
        );

      case FIELD_TYPE.FLAT_DROPDOWN:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={styles.itemTextBoldStyle} required={required} />
            <Dropdown
              queryName={field.queryName}
              queryParams={field.queryParams}
              inputFieldStyle={[styles.flatDropDownInputField, dropdown[field.inputStyle as DropdownType]]}
              innerContainerStyle={styles.flatDropDownInnerContainer}
              error={formError[id]}
              id={id}
              selectedValue={formModel[id]}
              defaultSelectedValue={field?.defaultSelectedValue}
              onSelect={(item: DataItem) => {
                handleInputChange({
                  name: id,
                  value: item,
                  parentId,
                  hasRelatedChildren: JSON.parse(field.relatedFields),
                  hasDependentChildren: JSON.parse(field.dependentFields),
                  dependentChildValue: field?.dependencyValue,
                });
              }}
              placeholder={field.placeholderText}
              placeholderTextColor={Colors.violet.v200}
              stateKey={stateKey}
            />
          </View>
        );
      case FIELD_TYPE.RADIO_CONTAINER: {
        return (
          <View key={id} style={styles.itemViewStyle}>
            {field.label ? <Text id={id} required={required} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} /> : null}
            <RadioContainer
              radioItemContainer={styles[field.itemStyle]}
              containerStyle={formItem[field.itemStyle as FormItemType]}
              selectedContainerStyle={styles.selectedContainerStyle}
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
              defaultSelected={formNavigationData.params.transferType || field?.defaultSelectedValue}
              selectedValue={formModel[id]}
              queryName={field.queryName}
            />
          </View>
        );
      }

      case FIELD_TYPE.BALANCE_CONTAINER: {
        return (
          <View key={id} style={styles.itemViewStyle}>
            <BalanceContainer
              handleChange={(amount: string) => handleInputChange({ name: id, value: amount, hasRelatedChildren: JSON.parse(field?.relatedFields), dependentChildValue: amount })}
            />
          </View>
        );
      }

      case FIELD_TYPE.CUSTOM_AMOUNT: {
        return (
          <View key={id} style={styles.itemViewStyle}>
            <CustomAmount
              radioTextArr={JSON.parse(field.dataItems ?? null)}
              userDetails={field.dataItem}
              headerLabel={field.label}
              onAmountChange={(newAmt) => handleInputChange({ name: id, value: newAmt })}
            />
            {formError[id] && <Text id={`${id}error`} style={styles.errorStyle} label={formError[id]} color={Colors.appColors.lightRed} />}
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
              fieldDependencyValue={field.dependencyValue}
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
              searchStyles={formItem[field.dataItems as FormItemType]}
            />
          </View>
        );
      }

      case FIELD_TYPE.SELECT_SUBSCRIBER: {
        return <SelectSubscriber queryName={field.queryName} />;
      }

      case FIELD_TYPE.CALL_SUBSCRIBER: {
        return <CallSubscriberCard label={field.label} />;
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
              stateKey={stateKey}
            />
          </View>
        );

      case FIELD_TYPE.INPUT_WITH_BUTTON: {
        return (
          <InputWithButton
            id={id}
            field={field}
            formModel={formModel}
            formError={formError}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            input={input}
            stateKey={stateKey}
          />
        );
      }

      case FIELD_TYPE.CHECKBOX:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Checkbox
              label={field.label}
              subLabel={field.dataItems}
              value={formModel[id]}
              required={required}
              hideRequired={field.routeName === STRINGS.FALSE}
              id={id}
              error={formError[id]}
              onValueChange={(text: boolean) => handleInputChange({ name: id, value: text, parentId, hasDependentChildren: JSON.parse(field.dependentFields) })}
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
              itemStyles={formItem[field.itemStyle as FormItemType]}
            />
          </View>
        );
      }

      case FIELD_TYPE.DEALER_DETAILS_CARD:
        return (
          <View key={id} style={[styles.itemViewStyle]}>
            <DealerDetailsCard routeName={field.routeName} formName={field.queryName} bottomModalHeader={field.placeholderText} title={field.label} />
          </View>
        );

      case FIELD_TYPE.TABLE:
        return (
          <View key={id} style={[styles.alignItemCenter, formItem[field.itemStyle as FormItemType]]}>
            {tableFilteredData?.length > 0 ? (
              <DynamicTable columns={tableColumns} data={tableFilteredData} alignLeft={field.dataItems === STRINGS.YES} formName={formName} />
            ) : (
              field?.placeholderText !== 'showDynamicNoData' && <Text style={styles.alignCenter} label={t('errors.noDataFound')} />
            )}
            {showDynamicNoData && field?.placeholderText === 'showDynamicNoData' && <Text style={styles.alignCenter} label={t('errors.noDataFound')} />}
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

      case FIELD_TYPE.ACTION_TILE_GROUP: {
        let subTiles = [];
        subTiles = Array.isArray(field.dataItems) ? field.dataItems : JSON.parse(field.dataItems || '[]');
        return (
          <View key={field.id} style={styles.itemViewStyle}>
            <GroupedActionTiles
              title={field.label}
              iconName={field.iconName}
              subTiles={subTiles?.map((tile: any) => ({
                label: tile.label,
                iconName: tile.iconName,
                onPress: () => handleSubmit(tile.submitType, tile.queryName, tile.routeName),
              }))}
            />
          </View>
        );
      }

      case FIELD_TYPE.PARTNER_APPROVAL_CARD:
        return (
          <View key={id} style={styles.itemViewStyle}>
            <PartnerApprovalCard queryName={field.queryName} />
          </View>
        );

      case FIELD_TYPE.TSRA_SUBSCRIBER_LIST:
        return (
          <View key={id} style={styles.itemViewStyle}>
            <TsraSubscriberList />
          </View>
        );

      case FIELD_TYPE.MULTIPLE_SUB_ID:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <MultipleSubId
              selectedId={formModel[id]}
              setDefaultNull={!field?.defaultSelectedValue}
              headerText={field.label}
              onSelect={(value: string) => handleInputChange({ name: id, value })}
            />
          </View>
        );
      case FIELD_TYPE.SLAB_LIST:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <SlabList selectedId={formModel[id]} onSelect={(value: string) => handleInputChange({ name: id, value })} />
          </View>
        );
      case FIELD_TYPE.CHECKLIST_TILES:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <ChecklistTiles header={field.label} />
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
      case FIELD_TYPE.DISCLAIMER_TEXT:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <InformationText
              primaryText={field.label}
              primaryStyle={styles.disclaimerPrimaryText}
              secondaryStyle={styles.disclaimerSecondaryText}
              secondaryText={field.placeholderText}
              separator={field.defaultSelectedValue}
              containerStyle={[styles.disclaimerContainerStyle, styles[gcs('disclaimerContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            />
          </View>
        );

      case FIELD_TYPE.LINK: {
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Link
              label={field.label}
              labelStyle={formItem[field.inputStyle as FormItemType]}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, JSON.parse(field?.dependentFields))}
            />
          </View>
        );
      }

      case FIELD_TYPE.TOGGLE_SWITCH:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <ToggleSwitch label={field.label} onValueChange={(items: any) => handleInputChange({ name: id, value: items })} selectedValue={formModel[id]} />
          </View>
        );
      case FIELD_TYPE.ICON: {
        const isPinkIcon = field.itemStyle === STRINGS.PINK_ICON;
        if (field.itemStyle === STRINGS.HIDE_IN_MOB) {
          if (shouldHideField(field, STRINGS.HIDE_IN_MOB)) {
            return null;
          }
        }
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <IconWithCount
              queryName={field.queryName}
              iconName={ICONS[field.iconName as keyof typeof ICONS]}
              externalStyle={isPinkIcon ? styles.pinkIconStyle : null}
              showCount={field.dataItems === STRINGS.YES}
            />
          </View>
        );
      }
      case FIELD_TYPE.MULTISELECT_DROPDOWN:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
            {field.label ? <Text id={id} label={field.label} required={required} color={Colors.neutral.black} style={styles.itemTextStyle} /> : null}
            <MultiSelectDropdown
              queryName={field.queryName}
              queryParams={field.queryParams}
              error={formError[id]}
              selectedValues={formModel[id]}
              onSelect={(items: ParentObject[]) => {
                handleInputChange({
                  name: id,
                  value: items,
                  hasDependentChildren: JSON.parse(field.dependentFields),
                });
              }}
              placeholder={field.placeholderText}
              placeholderTextColor={Colors.neutral.g250}
              innerContainerStyle={styles.multiDropDownStyle}
              stateKey={stateKey}
            />
          </View>
        );
      case FIELD_TYPE.MULTI_CHECKBOX_DROPDOWN:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            {field.label ? <Text id={id} label={field.label} required={required} color={Colors.neutral.black} style={styles.itemTextStyle} /> : null}
            <MultiCheckboxDropdown
              queryName={field.queryName}
              queryParams={field.queryParams}
              error={formError[id]}
              selectedValues={formModel[id]}
              onSelect={(items: ParentObject[]) => {
                handleInputChange({
                  name: id,
                  value: items,
                  hasDependentChildren: JSON.parse(field.dependentFields),
                });
              }}
              placeholder={field.placeholderText}
              placeholderTextColor={Colors.neutral.black}
              innerContainerStyle={styles.multiDropDownStyle}
              stateKey={stateKey}
            />
          </View>
        );
      case FIELD_TYPE.MULTI_CHECKBOX:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
            {field.label ? <Text id={id} label={field.label} required={required} color={Colors.neutral.black} style={styles.itemTextStyle} /> : null}
            <MultiCheckbox
              queryName={field.queryName}
              queryParams={field.queryParams}
              error={formError[id]}
              selectedValues={formModel[id]}
              data={JSON.parse(field.dataItems ?? null)}
              onSelect={(items: ParentObject[] | null) => {
                handleInputChange({
                  name: id,
                  value: items,
                  hasDependentChildren: JSON.parse(field.dependentFields),
                });
              }}
              stateKey={stateKey}
            />
          </View>
        );

      case FIELD_TYPE.CUSTOMER_DETAILS:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            {field.label ? <Text id={id} label={field.label} required={required} color={Colors.neutral.black} style={styles.itemTextStyle} /> : null}
            <CustomerDetails queryName={field.queryName} button={field.dataItems === STRINGS.YES} inputFieldStyle={input[field.inputStyle as InputStyleType]} />
          </View>
        );

      case FIELD_TYPE.PARTNER_INFO:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            {field.label ? <Text id={id} label={field.label} required={required} color={Colors.neutral.black} style={styles.itemTextStyle} /> : null}
            <PartnerInfo />
          </View>
        );

      case FIELD_TYPE.SELECT_DATE:
        return (
          <View
            key={id}
            style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType], styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], styles.alignStart]}
          >
            {field.label ? <Text id={id} label={field.label} style={[styles.itemTextStyle]} /> : null}
            <SelectDate error={formError[id]} onValueChange={(date: string) => handleInputChange({ name: id, value: date })} />
          </View>
        );

      case FIELD_TYPE.DATE_AND_TIME:
        return (
          <View>
            <DateAndTimeDetails />
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
  }, [updatedFormFields, form]);

  useEffect(() => {
    const getKeyByParentId = (fieldName: string) => Object.keys(form).find((formKey) => form[formKey].field_name === fieldName);
    const key = getKeyByParentId(fieldsToDisable?.fieldName);
    const updatedForm = { ...form };
    const updatedErrors: Record<string, string> = { ...errors };
    if (key) {
      setForm((prev: ParentObject) => ({
        ...prev,
        [fieldsToDisable?.fieldName]: {
          ...updatedForm[key],
          isDisabled: 1,
        },
      }));
      delete updatedErrors[key];
    }
  }, [fieldsToDisable]);

  useEffect(() => {
    const getKeyByParentId = (fieldName: string) => Object.keys(form).find((formKey) => form[formKey].field_name === fieldName);

    const updatedErrors: Record<string, string> = { ...errors };
    setForm((prev: ParentObject) => {
      const updated = { ...prev };

      fieldsToShow?.forEach((fieldName: string) => {
        const key = getKeyByParentId(fieldName);

        if (key) {
          updated[key] = {
            ...updated[key],
            isVisible: 1,
          };
          delete updatedErrors[key];
        }
      });

      return updated;
    });
  }, [fieldsToShow]);

  useEffect(() => {
    if (
      customFormData?.evdMdnChangeFilter?.type === PROPERTIES.EVD_MDN_CHANGE_DETAILS.select &&
      customFormData?.evdMdnChangeFilter?.customDateRange > 0 &&
      tableFilteredData?.length > 0
    ) {
      const param = extractValues(values);
      param.requestedDate = customFormData?.evdMdnChangeFilter?.customDateRange;
      setValues((prev) => ({
        ...prev,
        requestedDate: customFormData?.evdMdnChangeFilter?.customDateRange,
      }));
      dispatch(dealerFeedbackAction.searchTrackDealerFeedback({ ...extractValues(values), requestedDate: customFormData?.evdMdnChangeFilter?.customDateRange }));
    } else if (customFormData?.evdMdnChangeFilter?.type === PROPERTIES.EVD_MDN_CHANGE_DETAILS.clear) {
      setValues((prev) => ({
        ...prev,
        day: '',
      }));
    }
  }, [customFormData?.evdMdnChangeFilter?.type, customFormData?.evdMdnChangeFilter?.customDateRange]);

  useEffect(() => {
    if (formData) {
      dispatch(
        commonAction.setCustomFormData({
          evdMdnChangeFilter: {},
        }),
      );
      initForm();
      dispatch(commonAction.reSetErrorMessage());
      dispatch(commonAction.reSetCustomAmount());
    }
  }, [formData, formValues, initForm]);

  useEffect(() => {
    if (formData) {
      setForm(formData);

      const updatedForm = { ...formData };
      const temp: ParentObject = {};
      // set visible true for default field after set form

      Object.keys(formData)?.forEach((key) => {
        if (
          formData[key].defaultSelectedValue === STRINGS.MATCH_DEPENDENCY &&
          formData[key].dependentDataField &&
          JSON.parse(formData[key].dependentDataField).includes(formValues[formData[key].dependencyValue])
        ) {
          updatedForm[key] = { ...updatedForm[key], isVisible: 1 };
          if (updatedForm[key].hasValue && updatedForm[key].isVisible) {
            temp[key] = formValues && formValues[key] ? formValues[key] : null;
          }
        }
      });
      setForm(updatedForm);
      setValues((prev) => ({
        ...prev,
        ...temp,
      }));
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

    return () => {
      dispatch(formAction.setFormData({ data: { form: {}, formTitle: '', formQuery: '' }, stateKey }));
    };
  }, [dispatch, formName]);

  useEffect(
    () => () => {
      dispatch(actions.setUpdatedFormFields({}, stateKey));
      dispatch(actions.setFormDependentDefault({}, stateKey));
      dispatch(actions.setFormValues({}, stateKey));
      // reset table will clear all table and column data when form builder unmount
      if (stateKey === STATE_KEY.FORM_STATE) {
        dispatch(commonAction.resetTable());
      }
      dispatch(commonAction.resetCommonStore());
    },
    [],
  );

  const renderForm = (formJson: ParentObject) => {
    const groupedFields: { [key: string]: ParentObject } = {};
    const buttonContainers: ParentObject[] = []; // Store buttonContainer fields separately
    const customerCard: ParentObject[] = []; // Store customerCard fields separately

    Object.entries(formJson).forEach(([id, field]: any) => {
      if ((field.type === FIELD_TYPE.CONTAINER_BUTTON || field.type === FIELD_TYPE.INFORMATION_TEXT || field.type === FIELD_TYPE.CONTAINER_LABEL) && field.isVisible) {
        buttonContainers.push({ id, ...field }); // Add to button container list
      } else if (field.type === FIELD_TYPE.CUSTOMER_DETAILS_CARD && field.isVisible) {
        customerCard.push({ id, ...field }); // Add to customer card list
      } else {
        const groupId = field.groupId || `group-${id}`;

        if (!groupedFields[groupId]) {
          groupedFields[groupId] = {
            groupStyle: {}, // initialize with empty
            fields: [],
          };
        }

        // Only push visible fields
        if (field.isVisible) {
          groupedFields[groupId].fields.push({ id, ...field });

          // Only assign groupStyle if the field is visible and it's the first one assigning it
          if (Object.keys(groupedFields[groupId].groupStyle).length === 0 && field.groupStyle) {
            groupedFields[groupId].groupStyle = field.groupStyle;
          }
        }
      }
    });

    const groupedButtons = buttonContainers.reduce((acc: Record<number, any[]>, item: any) => {
      if (!acc[item.groupId]) acc[item.groupId] = [];
      acc[item.groupId].push(item);
      return acc;
    }, {});

    return (
      <SafeAreaView style={[styles.container, containerStyle]}>
        <KeyboardAvoidingView
          style={[styles.container, containerStyle]}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          keyboardVerticalOffset={isiOS() ? Sizing.layout.x20 : Sizing.layout.x0}
        >
          <View
            style={[[styles.container, containerStyle], styles[gcs('container', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}
            id="formContainer"
            testID="formBuilderTest"
          >
            {customerCard.length ? (
              <View
                style={[
                  styles.detailsCardContainer,
                  styles[gcs(dynamicCardContainerStyle, inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
                  styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
                  stateKey === STATE_KEY.MODAL_STATE && styles.modalContainer,
                ]}
              >
                <CustomerDetailsCard stateKey={stateKey} />
              </View>
            ) : null}
            <ScrollView
              contentContainerStyle={[
                styles.formContainer,
                styles[gcs('formContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
                formContainerStyle,
                styles[gcs(dynamicCardContainerStyle, inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
                styles[gcs(dynamicCardContainerStyle, inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
                stateKey === STATE_KEY.MODAL_STATE && styles.modalContainer,
              ]}
              bounces={false}
              nestedScrollEnabled
            >
              {Object.entries(groupedFields).map(([groupId, { groupStyle, fields }]: any) => (
                <View
                  key={groupId}
                  style={[
                    styles.groupContainer,
                    styles[gcs('groupContainer', inflection, true, ['md', 'lg', 'xl'])],
                    group[groupStyle as GroupStyle],
                    fields.map((field: any) => (shouldHideField(field, STRINGS.HIDE_IN_MOBILE) ? styles.removeField : {})),
                  ]}
                >
                  {fields.map((field: any) => (field.isVisible ? <React.Fragment key={field.id}>{renderFormControl(field.field_name, field)}</React.Fragment> : null))}
                </View>
              ))}
            </ScrollView>

            {/* Separate container for buttonContainer fields outside of ScrollView */}
            {buttonContainers.length ? (
              <View style={[styles.buttonContainer]}>
                {Object.entries(groupedButtons).map(([groupId, buttons]: [string, any[]]) => {
                  const isRow = buttons[0]?.groupStyle === STRINGS.ROW_CONTAINER;

                  return (
                    <View
                      key={groupId}
                      style={[isRow ? styles.buttonInnerContainer : styles.buttonContainerGap, styles[gcs('buttonInnerContainer', inflection, true, ['lg', 'xl'])]]}
                    >
                      {buttons.map((field) => (
                        <View key={field.id}>{renderFormControl(field.field_name, field)}</View>
                      ))}
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  return renderForm(form);
};

export default DynamicFormBuilder;
