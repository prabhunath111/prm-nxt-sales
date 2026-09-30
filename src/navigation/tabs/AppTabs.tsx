import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from 'screens/sales/HomePage';
import { Image } from 'components/sales';
import { Colors, Sizing } from 'styles';
import { ICONS } from 'const';
import MyActions from 'screens/sales/MyActions';
import Faq from 'screens/sales/Faq';
import Transaction from 'screens/sales/Transaction';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.violet.violetPink,
        tabBarInactiveTintColor: Colors.violet.darkViolet,
        tabBarStyle: {
          backgroundColor: Colors.neutral.white,
          paddingBottom: Sizing.layout.x4,
          height: Sizing.layout.x50,
        },
        tabBarIcon: ({ color }) => {
          let icon = ICONS.HOME;

          if (route.name === t('strings.home')) {
            icon = ICONS.HOME;
          } else if (route.name === t('strings.myActions')) {
            icon = ICONS.MY_ACTIONS;
          } else if (route.name === t('strings.transactions')) {
            icon = ICONS.TRANSACTION_HOME;
          } else if (route.name === t('strings.help')) {
            icon = ICONS.HELP_DESK;
          }

          return <Image iconName={icon} height={Sizing.layout.x20} width={Sizing.layout.x20} isDimension={false} style={{ tintColor: color }} />;
        },
      })}
    >
      <Tab.Screen name={t('strings.home')} component={HomePage} />
      <Tab.Screen name={t('strings.myActions')} component={MyActions} />
      <Tab.Screen name={t('strings.transactions')} component={Transaction} />
      <Tab.Screen name={t('strings.help')} component={Faq} />
    </Tab.Navigator>
  );
};

export default AppTabs;
