import { areCookiesEnabled } from "utils/sessionHelper";
import { STRINGS } from "const";
import localStorageService from './localStorage';
import secureStorageService from './secureStorage.web';

const storageService = !areCookiesEnabled(STRINGS.ACCESS_TOKEN) 
  ? localStorageService 
  : secureStorageService;

export {
  storageService
};
