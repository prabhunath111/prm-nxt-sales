import { STRINGS } from 'const';
import { realmServices, storageService } from 'services/storageService';
import { LOG } from 'config/logger';
import { persistor } from 'store';
import { isAndroid, isWeb, isiOS } from './platformHelper';

/**
 * Resets the current user session data by removing a specific item from storage.
 *
 */
export const clearStorage = () => {
  persistor.purge();
  persistor.flush();
  
  if (isWeb) {
    // Surgical cleanup for web to avoid breaking third-party SDKs (like Moengage)
    storageService.removeItem(STRINGS.ACCESS_TOKEN);
    storageService.removeItem(STRINGS.REFRESH_TOKEN);
    storageService.removeItem(STRINGS.REDIRECTION_TOKEN);
    storageService.removeItem(STRINGS.IS_AD);
    storageService.removeItem('userId');
    storageService.removeItem('mdn');
    sessionStorage.clear();
  } else {
    storageService.clearAll();
  }
};

/**
 * Surgical cleanup of session-related data only.
 * Much faster than clearStorage() as it avoids a full persistence purge.
 */
export const clearUserSessionSelective = async () => {
  const sessionKeys = [
    STRINGS.ACCESS_TOKEN,
    STRINGS.REFRESH_TOKEN,
    STRINGS.REDIRECTION_TOKEN,
    'userId',
    'mdn'
  ];

  // Parallelize both localStorage/AsyncStorage and Realm clearing
  await Promise.all([
    ...sessionKeys.map(key => storageService.removeItem(key)),
    !isWeb ? realmServices.removeTokens() : Promise.resolve(),
    isWeb ? sessionStorage.clear() : Promise.resolve()
  ]);
};

/**
 * Resets the current user session data
 */
export const resetUserSession = async () => {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        // Now, purge the persisted data from storage
        clearStorage();
        resolve('');
      }, 100);
    });
  } catch (error) {
    LOG.error('Error purging persisted state:', error);
  }

  if (!isWeb) {
    realmServices.removeTokens();
  } else {
    storageService.removeItem(STRINGS.ACCESS_TOKEN);
    storageService.removeItem(STRINGS.REFRESH_TOKEN);
    storageService.removeItem(STRINGS.REDIRECTION_TOKEN);
  }
};

/**
 * Check if cookies are enabled in the browser.
 *
 * @param {string} testKey - A unique key used to test cookie functionality.
 * @returns {boolean} - Returns true if cookies are enabled, otherwise false.
 */
export function areCookiesEnabled(testKey: string): boolean {
  // Check if cookies are enabled
  let cookiesEnabled = navigator.cookieEnabled;

  // If cookies are not enabled, attempt to set and test a cookie
  if (!cookiesEnabled) {
    try {
      // Generate a unique value to store in the cookie
      const testValue = `test-${Date.now()}`;
      document.cookie = `${testKey}=${testValue}; path=/`; // Set a test cookie
      cookiesEnabled = document.cookie.indexOf(`${testKey}=${testValue}`) !== -1; // Check if the cookie is set
      // Clean up the test cookie
      document.cookie = `${testKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } catch (e) {
      // In case of an exception, cookies are likely not enabled
      cookiesEnabled = false;
    }
  }

  return cookiesEnabled;
}

/**
 * Sets the current user session data.
 *
 * @param {Object} params - The parameters object.
 * @param {string | null} [params.accessToken] - The access token to be stored.
 * @param {string | null} [params.refreshToken] - The optional refresh token to be stored.
 * @param {string} [params.redirectionToken] - The optional redirection token to be stored.
 */
export const setToken = async ({
  accessToken = null,
  refreshToken = null,
  redirectionToken,
  userId = null,
  mdn = null,
}: {
  accessToken?: string | null;
  refreshToken?: string | null;
  redirectionToken?: string;
  userId?: string | null;
  mdn?: string | null;
}): Promise<void> => {
  const tasks: Promise<any>[] = [];

  if (redirectionToken) {
    tasks.push(storageService.setItem(STRINGS.REDIRECTION_TOKEN, redirectionToken));
  } else if (isWeb) {
    // Web environment: store tokens in local storage
    if (accessToken) tasks.push(storageService.setItem(STRINGS.ACCESS_TOKEN, accessToken));
    if (refreshToken) tasks.push(storageService.setItem(STRINGS.REFRESH_TOKEN, refreshToken));
  } else if (isAndroid() || isiOS()) {
    // Non-web environment: store in Realm
    if (accessToken || refreshToken || userId || mdn) {
      tasks.push(
        realmServices.storeTokens(
          accessToken || '',
          refreshToken || undefined,
          userId || undefined,
          mdn || undefined
        )
      );
    }
  }

  await Promise.all(tasks);
};


/**
 * Resets the current user session data by removing a specific item from storage.
 *
 * @param {string} keyName - The name of the key to remove from storage.
 * @returns {boolean} - Returns true if the item was removed, false if the key was not found.
 */
export const removeItem = (keyName: string): boolean => {
  const item = storageService.getItem(keyName);

  if (item !== null) {
    storageService.removeItem(keyName);
    return true;
  }

  return false; // Key not found
};

export const getStoredItem = async (key: string) => {
  const data = await storageService.getItem(key);
  return data;
};
