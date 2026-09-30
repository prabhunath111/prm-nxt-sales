/**
 * Common header for the app
 *
 * @module components/Header
 * @memberof - Common Component
 */
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { View, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Sizing } from 'styles';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { CHILD_TYPE, HEADER_TITLE, ICONS, MODAL, PROPERTIES, QUERY, ROUTE, STYLES } from 'const';
import { Button, DetailsHeader, Image, Text } from 'components/sales';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { handleLangSlectorModal } from 'store/sales/actions/ui/ui.action';
import userActions from 'store/sales/actions/user';
import homePageActions from 'store/sales/actions/homePage';
import invoiceActions from 'store/sales/actions/invoice';
import { ParentObject } from 'store/sales/types/common';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import AppDrawerStyles from 'navigation/drawer/AppDrawer/AppDrawer.styles';
import copyToClipboard from 'utils/copyToClipboard';
import useCurrentRoute from 'hooks/useCurrentRoute';
import uiActions from 'store/sales/actions/ui';
import packageJson from '../../../../package.json';
import List from '../List';
import Modal, { ModalPlacement } from '../Modal';
import styles from './Header.styles';

/**
 * Represents a Header component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Header
 */

type HeaderProps = {
  currentRoute: string;
};

export type LanguageSelectorProps = {
  languages: Array<{ key: string; value: string }>;
  isVisible: boolean;
  onClose: () => void;
  langRef: MutableRefObject<null>;
};

const MENU = [
  { key: 'home', routeName: '', label: 'home', iconName: ICONS.HOME },
  { key: 'actions', routeName: 'myActions', label: 'myActions', iconName: ICONS.MY_ACTIONS },
  { key: 'transactions', routeName: 'transaction', label: 'transactions', iconName: ICONS.TRANSACTION_HOME },
  { key: 'help', routeName: 'faq', label: 'help', iconName: ICONS.HELP_DESK },
];

const Header: React.FC<HeaderProps> = () => {
  const { inflection } = useInflection();
  const isFirstRender = useRef(true);
  const [showHamburger, setShowHamburger] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copyUserId, setCopyUserId] = useState('copy');
  const [copyMobile, setCopyMobile] = useState('copy');
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { name, userId, mdn, internalRole } = useSelector((state: RootState) => state.user.info);
  const { evdBalance } = useSelector((state: RootState) => state.homePage);
  const { gstData, comingFromInvoice } = useSelector((state: RootState) => state.invoice);
  const { t } = useTranslation();
  const badgeCount = 0;
  const { routeName } = useCurrentRoute();

  const handlePress = (routeName: string) => {
    navigate(routeName);
  };

  const isDesktop = inflection === BreakPoints.XL || inflection === BreakPoints.LG || inflection === BreakPoints.MD;
  const navigateTo = (routeName: string, isDisable: boolean) => {
    if (isDisable) {
      setDrawerOpen(false);
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.CONFIRMATION,
          showCloseIcon: true,
          showHeader: false,
          onClose: () => setDrawerOpen(true),
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

  const dropDownRef: MutableRefObject<null> = useRef(null);
  const timeoutRef: any = useRef(null);
  const openLanguageModal = () => {
    timeoutRef.current = setTimeout(() => {
      dispatch(handleLangSlectorModal(true));
      timeoutRef.current = null; // clear ref after use
    }, 500);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    dispatch(userActions.doLogout());
  };
  const getEvdBalance = () => {
    dispatch(homePageActions.getEvdBalance(QUERY.GetBalanceFos));
  };
  const getGSTDetails = () => {
    dispatch(invoiceActions.getGstDetailsByUserId());
  };
  const handleCopy = (value: string, type: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // copy logic
    copyToClipboard(value);

    switch (type) {
      case 'userId':
        setCopyUserId('copied');
        break;
      case 'mobile':
        setCopyMobile('copied');
        break;
      default:
        break;
    }

    // reset after 500ms
    timeoutRef.current = setTimeout(() => {
      if (type === 'userId') {
        setCopyUserId('copy');
      } else if (type === 'mobile') {
        setCopyMobile('copy');
      }
      timeoutRef.current = null; // clear ref after use
    }, 500);
  };

  useEffect(() => {
    getEvdBalance();
    return () => {
      clearTimeout(timeoutRef.current);
    };
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

  const getModalHeight = () => {
    if (gstData?.gstNumber) {
      return Sizing.layout.x520;
    }
    return Sizing.layout.x470;
  };
  return (
    <>
      {isDesktop ? (
        <>
          <DetailsHeader />
          <View style={styles.containerWeb}>
            <View style={styles.left}>
              <Image iconName={ICONS.TATA_PLAY_HOME} style={styles.logo} />
              <Text style={styles.appName}>mSales</Text>
            </View>

            <View style={styles.centerWrapper} pointerEvents="box-none">
              <View style={styles.menuRow}>
                {MENU.map((m, idx) => {
                  const isActive = m.routeName === routeName;
                  return (
                    <View key={m.key} style={[styles.menuItemWrapper, idx > 0 && styles.menuSeparator]}>
                      <Pressable onPress={() => handlePress(m.routeName)} style={styles.menuItem} android_ripple={{ color: 'rgba(255,255,255,0.04)' }}>
                        <Image
                          iconName={m.iconName}
                          height={Sizing.layout.x25}
                          width={Sizing.layout.x25}
                          isDimension={false}
                          style={{
                            color: isActive ? '#FFFFFF' : '#F2C8F7',
                            tintColor: isActive ? '#FFFFFF' : '#F2C8F7',
                          }}
                        />
                        <Text style={[styles.menuText, isActive && styles.menuTextActive]}>{t(`strings.${m.label}`)}</Text>
                      </Pressable>

                      {/* Vertical separator (line) */}
                      {idx < MENU.length - 1 && <View testID="vLine" style={styles.verticalLine} />}

                      <View style={[styles.underline, isActive && styles.underlineActive]} />
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.right}>
              <Pressable style={styles.bellWrap} onPress={() => navigateTo(ROUTE.WEB.NOTIFICATIONS, false)}>
                <Image iconName={ICONS.BELL} height={Sizing.layout.x25} width={Sizing.layout.x25} style={styles.homeIcon} isDimension={false} />
                {badgeCount > 0 && <View style={styles.badge} />}
              </Pressable>
              <Pressable onPress={() => setDrawerOpen(true)} style={styles.profilePicContainer}>
                <View style={styles.profilePicture} />
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.containerMobile}>
            <Image iconName={ICONS.TATA_PLAY_HOME} style={styles.logoMobile} />

            <View style={styles.rightMobile} ref={dropDownRef}>
              <Pressable onPress={() => navigateTo(ROUTE.WEB.NOTIFICATIONS, false)}>
                <Image iconName={ICONS.BELL} height={Sizing.layout.x25} width={Sizing.layout.x25} style={styles.homeIcon} isDimension={false} />
              </Pressable>
              <Pressable onPress={() => setDrawerOpen(true)} style={styles.profilePicContainer}>
                <View style={styles.profilePicture} />
              </Pressable>
              <Pressable onPress={() => setShowHamburger(true)} style={styles.iconBtn}>
                <Image iconName={ICONS.HAMBURGER} height={Sizing.layout.x1} width={Sizing.layout.x1} style={styles.notificationIcon} />
              </Pressable>
            </View>
          </View>
          <DetailsHeader />

          <Modal
            modalStyle={styles.zIndexStyle}
            isVisible={showHamburger}
            modalTarget={dropDownRef}
            height={Sizing.layout.x250}
            width={Sizing.layout.x130}
            placementType={[ModalPlacement.BOTTOM, ModalPlacement.AUTO]}
            isBackgroundBlurRequired
            arrowShift={0.9}
            onClose={() => setShowHamburger(false)}
          >
            <View style={styles.listContainer}>
              <List
                data={MENU}
                maxHeight={Sizing.layout.x250}
                renderItem={({ item }: ParentObject) => {
                  const selectedMenu = item.routeName === routeName;
                  return (
                    <TouchableOpacity style={[styles.listStyle, selectedMenu && styles.selectedItem]} onPress={() => handlePress(item.routeName)}>
                      <Text
                        style={[
                          styles.labelStyle,
                          {
                            color: selectedMenu ? Colors.neutral.white : Colors.neutral.black,
                          },
                        ]}
                        label={item.label}
                      />
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item: ParentObject) => item.id?.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </Modal>
        </>
      )}

      {/* profile modal  */}

      <Modal
        modalStyle={styles.zIndexStyle}
        isVisible={drawerOpen}
        // height={Sizing.layout.x435}
        height={getModalHeight()}
        width={Sizing.layout.x360}
        placementType={[ModalPlacement.CENTER]}
        onClose={() => setDrawerOpen(false)}
        isBackgroundBlurRequired
      >
        <View style={AppDrawerStyles.drawerContainer}>
          <View style={AppDrawerStyles.userContainer}>
            <View style={AppDrawerStyles.headerRow}>
              {/* Column 1: Profile picture */}
              <View style={AppDrawerStyles.profilePicContainer}>
                <View style={AppDrawerStyles.profilePicture} />
              </View>

              {/* Column 2: User details */}
              <View style={AppDrawerStyles.userDetailsContainer}>
                <Text label={t(`strings.${name}`, { defaultValue: name })} color={Colors.neutral.white} />
              </View>

              {/* Column 3: Close button */}
              <View style={AppDrawerStyles.closeButtonContainer}>
                <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                  <Image iconName={ICONS.CLOSE} height={Sizing.layout.x16} width={Sizing.layout.x16} isDimension={false} style={{ tintColor: Colors.neutral.white }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView style={AppDrawerStyles.container} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={AppDrawerStyles.balanceCard}>
              <Text style={AppDrawerStyles.balanceLabel}>{t('strings.evdBalance')}</Text>
              <View style={AppDrawerStyles.balanceRow}>
                <View style={AppDrawerStyles.amountRow}>
                  <Text style={AppDrawerStyles.amount}>₹{evdBalance}</Text>
                  <TouchableOpacity onPress={() => getEvdBalance()}>
                    <Image iconName={ICONS.REFRESH_PINK} height={Sizing.layout.x22} width={Sizing.layout.x22} style={AppDrawerStyles.marginLeft} isDimension={false} />
                  </TouchableOpacity>
                </View>
                {evdBalance <= 200 && (
                  <View style={AppDrawerStyles.badge}>
                    <Image iconName={ICONS.BLACK_EXCLAMATION} height={Sizing.layout.x22} width={Sizing.layout.x22} style={AppDrawerStyles.marginLeft} isDimension={false} />
                    <Text style={AppDrawerStyles.badgeText}>{t('strings.lowBalance')}</Text>
                  </View>
                )}
              </View>
              <Button
                onPress={() => {}}
                size="sm"
                style={AppDrawerStyles.buttonStyle}
                isDimension={false}
                label={t('strings.addMoney')}
                outline
                fontColor={Colors.primary.brand}
                fontSize={Sizing.layout.x16}
              />
            </View>

            {/* Settings */}
            <TouchableOpacity style={AppDrawerStyles.listRow} onPress={() => openLanguageModal()}>
              <View style={AppDrawerStyles.rowLeft}>
                <Image iconName={ICONS.LANGUAGE} height={Sizing.layout.x22} width={Sizing.layout.x22} isDimension={false} />
                <Text style={AppDrawerStyles.listText}>{t('strings.languageSettings')}</Text>
              </View>
            </TouchableOpacity>

            {/* Dealer Info */}
            <View style={AppDrawerStyles.infoCard}>
              <View style={AppDrawerStyles.infoHeader}>
                <View style={AppDrawerStyles.infoRow} testID="infoRowUserId">
                  <Text style={AppDrawerStyles.infoText}>
                    {t('strings.userID')} <Text style={AppDrawerStyles.normalText}>{userId}</Text>
                  </Text>
                  <TouchableOpacity style={AppDrawerStyles.copyBtnContainer} onPress={() => handleCopy(userId, 'userId')}>
                    <Image style={styles.copyIcon} iconName={ICONS.COPY} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
                    <Text style={styles.copyBtn}>{t(`strings.${copyUserId}`)}</Text>
                  </TouchableOpacity>
                </View>
                <View style={AppDrawerStyles.infoRow} testID="infoRowMobile">
                  <Text style={[AppDrawerStyles.infoText, AppDrawerStyles.marginTop4]}>
                    {t('strings.mobileNo')} <Text style={styles.normalText}>{mdn}</Text>
                  </Text>
                  {[PROPERTIES.ROLES.dealer, PROPERTIES.ROLES.fos, PROPERTIES.ROLES.ad].includes(internalRole) && (
                    <TouchableOpacity
                      style={AppDrawerStyles.copyBtnContainer}
                      onPress={() => {
                        navigateTo(ROUTE.WEB.EVD_MDN_CHANGE, true);
                      }}
                    >
                      <Text style={[AppDrawerStyles.MdnText, AppDrawerStyles.marginTop4]}>{t('strings.mdnChange')}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={AppDrawerStyles.copyBtnContainer} onPress={() => handleCopy(mdn, 'mobile')}>
                    <Image style={styles.copyIcon} iconName={ICONS.COPY} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
                    <Text style={styles.copyBtn}>{t(`strings.${copyMobile}`)}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.gstEditContainer}>
                  <View style={AppDrawerStyles.infoRow}>
                    <View style={AppDrawerStyles.infoRowContainer}>
                      <Text style={[AppDrawerStyles.infoText]}>{t('strings.gstDetails')}</Text>
                      {!gstData?.gstNumber && (
                        <View style={AppDrawerStyles.yellowBox}>
                          <Image style={styles.infoIcon} iconName={ICONS.INFO_PINK_SOLID} height={Sizing.layout.x15} width={Sizing.layout.x15} isDimension={false} />
                          <Text style={[AppDrawerStyles.smallMedium]}>{t('strings.detailsRequired')}</Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity style={[AppDrawerStyles.copyBtnContainer, AppDrawerStyles.borderPink]} onPress={() => dispatch(invoiceActions.gstConfirmationProfile())}>
                      <Image style={styles.copyIcon} iconName={ICONS.EDIT_PENCIL} height={Sizing.layout.x16} width={Sizing.layout.x16} isDimension={false} />
                    </TouchableOpacity>
                  </View>
                  {gstData?.gstNumber && (
                    <>
                      <View style={[AppDrawerStyles.infoRow]}>
                        <Text style={[AppDrawerStyles.regularText]}>{t('strings.dealerType')}</Text>
                        <Text style={AppDrawerStyles.mediumText}>{gstData?.dealerType}</Text>
                      </View>
                      <View style={[AppDrawerStyles.infoRow]}>
                        <Text style={[AppDrawerStyles.regularText]}>{t('strings.GSTNo')}</Text>
                        <Text style={AppDrawerStyles.mediumText}>{gstData?.gstNumber}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              <Text style={AppDrawerStyles.subText}>
                {t('strings.version')} {packageJson.version}
              </Text>
            </View>

            {/* Logout */}
            <Button
              onPress={() => handleLogout()}
              style={AppDrawerStyles.logoutButtonStyle}
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
                iconStyle: AppDrawerStyles.primaryIconStyle,
              }}
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default Header;
