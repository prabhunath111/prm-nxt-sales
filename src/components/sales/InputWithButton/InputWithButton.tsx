/**
 * This component will have input box and button for the msales application
 *
 * @module components/InputWithButton
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from 'components/sales/Button';
import { TYPE } from 'const/styles';
import { Colors } from 'styles';
import { ICONS, KEYBOARD_TYPE, STATE_KEY, VALIDATIONS } from 'const';
import { InputStyleType } from 'styles/forms';
import { ParentObject } from 'store/sales/types/common';
import IconTextInput from 'components/sales/IconTextInput';
import Text from 'components/sales/Text';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './InputWithButton.styles';

/**
 * Component type definitions
 *
 * @typedef {object} InputWithButtonProps
 * @property {string} [id] - Id of the input button
 * @property {object} [field] - Field of the input
 * @property {object} [formModel] - Form model of the input
 * @property {object} [formError] - Form errors of the input
 * @property {function} [handleInputChange] - handleInputChange will triggered when input will be changed
 * @property {function} [handleSubmit] - handleSubmit will triggered when we click on the submit button
 * @property {function} [input] - this is the type of the style
 */

interface InputWithButtonProps {
  id: string;
  field: ParentObject;
  formModel: { [key: string]: string };
  formError: { [key: string]: string };
  handleInputChange: (args: { name: string; value: string; hasDependentChildren: number[]; parentId?: number }) => void;
  handleSubmit: (submitType: string, queryName: string, routeName?: string, optionalParam?: ParentObject) => void;
  input: ParentObject;
  stateKey?: string;
}
/**
 * Represents a InputWithButton component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered InputWithButton component
 *
 * @example
 * <InputWithButton text="Hello World!" />
 */

const InputWithButton = ({ id, field, formModel, formError, handleInputChange, handleSubmit, input, stateKey = STATE_KEY.FORM_STATE }: InputWithButtonProps) => {
  const { t } = useTranslation();
  const numeric = field?.validation?.some((validation: ParentObject) => validation?.type === VALIDATIONS.NUMERIC);
  const maxValue = field?.validation?.find((item: ParentObject) => item?.type === VALIDATIONS.FIX_LENGTH || item?.type === VALIDATIONS.MAX_LENGTH)?.value ?? null;
  const { updatedFormFields } = useSelector((state: RootState) => state.form[stateKey]);
  const [inputValue, setinputValue] = useState(updatedFormFields[id]);

  useEffect(() => {
    if (formModel[id]) {
      setinputValue(formModel[id]);
    } else if (formModel[id] === null) {
      setinputValue('');
    }
  }, [formModel]);

  return (
    <View key={id} style={[styles.itemViewStyle]} testID="image-test">
      <Text id={id} label={field.label} style={styles.itemTextStyle} />
      <IconTextInput
        id={id}
        value={inputValue || ''}
        placeholder={field.placeholderText}
        disabled={field.isDisabled}
        onInputChange={(text: string) =>
          handleInputChange({
            name: id,
            value: text,
            hasDependentChildren: JSON.parse(field.dependentFields),
          })
        }
        error={formError[id]}
        inputFieldStyle={input[field.inputStyle as InputStyleType]}
        isNumericKeyboard={field.validation?.some((validation: ParentObject) => validation.type === KEYBOARD_TYPE.NUMERIC)}
        placeholderTextColor={Colors.violet.v200}
        isNumericValue={numeric}
        maxValue={maxValue}
        leftIconName={field?.iconName ? ICONS[field.iconName as keyof typeof ICONS] : undefined}
        containerStyle={styles.inputContainerStyle}
      />
      <Button
        label={t('strings.recharge')}
        onPress={() => handleSubmit(field.submitType, field.queryName, field?.routeName, { [id]: formModel[id] })}
        type={TYPE.SECONDARY}
        outline
        labelStyle={styles.buttonLabelStyle}
        style={styles.buttonStyle}
      />
    </View>
  );
};

export default InputWithButton;
