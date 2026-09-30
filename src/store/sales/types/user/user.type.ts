import { Route } from 'navigation/routes/RouteTypes';
import { ParentObject } from '../common';

/**
 * reducer interface/type definitions
 *
 * @type {object}
 * @property {string} text - content for the reducer interface
 */
export interface UserStore {
  info: User;
  isAuthenticated: boolean;
  isRedirection: boolean;
  navigation: Navigation;
  accessExpiry: string;
  refreshExpiry: string;
  userDetails: ParentObject;
  storeRmn: string;
  isLocalAuthenticated: boolean;
  deviceId?: string | null;
  eligibleStoreAutomation: boolean;
}

export interface Navigation {
  menus: Array<Route>;
  routes: Array<Route>;
  dashboard: Array<Route>;
}

export interface User {
  roleId: string;
  userId: string;
  mdn: string;
  name: string;
  userStatus: string;
  internalRole?: string;
  hideAscWarranty?: string;
}

export interface LoginInput {
  userName: string;
  password: string;
  isPrmLogin: boolean;
}

export interface authType {
  mdn?: string;
  userName?: string;
  isPrmLogin?: boolean;
  accessToken?: string;
}
