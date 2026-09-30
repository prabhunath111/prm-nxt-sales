import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { STATE_KEY } from 'const';
import RadioContainer from './RadioContainer';

const mockItems: any = [{ text: 'Item 1', value: 'val1' }, { text: 'Item 2', value: 'val2' }, { label: 'Label 1', text: '' }, { text: 'Text only item' }];

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options: any) => options?.defaultValue || key,
  }),
}));

describe('Test for the component RadioContainer', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        form: (state = { [STATE_KEY.FORM_STATE]: { radioContainerOptions: {} } }) => state,
      },
    });
    jest.clearAllMocks();
  });

  test('render component RadioContainer with items', () => {
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} />
      </Provider>,
    );
    expect(screen.getByTestId('radioContainerTest')).toBeTruthy();
    expect(screen.getByTestId('radio-label-Label 1')).toBeTruthy();
    expect(screen.getByTestId('radio-item-val1')).toBeTruthy();
    expect(screen.getByTestId('radio-item-Text only item')).toBeTruthy();
  });

  test('handle selection change', () => {
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} selectedValue="val1" />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('radio-item-val2'));
    expect(onSelectionChange).toHaveBeenCalledWith('val2');
  });

  test('handle selection with text fallback', () => {
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} selectedValue="Text only item" />
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('radio-item-Text only item'));
    expect(onSelectionChange).toHaveBeenCalledWith('Text only item');
  });

  test('allowDeselect logic', () => {
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} selectedValue="val1" allowDeselect />
      </Provider>,
    );

    // Press the same item again to deselect
    fireEvent.press(screen.getByTestId('radio-item-val1'));
    expect(onSelectionChange).toHaveBeenCalledWith('');
  });

  test('default selection logic in useEffect', () => {
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} defaultSelected="val2" />
      </Provider>,
    );
    expect(onSelectionChange).toHaveBeenCalledWith('val2');
  });

  test('first item selection logic if no default', () => {
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} />
      </Provider>,
    );
    expect(onSelectionChange).toHaveBeenCalledWith('val1');
  });

  test('first item selection logic with text fallback', () => {
    const itemsWithNoValue: any = [{ text: 'No Value Item' }];
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={itemsWithNoValue} onSelectionChange={onSelectionChange} />
      </Provider>,
    );
    expect(onSelectionChange).toHaveBeenCalledWith('No Value Item');
  });

  test('noDefaultSelect prop', () => {
    const onSelectionChange = jest.fn();
    render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} noDefaultSelect />
      </Provider>,
    );
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  test('render empty state', () => {
    render(
      <Provider store={store}>
        <RadioContainer items={[]} onSelectionChange={() => {}} />
      </Provider>,
    );
    expect(screen.getByTestId('radioContainerEmpty')).toBeTruthy();
  });

  test('queryName logic', () => {
    const queryStore = configureStore({
      reducer: {
        form: () => ({
          [STATE_KEY.FORM_STATE]: {
            radioContainerOptions: {
              testQuery: [{ text: 'Query Item', value: 'q1' }],
            },
          },
        }),
      },
    });

    render(
      <Provider store={queryStore}>
        <RadioContainer items={[]} onSelectionChange={() => {}} queryName="testQuery" />
      </Provider>,
    );
    expect(screen.getByTestId('radio-item-q1')).toBeTruthy();
  });

  test('RenderRadio memoization comparison', () => {
    const onSelectionChange = jest.fn();
    const { rerender } = render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} selectedValue="val1" />
      </Provider>,
    );

    // Rerender with same props
    rerender(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} selectedValue="val1" />
      </Provider>,
    );

    // Rerender with different props
    rerender(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={onSelectionChange} selectedValue="val2" />
      </Provider>,
    );
  });

  test('snapshot tests for RadioContainer', () => {
    const component = render(
      <Provider store={store}>
        <RadioContainer items={mockItems} onSelectionChange={() => {}} />
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
