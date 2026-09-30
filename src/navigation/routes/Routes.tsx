import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routeComponent } from 'navigation/ComponentRegistry';
import Header from 'components/sales/Header';
import { ROUTE } from 'const';
import GradientLayout from 'navigation/layout/GradientLayout';
import { SecondaryHeader } from 'components/sales';
import AppTabs from 'navigation/tabs/AppTabs';
import Login from 'screens/sales/Login';
import LocalAuthentication from 'screens/sales/LocalAuthentication';
import { AppRoutesType, Route } from './RouteTypes';

interface ParentObject {
  [key: string]: any;
}
const Stack = createNativeStackNavigator<ParentObject>();

const AppRoutes = ({ isAuthenticated, isLocalAuthenticated, navItems: { routes } }: AppRoutesType) => {
  const getScreenOptions = (screenName: string, prevPath?: string, menuName?: string) => {
    if ((menuName !== ROUTE.WEB.BINGE_RETAILER_DASHBOARD && screenName === ROUTE.MOBILE.DASHBOARD) || screenName === ROUTE.MOBILE.LOGIN) {
      return {
        headerShown: false,
      };
    }
    return {
      headerShown: true,
      header: () => <SecondaryHeader screenName={screenName} prevPath={prevPath} />,
    };
  };
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? ROUTE.MOBILE.DASHBOARD : ROUTE.MOBILE.LOGIN}
      screenOptions={{
        headerShown: false,
      }}
    >
      <>
        {isAuthenticated ? (
          <Stack.Screen
            name={isLocalAuthenticated ? ROUTE.MOBILE.DASHBOARD : ROUTE.MOBILE.LOCAL_AUTHENTICATION}
            component={isLocalAuthenticated ? AppTabs : LocalAuthentication}
            options={{ headerShown: !!isLocalAuthenticated, header: () => <Header /> }}
          />
        ) : (
          <Stack.Screen name={ROUTE.MOBILE.LOGIN} component={Login} />
        )}

        {routes?.map((route: Route) => {
          if (route?.menuTitle === ROUTE.MOBILE.HOME) return null;

          const componentIndx = route.menuName || '';
          const RouteComponent = routeComponent(componentIndx);

          return (
            <Stack.Screen name={route?.path || ''} key={route.menuId} options={getScreenOptions(route?.menuTitle, route?.prevPath, route?.menuName)}>
              {() => (
                <GradientLayout>
                  <RouteComponent />
                </GradientLayout>
              )}
            </Stack.Screen>
          );
        })}
      </>
    </Stack.Navigator>
  );
};

export default AppRoutes;
