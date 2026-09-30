/* eslint-disable no-nested-ternary */
import { Animated } from 'react-native';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { Sizing } from 'styles';

export enum DrawerState {
  Peek = getFullScreenHeight() / Sizing.layout.x2,
  Middle = Sizing.layout.x230,
  Closed = Sizing.layout.x0,
}

export const animateMove = (y: Animated.Value, toValue: number | Animated.Value) => {
  Animated.spring(y, {
    toValue: -toValue,
    tension: 20,
    useNativeDriver: true,
  }).start();
};

export const getNextState = (currentState: DrawerState, val: number, margin: number): DrawerState => {
  switch (currentState) {
    case DrawerState.Peek:
      return val >= currentState ? DrawerState.Peek : val <= DrawerState.Middle ? DrawerState.Closed : DrawerState.Middle;
    case DrawerState.Middle:
      return val >= currentState + margin ? DrawerState.Peek : val <= DrawerState.Middle - margin ? DrawerState.Closed : DrawerState.Middle;
    case DrawerState.Closed:
      return val >= currentState + margin ? (val <= DrawerState.Middle + margin ? DrawerState.Middle : DrawerState.Peek) : DrawerState.Closed;
    default:
      return currentState;
  }
};
