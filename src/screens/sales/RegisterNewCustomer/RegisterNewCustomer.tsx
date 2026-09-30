/**
 * in this register new customer  related menu will be present
 *
 * @module components/RegisterNewCustomer
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { ParentObject } from 'store/sales/types/common';
import { ActionTileCard } from 'components/sales';
import { ICONS } from 'const';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { NEW_CUSTOMER_ICON, NEW_CUSTOMER_ROUTE, ROLES, ROUTE } from 'const/strings';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './RegisterNewCustomer.styles';
/**
 * Represents a RegisterNewCustomer component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const RegisterNewCustomer = () => {
  const { dashboard } = useSelector((state: RootState) => state.user.navigation);
  const { info } = useSelector((state: RootState) => state.user);
  const { navigate } = useNavigate();
  const { inflection } = useInflection();

  const requiredPaths = new Set(NEW_CUSTOMER_ROUTE);

  const pathToIcon = NEW_CUSTOMER_ICON;

  const menuCards = dashboard
    .filter((item: ParentObject) => {
      const isRequiredPath = requiredPaths.has(item.path);
      const hideForRole = item.path === ROUTE.WEB.ETSK_REPUSH && (info?.internalRole === ROLES.asm || info?.internalRole === ROLES.asi);
      return isRequiredPath && !hideForRole;
    })
    .map((item: ParentObject) => ({
      menuTitle: item.menuTitle.trim(),
      path: item.path,
      menuIcon: pathToIcon[item.path] || 'circle',
      isModel: item.isModel,
    }));

  const orderedMenuCards = [...menuCards].sort((a, b) => NEW_CUSTOMER_ROUTE.indexOf(a.path) - NEW_CUSTOMER_ROUTE.indexOf(b.path));

  const navigateTo = (routeName: string) => {
    if (routeName === 'primaryTvRegistration') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationPageVisit.moduleName, {
        [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationPageVisit.attributes.Status]: true,
      });
    }
    if (routeName === 'activationStatus') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ActivationStatus.ActivationStatusPageVisit.moduleName, {
        [MoengageMixpanelModules.ActivationStatus.ActivationStatusPageVisit.attributes.Status]: true,
      });
    }
    if (routeName === 'quotation') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuotePageVisit.moduleName, {
        [MoengageMixpanelModules.Quotation.QuotePageVisit.attributes.Status]: true,
      });
    }
    if (routeName === 'eTSKMulti') {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.ETSMultiTV.ETSKMultiPageVisit.moduleName, {
        [MoengageMixpanelModules.ETSMultiTV.ETSKMultiPageVisit.attributes.Status]: true,
      });
    }
    navigate(routeName);
  };

  const renderItem = ({ item }: { item: ParentObject }) => (
    <ActionTileCard label={item.menuTitle} iconName={ICONS[item.menuIcon as keyof typeof ICONS]} onPress={() => navigateTo(item.path)} />
  );
  return (
    <View testID="RegisterNewCustomer" style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
      <FlatList data={orderedMenuCards} renderItem={renderItem} keyExtractor={(item) => item.id} ItemSeparatorComponent={() => <View style={styles.separator} />} />
    </View>
  );
};

export default memo(RegisterNewCustomer);
