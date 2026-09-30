/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch } from 'react-redux';
import { callAction } from 'utils/formBuilderHelper';
import useParams from 'hooks/useParams';
import { QUERY } from 'const';
import MaterialsSummary from './MaterialsSummary';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(),
}));

jest.mock('hooks/useParams', () => jest.fn());

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'sm' }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn(() => 'partnerScreen'),
}));

jest.mock('components/sales', () => {
  const { Text, TouchableOpacity, FlatList } = require('react-native');
  return {
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="submit-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    List: ({ data, renderItem, testID }: any) => (
      <FlatList data={data} renderItem={renderItem} testID={testID} keyExtractor={(_: any, index: { toString: () => any }) => index.toString()} />
    ),
  };
});

describe('MaterialsSummary Component', () => {
  const mockDispatch = jest.fn();
  const mockSelectedMaterial = [
    { productName: 'Product 1', totalCount: 10 },
    { productName: 'Product 2', totalCount: 20 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useParams as jest.Mock).mockReturnValue({ selectedMaterial: mockSelectedMaterial });
  });

  it('renders MaterialsSummary with material list', () => {
    render(<MaterialsSummary />);
    expect(screen.getByText('Product 1')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('Product 2')).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy();
    expect(screen.getByText('strings.items')).toBeTruthy();
    expect(screen.getByText('strings.quantity')).toBeTruthy();
  });

  it('handles submitRequest when button is pressed', () => {
    render(<MaterialsSummary />);
    fireEvent.press(screen.getByTestId('submit-button'));
    expect(callAction).toHaveBeenCalledWith({ selectedMaterial: mockSelectedMaterial }, QUERY.DoRaiseReqRCVTSKPOSMWeb);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const tree = render(<MaterialsSummary />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
