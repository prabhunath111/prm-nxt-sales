import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import Search from './Search';

export default {
  title: 'components/Search',
  component: Search,
} as ComponentMeta<typeof Search>;

export const Basic: ComponentStory<typeof Search> = (args) => (
  <Provider store={store}>
    <Search {...args} />
  </Provider>
);

Basic.args = {
  placeholder: 'Search here',
};
