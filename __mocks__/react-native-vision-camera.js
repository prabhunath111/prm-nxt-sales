const mockedUseCameraPermission = jest.fn(() => ({
  status: 'authorized', // or 'denied', 'not-determined', etc., depending on the test scenario
  requestPermission: jest.fn(() => Promise.resolve({ status: 'authorized' })),
}));

const mockedUseCodeScanner = jest.fn(() => ({
  scanResult: null,
  isScanning: false,
  startScanning: jest.fn(),
  stopScanning: jest.fn(),
}));

const mockedUseCameraDevice = jest.fn(() => ({
  devices: [{ id: '1', type: 'wide-angle' }],
  selectedDevice: { id: '1', type: 'wide-angle' },
}));

const mockedCameraComponent = jest.fn(() => 'MockedCamera');

module.exports = {
  useCameraPermission: mockedUseCameraPermission,
  useCodeScanner: mockedUseCodeScanner,
  useCameraDevice: mockedUseCameraDevice,
  Camera: mockedCameraComponent,
};
