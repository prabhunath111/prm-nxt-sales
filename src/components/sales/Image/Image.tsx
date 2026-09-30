/**
 * We will use Image to load online as well as offline image
 *
 * @module components/Image
 * @memberof Common Component
 */
import React, { ReactNode, useEffect, useState } from 'react';
import { DimensionValue, Image as RNImage, ImageBackground, View } from 'react-native';
import { getCdnUri, getImage, responsiveHeight, responsiveWidth } from 'utils/imageHelper';
import { ICONS } from 'const';
import { Sizing } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import styles from './Image.styles';

/**
 * @typedef {object} ImageProps
 * @property {string} [iconName] - The name of the icon.
 * @property {boolean} [isLocal] - Flag to determine if the image is local or online.
 * @property {object} [style] - Custom styles to be applied to the image component.
 * @property {DimensionValue} [height] - The height of the image.
 * @property {DimensionValue} [width] - The width of the image.
 * @property {number} [borderRadius] - The border radius of the image.
 * @property {boolean} [isBackground] - Flag to determine if the image is used as a background.
 * @property {ReactNode} [children] - Children components or elements to be rendered within the image component.
 */
export type ImageProps = {
  iconName?: string;
  isLocal?: boolean;
  style?: object;
  height?: DimensionValue | string;
  width?: DimensionValue | string;
  borderRadius?: number;
  isBackground?: boolean;
  children?: ReactNode;
  isDimension?: boolean;
  isUrl?: boolean;
};

/**
 * Represents an Image component.
 * @component
 * @param {ImageProps} props - React properties passed from composition.
 * @returns {JSX.Element} The Image component.
 */
const Image = ({
  iconName = '',
  isLocal = false,
  isUrl = false,
  style,
  height = Sizing.layout.x5,
  width = Sizing.layout.x5,
  borderRadius = 0,
  isBackground = false,
  children,
  isDimension = true,
}: ImageProps) => {
  const [imageUrl, setImageUrl] = useState({});
  const { inflection } = useInflection();
  let imgHeight = height;
  let imgWidth = width;

  if (isDimension) {
    imgHeight = responsiveHeight(inflection, Number(imgWidth), Number(imgHeight));
    imgWidth = responsiveWidth(inflection, Number(imgWidth));
  }

  useEffect(() => {
    if (isLocal) {
      setImageUrl(getImage(iconName));
    } else if (isUrl) {
      setImageUrl({ uri: iconName });
    } else {
      setImageUrl({ uri: getCdnUri(iconName) });
    }
  }, [iconName]);

  const onError = () => {
    setImageUrl(getImage(ICONS.LOCAL_FALLBACK));
  };

  return (
    <View testID="image-test">
      {isBackground ? (
        <ImageBackground
          defaultSource={getImage(ICONS.LOCAL_DEFAULT)}
          onError={onError}
          source={imageUrl}
          style={[
            {
              height: imgHeight,
              width: imgWidth,
              borderRadius,
            },
            style,
          ]}
        >
          {children}
        </ImageBackground>
      ) : (
        <RNImage
          defaultSource={getImage(ICONS.DEFAULT)}
          onError={onError}
          source={imageUrl}
          resizeMode="contain"
          style={[
            styles.imageStyle,
            {
              height: imgHeight,
              width: imgWidth,
              borderRadius,
            },
            style,
          ]}
        />
      )}
    </View>
  );
};

export default React.memo(
  Image,
  (prevProps, nextProps) =>
    prevProps.iconName === nextProps.iconName && prevProps.height === nextProps.height && prevProps.width === nextProps.width && prevProps.isLocal === nextProps.isLocal,
);
