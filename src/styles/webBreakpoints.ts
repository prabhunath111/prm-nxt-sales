import { BreakPoints } from 'wrappers/inflection/InflectionProvider';
import { isDesktop } from 'utils/platformHelper';

export type BreakpointTypeKeys = 'xl' | 'lg' | 'md' | 'mdL' | 'sm' | 'xs' | undefined;
export type OrientationType = 'landscape' | 'portrait';

export type BreakpointObject<T> = {
  xl?: T;
  lg?: T;
  md?: T;
  mdL?: T;
  sm?: T;
  xs?: T;
  desktop?: T;
  tablet?: T;
  mobile?: T;
  default?: T;
};

/**
 * @name getCurrentInflectionValue
 * @param offset Style name
 * @param screen Screen name to get from Inflection Provider
 * @param keys If multiple screens are using same styles, then pass screen names with underscore
 * @returns Style name and screen to target
 */

export type OrientationObject<T> = {
  landscape?: T;
  portrait?: T;
};

const matchBreakPoint = (breakpoint: string) => (inflection?: string) => isDesktop && inflection === breakpoint;
export const isXL = matchBreakPoint(BreakPoints.XL);
export const isLG = matchBreakPoint(BreakPoints.LG);
export const isMD = matchBreakPoint(BreakPoints.MD);
export const isMDL = matchBreakPoint(BreakPoints.MD_L);
export const isSM = matchBreakPoint(BreakPoints.SM);
export const isXS = matchBreakPoint(BreakPoints.XS);
export const isMobileScreen = (inflection?: string) => isSM(inflection) || isXS(inflection);
export const isTabletScreen = (inflection?: string) => isMD(inflection) || isMDL(inflection);
export const isLargeScreen = (inflection?: string) => isLG(inflection) || isXL(inflection);
export const isLandscape = (orientation: OrientationType) => isDesktop && orientation === 'landscape';
export const isPortrait = (orientation: OrientationType) => isDesktop && orientation === 'portrait';

export const getBreakpointValue = (breakpoint: BreakpointTypeKeys, breakpointObj: BreakpointObject<any>, defaultValue?: any) => {
  if (isDesktop && breakpoint !== undefined) {
    if (breakpoint in breakpointObj) {
      return breakpointObj[breakpoint];
    }
    switch (true) {
      case isMobileScreen(breakpoint) && 'mobile' in breakpointObj:
        return breakpointObj.mobile;
      case isTabletScreen(breakpoint) && 'tablet' in breakpointObj:
        return breakpointObj.tablet;
      case isLargeScreen(breakpoint) && 'desktop' in breakpointObj:
        return breakpointObj.desktop;
      case 'default' in breakpointObj:
        return breakpointObj.default;
      default:
        return undefined;
    }
  } else if (!isDesktop && defaultValue) {
    return defaultValue;
  } else {
    return undefined;
  }
};

export const getOrientationValue = (orientation: OrientationType, orientationObj: OrientationObject<any>, defaultValue?: any) => {
  if (isDesktop && orientation in orientationObj) {
    return orientationObj[orientation];
  }
  return defaultValue;
};

/**
 * @name getCurrentInflectionStyle
 * @param offset Style name
 * @param screen Screen name to get from Inflection Provider
 * @param mergeStyles If overriding existing style pass true, else pass false
 * @param keys If multiple screens are using same styles, then pass screen names with underscore
 * @returns Style name and screen to target
 */
export const gcs = (offset: string, screen?: string, mergeStyles?: boolean, keys?: string[] | string): any => {
  if (isDesktop) {
    if (screen === 'all') {
      return `${offset}_all`;
    }
    if (typeof keys === 'undefined' && screen) {
      return `${offset}_${screen}`;
    }
    if (typeof keys === 'object' && screen) {
      let matchedKey = '';
      keys.forEach((key: string) => {
        if (key.includes(screen)) {
          matchedKey = key;
        }
      });
      if (matchedKey !== '') {
        return `${offset}_${matchedKey}`;
      }
      return `${offset}_${screen}`;
    }
    if (typeof keys === 'string' && screen) {
      if (keys.includes(screen)) {
        return `${offset}_${keys}`;
      }
      return `${offset}_${screen}`;
    }
    return offset;
  }
  return mergeStyles ? undefined : offset;
};
