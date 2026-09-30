/**
 * Container component for displaying the user's current balance.
 * This component shows the current balance by fetching it either from the `balance` prop or the `evdTransferData` from the Redux store.
 *
 * @module components/BalanceContainer
 * @memberof CommonComponent
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import { ICONS } from 'const';
import { Global, Sizing } from 'styles';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './BalanceContainer.styles';

/**
 * Component type definitions
 *
 * @typedef {object} BalanceContainerProps
 * @property {string} [balance] - The current balance to display. If not provided, the balance is taken from the Redux store.
 */
export type BalanceContainerProps = {
  balance?: string;
  handleChange?: any;
};

/**
 * Represents the BalanceContainer component.
 * Displays the user's current balance along with a rupee symbol.
 * If the `balance` prop is not provided, it defaults to using the `dealerBalance` from the Redux store's `evdTransferData`.
 *
 * @param {object} props - React properties passed to the component.
 * @param {string} [props.balance] - The balance to display. Optional.
 * @returns {JSX.Element} The rendered BalanceContainer component.
 *
 * @example
 * <BalanceContainer balance="1000" />
 */

const BalanceContainer = ({ balance, handleChange }: BalanceContainerProps) => {
  const { evdTransferData } = useSelector((state: RootState) => state.evdTransfer);
  useEffect(() => {
    if (handleChange) {
      handleChange(evdTransferData?.partnerBalance);
    }
  }, [evdTransferData]);
  const { t } = useTranslation();
  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.headerTextStyle} label={t('strings.myNewBalance')} />
      <View style={Global.styles.rowContainer}>
        <Image iconName={ICONS.RUPEE_SYMBOL} width={Sizing.layout.x16} height={Sizing.layout.x16} isDimension={false} style={styles.iconStyle} />
        <Text style={styles.balanceTextStyle} label={balance ?? evdTransferData?.partnerBalance} />
      </View>
    </View>
  );
};

export default BalanceContainer;
