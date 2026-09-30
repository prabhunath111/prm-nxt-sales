/**
 * Success screen for TSRA approval
 *
 * @module components/TsraApprovalSuccess
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
import styles from './TsraApprovalSuccess.styles';

/**
 * Represents a TsraApprovalSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const TsraApprovalSuccess = () => {
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { tsraSuccessData } = useSelector((state: RootState) => state.tsraApproval);
  const { t } = useTranslation();
  const { navigate, goHome } = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
  };
  return (
    <View style={styles.container} testID="tsraSuccess">
      <ScrollView style={styles.scrollContainer} contentContainerStyle={[styles.contentContainerStyle, styles[gcs('contentContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess iconName={tsraSuccessData?.isRejected ? ICONS.WARNING_EXCLAMATION : ICONS.CONFIRM_SUCCESS} primaryText={tsraSuccessData?.message} hasDefaultHeader />
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.ACTION_TSRA_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.raiseNewActionTsraRequest`)} />
          <View style={styles.iconContainer}>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
          </View>
        </Pressable>
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.TRACK_TSRA_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.trackTsraRequest`)} />
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

export default memo(TsraApprovalSuccess);
