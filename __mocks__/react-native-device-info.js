const mockDeviceInfo = {
  isTablet: jest.fn(() => false),
  isLandscapeSync: jest.fn(() => false),
  getVersion: jest.fn(() => '1.0.0'),
  getSystemVersion: jest.fn(() => '16.0'),
  getModel: jest.fn(() => 'mock-model'),
  getFreeDiskStorageSync: jest.fn(() => 1024),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getManufacturerSync: jest.fn(() => 'mock-manufacturer'),
  getSerialNumberSync: jest.fn(() => 'mock-serial-number'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  getSystemVersion: jest.fn(() => 'mock-system-version'),
  getVersion: jest.fn(() => 'mock-app-version'),
  isEmulatorSync: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  getReadableVersion: jest.fn(() => 'mock-readable-version'),
  getDeviceName: jest.fn(() => 'mocked-device-name'),
};

export default mockDeviceInfo;
