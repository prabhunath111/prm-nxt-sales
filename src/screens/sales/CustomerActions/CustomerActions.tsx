/**
 * in this customer action related menu will be present
 *
 * @module components/CustomerActions
 * @memberof - View Component
 */
import React, { memo, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { ActionTileCard } from 'components/sales';
import { CHILD_TYPE, HEADER_TITLE, ICONS, MODAL } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { ParentObject } from 'store/sales/types/common';
import uiActions from 'store/sales/actions/ui';
import useNavigate from 'hooks/useNavigate';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import {
  BINGE_RETAILER_ROUTE,
  HOME_ROUTE,
  MY_ACTION_MAIN_ROUTE,
  MY_ACTION_ROUTE,
  NEW_CUSTOMER_ROUTE,
  OTHER_CUSTOMER_ACTION_ICON,
  OTHER_MISCELLANEOUS_ROUTE,
  ROUTE,
} from 'const/strings';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './CustomerActions.styles';

/**
 * Represents a CustomerActions component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const CustomerActions = () => {
  const { dashboard } = useSelector((state: RootState) => state.user.navigation);
  const { eligibleStoreAutomation } = useSelector((state: RootState) => state.user);
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { inflection } = useInflection();

  const requiredPaths = new Set([...HOME_ROUTE, ...NEW_CUSTOMER_ROUTE, ...MY_ACTION_MAIN_ROUTE, ...MY_ACTION_ROUTE, ...OTHER_MISCELLANEOUS_ROUTE, ...BINGE_RETAILER_ROUTE]);
  const pathToIcon = OTHER_CUSTOMER_ACTION_ICON;

  const menuCards = dashboard
    .filter((item: ParentObject) => {
      if (!eligibleStoreAutomation && item.moduleNameNT === ROUTE.WEB.EXCLUSIVE_STORE) {
        return false;
      }
      return !requiredPaths.has(item.path);
    })
    .map((item: ParentObject) => ({
      menuTitle: item.menuTitle.trim(),
      path: item.path,
      menuIcon: pathToIcon[item.path] || item.menuIcon,
      isModel: item.isModel,
      isDisable: item.isDisable,
    }));

  const trackPageVisit = (routeName: string) => {
    const eventMap: Record<string, any> = {
      [ROUTE.WEB.CUSTOMER_INVOICE]: MoengageMixpanelModules.customerInvoice?.customerInvoice_PageVisit,
      [ROUTE.WEB.AUTO_EVD_TRANSFER]: MoengageMixpanelModules.autoEVDTransfer?.AutoEVDTransfer_Page_Visit,
      [ROUTE.WEB.RESET_EVD_PIN]: MoengageMixpanelModules.resetEVDPin?.resetEVDPin_PageVisit,
      [ROUTE.WEB.DEMO_BOX_DETAIL]: MoengageMixpanelModules.demoBoxDetail?.DemoBoxDetail_PageVisit,
      // [ROUTE.WEB.FILTER_EVD_MDN_CHANGE]: MoengageMixpanelModules.evdMDNChange?.EVDMDNChange_Page_Visit,
      [ROUTE.WEB.EVD_TRANSFER]: MoengageMixpanelModules.evdTransfer?.EVD_Transfer_PageVisit,
      [ROUTE.WEB.RECHARGE_WINBACK]: MoengageMixpanelModules.rechargeWinback.Winback_PageVisit,
      [ROUTE.WEB.REPUSH_ORDER]: MoengageMixpanelModules.RepushOrder?.RepushOrderPageVisit,
      [ROUTE.WEB.TSK_VOUCHER]: MoengageMixpanelModules.TSKVoucher?.TSKVoucherPageVisit,
      [ROUTE.WEB.EXCLUSIVE_STORE]: MoengageMixpanelModules.ExclusiveStore?.ExclusiveStorePageVisit,

      [ROUTE.WEB.WORK_ORDER_RECREATION]: MoengageMixpanelModules.WorkOrderRecreation?.WorkOrderRecreationPageVisit,
      [ROUTE.WEB.BOX_TYPE_CHANGE]: MoengageMixpanelModules.BoxTypeChange?.BoxTypeChange_PageVisit,
      // Add other modules here as they get added to the config
    };

    const event = eventMap[routeName];
    if (event) {
      MoengageMixpanel.trackEvent(event.moduleName, {
        [event.attributes.Status]: true,
      });
    }
  };

  const navigateTo = (routeName: string, isDisable: boolean) => {
    if (isDisable) {
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.CONFIRMATION,
          showCloseIcon: true,
          showHeader: false,
          buttonInfo: {
            primaryButtonLabel: MODAL.OK,
            childData: HEADER_TITLE.THIS_MODULE_IS_NOT_APPLICABLE,
            centerLabel: true,
          },
        }),
      );
      return undefined;
    }
    trackPageVisit(routeName);
    navigate(routeName);
    return undefined;
  };

  /* eslint-disable react/no-unused-prop-types */
  const renderItem = useCallback(
    ({ item }: { item: ParentObject }) => (
      <ActionTileCard
        label={item.menuTitle}
        iconStyle={styles.iconStyle}
        iconName={ICONS[item.menuIcon as keyof typeof ICONS]}
        onPress={() => navigateTo(item.path, item.isDisable)}
      />
    ),
    [navigateTo],
  );

  const Separator = useCallback(() => <View style={styles.separator} />, []);

  return (
    <View testID="CustomerActions" style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
      <FlatList
        data={menuCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator
        scrollEnabled
        persistentScrollbar
      />
    </View>
  );
};

export default memo(CustomerActions);
