/**
 * Footer component for web and mobile
 *
 * @module components/Footer
 * @memberof - Common Component
 */
import React from 'react';
import { View } from 'react-native';
import Text from 'components/sales/Text';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import styles from './Footer.styles';

/**
 * Represents a Footer component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Footer
 */
const Footer = () => {
  const { inflection } = useInflection();

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.textStyle, styles[gcs('textStyle', inflection, true, ['sm', 'xs'])]]}>© Tata Play</Text>
      </View>
      <View>
        <Text style={[styles.textStyle, styles[gcs('textStyle', inflection, true, ['sm', 'xs'])]]}>Supervisor contact: Not available</Text>
      </View>
    </View>
  );
};

export default Footer;
