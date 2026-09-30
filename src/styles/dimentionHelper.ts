import { Dimensions, StatusBar } from 'react-native';
import { isAndroid, isTablet as isDeviceTablet, isWeb } from 'utils/platformHelper';
import DeviceInfo from 'react-native-device-info';
import { assertNever } from 'utils/checkTypes';
import { PLATFORM } from 'const';
import { Sizing } from 'styles';

/// /////////////////////////////////////////////////////////////////////////////
// Designs are for these devices, these are the reference dimensions from which
// all other shapes and sizes are calculated from.
/// /////////////////////////////////////////////////////////////////////////////

export const GOOGLE_PIXEL_WIDTH = 1080;
export const GOOGLE_PIXEL_HEIGHT = 1920;
export const GOOGLE_PIXEL_SCALE_FACTOR = 2.625;

export const IPHONE_PLUS_WIDTH = 414;
export const IPHONE_PLUS_HEIGHT = 736;

export const IPAD_WIDTH = 768;
export const IPAD_HEIGHT = 1024;

export const SAMSUNG_S3_WIDTH = 2048;
export const SAMSUNG_S3_HEIGHT = 1536;
export const SAMSUNG_S3_SCALE_FACTOR = 2;

/// /////////////////////////////////////////////////////////////////////////////
export enum OS {
  IOS = 1,
  ANDROID,
  WEB,
}

export type DeviceInfoProps = {
  model: string;

  locale?: string;
  deviceId: string;
  manufacturer: string;
  serialNumber: string;
  os: OS;
  osVersion: string;
  timezone?: string;
  appVersion: string;
  isEmulator: boolean;
  isTablet: boolean;
  readableVersion: string;
};

export type DeviceMetricsType = {
  os: OS;
  model: string;
  isTablet: boolean;
};

export enum DEVICE {
  ANDROID_PHONE = 'ANDROID_PHONE',
  ANDROID_TABLET = 'ANDROID_TABLET',
  ANDROID_TV = 'ANDROID_TV',
  IPAD = 'IPAD',
  IPHONE = 'IPHONE',
  IPHONEX = 'IPHONEX',
  WEB = 'WEB',
}

type ReferenceDimensions = {
  BASE_PIXEL_HEIGHT: number;
  BASE_PIXEL_WIDTH: number;
};

export const getDesignReferenceDimensions = (deviceType: DEVICE): ReferenceDimensions => {
  switch (deviceType) {
    // Reference device - Google Pixel (1080 x 1920)
    case DEVICE.ANDROID_PHONE:
      return {
        BASE_PIXEL_WIDTH: GOOGLE_PIXEL_WIDTH / GOOGLE_PIXEL_SCALE_FACTOR,
        BASE_PIXEL_HEIGHT: GOOGLE_PIXEL_HEIGHT / GOOGLE_PIXEL_SCALE_FACTOR,
      };
    case DEVICE.WEB:
    case DEVICE.ANDROID_TV:
    case DEVICE.ANDROID_TABLET:
      return {
        BASE_PIXEL_WIDTH: SAMSUNG_S3_WIDTH / SAMSUNG_S3_SCALE_FACTOR,
        BASE_PIXEL_HEIGHT: SAMSUNG_S3_HEIGHT / SAMSUNG_S3_SCALE_FACTOR,
      };
    // Reference device - iPhone Plus
    case DEVICE.IPHONE:
    case DEVICE.IPHONEX:
      return {
        BASE_PIXEL_WIDTH: IPHONE_PLUS_WIDTH,
        BASE_PIXEL_HEIGHT: IPHONE_PLUS_HEIGHT,
      };
    case DEVICE.IPAD:
      return {
        BASE_PIXEL_WIDTH: IPAD_HEIGHT,
        BASE_PIXEL_HEIGHT: IPAD_WIDTH,
      };
    default:
      return assertNever(deviceType);
  }
};

export const getOSType = (os: string = !isWeb ? DeviceInfo.getSystemName() : PLATFORM.WEB): OS => {
  switch (os) {
    case PLATFORM.I_OS:
      return OS.IOS;
    case PLATFORM.IPAD_OS:
      return OS.IOS;
    case PLATFORM.WEB:
      return OS.WEB;
    default:
      return OS.ANDROID;
  }
};

export const getPlatformInformation = (): DeviceInfoProps => ({
  model: isWeb ? 'web-model' : DeviceInfo.getModel(),

  deviceId: isWeb ? 'web-device-id' : DeviceInfo.getDeviceId(),
  manufacturer: isWeb ? 'web-manufacturer' : DeviceInfo.getManufacturerSync(),
  serialNumber: isWeb ? 'web-serialNumber' : DeviceInfo.getSerialNumberSync(),
  os: getOSType(),
  osVersion: isWeb ? 'web-osVersion' : DeviceInfo.getSystemVersion(),
  appVersion: isWeb ? 'web-appVersion' : DeviceInfo.getVersion(),
  isEmulator: isWeb ? false : DeviceInfo.isEmulatorSync(),
  isTablet: isDeviceTablet(),
  readableVersion: isWeb ? 'web-readableVersion' : DeviceInfo.getReadableVersion(),
});

export const getPlatformDevice = ({ os }: DeviceMetricsType) => {
  switch (os) {
    case OS.WEB:
      return DEVICE.WEB;
    case OS.ANDROID:
      return isDeviceTablet() ? DEVICE.ANDROID_TABLET : DEVICE.ANDROID_PHONE;
    case OS.IOS:
      return isDeviceTablet() ? DEVICE.IPAD : DEVICE.IPHONE;
    default:
      return DEVICE.IPAD;
  }
};

const deviceInfo = getPlatformInformation();
const device = getPlatformDevice(deviceInfo);

export const { BASE_PIXEL_WIDTH, BASE_PIXEL_HEIGHT }: ReferenceDimensions = getDesignReferenceDimensions(device);

export const getFullScreenWidth = ({ os }: DeviceInfoProps = deviceInfo) => {
  switch (os) {
    case OS.WEB:
      return window.innerWidth;
    default:
      return Dimensions.get('screen').width;
  }
};

export const getFullScreenHeight = ({ os }: DeviceInfoProps = deviceInfo) => {
  switch (os) {
    case OS.WEB:
      return window.innerHeight;
    default:
      return Dimensions.get('screen').height;
  }
};

let scaleFactorY: number;
export const getScaleFactorY = (BASE_DEVICE_HEIGHT: number = BASE_PIXEL_HEIGHT): number => {
  if (!scaleFactorY) {
    const height = getFullScreenHeight();
    scaleFactorY = height / BASE_DEVICE_HEIGHT;
  }

  return scaleFactorY;
};

let scaleFactorX: number;
export const getScaleFactorX = (BASE_DEVICE_WIDTH: number = BASE_PIXEL_WIDTH): number => {
  if (!scaleFactorX) {
    const width = getFullScreenWidth();
    scaleFactorX = width / BASE_DEVICE_WIDTH;
  }
  return scaleFactorX;
};

export const scaleFont = (baseSize: number, maxSize: number = 20, minSize: number = 16, baseWidth: number = 360): number => {
  const maxFontSize = baseSize > maxSize ? baseSize : maxSize;
  const minFontSize = baseSize < minSize ? baseSize : minSize;
  const screenWidth = getFullScreenWidth(); // Get the current screen width
  const scaledFontSize = (screenWidth / baseWidth) * baseSize; // Calculate the scaled font size

  // Round down the scaled font size to ensure it's an integer
  const roundedFontSize = Math.floor(scaledFontSize);

  // If maxSize is provided, return the smaller of the rounded font size or maxSize
  return Math.min(Math.max(roundedFontSize, minFontSize), maxFontSize);
};

export const getScreenWidth = getFullScreenWidth;
export const getScreenHeight = getFullScreenHeight;

export const getWindowWidth = getScreenWidth;
export const getWindowHeight = getScreenHeight;

export const modifiedScreenHeight = () => getFullScreenHeight() - (StatusBar?.currentHeight ?? Sizing.layout.x0) * (isAndroid() ? 1.5 : 1);

export const windowH = Dimensions.get('window').height;
