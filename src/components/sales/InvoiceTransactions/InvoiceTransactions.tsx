/**
 * This component displays the EVD details of a dealer.
 * It shows a summary of the dealer's information with options to view more details or perform actions based on the current data.
 * The details can be toggled to show more or fewer items, and a button action allows setting or updating Auto EVD transfer.
 *
 * @module components/InvoiceTransactions
 * @memberof CommonComponent
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import TextContainer, { itemType } from 'components/sales/TextContainer';
import { ICONS, PROPERTIES, QUERY, ROUTE, STYLES } from 'const';
import Button from 'components/sales/Button';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { ParentObject } from 'store/sales/types/common';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './InvoiceTransactions.styles';

/**
 * Component type definitions
 *
 * @typedef {object} InvoiceTransactionsProps
 * @property {DealerData} data - The dealer's information to display in the component
 * @property {itemType[]} [itemsArray] - An array of items to display as details for the dealer. Defaults to items from the global `PROPERTIES.AUTO_EVD.evdDetails`.
 * @property {function} onButtonPress - Function to handle button presses for setting/updating Auto EVD transfer. Receives `DealerData` as a parameter.
 */

export type InvoiceTransactionsProps = {
  data: ParentObject;
  itemsArray?: itemType[];
};

/**
 * Represents a InvoiceTransactions component.
 *
 * @param {InvoiceTransactionsProps} props - The properties passed to the component.
 * @param {DealerData} props.data - The dealer's data to be displayed in the component.
 * @param {itemType[]} [props.itemsArray] - Optional array of items to display. Defaults to `PROPERTIES.AUTO_EVD.evdDetails`.
 * @param {function} props.onButtonPress - Callback function triggered when the primary button is pressed.
 * @returns {JSX.Element} The rendered InvoiceTransactions component.
 */

const InvoiceTransactions = ({ data, itemsArray = PROPERTIES.CUSTOMER_INVOICE.invoiceTransaction }: InvoiceTransactionsProps) => {
  const [showMore, setShowMore] = useState(false);
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const limitedItemsArray = showMore ? itemsArray : itemsArray.slice(0, 3);

  const handleDownloadInvoice = (data: ParentObject) => {
    dispatch(callAction({ transactionID: data?.transactionId, isDownload: true }, QUERY.GetInvoiceTransactions))?.then((response: ParentObject) => {
      if (response?.status) {
        handleWebViewUrl(response?.invoiceUrl, true);
        if (ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.rechargeWinback.Winback_DownloadInvoice.moduleName, {
            [MoengageMixpanelModules.rechargeWinback.Winback_DownloadInvoice.attributes.Status]: true,
            [MoengageMixpanelModules.rechargeWinback.Winback_DownloadInvoice.attributes.transactionId]: data?.transactionId,
          });
        }
        return { status: true };
      }
      return { status: false };
    });
  };

  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['lg', 'xl'])]]}>
      <TextContainer
        textContainerStyle={styles.textContainerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        primaryStyle={styles.primaryTextStyle}
        secondaryStyle={styles.secondaryTextStyle}
        dataArray={limitedItemsArray}
        data={data}
      />
      <View style={styles.buttonContainer}>
        <Button
          type={STYLES.TYPE.SECONDARY}
          fontSize={Sizing.layout.x14}
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
          fontSize={Sizing.layout.x14}
          style={styles.primaryButtonStyle}
          label={t('strings.downloadInvoice')}
          onPress={() => handleDownloadInvoice(data)}
          iconName={ICONS.FILE_DOWNLOAD}
          iconPosition={STYLES.POSITION.LEFT}
          iconHeight={Sizing.layout.x1Dot5}
          iconWidth={Sizing.layout.x1Dot5}
          iconStyle={styles.primaryIconStyle}
        />
      </View>
    </View>
  );
};

export default InvoiceTransactions;
