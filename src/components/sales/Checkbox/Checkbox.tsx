/**
 * This is a generic checkbox component created for React Native for Web and mobile.
 * @module components/Checkbox
 * @memberof CommonComponent
 *
 */
import React, { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Text from 'components/sales/Text';
import { Colors, Sizing, Typography } from 'styles';
import Image from 'components/sales/Image';
import { ICONS, STRINGS } from 'const';
import { useTranslation } from 'react-i18next';
import styles from './Checkbox.styles';

/**
 * Represents the props accepted by the Checkbox component.
 * @typedef {object} CheckboxProps
 * @property {string} label - The label text for the checkbox.
 * @property {object} [labelStyle] - Additional styles for the label text.
 * @property {boolean} [value] - The current value of the checkbox.
 * @property {boolean} [required] - Indicates whether the checkbox is required.
 * @property {string} [error] - The error message to display, if any.
 * @property {string} [id] - The unique identifier for the checkbox.
 * @property {CheckboxOnChange} [onValueChange] - Callback function invoked when the checkbox value changes.
 * @property {object} [activeIconProps] - Additional props for the active (checked) icon.
 * @property {object} [inactiveIconProps] - Additional props for the inactive (unchecked) icon.
 */

/**
 * Represents a callback function invoked when the checkbox value changes.
 * @callback CheckboxOnChange
 * @param {boolean} value - The new value of the checkbox.
 * @returns {void}
 */

export type CheckboxProps = {
  label: string;
  subLabel?: string;
  labelStyle?: object;
  value?: boolean;
  required?: boolean;
  hideRequired?: boolean;
  error?: string;
  id?: string | undefined;
  testID?: string;
  onValueChange?: (value: boolean) => void;
  activeIconProps?: object;
  inactiveIconProps?: object;
};

/**
 * Represents a Checkbox component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns Checkbox
 */
const Checkbox = ({
  label,
  subLabel,
  labelStyle,
  hideRequired,
  required,
  error,
  id,
  testID,
  value,
  onValueChange,
  activeIconProps = {},
  inactiveIconProps = {},
}: CheckboxProps): React.ReactNode => {
  const [checked, setChecked] = useState(value);

  useEffect(() => {
    setChecked(value || false);
  }, [value]);

  const { i18n } = useTranslation();

  const handlePress = () => {
    const val = !checked;
    setChecked(val);
    onValueChange?.(val);
  };

  const iconProps = checked ? activeIconProps : inactiveIconProps;
  return (
    <View testID={testID || 'checkbox-test'}>
      <View style={styles.checkboxContainer}>
        <Pressable style={[styles.checkboxBase, checked ? styles.checkboxChecked : {}]} onPress={handlePress}>
          {checked && <Image iconName={ICONS.CHECKMARK} width={Sizing.layout.x1} height={Sizing.layout.x1} style={[styles.iconStyle, iconProps]} />}
        </Pressable>
        <View style={styles.labelContainer}>
          <Pressable onPress={handlePress}>
            <Text style={[styles.label, labelStyle]} label={label} required={required && !hideRequired} />
          </Pressable>
        </View>
      </View>
      {error && <Text id={`${id}error`} style={styles.errorText} label={error} color={Colors.error.primary} />}
      {subLabel ? <Text style={[styles.subLabel, i18n.language !== STRINGS.EN && { ...Typography.lineHeight.x16 }]} label={subLabel} maxFontSize={Sizing.layout.x12} /> : null}
    </View>
  );
};

export default Checkbox;
