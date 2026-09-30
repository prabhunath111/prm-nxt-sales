import React from 'react';
import { View, Text, Pressable } from 'react-native';
import TextContainer, { itemType } from 'components/sales/TextContainer';
import { ICONS, OFFER_TYPE, PROPERTIES, STYLES } from 'const';
import { useTranslation } from 'react-i18next';
import Button from 'components/sales/Button';
import { Colors, Sizing } from 'styles';
import { ParentObject } from 'store/sales/types/common';
import { gcs } from 'styles/webBreakpoints';
import Image from 'components/sales/Image';
import { getScreenWidth } from 'styles/dimentionHelper';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { isWeb } from 'utils/platformHelper';
import styles from './AddPackageOffer.styles';

/**
 * Component type definitions
 *
 * @typedef {object} AddPackageOfferProps
 * @property {boolean} isOfferAdded - Indicates if the offer is added
 * @property {object} data - data of the offer
 * @property {function} onAddOffer - Function to handle adding the offer
 * @property {function} onRemoveOffer - Function to handle removing the offer
 */

export type AddPackageOfferProps = {
  data?: ParentObject;
  isOfferAdded: boolean;
  onAddOffer?: () => void | null;
  onRemoveOffer?: () => void | null;
  onViewDetails?: () => void | null;
  offerType?: string;
  openInModal?: boolean;
  offerInModal?: boolean;
};

/**
 * Represents a AddPackageOffer component
 *
 * @param {AddPackageOfferProps} props - React properties passed from composition
 * @returns {JSX.Element} The rendered AddPackageOffer component
 *
 * @example
 * <AddPackageOffer isOfferAdded={true} onAddOffer={handleAddOffer} onRemoveOffer={handleRemoveOffer} />
 */

const AddPackageOffer = ({
  data,
  isOfferAdded,
  openInModal,
  onAddOffer,
  onRemoveOffer,
  onViewDetails,
  offerType = OFFER_TYPE.winbackOffers,
  offerInModal = false,
}: AddPackageOfferProps) => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dataArray = PROPERTIES.CUSTOMER_OFFERS[offerType as keyof typeof PROPERTIES.CUSTOMER_OFFERS];
  const screenWidth = getScreenWidth();
  const isMobileView = screenWidth <= Sizing.layout.x500;

  const handleAddOffer = () => {
    onAddOffer?.();
  };

  const handleRemoveOffer = () => {
    onRemoveOffer?.();
  };

  return isMobileView || openInModal ? (
    <View style={[styles.container, !openInModal && styles[gcs('container', inflection, true, ['lg', 'xl'])]]}>
      <View style={[styles.headerSmall, offerType === OFFER_TYPE.rechargeWinback && isOfferAdded ? styles.activeHeader : {}]}>
        <Text style={styles.headerText}>{offerType === OFFER_TYPE.rechargeWinback ? data?.friendlyName : data?.offerType || data?.name}</Text>
      </View>
      <View style={[styles.textContainerSmall, offerType === OFFER_TYPE.rechargeWinback && isOfferAdded ? styles.activeTextContainer : {}]}>
        <TextContainer
          itemContainerStyle={styles.textWrapper}
          primaryStyle={styles.primaryText}
          secondaryStyle={styles.secondaryText}
          data={data}
          dataArray={dataArray as itemType[]}
        />
      </View>
      <View style={styles.buttonContainerSmall}>
        {!isMobileView && openInModal ? (
          <Pressable onPress={onViewDetails}>
            <Image iconName={ICONS.PINK_I_ICON} height={Sizing.layout.x18} style={styles.imageStyle} width={Sizing.layout.x18} isDimension={false} />
          </Pressable>
        ) : (
          <Pressable onPress={onViewDetails}>
            <Text style={styles.viewDetails}>{t('strings.viewDetails')}</Text>
          </Pressable>
        )}
        {isOfferAdded ? (
          <Button
            onPress={handleRemoveOffer}
            iconPosition={STYLES.POSITION.LEFT}
            style={[styles.buttonStyle, !offerInModal && styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            iconName={ICONS.DUSTBIN}
            iconHeight={Sizing.layout.x2}
            iconWidth={Sizing.layout.x1}
            isDimension={false}
            label={t('strings.remove')}
            outline
            fontColor={Colors.primary.brand}
            labelStyle={styles.buttonLabelStyle}
            fontSize={Sizing.layout.x16}
          />
        ) : (
          <Button
            onPress={handleAddOffer}
            style={[styles.buttonStyle, !offerInModal && isWeb ? styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])] : styles.buttonStyleAndroid]}
            label={t('strings.add')}
            labelStyle={styles.buttonLabelStyle}
            fontSize={Sizing.layout.x16}
          />
        )}
      </View>
    </View>
  ) : (
    <View style={[styles.container, !openInModal && styles[gcs('container', inflection, true, ['lg', 'xl'])]]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{offerType === OFFER_TYPE.rechargeWinback ? data?.friendlyName : data?.offerType || data?.name}</Text>
        <Pressable onPress={onViewDetails}>
          <Image iconName={ICONS.PINK_I_ICON} height={Sizing.layout.x18} style={styles.imageStyle} width={Sizing.layout.x18} isDimension={false} />
        </Pressable>
      </View>
      <View style={styles.textContainer}>
        <View style={[styles.textView, styles[gcs('textView', inflection, true, ['md', 'lg', 'xl'])]]}>
          <TextContainer
            itemContainerStyle={styles.textWrapper}
            primaryStyle={styles.primaryText}
            secondaryStyle={styles.secondaryText}
            data={data}
            dataArray={dataArray as itemType[]}
          />
        </View>
        <View style={styles.buttonContainer}>
          {isOfferAdded ? (
            <Button
              onPress={handleRemoveOffer}
              iconPosition={STYLES.POSITION.LEFT}
              style={[styles.buttonStyle, !offerInModal && styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
              iconName={ICONS.DUSTBIN}
              iconHeight={Sizing.layout.x2}
              iconWidth={Sizing.layout.x1}
              isDimension={false}
              label={t('strings.remove')}
              outline
              fontColor={Colors.primary.brand}
              labelStyle={styles.buttonLabelStyle}
              fontSize={Sizing.layout.x16}
            />
          ) : (
            <Button
              onPress={handleAddOffer}
              style={[styles.buttonStyle, !offerInModal && styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
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

export default AddPackageOffer;
