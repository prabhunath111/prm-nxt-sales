import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import NavItem from './NavItem';

describe('Test for the component NavItem', () => {
  test('render component NavItem', () => {
    render(
      <MemoryRouter>
        <NavItem link="/" title="Home" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Home')).toBeTruthy();
  });

  test('snapshot tests for NavItem', () => {
    const component = render(
      <MemoryRouter>
        <View>
          <NavItem link="/" title="Home" />
        </View>
      </MemoryRouter>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
