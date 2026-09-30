/**
 * This component is a toggle switch used to enable or disable a setting.
 *
 * @module components/ToggleSwitch
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Switch } from 'react-native';
import { Colors } from 'styles';
import Text from 'components/sales/Text';
import styles from './ToggleSwitch.styles';

/**
 * Component type definitions
 *
 * @typedef {object} ToggleSwitchProps
 * @property {string} [label] - The content for the component
 * @property {string} [queryName] - Query name to perform any actions
 * @property {string} [queryParams] - Query params
 */

export type ToggleSwitchProps = {
  label?: string;
  onValueChange?: any;
  selectedValue?: boolean;
  testID?: string;
};

/**
 * Represents a ToggleSwitch component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered ToggleSwitch component
 *
 * @example
 * <ToggleSwitch text="Hello World!" />
 */

const ToggleSwitch = ({ label, onValueChange, selectedValue = false, testID }: ToggleSwitchProps) => {
  const toggleValue = !!selectedValue;
  const onChangeToggle = () => {
    if (onValueChange) {
      onValueChange(!toggleValue);
    }
  };
  return (
    <View style={styles.container} testID={testID || 'toggleSwitchTest'}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: Colors.neutral.g300, true: Colors.appColors.pink400 }}
          thumbColor={Colors.neutral.white}
          onValueChange={onChangeToggle}
          value={toggleValue}
          style={styles.switchStyle}
        />
        <View style={[styles.thumbBorder, toggleValue ? styles.thumbEnable : styles.thumbDisable]} />
      </View>
    </View>
  );
};

export default ToggleSwitch;
