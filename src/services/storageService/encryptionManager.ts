import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';
import { isAndroid, isiOS } from 'utils/platformHelper';

const SECURE_KEY_ID = 'app_secure_encryption_key';
const REALM_ENCRYPTION_KEY_ID = 'realm_secure_encryption_key';
const ENCRYPTION_SERVICE = 'encryption_user';

let cachedEncryptionKey: string | null = null;
let cachedRealmKey: Uint8Array | null = null;

/**
 * Generates a random AES key of 256 bits (32 bytes).
 */
const generateRandomKey = (bytes: number = 32): string => CryptoJS.lib.WordArray.random(bytes).toString();

/**
 * Asynchronously retrieves the encryption key from the secure enclave (Keychain/Keystore)
 * or creates a new one if it doesn't exist. On the web, it falls back to localStorage.
 */
export const getEncryptionKey = async (): Promise<string> => {
  if (cachedEncryptionKey) {
    return cachedEncryptionKey;
  }

  const isNative = isiOS() || isAndroid();

  if (!isNative) {
    // Web implementation
    let key = localStorage.getItem(SECURE_KEY_ID);
    if (!key) {
      key = generateRandomKey();
      localStorage.setItem(SECURE_KEY_ID, key);
    }
    cachedEncryptionKey = key;
    return key;
  }
  // Native implementation (iOS/Android)
  try {
    const credentials = await Keychain.getGenericPassword({ service: SECURE_KEY_ID });
    if (credentials && credentials.password) {
      cachedEncryptionKey = credentials.password;
      return credentials.password;
    }
  } catch (e) {
    console.error('Keychain fetch error', e);
  }

  // Generate and securely store a new key if absent or failed
  const newKey = generateRandomKey();
  try {
    await Keychain.setGenericPassword(ENCRYPTION_SERVICE, newKey, { service: SECURE_KEY_ID });
  } catch (e) {
    console.error('Keychain set error', e);
  }

  cachedEncryptionKey = newKey;
  return newKey;
};

/**
 * Retrieves or generates a 64-byte encryption key for Realm.
 */
export const getRealmEncryptionKey = async (): Promise<Uint8Array | null> => {
  if (cachedRealmKey) {
    return cachedRealmKey;
  }

  if (!(isiOS() || isAndroid())) {
    return null; // Realm encryption not supported on web in this implementation
  }

  try {
    const credentials = await Keychain.getGenericPassword({ service: REALM_ENCRYPTION_KEY_ID });
    if (credentials && credentials.password) {
      const keyBuffer = Buffer.from(credentials.password, 'hex');
      if (keyBuffer.length === 64) {
        cachedRealmKey = new Uint8Array(keyBuffer);
        return cachedRealmKey;
      }
    }

    // Generate new 64-byte key (512 bits)
    const newKeyHex = generateRandomKey(64);
    await Keychain.setGenericPassword(ENCRYPTION_SERVICE, newKeyHex, { service: REALM_ENCRYPTION_KEY_ID });

    const keyBuffer = Buffer.from(newKeyHex, 'hex');
    cachedRealmKey = new Uint8Array(keyBuffer);
    return cachedRealmKey;
  } catch (e) {
    console.error('Realm Key Generation Error', e);
    return null;
  }
};

/**
 * Encrypts a string using AES.
 */
export const encryptData = async (data: string): Promise<string> => {
  const key = await getEncryptionKey();
  return CryptoJS.AES.encrypt(data, key).toString();
};

/**
 * Decrypts an AES encrypted string.
 */
export const decryptData = async (encryptedData: string): Promise<string | null> => {
  const key = await getEncryptionKey();
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedString;
  } catch (e) {
    console.error('Decryption failed', e);
    return null;
  }
};
