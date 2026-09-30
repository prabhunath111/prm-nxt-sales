import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { store } from 'store';
import { Linking } from 'react-native';
import TrainingModule from './TrainingModule';

jest.mock('utils/platformHelper', () => ({
  isDesktop: false,
  isiOS: jest.fn(() => false),
  isAndroid: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isWeb: false,
  platform: jest.fn(() => ({ OS: 'ios' })),
}));

jest.mock('react-native-gesture-handler', () => {
  const { View } = jest.requireActual('react-native');
  return {
    ScrollView: View,
    GestureHandlerRootView: View,
  };
});

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock('utils/navigationHelper', () => ({
  handleWebViewUrl: jest.fn(),
}));

jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({
    inflection: 'xs',
  }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    MD_L: 'mdL',
    SM: 'sm',
    XS: 'xs',
  },
}));

const mockState = {
  ui: {
    isLoading: false,
  },
  packageInformation: {
    packageInformation: {
      userGuidePDF: [{ linkName: 'User Guide 1', linkURL: 'https://example.com/guide1' }],
      trainingVideo: [{ linkName: 'Video 1', linkURL: 'https://example.com/video1' }],
    },
  },
};

const renderComponent = () =>
  render(
    <Provider store={store}>
      <NavigationContainer>
        <TrainingModule />
      </NavigationContainer>
    </Provider>,
  );

describe('TrainingModule', () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) => cb(mockState));
    jest.clearAllMocks();
  });

  it('renders TrainingModule with User Guide tab by default', () => {
    const { getByText } = renderComponent();

    expect(getByText('strings.userGuide')).toBeTruthy();
    expect(getByText('User Guide 1')).toBeTruthy();
  });

  it('switches to Training Video tab on press', () => {
    const { getByText } = renderComponent();

    fireEvent.press(getByText('strings.trainingVideo'));

    expect(getByText('Video 1')).toBeTruthy();
  });

  it('calls handleWebViewUrl and opens WebView on item click', async () => {
    (handleWebViewUrl as jest.Mock).mockResolvedValue('https://example.com/guide1');

    const { getByText, queryByTestId } = renderComponent();

    fireEvent.press(getByText('User Guide 1'));

    await waitFor(() => {
      expect(handleWebViewUrl).toHaveBeenCalledWith('https://example.com/guide1');
      expect(queryByTestId('training-webview')).toBeTruthy();
    });
  });

  it('shows empty state when no data is available', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: false },
        packageInformation: { packageInformation: null },
      }),
    );

    const { getByText } = renderComponent();

    expect(getByText('strings.emptyFaqCollection')).toBeTruthy();
  });

  it('shows alert when item URL is empty', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: false },
        packageInformation: {
          packageInformation: {
            userGuidePDF: [{ linkName: 'Guide', linkURL: '' }],
          },
        },
      }),
    );

    const { getByText } = renderComponent();
    fireEvent.press(getByText('Guide'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('shows alert when item URL is null', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: false },
        packageInformation: {
          packageInformation: {
            userGuidePDF: [{ linkName: 'Guide Null', linkURL: null }],
          },
        },
      }),
    );

    const { getByText } = renderComponent();
    fireEvent.press(getByText('Guide Null'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('opens MP4 file with Linking.openURL', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: false },
        packageInformation: {
          packageInformation: {
            trainingVideo: [{ linkName: 'Video MP4', linkURL: 'https://example.com/video.mp4' }],
          },
        },
      }),
    );

    const { getByText, getByTestId } = renderComponent();
    fireEvent.press(getByText('strings.trainingVideo'));
    fireEvent.press(getByTestId('training-item-0'));

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://example.com/video.mp4');
    });
  });

  it('opens PDF file with Linking.openURL', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: false },
        packageInformation: {
          packageInformation: {
            userGuidePDF: [{ linkName: 'Guide PDF', linkURL: 'https://example.com/guide.pdf' }],
          },
        },
      }),
    );

    const { getByText } = renderComponent();
    fireEvent.press(getByText('Guide PDF'));

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://example.com/guide.pdf');
    });
  });

  it('dispatches getPackageInformation on component mount', () => {
    renderComponent();

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renders back button and navigates on press', () => {
    const { getByText } = renderComponent();

    const backButton = getByText('strings.back');
    expect(backButton).toBeTruthy();
    fireEvent.press(backButton);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: true },
        packageInformation: {
          packageInformation: {
            userGuidePDF: [{ linkName: 'User Guide 1', linkURL: 'https://example.com/guide1' }],
          },
        },
      }),
    );

    const { getByText } = renderComponent();
    expect(getByText('User Guide 1')).toBeTruthy();
  });

  it('renders multiple items in tab content', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: false },
        packageInformation: {
          packageInformation: {
            userGuidePDF: [
              { linkName: 'Guide 1', linkURL: 'https://example.com/guide1' },
              { linkName: 'Guide 2', linkURL: 'https://example.com/guide2' },
            ],
            trainingVideo: [],
          },
        },
      }),
    );

    const { getByText } = renderComponent();
    expect(getByText('Guide 1')).toBeTruthy();
    expect(getByText('Guide 2')).toBeTruthy();
  });

  it('switches back to User Guide tab from Training Video', () => {
    const { getByText } = renderComponent();

    fireEvent.press(getByText('strings.trainingVideo'));
    expect(getByText('Video 1')).toBeTruthy();

    fireEvent.press(getByText('strings.userGuide'));
    expect(getByText('User Guide 1')).toBeTruthy();
  });

  it('handles empty training video data', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((cb) =>
      cb({
        ui: { isLoading: false },
        packageInformation: {
          packageInformation: {
            userGuidePDF: [{ linkName: 'User Guide 1', linkURL: 'https://example.com/guide1' }],
            trainingVideo: null,
          },
        },
      }),
    );

    const { getByText, queryByTestId } = renderComponent();
    fireEvent.press(getByText('strings.trainingVideo'));

    expect(queryByTestId('training-item-0')).toBeNull();
  });

  it('matches snapshot', () => {
    const tree = renderComponent().toJSON();
    expect(tree).toMatchSnapshot();
  });
});
