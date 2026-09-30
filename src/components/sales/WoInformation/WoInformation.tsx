/**
 * wo info for activation status
 *
 * @module components/WoInformation
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { ICONS, PROPERTIES, STRINGS } from 'const';
import { formatTransDate, getStatus } from 'utils/activationStatusHelper';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { PillsGroup, Text, TextContainer, Image, List } from 'components/sales';
import { ParentObject } from 'store/sales/types/common';
import actions from 'store/sales/actions/activationStatusDetails';
import { isWeb } from 'utils/platformHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './WoInformation.styles';

/**
 * Represents a WoInformation component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered WoInformation component
 *
 * @example
 * <WoInformation text="Hello World!" />
 */

const WoInformation = () => {
  const { t } = useTranslation();
  const [selectedPill, setSelectedPill] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const { woDetailsData, woOtherDetails, upgradeWoDetails, accountInfo } = useSelector((state: RootState) => state.activationStatusDetails);
  const mobileKeys = new Set([STRINGS.ISP_MOBILE_KEY, STRINGS.ASI_MOBILE]);

  useEffect(() => {
    dispatch(actions.getWODetailsActivationStatus());
    dispatch(actions.getActivationStatusOtherDetails());
    dispatch(actions.getUpgradeWODetailsActivationStatus());
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusWODetails.moduleName, {
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusWODetails.attributes.Status]: true,
      [MoengageMixpanelModules.ActivationStatus.ActivationStatusWODetails.attributes.SubscriberID]: accountInfo?.subId,
    });
  }, []);
  const openDialer = async (phoneNumber: string) => {
    if (phoneNumber !== t(`strings.notAvailable`)) {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);

      const isCordovaWebkit = !!window.webkit?.messageHandlers?.cordova_iab;

      if ((!isWeb || isCordovaWebkit) && supported) {
        await Linking.openURL(url);
      }
    }
  };

  const renderWoDetails = ({ item }: { item: ParentObject }) => {
    const { statusText } = getStatus(item.wo_status ?? '', t);

    const woDetailsData = {
      woNumber: item.wo_num || t(`strings.notAvailable`),
      woStatus: statusText || t(`strings.notAvailable`),
      woCreatedDateAndTime: formatTransDate(item.wo_created_date),
      plannedDateAndTime: formatTransDate(item.wo_planned_start),
      completedDateAndTime: formatTransDate(item.wo_completed_date),
      cancelledDateAndTime: formatTransDate(item.wo_cancel_date),
      reasonCode: item.wo_reason_cd || t(`strings.notAvailable`),
      resolutionCode: item.wo_resolution_cd || t(`strings.notAvailable`),
    };

    const woIspAsiData = {
      ispNameKey: item.wo_isp_name || t(`strings.notAvailable`),
      ispMobileKey: item.wo_isp_mobile || t(`strings.notAvailable`),
      asiName: item.asi_name || t(`strings.notAvailable`),
      asiMobile: item.asi_mobile || t(`strings.notAvailable`),
    };

    return (
      <View style={styles.woDetailsCard}>
        <TextContainer
          itemContainerStyle={[styles.woDetailsCardContent]}
          primaryStyle={styles.primaryTextManage}
          secondaryStyle={styles.secondaryTextManage}
          data={woDetailsData}
          dataArray={PROPERTIES.ACTIVATION_STATUS.WO_DETAILS}
          hasSepratorBottom={false}
        />
        <View style={styles.seperator} />
        <View style={[styles.woDetailsCardContent, styles.bottomMargin]}>
          <Text label={t(`strings.ispAsiDetails`)} fontSize={Sizing.layout.x16} style={styles.cardTitle} />
        </View>
        {PROPERTIES.ACTIVATION_STATUS.WO_ISP_ASI_DETAILS.map((item) => (
          <View style={[styles.woDetailsCardContent, styles.bottomMarginSmall]}>
            <Text label={t(`strings.${item.key}`)} fontSize={Sizing.layout.x16} style={styles.primaryTextManage} />

            <Pressable style={[styles.mobileNumView]} onPress={() => openDialer(woIspAsiData[item.key])}>
              {mobileKeys.has(item.key) && woIspAsiData[item.key] !== t(`strings.notAvailable`) && (
                <Image iconName={ICONS.TELEPHONE} isDimension={false} width={Sizing.layout.x16} height={Sizing.layout.x16} style={styles.phoneIcon} />
              )}
              <Text label={woIspAsiData[item.key]} style={[styles.secondaryTextManage, mobileKeys.has(item.key) && styles.appColorPink]} />
            </Pressable>
          </View>
        ))}
      </View>
    );
  };

  const renderOtherDetails = ({ item }: { item: ParentObject }) => {
    const woOtherDetailsData = {
      tskNumber: item.tsk_no || t(`strings.notAvailable`),
      bookingFormNumber: item.bookformno || t(`strings.notAvailable`),
      boxType: item.pref_box_type || t(`strings.notAvailable`),
      alternateMobNumber: item.contact_1 || item.contact_2 || item.contact_3 || item.contact_4 || t(`strings.notAvailable`),
      connectionType: item.connectionType || t(`strings.notAvailable`),
    };

    return (
      <View style={styles.woDetailsCard}>
        <TextContainer
          itemContainerStyle={[styles.woDetailsCardContent]}
          primaryStyle={styles.primaryTextManage}
          secondaryStyle={styles.secondaryTextManage}
          data={woOtherDetailsData}
          dataArray={PROPERTIES.ACTIVATION_STATUS.WO_OTHER_DETAILS}
          hasSepratorBottom={false}
        />
      </View>
    );
  };
  const translatedWOPills = PROPERTIES.ACTIVATION_STATUS.WO_INFORMATION.map((item) => t(`strings.${item}`));
  useEffect(() => {
    if (!selectedPill) return;

    switch (selectedPill) {
      case STRINGS.WO_DETAILS:
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusWODetails.moduleName, {
          Status: true,
          SubscriberID: accountInfo?.subId,
        });
        break;

      case STRINGS.OTHER_DETAILS:
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusOtherDetails.moduleName, {
          Status: true,
          SubscriberID: accountInfo?.subId,
        });
        break;

      case STRINGS.UPGRADE_WO:
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusUpgradeWoDetails.moduleName, {
          Status: true,
          SubscriberID: accountInfo?.subId,
        });
        break;

      default:
        break;
    }
  }, [selectedPill, accountInfo?.subId]);

  return (
    <View style={styles.container} testID="wo-info-test">
      <PillsGroup
        itemStyles={styles.pillsGroupStyle}
        itemsArr={translatedWOPills}
        onPillPress={(e) => {
          setSelectedPill(e);
        }}
        defaultSelected
        selectedPillText={selectedPill}
      />
      <View>
        {selectedPill === STRINGS.WO_DETAILS &&
          (woDetailsData?.length > 0 ? (
            <List data={woDetailsData} renderItem={renderWoDetails} showsVerticalScrollIndicator style={styles.listStyle} />
          ) : (
            renderWoDetails({ item: {} } as { item: ParentObject })
          ))}
        {selectedPill === STRINGS.OTHER_DETAILS && (
          <List
            data={woOtherDetails}
            renderItem={renderOtherDetails}
            ListEmptyComponent={() => <Text style={styles.noData} label={t(`errors.noDataAvailable`)} />}
            showsVerticalScrollIndicator
            style={styles.listStyle}
          />
        )}
        {selectedPill === STRINGS.UPGRADE_WO &&
          (upgradeWoDetails?.length > 0 ? (
            <List data={upgradeWoDetails} renderItem={renderWoDetails} showsVerticalScrollIndicator style={styles.listStyle} />
          ) : (
            renderWoDetails({ item: {} } as { item: ParentObject })
          ))}
      </View>
    </View>
  );
};

export default WoInformation;
