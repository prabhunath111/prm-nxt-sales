/* eslint-disable default-param-last */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import IconWithCount from './IconWithCount';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockCallAction = jest.fn((_params: any, _queryName?: any) => ({ type: 'CALL_ACTION' }));
jest.mock('utils/formBuilderHelper', () => ({
  callAction: (params: any, queryName: any) => mockCallAction(params, queryName),
}));

jest.mock('components/sales/Image', () => ({ iconName }: any) => {
  const { View } = require('react-native');
  return <View testID={`image-${iconName || 'default'}`} />;
});

jest.mock('components/sales/Text', () => ({ children }: any) => {
  const { Text } = require('react-native');
  return <Text testID="count-text">{children}</Text>;
});

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'XL' }),
  BreakPoints: { XL: 'XL', LG: 'LG', MD: 'MD', MD_L: 'MD_L', SM: 'SM', XS: 'XS' },
}));

// ── Store factory ──────────────────────────────────────────────────────────────

const makeStore = (filterCount: string | undefined = undefined) =>
  configureStore({
    reducer: {
      tsraInventory: (state = { filterCount }) => state,
    },
  });

const renderComponent = (props: any = {}, filterCount?: string) => {
  const store = makeStore(filterCount);
  return render(
    <Provider store={store}>
      <IconWithCount {...props} />
    </Provider>,
  );
};

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('IconWithCount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the Pressable container with correct testID', () => {
      renderComponent();
      expect(screen.getByTestId('iconWithCountTest')).toBeTruthy();
    });

    it('renders Image with the given iconName', () => {
      renderComponent({ iconName: 'STORE_DASHBOARD' });
      expect(screen.getByTestId('image-STORE_DASHBOARD')).toBeTruthy();
    });

    it('renders Image with default when iconName is not provided', () => {
      renderComponent({});
      expect(screen.getByTestId('image-default')).toBeTruthy();
    });

    it('shows count badge when showCount is false (default)', () => {
      renderComponent({ count: '5' });
      expect(screen.getByTestId('count-text')).toBeTruthy();
    });

    it('hides count badge when showCount is true', () => {
      renderComponent({ showCount: true });
      expect(screen.queryByTestId('count-text')).toBeNull();
    });
  });

  describe('Count display logic', () => {
    it('shows filterCount from Redux when filterCount is defined', () => {
      renderComponent({ count: '3' }, '99');
      expect(screen.getByText('99')).toBeTruthy();
    });

    it('falls back to count prop when filterCount is falsy', () => {
      renderComponent({ count: '7' }, undefined);
      expect(screen.getByText('7')).toBeTruthy();
    });

    it('shows default count "0" when neither filterCount nor count prop is provided', () => {
      renderComponent({}, undefined);
      expect(screen.getByText('0')).toBeTruthy();
    });
  });

  describe('handleClick — Pressable onPress', () => {
    it('dispatches callAction with queryName when pressed and queryName is provided', () => {
      renderComponent({ queryName: 'GET_FILTER_DATA' });
      fireEvent.press(screen.getByTestId('iconWithCountTest'));
      expect(mockCallAction).toHaveBeenCalledWith({}, 'GET_FILTER_DATA');
    });

    it('does NOT dispatch callAction when pressed without queryName', () => {
      renderComponent({});
      fireEvent.press(screen.getByTestId('iconWithCountTest'));
      expect(mockCallAction).not.toHaveBeenCalled();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot with all props', () => {
      const component = renderComponent({
        iconName: 'STORE_DASHBOARD',
        count: '5',
        queryName: 'SOME_QUERY',
        showCount: false,
        externalStyle: { opacity: 0.8 },
      });
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('matches snapshot with showCount true', () => {
      const component = renderComponent({ showCount: true });
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
