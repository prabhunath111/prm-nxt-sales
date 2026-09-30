/**
 * this component will be a list item for the packs
 *
 * @module components/PacksListItem
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import Image from 'components/sales/Image';
import TextContainer, { itemType } from 'components/sales/TextContainer';
import Button from 'components/sales/Button';
import { Colors, Sizing } from 'styles';
import { ICONS, STYLES, PROPERTIES } from 'const';
import { useTranslation } from 'react-i18next';
import { formatDurationForUI } from 'utils/responseHelper';
import styles from './PacksListItem.styles';

/**
 * Component props for PacksListItem
 *
 * @typedef {object} PacksListItemProps
 * @property {ParentObject} data - The data object representing the pack details
 * @property {boolean} isOfferAdded - Flag indicating whether the offer has already been added
 * @property {function} [onAddOffer] - Callback triggered when an offer is added. Receives the pack data as an argument
 * @property {function} [onRemoveOffer] - Callback triggered when an offer is removed. Receives the pack data as an argument
 * @property {function} [onViewDetails] - Callback triggered to view more details about the pack
 */

export type PacksListItemProps = {
  data: ParentObject;
  isOfferAdded: boolean;
  onAddOffer?: (value: ParentObject) => void | null;
  onRemoveOffer?: (value: ParentObject) => void | null;
  onViewDetails?: () => void | null;
};

/**
 * Represents an individual pack item in the list, showing offer details and actions.
 *
 * @param {object} props - React properties passed from the parent component.
 * @param {ParentObject} props.data - Data object containing details of the pack (e.g. name, price).
 * @param {boolean} props.isOfferAdded - Flag to indicate if the current pack is already added to the offers.
 * @param {function} [props.onAddOffer] - Callback triggered when the user taps the "Add" button. Sends the pack data.
 * @param {function} [props.onRemoveOffer] - Callback triggered when the user taps the "Drop" button. Sends the pack data.
 * @param {function} [props.onViewDetails] - Callback triggered when the user taps the info icon to view pack details.
 *
 * @returns {JSX.Element} The rendered component showing pack title, price, and action buttons.
 */

const PacksListItem = ({ data, isOfferAdded, onAddOffer, onRemoveOffer, onViewDetails }: PacksListItemProps) => {
  const { inflection } = useInflection();
  const { t } = useTranslation();

  const dataArray = PROPERTIES.CUSTOMER_OFFERS.ETSK_REGISTRATION;

  const handleAddOffer = () => {
    onAddOffer?.(data);
  };

  const { price } = data;
  const durationKey = formatDurationForUI(data.durationNT);
  const translatedDuration = t(`strings.${durationKey}`);
  const offerPrice = durationKey ? `${price}/${translatedDuration}` : `${price}`;

  const handleRemoveOffer = () => {
    onRemoveOffer?.(data);
  };
  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['lg', 'xl'])]]} testID="PacksListItem">
      <View style={styles.header}>
        <Text style={styles.headerText}>{data?.friendlyName}</Text>
        <Pressable onPress={onViewDetails}>
          <Image iconName={ICONS.INFO_PINK_SOLID} height={Sizing.layout.x18} width={Sizing.layout.x18} isDimension={false} />
        </Pressable>
      </View>
      <View style={styles.textContainer}>
        <View style={[styles.textView, styles[gcs('textView', inflection, true, ['md', 'lg', 'xl'])]]}>
          <TextContainer
            itemContainerStyle={styles.textWrapper}
            primaryStyle={styles.primaryText}
            secondaryStyle={styles.secondaryText}
            data={{
              offerPrice,
            }}
            dataArray={dataArray as itemType[]}
          />
        </View>
        <View style={styles.buttonContainer}>
          {isOfferAdded ? (
            <Button
              onPress={handleRemoveOffer}
              iconPosition={STYLES.POSITION.LEFT}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
              iconName={ICONS.DUSTBIN}
              iconHeight={Sizing.layout.x2}
              iconWidth={Sizing.layout.x1}
              isDimension={false}
              label={t('strings.drop')}
              outline
              fontColor={Colors.primary.brand}
              labelStyle={styles.buttonLabelStyle}
              fontSize={Sizing.layout.x16}
            />
          ) : (
            <Button
              onPress={handleAddOffer}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
              label={t('strings.add')}
              labelStyle={styles.buttonLabelStyle}
              fontSize={Sizing.layout.x16}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default PacksListItem;
