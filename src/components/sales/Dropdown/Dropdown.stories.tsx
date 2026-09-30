import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import Dropdown from './Dropdown';

export default {
  title: 'components/Dropdown',
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

export const Basic: ComponentStory<typeof Dropdown> = (args) => (
  <Provider store={store}>
    <Dropdown {...args} />
  </Provider>
);

Basic.args = {
  data: [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3' },
    { label: 'Four', value: '4' },
    { label: 'Five', value: '5' },
  ],
  onSelect: () => {},
};
