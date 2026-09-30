import React, { ReactNode, useEffect, useState, JSX } from 'react';
import { ApolloProvider } from '@apollo/client';
import { persistCache } from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppLoader } from 'components/sales';
import { client, cache } from 'services/apolloClient';

type Props = {
  children: string | JSX.Element | JSX.Element[] | ReactNode;
};

export const Provider = ({ children }: Props) => {
  const [loadingCache, setLoadingCache] = useState(true);

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []);

  if (loadingCache) {
    return <AppLoader message="Loading..." />;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default Provider;
