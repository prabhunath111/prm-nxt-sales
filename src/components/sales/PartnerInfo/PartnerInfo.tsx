/**
 * information about partner
 *
 * @module components/PartnerInfo
 * @memberof CommonComponent
 */

import React from 'react';
import { Dimensions, View } from 'react-native';
import { Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Sizing } from 'styles';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { PROPERTIES } from 'const';
import styles from './PartnerInfo.styles';

const PartnerInfo = () => {
  const { t } = useTranslation();
  const { routeName } = useCurrentRoute();
  const { evdInfo } = useSelector((state: RootState) => state.evdBalanceInfo);
  const screenWidth = Dimensions.get('window').width;
  const evdRoute = PROPERTIES.EVD_BALANCE_INFO_KEY.TABLE_ROUTES.includes(routeName);

  return (
    <View style={styles.container}>
      {evdRoute ? (
        <View style={[styles.balanceContainer, styles.partnerContainer]}>
          <View style={styles.partnerNameContainerEvd}>
            <View style={styles.rowContainer}>
              <View style={styles.textDetailsRow}>
                <Text style={styles.smallTextStyle} label={t(`strings.evdCode`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.userId} />
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.textDetailsRow}>
                <Text style={styles.smallTextStyle} label={t(`strings.mdn`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.recipientRMN} />
              </View>
              {screenWidth > Sizing.layout.x660 && <View style={styles.verticalSeparator} />}
            </View>
            <View style={styles.horizontalSeparator} />
            <View style={styles.rowContainer}>
              <View style={styles.textDetailsNameRow}>
                <Text style={styles.smallTextStyle} label={t(`strings.partnerName`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.childName} />
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.textDetailsRow}>
                <Text style={styles.smallTextStyle} label={t(`strings.dealerStockBalance`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.currentBalance} />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.balanceContainer, styles.partnerContainer]}>
          <View style={styles.partnerNameContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.textDetails}>
                <Text style={styles.smallTextStyle} label={t(`strings.mdn`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.recipientRMN} />
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.textDetailsName}>
                <Text style={styles.smallTextStyle} label={t(`strings.partnerName`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.childName} />
              </View>
              {screenWidth > Sizing.layout.x660 && <View style={styles.verticalSeparator} />}
            </View>
            <View style={styles.horizontalSeparator} />
            <View style={styles.rowContainer}>
              <View style={styles.textDetails}>
                <Text style={styles.smallTextStyle} label={t(`strings.evdCode`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.userId} />
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.textDetails}>
                <Text style={styles.smallTextStyle} label={t(`strings.dealerStockBalance`)} />
                <Text style={styles.mediumTextStyle} label={evdInfo?.currentBalance} />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PartnerInfo;
