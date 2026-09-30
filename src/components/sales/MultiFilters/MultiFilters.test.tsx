/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import MultiFilters from './MultiFilters';

const mockData: any = {
  languages: {
    title: 'Languages',
    data: [
      { id: 'en', name: 'English' },
      { id: 'hi', name: 'Hindi', secondaryName: 'HindiSec' },
    ],
  },
  genre: {
    title: 'Genre',
    data: [{ id: 'action', name: 'Action' }],
  },
  boxType: {
    title: 'Box Type',
    data: [{ id: 'hd', name: 'HD' }],
  },
};

jest.mock('components/sales/Image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => <View testID={`image-${props.iconName}`} />;
});

describe('MultiFilters', () => {
  const setSelectedLanguages = jest.fn();
  const setSelectedGenre = jest.fn();
  const setSelectedBoxType = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <MultiFilters
        data={mockData}
        selectedLanguages={[]}
        selectedGenre={[]}
        selectedBoxType={[]}
        setSelectedLanguages={setSelectedLanguages}
        setSelectedGenre={setSelectedGenre}
        setSelectedBoxType={setSelectedBoxType}
        {...props}
      />,
    );

  test('renders filter buttons and default active tab', () => {
    renderComponent();
    expect(screen.getByText('Languages')).toBeTruthy();
    expect(screen.getByText('Genre')).toBeTruthy();
    expect(screen.getByText('Box Type')).toBeTruthy();

    // Default tab is languages
    expect(screen.getByText('English')).toBeTruthy();
  });

  test('switches tabs on button press', () => {
    renderComponent();
    fireEvent.press(screen.getByText('Genre'));
    expect(screen.getByText('Action')).toBeTruthy();
    expect(screen.queryByText('English')).toBeNull();
  });

  test('handles item selection and toggles it', () => {
    renderComponent();
    fireEvent.press(screen.getByText('English'));

    // Simulate selection in setter
    const setterCall = setSelectedLanguages.mock.calls[0][0];
    const newState = setterCall([]);
    expect(newState).toEqual([{ id: 'en', name: 'English' }]);

    // Simulate deselection
    const deselection = setterCall([{ id: 'en', name: 'English' }]);
    expect(deselection).toEqual([]);
  });

  test('renders item with secondaryName', () => {
    renderComponent();
    expect(screen.getByText('HindiSec')).toBeTruthy();
  });

  test('shows checkmark when item is selected', () => {
    renderComponent({ selectedLanguages: [{ id: 'en', name: 'English' }] });
    expect(screen.getByTestId('image-icons/checkmark.png')).toBeTruthy();
  });

  test('snapshot tests for MultiFilters', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
