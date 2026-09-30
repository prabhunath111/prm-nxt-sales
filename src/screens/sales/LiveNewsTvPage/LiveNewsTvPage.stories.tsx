import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LiveNewsTvPage from './LiveNewsTvPage';

export default {
  title: 'components/LiveNewsTvPage',
  component: LiveNewsTvPage,
} as ComponentMeta<typeof LiveNewsTvPage>;

export const Basic: ComponentStory<typeof LiveNewsTvPage> = (args) => (
  <LiveNewsTvPage {...args} />
);

Basic.args = {
  text: 'Sample Screen',
};