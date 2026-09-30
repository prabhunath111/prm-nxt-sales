import React, { useEffect, useRef } from 'react';
import { Navigate, RouteObject, useRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { ChildLayout, routeComponent, MainLayout, AuthLayout, Redirection, ErrorPage, RedirectionLayout } from 'navigation/ComponentRegistry';
import { ROUTE, REDIRECTION, PROPERTIES } from 'const';
import { Route, AppRoutesType } from 'navigation/routes/RouteTypes';
import useNavigate from 'hooks/useNavigate';
import Login from 'screens/sales/Login';
import QuotationPortalDetails from 'screens/sales/QuotationPortalDetails';
import PackViewDetails from 'screens/sales/PackViewDetails';

const makeRoute = (jsonArr: Array<Route>, defaultPath?: number) => {
  const routeArr: RouteObject[] = [];
  jsonArr?.forEach((routeJson: Route) => {
    let routeMain: RouteObject = {};
    if (!routeJson.children) {
      const componentIndx: string = routeJson.menuName || '';
      const RouteComponent = routeComponent(componentIndx);
      routeMain = {
        path: routeJson.path,
        element: <RouteComponent />,
      };
    } else {
      routeMain = {
        path: routeJson.path,
        element: <ChildLayout child={routeJson.children} path={routeJson.path} />,
        children: makeRoute(routeJson.children, routeJson?.isDefault),
      };
    }

    if (defaultPath === 0) {
      routeArr.push({
        element: <Navigate to={routeJson.path || '/'} />,
        path: '',
      });
    }
    routeArr.push(routeMain);
  });
  return routeArr;
};

const MainLayoutWithRoutes = ({ isRedirection, routes }: any) => {
  const location = useLocation();
  return isRedirection ? (
    <RedirectionLayout routes={routes} pathname={location?.pathname} />
  ) : (
    <MainLayout routes={routes} />
  );
};

const AppRoutes = ({ isAuthenticated, navItems: { routes }, isRedirection }: AppRoutesType) => {
  const { goHome } = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);
  const blockedRoutes = PROPERTIES.HIDE_BACK_BUTTON_FOR_ROUTE;

  useEffect(() => {
    if (navigationType === 'POP') {
      const previousPath = lastPathRef.current;
      if (previousPath && blockedRoutes.some((route) => previousPath.endsWith(route))) {
        goHome(isRedirection);
        return;
      }
    }
    lastPathRef.current = location.pathname;
  }, [navigationType, location.pathname, blockedRoutes, goHome, isRedirection]);

  const mainRouteArray: RouteObject[] = React.useMemo(() => [
    {
      element: <AuthLayout />,
      children: [
        {
          path: 'qt/:code',
          element: <QuotationPortalDetails />,
        },
        {
          path: 'packViewDetails',
          element: <PackViewDetails isPublic />,
        },
        {
          path: ROUTE.WEB.LOGIN,
          element: isAuthenticated ? <Navigate to="/" /> : <Login />,
        },
        {
          path: REDIRECTION.ROUTES,
          element: <Redirection />,
        },
        {
          path: ROUTE.WEB.ERROR,
          element: <ErrorPage />,
        },
      ],
    },
    {
      element: <MainLayoutWithRoutes isRedirection={isRedirection} routes={routes} />,
      children: isAuthenticated
        ? [...makeRoute(routes), { path: '*', element: <Navigate to={ROUTE.WEB.ERROR} /> }]
        : [
            { path: '/qt', element: <Navigate to={ROUTE.WEB.PORTAL} /> },
            { path: '/packViewDetails', element: <Navigate to={ROUTE.WEB.PACK_VIEW_DETAILS} /> },
            { path: '/', element: <Navigate to={ROUTE.WEB.LOGIN} /> },
            { path: '*', element: <Navigate to={ROUTE.WEB.LOGIN} /> },
          ],
    },
  ], [isAuthenticated, routes, isRedirection]);
  return useRoutes([...mainRouteArray]);
};

export default AppRoutes;
