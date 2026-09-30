import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { Colors, Sizing } from 'styles';
import { DROPDOWN } from 'const';
import Autocomplete from './Autocomplete';

export default {
  title: 'components/Autocomplete',
  component: Autocomplete,
} as ComponentMeta<typeof Autocomplete>;

export const Basic: ComponentStory<typeof Autocomplete> = (args) => (
  <Provider store={store}>
    <Autocomplete {...args} />
  </Provider>
);

Basic.args = {
  placeholder: DROPDOWN.SELECT,
  onSelect: () => ({}),
  noOptionsText: 'No Data',
  error: '',
  innerContainerStyle: {
    backgroundColor: Colors.neutral.white,
    padding: Sizing.x2,
    borderRadius: Sizing.x3,
  },
  data: [
    { name: 'Option One', id: 1 },
    { name: 'Option Two', id: 2 },
    { name: 'Option Three', id: 3 },
    { name: 'Option Four', id: 4 },
    { name: 'Option Five', id: 5 },
  ],
};
