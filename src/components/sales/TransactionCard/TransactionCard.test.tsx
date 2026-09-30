import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { formatValue } from 'utils/responseHelper';
import { VALUE_TYPE } from 'const';
import TransactionCard from './TransactionCard';

jest.mock('utils/responseHelper', () => ({
  formatValue: jest.fn((type, value) => (value ? `${type}:${value}` : '')),
}));

describe('TransactionCard Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TransactionCard without crashing', () => {
    render(<TransactionCard />);
    expect(screen.getByTestId('gradient-test')).toBeTruthy();
  });

  test('renders header text with translation fallback', () => {
    render(<TransactionCard headerText="TestHeader" />);
    // Our mock t() returns the key, and TransactionCard calls t(`strings.${headerText}`)
    expect(screen.getByText('strings.TestHeader')).toBeTruthy();
  });

  test('renders primary and secondary text', () => {
    render(<TransactionCard primaryText="Primary" secondaryText="Secondary" tertiaryText="Tertiary" quaternaryText="Quaternary" type={VALUE_TYPE.TEXT} />);

    expect(screen.getByText('text:Primary')).toBeTruthy();
    expect(screen.getByText('text:Secondary')).toBeTruthy();
    expect(screen.getByText('text:Tertiary')).toBeTruthy();
    expect(screen.getByText('text:Quaternary')).toBeTruthy();
  });

  test('renders with separator when provided', () => {
    render(<TransactionCard headerText="Header" separator=":" />);
    expect(screen.getByText('strings.Header:')).toBeTruthy();
  });

  test('calls formatValue with correct arguments', () => {
    render(<TransactionCard primaryText="100" type={VALUE_TYPE.TEXT} />);
    expect(formatValue).toHaveBeenCalledWith(VALUE_TYPE.TEXT, '100');
  });

  // chevron image is commented out in component, so we remove this test
  // test('renders chevron image', () => { ... });

  test('matches snapshot', () => {
    const component = render(
      <View>
        <TransactionCard headerText="SnapshotHeader" primaryText="10" secondaryText="20" tertiaryText="30" quaternaryText="40" />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('renders gracefully with empty props', () => {
    render(<TransactionCard />);
    expect(screen.getByTestId('gradient-test')).toBeTruthy();
  });

  test('renders with maxFontSize applied', () => {
    render(<TransactionCard primaryText="FontTest" maxFontSize={20} />);
    expect(screen.getByText('text:FontTest')).toBeTruthy();
  });
});
