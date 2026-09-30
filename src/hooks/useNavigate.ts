/* eslint-disable react-hooks/rules-of-hooks */
import { NavigationProp, StackActions, useNavigation as useReactNavigation } from '@react-navigation/native';
import { ROUTE, STRINGS } from 'const';
import { useNavigate as useReactRouterNavigate } from 'react-router-dom';
import sessionStorageService from 'services/storageService/sessionStorage';
import { ParentObject } from 'store/sales/types/common';
import { closeWebView, resetTo } from 'utils/navigationHelper';
import { isWeb } from 'utils/platformHelper';

type Params = Record<string, any>;
type NavigationHistoryEntry = { path: string; params: Params };
const navigationHistory: NavigationHistoryEntry[] = []; // In-memory for mobile

const useNavigate = () => {
  const navigationHistoryKey = STRINGS.NAVIGATION_HISTORY_KEY;

  if (isWeb) {
    const navigate = useReactRouterNavigate();

    const loadNavigationHistory = async () => {
      const storedHistory = await sessionStorageService.getItem(navigationHistoryKey);
      return storedHistory ? JSON.parse(storedHistory) : [];
    };

    const saveNavigationHistory = async (history: NavigationHistoryEntry[]) => {
      await sessionStorageService.setItem(navigationHistoryKey, JSON.stringify(history));
    };

    return {
      navigate: async (path: string, params: Params = {}) => {
        const history = await loadNavigationHistory();

        // Reset params if empty
        const cleanedParams = Object.keys(params).length ? params : {};

        history.push({ path, params: cleanedParams });
        await saveNavigationHistory(history);

        // Navigate with params
        navigate(`/${path}`, { state: cleanedParams });
      },

      goBack: async (isRedirection?: boolean) => {
        const history = await loadNavigationHistory();
        if (history.length > 1) {
          history.pop();
          await saveNavigationHistory(history);
          const { path, params } = history[history.length - 1];
          // Navigate back with params
          navigate(path === ROUTE.WEB.DEFAULT ? path : `/${path}`, { state: params });
        } else if (isRedirection) {
          closeWebView();
        } else {
          navigate(ROUTE.WEB.DEFAULT);
        }
      },

      goHome: async (isRedirection?: boolean) => {
        const history = [{ path: ROUTE.WEB.DEFAULT, params: {} }];
        await saveNavigationHistory(history);

        if (isRedirection) {
          closeWebView();
        } else {
          navigate(ROUTE.WEB.DEFAULT, { replace: true }); // replace so browser stack also resets
        }
      },

      replace: async (path: string, params: Params = {}) => {
        const history = await loadNavigationHistory();
        const cleanedParams = Object.keys(params).length ? params : {};

        const existingIndex = history.findIndex((entry: ParentObject) => entry.path === path);

        if (existingIndex !== -1) {
          history.splice(existingIndex + 1);
        } else if (history.length > 0) {
          history[history.length - 1] = { path, params: cleanedParams };
        } else {
          history.push({ path, params: cleanedParams });
        }

        await saveNavigationHistory(history);
        navigate(`/${path}`, { state: cleanedParams, replace: true });
      },

      reset: async (path: string, isRedirection: boolean, params: Params = {}) => {
        const cleanedParams = Object.keys(params).length ? params : {};
        let history;
        // Set history so that '/' is the only page before the current one
        if (isRedirection) {
          history = [{ path, params: cleanedParams }];
        } else {
          history = [
            { path: '', params: {} },
            { path, params: cleanedParams },
          ];
        }

        await saveNavigationHistory(history);

        // First, push '/' silently (without user noticing)
        if (isWeb) {
          if (!isRedirection) {
            navigate('/', { replace: true });
          }

          // Then push the actual path
          navigate(`/${path}`, { state: cleanedParams });
          return;
        }
        resetTo(path, cleanedParams);
      },
    };
  }

  const navigation = useReactNavigation<NavigationProp<any>>();

  return {
    navigate: (path: string, params: Params = {}) => {
      const cleanedParams = Object.keys(params).length ? params : {};
      navigationHistory.push({ path, params: cleanedParams });

      navigation.navigate(path, cleanedParams);
    },

    goBack: () => {
      if (navigationHistory.length > 1) {
        navigationHistory.pop();
      }

      if (navigationHistory.length > 0) {
        const { path, params } = navigationHistory[navigationHistory.length - 1];
        navigation.navigate(path, params);
      } else {
        navigation.navigate(ROUTE.MOBILE.DASHBOARD);
      }
    },

    goHome: () => {
      navigationHistory.push({ path: ROUTE.MOBILE.DASHBOARD, params: {} });
      navigation.navigate(ROUTE.MOBILE.DASHBOARD);
    },

    replace: (path: string, params: Params = {}) => {
      const cleanedParams = Object.keys(params).length ? params : {};

      const existingIndex = navigationHistory.findIndex((entry) => entry.path === path);

      if (existingIndex !== -1) {
        navigationHistory.splice(existingIndex + 1);
      } else if (navigationHistory.length > 0) {
        navigationHistory[navigationHistory.length - 1] = { path, params: cleanedParams };
      } else {
        navigationHistory.push({ path, params: cleanedParams });
      }

      navigation.dispatch(StackActions.replace(path, cleanedParams));
    },

    reset: (path: string, params: Params = {}) => {
      const cleanedParams = Object.keys(params).length ? params : {};
      navigationHistory.length = 0; // clear history
      navigationHistory.push({ path, params: cleanedParams });

      navigation.dispatch(StackActions.replace(path, cleanedParams));
    },
  };
};

export default useNavigate;
