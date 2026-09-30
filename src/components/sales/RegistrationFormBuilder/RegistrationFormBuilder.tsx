/**
 * Component for generating ui with form json.
 *
 * @module components/RegistrationFormBuilder
 * @memberof CommonComponent
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions as mhAction } from 'store/sales/reducer/manageHierarchy';
import { sliceActions as exclusiveStoreActions } from 'store/sales/reducer/exclusiveStore';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import actions from 'store/sales/actions/form';
import commonAction from 'store/sales/actions/common';
import dealerFeedbackAction from 'store/sales/actions/dealerFeedback';
import { FIELD_TYPE, KEYBOARD_TYPE, SUBMISSION, VALIDATIONS, ICONS, VALUE_TYPE, STATE_KEY, STRINGS, CHILD_TYPE, PROPERTIES, STYLES, FORMS, CONNECTION_TYPE } from 'const';
import { ButtonType, dropdown, button, DropdownType, formItem, FormItemType, group, GroupStyle, input, InputStyleType, LabelType, textLabel } from 'styles/forms';
import Text from 'components/sales/Text';
import TextInput from 'components/sales/TextInput';
import IconTextInput from 'components/sales/IconTextInput';
import MultiSelectDropdown from 'components/sales/MultiSelectDropdown';
import formActions from 'store/sales/actions/form';
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
  isValidName,
  isValidAlphaNumeric,
  isValidAddress,
  shouldHideField,
  checkStartsWith,
  isValidFullName,
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
import PincodeDetailsCard from 'components/sales/PincodeDetailsCard';
import { isiOS } from 'utils/platformHelper';
import styles from './RegistrationFormBuilder.styles';
import DateAndTimeDetails from '../DateAndTimeDetails';
import GroupedActionTiles from '../GroupedActionTiles';

/**
 * Component type definitions
 *
 * @typedef {object} RegistrationFormBuilderProps
 * @property {string} [text] - The content for the component
 */

export type RegistrationFormBuilderProps = {
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
  dependentDataField?: number[];
  parentId?: number;
  dependentChildValue?: string | number | object | boolean | number[];
};

/**
 * Represents a RegistrationFormBuilder component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered RegistrationFormBuilder component
 *
 * @example
 * <RegistrationFormBuilder text="Hello World!" />
 */

const RegistrationFormBuilder = ({
  formName,
  onSubmit,
  formContainerStyle,
  containerStyle,
  dynamicCardContainerStyle = '',
  stateKey = STATE_KEY.FORM_STATE,
}: RegistrationFormBuilderProps) => {
  const {
    formData = {},
    formQuery,
    formNavigationData,
    formValues,
    updatedFormFields,
    fieldsToDisable,
    fieldsToShow,
  } = useSelector((state: RootState) => state.form[stateKey] || {});
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { tableFilteredData, tableColumns, errorMessage, customFormData } = useSelector((state: RootState) => state.common);
  const { isQuotationNavigate, numberOfConnections, etskOfferSelected, etskboxType, boxType1, boxType2, boxType3, etskPincode, etskTownLocality } = useSelector(
    (state: RootState) => state.quotation,
  );
  const { isSubscriberValid } = useSelector((state: RootState) => state.dealerFeedback);
  const [values, setValues] = useState<ParentObject>({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passValue, setpassValue] = useState('');
  const [hasPrefilled, setHasPrefilled] = useState(false);

  const [form, setForm] = useState(formData);
  const { goBack, goHome } = useNavigate();
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const getKeyByParentId = (parentId: number) => Object.keys(form).find((formKey) => form[formKey].id === parentId);
  const { isModalLoading, bottomModal } = useSelector((state: RootState) => state.ui);
  const { isIspValid, validationAttemptCount } = useSelector((state: RootState) => state.manageHierarchy);
  const { needValidation } = useSelector((state: RootState) => state.exclusiveStore);
  const [shouldShowRelatedFields, setShouldShowRelatedFields] = useState(false);
  const updatedAppliedRef = useRef(false);
  const initForm = useCallback(
    (formModel: ParentObject = formData) => {
      const temp: ParentObject = {};

      const mergeValues = (newForm: ParentObject) => {
        Object.keys(newForm).forEach((key) => {
          if (newForm[key]?.subForm) {
            mergeValues(newForm[key].subForm);
          }
          if (newForm[key].hasValue) {
            // ✅ Use updatedFormFields value if exists, else fallback to formValues or null
            if (updatedFormFields && key in updatedFormFields) {
              temp[key] = updatedFormFields[key];
            } else {
              temp[key] = formValues?.[key] ?? null;
            }
          }
        });
      };

      mergeValues(formModel);
      setValues(temp);
    },
    [formData, formValues, updatedFormFields],
  );

  useEffect(() => {
    if (!formData) return;

    const updatedForm = { ...formData };
    const temp: ParentObject = {};

    Object.keys(updatedForm).forEach((key) => {
      const field = updatedForm[key];
      if (field.defaultSelectedValue === STRINGS.MATCH_DEPENDENCY && field.dependentDataField && JSON.parse(field.dependentDataField).includes(formValues[field.dependencyValue])) {
        updatedForm[key] = { ...field, isVisible: 1 };
        if (field.hasValue) {
          temp[key] = formValues?.[key] ?? null;
        }
      }
    });

    setForm(updatedForm);
    setValues((prev) => ({ ...prev, ...temp }));
    initForm(updatedForm);
    dispatch(commonAction.setCustomFormData({ evdMdnChangeFilter: {} }));
    dispatch(commonAction.reSetErrorMessage());
    dispatch(commonAction.reSetCustomAmount());
  }, [formData, formValues]);

  const resetForm = () => {
    setErrors({});
    initForm();
  };

  useEffect(() => {
    if (formName) {
      updatedAppliedRef.current = false;
      dispatch(actions.getFormData({ formName }, stateKey));
      setErrors({});
    }
  }, [formName]);

  useEffect(() => {
    const getKeyByParentId = (fieldName: string) => Object.keys(form || {}).find((formKey) => form[formKey].field_name === fieldName);
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
    if (formQuery) {
      dispatch(callAction({}, formQuery, stateKey));
    }
  }, [formQuery]);

  useEffect(() => {
    const filter = customFormData?.evdMdnChangeFilter;

    if (!filter) return;

    if (filter.type === PROPERTIES.EVD_MDN_CHANGE_DETAILS.select && filter.customDateRange > 0 && tableFilteredData?.length > 0) {
      const extracted = extractValues(values);
      const requestedDate = filter.customDateRange;
      dispatch(
        dealerFeedbackAction.searchTrackDealerFeedback({
          ...extracted,
          requestedDate,
        }),
      );
      setValues((prev) => ({ ...prev, requestedDate }));
    }

    if (filter.type === PROPERTIES.EVD_MDN_CHANGE_DETAILS.clear) {
      setValues((prev) => ({ ...prev, day: '' }));
    }
  }, [customFormData?.evdMdnChangeFilter?.type, customFormData?.evdMdnChangeFilter?.customDateRange, tableFilteredData]);

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
              if (formModel[key] && !isValidEmail(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.MOBILE:
              if (formModel[key] && !isValidMobile(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.FIX_LENGTH:
              if (formModel[key] && !checkFixLength(formModel[key], obj.value)) {
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

            case VALIDATIONS.STARTS_WITH:
              if (!checkStartsWith(formModel[key], obj.value)) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.OPTIONAL_MOBILE:
              if (!formModel[key]) {
                return true;
              }
              if (!checkFixLength(formModel[key], obj.value) || !isValidMobile(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.OPTIONAL_EMAIL:
              if (!formModel[key]) {
                return true;
              }
              if (!isValidEmail(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.ONLY_ALPHABETS:
              if (formModel[key] && !isValidName(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.ALPHABETS_WITH_SPACES:
              if (formModel[key] && !isValidFullName(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;

            case VALIDATIONS.ALPHA_NUMERIC:
              if (formModel[key] && !isValidAlphaNumeric(formModel[key])) {
                formError[key] = obj.message;
                return true;
              }
              break;
            case VALIDATIONS.ADDRESS:
              if (formModel[key] && !isValidAddress(formModel[key])) {
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

  const handleInputChange = ({ name, value, hasDependentChildren, hasRelatedChildren, dependentChildValue, dependentDataField }: InputChangeProps) => {
    const fixLengthValue = form[STRINGS.ISP_CODE]?.validation?.find((el: any) => el.type === STRINGS.FIX_LENGTH)?.value;
    if (name === STRINGS.ISP_CODE && checkFixLength(value, fixLengthValue)) {
      dispatch(mhAction.setIspCodeValidation(false));
    }
    const isEmpty = value === false || value === '' || value === undefined || value === null;
    const updatedErrors: ParentObject = { ...errors };
    switch (formData[name]?.type) {
      case FIELD_TYPE.DROPDOWN:
        // Reset all error messages at the beginning
        setTimeout(() => {
          setErrors({});
        }, 0);
        break;
      case FIELD_TYPE.AUTOCOMPLETE:
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
              setValues((prev) => ({
                ...prev,
                [dependentFieldName]: null,
              }));
              break;
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
              if (formData[name]?.type === FIELD_TYPE.PILLS_GROUP) {
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
                } else if (value?.PRIMARY_MULTI_TV) {
                  if (value?.PRIMARY_MULTI_TV === STRINGS.YES) {
                    updateFieldsVisibility({ fieldsToShow: hasRelatedChildren });
                  } else {
                    updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
                  }
                }
              }
              break;
            case FIELD_TYPE.INPUT:
              if (name === STRINGS.TOWN_LOCALITY) {
                updateFieldsVisibility({ fieldsToShow: hasRelatedChildren, fieldsToHide: hasDependentChildren });
              } else {
                updateFieldsVisibility({ fieldsToShow: hasRelatedChildren });
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
        case FIELD_TYPE.SEARCH_BAR_ITEMS:
        case FIELD_TYPE.AUTOCOMPLETE:
          if (parentFiled?.defaultSelectedValue !== STRINGS.ETSK_OFFER) {
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
          }
          break;
        case FIELD_TYPE.INPUT:
          updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
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
            const param = { ...values, [formData[name]?.queryParams]: value };
            // param = extractValues(param);

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
          // Store the current value before any operations
          const currentValue = value;
          // reset isp code validation
          if (name === STRINGS.OUTLET_TYPE) {
            dispatch(mhAction.setIspCodeValidation(false));
          }

          // Helper function to handle field visibility logic
          const handleFieldVisibility = (showRelatedFields: boolean) => {
            const param = extractValues({ [name]: currentValue });
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
              const isSonuSelected = String(param?.[name] ?? '').substring(0, 4) === STRINGS.SONU;
              const relatedField = param[name] === currentField.dependencyValue;

              if (isSonuSelected && hasDependentChildren && showRelatedFields) {
                updateFieldsVisibility({
                  fieldsToShow: hasDependentChildren,
                  fieldsToHide: [...relatedFieldIds, ...(dependentDataField || [])],
                });
              } else if (relatedField) {
                updateFieldsVisibility({
                  fieldsToShow: relatedFieldIds,
                  fieldsToHide: [...(hasDependentChildren || []), ...(dependentDataField || [])],
                });
              } else {
                updateFieldsVisibility({
                  fieldsToHide: [...(hasDependentChildren || []), ...relatedFieldIds, ...(dependentDataField || [])],
                });
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
            if (dependentChildValue === STRINGS.MULTI_SHOW_HIDE && relatedFieldIds && relatedFieldIds.length > 0 && hasDependentChildren && hasDependentChildren.length > 0) {
              const d = hasDependentChildren[param[name] - 1];
              const fieldToShow = Array.isArray(d) ? d : [d];
              const showFieldNames = Object.keys(formData).filter((key) => fieldToShow.includes(formData[key].id));
              // Set data for only matched keys
              const cleanedObj = Object.fromEntries(Object.entries(values).filter(([key]) => showFieldNames.includes(key)));
              const r = relatedFieldIds[param[name] - 1];
              updateFieldsVisibility({
                fieldsToShow: Array.isArray(d) ? d : [d],
                fieldsToHide: Array.isArray(r) ? r : [r],
              });
              setValues((prev) => ({
                ...prev,
                ...cleanedObj,
              }));
            }

            // Ensure current field value is preserved after visibility updates
            setTimeout(() => {
              if (values[name] !== currentValue) {
                setValues((prev) => ({
                  ...prev,
                  [name]: currentValue, // Restore the current field's value
                }));
              }
            }, 0);
          };

          const onChangeQuery = formData[name]?.onChangeQuery;
          if (onChangeQuery) {
            // Don't call handleFieldVisibility immediately if there's an API call
            // Only handle it after the API response
            let param = { ...values, [formData[name]?.queryParams]: currentValue };
            param = extractValues(param);

            dispatch(callAction(param, onChangeQuery))
              .then((response: ParentObject) => {
                const newShowRelatedFields = response?.status;
                setShouldShowRelatedFields(newShowRelatedFields);

                // Handle field visibility with the fresh response data
                handleFieldVisibility(newShowRelatedFields);
              })
              .catch(() => {
                // Restore value in case of error and handle visibility with current state
                setValues((prev) => ({
                  ...prev,
                  [name]: currentValue,
                }));
                // Still handle field visibility even on error
                handleFieldVisibility(shouldShowRelatedFields);
              });
          } else {
            // If no onChangeQuery, use current shouldShowRelatedFields state
            handleFieldVisibility(shouldShowRelatedFields);
          }

          // Handle custom date range picker (independent of API response)
          const param = extractValues({ [name]: currentValue });
          if (dependentChildValue === param[name] && dependentChildValue === STRINGS.CUSTOM_DATE_RANGE) {
            setTimeout(() => {
              dispatch(
                uiActions.showBottomModal({
                  isModalVisible: true,
                  type: CHILD_TYPE.CUSTOM_DATE_PICKER,
                  headerTitle: t(`strings.${PROPERTIES.EVD_MDN_CHANGE_DETAILS.dateRangeTitle}`),
                  showCloseIcon: true,
                  showHeader: true,
                  data: { name, value: currentValue },
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

      case FIELD_TYPE.BUTTON:
        updateFieldsVisibility({ fieldsToHide: hasRelatedChildren });
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
        } else if (value === STRINGS.ETSK) {
          updateFieldsVisibility({
            fieldsToHide: hasRelatedChildren,
          });
        } else if (value === STRINGS.PYSICAL_TSK) {
          updateFieldsVisibility({
            fieldsToShow: hasDependentChildren,
          });
        } else if (value === CONNECTION_TYPE.PRIMARY) {
          updateFieldsVisibility({
            fieldsToHide: hasDependentChildren,
            fieldsToShow: hasRelatedChildren,
          });
        } else if (value === STRINGS.MULTI) {
          updateFieldsVisibility({
            fieldsToHide: hasRelatedChildren,
            fieldsToShow: hasDependentChildren,
          });
        } else if (dependentChildValue === STRINGS.OTHERS_LOWER) {
          if (value === STRINGS.OTHERS) {
            updateFieldsVisibility({ fieldsToShow: hasDependentChildren });
          } else {
            updateFieldsVisibility({ fieldsToHide: hasDependentChildren });
          }
        } else if (dependentChildValue === STRINGS.GST_UNREGISTERED) {
          if (value !== STRINGS.UNREGISTERED) {
            updateFieldsVisibility({ fieldsToShow: hasDependentChildren });
          } else {
            updateFieldsVisibility({ fieldsToHide: hasDependentChildren });
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
    // removing part of setting the error as null, as we have to show the error in fields

    setValues((prev) => ({
      ...prev,
      [name]: isEmpty ? null : value,
    }));
  };

  useEffect(() => {
    if (updatedFormFields && Object.keys(updatedFormFields).length) {
      if (needValidation && updatedFormFields?.subscriberRmn && updatedFormFields?.subscriberEmail) {
        handleInputChange({ name: STRINGS.SUBSCRIBER_RMN, value: updatedFormFields?.subscriberRmn });
        handleInputChange({ name: STRINGS.SUBSCRIBER_EMAIL, value: updatedFormFields?.subscriberEmail });
        dispatch(exclusiveStoreActions.setNeedValidation(false));
      }
      setValues((prev) => ({
        ...prev,
        ...updatedFormFields,
      }));
    }
  }, [updatedFormFields]);

  useEffect(() => {
    if (!hasPrefilled && isQuotationNavigate && form?.numberOfConnections) {
      const updatedForm = { ...form };
      handleInputChange({
        name: STRINGS.NUMBER_OF_CONNNECTIONS,
        value: numberOfConnections,
        hasDependentChildren: JSON.parse(form?.numberOfConnections?.dependentFields),
        hasRelatedChildren: JSON.parse(form?.numberOfConnections?.relatedFields),
        dependentChildValue: form?.numberOfConnections?.dependencyValue,
        dependentDataField: JSON.parse(form?.numberOfConnections?.dependentDataField),
      });
      dispatch(
        formActions.setUpdatedFormFields({
          numberOfConnections,
          primaryBoxType: etskboxType,
          secondaryBoxType1: boxType1,
          secondaryBoxType2: boxType2,
          secondaryBoxType3: boxType3,
        }),
      );
      setForm((prev: ParentObject) => ({
        ...prev,
        primaryTskPin: {
          ...updatedForm.primaryTskPin,
          isDisabled: 0,
        },
        primaryBoxType: {
          ...updatedForm.primaryBoxType,
          isDisabled: 0,
        },
        secondaryBoxType1: {
          ...updatedForm.secondaryBoxType1,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 1,
        },
        secondaryTskPin2: {
          ...updatedForm.secondaryTskPin2,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 2,
        },
        secondaryBoxType2: {
          ...updatedForm.secondaryBoxType2,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 2,
        },
        secondaryTskPin3: {
          ...updatedForm.secondaryTskPin3,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 3,
        },
        secondaryBoxType3: {
          ...updatedForm.secondaryBoxType3,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 3,
        },
        secondaryTskPin1: {
          ...updatedForm.secondaryTskPin1,
          isDisabled: 0,
          queryParams: 'tskPin',
          isVisible: numberOfConnections?.nameNT > 1,
        },
      }));
    }

    if (!hasPrefilled && isQuotationNavigate && form?.customerDetailsOfferType) {
      const updatedForm = { ...form };
      handleInputChange({
        name: STRINGS.CUSTOMER_DETAILS_OFFER_TYPE,
        value: etskOfferSelected,
        hasDependentChildren: JSON.parse(form?.customerDetailsOfferType?.dependentFields) ?? [],
        hasRelatedChildren: JSON.parse(form?.customerDetailsOfferType?.relatedFields) ?? [],
        dependentChildValue: form?.customerDetailsOfferType?.dependencyValue ?? [],
        dependentDataField: JSON.parse(form?.customerDetailsOfferType?.dependentDataField) ?? [],
      });
      dispatch(
        formActions.setUpdatedFormFields({
          customerDetailsPinCode: etskPincode,
          customerDetailsTownLocality: etskTownLocality,
          customerDetailsOfferType: etskOfferSelected,
          customerDetailsPrimaryBox: etskboxType,
          customerDetailsSecondaryBox1: boxType1,
          customerDetailsSecondaryBox2: boxType2,
          customerDetailsSecondaryBox3: boxType3,
        }),
      );
      setForm((prev: ParentObject) => ({
        ...prev,
        customerDetailsOfferType: {
          ...updatedForm.customerDetailsOfferType,
          isDisabled: 0,
        },
        customerDetailsPrimaryBox: {
          ...updatedForm.customerDetailsPrimaryBox,
          isDisabled: 0,
        },
        customerDetailsSecondaryBox1: {
          ...updatedForm.customerDetailsSecondaryBox1,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 1,
        },
        customerDetailsSecondaryBox2: {
          ...updatedForm.customerDetailsSecondaryBox2,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 2,
        },
        customerDetailsSecondaryBox3: {
          ...updatedForm.customerDetailsSecondaryBox3,
          isDisabled: 0,
          isVisible: numberOfConnections?.nameNT > 3,
        },
        customerDetailsValidatePinButton: {
          ...updatedForm.customerDetailsValidatePinButton,
          isVisible: false,
        },
        customerDetailsTownLocality: {
          ...updatedForm.customerDetailsTownLocality,
          isDisabled: 0,
          dataItems: 1,
        },
      }));
    }
    return () => {
      if (
        (form?.secondaryTskPin1?.queryParams === 'tskPin' && values.numberOfConnections === numberOfConnections) ||
        (form?.customerDetailsTownLocality?.dataItems === 1 && values.customerDetailsOfferType === etskOfferSelected)
      ) {
        setHasPrefilled(true);
        // dispatch(quoteActions.quotationEtskSetIsQuotationNavigate(false));
      }
    };
  }, [form, isQuotationNavigate, hasPrefilled]);

  useEffect(
    () => () => {
      setForm({});
      setValues({});
      setErrors({});
      dispatch(commonAction.resetCommonStore());
      dispatch(actions.setUpdatedFormFields({}, stateKey));
      dispatch(actions.setFormValues({}, stateKey));
      dispatch(actions.resetFormQuery(stateKey));
      if (stateKey === STATE_KEY.FORM_STATE) {
        dispatch(commonAction.resetTable());
      }
    },
    [],
  );

  // Helper function to get related field name by field key

  const handleFormUpdate = async (fieldsToValidate: number[], queryName: string, relatedFields?: number[], dependencyValue?: string) => {
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
      updateFieldsVisibility({ fieldsToShow: relatedFields });
    } else if (dependencyValue === STRINGS.VALD_ERROR_POPUP) {
      dispatch(uiActions.showErrorPage(t('strings.fillMandatoryFields')));
    }
  };

  const [related, setRelated] = useState<number[] | undefined>([]);

  useEffect(() => {
    if (!isIspValid) {
      updateFieldsVisibility({ fieldsToHide: related });
    }
  }, [validationAttemptCount]);

  const handleSubmit = (
    submitType: string,
    queryName: string,
    routeName: string,
    optionalParam?: ParentObject,
    fieldsToValidate?: number[],
    relatedFields?: number[],
    dependencyValue?: string,
  ) => {
    setRelated(relatedFields);
    switch (submitType) {
      case SUBMISSION.SUBMIT:
        {
          const result = optionalParam && Object.keys(optionalParam).length > 0 ? validate(optionalParam) : validate();
          if (result) {
            onSubmit(values, submitType, queryName, routeName);
          } else if (dependencyValue === STRINGS.VALD_ERROR_POPUP) {
            dispatch(uiActions.showErrorPage(t('strings.fillMandatoryFields')));
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
          if (result) {
            onSubmit(values, submitType, queryName, routeName);
          } else if (formName === FORMS.eTSKRegistration || formName === FORMS.registrationDetails) {
            dispatch(uiActions.showErrorPage(t('strings.fillMandatoryFields')));
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

      case SUBMISSION.UPDATE:
        if (fieldsToValidate) {
          handleFormUpdate(fieldsToValidate, queryName, undefined, dependencyValue);
        }
        break;

      case SUBMISSION.UPDATE_AND_SHOW: {
        if (fieldsToValidate) {
          handleFormUpdate(fieldsToValidate, queryName, relatedFields, dependencyValue);
        }
        break;
      }
      case SUBMISSION.HOME:
        if (bottomModal.isModalVisible) {
          dispatch(uiActions.hideBottomModal());
        }
        goHome(isRedirection);
        break;

      case SUBMISSION.CAPTURE:
        onSubmit(values, submitType, queryName, routeName);
        break;

      case SUBMISSION.CLOSE:
        dispatch(uiActions.hideBottomModal());
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
        const maxValue =
          field?.validation?.find(
            (item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH || item?.type === VALIDATIONS.OPTIONAL_MOBILE,
          )?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required} />
            <IconTextInput
              id={id}
              value={formModel[id] || ''}
              placeholder={field.placeholderText}
              disabled={field.isDisabled}
              onInputChange={(text: string) =>
                handleInputChange({
                  name: id,
                  value: text,
                  hasDependentChildren: JSON.parse(field.dependentFields),
                  hasRelatedChildren: JSON.parse(field?.relatedFields),
                  parentId,
                })
              }
              error={formError[id]}
              disabledInputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              inputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              placeholderTextColor={Colors.violet.v200}
              isNumericValue={numeric}
              maxValue={maxValue}
              leftIconName={ICONS[field.iconName as keyof typeof ICONS]}
              containerStyle={[styles.containerInputTextStyle, formItem[field.dataItems as FormItemType]]}
            />
          </View>
        );
      }

      case FIELD_TYPE.TEXTAREA: {
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        const isNumeric = field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC);
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required && field.label} />
            <TextInput
              id={id}
              value={formModel[id] || ''}
              placeholder={field.placeholderText}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId })}
              error={formError[id]}
              inputFieldStyle={[styles.inputField, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={isNumeric}
              placeholderTextColor={Colors.neutral.g200}
              multiline
              numberOfLines={maxValue ? Sizing.layout.x5 : Sizing.layout.x1}
              maxValue={maxValue}
              showRemainingCharacters={maxValue}
            />
          </View>
        );
      }
      case FIELD_TYPE.DEALER_TEXTAREA: {
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        const isNumeric = field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC);
        const maxLength = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;

        const value = formModel[id] || '';
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required && field.label} />
            <TextInput
              id={id}
              value={formModel[id] || ''}
              placeholder={field.placeholderText}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId })}
              error={formError[id]}
              inputFieldStyle={[styles.inputField, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={isNumeric}
              placeholderTextColor={Colors.neutral.g200}
              multiline
              numberOfLines={maxValue ? Sizing.layout.x5 : Sizing.layout.x1}
              maxValue={maxValue}
            />
            {maxLength && (
              <Text style={styles.charCount}>
                {value.length}/{maxLength}
              </Text>
            )}
          </View>
        );
      }

      case FIELD_TYPE.PASSWORD: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;

        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required} />
            <IconTextInput
              id={id}
              value={String(formModel[id] || '')}
              placeholder={field.placeholderText ?? t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, parentId })}
              error={formError[id]}
              secureTextEntry={!showPassword}
              disabledInputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              inputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              isNumericValue={numeric}
              isNumericKeyboard={numeric}
              maxValue={maxValue}
              rightIconName={showPassword ? ICONS.VISIBLE : ICONS.NON_VISIBLE}
              onIconPress={() => setShowPassword((prev) => !prev)}
              containerStyle={styles.containerInputTextStyle}
            />
          </View>
        );
      }

      case FIELD_TYPE.FAKE_PASSWORD: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;

        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required} />
            <IconTextInput
              id={id}
              value={String(!showPassword ? '*'.repeat(formModel[id]?.length || 0) : formModel[id] || '')}
              placeholder={field.placeholderText ?? t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => {
                const isValid = text === '' || /^[0-9*]*$/.test(text?.[text.length - 1]);
                if (!isValid) {
                  return;
                }
                const numericText = text.replace(/[^0-9*]/g, '');
                if (showPassword) {
                  setpassValue(numericText);
                  handleInputChange({ name: id, value: numericText, parentId });
                } else if (numericText.length < passValue.length) {
                  const temp = passValue;
                  const newVal = temp.slice(0, numericText.length);
                  setpassValue(newVal);
                  handleInputChange({ name: id, value: newVal, parentId });
                } else if (numericText.length - passValue.length > 1) {
                  const newVal = passValue + numericText.slice(passValue.length);
                  setpassValue(newVal);
                  handleInputChange({ name: id, value: newVal, parentId });
                } else {
                  const added = numericText[numericText.length - 1];
                  const newVal = passValue + added;
                  setpassValue(newVal);
                  handleInputChange({ name: id, value: newVal, parentId });
                }
              }}
              error={formError[id]}
              disabledInputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              inputFieldStyle={[styles.textInputFieldStyle, input[field.inputStyle as InputStyleType]]}
              isNumericValue={numeric}
              isNumericKeyboard
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
          <View
            key={id}
            style={[styles.itemViewStyle, styles.marginTop10, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}
          >
            <Text
              id={id}
              label={field.label}
              style={[styles.labelTextStyle, styles[gcs('labelTextStyle', inflection, true, ['md', 'lg', 'xl'])], textLabel[field.inputStyle as LabelType]]}
              required={field.placeholderText}
            />
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
            style={[
              field.inputStyle === STRINGS.YES ? {} : styles.autoCompleteContainer,
              styles[gcs('autoCompleteContainer', inflection, true, ['md', 'lg', 'xl'])],
              formItem[field.itemStyle as FormItemType],
            ]}
          >
            {field.label ? <Text id={id} required={required} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} /> : null}
            <Autocomplete
              isCloseIconRequired={false}
              queryName={field.queryName}
              queryParams={field.queryParams}
              innerContainerStyle={dropdown[field.inputStyle as DropdownType]}
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
              actionNeeded={field?.dataItems === null ? true : field?.dataItems}
              isDisabled={field.isDisabled}
            />
          </View>
        );

      case FIELD_TYPE.BUTTON:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Button
              label={field.buttonStyle === STYLES.TYPE.PRIMARY && isModalLoading ? <ActivityIndicator color={Colors.neutral.white} /> : field.label}
              onPress={() => {
                handleInputChange({ name: id, value: '', hasRelatedChildren: JSON.parse(field.relatedFields) });
                handleSubmit(
                  field.submitType,
                  field.queryName,
                  field?.routeName,
                  JSON.parse(field?.dependentDataField),
                  JSON.parse(field?.dependentFields),
                  JSON.parse(field.relatedFields),
                  field?.dependencyValue,
                );
              }}
              type={field.buttonStyle}
              fontSize={Sizing.layout.x16}
              outline={field.inputStyle}
              disabled={isModalLoading ?? field?.isDisabled}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])], button[field.dataItems as ButtonType]]}
            />
          </View>
        );
      case FIELD_TYPE.CONTAINER_BUTTON: {
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <Button
              label={field.buttonStyle === STYLES.TYPE.PRIMARY && isModalLoading ? <ActivityIndicator color={Colors.neutral.white} /> : field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, undefined, undefined, undefined, field?.dependencyValue)}
              type={field.buttonStyle}
              fontSize={Sizing.layout.x16}
              outline={field.inputStyle}
              disabled={isModalLoading ?? field?.isDisabled}
              style={[styles.containerButtonStyle, styles[gcs('containerButtonStyle', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}
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
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            {field.label ? <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} required={required} /> : null}
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
                  hasDependentChildren: JSON.parse(field?.dependentFields),
                  hasRelatedChildren: JSON.parse(field?.relatedFields),
                  dependentChildValue: field?.dependencyValue,
                  dependentDataField: JSON.parse(field?.dependentDataField),
                });
              }}
              placeholder={field.placeholderText}
              placeholderTextColor={Colors.neutral.black}
              stateKey={stateKey}
              isScroll={field.submitType === STRINGS.YES}
              isDisabled={field?.isDisabled}
            />
          </View>
        );

      case FIELD_TYPE.FLAT_DROPDOWN:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            {field.label ? <Text id={id} label={field.label} style={styles.itemTextStyle} required={required} /> : null}
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
              isDisabled={field.isDisabled}
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
            />
          </View>
        );
      }

      case FIELD_TYPE.DEALER_DETAILS_CARD:
        return (
          <View key={id} style={[styles.itemViewStyle]}>
            <DealerDetailsCard routeName={field.routeName} formName={field.queryName} bottomModalHeader={field.placeholderText} />
          </View>
        );
      case FIELD_TYPE.PINCODE_DETAILS_CARD: {
        return (
          <View key={id} style={[styles.itemViewStyle]}>
            <PincodeDetailsCard routeName={field.routeName} queryName={field.queryName} label={field.label} />
          </View>
        );
      }

      case FIELD_TYPE.TABLE:
        return (
          <View key={id} style={[styles.alignItemCenter, styles[gcs('alignItemCenter', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            {tableFilteredData?.length > 0 ? (
              <DynamicTable columns={tableColumns} data={tableFilteredData} alignLeft={field.dataItems === STRINGS.YES} />
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
            <MultipleSubId selectedId={formModel[id]} headerText={field.label} onSelect={(value: string) => handleInputChange({ name: id, value })} />
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
      case FIELD_TYPE.INFORMATION_TEXT_OUTER:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <InformationText
              type={field.submitType}
              primaryText={field.label}
              primaryStyle={[styles.primaryText, formItem[field.dataItems as FormItemType]]}
              secondaryStyle={[styles.secondaryText, formItem[field.dataItems as FormItemType]]}
              secondaryText={formModel[id]}
              containerStyle={[styles.infoContainerStyle, styles[gcs('infoContainerStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.inputStyle as FormItemType]]}
            />
          </View>
        );
      case FIELD_TYPE.LINK: {
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Link label={field.label} onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, JSON.parse(field?.dependentFields))} />
          </View>
        );
      }

      case FIELD_TYPE.TOGGLE_SWITCH:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <ToggleSwitch label={field.label} onValueChange={(items: any) => handleInputChange({ name: id, value: items })} selectedValue={formModel[id]} />
          </View>
        );
      case FIELD_TYPE.ICON:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType]]}>
            <IconWithCount queryName={field.queryName} iconName={ICONS[field.iconName as keyof typeof ICONS]} />
          </View>
        );
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

      case FIELD_TYPE.DATE_AND_TIME:
        return (
          <View>
            <DateAndTimeDetails name={false} />
          </View>
        );

      case FIELD_TYPE.ACTION_TILE_GROUP: {
        let subTiles = [];
        const hasHeaderAction = field?.submitType || field?.queryName || field?.routeName;
        subTiles = Array.isArray(field.dataItems) ? field.dataItems : JSON.parse(field.dataItems || '[]');
        return (
          <View key={field.id} style={styles.itemViewStyle}>
            <GroupedActionTiles
              title={field.label}
              iconName={field.iconName}
              onPress={hasHeaderAction ? () => handleSubmit(field?.submitType, field?.queryName, field?.routeName) : undefined}
              subTiles={subTiles?.map((tile: any) => ({
                label: tile.label,
                iconName: tile.iconName,
                onPress: () => handleSubmit(tile.submitType, tile.queryName, tile.routeName),
              }))}
            />
          </View>
        );
      }
      default:
        return null;
    }
  };

  const renderForm = (formJson: ParentObject) => {
    if (!formJson) {
      return null;
    }
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
        <KeyboardAvoidingView style={[styles.container, containerStyle]} behavior="padding" keyboardVerticalOffset={isiOS() ? Sizing.layout.x20 : Sizing.layout.x0}>
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
                {/* added the primary and secondary styles to customer card to make them red in color */}
                <CustomerDetailsCard
                  stateKey={stateKey}
                  primaryStyle={formItem[customerCard[0].itemStyle as FormItemType]}
                  secondaryStyle={formItem[customerCard[0].itemStyle as FormItemType]}
                />
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
                    fields?.map((field: any) => (shouldHideField(field, STRINGS.HIDE_IN_WEB, true) ? styles.removeField : {})),
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

export default RegistrationFormBuilder;
