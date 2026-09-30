import React, { memo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Button, CommonSuccess, Image, Text } from 'components/sales';
import { FORMS, ICONS, QUERY, ROUTE, STRINGS, STYLES } from 'const';
import { Sizing } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { gcs } from 'styles/webBreakpoints';
import { callAction } from 'utils/formBuilderHelper';
import styles from './DealerSuccess.styles';

export type DealerSuccessProps = {
  text?: string;
};

const DealerSuccess = () => {
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { dealerSuccessData } = useSelector((state: RootState) => state.dealerHelp);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate, goHome, reset } = useNavigate();
  const successMessage = dealerSuccessData?.message === STRINGS.SUCCESS ? t('strings.dealerRequestSent') : dealerSuccessData?.message;

  const handleNavigation = (type: string) => {
    if (type === ROUTE.WEB.DEALER_RAISE_REQUEST) {
      dispatch(callAction({}, QUERY.GetMainCategoryBR, '', navigate));
      reset(ROUTE.WEB.DEALER_RAISE_REQUEST, isRedirection);
    } else {
      const requestInput = {
        input: {
          formName: FORMS.dealerHelpTrackTable,
        },
      };
      dispatch(callAction(requestInput, QUERY.GetAllSRDetailsForLoginUser, '', navigate));
      reset(ROUTE.WEB.DEALER_TRACK_REQUEST, isRedirection);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={[styles.contentContainerStyle, styles[gcs('contentContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess iconName={ICONS.CONFIRM_SUCCESS} primaryText={successMessage} hasDefaultHeader />
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.DEALER_RAISE_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.raiseNewDealerRequest`)} />
          <View style={styles.iconContainer}>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
          </View>
        </Pressable>
        <Pressable onPress={() => handleNavigation(ROUTE.WEB.DEALER_TRACK_REQUEST)} style={styles.navigationContainer}>
          <Text style={styles.navigationTextStyle} label={t(`strings.trackDealerRequest`)} />
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

export default memo(DealerSuccess);
