/**
 * my evd balance for evd balance info
 *
 * @module components/MyEvdBalance
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View } from 'react-native';
import { ActionTileCard, InformationText } from 'components/sales';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { gcs } from 'styles/webBreakpoints';
import { ICONS, ROUTE } from 'const';
import useNavigate from 'hooks/useNavigate';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './MyEvdBalance.styles';

/**
 * Represents a MyEvdBalance component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component. balanceInfo
 */
const MyEvdBalance = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { navigate } = useNavigate();
  const { evdInfo } = useSelector((state: RootState) => state.evdBalanceInfo);

  return (
    <View style={styles.container}>
      <View style={styles.informationText}>
        <InformationText
          containerStyle={styles.textWrapperETSK}
          primaryStyle={[styles.primaryTextYourPack, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
          secondaryStyle={styles.secondaryTextYourPack}
          primaryText={t('strings.currentBalance')}
          secondaryText={`₹${evdInfo?.currentBalance ?? ''}`}
        />
      </View>
      <View style={styles.informationText}>
        <ActionTileCard
          label={t('strings.rechargeTransaction')}
          iconName={ICONS.RECHARGE_TRANSACTION}
          onPress={() => {
            navigate(ROUTE.WEB.RECHARGE_TRANSACTION);
          }}
        />
      </View>
      <View style={styles.informationText}>
        <ActionTileCard
          label={t('strings.otfCreditDetails')}
          iconName={ICONS.OTF_CREDIT_DETAILS}
          onPress={() => {
            navigate(ROUTE.WEB.OTF_CREDIT_DETAILS);
          }}
        />
      </View>
      <View style={styles.informationText}>
        <ActionTileCard
          label={t('strings.balanceTransferDetails')}
          iconName={ICONS.BALANCE_TRANSFER_DETAILS}
          onPress={() => {
            navigate(ROUTE.WEB.BALANCE_TRANSFER_DETAILS);
          }}
        />
      </View>
      <View style={styles.informationText}>
        <ActionTileCard
          label={t('strings.consolidatedTransactions')}
          iconName={ICONS.CONSOLIDATED_TRANSACTIONS}
          onPress={() => {
            navigate(ROUTE.WEB.CONSOLIDATED_TRANSACTION);
          }}
        />
      </View>
    </View>
  );
};

export default memo(MyEvdBalance);
