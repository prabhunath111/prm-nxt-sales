/**
 * This is a generic Carousel component created for React Native for Web and mobile.
 *
 * @module components/Carousel
 * @memberof - Common Carousel Component
 * @memberof CommonCarouselComponent
 */
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Animated, NativeSyntheticEvent, NativeScrollEvent, ImageResizeMode, Linking } from 'react-native';

import { getImage } from 'utils/imageHelper';
import { Sizing } from 'styles';
import { getFullScreenWidth } from 'styles/dimentionHelper';
import { ParentObject } from 'store/sales/types/common';
import { MOENGAGE } from 'const/strings';
import usePathNavigator from 'hooks/usePathNavigator';
import styles from './Carousel.styles';

/**
 * @typedef {Object} DataItem
 * @property {number} id - The unique identifier for the data item.
 * @property {string} image - The URL or source of the image to be displayed in the carousel.
 */
interface DataItem {
  id: number;
  image: string;
  children?: ReactNode;
}
/**
 * @typedef {Object} CarouselProps
 * @property {DataItem[]} data - The array of data items to be displayed in the carousel.
 * @property {number} [width] - The width of the carousel. Defaults to the full screen width.
 * @property {number} [height] - The height of the carousel.
 * @property {number} [scrollAnimationDuration] - The duration of the scroll animation in milliseconds. Defaults to a value from the Sizing module.
 */
interface CarouselProps {
  data: DataItem[];
  carouselType?: string;
  width?: number;
  height?: number;
  scrollAnimationDuration?: number;
  containerStyle?: ParentObject;
  resizeMode?: ImageResizeMode;
  paginationDotColor?: string;
  autoScroll?: boolean;
}

/**
 * A custom carousel component for React Native.
 *
 * @component
 * @param {CarouselProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered carousel component.
 */
const Carousel = ({
  data,
  width = getFullScreenWidth(),
  height = Sizing.layout.x200,
  scrollAnimationDuration = Sizing.layout.x5000,
  containerStyle,
  carouselType = 'image',
  paginationDotColor = 'white',
  resizeMode = 'cover',
  autoScroll = true,
}: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(Sizing.layout.x1);
  const scrollX = useRef(new Animated.Value(Sizing.layout.x1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const goToPath = usePathNavigator();
  useEffect(() => {
    if (!autoScroll) {
      return () => {}; // Always return something
    }

    const interval = setInterval(() => {
      const newIndex = (activeIndex + Sizing.layout.x1) % data.length;
      setActiveIndex(newIndex);
      scrollViewRef.current?.scrollTo({
        x: newIndex * width,
        animated: true,
      });
    }, scrollAnimationDuration);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, autoScroll]);

  /**
   * Handles the scroll end event to update the active index.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event - The scroll event.
   */
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(newIndex);
  };

  return (
    <View style={[styles.container, { height, width }, containerStyle]} testID="carousel-test">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={Sizing.layout.x20}
      >
        {data.map((item: ParentObject) => {
          const isClickable = !!item.deepLink;
          return (
            <View key={item.id} style={[styles.imageContainer, { height, width }]}>
              {carouselType === 'image' ? (
                <TouchableOpacity
                  activeOpacity={isClickable ? 0.9 : 1}
                  disabled={!isClickable}
                  onPress={async () => {
                    if (!item.deepLink) return;

                    const url = item.deepLink;

                    if (url.startsWith('https')) {
                      await Linking.openURL(url);
                      return;
                    }

                    const route = url.replace(MOENGAGE.DEEPLINK_URL, '').split('?')[0];

                    goToPath(route);
                  }}
                >
                  <Image
                    source={getImage(item.image)}
                    style={[
                      styles.image,
                      {
                        height: height - Sizing.layout.x30,
                        width: width - Sizing.layout.x20,
                        borderRadius: Sizing.layout.x5,
                      },
                    ]}
                    resizeMode={resizeMode}
                  />
                </TouchableOpacity>
              ) : (
                <View style={{ width: width - Sizing.layout.x20 }}>{item.children}</View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={_.id}
            onPress={() => {
              setActiveIndex(index);
              scrollViewRef.current?.scrollTo({
                x: index * width,
                animated: true,
              });
            }}
          >
            <Animated.View
              key={_.id}
              style={[
                styles.paginationDot,
                { backgroundColor: paginationDotColor },
                {
                  opacity: scrollX.interpolate({
                    inputRange: [(index - Sizing.layout.x1) * width, index * width, (index + Sizing.layout.x1) * width],
                    outputRange: [Sizing.layout.xDot5, Sizing.layout.x1, Sizing.layout.xDot5],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Carousel;
