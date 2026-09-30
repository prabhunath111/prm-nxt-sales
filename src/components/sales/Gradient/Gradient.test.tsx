/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import Gradient from './Gradient';

// Mock utils/platformHelper for isWeb
jest.mock('utils/platformHelper', () => ({
  get isWeb() {
    return (global as any).isWebMock ?? false;
  },
  isiOS: () => false,
  isAndroid: () => true,
}));

// Mock LinearGradient for native
jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => <View {...props}>{props.children}</View>;
});

describe('Gradient Component', () => {
  beforeEach(() => {
    (global as any).isWebMock = false;
    jest.clearAllMocks();
  });

  test('renders native LinearGradient by default', () => {
    render(
      <Gradient colors={['#000', '#fff']} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View testID="child" />
      </Gradient>,
    );
    const gradient = screen.getByTestId('gradient-test');
    expect(gradient).toBeTruthy();
    expect(screen.getByTestId('child')).toBeTruthy();

    // Verify props are passed (since it's mocked as a View)
    expect(gradient.props.colors).toEqual(['#000', '#fff']);
    expect(gradient.props.locations).toEqual([0, 1]);
  });

  test('renders web View with backgroundImage when isWeb is true', () => {
    (global as any).isWebMock = true;
    const { toJSON } = render(
      <Gradient colors={['#000', '#fff']} direction="to right" style={{ padding: 10 }}>
        <View testID="web-child" />
      </Gradient>,
    );

    const json: any = toJSON();
    expect(json.props.style).toMatchObject({
      backgroundImage: 'linear-gradient(to right, #000,#fff)',
      padding: 10,
    });
  });

  test('uses default direction for web when not provided', () => {
    (global as any).isWebMock = true;
    const { toJSON } = render(<Gradient colors={['#f00', '#00f']} />);
    const json: any = toJSON();
    expect(json.props.style.backgroundImage).toContain('linear-gradient(to bottom');
  });

  test('handles missing start/end props on native with defaults', () => {
    (global as any).isWebMock = false;
    render(<Gradient colors={['#000', '#fff']} />);
    const gradient = screen.getByTestId('gradient-test');
    expect(gradient.props.start).toEqual({ x: 0, y: 0 });
    expect(gradient.props.end).toEqual({ x: 1, y: 1 });
  });
});
