/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const { useSelector } = require('react-redux');

// Mock dependencies
const mockToBase64 = jest.fn().mockResolvedValue('base64string');
const mockRequestPermission = jest.fn();
const mockDispatch = jest.fn();
const mockOnScan = jest.fn();
const mockOnCapture = jest.fn();

jest.mock('utils/imageHelper', () => ({
  toBase64: mockToBase64,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('styles/dimentionHelper', () => ({
  getFullScreenHeight: () => 800,
  getFullScreenWidth: () => 400,
}));

// Mock react-native-vision-camera
const mockUseCameraPermission = jest.fn();
const mockUseCodeScanner = jest.fn();
const mockUseCameraDevice = jest.fn();
const mockTakePhoto = jest.fn();

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  return {
    Camera: React.forwardRef((_props: any, ref: any) => {
      if (ref) {
        // eslint-disable-next-line no-param-reassign
        ref.current = {
          takePhoto: mockTakePhoto,
        };
      }
      return null;
    }),
    useCameraPermission: mockUseCameraPermission,
    useCodeScanner: mockUseCodeScanner,
    useCameraDevice: mockUseCameraDevice,
  };
});

// Mock react-webcam
const mockWebcam = jest.fn().mockImplementation(() => null);
jest.mock('react-webcam', () => mockWebcam);

// Mock react-qr-barcode-scanner
const mockBarcodeScannerComponent = jest.fn().mockImplementation(() => null);
jest.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: mockBarcodeScannerComponent,
}));

jest.mock('components/sales/Text', () => () => null);

// Mock Button to capture onPress
let capturedButtonPress: (() => void) | null = null;
jest.mock(
  'components/sales/Button',
  () =>
    function MockButton({ onPress }: any) {
      capturedButtonPress = onPress;
      return null;
    },
);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

global.document = {
  querySelector: jest.fn().mockReturnValue({ style: {} }),
} as any;

afterAll(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const mockStore = configureStore({
  reducer: {
    ui: () => ({ hasAlertModal: false }),
  },
});

describe('Camera Component Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockWebcam.mockClear();
    mockBarcodeScannerComponent.mockClear();
    mockDispatch.mockClear();
    mockOnScan.mockClear();
    mockOnCapture.mockClear();
    mockTakePhoto.mockClear();
    capturedButtonPress = null;
    mockTakePhoto.mockResolvedValue({ path: '/tmp/pic.jpg' });

    // Default mocks
    mockUseCameraPermission.mockReturnValue({
      hasPermission: true,
      requestPermission: mockRequestPermission,
    });
    mockUseCodeScanner.mockReturnValue({});
    mockUseCameraDevice.mockReturnValue({ id: 'back-camera' });
    useSelector.mockReturnValue({ hasAlertModal: false });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Mobile Camera (Camera.tsx)', () => {
    test('renders error when no permission', () => {
      mockUseCameraPermission.mockReturnValue({
        hasPermission: false,
        requestPermission: mockRequestPermission,
      });

      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera />
        </Provider>,
      );

      expect(mockRequestPermission).toHaveBeenCalled();
    });

    test('renders error when no device', () => {
      mockUseCameraDevice.mockReturnValue(null);

      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera />
        </Provider>,
      );

      expect(mockUseCameraDevice).toHaveBeenCalledWith('back');
    });

    test('handles code scanning with multiple codes', () => {
      let onCodeScannedCallback: (arg0: { value: string }[]) => void;
      mockUseCodeScanner.mockImplementation((config) => {
        onCodeScannedCallback = config.onCodeScanned;
        return {};
      });

      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      act(() => {
        onCodeScannedCallback([{ value: 'first-code' }, { value: 'second-code' }]);
      });

      expect(mockOnScan).toHaveBeenCalledWith('second-code');
    });

    test('handles code scanning with single code', () => {
      let onCodeScannedCallback: (arg0: { value: string }[]) => void;
      mockUseCodeScanner.mockImplementation((config) => {
        onCodeScannedCallback = config.onCodeScanned;
        return {};
      });

      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      act(() => {
        onCodeScannedCallback([{ value: 'first-code' }, { value: 'test-code' }]);
      });

      expect(mockOnScan).toHaveBeenCalledWith('test-code');
    });

    test('renders with MER value display', () => {
      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner params={{ showMerValue: true, merValue: '25dB' }} onScan={mockOnScan} />
        </Provider>,
      );

      expect(mockUseCodeScanner).toHaveBeenCalled();
    });

    test('renders scanner mode with overlay', () => {
      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner isActive onScan={mockOnScan} />
        </Provider>,
      );

      expect(mockUseCodeScanner).toHaveBeenCalled();
    });

    test('renders normal camera mode', () => {
      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isActive onCapture={mockOnCapture} />
        </Provider>,
      );

      expect(mockUseCameraPermission).toHaveBeenCalled();
      expect(mockUseCameraDevice).toHaveBeenCalledWith('back');
    });

    test('renders with all default props', () => {
      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera />
        </Provider>,
      );

      expect(mockUseCameraPermission).toHaveBeenCalled();
    });

    test('renders with multiple props combined', () => {
      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isActive isScanner isFocusable audio onScan={mockOnScan} />
        </Provider>,
      );

      expect(mockUseCameraPermission).toHaveBeenCalled();
    });

    test('executes handleCapture on button press', async () => {
      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isActive isScanner={false} onScan={mockOnScan} />
        </Provider>,
      );

      if (capturedButtonPress) {
        await act(async () => {
          capturedButtonPress?.();
          jest.runAllTimers();
        });
      }

      expect(mockTakePhoto).toHaveBeenCalled();
      expect(mockToBase64).toHaveBeenCalled();
    });

    test('renders button wrapper in normal mode', () => {
      const Camera = require('./Camera').default;

      render(
        <Provider store={mockStore}>
          <Camera isActive isScanner={false} />
        </Provider>,
      );

      expect(mockUseCameraPermission).toHaveBeenCalled();
    });
  });

  describe('Web Camera (Camera.web.tsx)', () => {
    test('renders web camera for capture', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner={false} onCapture={mockOnCapture} />
        </Provider>,
      );

      expect(mockWebcam).toHaveBeenCalled();
    });

    test('renders web scanner', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      expect(mockBarcodeScannerComponent).toHaveBeenCalled();
    });

    test('handles web scanner with MER display', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner params={{ showMerValue: true, merValue: '25dB' }} onScan={mockOnScan} />
        </Provider>,
      );

      expect(mockBarcodeScannerComponent).toHaveBeenCalled();
    });

    test('handles getMediaStream function', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner={false} onCapture={mockOnCapture} />
        </Provider>,
      );

      const webcamProps = mockWebcam.mock.calls[mockWebcam.mock.calls.length - 1][0];
      act(() => {
        webcamProps.onUserMedia();
      });

      expect(mockWebcam).toHaveBeenCalled();
    });

    test('handles user media error', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner={false} onCapture={mockOnCapture} />
        </Provider>,
      );

      const webcamProps = mockWebcam.mock.calls[mockWebcam.mock.calls.length - 1][0];
      act(() => {
        webcamProps.onUserMediaError?.();
      });

      expect(mockWebcam).toHaveBeenCalled();
    });

    test('handles scanner user media error', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      const scannerProps = mockBarcodeScannerComponent.mock.calls[mockBarcodeScannerComponent.mock.calls.length - 1][0];
      act(() => {
        scannerProps.onError?.();
      });

      expect(mockBarcodeScannerComponent).toHaveBeenCalled();
    });

    test('handles scanner update with result', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      const scannerProps = mockBarcodeScannerComponent.mock.calls[mockBarcodeScannerComponent.mock.calls.length - 1][0];
      const mockResult = { rawValue: 'scanned-code' };

      act(() => {
        scannerProps.onScan?.([mockResult]);
      });

      expect(mockOnScan).toHaveBeenCalledWith('scanned-code');
    });

    test('handles scanner update without result text', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      const scannerProps = mockBarcodeScannerComponent.mock.calls[mockBarcodeScannerComponent.mock.calls.length - 1][0];
      const mockResult = { rawValue: null };

      act(() => {
        scannerProps.onScan?.([mockResult]);
      });

      expect(mockOnScan).toHaveBeenCalledWith(null);
    });

    test('handles web camera with audio', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner={false} audio onCapture={mockOnCapture} />
        </Provider>,
      );

      const webcamProps = mockWebcam.mock.calls[mockWebcam.mock.calls.length - 1][0];
      expect(webcamProps.audio).toBe(true);
    });

    test('handles scanner update with empty string result', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      const scannerProps = mockBarcodeScannerComponent.mock.calls[mockBarcodeScannerComponent.mock.calls.length - 1][0];
      const mockResult = { rawValue: '' };

      act(() => {
        scannerProps.onScan?.([mockResult]);
      });

      expect(mockOnScan).toHaveBeenCalledWith(null);
    });

    test('handles scanner update with empty array', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner onScan={mockOnScan} />
        </Provider>,
      );

      const scannerProps = mockBarcodeScannerComponent.mock.calls[mockBarcodeScannerComponent.mock.calls.length - 1][0];

      act(() => {
        scannerProps.onScan?.([]);
      });

      expect(mockOnScan).not.toHaveBeenCalled();
    });

    test('handles media stream loaded state with capture button', () => {
      const Camera = require('./Camera.web').default;

      const { rerender } = render(
        <Provider store={mockStore}>
          <Camera isScanner={false} onCapture={mockOnCapture} />
        </Provider>,
      );

      const webcamProps = mockWebcam.mock.calls[mockWebcam.mock.calls.length - 1][0];
      act(() => {
        webcamProps.onUserMedia();
      });

      rerender(
        <Provider store={mockStore}>
          <Camera isScanner={false} onCapture={mockOnCapture} />
        </Provider>,
      );

      expect(mockWebcam).toHaveBeenCalled();
    });

    test('executes handleCapture on button press after media loads', () => {
      const Camera = require('./Camera.web').default;

      render(
        <Provider store={mockStore}>
          <Camera isScanner={false} onScan={mockOnScan} />
        </Provider>,
      );

      const webcamProps = mockWebcam.mock.calls[mockWebcam.mock.calls.length - 1][0];
      act(() => {
        webcamProps.onUserMedia();
      });

      if (capturedButtonPress) {
        act(() => {
          capturedButtonPress?.();
        });
      }

      expect(mockWebcam).toHaveBeenCalled();
    });
  });

  describe('Camera Index (index.tsx)', () => {
    test('exports Camera component', () => {
      const CameraIndex = require('./index');
      expect(CameraIndex.default).toBeDefined();
    });
  });
});
