/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ApolloClient, InMemoryCache, HttpLink, DocumentNode, from, ApolloLink, Observable } from '@apollo/client';
import env from 'config/env';
import { setContext } from '@apollo/client/link/context';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { realmServices, storageService } from 'services/storageService';
import { STRINGS, EXCLUDED_OPERATIONS, INCLUDE_OPERATION } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { LOG } from 'config/logger';

// Helper to get store without top-level import to avoid cyclic dependencies
const getStore = () => require('store').store;
const getUserActions = () => require('store/sales/actions').default;
const getUiActions = () => require('store/sales/actions/ui').default;

/**
 * The in-memory cache for Apollo Client.
 */
export const cache = new InMemoryCache();

// Create an HTTP link
const httpLink = new HttpLink({
  uri: env.GQL_BASE_URL,
});

// Function to set the headers
const authMiddleware = setContext(async (queryData, { headers }) => {
  const { operationName } = queryData;
  const isAD = (await storageService?.getItem(STRINGS.IS_AD)) || '';

  let authorizationToken = '';
  const isLoginMutation = operationName === 'Login';
  if (operationName) {
    const isExcluded = EXCLUDED_OPERATIONS.includes(operationName);

    // For Azure AD logins, we must send the token even if it's a Login mutation
    if (!isExcluded || (isLoginMutation && isAD === STRINGS.TRUE)) {
      if (isWeb) {
        authorizationToken = (await storageService.getItem(STRINGS.ACCESS_TOKEN)) ?? '';
      } else {
        const tokens = await realmServices.getTokens();
        authorizationToken = (tokens?.accessToken as string) ?? '';
      }
    } else if (INCLUDE_OPERATION.includes(operationName)) {
      if (isWeb) {
        authorizationToken = (await storageService.getItem(STRINGS.REFRESH_TOKEN)) ?? '';
      } else {
        const tokens = await realmServices.getTokens();
        authorizationToken = (tokens?.refreshToken as string) ?? '';
      }
    }
  }

  const distinctId = (await storageService?.getItem(STRINGS.MIXPANEL_ID)) || '';
  const lang = await storageService?.getItem(STRINGS.LANG);

  const finalHeaders = {
    ...headers,
    authorization: authorizationToken,
    'env-agent': STRINGS.MOBILE_AGENT,
    'app-agent': STRINGS.AUTH,
    'distinctid': distinctId,
    'lang': lang || STRINGS.ENGLISH,
    ...(isAD === STRINGS.TRUE && isLoginMutation && {
      'x-auth-type': STRINGS.AZURE_AD,
    }),
  };


  return {
    headers: finalHeaders,
  };
});



let isRefreshing:boolean = false;
let pendingRequests:Array<()=>void> = [];

const resolvePendingRequests = async () => {
    pendingRequests.forEach(callback => {
      callback();
    });
  pendingRequests = [];
};


const addPendingRequest = (callback:()=>void) => {
  pendingRequests.push(callback);
};

const handleError = (operationName?: string) => {
  const { isRedirection } = getStore().getState().user;
  if (isRedirection && operationName !== 'Logout') {
    getStore().dispatch(getUiActions().showErrorPage(STRINGS.REDIRECTION_ERROR, true));
  } else {
    getStore().dispatch(getUserActions().doLogout());
  }
};

/**
 * Handles refresh token and Pending request
 */
const errorLink = new ApolloLink((operation, forward) => new Observable(observer => {
  const subscriber = {
    next: observer.next.bind(observer),
    error: observer.error.bind(observer),
    complete: observer.complete.bind(observer),
  };

  forward(operation).subscribe({
    next: subscriber.next,
    error: async (networkError = {}) => {
      const statusCode = networkError?.networkError?.statusCode || networkError?.statusCode;
      const errorMessage = networkError?.message || networkError?.networkError?.message;
      const { operationName } = operation || {};

      const isTokenExpired = errorMessage?.includes('Your token has been Invalid or Expired');
      LOG.info(`ApolloLink: ERROR for ${operationName} with status: ${statusCode}`);

      // Skip refresh for auth-related operations to avoid infinite loop
      if (
        operationName === 'RefreshToken' ||
        operationName === 'Logout' ||
        operationName === 'Login' ||
        operationName === 'RedirectionLogin'
      ) {
        return subscriber.error(networkError);
      }

      if (statusCode === 401 || isTokenExpired) {
        if (pendingRequests.length > 20) {
          getStore().dispatch(getUserActions().doLogout());
          pendingRequests = [];
          return subscriber.error(networkError);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          LOG.info('ApolloLink: Starting token refresh...');
          await getStore().dispatch(getUserActions().resetExpiry());
          getStore().dispatch(getUserActions().handleRefreshToken()).then((response: ParentObject) => {
            isRefreshing = false;
            const status = response?.status || response?.refreshToken?.tokenStatus || response?.tokenStatus;
            
            if (!status) {
              LOG.error('ApolloLink: Token refresh failed via response status');
              getStore().dispatch(getUserActions().doLogout());
              pendingRequests = [];
            } else {
              LOG.info('ApolloLink: Token refresh successful, resolving pending requests');
              resolvePendingRequests();
            }
          }).catch((error: any) => {
            isRefreshing = false;
            pendingRequests = [];
            LOG.error('ApolloLink: Token refresh caught exception', error);
            getStore().dispatch(getUiActions().showErrorPage(error.message));
          });
        }

        return new Observable((subObserver) => {
          addPendingRequest(() => {
            operation.setContext(async ({ headers = {} }) => ({
              headers: {
                ...headers,
              },
            }));
            forward(operation).subscribe(subObserver);
          });
        }).subscribe(subscriber);
      } else if (statusCode >= 400) {
        handleError(operationName);
      }

      return subscriber.error(networkError);
    },
    complete: subscriber.complete,
  });
}));



const removeTypenameLink = removeTypenameFromVariables();
const link = from([authMiddleware, errorLink, removeTypenameLink, httpLink]);

/**
 * The Apollo Client instance.
 */
export const client = new ApolloClient({
  link,
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
});

/**
 * Sends a GET request to the GraphQL server.
 * @param {DocumentNode} query - The GraphQL query document.
 * @param {any} variables - The query variables.
 * @returns {Promise<any>} A promise resolving to the query result.
 */
const get = (query: DocumentNode, variables: any): Promise<any> =>
  client
    .query({
      query,
      variables,
    })
    .then((result) => result.data)
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

/**
 * Sends a POST request to the GraphQL server.
 * @param {DocumentNode} mutation - The GraphQL mutation document.
 * @param {any} variables - The mutation variables.
 * @returns {Promise<any>} A promise resolving to the mutation result.
 */
const post = (mutation: DocumentNode, variables: any): Promise<any> =>
  client
    .mutate({
      mutation,
      variables,
    })
    .then((result) => result.data)
    .catch((err) => {
      getStore().dispatch(getUiActions().clearLoader());
      if (err) {
        throw new Error(err);
      }
    });

export const api = { get, post };
