/**
 * in this my action related menu will be present
 *
 * @module components/MyActions
 * @memberof - View Component
 */
import React, { memo, useEffect, useMemo } from 'react';
import { View, ScrollView, FlatList, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/ui';
import homePageActions from 'store/sales/actions/homePage';
import { ParentObject } from 'store/sales/types/common';
import { ActionTileCard, DashboardIcon, Text } from 'components/sales';
import { ICONS, QUERY } from 'const';
import useNavigate from 'hooks/useNavigate';
import { Route } from 'navigation/routes/RouteTypes';
import Carousel from 'components/sales/Carousel';
import AppDrawer from 'navigation/drawer/AppDrawer';
import { getFullScreenWidth } from 'styles/dimentionHelper';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { isWeb } from 'utils/platformHelper';
import { MY_ACTION_ICON, MY_ACTION_MAIN_ICON, MY_ACTION_MAIN_ROUTE, MY_ACTION_ROUTE, ROUTE } from 'const/strings';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './MyActions.styles';

/**
 * Represents a MyActions component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const MyActions = () => {
  const { dashboard } = useSelector((state: RootState) => state.user.navigation);
  const { navigate } = useNavigate();
  const { isDrawerOpen } = useSelector((state: RootState) => state.ui);
  const { homePageData = {} } = useSelector((state: RootState) => state.homePage);
  const { evdBalance } = useSelector((state: RootState) => state.homePage);
  const dispatch = useDispatch<AppDispatch>();
  const { inflection } = useInflection();

  const requiredMAINPaths = new Set(MY_ACTION_MAIN_ROUTE);
  const pathToMAINIcon = MY_ACTION_MAIN_ICON;
  const menuMAINCards = dashboard
    .filter((item: ParentObject) => requiredMAINPaths.has(item.path))
    .map((item: ParentObject) => ({
      menuTitle: item.menuTitle.trim(),
      path: item.path,
      menuIcon: pathToMAINIcon[item.path] || 'circle',
    }));

  const orderedMainMenuCards = [...menuMAINCards].sort((a, b) => MY_ACTION_MAIN_ROUTE.indexOf(a.path) - MY_ACTION_MAIN_ROUTE.indexOf(b.path));

  const requiredPaths = new Set(MY_ACTION_ROUTE);

  const pathToIcon = MY_ACTION_ICON;

  const menuCards = dashboard
    .filter((item: ParentObject) => requiredPaths.has(item.path))
    .map((item: ParentObject) => ({
      menuTitle: item.menuTitle.trim(),
      path: item.path,
      menuIcon: pathToIcon[item.path] || item.menuIcon, // fallback
      isModel: item.isModel,
    }));

  const orderedMenuCards = [...menuCards].sort((a, b) => MY_ACTION_ROUTE.indexOf(a.path) - MY_ACTION_ROUTE.indexOf(b.path));

  const trackPageVisit = (routeName: string) => {
    const eventMap: Record<string, any> = {
      [ROUTE.WEB.DEMO_BOX_DETAIL]: MoengageMixpanelModules.demoBoxDetail?.DemoBoxDetail_PageVisit,
      [ROUTE.WEB.TSRA_INVENTORY]: MoengageMixpanelModules.tsraInventory?.TSRAInventory_PageVisit,
      [ROUTE.WEB.STORE_DASHBOARD]: MoengageMixpanelModules.StoreDashboard?.StoreDashboardPageVisit,
      [ROUTE.WEB.TSRA_APPROVAL]: MoengageMixpanelModules.TsraApproval?.TSRA_ApprovalPageVisit,
      [ROUTE.WEB.PARTNER_APPROVAL]: MoengageMixpanelModules.PartnerApproval?.PartnerApproval_PageVisit,
      [ROUTE.WEB.CREATE_CHANNEL_PARTNER]: MoengageMixpanelModules.Manage_Hierarchy?.CreateNewDealer_PageVisit,
      [ROUTE.WEB.DEMO_ACCOUNT]: MoengageMixpanelModules.DemoAccountCreation?.DemoAccountRegistartion_PageVisit,
      // Add other modules here as they get added to the config
    };

    const event = eventMap[routeName];
    if (event) {
      MoengageMixpanel.trackEvent(event.moduleName, {
        [event.attributes.Status]: true,
      });
    }
  };

  const navigateTo = (routeName: string) => {
    trackPageVisit(routeName);
    navigate(routeName);
  };

  const renderItem = ({ item }: { item: ParentObject }) => (
    <ActionTileCard label={item.menuTitle} iconName={ICONS[item.menuIcon as keyof typeof ICONS]} onPress={() => navigateTo(item.path)} />
  );

  interface RowData {
    title: string;
    ftd: string;
    mtd: string;
    tskStockQty?: string;
    buttonLabel?: string;
    onPress?: () => void;
  }

  interface InfoCardProps {
    rows: RowData[];
  }

  const InfoCard: React.FC<InfoCardProps> = ({ rows }) => (
    <View style={styles.card}>
      {rows.map((row, index) => (
        <React.Fragment key={row.title}>
          {/* Row */}
          <View style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>{row.title}</Text>
              <Text style={styles.subText}>
                {row?.tskStockQty ? (
                  <Text style={styles.bold}>{row?.tskStockQty}</Text>
                ) : (
                  <>
                    FTD <Text style={styles.bold}>{row?.ftd}</Text> | MTD <Text style={styles.bold}>{row?.mtd}</Text>
                  </>
                )}
              </Text>
            </View>

            {row.buttonLabel && (
              <Pressable style={styles.button} onPress={row.onPress}>
                <Text style={styles.buttonText}>{row.buttonLabel}</Text>
              </Pressable>
            )}
          </View>

          {/* Divider except after last row */}
          {index < rows.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );

  const handleToggleDrawer = () => {
    dispatch(actions.toggleDrawer(!isDrawerOpen));
  };

  const carouselDimension = useMemo(() => {
    if (isWeb) {
      switch (inflection) {
        case BreakPoints.XS:
          return { height: 250, width: getFullScreenWidth() };
        case BreakPoints.SM:
          return { height: 230, width: getFullScreenWidth() };
        default:
          return { height: 200, width: getFullScreenWidth() * 0.6 };
      }
    } else {
      return { height: 200, width: getFullScreenWidth() };
    }
  }, [inflection]);

  const handlePress = () => {
    navigateTo(ROUTE.WEB.TRANSACTION);
  };

  const cardData = [
    {
      id: 1,
      children: (
        <InfoCard
          rows={[
            {
              title: 'EVD balance (₹)',
              ftd: '',
              mtd: '',
              tskStockQty: `₹${evdBalance ?? 0}`,
              buttonLabel: '+ Add Money',
              onPress: () => {},
            },
            {
              title: 'Recharge (₹)',
              ftd: `₹${Number(homePageData?.rechargeFtd) ?? 0}`,
              mtd: `₹${Number(homePageData?.rechargeMtd) ?? 0}`,
              buttonLabel: 'View Details',
              onPress: () => handlePress(),
            },
          ]}
        />
      ),
      image: '',
    },
    {
      id: 2,
      children: (
        <InfoCard
          rows={[
            { title: 'Activation (Qty)', ftd: homePageData?.activationFtd ?? 0, mtd: homePageData?.activationMtd ?? 0 },
            { title: 'TSK stock (Qty)', ftd: '', mtd: '', tskStockQty: homePageData?.tskStock ?? 0 },
          ]}
        />
      ),
      image: '',
    },
    // {
    //   id: 3,
    //   children: (
    //     <InfoCard
    //       rows={[
    //         { title: 'TSK stock (Qty)', ftd: '', mtd: '', tskStockQty: homePageData?.tskStock ?? 0 },
    //         { title: 'Recharge (₹)', ftd: `₹${Number(homePageData?.rechargeFtd) ?? 0}`, mtd: `₹${Number(homePageData?.rechargeMtd) ?? 0}` },
    //       ]}
    //     />
    //   ),
    //   image: '',
    // },
  ];

  const getEvdBalance = () => {
    dispatch(homePageActions.getEvdBalance(QUERY.GetBalanceFos));
  };

  const getFtdData = () => {
    dispatch(homePageActions.getHomePageData(QUERY.GetHomepageData));
    if (!isWeb) getEvdBalance();
  };
  useEffect(() => {
    getFtdData();
  }, []);

  return (
    <>
      {isDrawerOpen ? (
        <View style={styles.overlay}>
          <AppDrawer onDrawerStateChange={handleToggleDrawer} />
        </View>
      ) : null}
      <View testID="MyActions" style={[styles.mainContainer, styles[gcs('mainContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <View style={styles.carouselContainer}>
          <Carousel
            carouselType="card"
            data={cardData}
            resizeMode="cover"
            height={carouselDimension.height}
            width={carouselDimension.width}
            paginationDotColor="#564372"
            autoScroll={false}
          />
        </View>
        <View style={styles.iconContainer}>
          {orderedMainMenuCards.map((route: Route) => (
            <View key={route.menuId} style={styles.iconItem}>
              <DashboardIcon label={route.menuTitle} value={route.path || ''} isModal={route.isModel} iconName={route.menuIcon} />
            </View>
          ))}
        </View>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} testID="home-scroll-view">
            <FlatList data={orderedMenuCards} renderItem={renderItem} keyExtractor={(item) => item.id} ItemSeparatorComponent={() => <View style={styles.separator} />} />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default memo(MyActions);
