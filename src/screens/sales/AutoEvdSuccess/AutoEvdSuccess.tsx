/**
 * Success screen for auto evd module.
 *
 * @module components/AutoEvdSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, CommonSuccess, Image, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { ICONS, ROUTE, STYLES } from 'const';
import { Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import styles from './AutoEvdSuccess.styles';

/**
 * Represents a AutoEvdSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const AutoEvdSuccess = () => {
  const { inflection } = useInflection();
  const { evdSuccessData } = useSelector((state: RootState) => state.autoEvd);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { navigate, goHome } = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = () => {
    navigate(ROUTE.WEB.AUTO_EVD_TRANSFER);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <View style={styles.successContainer}>
            <CommonSuccess primaryText={evdSuccessData.message} hasDefaultHeader />
            <Text style={styles.pleaseWaitText} label={t('strings.dealerThreasholdSentSuccessfully')} />
          </View>
          <View style={styles.dealerContainer}>
            <Text style={styles.primaryTextStyle} label={t('strings.dealerName')} />
            <Text style={styles.secondaryTextStyle} label={evdSuccessData.dealerName} />
          </View>
          <Pressable onPress={handleNavigation} style={styles.navigationContainer}>
            <Text style={styles.navigationTextStyle} label={t('strings.autoEvdToAnotherPartner')} />
            <View style={styles.iconContainer}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronIconStyle} />
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

export default memo(AutoEvdSuccess);
