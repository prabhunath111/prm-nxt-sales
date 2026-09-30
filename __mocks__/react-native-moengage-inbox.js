// __mocks__/react-native-moengage-inbox.js
const MoEReactInbox = {
  // Mock the methods and properties you use in your component
  initialize: jest.fn(),
  fetchAllMessages: jest.fn(() => Promise.resolve([])), // Example mock for fetching messages
  markAsRead: jest.fn(),
  deleteMessage: jest.fn(),
};

export default MoEReactInbox;
