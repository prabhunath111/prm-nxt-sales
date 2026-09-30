/* eslint-disable react-hooks/rules-of-hooks */
import { useParams as useReactRouterParams, useLocation } from 'react-router-dom';
import { useRoute } from '@react-navigation/native';
import { isWeb } from 'utils/platformHelper';

type Params = Record<string, any>;

const useParams = (): Params => {
  if (isWeb) {
    const params = useReactRouterParams();
    const location = useLocation();
    return { ...params, ...(location.state || {}) };
  }
  const route = useRoute();
  return (route.params || {}) as Params;
};

export default useParams;
