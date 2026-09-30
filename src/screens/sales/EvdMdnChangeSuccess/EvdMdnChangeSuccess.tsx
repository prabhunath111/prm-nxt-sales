/**
 * Success screen for EVD MDN change after valid otp change&quot;
 *
 * @module components/EvdMdnChangeSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Image, Text } from 'components/sales';
import { ICONS, STYLES } from 'const';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { closeWebView } from 'utils/navigationHelper';
import styles from './EvdMdnChangeSuccess.styles';

/**
 * Represents a EvdMdnChangeSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const EvdMdnChangeSuccess = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { evdMdnChangeData } = useSelector((state: RootState) => state.evdMdnChange);
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);

  const logoutHandler = () => {
    if (isRedirection) {
      closeWebView();
    } else {
      dispatch(actions.doLogout());
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.subContainer}>
          <Image iconName={ICONS.CONFIRM_SUCCESS} height={Sizing.layout.x56} width={Sizing.layout.x56} isDimension={false} />
          <Text style={styles.headerText}>{evdMdnChangeData?.message}</Text>
          <View style={[styles.purpleContainer, styles[gcs('purpleContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={styles.textStyle}>{t('strings.newEvdMdn')}</Text>
            <Text style={styles.numberText}>{evdMdnChangeData?.newMDN}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          label={t('strings.okProceedToLogin')}
          type={STYLES.TYPE.PRIMARY}
          onPress={() => logoutHandler()}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(EvdMdnChangeSuccess);
