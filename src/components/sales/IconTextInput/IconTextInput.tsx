/**
 * Represents a TextInput component with optional left and right icons.
 *
 * @module components/IconTextInput
 * @memberof CommonComponent
 */

import React from 'react';
import { Pressable, TextInputProps, View } from 'react-native';
import Image from 'components/sales/Image';
import TextInput from 'components/sales/TextInput';
import Text from 'components/sales/Text';
import { Colors } from 'styles';
import styles from './IconTextInput.styles';

/**
 * Component type definitions
 *
 * @typedef {Object} IconTextInputProps
 * @property {string} [leftIconName] - The name of the left icon.
 * @property {string} [rightIconName] - The name of the right icon.
 * @property {Object} [leftIconStyle] - Style object for the left icon.
 * @property {Object} [rightIconStyle] - Style object for the right icon.
 * @property {Function} [onIconPress] - Callback function when an icon is pressed.
 * @property {Object} [inputFieldStyle] - Style object for the input field.
 * @property {Object} [disabledInputFieldStyle] - Style object when the input is disabled.
 * @property {Function} [onInputChange] - Callback function when the input value changes.
 * @property {boolean} [isNumericKeyboard] - Whether to display a numeric keyboard.
 * @property {string} [error] - Error message to display below the input.
 * @property {Object} [errorStyle] - Style object for the error text.
 * @property {string} [id] - Unique identifier for the input.
 * @property {boolean} [disabled] - Whether the input is disabled.
 * @property {boolean} [readOnly] - Whether the input is read-only.
 * @property {boolean} [isNumericValue] - Whether the value should be treated as a numeric value.
 * @property {number} [maxValue] - Maximum allowable value for numeric inputs.
 * @property {boolean} [showRemainingCharacters] - Whether to show remaining characters for input limits.
 * @property {number} [maxFontSize] - Maximum font size for the input text.
 * @property {number} [minFontSize] - Minimum font size for the input text.
 * @property {Object} [containerStyle] - Style object for the input container.
 */

interface IconTextInputProps extends TextInputProps {
  leftIconName?: string;
  rightIconName?: string | null;
  leftIconStyle?: object;
  rightIconStyle?: object;
  onIconPress?: () => void;
  inputFieldStyle?: object;
  disabledInputFieldStyle?: object;
  onInputChange?: (text: string) => void;
  isNumericKeyboard?: boolean;
  error?: string;
  errorStyle?: object;
  id?: string;
  disabled?: boolean;
  readonly?: boolean;
  isNumericValue?: boolean;
  maxValue?: number;
  showRemainingCharacters?: boolean;
  maxFontSize?: number;
  minFontSize?: number;
  containerStyle?: object;
  placeholderTextColor?: string;
}

/**
 * Icon component to render icons within the IconTextInput
 *
 * @typedef {Object} IconProps
 * @property {string} iconName - The name of the icon to display.
 * @property {Object} [style] - Optional style to apply to the icon.
 * @property {Function} [onPress] - Optional function to handle icon press events.
 */

type IconProps = {
  iconName: string;
  style?: object;
};

const Icon = React.memo(({ iconName, style }: IconProps) => <Image iconName={iconName} style={[styles.iconStyle, style]} isDimension={false} />);

/**
 * Represents a TextInput component with optional left and right icons.
 *
 * @param {IconTextInputProps} props - Properties passed to the component
 * @returns {JSX.Element} The rendered IconTextInput component
 *
 * @example
 * <IconTextInput
 *   leftIconName="search"
 *   rightIconName="clear"
 *   onIconPress={() => handleIconPress()}
 *   onInputChange={(text) => handleInputChange(text)}
 *   error="Invalid input"
 * />
 */

const IconTextInput = ({
  leftIconName,
  rightIconName,
  leftIconStyle,
  rightIconStyle,
  onIconPress,
  onInputChange,
  isNumericKeyboard,
  inputFieldStyle,
  error,
  errorStyle,
  id,
  disabled,
  readOnly,
  isNumericValue,
  maxValue,
  value,
  maxFontSize,
  minFontSize,
  disabledInputFieldStyle,
  containerStyle,
  placeholderTextColor = Colors.violet.v200,
  ...props
}: IconTextInputProps) => (
  <View style={styles.topContainer}>
    <View style={[styles.container, containerStyle, disabled && styles.disabledContainer]}>
      {leftIconName ? (
        <Pressable onPress={onIconPress} style={styles.iconContainer}>
          <Icon iconName={leftIconName} style={leftIconStyle} />
        </Pressable>
      ) : null}
      <TextInput
        id={id}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        maxFontSize={maxFontSize}
        minFontSize={minFontSize}
        maxValue={maxValue}
        onInputChange={onInputChange}
        isNumericKeyboard={isNumericKeyboard}
        isNumericValue={isNumericValue}
        placeholderTextColor={placeholderTextColor}
        inputFieldStyle={[styles.inputFieldStyle, inputFieldStyle]}
        disabledInputFieldStyle={[styles.disabledInputFieldStyle, disabledInputFieldStyle]}
        {...props}
      />
      {rightIconName ? (
        <Pressable onPress={onIconPress} style={styles.iconContainer}>
          <Icon iconName={rightIconName} style={rightIconStyle} />
        </Pressable>
      ) : null}
    </View>
    {error && <Text id={`${id}error`} style={[styles.errorText, errorStyle]} label={error} />}
  </View>
);

export default IconTextInput;
