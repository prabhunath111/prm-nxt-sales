const mockMixpanelInstance = {
  track: jest.fn(),
  identify: jest.fn(),
  alias: jest.fn(),
  reset: jest.fn(),
  flush: jest.fn(),
  people: {
    set: jest.fn(),
    setOnce: jest.fn(),
    increment: jest.fn(),
    append: jest.fn(),
    union: jest.fn(),
    remove: jest.fn(),
    unset: jest.fn(),
  },
  registerSuperProperties: jest.fn(),
  registerSuperPropertiesOnce: jest.fn(),
  clearSuperProperties: jest.fn(),
  getDistinctId: jest.fn(() => Promise.resolve('mocked_distinct_id')),
  getSuperProperties: jest.fn(() => Promise.resolve({})),
};

jest.mock('mixpanel-react-native', () => ({
  Mixpanel: {
    init: jest.fn(() => mockMixpanelInstance), // Mock init() instead of `new Mixpanel()`
  },
}));

