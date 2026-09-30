/**
 * Common header for the app
 *
 * @module components/Header
 * @memberof - Common Component
 */
import React from 'react';
import { View, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { Colors, Sizing } from 'styles';
import Image from 'components/sales/Image';
import Text from 'components/sales/Text';
import { ICONS, ROUTE } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/ui';
import DetailsHeader from 'components/sales/DetailsHeader';
import useNavigate from 'hooks/useNavigate';
import { handleLangSlectorModal } from 'store/sales/actions/ui/ui.action';
import styles from './Header.styles';

/**
 * Represents a Header component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Header
 */

type HeaderProps = {
  currentRoute?: string;
};

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isDrawerOpen } = useSelector((state: RootState) => state.ui);
  const { navigate } = useNavigate();

  const navigateTo = (routeName: string) => {
    navigate(routeName);
  };

  const toggleBottomDrawer = () => {
    dispatch(actions.toggleDrawer(!isDrawerOpen));
  };
  return (
    <SafeAreaView testID="header-test-container">
      <StatusBar translucent backgroundColor={Colors.violet.darkViolet} barStyle="light-content" />
      <View style={styles.gradientContainer}>
        <View style={[styles.container]}>
          {/* Left: Profile */}
          <Pressable onPress={toggleBottomDrawer} style={styles.leftContainer}>
            <View style={styles.profilePicture} />
          </Pressable>

          {/* Center: Logo + Text */}
          <View style={styles.centerContainer}>
            <Image iconName={ICONS.TATA_PLAY_HOME} height={Sizing.layout.x25} width={Sizing.layout.x100} isDimension={false} />
            <Text style={styles.headerText}>mSales</Text>
          </View>

          {/* Right: Icons */}
          <View style={styles.rightContainer}>
            <Pressable onPress={() => dispatch(handleLangSlectorModal(true))}>
              <Image iconName={ICONS.LANGUAGE_BLACK} height={Sizing.layout.x30} width={Sizing.layout.x30} style={styles.icon} isDimension={false} />
            </Pressable>
            <Pressable onPress={() => navigateTo(ROUTE.WEB.NOTIFICATIONS)}>
              <Image iconName={ICONS.BELL} height={Sizing.layout.x30} width={Sizing.layout.x30} style={styles.icon} isDimension={false} />
              {/* Badge dot */}
              <View style={styles.badgeDot} />
            </Pressable>
          </View>
        </View>
      </View>
      <DetailsHeader />
    </SafeAreaView>
  );
};

export default Header;
