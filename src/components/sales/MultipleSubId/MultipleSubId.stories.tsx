import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import MultipleSubId from './MultipleSubId';

export default {
  title: 'components/MultipleSubId',
  component: MultipleSubId,
} as ComponentMeta<typeof MultipleSubId>;

export const Basic: ComponentStory<typeof MultipleSubId> = (args) => (
  <Provider store={store}>
    <MultipleSubId {...args} />
  </Provider>
);

Basic.args = {
  selectedId: '',
  onSelect: () => {},
};
