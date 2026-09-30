/**
 * to show text information
 *
 * @module components/InformationText
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from 'components/sales/Text';
import { VALUE_TYPE } from 'const';
import { formatValue } from 'utils/responseHelper';
import styles from './InformationText.styles';

/**
 * Component type definitions
 *
 * @typedef {object} InformationTextProps
 * @property {string} [text] - The content for the component
 */

export type InformationTextProps = {
  containerStyle?: object;
  primaryStyle?: object;
  secondaryStyle?: object;
  primaryText?: string;
  secondaryText?: string;
  separator?: string;
  type?: string;
  maxFontSize?: number;
};

/**
 * Represents a InformationText component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered InformationText component
 *
 * @example
 * <InformationText text="Hello World!" />
 */

const InformationText = ({
  primaryText,
  secondaryText,
  separator = '',
  containerStyle = {},
  primaryStyle = {},
  secondaryStyle = {},
  type = VALUE_TYPE.TEXT,
  maxFontSize,
}: InformationTextProps) => {
  const { t } = useTranslation();
  return (
    <View style={[containerStyle]}>
      <Text maxFontSize={maxFontSize} style={[styles.primaryText, primaryStyle]}>
        {t(`strings.${primaryText}`, { defaultValue: primaryText }) + separator}
      </Text>
      <Text maxFontSize={maxFontSize} style={[styles.secondaryText, secondaryStyle]}>
        {formatValue(type, secondaryText)}
      </Text>
    </View>
  );
};

export default InformationText;
