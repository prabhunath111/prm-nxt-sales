/**
 * react native link common component
 *
 * @module components/Link
 * @memberof - Common Component
 */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { isWeb } from 'utils/platformHelper';
import { Link as RNWebLink } from 'react-router-dom';
import { Link as RNMobileLink } from '@react-navigation/native';
import Text from 'components/sales/Text';
import styles from './Link.styles';

/**
 * @typedef {object} LinkProps
 * @property {Function} [onPress] - Function to be called when the link is pressed.
 * @property {string} label - The label or text to be displayed for the link.
 * @property {object} [linkStyle] - Custom styles to be applied to the link component.
 * @property {object} [labelStyle] - Custom styles to be applied to the label text.
 * @property {boolean} [isNavigation] - Flag to determine if the link is for navigation.
 * @property {string} [redirectTo] - The route or URL to redirect to when the link is pressed.
 */

export type LinkProps = {
  onPress?: () => void;
  label: string;
  linkStyle?: object;
  labelStyle?: object;
  isNavigation?: boolean;
  redirectTo?: string;
};

/**
 * Represents a Link component.
 *
 * @component
 * @param {LinkProps} props - React properties passed from composition.
 * @returns {JSX.Element} The Link component.
 */
const Link = ({ onPress, label, labelStyle, linkStyle, isNavigation, redirectTo = '/', ...props }: LinkProps) => {
  const RNLink = isWeb ? RNWebLink : RNMobileLink;
  return (
    <View style={[styles.link, linkStyle]}>
      {isNavigation ? (
        <View>
          <RNLink to={redirectTo}>
            <Text style={[styles.label, labelStyle]} label={label} />
          </RNLink>
        </View>
      ) : (
        <TouchableOpacity onPress={onPress} {...props}>
          <Text style={[styles.label, labelStyle]} label={label} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Link;
