/**
 * Success screen for Competitor data capture
 *
 * @module components/CompetitorDataSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, CommonSuccess, Image, Text } from 'components/sales';
import { FORMS, ICONS, ROUTE, STYLES } from 'const';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './CompetitorDataSuccess.styles';

/**
 * Represents a CompetitorDataSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const CompetitorDataSuccess = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { competitorSuccessData } = useSelector((state: RootState) => state.competitorDataCapture);
  const { goHome, navigate } = useNavigate();

  const moduleRouteHandler = (route: string) => {
    navigate(route);
  };

  const renderModuleRow = (iconName: string, moduleName: string, routeName: string) => (
    <Pressable style={styles.moduleContainer} onPress={() => moduleRouteHandler(routeName)}>
      <View style={styles.iconStyle}>
        <Image iconName={iconName} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} style={styles.imageStyle} />
        <Text style={styles.moduleText}>{t(`forms.${moduleName}`)}</Text>
      </View>
      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} />
    </Pressable>
  );

  return (
    <View style={[styles.mainContainer, styles[gcs('mainContainer', inflection, true, ['md', 'lg', 'xl'])]]} testID="competitorDataTest">
      <ScrollView contentContainerStyle={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess primaryText={competitorSuccessData?.message} hasDefaultHeader />
        <View style={[styles.borderContainer, styles[gcs('borderContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Text style={styles.moreActionText}>{t('strings.moreActions')}</Text>
          {renderModuleRow(ICONS.ADD_MORE_COMPETITOR_DATA, FORMS.addMoreCompetitorData, ROUTE.WEB.COMPETITOR_DATA)}
          {/* Commented the below redirection cards and will be enables once below modules will be available */}
          {/* {renderModuleRow(ICONS.RECHARGE_REVERSAL_PINK, FORMS.rechargeReversal, ROUTE.WEB.RECHARGE_REVERSAL)}
          {renderModuleRow(ICONS.DASHBOARD, FORMS.dashboard, '')} */}
          {/* <Text onPress={() => {}} style={[styles.heavyRewfreshText, styles.viewMore]}>
            {t('strings.viewMore')}
          </Text> */}
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          iconName={ICONS.HOME}
          fontSize={Sizing.layout.x16}
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

export default memo(CompetitorDataSuccess);
