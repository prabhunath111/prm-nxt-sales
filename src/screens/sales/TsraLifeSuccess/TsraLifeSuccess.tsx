/**
 * this screen will handle tsra success or reject
 *
 * @module components/TsraLifeSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import tsraLifeCycleAction from 'store/sales/actions/tsraLifeCycle';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import { ICONS, ROUTE, STYLES } from 'const';
import { Button, CommonSuccess, Image, Text } from 'components/sales';
import { Sizing } from 'styles';
import styles from './TsraLifeSuccess.styles';

/**
 * Represents a TsraLifeSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const TsraLifeSuccess = () => {
  const { tsraSuccessData } = useSelector((state: RootState) => state.tsraLifeCycle);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { navigate, goHome } = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleNavigation = (type: string) => {
    if (type === ROUTE.WEB.TRACK_TSRA_ACTION) {
      dispatch(tsraLifeCycleAction.resetTsraSubscriberList());
      navigate(ROUTE.WEB.TRACK_TSRA_ACTION);
    } else {
      navigate(ROUTE.WEB.FILTER_TRACK_TSRA_REQUEST);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <View>
            <CommonSuccess primaryText={tsraSuccessData?.message} hasDefaultHeader />
          </View>
          <Pressable onPress={() => handleNavigation(ROUTE.WEB.FILTER_TRACK_TSRA_REQUEST)} style={styles.navigationContainer}>
            <Text style={styles.navigationTextStyle} label={t('strings.raiseNewActionTsraRequest')} />
            <View style={styles.iconContainer}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronIconStyle} />
            </View>
          </Pressable>
          <Pressable onPress={() => handleNavigation(ROUTE.WEB.TRACK_TSRA_ACTION)} style={styles.navigationContainer}>
            <Text style={styles.navigationTextStyle} label={t('strings.trackTsraRequest')} />
            <View style={styles.iconContainer}>
              <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronIconStyle} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          iconName={ICONS.HOME}
          iconHeight={Sizing.layout.x15}
          iconWidth={Sizing.layout.x15}
          iconPosition={STYLES.POSITION.LEFT}
          label={t('strings.backToHome')}
          isDimension={false}
          onPress={() => goHome(isRedirection)}
        />
      </View>
    </View>
  );
};

export default memo(TsraLifeSuccess);
