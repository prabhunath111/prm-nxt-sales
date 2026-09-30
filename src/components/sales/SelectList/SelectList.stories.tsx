import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import SelectList from './SelectList';

export default {
  title: 'components/SelectList',
  component: SelectList,
} as ComponentMeta<typeof SelectList>;

export const Basic: ComponentStory<typeof SelectList> = (args) => (
  <Provider store={store}>
    <SelectList {...args} />
  </Provider>
);

Basic.args = {
  onSelect: () => {},
  headingText: 'Select Tsk for Refund',
};
