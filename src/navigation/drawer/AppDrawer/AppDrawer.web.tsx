import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View, ScrollView } from 'react-native';
import { animateMove, DrawerState } from 'utils/animationsHelper';
import { Button, Image, Text } from 'components/sales';
import { Colors, Sizing } from 'styles';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import logoutAction from 'store/sales/actions/user';
import uiAction from 'store/sales/actions/ui';
import { useTranslation } from 'react-i18next';
import { DRAWER_ITEMS, DRAWER_OPTIONS, ICONS, STYLES } from 'const';
import { handleLangSlectorModal } from 'store/sales/actions/ui/ui.action';
import { getDeviceInformation } from 'utils/platformHelper';
import styles from './AppDrawer.styles';
import packageJson from '../../../../package.json';

export type AppDrawerProps = {
  onDrawerStateChange?: () => void;
};

const AppDrawer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, userId, mdn } = useSelector((state: RootState) => state.user.info);
  const { t } = useTranslation();

  const y = useRef(new Animated.Value(DrawerState.Peek)).current;

  useEffect(() => {
    animateMove(y, DrawerState.Peek);
  }, []);

  const handleSelection = ({ item }: any) => {
    switch (item?.id) {
      case DRAWER_OPTIONS.LANGUAGE:
        dispatch(handleLangSlectorModal(true));
        break;
      case DRAWER_OPTIONS.PASSWORD:
        break;
      case DRAWER_OPTIONS.LOGOUT:
        dispatch(logoutAction.doLogout());
        break;
      default:
    }
    dispatch(uiAction.toggleDrawer(false));
  };

  const closeModal = () => {
    dispatch(uiAction.toggleDrawer(false));
  };

  const [deviceName, setDeviceName] = useState<string>('');

  useEffect(() => {
    (async () => {
      const info = await getDeviceInformation();
      setDeviceName(info.deviceName || 'Unknown Device');
    })();
  }, []);

  return (
    <View style={styles.drawerContainer}>
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
              <Text style={styles.amount}>₹140.00</Text>
              <Image iconName={ICONS.REFRESH_PINK} height={Sizing.layout.x22} width={Sizing.layout.x22} style={styles.marginLeft} isDimension={false} />
            </View>
            <View style={styles.badge}>
              <Image iconName={ICONS.LOW_BALANCE} height={Sizing.layout.x22} width={Sizing.layout.x22} style={styles.marginLeft} isDimension={false} />
              <Text style={styles.badgeText}>{t('strings.lowBalance')}</Text>
            </View>
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
        <TouchableOpacity style={styles.listRow} onPress={() => handleSelection(DRAWER_ITEMS[0])}>
          <View style={styles.rowLeft}>
            <Image iconName={ICONS.LANGUAGE} height={Sizing.layout.x22} width={Sizing.layout.x22} isDimension={false} />
            <Text style={styles.listText}>{t('strings.languageSettings')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listRow} onPress={() => handleSelection(DRAWER_ITEMS[1])}>
          <View style={styles.rowLeft}>
            <Image iconName={ICONS.RESET_EVD_PIN} height={Sizing.layout.x22} width={Sizing.layout.x22} isDimension={false} />
            <Text style={styles.listText}>{t('strings.changePassword')}</Text>
          </View>
        </TouchableOpacity>

        {/* Dealer Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View>
              <Text style={styles.infoText}>
                {t('strings.userID')} <Text style={styles.normalText}>{userId}</Text>
              </Text>
              <Text style={[styles.infoText, styles.marginTop4]}>
                {t('strings.mobileNo')} <Text style={styles.normalText}>{mdn}</Text>
              </Text>
            </View>
            <Text style={styles.copyBtn}>Copy</Text>
          </View>

          <Text style={styles.subText}>
            {t('strings.version')} {packageJson.version}
          </Text>
          <Text style={styles.subText}>{deviceName ?? 'Loading...'}</Text>

          <TouchableOpacity>
            <Text style={styles.updateText}>Update App</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <Button
          onPress={() => handleSelection(DRAWER_ITEMS[2])}
          style={styles.logoutButtonStyle}
          isDimension={false}
          label={t('strings.logout')}
          outline
          fontColor={Colors.primary.brand}
          fontSize={Sizing.layout.x16}
          {...{
            iconName: ICONS.SETTINGS,
            iconPosition: STYLES.POSITION.LEFT,
            iconHeight: Sizing.layout.x1Dot5,
            iconWidth: Sizing.layout.x1Dot5,
            iconStyle: styles.primaryIconStyle,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default AppDrawer;
