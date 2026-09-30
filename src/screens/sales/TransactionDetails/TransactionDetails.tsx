/**
 * details of a transaction card
 *
 * @module components/TransactionDetails
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View } from 'react-native';
import Text from 'components/sales/Text';
import { Image, InformationText } from 'components/sales';
import { Sizing } from 'styles';
import { ICONS } from 'const';
import { useTranslation } from 'react-i18next';
import styles from './TransactionDetails.styles';

/**
 * Component type definitions
 *
 * @typedef {object} TransactionDetailsProps
 * @property {string} [text] - The content for the component
 */

export type TransactionDetailsProps = {
  transactionDate?: string;
  paymentType?: string;
  status?: string;
  transactionId?: string;
  amount?: string;
  commission?: string;
};

/**
 * Represents a TransactionDetails component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} props.transactionDate - Transaction transactionDate.
 * @param {string} props.paymentType - Transaction paymentType (e.g., Primary TV).
 * @param {string} props.status - Transaction status (e.g., Success/Failed).
 * @param {string} props.statusIcon - Icon for status.
 * @param {string} props.transactionId - Transaction ID.
 * @param {string} props.amount - Transaction amount.
 * @param {string} props.commission - Commission earned.
 * @returns {JSX.Element} The rendered component.
 */
const TransactionDetails = ({ transactionDate, paymentType, status, transactionId, amount, commission }: TransactionDetailsProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.innerContainer}>
          <Text label={transactionDate} style={styles.primaryText} />
          <View style={styles.verticalSeparator} />
          <Text label={paymentType} style={styles.primaryText} />
        </View>
        {status && status !== t('strings.transactionSuccess') && (
          <View style={styles.innerContainer}>
            <Image iconName={ICONS.FAILED} width={Sizing.layout.x15} height={Sizing.layout.x15} isDimension={false} />
            <Text label={status} style={styles.status} />
          </View>
        )}
      </View>
      <View style={styles.innerContainer}>
        <Text label={transactionId} style={styles.transactionId} />
        <View style={styles.amount}>
          <Image iconName={ICONS.RUPEE_SYMBOL} width={Sizing.layout.x10} height={Sizing.layout.x10} isDimension={false} />
          {paymentType === t('strings.debit') ? <Text label="-" style={styles.status} /> : null}
          <Text label={amount} style={paymentType === t('strings.debit') ? styles.status : styles.successAmount} />
        </View>
      </View>
      {commission ? (
        <View style={styles.informationStyle}>
          <InformationText
            primaryText={t('strings.commissionEarned')}
            primaryStyle={styles.primaryText}
            secondaryStyle={styles.primaryText}
            secondaryText={commission}
            containerStyle={styles.innerContainer}
          />
        </View>
      ) : null}
    </View>
  );
};

export default memo(TransactionDetails);
