import { View, useWindowDimensions } from 'react-native';
import { Footer, SecondaryHeader } from 'components/sales';
import { Route } from 'navigation/routes/RouteTypes';
import { EXCLUDED_PAGE_HEADERS, ROUTE } from 'const';
import { getRouteName } from 'utils/navigationHelper';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './RedirectionLayout.styles';
import GradientLayout from '../GradientLayout';

export type RedirectionLayoutProps = {
  routes: Array<Route>;
  pathname: string;
};

const RedirectionLayout = ({ routes, pathname }: RedirectionLayoutProps) => {
  const { currentRoute, prevPath, menuName } = getRouteName(routes, pathname);
  const { height, width } = useWindowDimensions(); // Get updated height & width on orientation change
  const excludeHeaderFooter = EXCLUDED_PAGE_HEADERS.includes(currentRoute) && menuName !== ROUTE.WEB.BINGE_RETAILER_DASHBOARD;

  const { t } = useTranslation();

  const getHeader = () => {
    if (excludeHeaderFooter) {
      return null;
    }
    return <SecondaryHeader screenName={t(`menuTitle.${currentRoute}`, { defaultValue: currentRoute })} prevPath={prevPath} />;
  };

  const getFooter = () => {
    if (excludeHeaderFooter) {
      return null;
    }
    return <Footer />;
  };

  return (
    <View style={[styles.nav, { height, width }]}>
      {excludeHeaderFooter ? (
        <Outlet />
      ) : (
        <View style={styles.innerContainer}>
          {getHeader()}
          <GradientLayout>
            <Outlet />
          </GradientLayout>
          {getFooter()}
        </View>
      )}
    </View>
  );
};

export default RedirectionLayout;
