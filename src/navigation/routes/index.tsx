import { useSelector} from 'react-redux';
import { RootState } from 'store';
/** Below Line added for uuid issue in RN */

import 'react-native-get-random-values';
import { useEffect } from 'react';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { LOG } from 'config/logger';
import AppRoutes from './Routes';

const Routes = () => {
  const { isAuthenticated, isLocalAuthenticated, navigation,  isRedirection } = useSelector(
    (state: RootState) => state.user,
  );

  const currentRouteObj = useCurrentRoute();

  useEffect(() => {
    const { routeName } = currentRouteObj;
    const nonSetArray = ['', '/', 'login', 'error', 'nextPrm'];
    if(!nonSetArray.includes(routeName)) {
      LOG.info(`Setting event for route: ${routeName}`);
    }
   }, [currentRouteObj]);

  const sessionNavigation = useSelector( (state: RootState) => state.redirection.navigation)
 
  return (
    <AppRoutes
      isAuthenticated={isAuthenticated}
      isLocalAuthenticated={isLocalAuthenticated}
      navItems={isRedirection ? sessionNavigation : navigation}
      isRedirection={isRedirection}
    />
  );
};

export default Routes;