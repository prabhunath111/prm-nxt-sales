import { isAndroid, isiOS } from 'utils/platformHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface representing a storage service.
 */
interface StorageService {
  /**
   * Retrieves an item from the storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | null>} A promise resolving to the value associated with the key, or null if the key doesn't exist.
   */
  getItem(key: string): Promise<string | null>;
  /**
   * Sets an item in the storage.
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value to set.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  setItem(key: string, value: string): Promise<void>;
  /**
   * Removes an item from the storage.
   * @param {string} key - The key of the item to remove.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  removeItem(key: string): Promise<void>;

  /**
   * Removes all items from the storage.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  clearAll(): Promise<void>;
}

/**
 * Implementation of the StorageService interface using AsyncStorage for mobile platforms and localStorage for web.
 */
class StorageServiceImpl implements StorageService {
  /**
   * Retrieves an item from the storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | null>} A promise resolving to the value associated with the key, or null if the key doesn't exist.
   */
  async getItem(key: string): Promise<string | null> {
    return isiOS() || isAndroid() ? AsyncStorage.getItem(key) : sessionStorage.getItem(key);
  }

  /**
   * Sets an item in the storage.
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value to set.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  async setItem(key: string, value: string): Promise<void> {
    return isiOS() || isAndroid() ? AsyncStorage.setItem(key, value) : sessionStorage.setItem(key, value);
  }

  /**
   * Removes an item from the storage.
   * @param {string} key - The key of the item to remove.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  async removeItem(key: string): Promise<void> {
    return isiOS() || isAndroid() ? AsyncStorage.removeItem(key) : sessionStorage.removeItem(key);
  }

  /**
   * Removes all items from the storage.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  async clearAll(): Promise<void> {
    if (isiOS() || isAndroid()) {
      await AsyncStorage.clear(); // Clears AsyncStorage for mobile
    } else {
      sessionStorage.clear(); // Clears sessionStorage for web
    }
  }
}

const sessionStorageService: StorageService = new StorageServiceImpl();

export default sessionStorageService;
