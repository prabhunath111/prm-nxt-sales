/**
 * to show white background
 *
 * @module components/CustomFallback
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import styles from './CustomFallback.styles';

/**
 * Represents a CustomFallback component
 *
 * @returns {JSX.Element} The rendered CustomFallback component
 *
 * @example
 * <CustomFallback />
 */

const CustomFallback = () => <View style={styles.container} testID="fallback-test" />;

export default CustomFallback;
