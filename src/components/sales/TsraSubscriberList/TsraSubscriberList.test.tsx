import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import * as reactRedux from 'react-redux';
import { store } from 'store';
import { QUERY, ROUTE } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import TsraSubscriberList from './TsraSubscriberList';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('utils/imageHelper', () => ({
  getImage: jest.fn(() => 'mockedImagePath'),
  responsiveHeight: jest.fn(() => 100),
  responsiveWidth: jest.fn(() => 200),
  getCdnUri: jest.fn(() => 'mockedCdnPath'),
}));

describe('Test for the component TsraSubscriberList', () => {
  const mockDispatch = jest.fn();
  const mockSubscriberList = [
    {
      partnerCode: 'P123',
      name: 'Test Partner',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        tsraLifeCycle: {
          tsraSubscriberList: mockSubscriberList,
        },
      }),
    );
  });

  test('render component TsraSubscriberList', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraSubscriberList />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('tsraSubscriberListTest')).toBeTruthy();
  });

  test('handles press on subscriber item', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraSubscriberList />
        </NavigationContainer>
      </Provider>,
    );

    const card = screen.getByTestId('action-tile-card');
    fireEvent.press(card);

    expect(callAction).toHaveBeenCalledWith({ partnerCode: mockSubscriberList[0].partnerCode }, QUERY.GetTsraPartnerDetails);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE.WEB.UPDATE_TSRA_ACTION);
  });

  test('snapshot tests for TsraSubscriberList', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <TsraSubscriberList />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
