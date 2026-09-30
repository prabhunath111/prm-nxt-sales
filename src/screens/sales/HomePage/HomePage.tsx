/**
 * Home page for the PRM Sales application
 *
 * @module components/HomePage
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { View, Platform, Linking } from 'react-native';
import AppDrawer from 'navigation/drawer/AppDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/ui';
import notificationActions from 'store/sales/actions/notifications';
import { Route } from 'navigation/routes/RouteTypes';
import DashboardIcon from 'components/sales/DashboardIcon';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import ReactMoE from 'react-native-moengage';
import { CHILD_TYPE, ICONS, STRINGS } from 'const';
import { FORMS, HOME_ICON, HOME_ROUTE, MOENGAGE, QUERY, ROUTE } from 'const/strings';
import PushNotification from 'react-native-push-notification';
import { isAndroid } from 'utils/platformHelper';
import { ActionTileCard, Gradient, HeaderFilters,LiveNewsCardContainer } from 'components/sales';
import useNavigate from 'hooks/useNavigate';
import { handleLangSlectorModal } from 'store/sales/actions/ui/ui.action';
import { Colors, Sizing } from 'styles';
import Carousel from 'components/sales/Carousel';
import { ParentObject } from 'store/sales/types/common';
import { usePlatformFocusEffect } from 'hooks/usePlatformFocusEffect';
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
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { isDrawerOpen } = useSelector((state: RootState) => state.ui);
  const { bannerImages,railData,isHomeRailVisible,railFilterLanguages } = useSelector((state: RootState) => state.homePage);
  const [banners, setBanners] = useState([]);
  const { info } = useSelector((state: RootState) => state.user);
  const { navigate } = useNavigate();

  // Get the app version
  const deviceDetails = {
    deviceModel: DeviceInfo.getModel(), // Get device model
    deviceOS: Platform.OS, // iOS or Android
    deviceOSVersion: DeviceInfo.getSystemVersion(), // Get OS version
    appVersion: DeviceInfo.getVersion(), // app version
    moEngageSDKVersion: MOENGAGE.SDK_VERSION,
  };

  const createNotificationChannel = () => {
    if (isAndroid()) {
      PushNotification.createChannel(
        {
          channelId: MOENGAGE.CHANNEL_ID,
          channelName: MOENGAGE.CHANNEL_NAME,
          channelDescription: MOENGAGE.CHANNEL_DESCRIPTION,
          soundName: MOENGAGE.SOUND_NAME,
          vibrate: true,
        },
        (created: boolean) => created, // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }
  };

  const setAllUserAttributes = () => {
    ReactMoE.setUserUniqueID(info?.userId);
    ReactMoE.setUserAttribute(STRINGS.DEVICE_DETAILS, deviceDetails);
    ReactMoE.setUserAttribute(STRINGS.PARTNER_ROLE, info?.internalRole);
  };

  useEffect(() => {
    dispatch(callAction({}, QUERY.GetBannerImages));
    setAllUserAttributes();
    createNotificationChannel();
  }, []);

   useEffect(()=>{
    dispatch(callAction({},QUERY.GetRailsData))
  },[])

  useEffect(() => {
    const mobileImages = bannerImages?.getBanner ?? [];

    const newArray = mobileImages.map((item: ParentObject, index: number) => {
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

  useEffect(() => {
    const handleRouteAction = (route: string) => {
      switch (route) {
        case FORMS.demoBoxDetail:
          dispatch(
            actions.showBottomModal({
              isModalVisible: true,
              isCenterModal: true,
              type: CHILD_TYPE.DYNAMIC_FORM,
              headerTitle: t('forms.demoBoxDetails'),
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.demoBoxDetail,
            }),
          );
          break;

        default:
          navigate(route);
          break;
      }
    };
    const handleDeepLink = (event: any) => {
      const { url } = event;
      const route = url.replace(MOENGAGE.DEEPLINK_URL, '').split('?')[0];
      handleRouteAction(route);
    };
    // Subscribe to deep links while the app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);
    // Check if the app is opened from a deep link when it is launched (from background or closed state)
    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    };
    checkInitialUrl(); // Call to check for initial URL
    return () => {
      subscription?.remove(); // Way to remove listener
    };
  }, [navigate]);

  const handleToggleDrawer = () => {
    dispatch(actions.toggleDrawer(!isDrawerOpen));
  };

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

  const handleAllNotification = async () => {
    dispatch(notificationActions.getCarouselImage());
  };

  usePlatformFocusEffect(() => {
    handleAllNotification();
  }, []);

  return (
    <>
      {isDrawerOpen ? (
        <View style={styles.overlay}>
          <AppDrawer onDrawerStateChange={handleToggleDrawer} />
        </View>
      ) : null}
      {!isDrawerOpen && (
        <View style={styles.container} testID="home-scroll-view">
          <Gradient colors={Colors.gradient.mobileHomeGradient} style={styles.gradientContainer} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.carouselContainer}>
              <Carousel data={banners} resizeMode="stretch" height={Sizing.x210} />
            </View>
            <View style={styles.iconContainer}>
              {orderedMenuCards.map((route: Route) => (
                <View key={route.menuId} style={styles.iconItem}>
                  <DashboardIcon label={route.menuTitle} value={route.path || ''} isModal={route.isModel} iconName={route.menuIcon} />
                </View>
              ))}
              <View style={styles.actionTileCardContainerStyle}>
                <ActionTileCard label={t('homeScreen.CustomerActions')} onPress={() => navigateTo(ROUTE.WEB.OTHER_CUSTOMER_ACTIONS)} />
              </View>
            </View>
          </Gradient>
          {/* Live TV */}
                  {(isHomeRailVisible) ?
                    <View>
                      <LiveNewsCardContainer
                        data={railData[0]?.contents as Content[]}
                        languages={railFilterLanguages}
                      />
                    </View> : null}
          <View style={styles.buttonContainer}>
            <View style={styles.actionTileCardContainerStyle}>
              <ActionTileCard label={t('homeScreen.RegisterNewCustomer')} iconName={ICONS.REGISTER_NEW_CUSTOMER} onPress={() => navigateTo(ROUTE.WEB.REGISTER_NEW_CUSTOMER)} />
            </View>
            <View style={styles.actionTileCardContainerStyle}>
              <ActionTileCard label={t('homeScreen.ViewPackageInformation')} iconName={ICONS.VIEW_PACKAGE_INFORMATION} onPress={() => navigateTo(ROUTE.WEB.PACKAGE_INFORMATION)} />
            </View>
          </View>
        </View>
      )}
      <HeaderFilters closeModal={() => dispatch(handleLangSlectorModal(false))} />
    </>
  );
};

export default memo(HomePage);
