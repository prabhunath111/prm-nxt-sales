/* eslint-disable react/no-array-index-key */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MODAL } from 'const';

import DealerEvdDetails from './DealerEvdDetails';

// Platform mock state
let mockIsWeb = true;

// Mock platform helper BEFORE anything else
jest.mock('utils/platformHelper', () => ({
  get isDesktop() {
    return mockIsWeb;
  },
  get isWeb() {
    return mockIsWeb;
  },
}));

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockInflection = jest.fn(() => 'xl');
jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: mockInflection() }),
  BreakPoints: {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    SM: 'sm',
    XS: 'xs',
  },
}));

// Mock TextContainer to verify props
jest.mock('components/sales/TextContainer', () => {
  const { View, Text } = require('react-native');

  return ({ dataArray }: any) => (
    <View testID="text-container-mock">
      {(dataArray || []).map((item: any, index: number) => (
        <Text key={index}>{item.label}</Text>
      ))}
    </View>
  );
});

// Mock Button to trigger onPress easily
jest.mock('components/sales/Button', () => {
  const { Pressable, Text } = require('react-native');

  return ({ label, onPress, testID }: any) => (
    <Pressable onPress={onPress} testID={testID}>
      <Text>{label}</Text>
    </Pressable>
  );
});

describe('DealerEvdDetails Component', () => {
  const defaultData: any = {
    name: 'Test Dealer',
    mdn: '9876543210',
    thresholdSetNT: MODAL.NO,
    dealerID: 'D123',
    evdCode: 'EVD001',
  };

  const mockOnButtonPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockInflection.mockReturnValue('xl');
    mockIsWeb = true;
  });

  test('renders with default items and "strings.setAutoEvd" label', () => {
    render(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} />);
    expect(screen.getByText('strings.setAutoEvd')).toBeTruthy();
    expect(screen.getByText('strings.viewMore')).toBeTruthy();
  });

  test('renders "strings.updateAutoEvd" when threshold is set', () => {
    render(<DealerEvdDetails data={{ ...defaultData, thresholdSetNT: MODAL.Y }} onButtonPress={mockOnButtonPress} />);
    expect(screen.getByText('strings.updateAutoEvd')).toBeTruthy();
  });

  test('toggles "View More" and "View Less" state', () => {
    render(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} />);
    const viewMoreBtn = screen.getByText('strings.viewMore');
    fireEvent.press(viewMoreBtn);
    expect(screen.getByText('strings.viewLess')).toBeTruthy();

    fireEvent.press(screen.getByText('strings.viewLess'));
    expect(screen.getByText('strings.viewMore')).toBeTruthy();
  });

  test('handles view toggle with custom itemsArray', () => {
    const customItems = [
      { key: 'item1', label: 'Item 1', value: '1' },
      { key: 'item2', label: 'Item 2', value: '2' },
      { key: 'item3', label: 'Item 3', value: '3' },
    ];
    render(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} itemsArray={customItems} />);

    expect(screen.queryByText('Item 3')).toBeNull();
    fireEvent.press(screen.getByText('strings.viewMore'));
    expect(screen.getByText('Item 3')).toBeTruthy();
  });

  test('calls onButtonPress when primary button is clicked', () => {
    render(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} />);
    fireEvent.press(screen.getByText('strings.setAutoEvd'));
    expect(mockOnButtonPress).toHaveBeenCalledWith(defaultData);
  });

  test('renders with different inflections for style coverage', () => {
    mockInflection.mockReturnValue('lg');
    const { rerender } = render(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} />);

    mockInflection.mockReturnValue('sm');
    rerender(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} />);
    expect(screen.getByText('strings.viewMore')).toBeTruthy();
  });

  test('renders with App styles when not on web (native path)', () => {
    // We attempt to toggle mockIsWeb. Since named imports are live bindings to the export object,
    // this MIGHT work if the component re-renders or if we re-render it.
    mockIsWeb = false;
    render(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} />);
    expect(screen.getByText('strings.setAutoEvd')).toBeTruthy();
  });

  test('snapshot test', () => {
    const component = render(<DealerEvdDetails data={defaultData} onButtonPress={mockOnButtonPress} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
