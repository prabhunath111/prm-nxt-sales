import { View, useWindowDimensions } from 'react-native';
import { Outlet, useLocation } from 'react-router-dom';
import { SecondaryHeader, Header, Footer } from 'components/sales';
import { Route } from 'navigation/routes/RouteTypes';
import { ROUTE } from 'const';
import { getRouteName } from 'utils/navigationHelper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import styles from './MainLayout.styles';
import GradientLayout from '../GradientLayout';

export type MainLayoutProps = {
  routes: Array<Route>;
};

const MainLayout = ({ routes }: MainLayoutProps) => {
  const location = useLocation();
  const { currentRoute, prevPath } = getRouteName(routes, location.pathname);
  const { height, width } = useWindowDimensions(); // Get updated height & width on orientation change
  const { t } = useTranslation();

  const getHeader = () => {
    if (currentRoute === ROUTE.MOBILE.HOME || currentRoute === ROUTE.MOBILE.MY_ACTION || currentRoute === ROUTE.MOBILE.TRANSACTION || currentRoute === ROUTE.MOBILE.FAQ) {
      return <Header currentRoute={currentRoute} />;
    }
    return <SecondaryHeader screenName={t(`menuTitle.${currentRoute}`, { defaultValue: currentRoute })} prevPath={prevPath} />;
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.nav, { height, width }]}>
        {getHeader()}
        <View style={styles.innerContainer}>
          <GradientLayout>
            <Outlet />
          </GradientLayout>
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

export default MainLayout;
