/**
 * success screen for eTsk reg submission
 *
 * @module components/ETskRegSuccess
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, CommonSuccess, CustomerDetailsCard, Image, Text } from 'components/sales';
import { ICONS, QUERY, STRINGS, STYLES } from 'const';
import { Colors, Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './WoRecreationSuccess.styles';

/**
 * Represents a WoRecreationSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const WoRecreationSuccess = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const [iconName, setIconName] = useState('');
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { woSuccessData } = useSelector((state: RootState) => state.woRecreation);
  const { goHome } = useNavigate();

  useEffect(() => {
    if (woSuccessData?.result?.message) {
      if (woSuccessData?.result?.transId) {
        setIconName(ICONS.CONFIRM_SUCCESS);
      } else {
        setIconName(ICONS.WARNING_EXCLAMATION);
      }
    } else if (woSuccessData?.result === null) {
      setIconName(ICONS.WARNING_EXCLAMATION);
    } else if (woSuccessData?.message) {
      setIconName(ICONS.CONFIRM_SUCCESS);
    } else {
      setIconName(ICONS.CONFIRM_SUCCESS);
    }
  }, [woSuccessData]);

  const handleDownloadInvoice = () => {
    dispatch(callAction({ isisDownload: true, transactionId: woSuccessData?.result?.transId }, QUERY.GetURLforInvoiceTransactions));
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationDownloadInvoice.moduleName, {
      [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationDownloadInvoice.attributes.Status]: true,
      [MoengageMixpanelModules.MultiTVRegistration.MultiTVRegistrationDownloadInvoice.attributes.transactionId]: woSuccessData?.result?.transId,
    });
  };

  return (
    <View style={[styles.mainContainer, styles[gcs('mainContainer', inflection, true, ['md', 'lg', 'xl'])]]} testID="woRecreationSuccessTest">
      <View style={[styles.cardDetailsContainer, styles[gcs('cardDetailsContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CustomerDetailsCard />
      </View>
      <ScrollView contentContainerStyle={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess iconName={iconName} primaryText={t(`strings.woRecreated`)} secondaryText={STRINGS.WO_NUMBER} value={woSuccessData?.woNumber} hasDefaultHeader />
        <Text style={[styles.messageText, styles[gcs('messageText', inflection, true, ['md', 'lg', 'xl'])]]}>{woSuccessData?.result?.message || woSuccessData?.message}</Text>
        {woSuccessData?.result?.transId && (
          <View style={[styles.invoiceContainer, styles[gcs('invoiceContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={styles.primaryTextStyle} label={t(`strings.invoice`)} />
            <Pressable style={styles.downLoadInvoice} onPress={handleDownloadInvoice}>
              <Text style={[styles.secondaryTextStyle, { color: Colors.appColors.pink }]} label={t(`strings.downloadInvoice`)} />
              <Image iconName={ICONS.FILE_DOWNLOAD} height={Sizing.layout.x2} width={Sizing.layout.x2} style={styles.primaryIconStyle} />
            </Pressable>
            <View style={styles.gap} />
          </View>
        )}
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          iconName={ICONS.HOME}
          fontSize={Sizing.layout.x16}
          iconHeight={Sizing.layout.x15}
          iconWidth={Sizing.layout.x15}
          iconPosition={STYLES.POSITION.LEFT}
          label={t('strings.backToHome')}
          isDimension={false}
          onPress={() => goHome(isRedirection)}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(WoRecreationSuccess);
