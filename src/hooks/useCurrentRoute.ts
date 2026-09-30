import { useNavigationState } from '@react-navigation/native';

const useCurrentRoute = () => {
  const routes = useNavigationState((state) => state?.routes);
  // Get the name of the last route in the routes array
  const routeName = routes?.length > 0 ? routes[routes.length - 1].name : '';

  return { routeName };
};

export default useCurrentRoute;
