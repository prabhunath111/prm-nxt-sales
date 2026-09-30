import { useLocation } from 'react-router-dom'; // For web

const useCurrentRoute = () => {
  const location = useLocation();
  const routePath = location.pathname.replace(/^\//, '');

  return { routeName: routePath };
};

export default useCurrentRoute;
