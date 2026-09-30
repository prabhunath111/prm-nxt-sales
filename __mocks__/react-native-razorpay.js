export default {
  open: jest.fn(() => Promise.resolve('success')),
  onExternalWalletSelection: jest.fn(),
};
