/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
// Mock platform helper to indicate web environment
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import CameraWeb from './Camera.web';

jest.mock('utils/platformHelper', () => ({
  isWeb: true,
  isiOS: jest.fn(() => false),
  isAndroid: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isIpad: jest.fn(() => false),
  platform: jest.fn(() => ({ OS: 'web' })),
}));

// Mock react-webcam
jest.mock('react-webcam', () => {
  const React = require('react');
  const MockWebcam = React.forwardRef(({ onUserMedia }: any, ref: any) => {
    React.useEffect(() => {
      // Use setImmediate or setTimeout to avoid state updates during render
      const timer = setTimeout(() => {
        if (onUserMedia) {
          onUserMedia();
        }
      }, 0);
      return () => clearTimeout(timer);
    }, [onUserMedia]);

    React.useImperativeHandle(ref, () => ({
      getScreenshot: () => 'mock-screenshot',
    }));

    return null;
  });
  MockWebcam.displayName = 'Webcam';
  return MockWebcam;
});

// Mock QR scanner with controllable results
let mockScanResults: any[] = [{ rawValue: 'web-scanned-code' }];
jest.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: ({ onScan }: any) => {
    const React = require('react');
    React.useEffect(() => {
      if (onScan && mockScanResults.length > 0) {
        onScan(mockScanResults);
      }
    }, [onScan]);
    return null;
  },
}));

describe('Camera Web Component', () => {
  const mockOnScan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockScanResults = [{ rawValue: 'web-scanned-code' }];
  });

  test('renders scanner mode', () => {
    const component = render(<CameraWeb isScanner onScan={mockOnScan} />);
    expect(component.toJSON()).toBeTruthy();
  });

  test('renders camera mode', () => {
    const component = render(<CameraWeb isScanner={false} onScan={mockOnScan} audio />);
    expect(component.toJSON()).toBeTruthy();
  });

  test('handles scan in scanner mode', async () => {
    render(<CameraWeb isScanner onScan={mockOnScan} />);

    await waitFor(() => {
      expect(mockOnScan).toHaveBeenCalledWith('web-scanned-code');
    });
  });

  test('handles media stream loaded', async () => {
    render(<CameraWeb isScanner={false} onScan={mockOnScan} />);

    // Wait for media stream to load and button to appear
    await waitFor(() => {
      const button = screen.queryByTestId('button-test');
      expect(button).toBeTruthy();
    });
  });

  test('handles capture button press', async () => {
    render(<CameraWeb isScanner={false} onScan={mockOnScan} />);

    // Wait for media stream to load
    await waitFor(() => {
      const button = screen.getByTestId('button-test');
      expect(button).toBeTruthy();
    });

    const button = screen.getByTestId('button-test');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnScan).toHaveBeenCalledWith('mock-screenshot');
    });
  });

  test('handles empty scan results', async () => {
    mockScanResults = [];
    render(<CameraWeb isScanner onScan={mockOnScan} />);

    // Should not call onScan with empty results
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 50);
    });
    expect(mockOnScan).not.toHaveBeenCalled();
  });

  test('snapshot test for scanner mode', () => {
    const component = render(<CameraWeb isScanner onScan={mockOnScan} />);
    expect(component).toMatchSnapshot();
  });

  test('snapshot test for camera mode', () => {
    const component = render(<CameraWeb isScanner={false} onScan={mockOnScan} />);
    expect(component).toMatchSnapshot();
  });
});
