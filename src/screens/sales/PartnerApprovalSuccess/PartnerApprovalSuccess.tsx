/**
 * Success screen for partner approval
 *
 * @module components/PartnerApprovalSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Button, CommonSuccess, Image, Text } from 'components/sales';
import { ICONS, ROUTE, STYLES } from 'const';
import { Sizing } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { gcs } from 'styles/webBreakpoints';
import styles from './PartnerApprovalSuccess.styles';

/**
 * Represents a PartnerApprovalSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const PartnerApprovalSuccess = () => {
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { partnerApprovalSuccessData, selectedPartner, partnerList } = useSelector((state: RootState) => state.partnerApproval);
  const { t } = useTranslation();
  const { navigate, goHome } = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={[styles.contentContainerStyle, styles[gcs('contentContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess
          iconName={partnerApprovalSuccessData?.isRejected ? ICONS.WARNING_EXCLAMATION : ICONS.CONFIRM_SUCCESS}
          primaryText={partnerApprovalSuccessData?.result?.message}
          hasDefaultHeader
        />
        <View style={[styles.balanceContainer, styles.partnerContainer]}>
          <View style={styles.partnerNameContainer}>
            <Text style={styles.smallTextStyle} label={t(`strings.partnerName`)} />
            <View style={styles.rowContainer}>
              <Text style={styles.mediumTextStyle} label={selectedPartner?.partnerName || selectedPartner?.data?.partnerName} />
            </View>
          </View>
        </View>
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.ACTION_PARTNER_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.actionAnotherPartnerRequest`)} />
          <View style={styles.flexRow}>
            <View style={styles.listCountContainer}>
              <Text style={styles.listCountText}>{partnerList.length > 0 ? partnerList.length - 1 : 0}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.TRACK_PARTNER_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.trackPartnerRequest`)} />
          <View style={styles.iconContainer}>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
          </View>
        </Pressable>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          iconName={ICONS.HOME}
          iconHeight={Sizing.layout.x15}
          iconWidth={Sizing.layout.x15}
          fontSize={Sizing.layout.x14}
          isDimension={false}
          iconPosition={STYLES.POSITION.LEFT}
          label={t('strings.backToHome')}
          onPress={() => goHome(isRedirection)}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(PartnerApprovalSuccess);
