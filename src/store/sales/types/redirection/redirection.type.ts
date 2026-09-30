import { Navigation, User } from '../user';

/**
 * reducer interface/type definitions
 *
 * @type {object}
 * @property {string} text - content for the reducer interface
 */
export interface RedirectionStore {
  sourceName: string;
  moduleName: string;
  subModuleName: string;
  language: string;
  moduleWiseParams: any;
  data: object;
  navigation: Navigation;
}

export interface RedirectedUser extends User {
  navigation: Navigation;
  accessToken: string;
  refreshToken: string;
}

export interface RedirectionResponse {
  redirectionInfo: RedirectionStore;
  user: RedirectedUser;
}
