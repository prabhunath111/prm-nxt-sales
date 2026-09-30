import { Storage } from 'redux-persist';
import { encryptData, decryptData } from './encryptionManager';
import storageService from './localStorage';
import sessionStorageService from './sessionStorage';

/**
 * Creates an async storage wrapper that transparently encrypts and decrypts
 * data using an AES key that is managed asynchronously.
 */
const createEncryptedStorage = (baseStorage: any): Storage => ({
  getItem: async (key: string): Promise<string | null> => {
    const encryptedData = await baseStorage.getItem(key);
    if (!encryptedData) {
      return null;
    }
    try {
      // Attempt decryption
      const decryptedString = await decryptData(encryptedData);
      // If decryption yields something that might be JSON, return it
      // Otherwise, fallback to the original if someone changed encryption mechanism
      return decryptedString || encryptedData;
    } catch (e) {
      console.warn(`Crypto decryption failed for key: ${key}`);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const encryptedValue = await encryptData(value);
      await baseStorage.setItem(key, encryptedValue);
    } catch (e) {
      console.error(`Crypto encryption failed for key: ${key}`);
      await baseStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    await baseStorage.removeItem(key);
  },
});

export const encryptedLocalStorage = createEncryptedStorage(storageService);
export const encryptedSessionStorage = createEncryptedStorage(sessionStorageService);
