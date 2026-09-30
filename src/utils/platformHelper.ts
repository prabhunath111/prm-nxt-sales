import { PLATFORM } from 'const';
import { Platform, PixelRatio, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/**
 * Returns the current platform.
 * @returns {{ OS: string }} The current platform object.
 */
export const platform = () => ({
  OS: Platform.OS,
});

/**
 * Checks if the current platform is Android.
 * @returns {boolean} True if the current platform is Android, otherwise false.
 */
export const isAndroid = () => platform().OS === 'android';

/**
 * moved from the 'react-native-extra-dimensions-android' node_module as it gives a frustrating console.warn,
 * see https://github.com/Sunhat/react-native-extra-dimensions-android for documentation
 *
 * Returns extra dimensions for Android devices.
 * @returns {number} The extra dimensions for Android devices.
 */
export const extraDimensions = () => {
  if (isAndroid()) {
    return Dimensions.get('screen').height;
  }
  return 0;
};
export const isTablet = () => DeviceInfo.isTablet();

/**
 * Checks if the current platform is WebOS.
 * @returns {boolean} True if the current platform is WebOS, otherwise false.
 */
function isWebOS() {
  return Platform.OS === PLATFORM.WEB;
}

export const isWeb = isWebOS();

/**
 * Checks if the current platform is iOS.
 * @returns {boolean} True if the current platform is iOS, otherwise false.
 */
export const isiOS = () => platform().OS === PLATFORM.IOS;

/**
 * Checks if the current device is an iPad.
 * @returns {boolean} True if the current device is an iPad, otherwise false.
 */
export const isIpad = () => isiOS() && isTablet();

/**
 * Returns true when the device is iPhone and runs iOS 16 and above
 * Checks if the current iOS version is 16 or above.
 * @method checkIsiOS16AndAbove
 * @returns {boolean} True if the current iOS version is 16 or above, otherwise false.
 */
export const checkIsiOS16AndAbove = (): boolean => {
  if (platform().OS === PLATFORM.IOS) {
    const versionString = Platform?.Version?.toString() || '0';
    const versionArray = versionString.split('.');
    return parseInt(versionArray[0], 10) >= 16;
  }
  return false;
};

export const isiOSVersion16AndAbove = checkIsiOS16AndAbove();

/**
 * This method will return if the device is tablet or not.
 * Checks if the current device is a tablet and an iPad.
 * @method isTabletAndIpad
 * @returns {boolean} True if the current device is a tablet and an iPad, otherwise false.
 */
export const isTabletAndIpad = () => DeviceInfo.isTablet();
/**
 * This method will return if the Mobile is in landscape mode.
 *
 * @method isMobileLandscape
 * @returns {boolean} True if the current device is in landscape mode, otherwise false.
 */
export const isMobileLandscape = () => !(DeviceInfo.isTablet() || Platform.isTV || isWeb) && DeviceInfo.isLandscapeSync();

/**
 * This method will return if the device is desktop or not
 * @method isDesktop
 * @returns {boolean} True if the current platform is a desktop platform, otherwise false.
 */
export const isDesktopPlatform = () => isWeb;
export const isDesktop = isDesktopPlatform();

/**
 * Checks if the current device is a low-end device.
 * @returns {boolean} True if the current device is a low-end device, otherwise false.
 */
export const isLowEndDevice = () => {
  if (isDesktop) {
    return PixelRatio.get() < 2 && navigator.hardwareConcurrency <= 4 && (navigator as any).deviceMemory <= 1;
  }
  return false;
};

/**
 * Responsible to get the device information
 *
 * @returns {({ userAgent: any; platform: any; language: any; browserName: any; browserVersion: any; deviceId?: undefined; deviceName?: undefined; systemVersion?: undefined; brand?: undefined; model?: undefined; os?: undefined; appVersion?: undefined; } | { ...; })}
 */
export const getDeviceInformation = async () => {
  if (isWeb) {
    return {
      userAgent: navigator?.userAgent,
      platform: navigator?.platform,
      language: navigator?.language,
      browserName: navigator?.appName,
      $os: navigator?.userAgent,
      browserVersion: navigator?.appVersion,
    };
  }
  return {
    deviceId: await DeviceInfo?.getDeviceId(),
    deviceName: await DeviceInfo?.getDeviceName(),
    systemVersion: await DeviceInfo?.getSystemVersion(),
    brand: await DeviceInfo?.getBrand(),
    model: await DeviceInfo?.getModel(),
    os: await DeviceInfo?.getSystemName(),
    $os: await DeviceInfo?.getSystemName(),
    appVersion: await DeviceInfo?.getVersion(),
  };
};

/**
 * Retrieves the unique device ID using `react-native-device-info`.
 *
 * @returns A promise that resolves to the unique device ID if available, otherwise null.
 */
export const getDeviceID = async () => {
  const uniqueId = await DeviceInfo.getUniqueId();
  if (uniqueId) {
    return uniqueId;
  }

  return null;
};
export const isMobileDevice = () => {
  if (isWeb) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
};
