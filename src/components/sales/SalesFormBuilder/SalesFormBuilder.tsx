/**
 * Component for generating ui with form json.
 *
 * @module components/SalesFormBuilder
 * @memberof CommonComponent
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import actions from 'store/sales/actions/form';
import commonAction from 'store/sales/actions/common';
import { FIELD_TYPE, KEYBOARD_TYPE, SUBMISSION, VALIDATIONS, ICONS, VALUE_TYPE, STATE_KEY, STRINGS, CHILD_TYPE, PROPERTIES, STYLES, ROUTE } from 'const';
import { ButtonType, dropdown, button, DropdownType, formItem, FormItemType, group, GroupStyle, input, InputStyleType, LabelType, textLabel, table, TableType } from 'styles/forms';
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
import TableWrapper from 'components/sales/TableWrapper';
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
import SelectDaterange from 'components/sales/SelectDaterange';
import MultiCheckbox from 'components/sales/MultiCheckbox';
import InventoryTableWrapper from 'components/sales/InventoryTableWrapper';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { isiOS } from 'utils/platformHelper';
import styles from './SalesFormBuilder.styles';

/**
 * Component type definitions
 *
 * @typedef {object} SalesFormBuilderProps
 * @property {string} [text] - The content for the component
 */

export type SalesFormBuilderProps = {
  formName: string;
  formValues?: ParentObject;
  onSubmit: (values: ParentObject, submitType: string, queryName: string, navigateTo: string) => void;
  formContainerStyle?: object;
  containerStyle?: object;
  stateKey?: string;
  dynamicCardContainerStyle?: string;
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
 * Represents a SalesFormBuilder component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered SalesFormBuilder component
 *
 * @example
 * <SalesFormBuilder text="Hello World!" />
 */

const SalesFormBuilder = ({ formName, onSubmit, formContainerStyle, containerStyle, stateKey = STATE_KEY.FORM_STATE, dynamicCardContainerStyle = '' }: SalesFormBuilderProps) => {
  const { formData, formQuery, formNavigationData, formValues, updatedFormFields } = useSelector((state: RootState) => state.form[stateKey]);
  const { isRedirection, navigation } = useSelector((state: RootState) => state.user);
  const { tableFilteredData, tableColumns, errorMessage } = useSelector((state: RootState) => state.common);
  const [values, setValues] = useState<ParentObject>({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(formData);
  const { goBack, goHome } = useNavigate();
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const getKeyByParentId = (parentId: number) => (form ? Object.keys(form).find((formKey) => form[formKey].id === parentId) : undefined);
  const { isModalLoading, bottomModal } = useSelector((state: RootState) => state.ui);
  const { winBackSubscriberList, campaignName } = useSelector((state: RootState) => state.rechargeWinback);
  const { routeName } = useCurrentRoute();
  const routeDetails = navigation?.routes?.filter((route: any) => route.path === routeName);
  let errorTimeoutId: ReturnType<typeof setTimeout>;
  let modalTimeoutId: ReturnType<typeof setTimeout>;

  const initForm = useCallback(
    (formModel: ParentObject = formData, isResetForm: boolean = false) => {
      const temp: ParentObject = {};

      function mergeValues(newForm: ParentObject) {
        Object.keys(newForm)?.forEach((key) => {
          if (newForm[key]?.subForm) {
            mergeValues(newForm[key]?.subForm);
          }
          if (newForm[key].hasValue && newForm[key].isVisible) {
            temp[key] = formValues && formValues[key] && !isResetForm ? formValues[key] : null;
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
    dispatch(actions.setFormValues({}));
    initForm(formData, true);
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
        errorTimeoutId = setTimeout(() => {
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
      case FIELD_TYPE.INPUT_WITH_BUTTON:
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
            modalTimeoutId = setTimeout(() => {
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
                  },
                }),
              );
            }, 500);
          }
        }
        break;

      case FIELD_TYPE.RADIO_CONTAINER:
        {
          const onChangeQuery = formData[name]?.onChangeQuery;
          if (onChangeQuery) {
            let param = { ...values, [formData[name]?.queryParams]: value };

            param = extractValues(param);

            dispatch(callAction(param, onChangeQuery));
          }
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
        } else if (value === STRINGS.BCP_ACTIVATION_STATUS) {
          updateFieldsVisibility({
            fieldsToHide: hasDependentChildren,
            fieldsToShow: hasRelatedChildren,
          });
          errorTimeoutId = setTimeout(() => {
            setErrors({});
          }, 0);
          dispatch(commonAction.reSetErrorMessage());
        } else if (value === STRINGS.ACTIVATION_STATUS) {
          updateFieldsVisibility({
            fieldsToHide: hasRelatedChildren,
            fieldsToShow: hasDependentChildren,
          });
          errorTimeoutId = setTimeout(() => {
            setErrors({});
          }, 0);
        }
        break;
      case FIELD_TYPE.TOGGLE_SWITCH:
        {
          const { queryName } = formData[name];
          dispatch(callAction({ ...values, [name]: value }, queryName));
        }
        break;
      default:
        break;
    }

    if (routeName === ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS) {
      setValues((prev) => ({
        ...prev,
        [name]: isEmpty ? null : value,
      }));
    } else if (!isEmpty) {
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
    switch (submitType) {
      case SUBMISSION.SUBMIT:
        {
          const result = optionalParam ? validate(optionalParam) : validate();
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
          if (result) {
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
        if (routeDetails[0].path === ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS) {
          dispatch(actions.setFormValues({ campaignDropDown: { name: campaignName } }));
        }
        goBack();
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

      case FIELD_TYPE.TEXTAREA: {
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} style={[styles.itemTextStyle, textLabel[field.inputStyle as LabelType]]} />
            <TextInput
              id={id}
              value={formModel[id] || ''}
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
              inputFieldStyle={input[field.inputStyle as InputStyleType]}
              isNumericValue={numeric}
              maxValue={maxValue}
              rightIconName={showPassword ? ICONS.VISIBLE : ICONS.NON_VISIBLE}
              onIconPress={() => setShowPassword((prev) => !prev)}
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
              label={field.buttonStyle === STYLES.TYPE.PRIMARY && isModalLoading ? <ActivityIndicator color={Colors.neutral.white} /> : field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, {}, JSON.parse(field?.dependentFields))}
              type={field.buttonStyle}
              fontSize={Sizing.layout.x16}
              outline={field.inputStyle}
              disabled={field.buttonStyle === STYLES.TYPE.PRIMARY && isModalLoading}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])], button[field.dataItems as ButtonType]]}
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
              fontSize={Sizing.layout.x14}
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
              radioItemContainer={styles[field.itemStyle]}
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
              onItemSelect={() => updateFieldsVisibility({ fieldsToShow: JSON.parse(field.dependentFields) })}
              onRemove={() => updateFieldsVisibility({ fieldsToHide: JSON.parse(field.dependentFields) })}
            />
          </View>
        );

      case FIELD_TYPE.INPUT_WITH_BUTTON: {
        return winBackSubscriberList?.identifier !== STRINGS.PK ? (
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
        ) : null;
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
      case FIELD_TYPE.SECONDARY_TABLE: {
        return (
          <View style={styles.itemViewStyle}>
            {tableFilteredData?.length > 0 ? (
              <InventoryTableWrapper
                tableData={tableFilteredData}
                tableColumns={tableColumns}
                isTsraTable={field.dataItems === STRINGS.YES}
                isDashboardTable
                maxFontSize={Sizing.layout.x14}
                formName={formName}
              />
            ) : (
              <Text style={styles.alignCenter} label={t('errors.noDataFound')} />
            )}
          </View>
        );
      }

      case FIELD_TYPE.DEALER_DETAILS_CARD:
        return (
          <View key={id} style={[styles.itemViewStyle]}>
            <DealerDetailsCard routeName={field.routeName} formName={field.queryName} bottomModalHeader={field.placeholderText} />
          </View>
        );
      case FIELD_TYPE.TABLE:
        return (
          <View style={styles.itemViewStyle}>
            {tableFilteredData?.length > 0 ? (
              <TableWrapper
                tableData={tableFilteredData}
                tableColumns={tableColumns}
                isTsraTable={field.dataItems === STRINGS.YES}
                isDashboardTable
                maxFontSize={Sizing.layout.x14}
                formName={formName}
                headerStyle={table[field.inputStyle as TableType]}
              />
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
              containerStyle={[styles.infoContainerStyle, styles[gcs('infoContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}
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
              innerContainerStyle={styles.multiDropDownStyle}
              stateKey={stateKey}
            />
          </View>
        );
      case FIELD_TYPE.MULTI_CHECKBOX_DROPDOWN:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType], styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
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
      case FIELD_TYPE.SELECT_DATE_RANGE:
        return (
          <View key={id} style={[styles.itemViewStyle, formItem[field.itemStyle as FormItemType], styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
            {field.label ? <Text id={id} label={field.label} style={[styles.itemTextStyle]} /> : null}
            <SelectDaterange error={formError[id]} queryName={field.onChangeQuery} onValueChange={(items: []) => handleInputChange({ name: id, value: items })} />
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
    if (formData) {
      initForm();
      dispatch(commonAction.reSetErrorMessage());
      dispatch(commonAction.reSetCustomAmount());
      dispatch(commonAction.resetCustomFormData());
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

    return () => {};
  }, [dispatch, formName]);

  useEffect(
    () => () => {
      // reset table will clear all table and column data when form builder unmount
      if (stateKey === STATE_KEY.FORM_STATE) {
        dispatch(commonAction.resetTable());
      }
      dispatch(commonAction.resetCommonStore());
      clearTimeout(errorTimeoutId);
      clearTimeout(modalTimeoutId);
    },
    [],
  );

  const renderForm = (formJson: ParentObject) => {
    if (!formJson) return null;
    const groupedFields: { [key: string]: ParentObject } = {};
    const buttonContainers: ParentObject[] = []; // Store buttonContainer fields separately
    const customerCard: ParentObject[] = []; // Store customerCard fields separately

    Object.entries(formJson).forEach(([id, field]: any) => {
      if (
        (field.type === FIELD_TYPE.CONTAINER_BUTTON ||
          field.type === FIELD_TYPE.DISCLAIMER_TEXT ||
          field.type === FIELD_TYPE.INFORMATION_TEXT ||
          field.type === FIELD_TYPE.CONTAINER_LABEL) &&
        field.isVisible
      ) {
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
            {customerCard.length ? <CustomerDetailsCard stateKey={stateKey} /> : null}
            <ScrollView
              contentContainerStyle={[
                styles.formContainer,
                styles[gcs('formContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
                formContainerStyle,
                styles[gcs(dynamicCardContainerStyle, inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
              ]}
              bounces={false}
            >
              {Object.entries(groupedFields).map(([groupId, { groupStyle, fields }]: any) => (
                <View
                  key={groupId}
                  style={[
                    styles.groupContainer,
                    group[groupStyle as GroupStyle],
                    styles[gcs('groupContainer', inflection, true, ['md', 'lg', 'xl'])],
                    fields.map((field: any) => (shouldHideField(field, STRINGS.HIDE_IN_MOBILE) ? styles.removeField : {})),
                  ]}
                >
                  {fields.map((field: any) => (field.isVisible ? <React.Fragment key={field.id}>{renderFormControl(field.field_name, field)}</React.Fragment> : null))}
                </View>
              ))}
            </ScrollView>

            {/* Separate container for buttonContainer fields outside of ScrollView */}
            {buttonContainers.length ? (
              <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
                {buttonContainers.map((field: any) => (
                  <React.Fragment key={field.id}>{renderFormControl(field.field_name, field)}</React.Fragment>
                ))}
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  return renderForm(form);
};

export default SalesFormBuilder;
