import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Moengage from '@moengage/web-sdk';
import { VALIDATIONS, MOENGAGE } from 'const/strings';
import MoengageNotifications from './MoengageNotifications.web';

jest.mock('@moengage/web-sdk', () => ({
  initialize: jest.fn(),
  call_web_push: jest.fn(),
  track_event: jest.fn(),
}));

jest.mock('config/env', () => ({
  MOENGAGE_KEY: 'mock-key',
}));

// Mock Notification API
const mockRequestPermission = jest.fn();
global.Notification = {
  requestPermission: mockRequestPermission,
} as any;

describe('MoengageNotifications (Web)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes Moengage and tracks success when permission is granted', async () => {
    mockRequestPermission.mockResolvedValue(VALIDATIONS.GRANTED);

    render(<MoengageNotifications />);

    await waitFor(() => {
      expect(Moengage.initialize).toHaveBeenCalled();
      expect(mockRequestPermission).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(Moengage.call_web_push).toHaveBeenCalled();
      expect(Moengage.track_event).toHaveBeenCalledWith(MOENGAGE.NOTIFICATION_ENABLED, {});
      expect(Moengage.track_event).toHaveBeenCalledWith(MOENGAGE.MOENGAGE_INITIALIZED, {});
    });
  });

  test('tracks denial when permission is not granted', async () => {
    mockRequestPermission.mockResolvedValue('denied');

    render(<MoengageNotifications />);

    await waitFor(() => {
      expect(Moengage.track_event).toHaveBeenCalledWith(MOENGAGE.NOTIFICATION_DENIED, {});
    });
  });

  test('tracks permission error when requestPermission fails', async () => {
    const error = new Error('Permission failed');
    mockRequestPermission.mockRejectedValue(error);

    render(<MoengageNotifications />);

    await waitFor(() => {
      expect(Moengage.track_event).toHaveBeenCalledWith(MOENGAGE.PERMISSION_ERROR, { error: error.message });
    });
  });

  test('tracks initialization error when Moengage fails to initialize', async () => {
    const error = new Error('Init failed');
    (Moengage.initialize as jest.Mock).mockImplementation(() => {
      throw error;
    });

    render(<MoengageNotifications />);

    await waitFor(() => {
      expect(Moengage.track_event).toHaveBeenCalledWith(MOENGAGE.INITILIZATION_ERROR, { error });
    });
  });
});
