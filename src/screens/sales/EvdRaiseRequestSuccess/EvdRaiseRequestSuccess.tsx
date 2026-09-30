/**
 * Success screen for purchase order
 *
 * @module components/EvdRaiseRequestSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { ICONS, ROUTE, STYLES } from 'const';
import { Button, CommonSuccess, Image, Text } from 'components/sales';
import { Sizing } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { gcs } from 'styles/webBreakpoints';
import styles from './EvdRaiseRequestSuccess.styles';

/**
 * Represents a EvdRaiseRequestSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const EvdRaiseRequestSuccess = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { goHome, reset } = useNavigate();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { successMessage } = useSelector((state: RootState) => state.purchaseOrder);

  const handleNavigation = (route: string) => {
    reset(route, isRedirection);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={[styles.contentContainerStyle, styles[gcs('contentContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess iconName={false ? ICONS.WARNING_EXCLAMATION : ICONS.CONFIRM_SUCCESS} primaryText={successMessage} hasDefaultHeader />
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.PURCHASE_ORDER_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.raiseNewRequest`)} />
          <View style={styles.iconContainer}>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
          </View>
        </Pressable>
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.PURCHASE_ORDER_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.trackRequest`)} />
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

export default memo(EvdRaiseRequestSuccess);
