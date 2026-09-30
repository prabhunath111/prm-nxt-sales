/**
 * Success screen for EVD MDN success screen for distributer approval
 *
 * @module components/EvdMdnDistSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { ICONS, ROUTE, STRINGS, STYLES } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { Button, CommonSuccess, Image, InformationText, Text } from 'components/sales';
import { Sizing } from 'styles';
import evdMdnChange from 'store/sales/actions/evdMdnChange';
import styles from './EvdMdnDistSuccess.styles';

/**
 * Represents a EvdMdnDistSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */

const EvdMdnDistSuccess = () => {
  const { evdMdnDistSuccessData } = useSelector((state: RootState) => state.evdMdnChange);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { navigate, goHome } = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleNavigation = (type: string) => {
    if (type === STRINGS.ACTION_MDN) {
      dispatch(evdMdnChange.resetEvdMdnPartnerList());
      navigate(ROUTE.WEB.EVD_MDN_APPROVE_OR_REJECT);
    } else {
      navigate(ROUTE.WEB.FILTER_EVD_MDN_CHANGE);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <View>
            <CommonSuccess
              primaryText={evdMdnDistSuccessData.message}
              hasDefaultHeader
              iconName={evdMdnDistSuccessData.reason ? ICONS.WARNING_EXCLAMATION : ICONS.CONFIRM_SUCCESS}
            />
          </View>
          <View style={[styles.balanceContainer, styles.partnerContainer, { margin: 0 }]}>
            <View style={styles.partnerNameContainer}>
              <Text style={styles.smallTextStyle} label={t('strings.partnerNameId')} />
              <View style={styles.rowContainer}>
                <Text style={styles.mediumTextStyle} label={evdMdnDistSuccessData.partnerName} />
                <View style={styles.verticalSeparator} />
                <Text style={styles.regularTextStyle} label={evdMdnDistSuccessData.partnerId} />
              </View>
            </View>
            <View style={styles.horizontalSeparator} />
            <View style={styles.partnerNameContainer}>
              <InformationText
                primaryText={evdMdnDistSuccessData.reason ? STRINGS.MDN : STRINGS.UPDATED_NEW_MDN}
                secondaryText={evdMdnDistSuccessData.newRmn}
                primaryStyle={styles.smallTextStyle}
                secondaryStyle={styles.mediumTextStyle}
              />
            </View>
            {evdMdnDistSuccessData.reason && (
              <>
                <View style={styles.horizontalSeparator} />
                <View style={styles.partnerNameContainer}>
                  <InformationText
                    primaryText={STRINGS.REASON_FOR_REJECTION}
                    secondaryText={evdMdnDistSuccessData.reason}
                    primaryStyle={styles.smallTextStyle}
                    secondaryStyle={styles.mediumTextStyle}
                  />
                </View>
              </>
            )}
          </View>
          <Pressable onPress={() => handleNavigation(STRINGS.ACTION_MDN)} style={styles.navigationContainer}>
            <Text style={styles.navigationTextStyle} label={t('strings.actionMdnChange')} />
            <View style={styles.rightIcon}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronImageStyle} />
            </View>
          </Pressable>
          <Pressable onPress={() => handleNavigation(STRINGS.TRACK_EVD_MDN_CHANGE)} style={styles.navigationContainer}>
            <Text style={styles.navigationTextStyle}>{t('strings.trackMdnChange')}</Text>
            <View style={styles.rightIcon}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronImageStyle} />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <Button
        onPress={() => goHome(isRedirection)}
        iconHeight={Sizing.layout.x15}
        iconName={ICONS.HOME}
        fontSize={Sizing.layout.x14}
        iconWidth={Sizing.layout.x15}
        iconPosition={STYLES.POSITION.LEFT}
        isDimension={false}
        label={t('strings.backToHome')}
      />
    </View>
  );
};

export default memo(EvdMdnDistSuccess);
