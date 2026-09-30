/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { useMediaQuery } from 'react-responsive';
import { isDesktop } from 'utils/platformHelper';
import { getWindowWidth } from 'styles/dimentionHelper';
import { BreakpointTypeKeys, OrientationType } from 'styles/webBreakpoints';

export enum BreakPoints {
  XL = 'xl', // LargeScreen (Screen Width >= 1440)
  LG = 'lg', // Desktop (Screen Width >= 1025 and ScreenWidth <= 1439)
  MD = 'md', // Tablet (Screen Width >= 661 and Screen Width <= 1024)
  MD_L = 'mdL', // Tablet (Screen Width >= 661 and Screen Width <= 1024) and Orientation = Landscape
  SM = 'sm', // Mobile (Screen Width >= 381 and Screen Width <= 660)
  XS = 'xs', // Low End Mobile (Screen Width <= 380)
}

export type InflectionProp = {
  inflection: 'xl' | 'lg' | 'md' | 'mdL' | 'sm' | 'xs' | undefined;
};

type InflectionProviderProps = {
  children?: any;
};

type InflectionContextType = {
  inflection: BreakpointTypeKeys;
  orientation: OrientationType | undefined;
};

const defaultValue = {
  inflection: undefined,
  orientation: undefined,
};

export const InflectionContext = React.createContext<InflectionContextType>(defaultValue);

const InflectionProvider: React.FC<InflectionProviderProps> = ({ children }: InflectionProviderProps) => {
  const dim = Dimensions.get('window');
  const [windowWidth, setWindowWidth] = useState(dim.width);
  const [windowHeight, setWindowHeight] = useState(dim.height);
  const userAgent: string = navigator?.userAgent?.toLowerCase() ?? '';
  const isIpad = userAgent.includes('ipad') || (userAgent.includes('macintosh') && 'ontouchend' in document);
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
  const isLowEndMobileScreen = useMediaQuery({ maxWidth: 380 });
  const isMobileScreen = useMediaQuery({ minWidth: 381, maxWidth: 660 });
  const isTabletScreen = useMediaQuery({ minWidth: 661, maxWidth: 1024 });
  const isDesktopScreen = useMediaQuery({ minWidth: 1025, maxWidth: 1439 });
  const isLargeScreen = useMediaQuery({ minWidth: 1440 });

  useEffect(() => {
    const subscription: any = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });
    return () => subscription?.remove();
  });

  const getOrientation = () => (windowHeight >= windowWidth ? 'portrait' : 'landscape');

  /**
   * @returns xs = Low End Mobile | sm = Mobile | md = Tablet | mdL = Tablet Landscape | lg = Desktop
   */
  const getInflection = () => {
    switch (true) {
      case isLowEndMobileScreen:
        return BreakPoints.XS;
      case isMobileScreen:
        return BreakPoints.SM;
      case isTabletScreen:
        if ((isTablet || isIpad) && getOrientation() === 'landscape') {
          return BreakPoints.MD_L;
        }
        return BreakPoints.MD;
      case isDesktopScreen:
        if ((isTablet || isIpad) && getOrientation() === 'landscape') {
          return BreakPoints.MD_L;
        }
        return BreakPoints.LG;
      case isLargeScreen:
        return BreakPoints.XL;
      default:
        if (getWindowWidth() <= 380) {
          return BreakPoints.XS;
        }
        if (getWindowWidth() > 380 && getWindowWidth() <= 660) {
          return BreakPoints.SM;
        }
        if (getWindowWidth() > 660 && getWindowWidth() <= 1024) {
          if ((isTablet || isIpad) && getOrientation() === 'landscape') {
            return BreakPoints.MD_L;
          }
          return BreakPoints.MD;
        }
        if (getWindowWidth() > 1024 && getWindowWidth() <= 1439) {
          if ((isTablet || isIpad) && getOrientation() === 'landscape') {
            return BreakPoints.MD_L;
          }
          return BreakPoints.LG;
        }
        if (getWindowWidth() >= 1440) {
          return BreakPoints.LG;
        }
        return undefined;
    }
  };

  const contextValues: InflectionContextType = useMemo(() => ({ inflection: getInflection(), orientation: getOrientation() }), [getInflection(), getOrientation()]);

  return isDesktop ? <InflectionContext.Provider value={contextValues}>{children}</InflectionContext.Provider> : <>{children}</>;
};

export const useInflection = () => React.useContext(InflectionContext);

export default InflectionProvider;
