/**
 * This component displays the EVD details of a dealer.
 * It shows a summary of the dealer's information with options to view more details or perform actions based on the current data.
 * The details can be toggled to show more or fewer items, and a button action allows setting or updating Auto EVD transfer.
 *
 * @module components/DealerEvdDetails
 * @memberof CommonComponent
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import TextContainer, { itemType } from 'components/sales/TextContainer';
import { ICONS, MODAL, PROPERTIES, STYLES } from 'const';
import Button from 'components/sales/Button';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import { DealerData } from 'store/sales/types/autoEvd';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { isWeb } from 'utils/platformHelper';
import styles from './DealerEvdDetails.styles';

/**
 * Component type definitions
 *
 * @typedef {object} DealerEvdDetailsProps
 * @property {DealerData} data - The dealer's information to display in the component
 * @property {itemType[]} [itemsArray] - An array of items to display as details for the dealer. Defaults to items from the global `PROPERTIES.AUTO_EVD.evdDetails`.
 * @property {function} onButtonPress - Function to handle button presses for setting/updating Auto EVD transfer. Receives `DealerData` as a parameter.
 */

export type DealerEvdDetailsProps = {
  data: DealerData;
  itemsArray?: itemType[];
  onButtonPress: (data: DealerData) => void;
};

/**
 * Represents a DealerEvdDetails component.
 *
 * @param {DealerEvdDetailsProps} props - The properties passed to the component.
 * @param {DealerData} props.data - The dealer's data to be displayed in the component.
 * @param {itemType[]} [props.itemsArray] - Optional array of items to display. Defaults to `PROPERTIES.AUTO_EVD.evdDetails`.
 * @param {function} props.onButtonPress - Callback function triggered when the primary button is pressed.
 * @returns {JSX.Element} The rendered DealerEvdDetails component.
 */

const DealerEvdDetails = ({ data, itemsArray = PROPERTIES.AUTO_EVD.evdDetails, onButtonPress }: DealerEvdDetailsProps) => {
  const [showMore, setShowMore] = useState(false);
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const limitedItemsArray = showMore ? itemsArray : itemsArray.slice(0, 2);

  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['lg', 'xl'])]]}>
      <TextContainer
        textContainerStyle={[styles.textContainerStyle, styles[gcs('textContainerStyle', inflection, true, ['lg', 'xl'])]]}
        itemContainerStyle={[styles.itemContainerStyle, styles[gcs('itemContainerStyle', inflection, true, ['lg', 'xl'])]]}
        primaryStyle={[styles.primaryTextStyle, styles[gcs('primaryTextStyle', inflection, true, ['lg', 'xl'])]]}
        secondaryStyle={[styles.secondaryTextStyle, styles[gcs('secondaryTextStyle', inflection, true, ['lg', 'xl'])]]}
        dataArray={limitedItemsArray}
        data={data}
      />
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['lg', 'xl'])]]}>
        <Button
          type={STYLES.TYPE.SECONDARY}
          fontSize={Sizing.layout.x12}
          iconName={showMore ? ICONS.CHEVRONUP : ICONS.CHEVRONDOWN}
          iconPosition={STYLES.POSITION.RIGHT}
          iconHeight={Sizing.layout.x1}
          iconWidth={Sizing.layout.x1}
          iconStyle={styles.iconStyle}
          label={showMore ? t('strings.viewLess') : t('strings.viewMore')}
          style={styles.buttonStyle}
          onPress={() => setShowMore(!showMore)}
        />
        <Button
          fontSize={Sizing.layout.x12}
          style={isWeb ? [styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['lg', 'xl'])]] : [styles.primaryButtonStyleApp]}
          label={data.thresholdSetNT === MODAL.Y ? t('strings.updateAutoEvd') : t('strings.setAutoEvd')}
          onPress={() => onButtonPress(data)}
        />
      </View>
    </View>
  );
};

export default DealerEvdDetails;
