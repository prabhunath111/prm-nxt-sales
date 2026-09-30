/**
 * Common succes icon and text for all modules
 *
 * @module components/CommonSuccess
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import Image from 'components/sales/Image';
import { ICONS, ROUTE } from 'const';
import { Sizing } from 'styles';
import Text from 'components/sales/Text';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import useCurrentRoute from 'hooks/useCurrentRoute';
import styles from './CommonSuccess.styles';

/**
 * Component type definitions
 *
 * @typedef {object} CommonSuccessProps
 * @property {string} [primaryText] - The primary heading of the component
 * @property {string} [secondaryText] - The secondary heading of the component
 * @property {string} [value] - The value of the component
 * @property {string} [iconName] - The icon name of the component
 */

export type CommonSuccessProps = {
  primaryText?: string;
  secondaryText?: string;
  value?: string;
  hasDefaultvalue?: boolean;
  hasDefaultHeader?: boolean;
  iconName?: string;
  primaryStyles?: object;
};

/**
 * Represents a CommonSuccess component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered CommonSuccess component
 *
 * @example
 * <CommonSuccess text="Hello World!" />
 */

const CommonSuccess = ({ primaryText, secondaryText, value, hasDefaultvalue, hasDefaultHeader, iconName, primaryStyles }: CommonSuccessProps) => {
  const { t } = useTranslation();
  const { routeName } = useCurrentRoute();
  const { winBackSuccessData } = useSelector((state: RootState) => state.rechargeWinback);
  return (
    <View style={styles.subContainer}>
      <Image iconName={iconName || ICONS.CONFIRM_SUCCESS} height={Sizing.layout.x56} width={Sizing.layout.x56} isDimension={false} />
      <Text style={[styles.headerText, primaryStyles]}>{hasDefaultHeader ? primaryText : t(`strings.${primaryText}`, { defaultValue: primaryText })}</Text>
      {routeName === ROUTE.WEB.WINBACK_SUCCESS && winBackSuccessData?.message && <Text style={styles.headerText}>{winBackSuccessData?.message}</Text>}
      <View style={styles.textWrapper}>
        {secondaryText && <Text style={styles.textStyle}>{hasDefaultvalue ? secondaryText : t(`strings.${secondaryText}`)}</Text>}
        {value && <Text style={styles.numberText}>{value}</Text>}
      </View>
    </View>
  );
};

export default CommonSuccess;
