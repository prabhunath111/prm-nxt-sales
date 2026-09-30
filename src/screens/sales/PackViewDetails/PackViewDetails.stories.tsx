import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import PackViewDetails from './PackViewDetails';

export default {
  title: 'components/PackViewDetails',
  component: PackViewDetails,
} as ComponentMeta<typeof PackViewDetails>;

export const Basic: ComponentStory<typeof PackViewDetails> = (args) => (
  <Provider store={store}>
    <PackViewDetails {...args} />
  </Provider>
);

Basic.args = {
  isPublic: false,
};
