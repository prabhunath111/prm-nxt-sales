/**
 * this screen used in the exclusive store
 *
 * @module components/DemoForm
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { callAction } from 'utils/formBuilderHelper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { Button, Checkbox, DateAndTimeDetails, IconTextInput, Text, ToggleSwitch } from 'components/sales';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import Autocomplete from 'components/sales/Autocomplete';
import i18next, { t } from 'i18next';
import { ACCOUNT_INFO, ALERT, MODAL, QUERY, ROUTE, STRINGS, STYLES, VALIDATIONS } from 'const';
import { Sizing } from 'styles';
import { ParentObject } from 'store/sales/types/common';
import uiActions from 'store/sales/actions/ui';
import useNavigate from 'hooks/useNavigate';
import styles from './DemoForm.styles';

/**
 * Component prop types.
 *
 * @typedef {object} DemoFormProps
 * @property {string} [text] - The text to display inside the component.
 */
export type DemoFormProps = {
  text?: string;
};

type DemoFormData = {
  name: string;
  mobileNumber: string;
  email: string;
  existingBox: boolean;
  subscriberId?: string;
  connectionType?: string;
  multiTVConnection: boolean;
  multiTVConnectionType?: string;
  answers: Record<string, string | boolean>;
  questions: string;
  connectionProvider: string;
};

interface StoreQuestion {
  QUESTIONID: number;
  QUESTIONSDESC: string;
  QUESTIONTYPE: string;
  DISPLAYVALUES?: string;
  DEFAULTVALUES?: string;
}
/**
 * Represents a DemoForm component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const DemoForm = () => {
  const [isExistingBox, setIsExistingBox] = useState(false);
  const [isMultiTVConnection, setIsMultiTVConnection] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    mobileNumber: '',
    email: '',
    existingBox: false,
    subscriberId: '',
    connectionType: '',
    multiTVConnection: false,
    multiTVConnectionType: '',
    answers: {},
    questions: '',
    connectionProvider: '',
  });
  const { inflection } = useInflection();
  const { demoFormQuestions, multiTvData } = useSelector((state: RootState) => state.exclusiveStore);

  useEffect(() => {
    dispatch(uiActions.hideBottomModal());
    dispatch(callAction({}, QUERY.getStoreOpeningStoreClosingData, ''));
  }, [dispatch]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case STRINGS.NAME:
        if (!value.trim()) return t('errors.nameRequired');
        if (value.length > 26) return t('errors.nameMaxLength');
        if (!/^[A-Za-z ]+$/.test(value)) return t('errors.nameInvalidCharacters');
        return '';

      case STRINGS.MOBILE_NUMBER:
        if (!value.trim()) return t('errors.mobileRequired');
        if (!/^\d+$/.test(value)) return t('errors.mobileDigitsOnly');
        if (value.length !== 10) return t('errors.mobile10Digits');
        if (!/^[6-9]/.test(value)) return t('errors.mobileShouldStartWith');
        return '';

      case VALIDATIONS.EMAIL:
        if (!value) return t('errors.emailRequired');
        if (value.length > 254 || !/^[^\s@]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(value)) {
          return t('errors.invalidEmailAddress');
        }
        return '';

      case STRINGS.CONNECTION_PROVIDER:
        if (!value) return t('errors.connectionProviderRequired');
        return '';

      case STRINGS.SUBSCRIBER_ID:
        if (!value.trim()) return t('errors.SubIDRequired');
        return '';

      case ACCOUNT_INFO.connectionType:
        if (!value.trim()) return '';
        return '';

      case STRINGS.MULTI_TV_CONNECTION_TYPE:
        if (!value.trim()) return '';
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    let newValue = value;
    if (name === STRINGS.NAME && typeof newValue === 'string') {
      newValue = newValue.replace(/[^A-Za-z ]/g, '').slice(0, 26);
    }
    if (name === STRINGS.MOBILE_NUMBER && typeof newValue === 'string') {
      newValue = newValue.replace(/[^0-9]/g, '').slice(0, 10);
    }
    if (name === STRINGS.SUBSCRIBER_ID && typeof newValue === 'string') {
      newValue = newValue.replace(/[^0-9]/g, '').slice(0, 10);
    }
    if (name in formData) {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    } else {
      setFormData((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [name]: newValue,
        },
      }));
    }
    if (typeof newValue === 'string') {
      const errorMsg = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
    return null;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    newErrors[STRINGS.NAME] = validateField(STRINGS.NAME, formData.name);
    newErrors[STRINGS.MOBILE_NUMBER] = validateField(STRINGS.MOBILE_NUMBER, formData.mobileNumber);
    newErrors[VALIDATIONS.EMAIL] = validateField(VALIDATIONS.EMAIL, formData.email);

    if (!isExistingBox) {
      newErrors[STRINGS.CONNECTION_PROVIDER] = validateField(STRINGS.CONNECTION_PROVIDER, formData.connectionProvider);
    }

    if (isExistingBox) {
      newErrors[STRINGS.SUBSCRIBER_ID] = validateField(STRINGS.SUBSCRIBER_ID, formData.subscriberId || '');
      newErrors[ACCOUNT_INFO.connectionType] = validateField(ACCOUNT_INFO.connectionType, formData.connectionType || '');
    }

    if (isMultiTVConnection) {
      newErrors[STRINGS.MULTI_TV_CONNECTION_TYPE] = validateField(STRINGS.MULTI_TV_CONNECTION_TYPE, formData.multiTVConnectionType || '');
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((msg) => msg);
  };

  const handleDropdownChange = (key: string, item: ParentObject) => {
    handleInputChange(key, item?.object?.value || item?.name);
  };

  const questions = demoFormQuestions?.resultStoreActionQues || [];

  useEffect(() => {
    questions.forEach((q: any) => {
      if (q.QUESTIONTYPE === STRINGS.BOOLEAN) {
        const id = `${q.QUESTIONID}`;
        const defaultValue = q.DEFAULTVALUES?.toLowerCase() === STRINGS.YES_LOWER;

        if (formData.answers[id] === undefined) {
          handleInputChange(id, defaultValue);
        }
      }
    });
  }, [questions]);
  const renderQuestionInput = (question: StoreQuestion) => {
    const { QUESTIONTYPE, DISPLAYVALUES, QUESTIONID, DEFAULTVALUES } = question;
    const options = DISPLAYVALUES ? DISPLAYVALUES.split('~') : [];

    switch (QUESTIONTYPE) {
      case STRINGS.CHECKBOX:
        return (
          <View style={styles.checkboxGroup}>
            {options.map((opt) => {
              const optionLabel = opt.trim();
              const storedValue = (formData.answers[QUESTIONID] as string) || '';
              const selectedValues = storedValue ? storedValue.split(',').map((v) => v.trim()) : [];
              const isChecked = selectedValues.includes(optionLabel);

              return (
                <Checkbox
                  testID={`dynamic-checkbox-${QUESTIONID}-${optionLabel}`}
                  key={`${QUESTIONID}_${opt.trim()}`}
                  label={opt.trim()}
                  value={isChecked}
                  onValueChange={(checked) => {
                    let updatedValues = [...selectedValues];
                    if (checked) {
                      if (!updatedValues.includes(optionLabel)) {
                        updatedValues.push(optionLabel);
                      }
                    } else {
                      updatedValues = updatedValues.filter((v) => v !== optionLabel);
                    }
                    handleInputChange(`${QUESTIONID}`, updatedValues.join(','));
                  }}
                />
              );
            })}
          </View>
        );

      case STRINGS.BOOLEAN: {
        const currentValue = formData.answers[`${QUESTIONID}`];
        const parsedValue = typeof currentValue === 'boolean' ? currentValue : currentValue?.toString().toLowerCase() === STRINGS.YES_LOWER;
        return (
          <View style={styles.booleanGroup}>
            <ToggleSwitch testID={`dynamic-toggle-${QUESTIONID}`} onValueChange={(val: boolean) => handleInputChange(`${QUESTIONID}`, val)} selectedValue={parsedValue} />
          </View>
        );
      }
      case STRINGS.TEXT_INPUT:
        return (
          <IconTextInput
            testID={`dynamic-input-${QUESTIONID}`}
            placeholder={DEFAULTVALUES || ''}
            value={(formData.answers[QUESTIONID] as string) || ''}
            onInputChange={(text) => handleInputChange(`${QUESTIONID}`, text)}
          />
        );

      default:
        return null;
    }
  };

  const getUnansweredQuestions = () => {
    const unanswered: string[] = [];
    questions.forEach((q: StoreQuestion) => {
      const id = `${q.QUESTIONID}`;
      const value = formData.answers[id];
      if (q.QUESTIONTYPE === STRINGS.TEXT_INPUT && (!value || String(value).trim() === '')) {
        unanswered.push(q.QUESTIONSDESC);
      } else if (q.QUESTIONTYPE === STRINGS.CHECKBOX && (!value || String(value).trim() === '')) {
        unanswered.push(q.QUESTIONSDESC);
      } else if (q.QUESTIONTYPE === STRINGS.BOOLEAN && value === undefined) {
        unanswered.push(q.QUESTIONSDESC);
      }
    });

    return unanswered;
  };

  const handelProceed = () => {
    if (!validateForm()) {
      return;
    }
    const unanswered = getUnansweredQuestions();
    if (unanswered.length > 0) {
      const alertMessage = `${i18next.t('strings.allRequiredAns')}`;
      dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.WARNING,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
          },
          {},
        ),
      );
      return;
    }
    if (formData.existingBox) {
      setFormData((prev) => ({ ...prev, connectionProvider: '' }));
    }
    const questionIds: string[] = [];
    const answersList: string[] = [];

    Object.entries(formData.answers).forEach(([questionId, answer]) => {
      questionIds.push(questionId);
      if (typeof answer === 'boolean') {
        answersList.push(answer ? VALIDATIONS.YES : VALIDATIONS.NO);
      } else {
        answersList.push(String(answer));
      }
    });

    const questionString = questionIds.join('~');
    const answerString = answersList.join('~');
    const normalizedFormData = Object.entries(formData).reduce(
      (acc, [key, val]) => {
        if (typeof val === 'boolean') {
          acc[key] = val ? VALIDATIONS.YES : VALIDATIONS.NO;
        } else if (key === STRINGS.ANSWERS) {
          acc[key] = answerString;
        } else {
          acc[key] = val;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    const finalData = {
      ...normalizedFormData,
      questions: questionString,
      answers: answerString,
    };
    dispatch(callAction({ finalData }, QUERY.submitDemoForm, '', navigate));
  };
  const handleCancel = () => {
    navigate(ROUTE.WEB.EXCLUSIVE_STORE);
  };

  return (
    <SafeAreaView style={[styles.container]} testID="BoxUpgradeSuccess">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <View>
            <Text style={styles.headerText}>{t('strings.demoForm')}</Text>
          </View>
          <View>
            <DateAndTimeDetails name={false} />
          </View>
          <View style={styles.inputContationer}>
            <View style={styles.inputGroup}>
              <Text label={t('strings.name')} required />
              <IconTextInput testID="input-name" value={formData.name} onInputChange={(text) => handleInputChange(STRINGS.NAME, text)} />
              {errors[STRINGS.NAME] ? <Text style={styles.errorText}>{errors[STRINGS.NAME]}</Text> : null}
            </View>
            <View style={styles.inputGroup}>
              <Text label={t('strings.mobileNumber')} required />
              <IconTextInput
                testID="input-mobile"
                value={formData.mobileNumber}
                onInputChange={(text) => handleInputChange(STRINGS.MOBILE_NUMBER, text)}
                isNumericValue
                isNumericKeyboard
              />
              {errors[STRINGS.MOBILE_NUMBER] ? <Text style={styles.errorText}>{errors[STRINGS.MOBILE_NUMBER]}</Text> : null}
            </View>
            <View style={styles.inputGroup}>
              <Text label={t('strings.emailAddress')} required />
              <IconTextInput testID="input-email" value={formData.email} onInputChange={(text) => handleInputChange(VALIDATIONS.EMAIL, text)} />
              {errors[VALIDATIONS.EMAIL] ? <Text style={styles.errorText}>{errors[VALIDATIONS.EMAIL]}</Text> : null}
            </View>
          </View>
          <View style={styles.existingSubID}>
            <View>
              <Checkbox
                testID="checkbox-existing-box"
                label={t('strings.existingBox')}
                value={false}
                onValueChange={(checked: boolean) => {
                  setIsExistingBox(checked);
                  handleInputChange(STRINGS.EXITSING_BOX, checked);
                }}
                labelStyle={styles.checkboxLabelStyle}
              />
            </View>
            {isExistingBox && (
              <View>
                <View style={styles.inputGroup}>
                  <Text label={t('strings.subId')} required />
                  <IconTextInput testID="input-subid" value={formData.subscriberId} onInputChange={(text) => handleInputChange(STRINGS.SUBSCRIBER_ID, text)} />
                  {errors[STRINGS.SUBSCRIBER_ID] ? <Text style={styles.errorText}>{errors[STRINGS.SUBSCRIBER_ID]}</Text> : null}
                  <Text label={t('strings.connectionType')} required />
                  <Autocomplete
                    testID="autocomplete-connection-type"
                    placeholder={t('strings.selectConnectionType')}
                    containerStyle={styles.outerContainer}
                    innerContainerStyle={styles.innerDropDown}
                    queryName={STRINGS.CATEGORY_DROPDOWN}
                    onSelect={(item) => handleDropdownChange(ACCOUNT_INFO.connectionType, item!)}
                    isCloseIconRequired={false}
                    queryParams="searchLocally"
                    actionNeeded={false}
                    data={multiTvData?.result?.boxType}
                  />
                </View>
              </View>
            )}
            {!isExistingBox && (
              <View style={styles.inputGroup}>
                <Text label={t('strings.connectionProvider')} required />
                <IconTextInput
                  testID="input-connection-provider"
                  value={formData.connectionProvider}
                  onInputChange={(text) => handleInputChange(STRINGS.CONNECTION_PROVIDER, text)}
                />
                {errors[STRINGS.CONNECTION_PROVIDER] ? <Text style={styles.errorText}>{errors[STRINGS.CONNECTION_PROVIDER]}</Text> : null}
              </View>
            )}
          </View>
          {isExistingBox && (
            <View style={styles.multiTVConnection}>
              <View>
                <Checkbox
                  testID="checkbox-multi-tv"
                  label={t('strings.multiTvConnection')}
                  value={false}
                  onValueChange={(checked: boolean) => {
                    setIsMultiTVConnection(checked);
                    handleInputChange(STRINGS.MULTI_TV, checked);
                  }}
                  labelStyle={styles.checkboxLabelStyle}
                />
              </View>
              {isMultiTVConnection && (
                <View>
                  <View style={styles.inputGroup}>
                    <Text label={t('strings.connectionType')} required />
                    <Autocomplete
                      testID="autocomplete-multi-tv-connection"
                      placeholder={t('strings.selectConnectionType')}
                      containerStyle={styles.outerContainer}
                      innerContainerStyle={styles.innerDropDown}
                      queryName={STRINGS.CATEGORY_DROPDOWN}
                      onSelect={(item) => handleDropdownChange(STRINGS.MULTI_TV_CONNECTION_TYPE, item!)}
                      isCloseIconRequired={false}
                      queryParams="searchLocally"
                      actionNeeded={false}
                      data={multiTvData?.result?.boxType}
                    />
                  </View>
                </View>
              )}
            </View>
          )}
          <View>
            <View style={styles.questions}>
              {questions.map((question: any, i: number) => (
                <View key={question.QUESTIONID} style={styles.questionCard}>
                  <Text label={`${i + 1}. ${question.QUESTIONSDESC}`} style={styles.questionTitle} required />
                  {renderQuestionInput(question)}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={[styles.buttonInnerContainer, styles[gcs('buttonInnerContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
            <Button onPress={handelProceed} label={t('strings.proceed')} fontSize={Sizing.layout.x16} />
            <Button onPress={handleCancel} label={t('strings.cancel')} fontSize={Sizing.layout.x16} outline type={STYLES.TYPE.SECONDARY} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(DemoForm);
