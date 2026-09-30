/**
 * used to enable fingerprint/faceid authentication for mobile device
 *
 * @module components/LocalAuthentication
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View } from 'react-native';
import { Colors, Sizing } from 'styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { checkBiometrySupport, handleLocalAuthenticate } from 'utils/localAuthHelper';
import { storageService } from 'services/storageService';
import { ICONS, STRINGS, STYLES } from 'const';
import { useTranslation } from 'react-i18next';
import uiActions from 'store/sales/actions/ui';
import userActions from 'store/sales/actions/user';
import { Button, Gradient, Image, Text } from 'components/sales';
import styles from './LocalAuthentication.styles';

const LocalAuthentication = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);

  const handleBiometricVerification = async () => {
    const authResult: any = await handleLocalAuthenticate();
    if (authResult?.success) {
      storageService.setItem(STRINGS.USER_DETAILS, JSON.stringify({ isLocalAuthEnabled: STRINGS.TRUE, userName: userDetails?.userName }));
      dispatch(userActions.updateLocalAuthStatus(true));
    }
  };

  const handleEnableNow = async () => {
    const biometricData = await checkBiometrySupport();
    if (!biometricData?.available) {
      dispatch(uiActions.showError(t('errors.localAuthentication')));
    } else {
      handleBiometricVerification();
    }
  };

  const handleSkip = () => {
    dispatch(userActions.updateLocalAuthStatus(true));
  };

  return (
    <View testID="LocalAuthentication" style={styles.container}>
      <Gradient start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={Colors.gradient.pinkGradient} style={styles.subContainer}>
        <Text label={t('strings.faceIdOrFingerPrint')} style={styles.header} fontSize={Sizing.layout.x25} />
        <Image iconName={ICONS.ALERT_INFO} height={Sizing.layout.x6} width={Sizing.layout.x6} style={{ marginTop: Sizing.layoutP.xp8 }} />
        <Text label={t('strings.fingerPrintDesc')} fontSize={Sizing.layout.x15} style={[styles.subText]} />
        <Text label={t('strings.or')} fontSize={Sizing.layout.x15} />
        <Text label={t('strings.faceIDDesc')} fontSize={Sizing.layout.x15} style={styles.subText} />
        <Button label={t('strings.enableNow')} fontSize={Sizing.layout.x20} type={STYLES.TYPE.PRIMARY} style={styles.button} onPress={handleEnableNow} />
        <View style={styles.Separator}>
          <View style={styles.line} />
          <Text label={t('strings.or')} style={styles.text} />
          <View style={styles.line} />
        </View>
        <Text label={t('strings.skip')} style={styles.skipText} onPress={handleSkip} />
      </Gradient>
    </View>
  );
};

export default memo(LocalAuthentication);
