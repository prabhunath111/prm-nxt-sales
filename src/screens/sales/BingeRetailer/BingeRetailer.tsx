/**
 * to show training videos and documents
 *
 * @module components/BingeRetailer
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, FlatList, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { ParentObject } from 'store/sales/types/common';
import { ActionTileCard } from 'components/sales';
import { ICONS } from 'const';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { BINGE_RETAILER_ICON, BINGE_RETAILER_ROUTE, BingeRetailerData, REDIRECTION_URL, ROUTE } from 'const/strings';
import { useTranslation } from 'react-i18next';
import styles from './BingeRetailer.styles';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

export type BingeRetailerProps = {
  text?: string;
};

const BingeRetailer = () => {
  const { dashboard } = useSelector((state: RootState) => state.user.navigation);
  const { navigate } = useNavigate();
  const { inflection } = useInflection();
  const { t } = useTranslation();

  const requiredPaths = new Set(BINGE_RETAILER_ROUTE);

  const pathToIcon = BINGE_RETAILER_ICON;

  const menuCards = dashboard
    .filter((item: ParentObject) => requiredPaths.has(item.path))
    .map((item: ParentObject) => ({
      menuTitle: item.menuTitle.trim(),
      path: item.path,
      menuIcon: pathToIcon[item.path] || 'circle',
      isModel: item.isModel,
    }));

  const orderedMenuCards = [...menuCards].sort((a, b) => BINGE_RETAILER_ROUTE.indexOf(a.path) - BINGE_RETAILER_ROUTE.indexOf(b.path));
  const routes = orderedMenuCards.length > 0 ? orderedMenuCards : BingeRetailerData;
  const navigateTo = (routeName: string) => {
    if (routeName === ROUTE.WEB.LIVE_UPDATES) {
      Linking.openURL(REDIRECTION_URL.MOENGAGE_URL);
    } else {
      if (routeName === ROUTE.WEB.DEALER_HELP) {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.DealerHelp_PageVisit.moduleName, {
          [MoengageMixpanelModules.BingRetailer.DealerHelp_PageVisit.attributes.Status]: true,
        });
      }
      navigate(routeName);
    }
  };

  const renderItem = ({ item }: { item: ParentObject }) => (
    <ActionTileCard
      label={t(`menuTitle.${item.menuTitle}`, { defaultValue: item.menuTitle })}
      iconName={ICONS[item.menuIcon as keyof typeof ICONS]}
      onPress={() => navigateTo(item.path)}
    />
  );
  return (
    <View testID="binge-retailer-container" style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
      <FlatList
        testID="binge-retailer-list"
        data={routes}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default memo(BingeRetailer);
