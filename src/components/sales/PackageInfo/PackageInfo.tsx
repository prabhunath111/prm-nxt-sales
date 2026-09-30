/**
 * package info component for activation status module
 *
 * @module components/PackageInfo
 * @memberof CommonComponent
 */

import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Text, List } from 'components/sales';
import { QUERY, ROUTE, STRINGS } from 'const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/activationStatusDetails';
import { ParentObject } from 'store/sales/types/common';
import { callAction } from 'utils/formBuilderHelper';
import useNavigate from 'hooks/useNavigate';
import { formatDurationForUI } from 'utils/responseHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './PackageInfo.styles';

/**
 * Represents a PackageInfo component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered PackageInfo component
 *
 * @example
 * <PackageInfo text="Hello World!" />
 */

const PackageInfo = () => {
  const { t } = useTranslation();
  const { accountInfo, subscriptionDetails } = useSelector((state: RootState) => state.activationStatusDetails);

  const groupedData = subscriptionDetails?.reduce((acc: Record<string, ParentObject[]>, item: ParentObject) => {
    const key = item.ConnectionType || t(`strings.others`);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {});
  const formattedData = Object.keys(groupedData || {}).flatMap((key) => [
    { type: 'header', title: key },
    ...groupedData[key].map((item: ParentObject) => ({ type: 'item', data: item })),
  ]);

  const { errorMessage } = useSelector((state: RootState) => state.common);

  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  useEffect(() => {
    dispatch(actions.getActivationStatusPacInfo());
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusPackageInformation.moduleName, {
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusPackageInformation.attributes.Status]: true,
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusPackageInformation.attributes.SubscriberID]: accountInfo?.subId,
    });
  }, []);

  const handleViewDetails = (item: ParentObject) => {
    dispatch(callAction({ offerName: item.packNameNT, packPrice: item.packagePrice }, QUERY.GetOfferPackDetails))?.then((response: ParentObject) => {
      if (response?.status) {
        navigate(ROUTE.WEB.ACT_STATUS_PACK_DETAILS);
      }
    });
  };
  return (
    <View style={styles.container} testID="package-info-test">
      <View style={[subscriptionDetails?.length > 0 && styles.statusBox, styles.paddingZero]}>
        <List
          style={styles.listStyle}
          data={formattedData}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text label={item.title} style={styles.sectionHeader} />;
            }

            const { data } = item;
            const durationKey = formatDurationForUI(data.packDuration);
            const translatedDuration = t(`strings.${durationKey}`);

            return (
              <View style={styles.secondaryConView}>
                <Text label={data.packageName} style={styles.status} />

                <View style={styles.statusWrapper}>
                  <View style={styles.row}>
                    <Text style={[styles.activeText, styles.mediumTextStyle]}>{`₹${data.packagePrice}`}</Text>

                    {data.packDuration && <Text style={[styles.activeText, styles.regularTextStyle]}>{`/${translatedDuration}`}</Text>}
                  </View>

                  {data.packageType === STRINGS.PREMIUM_PACKAGE && (
                    <Pressable onPress={() => handleViewDetails(data)}>
                      <Text label={t(`strings.viewDetails`)} style={styles.viewDetailsText} />
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
          ListEmptyComponent={<Text label={errorMessage} style={styles.transId} />}
        />
      </View>
    </View>
  );
};

export default PackageInfo;
