import Cookies from 'js-cookie';

/**
 * Interface representing a storage service.
 */
interface StorageService {
  /**
   * Retrieves an item from the storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | undefined>} A promise resolving to the value associated with the key, or null if the key doesn't exist.
   */
  getItem(key: string): Promise<string | undefined>;
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
   * Clears all items from the storage.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  clearAll(): Promise<void>;
}

/**
 * Implementation of the StorageService interface using js-cookie for web.
 */
class SecureStorageImpl implements StorageService {
  /**
   * Retrieves an item from the storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | undefined>} A promise resolving to the value associated with the key, or null if the key doesn't exist.
   */
  async getItem(key: string): Promise<string | undefined> {
    return Cookies.get(key);
  }

  /**
   * Sets an item in the storage.
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value to set.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  async setItem(key: string, value: string): Promise<void> {
    Cookies.set(key, value);
  }

  /**
   * Removes an item from the storage.
   * @param {string} key - The key of the item to remove.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  async removeItem(key: string): Promise<void> {
    return Cookies.remove(key);
  }

  /**
   * Clears all cookies.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  async clearAll(): Promise<void> {
    const allCookies = Cookies.get(); // Retrieve all cookies
    Object.keys(allCookies).forEach((key) => Cookies.remove(key)); // Remove each cookie
  }
}

const secureStorage: StorageService = new SecureStorageImpl();

export default secureStorage;
