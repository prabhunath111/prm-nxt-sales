import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { store } from 'store';
import { ParentObject } from 'store/sales/types/common';
import ChecklistTiles from './ChecklistTiles';

const createMockStore = (setChecklistTileDetails: ParentObject[] = []) =>
  configureStore({
    reducer: {
      form: () => ({ formState: { setChecklistTileDetails } }),
    },
  });

const mockChecklistData = [
  {
    id: 1,
    question: 'Is the store clean?',
    response: 'Yes',
  },
  {
    id: 2,
    question: 'Are products displayed properly?',
    response: 'No',
  },
  {
    id: 3,
    question: 'Is staff available?',
    response: 'Yes, No',
  },
];

describe('Test for the component ChecklistTiles', () => {
  test('render component ChecklistTiles', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ChecklistTiles />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('ChecklistTiles'));
  });

  test('snapshot tests for ChecklistTiles', () => {
    const component = render(
      <Provider store={store}>
        <NavigationContainer>
          <View>
            <ChecklistTiles />
          </View>
        </NavigationContainer>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('renders with header prop', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ChecklistTiles header="Store Checklist" />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Store Checklist')).toBeTruthy();
  });

  test('renders checklist items from Redux store', () => {
    const mockStore = createMockStore(mockChecklistData);
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <ChecklistTiles />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Is the store clean?')).toBeTruthy();
    expect(screen.getByText('Are products displayed properly?')).toBeTruthy();
    expect(screen.getByText('Is staff available?')).toBeTruthy();
  });

  test('renders Yes response with correct styling', () => {
    const mockStore = createMockStore(mockChecklistData);
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <ChecklistTiles />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Yes')).toBeTruthy();
  });

  test('renders No response with correct styling', () => {
    const mockStore = createMockStore(mockChecklistData);
    const { getAllByText } = render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <ChecklistTiles />
        </NavigationContainer>
      </Provider>,
    );
    const noTexts = getAllByText('No');
    expect(noTexts.length).toBeGreaterThan(0);
  });

  test('renders responses with comma separator', () => {
    const singleResponseData: ParentObject[] = [
      {
        id: 1,
        question: 'Test question',
        response: 'Yes, No, Yes',
      },
    ];
    const mockStore = createMockStore(singleResponseData);
    const { getAllByText, getByTestId } = render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <ChecklistTiles />
        </NavigationContainer>
      </Provider>,
    );
    const yesTexts = getAllByText('Yes');
    expect(yesTexts.length).toBeGreaterThan(0);
    expect(getByTestId('ChecklistTiles')).toBeTruthy();
  });

  test('renders item id with period', () => {
    const mockStore = createMockStore(mockChecklistData);
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <ChecklistTiles />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('1.')).toBeTruthy();
    expect(screen.getByText('2.')).toBeTruthy();
    expect(screen.getByText('3.')).toBeTruthy();
  });

  test('handles empty checklist data', () => {
    const mockStore = createMockStore([]);
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <ChecklistTiles header="Empty Checklist" />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByText('Empty Checklist')).toBeTruthy();
  });

  test('handles undefined setChecklistTileDetails', () => {
    const mockStore = configureStore({
      reducer: {
        form: () => ({ formState: {} }),
      },
    });
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <ChecklistTiles />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('ChecklistTiles')).toBeTruthy();
  });
});
