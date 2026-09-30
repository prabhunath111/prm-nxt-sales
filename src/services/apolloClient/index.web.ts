/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ApolloClient, InMemoryCache, HttpLink, DocumentNode, from, ApolloLink, Observable } from '@apollo/client';
import env from 'config/env';
import { setContext } from '@apollo/client/link/context';
import { storageService } from 'services/storageService';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { ALERT, MODAL, STRINGS } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { removeItem } from 'utils/sessionHelper';
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
  credentials: 'include',
});

// Function to set the headers
const authMiddleware = setContext(async (queryData, { headers }) => {
  const { operationName } = queryData;
  const [
    redirectionToken,
    accessToken,
    refreshToken,
    distinctId,
    isAD,
    lang
  ] = await Promise.all([
    storageService.getItem(STRINGS.REDIRECTION_TOKEN),
    storageService.getItem(STRINGS.ACCESS_TOKEN),
    storageService.getItem(STRINGS.REFRESH_TOKEN),
    storageService.getItem(STRINGS.MIXPANEL_ID),
    storageService.getItem(STRINGS.IS_AD),
    storageService.getItem(STRINGS.LANG)
  ]);

  const isLoginMutation = operationName === 'Login';
  const isRedirectionLogin = operationName === STRINGS.REDIRECTION_LOGIN;

  const authorization = isRedirectionLogin
    ? (redirectionToken ?? '')
    : (isLoginMutation && isAD !== 'true' ? '' : (accessToken ?? ''));

  const appAgent = STRINGS.AUTH;

  return {
    headers: {
      ...headers,
      authorization,
      refreshToken: refreshToken ?? '',
      'env-agent': STRINGS.WEB_AGENT,
      'app-agent': appAgent,
      'distinctid': distinctId ?? '',
      'lang': lang || STRINGS.ENGLISH,
      ...(isAD === 'true' && isLoginMutation && {
        'x-auth-type': STRINGS.AZURE_AD,
      }),
    },
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
  if(isRedirection && operationName !== 'Logout'){
    getStore().dispatch(
      getUiActions().showAlert(
        STRINGS.REDIRECTION_ERROR,
        ALERT.ERROR,
        {
          primaryText: MODAL.OK,
          closeView: true
        },
        {},
      ),
    );
  }else{
    getStore().dispatch(getUserActions().doLogout())
  }
}

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
          handleError();
          pendingRequests = [];
          return subscriber.error(networkError);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          LOG.info('ApolloLink: Starting token refresh...');
          await getStore().dispatch(getUserActions().resetExpiry());
          await removeItem(STRINGS.ACCESS_TOKEN);

          getStore().dispatch(getUserActions().doRefreshToken()).then((response: ParentObject) => {
            isRefreshing = false;
            // Check for both .status (legacy) and inner .tokenStatus in case refactorResponse was used
            const status = response?.status || response?.refreshToken?.tokenStatus || response?.tokenStatus;
            
            if (!status) {
              LOG.error('ApolloLink: Token refresh failed via response status');
              handleError();
              pendingRequests = [];
            } else {
              LOG.info('ApolloLink: Token refresh successful, resolving pending requests');
              resolvePendingRequests();
            }
          }).catch((error: any) => {
            isRefreshing = false;
            pendingRequests = [];
            LOG.error('ApolloLink: Token refresh caught exception', error);
            getStore().dispatch(
              getUiActions().showAlert(
                error.message,
                ALERT.ERROR,
                {
                  primaryText: MODAL.OK,
                  closeView: true,
                },
                {},
              ),
            );
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
        // Only log out on hard server errors, not on generic network failure (statusCode null)
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
  connectToDevTools: true,
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
