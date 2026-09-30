/**
 * This is a core component for custom Text input with props for features like placeholder, styles, change value, max length , min length, multiline etc.
 *
 * @component components/TextInput
 * @memberof - Common Component
 */
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput as RNTextInput, KeyboardTypeOptions, TextInputProps as RNTextInputProps, ViewStyle } from 'react-native';
import Text from 'components/sales/Text';
import { Colors, Sizing } from 'styles';
import { KEYBOARD_TYPE } from 'const';
import { useTranslation } from 'react-i18next';
import { scaleFont } from 'styles/dimentionHelper';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { isWeb } from 'utils/platformHelper';
import { NUMBER_REGEX } from 'const/regexes';
import { useEnglishInputValidation } from 'hooks/useEngInputValidation';
import styles from './TextInput.styles';

/**
 * Custom TextInputProps
 */
interface CustomTextInputProps extends RNTextInputProps {
  text?: string;
  onInputChange?: (text: string) => void;
  isNumericKeyboard?: boolean;
  isNumPaidKeyboard?: boolean;
  inputFieldStyle?: any;
  error?: string;
  errorStyle?: ViewStyle;
  id?: string;
  disabled?: boolean;
  readonly?: boolean;
  isNumericValue?: boolean;
  maxValue?: number;
  showRemainingCharacters?: boolean;
  maxFontSize?: number;
  minFontSize?: number;
  disabledInputFieldStyle?: any;
  placeholderTextColor?: string;
  isSearch?: boolean;
}

/**
 * Represents a TextInput component
 *
 * @component
 * @param {CustomTextInputProps} props - React properties passed from composition
 * @returns {JSX.Element} TextInput component
 */
const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(
  (
    {
      onInputChange,
      isNumericKeyboard = false,
      isNumPaidKeyboard = false,
      inputFieldStyle,
      error,
      errorStyle,
      id,
      disabled,
      readOnly,
      isNumericValue,
      maxValue,
      value,
      showRemainingCharacters = false,
      maxFontSize = Sizing.layout.x14,
      minFontSize,
      disabledInputFieldStyle,
      placeholderTextColor = Colors.violet.v350,
      isSearch = false,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const maxLengthValue = useMemo(() => (maxValue ? Number(maxValue) : undefined), [maxValue]);
    const [charactersLeft, setCharactersLeft] = useState<number>(maxLengthValue ?? 0);
    const { inflection } = useInflection();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { inputError: validationError, onInputChange: validateAndSet } = useEnglishInputValidation(onInputChange, value ?? '');

    const handleFocus = () => {
      if (inputRef.current && isWeb) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          window.scrollBy(0, -100); // Adjust as needed
        }, 300);
      }
    };
    useEffect(() => {
      setCharactersLeft(Number(maxLengthValue));
    }, [maxLengthValue]);

    useEffect(() => {
      const inputElement = inputRef.current;

      if (inputElement && isWeb) {
        inputElement.addEventListener('focus', handleFocus);
      }

      return () => {
        if (inputElement && isWeb) {
          inputElement.removeEventListener('focus', handleFocus);
        }
      };
    }, []);

    const handleChangeText = (inputText: string) => {
      const newValue = isNumericValue ? inputText.replace(NUMBER_REGEX, '') : inputText;

      validateAndSet(newValue || '');

      if (showRemainingCharacters && maxLengthValue) {
        setCharactersLeft(maxLengthValue - newValue.length);
      }
    };

    const getStyleFontSize = () => {
      if (Array.isArray(inputFieldStyle)) {
        const newStyle = inputFieldStyle.reduce((acc, current) => ({ ...acc, ...current }), {});
        return newStyle.fontSize;
      }
      return inputFieldStyle?.fontSize;
    };
    const scaledFontSize = scaleFont(getStyleFontSize() ?? Sizing.layout.x16, maxFontSize, minFontSize);

    return (
      <>
        <RNTextInput
          ref={ref}
          testID="input-test"
          onFocus={handleFocus}
          multiline={!isWeb && props.multiline}
          numberOfLines={!isWeb && props.multiline ? 2 : 1}
          textAlignVertical={!isWeb && props.multiline ? 'top' : 'center'}
          style={[
            styles.inputField,
            styles[gcs('inputField', inflection, true, ['md', 'lg', 'xl'])],
            inputFieldStyle,
            disabled && styles.disabledInput,
            disabled && disabledInputFieldStyle,
            { fontSize: scaledFontSize },
          ]}
          keyboardType={((isNumPaidKeyboard && KEYBOARD_TYPE.NUMBER_PAD) || (isNumericKeyboard && KEYBOARD_TYPE.NUMERIC) || KEYBOARD_TYPE.DEFAULT) as KeyboardTypeOptions}
          onChangeText={handleChangeText}
          value={value}
          readOnly={!!disabled || readOnly}
          maxLength={maxLengthValue}
          {...props}
          autoComplete="new-password"
          placeholderTextColor={placeholderTextColor}
        />

        {showRemainingCharacters && <Text label={charactersLeft + t('validations.descriptionMaxLength')} color={Colors.neutral.black} style={styles.remainingCharactersText} />}

        {!isSearch && (error || validationError) && <Text id={`${id}error`} style={[styles.errorText, errorStyle]} label={validationError ?? error} color={Colors.error.primary} />}
      </>
    );
  },
);

export default TextInput;
