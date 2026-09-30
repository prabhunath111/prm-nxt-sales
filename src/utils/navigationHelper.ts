import { createNavigationContainerRef } from '@react-navigation/native';
import { Route } from 'navigation/routes/RouteTypes';
import { ROUTE, STRINGS } from 'const';
import { LEADING_SLASH_REGEX } from 'const/regexes';
import { LOG } from 'config/logger';
import { isAndroid, isWeb, isiOS } from './platformHelper';
import { clearStorage } from './sessionHelper';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigates to the specified screen using the navigation reference.
 * @param {...any} args - The arguments specifying the screen to navigate to and
 * any parameters to pass to the target screen.
 */

export const navigate = (...args: never) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(args);
  }
};

export function resetTo(name: string, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
}

/**
/**
 * Retrieves the route name based on the provided route path.
 * @param {Array<Route>} routes - An array of route objects.
 * @param {string} name - The route path to find the name for.
 * @returns {string} The menu title of the matching route or the provided name.
 */
export const getRouteName = (routes: Array<Route>, name: string): { currentRoute: string; prevPath: string; isDisable: boolean; menuName: string } => {
  const currentRoute = routes?.find((route) => `/${route.path}` === name);
  if (isWeb) {
    return {
      currentRoute: currentRoute?.menuTitle || ROUTE.MOBILE.HOME,
      prevPath: currentRoute?.prevPath || '',
      isDisable: currentRoute?.isDisable || false,
      menuName: currentRoute?.menuName || '',
    };
  }
  return { currentRoute: name, prevPath: currentRoute?.prevPath || '', isDisable: currentRoute?.isDisable || false, menuName: currentRoute?.menuName || '' };
};

/**
 * Extracts the path name by removing the leading slash from a router path.
 *
 * @param {string} path - The router path to extract the name from.
 * @returns {string} - The path name without the leading slash.
 */
export const extractPath = (path: string) => {
  if (path) {
    return path.replace(LEADING_SLASH_REGEX, '');
  }

  return path;
};

const isIOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Ensure that userAgent is defined (it should always be, but it's safe to check)
  if (!userAgent) {
    return false;
  }

  // Check for iOS devices: iPhone, iPad, or iPod
  return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
};

/**
 * This will return the updated URL based on the type of the platform.
 *
 * @param {string} url - The URL to be shown in the view.
 * @returns {string | null} - The updated URL or null value.
 */
export const handleWebViewUrl = async (url: string, isDownloadLink?: boolean): Promise<string | null> => {
  const isPdf = url.endsWith('.pdf');
  const isWord = url.endsWith('.doc') || url.endsWith('.docx');
  const isExcel = url.endsWith('.xls') || url.endsWith('.xlsx');

  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
  if (isWeb) {
    // Check if running on mobile and the webkit.messageHandlers API is available and isPdf || isWord || isExcel
    if (window.webkit?.messageHandlers?.cordova_iab && (isPdf || isWord || isExcel || isIOS() || isDownloadLink)) {
      const message = { action: 'download', url: encodeURIComponent(url) };
      LOG.info('message', message);
      window.webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message));
      return null;
    }
    // For web platform, open URL in a new tab
    const redirectWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (redirectWindow) {
      redirectWindow.location.href = url; // assign location
    } else {
      return null;
    }
    return null; // Return null as action is already taken
  }
  if (isAndroid() && isPdf) {
    // For Android, if it's a PDF, use Google Docs Viewer
    return googleViewerUrl;
  }
  if (isiOS() && isPdf) {
    // If iOS platform, handle PDF differently if required
    return url; // iOS can open PDF directly
  }
  // For other platforms or non-PDFs, return the original URL
  return url;
};

export const closeWebView = () => {
  clearStorage(); // Optional: clear local storage if needed

  // ---- Safe browser close ----
  if (typeof window !== 'undefined' && typeof window.close === 'function') {
    try {
      window.close();
    } catch (err: any) {
      LOG.info('window.close() failed:', err?.message);
    }
  } else {
    LOG.info('window.close() not available');
  }

  // ---- Cordova / IAB close ----
  const message = { action: 'close' };

  try {
    const cordovaHandler = window?.webkit?.messageHandlers?.cordova_iab;
    if (cordovaHandler?.postMessage) {
      LOG.info('Sending IAB close message');
      cordovaHandler.postMessage(JSON.stringify(message));
    } else {
      LOG.info('Cordova IAB API not found');
    }
  } catch (err: any) {
    LOG.info('Error posting Cordova IAB message:', err?.message);
  }
};

export const arePopupsAllowed = () => {
  const popup = window.open('', '', 'width=100,height=100');

  if (popup === null || typeof popup === 'undefined') {
    return false;
  }
  popup.close(); // Clean up

  return true;
};

type ManagePackPayload = {
  checksum: string;
  name: string;
  id: string;
  lang: string;
  src: string;
  agentId: string;
  redirectionUrl: string;
};

export const isValidRedirectUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    const trimmedUrl = url.trim();

    // Prevent protocol-relative URL bypass (e.g., //evil.com)
    if (trimmedUrl.startsWith('//')) return false;

    // Allow strictly bounded relative paths
    if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
      return true;
    }

    // Attempt to parse external/absolute URLs
    const match = trimmedUrl.match(/^https?:\/\/([^\/]+)/i);
    if (!match) return false;

    const hostname = match[1].toLowerCase();

    if (
      hostname === 'tataplay.com' ||
      hostname.endsWith('.tataplay.com')
    ) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export const redirectToManagePackViaPost = ({ checksum, name, id, lang, src, agentId, redirectionUrl }: ManagePackPayload) => {
  if (!isValidRedirectUrl(redirectionUrl)) {
    LOG.error('Security Exception: Untrusted redirect destination blocked.', redirectionUrl);
    return;
  }
  const payload = `${src}|${id}|${name}|${lang}|${agentId}|NA|NA|${checksum}`;
  const form = document.createElement('form');
  form.method = STRINGS.POST;
  form.action = redirectionUrl;
  form.target = '_blank';

  const textarea = document.createElement('textarea');
  textarea.name = STRINGS.RECOMENDATION_PARAM;
  textarea.value = payload;

  form.appendChild(textarea);
  document.body.appendChild(form);
  form.submit();
};

export const safePath = (path?: string) => {
  if (!path) return '/';
  const trimmed = path.trim();
  if (!trimmed) return '/';
  return trimmed.startsWith('/') ? trimmed.replace(/^\/+/, '/') : `${trimmed}`;
};
