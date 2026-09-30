import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import salesReducer from 'store/sales/reducer/root.reducer';
import prmReducer from 'store/prm/reducer/root.reducer';
import { STATE_KEY, STYLES, STRINGS } from 'const';
import SlabList from './SlabList';

// Mocking styles to include an UNKNOWN type for testing the default switch case
jest.mock('./SlabList.styles', () => {
  const original = jest.requireActual('./SlabList.styles').default;
  return {
    __esModule: true,
    default: {
      ...original,
      UNKNOWN: {
        container: {},
      },
    },
  };
});

const mockSlabList = [
  {
    label: 'Slab 1',
    subscriberId: 'sub1',
    offer: 'Offer 1',
    parterMargin: '10%',
    statusNT: STRINGS.ACTIVE,
  },
  {
    label: 'Slab 2',
    subscriberId: 'sub2',
    offer: 'Offer 2',
    parterMargin: '20%',
    statusNT: 'INACTIVE',
  },
];

const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: combineReducers({
      ...salesReducer,
      prmReducer,
    }),
    preloadedState: initialState,
  });

describe('Test for the component SlabList', () => {
  const onSelectMock = jest.fn();

  beforeEach(() => {
    onSelectMock.mockClear();
  });

  test('renders empty container when slabList is empty', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: [] },
      },
    } as any);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="" />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('slabList-test-container')).toBeTruthy();
  });

  test('renders PRIMARY type correctly with data', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: mockSlabList },
      },
    } as any);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="Slab 1" type={STYLES.TYPE.PRIMARY} />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Slab 1')).toBeTruthy();
    expect(screen.getByText('Offer 1')).toBeTruthy();
    expect(screen.getByText('10%')).toBeTruthy();
    expect(screen.getByText('Slab 2')).toBeTruthy();
  });

  test('calls onSelect when a slab is pressed in PRIMARY type', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: mockSlabList },
      },
    } as any);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="" type={STYLES.TYPE.PRIMARY} />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('Slab 2'));
    expect(onSelectMock).toHaveBeenCalledWith('Slab 2');
  });

  test('renders SECONDARY type correctly with data', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: mockSlabList },
      },
    } as any);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="Slab 2" type={STYLES.TYPE.SECONDARY} />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Slab 1')).toBeTruthy();
    expect(screen.getByText('Slab 2')).toBeTruthy();
  });

  test('calls onSelect when a radio is pressed in SECONDARY type', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: mockSlabList },
      },
    } as any);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="" type={STYLES.TYPE.SECONDARY} />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('Slab 1'));
    expect(onSelectMock).toHaveBeenCalledWith('Slab 1');
  });

  test('renders with custom stateKey', () => {
    const store = createTestStore({
      form: {
        customKey: { slabList: mockSlabList },
      },
    } as any);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="" stateKey="customKey" />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Slab 1')).toBeTruthy();
  });

  test('renders default branch in Switch (returns null component/View)', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: mockSlabList },
      },
    } as any);

    render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="" type="UNKNOWN" />
        </NavigationContainer>
      </Provider>,
    );
    // Should render but items will be empty Views, so Slab 1 text shouldn't be there
    expect(screen.queryByText('Slab 1')).toBeNull();
  });

  test('snapshot tests for SlabList PRIMARY', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: mockSlabList },
      },
    } as any);
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="Slab 1" />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('verifies keyExtractor', () => {
    const store = createTestStore({
      form: {
        [STATE_KEY.FORM_STATE]: { slabList: mockSlabList },
      },
    } as any);

    // We can't easily test keyExtractor directly without mocking List,
    // but we can at least ensure the component renders without crash with data.
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <SlabList onSelect={onSelectMock} selectedId="Slab 1" />
        </NavigationContainer>
      </Provider>,
    );
    expect(getByTestId('slabList-test-container')).toBeTruthy();
  });
});
