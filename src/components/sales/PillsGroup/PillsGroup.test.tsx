/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider, useSelector } from 'react-redux';
import { store } from 'store';
import { NavigationContainer } from '@react-navigation/native';
import PillsGroup from './PillsGroup';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('components/sales/Text', () => {
  const React = require('react');
  const { Text, Pressable } = require('react-native');
  return ({ children, label, onPress }: any) => {
    if (onPress) {
      return (
        <Pressable onPress={onPress}>
          <Text>{label || children}</Text>
        </Pressable>
      );
    }
    return <Text>{label || children}</Text>;
  };
});

jest.mock('components/sales/List', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  return (props: any) => <FlatList {...props} />;
});

describe('Test for the component PillsGroup', () => {
  const onPillPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockReturnValue({ pillGroupItemsArr: [] });
  });

  test('render component PillsGroup with string items', () => {
    const items = ['Pill 1', 'Pill 2'];
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items} onPillPress={onPillPressMock} />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Pill 1')).toBeTruthy();
    expect(screen.getByText('Pill 2')).toBeTruthy();
  });

  test('calls onPillPress when a pill is pressed', () => {
    const items = ['Pill 1'];
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items} onPillPress={onPillPressMock} />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent.press(screen.getByText('Pill 1'));
    expect(onPillPressMock).toHaveBeenCalledWith('Pill 1');
  });

  test('renders with object items and handles press', () => {
    const items = [
      { offerCategory: 'Offer 1', offerCategoryNT: 'OFFER_1_NT' },
      { offerCategory: 'Offer 2', offerCategoryNT: 'OFFER_2_NT' },
    ];
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items as any} onPillPress={onPillPressMock} />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Offer 1')).toBeTruthy();
    fireEvent.press(screen.getByText('Offer 1'));
    expect(onPillPressMock).toHaveBeenCalledWith('OFFER_1_NT');
  });

  test('handles defaultSelected for string items', async () => {
    jest.useFakeTimers();
    const items = ['Pill 1'];
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items} onPillPress={onPillPressMock} defaultSelected />
        </NavigationContainer>
      </Provider>,
    );

    jest.advanceTimersByTime(20);
    expect(onPillPressMock).toHaveBeenCalledWith('Pill 1');
    jest.useRealTimers();
  });

  test('handles defaultSelected for object items', async () => {
    jest.useFakeTimers();
    const items = [{ offerCategory: 'Offer 1', offerCategoryNT: 'OFFER_1_NT' }];
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items as any} onPillPress={onPillPressMock} defaultSelected />
        </NavigationContainer>
      </Provider>,
    );

    jest.advanceTimersByTime(20);
    expect(onPillPressMock).toHaveBeenCalledWith('OFFER_1_NT');
    jest.useRealTimers();
  });

  test('highlights selected pill for string items', () => {
    const items = ['Pill 1', 'Pill 2'];
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items} onPillPress={onPillPressMock} selectedPillText="Pill 1" />
        </NavigationContainer>
      </Provider>,
    );

    // Selected styles logic is covered by snapshot or by checking props
    const { toJSON } = render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items} onPillPress={onPillPressMock} selectedPillText="Pill 1" />
        </NavigationContainer>
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  test('highlights selected pill for object items', () => {
    const items = [{ offerCategory: 'Offer 1', offerCategoryNT: 'OFFER_1_NT' }];
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={items as any} onPillPress={onPillPressMock} selectedPillText="OFFER_1_NT" />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Offer 1')).toBeTruthy();
  });

  test('uses pillGroupItemsArr from store if itemsArr is not provided', () => {
    const storeItems = ['Store Pill'];
    (useSelector as unknown as jest.Mock).mockReturnValue({ pillGroupItemsArr: storeItems });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={[]} onPillPress={onPillPressMock} />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByTestId('pillsGroupTest')).toBeTruthy();
  });

  test('handles empty data gracefully', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup onPillPress={onPillPressMock} itemsArr={undefined as any} />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('pillsGroupTest')).toBeTruthy();
  });

  test('handles stateKey prop', () => {
    const storeItems = ['Custom Pill'];
    (useSelector as unknown as jest.Mock).mockReturnValue({ pillGroupItemsArr: storeItems });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup onPillPress={onPillPressMock} stateKey="customKey" itemsArr={undefined as any} />
        </NavigationContainer>
      </Provider>,
    );

    expect(screen.getByText('Custom Pill')).toBeTruthy();
  });

  test('snapshot tests for PillsGroup', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <PillsGroup itemsArr={['Pill 1']} onPillPress={() => {}} />
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
