import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text, Image, List } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { ICONS, ROUTE, STRINGS } from 'const';
import { Sizing } from 'styles';
import { formatTransDate } from 'utils/activationStatusHelper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { retrieveTransactionDetails, resetIsTransactionDetails } from 'store/sales/actions/transactionHistory/transactionHistory.action';
import actions from 'store/sales/actions/activationStatusDetails';
import { ParentObject } from 'store/sales/types/common';
import { isWeb } from 'utils/platformHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './RechargeTransactions.styles';

const RechargeTransactions = () => {
  const { t } = useTranslation();
  const activationStatusDetails = useSelector((state: RootState) => state.activationStatusDetails);
  const { accountInfo, transactions } = activationStatusDetails;

  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(actions.getLastFiveRechargesDetails());
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusRechargeTransactions.moduleName, {
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusRechargeTransactions.attributes.Status]: true,
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusRechargeTransactions.attributes.SubscriberID]: activationStatusDetails.accountInfo.subId,
    });
  }, []);

  const moduleRouteHandler = (item: ParentObject) => {
    const payload = { transactionID: item.transactionId, subscriberId: null };
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusRechargeReversal.moduleName, {
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusRechargeReversal.attributes.Status]: true,
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusRechargeReversal.attributes.transactionInfo]: item.transactionId,
    });
    dispatch(retrieveTransactionDetails(payload)).then((response: ParentObject) => {
      if (response?.status) {
        dispatch(resetIsTransactionDetails());
        navigate(ROUTE.WEB.CONFIRM_REVERSAL, {
          fromScreen: 'ActivationStatus',
        });
      }
    });
  };

  const renderCurrentBalance = () => (
    <View style={styles.currentBalanceConatiner}>
      <Text label={t(`strings.currentBalance`)} style={styles.currentBalance} />
      <View style={styles.currentBalanceContainer}>
        <Text label={accountInfo?.balance} style={styles.currentBalanceVal} />
      </View>
    </View>
  );

  const itemSeperator = () => <View style={styles.seperator} />;

  const renderPrvTransactions = () => {
    const visibleData = showAll ? transactions : transactions.slice(0, 5);

    return (
      <View style={styles.prvTranscationView} testID="recharge-trans-test">
        <List
          ListHeaderComponent={() => <Text style={styles.title} label={t(`strings.previousTransactions`)} />}
          style={styles.prvTransactionContainer}
          data={visibleData}
          renderItem={({ item }) => {
            const isAmountPositive = parseInt(item.amount, 10) > 0;
            return (
              <View style={styles.prvTransactionCard}>
                <View style={styles.transCardContent}>
                  <Text style={styles.transDate} label={isWeb ? formatTransDate(item.transactionDate, true) : item.transactionDate} />
                  <View style={styles.currentBalanceContainer}>
                    <Image
                      iconName={ICONS.RUPEE_SYMBOL}
                      height={Sizing.layout.x1Dot5}
                      width={Sizing.layout.x1}
                      style={isAmountPositive ? styles.imageStyle : styles.imageStyleRed}
                    />
                    <Text label={item.amount} style={[styles.currentBalanceVal, isAmountPositive ? styles.midGreen : styles.lightRed]} />
                  </View>
                </View>

                <View style={styles.transCardContent}>
                  <Text style={styles.transId} label={`${t(`strings.id`)}: ${item.transactionId}`} />
                  {item?.paymentType === STRINGS.EVD_PAYMENT && (
                    <Pressable style={styles.button} onPress={() => moduleRouteHandler(item)}>
                      <Text style={styles.buttonLabel} label={t(`forms.rechargeReversal`)} />
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={itemSeperator}
          ListFooterComponent={() =>
            transactions.length > 5 && (
              <Pressable style={styles.viewMoreButton} onPress={() => setShowAll(!showAll)}>
                <Text style={styles.viewMoreText} label={showAll ? t(`strings.viewLess`) : t(`strings.viewMore`)} />
                <Image iconName={showAll ? ICONS.PINK_CHEVRON_UP : ICONS.PINK_CHEVRON_DOWN} isDimension={false} style={styles.iconStyle} />
              </Pressable>
            )
          }
          ListEmptyComponent={<Text label={`${t('errors.noDataAvailable')}`} style={styles.transId} />}
        />
        <View style={styles.margin} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCurrentBalance()}
      {renderPrvTransactions()}
      <View style={styles.marginDefault} />
    </View>
  );
};

export default RechargeTransactions;
