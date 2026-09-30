import { RefObject, useEffect } from 'react';
import { Dimensions, View } from 'react-native';

export const useClickOutside = (ref: RefObject<HTMLElement | View | undefined>, callback: () => void, addEventListener = true) => {
  const handleClick = (event: any) => {
    const isWeb = typeof document !== 'undefined';
    if (isWeb && ref.current instanceof HTMLElement) {
      if (!ref.current.contains(event.target as HTMLElement)) {
        callback();
      }
    } else if (ref.current && !(event.target === ref.current)) {
      // Additional logic may be needed here for React Native
      callback();
    }
  };

  useEffect(() => {
    const isWeb = typeof document !== 'undefined';
    let dimensionListener: any;

    if (addEventListener) {
      if (isWeb) {
        document.addEventListener('click', handleClick);
      } else {
        dimensionListener = Dimensions.addEventListener('change', handleClick);
      }
    }

    return () => {
      if (isWeb) {
        document.removeEventListener('click', handleClick);
      } else if (dimensionListener) {
        dimensionListener.remove();
      }
    };
  }, [ref, callback, addEventListener]);
};
