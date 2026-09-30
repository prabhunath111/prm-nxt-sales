/**
 * in this all the information of the tsk was shown
 *
 * @module components/TskVoucherDetails
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Button, PincodeDetailsCard, Text, TextContainer } from 'components/sales';
import { PROPERTIES, ROUTE, STRINGS } from 'const';
import { t } from 'i18next';
import { gcs } from 'styles/webBreakpoints';
import { Sizing } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import useNavigate from 'hooks/useNavigate';
import { closeWebView } from 'utils/navigationHelper';
import styles from './TskVoucherDetails.styles';

/**
 * Component prop types.
 *
 * @typedef {object} TskVoucherDetailsProps
 * @property {string} [text] - The text to display inside the component.
 */

/**
 * Represents a TskVoucherDetails component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const TskVoucherDetails = () => {
  const { tskDetails } = useSelector((state: RootState) => state.tskVoucher);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { inflection } = useInflection();
  const { goHome } = useNavigate();
  const handleOk = () => {
    if (isRedirection) {
      closeWebView();
    } else {
      goHome();
    }
  };

  const translatedDistributorDetails = PROPERTIES.TSK_VOUCHER.DISTRIBUTOR_DETAILS.map((item) => ({
    ...item,
    label: t(`strings.${item.label}`),
  }));
  const translatedSubscriberDetailsDetails = PROPERTIES.TSK_VOUCHER.SUBSCRIBER_DETAILS.map((item) => ({
    ...item,
    label: t(`strings.${item.label}`),
  }));
  const translatedVoucherDetails = PROPERTIES.TSK_VOUCHER.VOUCHER_DETAILS.map((item) => ({
    ...item,
    label: t(`strings.${item.label}`),
  }));

  return (
    <SafeAreaView style={[styles.container]} testID="TskVoucherDetails">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View style={styles.tskPinCard}>
          <PincodeDetailsCard label={STRINGS.TSK_NO} routeName={ROUTE.WEB.TSK_VOUCHER} currentRoute={ROUTE.WEB.TSK_VOUCHER_DETAILS} />
        </View>
        <View style={[styles.detailsBlock, styles[gcs('detailsBlock', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <Text style={styles.headerText}>{t('strings.distributorDetail')}</Text>
          <View style={styles.detailsCard}>
            <TextContainer
              data={tskDetails}
              dataArray={translatedDistributorDetails}
              textContainerStyle={styles.textContainer}
              itemContainerStyle={styles.itemContainer}
              primaryStyle={styles.primaryText}
              secondaryStyle={styles.secondaryText}
            />
          </View>
        </View>
        <View style={[styles.detailsBlock, styles[gcs('detailsBlock', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <Text style={styles.headerText}>{t('strings.subscriberDetails')}</Text>
          <View style={styles.detailsCard}>
            <TextContainer
              data={tskDetails}
              dataArray={translatedSubscriberDetailsDetails}
              textContainerStyle={styles.textContainer}
              itemContainerStyle={styles.itemContainer}
              primaryStyle={styles.primaryText}
              secondaryStyle={styles.secondaryText}
            />
          </View>
        </View>
        <View style={[styles.detailsBlock, styles[gcs('detailsBlock', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <Text style={styles.headerText}>{t('strings.voucherDetails')}</Text>
          <View style={styles.detailsCard}>
            <TextContainer
              data={tskDetails}
              dataArray={translatedVoucherDetails}
              textContainerStyle={styles.textContainer}
              itemContainerStyle={styles.itemContainer}
              primaryStyle={styles.primaryText}
              secondaryStyle={styles.secondaryText}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonInnerContainer, styles[gcs('textWrapperETSK', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <Button onPress={handleOk} label={t('modal.ok')} fontSize={Sizing.layout.x16} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(TskVoucherDetails);
