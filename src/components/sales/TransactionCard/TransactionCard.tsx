/**
 * details of transaction
 *
 * @module components/TransactionCard
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { STRINGS, VALUE_TYPE } from 'const';
import { formatValue } from 'utils/responseHelper';
import { Colors } from 'styles';
import Gradient from 'components/sales/Gradient';
import styles from './TransactionCard.styles';

/**
 * Component type definitions
 *
 * @typedef {object} TransactionCardProps
 * @property {string} [text] - The content for the component
 */

export type TransactionCardProps = {
  primaryStyle?: object;
  secondaryStyle?: object;
  headerStyle?: object;
  primaryText?: string;
  headerText?: string;
  quaternaryText?: string;
  tertiaryText?: string;
  secondaryText?: string;
  separator?: string;
  type?: string;
  maxFontSize?: number;
  // onPress?: () => void;
};

/**
 * Represents a TransactionCard component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered TransactionCard component
 *
 * @example
 * <TransactionCard text="Hello World!" />
 */

const TransactionCard = ({
  primaryText,
  headerText,
  quaternaryText,
  tertiaryText,
  secondaryText,
  separator = '',
  primaryStyle = {},
  secondaryStyle = {},
  headerStyle = {},
  type = VALUE_TYPE.TEXT,
  maxFontSize,
  // onPress,
}: TransactionCardProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Gradient colors={Colors.gradient.cardTheme} direction={STRINGS.TO_RIGHT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.innerContainer}>
        <View style={styles.secondaryContainer}>
          <View style={styles.leftSide}>
            <Text maxFontSize={maxFontSize} style={[styles.headerText, headerStyle]}>
              {t(`strings.${headerText}`, { defaultValue: headerText }) + separator}
            </Text>
            <View style={styles.filterContainer}>
              <Text maxFontSize={maxFontSize} style={[styles.primaryText, primaryStyle]}>
                {formatValue(type, primaryText)}
              </Text>
              <Text maxFontSize={maxFontSize} style={[styles.secondaryText, secondaryStyle]}>
                {formatValue(type, secondaryText)}
              </Text>
              <View style={styles.verticalSeparator} />
              <Text maxFontSize={maxFontSize} style={[styles.primaryText, primaryStyle]}>
                {formatValue(type, tertiaryText)}
              </Text>
              <Text maxFontSize={maxFontSize} style={[styles.secondaryText, secondaryStyle]}>
                {formatValue(type, quaternaryText)}
              </Text>
            </View>
          </View>
          {/* <View style={styles.imageStyle}>
            <Pressable onPress={onPress}>
              <Image iconName={ICONS.WHITE_CHEVRON_RIGHT} width={Sizing.layout.x15} height={Sizing.layout.x15} isDimension={false} />
            </Pressable>
          </View> */}
        </View>
      </Gradient>
    </View>
  );
};

export default TransactionCard;
