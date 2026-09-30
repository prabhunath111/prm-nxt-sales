/**
 * Home page for the PRM Sales application
 *
 * @module components/HomePage
 * @memberof - View Component
 */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import AppDrawer from 'navigation/drawer/AppDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/ui';
import { Route } from 'navigation/routes/RouteTypes';
import DashboardIcon from 'components/sales/DashboardIcon';
import { useTranslation } from 'react-i18next';
import { ActionTileCard, Gradient, HeaderFilters, LiveNewsCardContainer } from 'components/sales';
import { ICONS, ROUTE } from 'const';
import { Colors } from 'styles';
import Carousel from 'components/sales/Carousel';
import { getFullScreenHeight, getFullScreenWidth } from 'styles/dimentionHelper';
import { ParentObject } from 'store/sales/types/common';
import useNavigate from 'hooks/useNavigate';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { LOG } from 'config/logger';
import { handleLangSlectorModal } from 'store/sales/actions/ui/ui.action';
import { HOME_ICON, HOME_ROUTE, QUERY, ROLES_DEFAULT_ROUTES } from 'const/strings';
import { safePath } from 'utils/navigationHelper';
import { callAction } from 'utils/formBuilderHelper';
import styles from './HomePage.styles';
import { Content } from 'components/sales/LiveNewsCardContainer/LiveNewsCardContainer';

/**
 * Represents a HomePage component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns HomePage
 */
const HomePage = () => {
  const { dashboard } = useSelector((state: RootState) => state.user.navigation);
  const { info } = useSelector((state: RootState) => state.user);
  const { bannerImages, railData, isHomeRailVisible, railFilterLanguages } = useSelector((state: RootState) => state.homePage);
  const [banners, setBanners] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { isDrawerOpen } = useSelector((state: RootState) => state.ui);
  const { navigate } = useNavigate();
  const { inflection } = useInflection();

  const handleToggleDrawer = () => {
    dispatch(actions.toggleDrawer(!isDrawerOpen));
  };

  const safeRole = info?.internalRole?.trim() || 'default';

  const redirectPath = safePath(ROLES_DEFAULT_ROUTES[safeRole]);
  useEffect(() => {
    dispatch(callAction({}, QUERY.GetBannerImages));
    if (redirectPath !== '/') {
      navigate(redirectPath);
    }
    dispatch(actions.hideBottomModal());
  }, []);

  useEffect(() => {
    dispatch(callAction({}, QUERY.GetRailsData))
  }, [])

  useEffect(() => {
    const webImages = bannerImages?.getBanner ?? [];

    const newArray = webImages.map((item: ParentObject, index: number) => {
      let deepLink: string | null = null;

      if (item?.deeplink) {
        deepLink = item.deeplink.startsWith('https') ? item.deeplink : `tpsales://${item.deeplink}`;
      }

      return {
        id: index + 1,
        image: item?.image_url,
        deepLink,
      };
    });

    setBanners(newArray);
  }, [bannerImages]);

  LOG.info('=> inflection ', inflection, getFullScreenHeight());

  const carouselDimension = useMemo(() => {
    switch (inflection) {
      case BreakPoints.XS:
        return { height: 200, width: getFullScreenWidth() * 0.9 };
      case BreakPoints.SM:
        return { height: 230, width: getFullScreenWidth() };
      case BreakPoints.MD:
      case BreakPoints.LG:
      case BreakPoints.XL:
        return { height: 250, width: getFullScreenWidth() * 0.6 };
      default:
        return { height: 290, width: getFullScreenWidth() * 0.6 };
    }
  }, [inflection]);

  const requiredPaths = new Set(HOME_ROUTE);
  const pathToIcon = HOME_ICON;
  const menuCards = dashboard
    .filter((item: ParentObject) => requiredPaths.has(item.path))
    .map((item: ParentObject) => ({
      menuTitle: item.menuTitle.trim(),
      path: item.path,
      menuIcon: pathToIcon[item.path] || item.menuIcon, // fallback
      isModel: item.isModel,
    }));
  const orderedMenuCards = [...menuCards].sort((a, b) => HOME_ROUTE.indexOf(a.path) - HOME_ROUTE.indexOf(b.path));

  const navigateTo = (routeName: string) => {
    navigate(routeName);
  };

  return (
    <>
      {isDrawerOpen ? (
        <View style={styles.overlay}>
          <AppDrawer onDrawerStateChange={handleToggleDrawer} />
        </View>
      ) : null}
      <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]} testID="home-scroll-view">
        <Gradient colors={Colors.gradient.mobileHomeGradient} style={styles.gradientContainerWeb} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={[styles.carouselContainerWeb, styles[gcs('carouselContainerWeb', inflection, true, ['md', 'lg', 'xl'])]]} testID="carouselContainerWeb">
            <View style={styles.carousel}>
              <Carousel data={banners} resizeMode="stretch" height={carouselDimension.height} width={carouselDimension.width} />
            </View>
          </View>
        </Gradient>
        {/* Live TV */}
        {(isHomeRailVisible) ?
          <View style={styles.liveNewsCardContainer}>
            <LiveNewsCardContainer
              data={railData[0]?.contents as Content[]}
              languages={railFilterLanguages}
            />
          </View> : null}
        <Gradient colors={Colors.gradient.mobileHomeGradient} style={styles.gradientContainerWeb} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={[styles.carouselContainerWeb, styles[gcs('carouselContainerWeb', inflection, true, ['md', 'lg', 'xl'])]]} testID="carouselContainerWeb">
            <View style={[styles.iconContainer, styles.subContainer, styles[gcs('subContainer', inflection, true, ['md', 'lg', 'xl'])]]} testID="iconContainer">
              {orderedMenuCards.map((route: Route) => (
                <View key={route.menuId} style={[styles.iconItemWeb, styles[gcs('iconItemWeb', inflection, true, ['md', 'lg', 'xl'])]]}>
                  <DashboardIcon label={route.menuTitle} value={route.path || ''} isModal={route.isModel} iconName={route.menuIcon} />
                </View>
              ))}
              <View style={styles.actionTileCardContainerStyleWeb}>
                <ActionTileCard label={t('homeScreen.CustomerActions')} onPress={() => navigateTo(ROUTE.WEB.OTHER_CUSTOMER_ACTIONS)} />
              </View>
            </View>
          </View>
        </Gradient>

        <View style={[styles.buttonContainerWeb, styles.buttonSubContainer, styles[gcs('buttonSubContainer', inflection, true, ['md', 'lg', 'xl'])]]} testID="buttonContainerWeb">
          <View style={styles.actionTileCardContainerStyleWeb}>
            <ActionTileCard label={t('homeScreen.RegisterNewCustomer')} iconName={ICONS.REGISTER_NEW_CUSTOMER} onPress={() => navigateTo(ROUTE.WEB.REGISTER_NEW_CUSTOMER)} />
          </View>
          <View style={styles.actionTileCardContainerStyleWeb}>
            <ActionTileCard label={t('homeScreen.ViewPackageInformation')} iconName={ICONS.VIEW_PACKAGE_INFORMATION} onPress={() => navigateTo(ROUTE.WEB.PACKAGE_INFORMATION)} />
          </View>
        </View>

      </View>
      <HeaderFilters closeModal={() => dispatch(handleLangSlectorModal(false))} />
    </>
  );
};

export default memo(HomePage);
