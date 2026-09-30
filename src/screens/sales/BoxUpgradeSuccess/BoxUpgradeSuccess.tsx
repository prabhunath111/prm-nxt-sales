import React, { memo } from 'react';
import { Pressable, ScrollView, View, SafeAreaView } from 'react-native';
import { Button, CommonSuccess, CustomerDetailsCard, Image, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { ICONS, STYLES, ROUTE, STRINGS, STATE_KEY } from 'const';
import { Colors, Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { getURLforInvoiceTransactions } from 'store/sales/actions/invoice/invoice.action';
import TextContainer, { itemType } from 'components/sales/TextContainer';
import formActions from 'store/sales/actions/form';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './BoxUpgradeSuccess.styles';

const BoxUpgradeSuccess = () => {
  const { goHome } = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { routeName } = useCurrentRoute();
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { SubscriberID, paidAmount, upgradedType, status, SrNo, TransactionID, rechargeFlag, upgradeMsg } = useSelector((state: RootState) => state.boxUpgrade);

  const moduleRouteHandler = (route: string) => {
    if (route === ROUTE.WEB.RECHARGE_REVERSAL) {
      dispatch(formActions.setFormDependentDefault({ transactionID: TransactionID }));
    } else {
      setTimeout(() => {
        dispatch(formActions.setUpdatedFormFields({ subscriberId: SubscriberID }, STATE_KEY.MODAL_STATE));
      }, 400);
    }
    navigate(route);
  };

  const handleDownloadInvoice = () => {
    dispatch(getURLforInvoiceTransactions({ isDownload: true, transactionId: TransactionID }));
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxUpgrade.BoxUpgradeDownloadInvoice.moduleName, {
      [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeDownloadInvoice.attributes.Status]: true,
      [MoengageMixpanelModules.BoxUpgrade.BoxUpgradeDownloadInvoice.attributes.transactionId]: TransactionID,
    });
  };

  const renderCard = (icon: string, text: string, route: string, onPress?: () => void) => (
    <Pressable
      style={styles.cardStyle}
      onPress={() => {
        if (onPress) {
          onPress();
        } else if (route) {
          moduleRouteHandler(route);
        }
      }}
    >
      <View style={styles.cardSubView}>
        <Image iconName={icon} height={Sizing.layout.x2} width={Sizing.layout.x2} style={styles.primaryIconStyle} />
        <Text style={styles.cardContentText}>{text}</Text>
      </View>
      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} height={Sizing.layout.x2} width={Sizing.layout.x2} style={styles.primaryIconStyle} />
    </Pressable>
  );

  const detailsArray: itemType[] = [
    {
      key: 'srNo',
      label: routeName === ROUTE.WEB.BOX_TYPE_SUCCESS ? t(`strings.woNumber`) : t(`strings.serviceRequestNumber`),
    },
    ...(TransactionID ? [{ key: 'transactionId', label: t(`strings.transactionId`) }] : []),
    ...(TransactionID ? [{ key: 'amount', label: t(`strings.rechargeAmount`) }] : []),
    ...(routeName !== ROUTE.WEB.BOX_TYPE_SUCCESS ? [{ key: 'boxType', label: t(`strings.newBoxType`) }] : []),
    ...(TransactionID ? [{ key: 'invoice', label: t(`strings.invoice`) }] : []),
  ];

  const detailsData = {
    srNo: SrNo,
    ...(TransactionID ? { transactionId: TransactionID } : {}),
    ...(TransactionID ? { amount: rechargeFlag ? `₹ ${paidAmount}` : '₹ 0' } : {}),
    ...(routeName !== ROUTE.WEB.BOX_TYPE_SUCCESS ? { boxType: upgradedType } : {}),
    ...(TransactionID
      ? {
          invoice: (
            <Pressable style={styles.downLoadInvoice} onPress={handleDownloadInvoice}>
              <Text style={[styles.secondaryTextStyle, { color: Colors.appColors.pink }]} label={t(`strings.downloadInvoice`)} />
              <Image iconName={ICONS.FILE_DOWNLOAD} height={Sizing.layout.x2} width={Sizing.layout.x2} style={styles.primaryIconStyle} />
            </Pressable>
          ),
        }
      : {}),
  };

  const failureArray: itemType[] = [
    {
      key: 'srNo',
      label: routeName === ROUTE.WEB.BOX_TYPE_SUCCESS ? t(`strings.woNumber`) : t(`strings.serviceRequestNumber`),
    },
    ...(TransactionID ? [{ key: 'transactionId', label: t(`strings.transactionId`) }] : []),
    { key: 'amount', label: t(`strings.rechargeAmount`) },
    ...(TransactionID ? [{ key: 'invoice', label: t(`strings.invoice`) }] : []),
  ];

  const failureData = {
    srNo: SrNo,
    ...(TransactionID ? { transactionId: TransactionID } : {}),
    amount: TransactionID ? `₹${paidAmount}` : '₹ 0',
    ...(TransactionID
      ? {
          invoice: (
            <Pressable style={styles.downLoadInvoice} onPress={handleDownloadInvoice}>
              <Text style={[styles.secondaryTextStyle, { color: Colors.appColors.pink }]} label={t(`strings.downloadInvoice`)} />
              <Image iconName={ICONS.FILE_DOWNLOAD} height={Sizing.layout.x2} width={Sizing.layout.x2} style={styles.primaryIconStyle} />
            </Pressable>
          ),
        }
      : {}),
  };

  let primaryText = STRINGS.WORK_ORDER_CREATED;

  if (upgradeMsg !== '') {
    primaryText = upgradeMsg;
  }

  return (
    <SafeAreaView style={[styles.container]} testID="BoxUpgradeSuccess">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <CustomerDetailsCard />

          {status === t('strings.success') ? (
            <View style={[styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
              <View style={styles.successContainer}>
                <CommonSuccess
                  iconName={!TransactionID && rechargeFlag ? ICONS.WARNING_EXCLAMATION : ICONS.CONFIRM_SUCCESS}
                  primaryText={primaryText}
                  primaryStyles={styles.primarySuccessText}
                />
              </View>

              <View style={styles.gapContainer}>
                <View style={styles.dealerContainer}>
                  <TextContainer
                    data={detailsData}
                    dataArray={detailsArray}
                    itemContainerStyle={styles.dealerSubContainer}
                    primaryStyle={styles.primaryTextStyle}
                    secondaryStyle={styles.secondaryTextStyle}
                  />
                </View>
              </View>
              {TransactionID && (
                <View style={[styles.dealerContainerCard, styles[gcs('dealerContainerCard', inflection, true, ['md', 'lg', 'xl'])]]}>
                  <Text style={styles.cardTitleText}>
                    {t('strings.moreActionsFor')}
                    <Text style={styles.subIdText}> {`${t('strings.subID')}: ${SubscriberID}`}</Text>
                  </Text>

                  {routeName !== ROUTE.WEB.BOX_TYPE_SUCCESS && renderCard(ICONS.MODIFY_PACK_PINK, t(`forms.modifyPack`), ROUTE.WEB.MODIFY_PACK)}
                  {TransactionID && renderCard(ICONS.RECHARGE_REVERSAL_PINK, t(`forms.rechargeReversal`), ROUTE.WEB.RECHARGE_REVERSAL)}
                </View>
              )}
            </View>
          ) : (
            <View style={[styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
              <View style={styles.successContainer}>
                <CommonSuccess
                  primaryText={routeName === ROUTE.WEB.BOX_TYPE_SUCCESS ? STRINGS.WORK_ORDER_CREATED : STRINGS.BOX_UPGRADE_FAILURE}
                  primaryStyles={styles.primarySuccessText}
                  iconName={ICONS.WARNING_EXCLAMATION}
                />
              </View>

              {routeName !== ROUTE.WEB.BOX_TYPE_SUCCESS && (
                <View style={styles.centerContainer}>
                  <Text style={styles.primaryTextStyle}>
                    {t('strings.serviceRequestNumber')}
                    <Text style={styles.secondaryTextStyle}> {`: ${SrNo}`}</Text>
                  </Text>
                  <Text style={styles.errorMessageBoxUpgrade}>{t('strings.boxUpgradeFailure')}</Text>
                </View>
              )}
              {routeName === ROUTE.WEB.BOX_TYPE_SUCCESS && (
                <View style={styles.centerContainer}>
                  <Text style={styles.errorMessageBoxUpgrade}>{t('strings.boxTyprFailure', { subID: SubscriberID })}</Text>
                </View>
              )}

              <View style={styles.gapContainer}>
                <View style={styles.dealerContainer}>
                  <TextContainer
                    data={failureData}
                    dataArray={failureArray}
                    itemContainerStyle={styles.dealerSubContainer}
                    primaryStyle={styles.primaryTextStyle}
                    secondaryStyle={styles.secondaryTextStyle}
                  />
                </View>
              </View>

              <View>
                {TransactionID && <Text style={styles.primaryTextStyle} label={t(`strings.rechargeAmountReversal`)} />}
                <View style={[styles.dealerContainerCard, styles[gcs('dealerContainerCard', inflection, true, ['md', 'lg', 'xl'])]]}>
                  {TransactionID && renderCard(ICONS.RECHARGE_REVERSAL_PINK, t(`forms.rechargeReversal`), ROUTE.WEB.RECHARGE_REVERSAL)}
                </View>
              </View>
            </View>
          )}
        </View>
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
    </SafeAreaView>
  );
};

export default memo(BoxUpgradeSuccess);
