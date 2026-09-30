/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { isWeb } from 'utils/platformHelper';

/**
 * Cross-platform focus-aware hook.
 * On mobile, uses `useFocusEffect`; on web, uses `useEffect`.
 */
export function usePlatformFocusEffect(callback: () => void | (() => void), deps: any[] = []) {
  if (isWeb) {
    useEffect(callback, deps);
  } else {
    useFocusEffect(useCallback(callback, deps));
  }
}
