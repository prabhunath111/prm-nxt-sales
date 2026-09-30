import React, { useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderEvent, PanResponder, PanResponderGestureState, TouchableOpacity, View, ScrollView } from 'react-native';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { animateMove, getNextState, DrawerState } from 'utils/animationsHelper';
import ReactMoE from 'react-native-moengage';
import { Button, Image, Text } from 'components/sales';
import { Colors, Sizing } from 'styles';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import userActions from 'store/sales/actions/user';
import homePageActions from 'store/sales/actions/homePage';
import uiAction from 'store/sales/actions/ui';
import invoiceActions from 'store/sales/actions/invoice';
import { useTranslation } from 'react-i18next';
import { CHILD_TYPE, HEADER_TITLE, ICONS, MODAL, PROPERTIES, QUERY, ROUTE, STYLES } from 'const';
import { handleLangSlectorModal } from 'store/sales/actions/ui/ui.action';
import { getDeviceInformation, isWeb } from 'utils/platformHelper';
import copyToClipboard from 'utils/copyToClipboard';
import useNavigate from 'hooks/useNavigate';
import styles from './AppDrawer.styles';
import packageJson from '../../../../package.json';

export type AppDrawerProps = {
  onDrawerStateChange?: () => void;
};

const AppDrawer = ({ onDrawerStateChange }: AppDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useRef(true);
  const { name, userId, mdn, internalRole } = useSelector((state: RootState) => state.user.info);
  const { evdBalance } = useSelector((state: RootState) => state.homePage);
  const { t } = useTranslation();
  const { navigate } = useNavigate();

  const { gstData, comingFromInvoice } = useSelector((state: RootState) => state.invoice);

  const y = useRef(new Animated.Value(DrawerState.Peek)).current;
  const state: any = React.useRef(new Animated.Value(DrawerState.Peek)).current;

  const getModalHeight = () => {
    if (gstData?.gstNumber) {
      return getFullScreenHeight() + Sizing.layout.x120;
    }
    return getFullScreenHeight() + Sizing.layout.x70;
  };
  const getGSTDetails = () => {
    dispatch(invoiceActions.getGstDetailsByUserId());
  };
  const margin = 0.05 * getFullScreenHeight();
  const movementValue = (moveY: number) => getFullScreenHeight() - moveY;

  useEffect(() => {
    animateMove(y, DrawerState.Peek);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      if (!gstData?.gstNumber) {
        getGSTDetails();
      }
      isFirstRender.current = false;
    } else {
      getGSTDetails();
    }
  }, [comingFromInvoice]);

  const onPanResponderMove = (_: GestureResponderEvent, { moveY }: PanResponderGestureState) => {
    const val = movementValue(moveY);
    animateMove(y, val);
  };

  const onPanResponderRelease = (_: GestureResponderEvent, { moveY }: PanResponderGestureState) => {
    const valueToMove = movementValue(moveY);
    // eslint-disable-next-line no-underscore-dangle
    const nextState = getNextState(state._value, valueToMove, margin);
    state.setValue(nextState);
    animateMove(y, nextState);
    if (!nextState && onDrawerStateChange) {
      onDrawerStateChange();
    }
  };

  const onMoveShouldSetPanResponder = (_: GestureResponderEvent, { dy }: PanResponderGestureState) => Math.abs(dy) >= Sizing.layout.x10;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
      onPanResponderMove,
      onPanResponderRelease,
    }),
  ).current;

  const openLanguageModal = () => {
    dispatch(uiAction.toggleDrawer(false));
    dispatch(handleLangSlectorModal(true));
  };

  const handleLogout = () => {
    dispatch(uiAction.toggleDrawer(false));
    dispatch(userActions.doLogout());
    ReactMoE.logout();
  };

  const closeModal = () => {
    dispatch(uiAction.toggleDrawer(false));
  };

  const [deviceName, setDeviceName] = useState<string>('');
  const [copyUserId, setCopyUserId] = useState('Copy');
  const [copyMobile, setCopyMobile] = useState('Copy');
  const timeoutRef: any = useRef(null);
  const handleCopy = (value: string, type: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // copy logic
    copyToClipboard(value);

    switch (type) {
      case 'userId':
        setCopyUserId('Copied');
        break;
      case 'mobile':
        setCopyMobile('Copied');
        break;
      default:
        break;
    }

    // reset after 500ms
    timeoutRef.current = setTimeout(() => {
      if (type === 'userId') {
        setCopyUserId('Copy');
      } else if (type === 'mobile') {
        setCopyMobile('Copy');
      }
      timeoutRef.current = null; // clear ref after use
    }, 500);
  };
  const getEvdBalance = () => {
    dispatch(homePageActions.getEvdBalance(QUERY.GetBalanceFos));
  };

  useEffect(() => {
    getEvdBalance();
    (async () => {
      const info = await getDeviceInformation();
      setDeviceName(info.deviceName || 'Unknown Device');
    })();
  }, []);

  const navigateTo = (routeName: string, isDisable: boolean) => {
    if (isDisable) {
      dispatch(
        uiAction.showBottomModal({
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
      return;
    }

    navigate(routeName);
  };

  return (
    <Animated.View style={[styles.drawerContainer, !isWeb && { height: getModalHeight() }, { transform: [{ translateY: y }] }]} {...panResponder.panHandlers}>
      <View style={styles.userContainer}>
        <View style={styles.headerRow}>
          {/* Column 1: Profile picture */}
          <View style={styles.profilePicContainer}>
            <View style={styles.profilePicture} />
          </View>

          {/* Column 2: User details */}
          <View style={styles.userDetailsContainer}>
            <Text label={name} color={Colors.neutral.white} />
          </View>

          {/* Column 3: Close button */}
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={closeModal}>
              <Image iconName={ICONS.CLOSE} height={Sizing.layout.x16} width={Sizing.layout.x16} isDimension={false} style={{ tintColor: Colors.neutral.white }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('strings.evdBalance')}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.amountRow}>
              <Text style={styles.amount}>₹{evdBalance}</Text>
              <TouchableOpacity onPress={() => getEvdBalance()}>
                <Image iconName={ICONS.REFRESH_PINK} height={Sizing.layout.x22} width={Sizing.layout.x22} style={styles.marginLeft} isDimension={false} />
              </TouchableOpacity>
            </View>
            {evdBalance <= 200 && (
              <View style={styles.badge}>
                <Image iconName={ICONS.BLACK_EXCLAMATION} height={Sizing.layout.x22} width={Sizing.layout.x22} style={styles.marginLeft} isDimension={false} />
                <Text style={styles.badgeText}>{t('strings.lowBalance')}</Text>
              </View>
            )}
          </View>
          <Button
            onPress={() => {}}
            size="sm"
            style={styles.buttonStyle}
            isDimension={false}
            label={t('strings.addMoney')}
            outline
            fontColor={Colors.primary.brand}
            fontSize={Sizing.layout.x16}
          />
        </View>

        {/* Settings */}
        <TouchableOpacity style={styles.listRow} onPress={() => openLanguageModal()}>
          <View style={styles.rowLeft}>
            <Image iconName={ICONS.LANGUAGE_BLACK} height={Sizing.layout.x22} width={Sizing.layout.x22} isDimension={false} />
            <Text style={styles.listText}>{t('strings.languageSettings')}</Text>
          </View>
        </TouchableOpacity>

        {/* Dealer Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoRow} testID="infoRowUserId">
              <Text style={styles.infoText}>
                {t('strings.userID')} <Text style={styles.normalText}>{userId}</Text>
              </Text>
              <TouchableOpacity style={styles.copyBtnContainer} onPress={() => handleCopy(userId, 'userId')}>
                <Image style={styles.copyIcon} iconName={ICONS.COPY} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
                <Text style={styles.copyBtn}>{copyUserId}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow} testID="infoRowMobile">
              <Text style={[styles.infoText, styles.marginTop4]}>
                {t('strings.mobileNo')} <Text style={styles.normalText}>{mdn}</Text>
              </Text>
              {[PROPERTIES.ROLES.dealer, PROPERTIES.ROLES.fos, PROPERTIES.ROLES.ad].includes(internalRole) && (
                <TouchableOpacity
                  style={styles.copyBtnContainer}
                  onPress={() => {
                    navigateTo(ROUTE.WEB.EVD_MDN_CHANGE, true);
                  }}
                >
                  <Text style={[styles.MdnText, styles.marginTop4]}>{t('strings.mdnChange')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.copyBtnContainer} onPress={() => handleCopy(mdn, 'mobile')}>
                <Image style={styles.copyIcon} iconName={ICONS.COPY} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
                <Text style={styles.copyBtn}>{copyMobile}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gstEditContainer}>
              <View style={styles.infoRow}>
                <View style={styles.infoRowContainer}>
                  <Text style={[styles.infoText]}>{t('strings.gstDetails')}</Text>
                  {!gstData?.gstNumber && (
                    <View style={styles.yellowBox}>
                      <Image style={styles.infoIcon} iconName={ICONS.INFO_PINK_SOLID} height={Sizing.layout.x15} width={Sizing.layout.x15} isDimension={false} />
                      <Text style={[styles.smallMedium]}>{t('strings.detailsRequired')}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity style={[styles.copyBtnContainer, styles.borderPink]} onPress={() => dispatch(invoiceActions.gstConfirmationProfile())}>
                  <Image style={styles.copyIcon} iconName={ICONS.EDIT_PENCIL} height={Sizing.layout.x16} width={Sizing.layout.x16} isDimension={false} />
                </TouchableOpacity>
              </View>
              {gstData?.gstNumber && (
                <>
                  <View style={[styles.infoRow]}>
                    <Text style={[styles.regularText]}>{t('strings.dealerType')}</Text>
                    <Text style={styles.mediumText}>{gstData?.dealerType}</Text>
                  </View>
                  <View style={[styles.infoRow]}>
                    <Text style={[styles.regularText]}>{t('strings.GSTNo')}</Text>
                    <Text style={styles.mediumText}>{gstData?.gstNumber}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <Text style={styles.subText}>
            {t('strings.version')} {packageJson.version}
          </Text>
          <Text style={styles.subText}>{deviceName ?? 'Loading...'}</Text>

          {/* <TouchableOpacity>
            <Text style={styles.updateText}>Update App</Text>
          </TouchableOpacity> */}
        </View>

        {/* Again addint the logout button in mobile */}
        <Button
          onPress={() => handleLogout()}
          style={styles.logoutButtonStyle}
          isDimension={false}
          label={t('strings.logout')}
          outline
          fontColor={Colors.primary.brand}
          fontSize={Sizing.layout.x16}
          {...{
            iconName: ICONS.LOGOUT,
            iconPosition: STYLES.POSITION.LEFT,
            iconHeight: Sizing.layout.x1Dot5,
            iconWidth: Sizing.layout.x1Dot5,
            iconStyle: styles.primaryIconStyle,
          }}
        />
      </ScrollView>
    </Animated.View>
  );
};

export default AppDrawer;
