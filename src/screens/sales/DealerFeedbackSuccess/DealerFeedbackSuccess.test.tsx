/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import useNavigate from 'hooks/useNavigate';
import { ROUTE } from 'const';
import DealerFeedbackSuccess from './DealerFeedbackSuccess';

// Mocking dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => jest.fn());

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'mockedStyle'),
}));

jest.mock('components/sales', () => {
  const { View, Text, Pressable } = require('react-native');
  return {
    Button: (props: any) => (
      <View testID="button-test" {...props}>
        <Pressable testID="inner-pressable" onPress={props.onPress} />
      </View>
    ),
    Image: () => <View testID="image-test" />,
    InformationText: (props: any) => (
      <View testID="info-text-test">
        <Text>{props.primaryText}</Text>
        <Text>{props.secondaryText}</Text>
      </View>
    ),
    Text: (props: any) => <Text {...props}>{props.children || props.label}</Text>,
  };
});

describe('DealerFeedbackSuccess', () => {
  const mockNavigate = jest.fn();
  const mockGoHome = jest.fn();
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as unknown as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goHome: mockGoHome,
    });
    (useTranslation as unknown as jest.Mock).mockReturnValue({ t: mockT });
    (useInflection as unknown as jest.Mock).mockReturnValue({ inflection: {} });
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        dealerFeedback: {
          feedbackSuccessData: {
            message: 'Feedback Success Message',
            feedbackId: 'FB123',
          },
        },
        user: {
          isRedirection: false,
        },
      }),
    );
  });

  test('should render correctly with feedback success data', () => {
    const { getByText } = render(<DealerFeedbackSuccess />);
    expect(getByText('Feedback Success Message')).toBeTruthy();
    expect(getByText('FB123')).toBeTruthy();
  });

  test('should navigate to RAISE_DEALER_FEEDBACK when "Raise another feedback" is pressed', () => {
    const { getByText } = render(<DealerFeedbackSuccess />);
    const raiseFeedbackText = getByText('strings.raiseDealerFeedback');
    fireEvent.press(raiseFeedbackText);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.RAISE_DEALER_FEEDBACK);
  });

  test('should navigate to TRACK_DEALER_FEEDBACK when "Track feedback" is pressed', () => {
    const { getByText } = render(<DealerFeedbackSuccess />);
    const trackFeedbackText = getByText('strings.trackDealerFeedback');
    fireEvent.press(trackFeedbackText);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.TRACK_DEALER_FEEDBACK);
  });

  test('should call goHome when back to home button is pressed', () => {
    const { getByTestId } = render(<DealerFeedbackSuccess />);
    const pressable = getByTestId('inner-pressable');
    fireEvent.press(pressable);
    expect(mockGoHome).toHaveBeenCalledWith(false);
  });

  test('should call goHome with isRedirection true when state is true', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        dealerFeedback: {
          feedbackSuccessData: {
            message: 'Feedback Success Message',
            feedbackId: 'FB123',
          },
        },
        user: {
          isRedirection: true,
        },
      }),
    );
    const { getByTestId } = render(<DealerFeedbackSuccess />);
    const pressable = getByTestId('inner-pressable');
    fireEvent.press(pressable);
    expect(mockGoHome).toHaveBeenCalledWith(true);
  });
});
