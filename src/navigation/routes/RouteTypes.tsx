import { ReactElement, FC, ReactNode } from 'react';
import type { RouteProp } from '@react-navigation/native';

export type Route = {
  path?: string;
  menuIcon?: string;
  menuName?: string;
  element?: (() => Promise<any>) | ReactElement | FC | ReactNode;
  end?: boolean;
  children?: Route[];
  skipLazyLoad?: boolean;
  isDefault?: number;
  menuTitle: string;
  menuId: number;
  isModel?: boolean;
  prevPath?: string;
  isDisable?: boolean;
};

export type NavItems = {
  menus: Array<Route>;
  routes: Array<Route>;
  dashboard: Array<Route>;
};

export type AppRoutesType = {
  isAuthenticated: boolean;
  navItems: NavItems;
  isRedirection?: boolean;
  isLocalAuthenticated?: boolean;
};

export type AppDrawerType = {
  isAuthenticated: boolean;
  routes: Array<Route>;
};

export type DetailsScreenRouteProp = RouteProp<any, 'Details'>;
