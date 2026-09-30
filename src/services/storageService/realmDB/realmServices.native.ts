import { STRINGS } from 'const';
import { LOG } from 'config/logger';
import Realm from 'realm';
import defaultRealm, { getEncryptedRealm } from './realmSchema';
import { getRealmEncryptionKey } from '../encryptionManager';

let encryptedRealmInstance: Realm | null = null;

/**
 * Gets a Realm instance. On native, attempts to return an encrypted instance.
 * Falls back to unencrypted only if key rotation/access fails.
 */
const getRealm = async (): Promise<Realm> => {
  if (encryptedRealmInstance) {
    return encryptedRealmInstance;
  }

  const encryptionKey = await getRealmEncryptionKey();
  if (encryptionKey) {
    try {
      encryptedRealmInstance = getEncryptedRealm(encryptionKey);
      return encryptedRealmInstance;
    } catch (e) {
      LOG.error('Error opening encrypted realm, fallback to default', e);
    }
  }

  return defaultRealm;
};

const realmServices = {
  storeTokens: async (accessToken: string, refreshToken?: string, userId?: string, mdn?: string) => {
    try {
      const realm = await getRealm();
      realm.write(() => {
        const existingToken: any = realm.objectForPrimaryKey(STRINGS.REALM_KEY, STRINGS.TOKEN_KEY);
        if (existingToken) {
          if (accessToken) existingToken.accessToken = accessToken;
          if (refreshToken) existingToken.refreshToken = refreshToken;
          if (userId) existingToken.userId = userId;
          if (mdn) existingToken.mdn = mdn;
        } else {
          realm.create(STRINGS.REALM_KEY, {
            key: STRINGS.TOKEN_KEY,
            accessToken,
            refreshToken: refreshToken || '',
            userId: userId || '',
            mdn: mdn || '',
          });
        }
      });
    } catch (err) {
      LOG.error(err);
    }
  },
  getTokens: async () => {
    try {
      const realm = await getRealm();
      const tokens = realm.objectForPrimaryKey(STRINGS.REALM_KEY, STRINGS.TOKEN_KEY);
      return tokens
        ? {
            accessToken: tokens.accessToken as string,
            refreshToken: tokens.refreshToken as string,
            userId: tokens.userId as string,
            mdn: tokens.mdn as string,
          }
        : null;
    } catch (err) {
      LOG.error(err);
      return null;
    }
  },

  removeTokens: async () => {
    try {
      const realm = await getRealm();
      realm.write(() => {
        const tokens = realm.objectForPrimaryKey(STRINGS.REALM_KEY, STRINGS.TOKEN_KEY);
        if (tokens) {
          realm.delete(tokens);
        }
      });
      return true;
    } catch (err) {
      LOG.error(err);
      return false;
    }
  },
};

export default realmServices;
