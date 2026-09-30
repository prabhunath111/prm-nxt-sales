/**
 * This is common secondary header for the back functionality handeling
 *
 * @module components/SecondaryHeader
 * @memberof CommonComponent
 */
import React, { useEffect } from 'react';
import { View, SafeAreaView, Pressable } from 'react-native';
import { ALERT, ICONS, MODAL, PROPERTIES, ROUTE, STYLES } from 'const';
import { Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import actions from 'store/sales/actions';
import Image from 'components/sales/Image';
import Text from 'components/sales/Text';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import formAction from 'store/sales/actions/form';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import DetailsHeader from 'components/sales/DetailsHeader';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { useTranslation } from 'react-i18next';
import { loadLanguage } from 'utils/languageHelper';
import uiActions from 'store/sales/actions/ui';
import { isAndroid, isiOS } from 'utils/platformHelper';
import styles from './SecondaryHeader.styles';
/**
 * Component type definitions
 *
 * @typedef {object} SecondaryHeaderProps
 * @property {string} [text] - The content for the component
 */
export type SecondaryHeaderProps = {
  screenName?: string;
  prevPath?: string;
};
/**
 * Represents a SecondaryHeader component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered SecondaryHeader component
 *
 * @example
 * <SecondaryHeader text="Hello World!" />
 */
const SecondaryHeader = ({ screenName = '', prevPath = '' }: SecondaryHeaderProps) => {
  const { replace, goBack, goHome, navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { isRedirection, navigation } = useSelector((state: RootState) => state.user);
  const { navigationId } = useSelector((state: RootState) => state.customerRecharge);
  const { accountInformation } = useSelector((state: RootState) => state.accountInformation);
  const { campaignName } = useSelector((state: RootState) => state.rechargeWinback);
  const { inflection } = useInflection();
  const type = PROPERTIES.PRIMARY_MODULES.includes(screenName) ? STYLES.TYPE.PRIMARY : STYLES.TYPE.SECONDARY;
  const { routeName } = useCurrentRoute();
  const routeDetails: any = navigation?.routes?.filter((route: any) => route.path === routeName) || [];
  const { i18n } = useTranslation();

  const backHandler = () => {
    if (routeDetails[0]?.menuName === ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS) {
      dispatch(formAction.setFormDependentDefault(navigationId));
    } else if (routeDetails[0]?.path === ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS) {
      dispatch(formAction.setFormValues({ campaignDropDown: { name: campaignName } }));
    }
    if (accountInformation) {
      dispatch(actions.resetAccountInformation());
      dispatch(formAction.resetNavigationData());
    }
    if (routeName === ROUTE.WEB.RECHARGE_TRANSACTION) {
      navigate(ROUTE.WEB.EVD_BALANCE_INFO);
    } else if (routeName === ROUTE.WEB.RECHARGE_TRANSACTION_FOS) {
      navigate(ROUTE.WEB.EVD_BALANCE_INFO);
    } else if (routeName === ROUTE.WEB.EVD_BALANCE_INFO) {
      goHome(isRedirection);
    } else if (prevPath) {
      replace(prevPath);
    } else {
      goBack(isRedirection);
    }
  };
  const handleHomeButton = () => {
    if (accountInformation) {
      dispatch(actions.resetAccountInformation());
      dispatch(formAction.resetNavigationData());
    }
    if (routeName === ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY) {
      dispatch(
        uiActions.showAlert(
          t(`strings.areYouSure`),
          ALERT.CONFIRM,
          {
            primaryText: MODAL.CONFIRM,
            secondaryText: MODAL.CANCEL,
            isSecondaryRequire: true,
            closeView: true,
          },
          {},
        ),
      );
    } else {
      goHome(isRedirection);
    }
  };

  // load and save stored language on start
  useEffect(() => {
    loadLanguage();
  }, [i18n.language]);

  const isDesktop = inflection === BreakPoints.XL || inflection === BreakPoints.LG || inflection === BreakPoints.MD;
  return (
    <SafeAreaView testID="header-test">
      {type === STYLES.TYPE.SECONDARY ? (
        <View>
          {isDesktop ? <DetailsHeader /> : <View />}
          <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
            {/* Left-aligned Back Button */}
            {!PROPERTIES.HIDE_BACK_BUTTON_FOR_ROUTE.includes(routeName) && (
              <Pressable onPress={backHandler} style={styles.leftIcon} testID="back-button">
                <View style={styles.buttonContainer}>
                  <Image iconName={ICONS.HEADER_BACK} height={Sizing.layout.x18} style={styles.imageStyle} width={Sizing.layout.x18} isDimension={false} />
                  {isDesktop && <Text label={t('strings.back')} style={[styles.titleText, styles[gcs('titleText', inflection, true, ['md', 'lg', 'xl'])]]} />}
                </View>
              </Pressable>
            )}
            {/* Center-aligned Screen Name & Image */}
            <View style={[styles.centerContainer, styles[gcs('centerContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              {routeDetails[0]?.menuIcon && (
                <Image
                   iconName={ICONS[routeDetails[0]?.menuIcon as keyof typeof ICONS]}
                   height={PROPERTIES.LARGE_ICON.includes(routeDetails[0]?.menuIcon) ? Sizing.layout.x32 : Sizing.layout.x26}
                   width={PROPERTIES.LARGE_ICON.includes(routeDetails[0]?.menuIcon) ? Sizing.layout.x32 : Sizing.layout.x26}
                  isDimension={false}
                  style={styles.imageLeftStyle}
                />
              )}
              <Text style={[styles.textRightStyle, styles[gcs('textRightStyle', inflection, true, ['md', 'lg', 'xl'])]]}>{screenName}</Text>
            </View>
            {/* Right-aligned Home Button */}
            <Pressable onPress={handleHomeButton} style={styles.rightIcon} testID="home-button">
              <Image iconName={ICONS.NAV_HOME} height={Sizing.layout.x24} style={styles.imageStyle} width={Sizing.layout.x24} isDimension={false} />
            </Pressable>
          </View>
          {inflection === BreakPoints.XS || inflection === BreakPoints.SM || isAndroid() || isiOS() ? <DetailsHeader /> : <View />}
        </View>
      ) : (
        <View style={styles.container}>
          <Pressable onPress={handleHomeButton} style={styles.leftIcon} testID="home-button-primary">
            <Image iconName={ICONS.NAV_HOME} height={Sizing.layout.x24} style={styles.imageStyle} width={Sizing.layout.x24} isDimension={false} />
          </Pressable>
          <View style={[styles.centerContainer, styles[gcs('centerContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={[styles.textStyle, styles[gcs('textStyle', inflection, true, ['md', 'lg', 'xl'])]]}>{screenName}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
export default SecondaryHeader;
