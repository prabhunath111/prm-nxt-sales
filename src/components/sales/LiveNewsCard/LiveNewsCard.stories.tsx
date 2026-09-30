import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import LiveNewsCard from './LiveNewsCard';

export default {
  title: 'components/LiveNewsCard',
  component: LiveNewsCard,
} as ComponentMeta<typeof LiveNewsCard>;

export const Basic: ComponentStory<typeof LiveNewsCard> = args => (
  <LiveNewsCard {...args} />
);

Basic.args = {
  link: '/',
  title: 'Home'
};
