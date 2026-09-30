/**
 * User will see the empty data UI when there will be no data found.
 *
 * @module components/EmptyData
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Text } from 'react-native';
import Image from 'components/sales/Image';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import styles from './EmptyData.styles';

/**
 * Component type definitions
 *
 * @typedef {object} EmptyDataProps
 * @property {string} [text] - The content for the component
 * @property {string} [image] - The image for the component
 */

export type EmptyDataProps = {
  text?: string;
  image?: string;
};

/**
 * Represents a EmptyData component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @param {string} [props.image] - The image for the component
 * @returns {JSX.Element} The rendered EmptyData component
 *
 * @example
 * <EmptyData text="Hello World!" />
 */

const EmptyData = ({ text, image }: EmptyDataProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Image iconName={image} height={Sizing.layout.x19} width={Sizing.layout.x19} />
      <Text style={styles.textStyle}>{t(`strings.${text}`)}</Text>
    </View>
  );
};

export default EmptyData;
