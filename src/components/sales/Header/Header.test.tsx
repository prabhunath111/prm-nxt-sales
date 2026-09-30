/* eslint-disable camelcase */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { Pressable } from 'react-native';
import actions from 'store/sales/actions/ui';
import { handleLangSlectorModal } from 'store/sales/actions/ui/ui.action';
import { ROUTE, ICONS } from 'const';
import Header from './Header';

// Mock Image to include testID for identification
jest.mock('components/sales/Image', () => {
  const { View } = jest.requireActual('react-native');
  // eslint-disable-next-line react/destructuring-assignment
  return (props: any) => <View testID={`image-${props.iconName}`} />;
});

// Mock DetailsHeader to avoid side effects
jest.mock('components/sales/DetailsHeader', () => {
  const { View } = jest.requireActual('react-native');
  return () => <View testID="details-header" />;
});

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => () => ({
  navigate: mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector({ ui: { isDrawerOpen: false } }),
}));

jest.mock('store/sales/actions/ui', () => ({
  toggleDrawer: jest.fn((val) => ({ type: 'TOGGLE_DRAWER', payload: val })),
}));

jest.mock('store/sales/actions/ui/ui.action', () => ({
  handleLangSlectorModal: jest.fn((val) => ({ type: 'LANG_MODAL', payload: val })),
}));

describe('Header Component (Native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockStore = configureStore({
    reducer: {
      ui: (state = { isDrawerOpen: false }) => state,
    },
  });

  const renderHeader = () =>
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <Header />
        </NavigationContainer>
      </Provider>,
    );

  test('renders correctly', () => {
    renderHeader();
    expect(screen.getByTestId('header-test-container')).toBeTruthy();
    expect(screen.getByText('mSales')).toBeTruthy();
  });

  test('toggles drawer on profile press', () => {
    const { UNSAFE_getAllByType } = renderHeader();
    const pressables = UNSAFE_getAllByType(Pressable);
    fireEvent.press(pressables[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actions.toggleDrawer(true));
  });

  test('opens language modal on language icon press', () => {
    renderHeader();
    const langImage = screen.getByTestId(`image-${ICONS.LANGUAGE_BLACK}`);
    // The Pressable is the parent of the Image
    fireEvent.press(langImage.parent as any);
    expect(mockDispatch).toHaveBeenCalledWith(handleLangSlectorModal(true));
  });

  test('navigates to notifications on bell icon press', () => {
    renderHeader();
    const bellImage = screen.getByTestId(`image-${ICONS.BELL}`);
    fireEvent.press(bellImage.parent as any);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.NOTIFICATIONS);
  });

  test('snapshot test', () => {
    const component = renderHeader();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
