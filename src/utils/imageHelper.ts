import { Dimensions, PixelRatio } from 'react-native';
import { PLATFORM } from 'const';
import { Sizing } from 'styles';
import env from 'config/env';
import { LOG } from 'config/logger';
import { platform } from './platformHelper';

/**
 * Constructs a file URI based on the platform.
 * @param {string} filePath The file path.
 * @returns {string} The constructed file URI.
 */
function constructUri(filePath: string) {
  if (platform().OS === PLATFORM.ANDROID) {
    return `file://${filePath}`;
  }
  return filePath;
}

/**
 * Retrieves an image asset.
 * @param {string} name The name of the image asset.
 * @returns {string | { uri: string }} The image asset or its URI.
 */

export const getImage = (name: string) => {
  // Remote URL check
  if (name && (name.startsWith('http://') || name.startsWith('https://'))) {
    return { uri: name };
  }

  // Local assets fallback (for bundled images)
  try {
    const images = require.context('../assets', true, /\.(png|jpe?g|gif|svg|webp)$/);
    const fileKey = images.keys().find((key) => key.includes(name));
    if (fileKey) {
      const file = images(fileKey);
      if (platform().OS === 'android' || platform().OS === 'ios') {
        return file;
      }
      return { uri: constructUri(file) };
    }
  } catch (e) {
    LOG.warn('Error resolving local image:', e);
  }

  return { uri: '' };
};

export const getCdnUri = (name: string) => `${env.CDN_ASSETS_URL}${name}`;

// Define a method to calculate responsive width
export const responsiveWidth = (inflection: any, widthPercentage: number) => {
  const windowWidth = Dimensions.get('window').width;
  let finalWidth = widthPercentage;
  if (!Number.isNaN(windowWidth) && !Number.isNaN(widthPercentage)) {
    const width = (windowWidth * widthPercentage) / Sizing.layout.x100;
    finalWidth = PixelRatio.roundToNearestPixel(width);
  }

  switch (platform().OS) {
    case PLATFORM.ANDROID:
      finalWidth *= Sizing.layout.x3;
      break;
    case PLATFORM.IOS:
      finalWidth *= Sizing.layout.x3;
      break;
    case PLATFORM.WEB:
      if (inflection === 'xs' || inflection === 'sm') finalWidth *= Sizing.layout.x3;
      break;
    default:
  }
  return finalWidth;
};

export const responsiveHeight = (inflection: any, width: number, height: number) => {
  const calculateAspectRatio = width / height;
  const finalHeight = responsiveWidth(inflection, width) / calculateAspectRatio;

  return finalHeight;
};

export const toBase64 = async (filePath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fetch(`file://${filePath}`)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result?.toString().split(',')[1] || '';
          resolve(`data:image/png;base64,${base64data}`);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        reject(error);
      });
  });

export default { getImage, responsiveWidth, responsiveHeight, toBase64 };
