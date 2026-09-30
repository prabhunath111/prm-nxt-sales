/**
 * in which component we show the current date and time
 *
 * @module components/DateAndTimeDetails
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { t } from 'i18next';
import { gcs } from 'styles/webBreakpoints';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './DateAndTimeDetails.styles';

/**
 * Component type definitions
 *
 * @typedef {object} DateAndTimeDetailsProps
 * @property {string} [text] - The content for the component
 */

export type DateAndTimeDetailsProps = {
  text?: string;
};

/**
 * Represents a DateAndTimeDetails component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered DateAndTimeDetails component
 *
 * @example
 * <DateAndTimeDetails text="Hello World!" />
 */

const DateAndTimeDetails = ({ name = true }) => {
  const { inflection } = useInflection();
  const { info } = useSelector((state: RootState) => state.user);

  const now = new Date();
  const currentDate = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentTime = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const DealerDetailRow = ({ label, value, removeBorder = false, removePadding = false }: { label: string; value: string; removeBorder?: boolean; removePadding?: boolean }) => (
    <View style={[styles.dealerDetails, removeBorder && styles.withoutBorder, removePadding && styles.withoutPadding]}>
      <Text style={styles.primaryText}>{label}</Text>
      <Text style={[styles.secondaryCount, styles[gcs('secondaryCount', inflection, true, ['md', 'lg', 'xl', 'xs'])]]}>{value}</Text>
    </View>
  );
  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl', 'xs'])], !name && styles.singleRowContainer]}>
      <View style={[styles.dealerDetailsContainer, !name && styles.twoColumn]}>
        <DealerDetailRow label={t('strings.date')} value={currentDate} removePadding />
        <DealerDetailRow label={t('strings.time')} value={currentTime} />
        {name && <DealerDetailRow label={t('strings.name')} value={info?.name} removeBorder />}
      </View>
    </View>
  );
};

export default DateAndTimeDetails;
