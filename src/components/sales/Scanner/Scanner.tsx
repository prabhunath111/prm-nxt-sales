/**
 * To scan the barcode or QR from mobile
 *
 * @module components/Scanner
 * @memberof - Common Component
 */
import React from 'react';
import { View } from 'react-native';
import Camera from 'components/sales/Camera';
import { isWeb } from 'utils/platformHelper';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type ScannerProps = {
  isActive?: boolean;
  isScanner?: boolean;
  isFocusable?: boolean;
  audio?: boolean;
  onScan?: (value: any) => void;
};

/**
 * Represents a Scanner component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Scanner
 */
const Scanner = ({ isActive = true, isScanner = false, isFocusable = false, audio = false, onScan }: ScannerProps) => (
  <View>
    {isWeb ? (
      <Camera isScanner={isScanner} audio={audio} onScan={onScan} />
    ) : (
      <Camera isScanner={isScanner} onScan={onScan} isActive={isActive} audio={audio} isFocusable={isFocusable} />
    )}
  </View>
);

export default Scanner;
