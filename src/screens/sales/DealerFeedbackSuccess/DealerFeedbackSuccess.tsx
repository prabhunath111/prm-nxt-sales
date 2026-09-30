/**
 * Success screen for EVD MDN change after valid otp change&quot;
 *
 * @module components/DealerFeedbackSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { Button, Image, InformationText, Text } from 'components/sales';
import { ICONS, PROPERTIES, ROUTE, STRINGS, STYLES } from 'const';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import useNavigate from 'hooks/useNavigate';
import styles from './DealerFeedbackSuccess.styles';

/**
 * Represents a DealerFeedbackSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const DealerFeedbackSuccess = () => {
  const { t } = useTranslation();
  const { feedbackSuccessData } = useSelector((state: RootState) => state.dealerFeedback);
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { navigate, goHome } = useNavigate();

  const handleNavigation = (type: string) => {
    if (type === STRINGS.RAISE_ANOTHER_FEEDBACK) {
      navigate(ROUTE.WEB.RAISE_DEALER_FEEDBACK);
    } else {
      navigate(ROUTE.WEB.TRACK_DEALER_FEEDBACK);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={[styles.topContainer, styles[gcs('topContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <View style={styles.subContainer}>
            <Image iconName={ICONS.CONFIRM_SUCCESS} height={Sizing.layout.x56} width={Sizing.layout.x56} isDimension={false} />
            <Text style={styles.headerText}>{feedbackSuccessData?.message}</Text>
            <InformationText
              containerStyle={styles.subIdTextContainer}
              primaryText={PROPERTIES.DEALER_FEEDBACK.feedbackID}
              secondaryText={feedbackSuccessData.feedbackId}
              primaryStyle={styles.primaryText}
              secondaryStyle={[styles.primaryText, styles.subIdText]}
              separator=" : "
            />
          </View>
          <Pressable onPress={() => handleNavigation(STRINGS.RAISE_ANOTHER_FEEDBACK)} style={styles.navigationContainer}>
            <Text style={styles.navigationTextStyle} label={t('strings.raiseDealerFeedback')} />
            <View style={styles.rightIcon}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronImageStyle} />
            </View>
          </Pressable>
          <Pressable onPress={() => handleNavigation(STRINGS.TRACK_FEEDBACK)} style={styles.navigationContainer}>
            <Text style={styles.navigationTextStyle}>{t('strings.trackDealerFeedback')}</Text>
            <View style={styles.rightIcon}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronImageStyle} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          iconName={ICONS.HOME}
          fontSize={Sizing.layout.x12}
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

export default memo(DealerFeedbackSuccess);
