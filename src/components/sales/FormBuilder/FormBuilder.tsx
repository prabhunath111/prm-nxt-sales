/**
 * An HTML form is used to collect User Inputs
 *
 * @module components/FormBuilder
 * @memberof - Common Component
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Sizing } from 'styles';
import { callAction, checkAllowedLength, checkFixLength, checkMaxLength, checkMaxValue, checkMinLength, checkMinValue, isValidEmail, isValidMobile } from 'utils/formBuilderHelper';
import { getItemById } from 'utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import { FormItemType, formItem, input, InputStyleType } from 'styles/forms';
import { ButtonType, button } from 'styles/buttons';
import { TableMeta, TableRow } from 'hooks/useDataTable';
import { BUTTON_TYPE, CHILD_TYPE, FIELD_TYPE, FORMS, HEADER_TITLE, KEYBOARD_TYPE, MODAL, OFFER_TYPE, PROPERTIES, STATE_KEY, STRINGS, STYLES, SUBMISSION, VALIDATIONS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import useNavigate from 'hooks/useNavigate';
import Text from 'components/sales/Text';
import TextInput from 'components/sales/TextInput';
import Checkbox from 'components/sales/Checkbox';
import Dropdown, { DataItem } from 'components/sales/Dropdown';
import Search from 'components/sales/Search';
import DatePicker from 'components/sales/DatePicker';
import Button from 'components/sales/Button';
import AccordionWrapper from 'components/sales/AccordionWrapper';
import TableWrapper from 'components/sales/TableWrapper';
import SelectList from 'components/sales/SelectList';
import Link from 'components/sales/Link';
import Autocomplete from 'components/sales/Autocomplete';
import MultipleSubId from 'components/sales/MultipleSubId';
import { useTranslation } from 'react-i18next';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { closeWebView } from 'utils/navigationHelper';
import MultiSelectDropdown from 'components/sales/MultiSelectDropdown';
import RadioContainer from 'components/sales/RadioContainer';
import useParams from 'hooks/useParams';
import commonAction from 'store/sales/actions/customerRecharge';
import { LOG } from 'config/logger';
import { isiOS } from 'utils/platformHelper';
import styles from './FormBuilder.styles';

/**
 * Represents the props for the FormBuilder component.
 * @typedef {object} FormBuilderProps
 * @property {string} formName - The formName is title of the form.
 * @property {Function} [onSubmit] - Callback function invoked when the form is submitted.
 * @property {object} formValues - The formValues of the form.
 * @property {any} style - Custom styles to be applied to the form.
 */

export type FormBuilderProps = {
  formName: string;
  formValues?: ParentObject;
  onSubmit: (values: ParentObject, submitType: string, queryName: string, navigateTo: string) => void;
  style: any;
  stateKey?: string;
};
type InputChangeProps = {
  name: string;
  value: any;
  hasDependentChildren?: number[];
  parentId?: number;
  dependentChildValue?: string | number | object;
  fieldType?: string;
};

/**
 * Represents a FormBuilder component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns FormBuilder
 */
const FormBuilder = ({ formName, onSubmit, style, formValues, stateKey = STATE_KEY.FORM_STATE }: FormBuilderProps) => {
  const [values, setValues] = useState<ParentObject>({});
  const [errors, setErrors] = useState({});
  const { formData, formActionData, formDependentData, updatedFormFields, isFormUpdated, dropdownOptions, isFormResetRequired, subIdList, formQuery } = useSelector(
    (state: RootState) => state.form[STATE_KEY.FORM_STATE],
  );

  const { isRedirection } = useSelector((state: RootState) => state.user);
  const [form, setForm] = useState(formData);
  const [tableInstance, setTableInstance] = useState<ParentObject>({});
  const { goBack, goHome } = useNavigate();
  const { t } = useTranslation();
  const { inflection } = useInflection();

  const [unSelectedValue, setUnSelectedValue] = useState('');

  const params = useParams();

  // For flat arrays like d30WinBackPacksList
  const extractOffersAndPrices = (offers: any[], priceKey: string, offerType: string) => {
    const offerList = offers ?? [];
    const priceList = offerList.map((offer) => Number(offer[priceKey]));
    return { offerList, priceList, offerType };
  };

  // For grouped arrays like dynamicOffersList (e.g., OfferGroups)
  const extractGroupedOffersAndPrices = (groups: any[], priceKey: string, offerType: string) => {
    const offerList: any[] = [];
    const priceList: number[] = [];

    groups?.forEach((group) => {
      const offers = group.offerList || [];
      offerList.push(...offers);
      priceList.push(...offers.map((offer: any) => Number(offer[priceKey])));
    });

    return { offerList, priceList, offerType };
  };

  const { winBackData, ldpUppData, mahaBumperOffer } = useMemo(
    () => ({
      winBackData: extractOffersAndPrices(formActionData?.winBackOffers?.d30WinBackPacksList ?? [], 'stdPriUnit', OFFER_TYPE.winbackOffers),
      ldpUppData: extractGroupedOffersAndPrices(formActionData?.regionOffers?.dynamicOffersList ?? [], 'packPrice', OFFER_TYPE.dynamicOffers),
      mahaBumperOffer: extractOffersAndPrices(formActionData?.regionOffers?.wbldpPackOffersList ?? [], 'stdPriUnit', OFFER_TYPE.mahaBumperOffer),
    }),
    [formActionData?.winBackOffers?.d30WinBackPacksList, formActionData?.regionOffers?.dynamicOffersList, formActionData?.regionOffers?.wbldpPackOffersList],
  );

  useEffect(() => {
    if (formData) {
      setForm(formData);
    }
  }, [formData]);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      ...updatedFormFields,
    }));
  }, [updatedFormFields]);

  const dispatch = useDispatch<AppDispatch>();
  // This function is used to get child key By Parent ID
  const getKeyByParentId = (parentId: number) => Object.keys(form).find((formKey) => form[formKey].id === parentId);

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

  const handleInputChange = ({ name, value, hasDependentChildren, dependentChildValue, parentId = 0, fieldType }: InputChangeProps) => {
    // Check for empty or undefined values
    const isEmpty = value === false || value === '' || value === undefined || value === null;

    if (!isEmpty) {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: null,
      }));
    }

    if (Array.isArray(hasDependentChildren)) {
      hasDependentChildren.forEach((childKey) => {
        // Convert the childKey to the corresponding field name (assuming a mapping or directly from the form json)
        const dependentFieldName: string | undefined = Object.keys(formData).find((key) => formData[key].id === childKey);
        if (dependentFieldName) {
          switch (formData[dependentFieldName]?.type) {
            case FIELD_TYPE.INPUT:
              {
                const queryName = formData[dependentFieldName]?.queryName;
                if (queryName) {
                  dispatch(actions.fetchDependentData({ [formData[dependentFieldName]?.queryParams]: value }, queryName, dependentFieldName));
                } else if (dependentChildValue) {
                  setValues((prev) => ({
                    ...prev,
                    [dependentFieldName]: dependentChildValue,
                  }));
                }
              }
              break;
            case FIELD_TYPE.DROPDOWN:
              {
                const queryName = formData[dependentFieldName]?.queryName;
                if (queryName) {
                  dispatch(actions.fetchOptionData({ [formData[dependentFieldName]?.queryParams]: value }, queryName));
                }
              }

              break;
            case FIELD_TYPE.TABLE:
              {
                const queryName = formData[dependentFieldName]?.queryName;
                if (queryName && value) {
                  const list = dropdownOptions[formData[name]?.queryName];
                  const tableMeta = tableInstance.options?.meta as TableMeta;
                  const item = getItemById(list, Number(value));
                  tableMeta?.addRow(item, true);
                }
              }
              break;
            case FIELD_TYPE.BUTTON:
              if (formData[dependentFieldName]?.submitType === SUBMISSION.UPDATE) {
                const result = validate({ [name]: value });
                if (!result) {
                  dispatch(actions.setFormUpdated(false, stateKey));
                }
              }

              break;
            default:
              break;
          }
        }
      });
    }

    if (name === 'amount') {
      dispatch(commonAction.setBingFlag(PROPERTIES.CUSTOMER_RECHARGE.N));
      setUnSelectedValue(value);
      const numValue = Number(value);
      const offers = [ldpUppData, winBackData, mahaBumperOffer];

      if (!Number.isNaN(numValue)) {
        const matchedOffer = offers.find((offer) => offer?.priceList?.some((price) => Number(price) === numValue));

        if (matchedOffer) {
          dispatch(
            uiActions.showBottomModal({
              isModalVisible: true,
              type: CHILD_TYPE.LABEl,
              headerTitle: HEADER_TITLE.CONFIRMATION,
              showCloseIcon: true,
              showHeader: true,
              buttonInfo: {
                primaryButtonLabel: MODAL.OK,
                secondaryButtonLabel: MODAL.CANCEL,
                queryName: STRINGS.TOGGLE_ACCORDION,
                queryParams: {
                  offerList: matchedOffer.offerList,
                  offerValue: numValue,
                  offerType: matchedOffer.offerType,
                },
                childData: HEADER_TITLE.customerRechargeUPP,
                centerLabel: true,
              },
            }),
          );
        }
      } else {
        dispatch(actions.setOffersBasisRechargeObject({}));
      }
    }
    // Validate the form field
    if (parentId > 0) {
      const parentKey = Object.keys(form).find((key) => form[key].id === parentId);
      if (parentKey) {
        validate({ [name]: value }, form[parentKey].subForm);
      }
    } else {
      validate({ [name]: value });
    }

    if (isEmpty) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }

    // Validate the sub form field
    if (form[name]?.subForm && isEmpty) {
      const subFormKeys = Object.keys(form[name].subForm);
      setValues((prevValues) => {
        const newValues = { ...prevValues };
        subFormKeys.forEach((subKey) => {
          newValues[subKey] = null;
        });
        return newValues;
      });
      setErrors((prevErrors) => {
        const newErrors: ParentObject = { ...prevErrors };
        subFormKeys.forEach((subKey) => {
          delete newErrors[subKey];
        });
        return newErrors;
      });
    }

    // setSubIdListDefault
    if (fieldType === FIELD_TYPE.INPUT && subIdList?.length > 0) {
      setValues((prevValues) => {
        const { subId, ...rest } = prevValues;
        LOG.info(subId);
        return rest;
      });
      dispatch(actions.setSubIdListDefault());
    }
    if (formData[name]?.type === FIELD_TYPE.INPUT) {
      const onChangeQuery = formData[name]?.onChangeQuery;
      if (onChangeQuery) {
        const param = { [formData[name]?.queryParams]: value };

        dispatch(callAction(param, onChangeQuery));
      }
    }
  };

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
      // need to find alternate solution for setTimeout
      setTimeout(() => {
        setValues({
          ...temp,
        });
      }, 0);
    },
    [formData, formValues],
  );

  const resetForm = () => {
    setErrors({});
    initForm();
    dispatch(actions.clearFormData(!isFormResetRequired));
    dispatch(actions.setSubIdListDefault());
    dispatch(actions.setFormActionDefault({}, stateKey));
    dispatch(actions.setFormUpdated(false));
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
        delete values.subId;
      }
      dispatch(callAction(fieldValues, queryName));
    }
  };

  const handleSubmit = (submitType: string, queryName: string, routeName: string, fieldsToValidate: number[]) => {
    const updatedValues: ParentObject = { ...values };
    if (updatedValues.subId) {
      updatedValues.subscriberInfo = updatedValues.subId;
      delete updatedValues.subId;
    }
    LOG.info('----------======', updatedValues, submitType, queryName, routeName);
    switch (submitType) {
      case SUBMISSION.SUBMIT:
        {
          const result = validate();
          if (result) {
            onSubmit(updatedValues, submitType, queryName, routeName);
          }
        }
        break;
      case SUBMISSION.NAVIGATION:
        {
          const result = validate();
          if (result) {
            onSubmit(updatedValues, submitType, queryName, routeName);
          }
        }
        break;
      case SUBMISSION.SUBMIT_NAVIGATION:
        {
          const result = validate();
          if (result) {
            onSubmit(updatedValues, submitType, queryName, routeName);
          }
        }
        break;
      case SUBMISSION.RESET:
        resetForm();
        break;
      case SUBMISSION.LINK:
        onSubmit(updatedValues, submitType, queryName, routeName);
        break;
      case SUBMISSION.UPDATE:
        handleFormUpdate(fieldsToValidate, queryName);

        break;
      case SUBMISSION.BACK:
        goBack();
        break;

      case SUBMISSION.HOME:
        if (isRedirection) {
          closeWebView();
        } else {
          goHome();
        }
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
      case FIELD_TYPE.INPUT: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        const formValue = formModel[id] || '';
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} required={required} color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <TextInput
              id={id}
              value={formName === FORMS.changeEVDPin ? t(`strings.${formValue}`, { defaultValue: formValue }) : formValue}
              placeholder={t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) =>
                handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId, fieldType: FIELD_TYPE.INPUT })
              }
              error={formError[id]}
              inputFieldStyle={[styles.inputField, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              placeholderTextColor={Colors.neutral.g300}
              isNumericValue={numeric}
              maxValue={maxValue}
            />
          </View>
        );
      }
      case FIELD_TYPE.TEXTAREA: {
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} required color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <TextInput
              id={id}
              value={formModel[id] || ''}
              placeholder={t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, hasDependentChildren: JSON.parse(field.dependentFields), parentId })}
              error={formError[id]}
              inputFieldStyle={[styles.inputField, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              placeholderTextColor={Colors.neutral.g300}
              multiline
              numberOfLines={Sizing.layout.x10}
              maxValue={maxValue}
            />
          </View>
        );
      }
      case FIELD_TYPE.PASSWORD: {
        const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
        const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
        const fieldLabel = params[field.field_name] ? t(`strings.${params[field.field_name]}`) : field.label;
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={fieldLabel} required color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <TextInput
              id={id}
              value={formModel[id] || ''}
              placeholder={t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, parentId })}
              error={formError[id]}
              secureTextEntry
              inputFieldStyle={[styles.inputField, input[field.inputStyle as InputStyleType]]}
              isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
              placeholderTextColor={Colors.neutral.g300}
              isNumericValue={numeric}
              maxValue={maxValue}
            />
          </View>
        );
      }
      case FIELD_TYPE.PHONE:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} required color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <TextInput
              id={id}
              value={formModel[id]}
              placeholder={t('strings.enterHere')}
              disabled={field.isDisabled}
              onInputChange={(text: string) => handleInputChange({ name: id, value: text, parentId })}
              error={formError[id]}
              inputFieldStyle={[styles.inputField, field.itemStyle]}
              isNumericKeyboard
              placeholderTextColor={Colors.neutral.g300}
            />
          </View>
        );
      case FIELD_TYPE.CHECKBOX:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Checkbox
              label={field.label}
              value={formModel[id]}
              required={required}
              id={id}
              error={formError[id]}
              onValueChange={(text: boolean) => handleInputChange({ name: id, value: text, parentId })}
              labelStyle={styles.checkboxLabelStyle}
            />
          </View>
        );
      case FIELD_TYPE.DROPDOWN:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <Dropdown
              queryName={field.queryName}
              queryParams={field.queryParams}
              error={formError[id]}
              id={id}
              selectedValue={formModel[id]}
              onSelect={(item: DataItem) => {
                handleInputChange({
                  name: id,
                  value: item,
                  parentId,
                  hasDependentChildren: JSON.parse(field.dependentFields),
                });
              }}
              iconStyle={styles.chevronIconStyle}
              innerContainerStyle={StyleSheet.flatten([styles.dropdownContainerStyle, field.itemStyle])}
              inputFieldStyle={styles.inputFieldStyle}
            />
          </View>
        );

      case FIELD_TYPE.SEARCH:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <Search
              value={formModel[id]}
              placeholder={field.label}
              onChange={(text: string) => handleInputChange({ name: id, value: text, parentId })}
              id={id}
              error={formError[id]}
              disabled={field.isDisabled}
              searchIconDisabled={!formModel[id]}
              searchStyles={field.itemStyle}
            />
          </View>
        );
      case FIELD_TYPE.DATE:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <DatePicker
              id={id}
              value={formModel[id]}
              onDateSelected={(text: string) => handleInputChange({ name: id, value: text, parentId })}
              inputStyle={[styles.inputField, field.itemStyle]}
              error={formError[id]}
              placeholder={field.label}
            />
          </View>
        );
      case FIELD_TYPE.BUTTON:
        return (
          <View
            key={id}
            style={[
              styles.buttonContainer,
              styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])],
              formItem[field.itemStyle as FormItemType],
              field.buttonStyle === BUTTON_TYPE.PRIMARY && styles.primaryButtonContainer,
              field.buttonStyle === BUTTON_TYPE.PRIMARY && styles[gcs('primaryButtonContainer', inflection, true, ['md', 'lg', 'xl'])],
            ]}
          >
            <Button
              label={field.label}
              onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, JSON.parse(field?.dependentFields))}
              style={[styles.buttonStyle, button[field.buttonStyle as ButtonType]]}
              type={field.buttonStyle}
              outline={field.buttonStyle === BUTTON_TYPE.SECONDARY}
            />
          </View>
        );
      case FIELD_TYPE.ACCORDION:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <AccordionWrapper
              isOpenDefault={field?.defaultSelectedValue}
              name={field.field_name}
              formData={values}
              queryName={field.queryName}
              onSelect={(selectedValue) =>
                handleInputChange({ name: '', value: '', hasDependentChildren: JSON.parse(field.dependentFields), parentId, dependentChildValue: selectedValue })
              }
              unSelectedValue={unSelectedValue}
              stateKey={stateKey}
            />
          </View>
        );

      case FIELD_TYPE.LABEL:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text style={styles.textStyle}>{field.label}</Text>
          </View>
        );

      case FIELD_TYPE.TABLE:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <TableWrapper
              queryName={field.queryName}
              queryParams={field.queryParams}
              tableColumns={field.columns}
              isDataRequiredForForm
              onTableDataSubmit={(tableRecords: TableRow[], tableRef: ParentObject) => {
                if (tableRecords) {
                  handleInputChange({
                    name: id,
                    value: tableRecords,
                  });
                }
                if (tableRef) {
                  setTableInstance(tableRef);
                }
              }}
            />
          </View>
        );
      case FIELD_TYPE.SELECT_LIST:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <SelectList headingText={field.label} error={formError[id]} onSelect={(value: object) => handleInputChange({ name: id, value })} />
          </View>
        );

      case FIELD_TYPE.LINK: {
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Link label={field.label} onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, JSON.parse(field?.dependentFields))} />
          </View>
        );
      }
      case FIELD_TYPE.AUTOCOMPLETE:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} required={required} color={Colors.neutral.black} style={styles.itemTextStyle} />
            <Autocomplete
              queryName={field.queryName}
              queryParams={field.queryParams}
              id={id}
              selectedValue={formModel[id]}
              onSelect={(text: ParentObject | null) => {
                handleInputChange({
                  name: id,
                  value: text,
                  hasDependentChildren: JSON.parse(field.dependentFields),
                });
              }}
              innerContainerStyle={StyleSheet.flatten([styles.dropdownContainerStyle, field.itemStyle])}
              error={formError[id]}
            />
          </View>
        );

      case FIELD_TYPE.MULTIPLE_SUB_ID:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <MultipleSubId
              type={STYLES.TYPE.SECONDARY}
              selectedId={formModel[id]}
              setDefaultNull={!field?.defaultSelectedValue}
              onSelect={(value: string | null) => handleInputChange({ name: id, value })}
            />
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
            />
          </View>
        );

      case FIELD_TYPE.RADIO_CONTAINER:
        return (
          <View key={id} style={[styles.itemViewStyle, styles[gcs('itemViewStyle', inflection, true, ['md', 'lg', 'xl'])], formItem[field.itemStyle as FormItemType]]}>
            <Text id={id} label={field.label} color={Colors.neutral.black} style={[styles.itemTextStyle, style.itemTextStyle]} />
            <RadioContainer
              selectedValue={formModel[id]}
              items={field.radioOptions ? JSON.parse(field.radioOptions) : []}
              onSelectionChange={(value: string) => handleInputChange({ name: id, value, parentId, fieldType: FIELD_TYPE.RADIO_CONTAINER })}
              queryName={field.queryName}
            />
          </View>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (formName) dispatch(actions.getFormData({ formName }, stateKey));
    dispatch(actions.setOffersBasisRechargeObject({}));

    return () => {
      dispatch(actions.setFormActionDefault({}, stateKey));
      dispatch(actions.setFormUpdated(false, stateKey));
      dispatch(actions.setSubIdListDefault());
    };
  }, [dispatch, formName]);

  useEffect(() => {
    if (formData) initForm();
  }, [formData, formValues, initForm]);

  useEffect(() => {
    if (isFormResetRequired) {
      resetForm();
    }
  }, [isFormResetRequired]);

  useEffect(() => {
    if (formQuery) {
      dispatch(callAction({}, formQuery, stateKey));
    }
  }, [formQuery]);

  const manageDependentField = (childKey: string, isVisible: boolean) => {
    const dependentFields = JSON.parse(form[childKey]?.dependentFields);
    const newValues: ParentObject = {};

    if (Array.isArray(dependentFields)) {
      dependentFields?.forEach((item: number) => {
        Object.entries(form).forEach(([key, value]: [string, ParentObject]) => {
          // call dropdown with value
          if (formData[value.field_name]?.queryName && dependentFields.includes(value.id) && isVisible) {
            dispatch(
              actions.fetchOptionData(
                {
                  [formData[value.field_name]?.queryParams]: formDependentData[childKey].id,
                },
                formData[value.field_name]?.queryName,
              ),
            );
          }
          if (value.id === item) {
            if (!(key in values)) {
              newValues[key] = '';
            }
            setForm((prevValue: ParentObject) => ({
              ...prevValue,
              [key]: {
                ...prevValue[key],
                isVisible,
              },
            }));
          }
        });
      });
    }

    setForm((prevValue: ParentObject) => ({
      ...prevValue,
      [childKey]: {
        ...prevValue[childKey],
        isVisible,
      },
    }));
  };

  const updateFieldsVisibility = (fieldsToShow: number[] = [], fieldsToHide: number[] = []) => {
    const updatedForm = { ...form };
    const updatedValues = { ...values };
    const updatedErrors: Record<string, string> = { ...errors };

    // Set visibility to true for fields to show
    fieldsToShow?.forEach((id) => {
      const key = Object.keys(updatedForm).find((key: string) => updatedForm[key].id === id);
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
      const key = Object.keys(updatedForm).find((key: string) => updatedForm[key].id === id);
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

  useEffect(() => {
    if (formDependentData) {
      Object.keys(formDependentData).forEach((childKey) => {
        const dependentField = form[childKey];
        const newValues: ParentObject = {};

        const parentKey: any = Object.keys(form).find((key) => form[key].id === dependentField.parentId);

        if (form[parentKey] && formDependentData[childKey].value === form[parentKey].dependencyValue) {
          manageDependentField(childKey, true);
        } else {
          manageDependentField(childKey, false);
        }

        newValues[childKey] = formDependentData[childKey].value;
        setValues((prevValue: ParentObject) => ({
          ...prevValue,
          ...newValues,
        }));
      });
    }
  }, [formDependentData]);

  useEffect(() => {
    const formFields = Object.values(form) as ParentObject[];
    const updateTypeField = formFields.find((field: ParentObject) => field.submitType === SUBMISSION.UPDATE);
    if (isFormUpdated && updateTypeField) {
      const fieldsToHide = [updateTypeField.id];
      const fieldsToShow = JSON.parse(updateTypeField.relatedFields);
      updateFieldsVisibility(fieldsToShow, fieldsToHide);
    } else if (updateTypeField) {
      const fieldsToShow = [updateTypeField.id];
      const fieldsToHide = JSON.parse(updateTypeField.relatedFields);
      updateFieldsVisibility(fieldsToShow, fieldsToHide);
    }
  }, [isFormUpdated]);

  const renderForm = (formJson: ParentObject) => {
    const formModel: ParentObject = values;

    const groupedFields: { [key: string]: ParentObject[] } = {};

    Object.entries(formJson).forEach(([id, field]: any) => {
      const groupId = field.groupId || `group-${id}`; // Use id as fallback if no groupId
      if (!groupedFields[groupId]) {
        groupedFields[groupId] = [];
      }
      groupedFields[groupId].push({ id, ...field });
    });

    return (
      <View style={[styles.formSubContainer, styles[gcs('formSubContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        {Object.entries(groupedFields).map(([groupId, fields]: any) => (
          <View key={groupId} style={[styles.groupContainer, styles[gcs('groupContainer', inflection, true, ['md', 'lg', 'xl'])], style.groupContainer]}>
            {fields.map((field: any) =>
              field.isVisible ? (
                <React.Fragment key={field.id}>
                  {renderFormControl(field.field_name, field)}
                  {(formModel?.[field.id] || !field.hasValue) && field?.subForm && renderForm(field?.subForm)}
                </React.Fragment>
              ) : null,
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={[styles.formContainer]} behavior="padding" keyboardVerticalOffset={isiOS() ? Sizing.layout.x20 : Sizing.layout.x60}>
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false} nestedScrollEnabled bounces={false} testID="form-builder">
        {renderForm(form)}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormBuilder;
